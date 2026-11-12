import { describe, expect, it } from "vitest";
import { entities, events, getEntity, people, places } from "@/data";
import { buildSearchIndex, groupResults, normalize, search } from "@/lib/search";

const index = buildSearchIndex({
  entities,
  people,
  events,
  places,
  placeHref: (place) => `/atlas?p=${place.id}`,
  entityName: (id) => getEntity(id)?.name,
});

const top = (query: string) => search(index, query)[0]?.item;
const resultIds = (query: string) => search(index, query).map((r) => `${r.item.type}:${r.item.id}`);

describe("normalize", () => {
  it("lower-cases and strips Latin accents and transliteration marks", () => {
    expect(normalize("Šāpur I")).toBe("sapur i");
    expect(normalize("ʿARAB")).toBe("arab");
    expect(normalize("  Chang'an ")).toBe("chang an");
  });

  it("treats Arabic and Persian letter variants as the same", () => {
    expect(normalize("كوروش")).toBe(normalize("کوروش")); // Arabic kaf vs Persian kaf
    expect(normalize("ساساني")).toBe(normalize("ساسانی")); // Arabic yeh vs Persian yeh
    expect(normalize("آشور")).toBe(normalize("اشور"));
  });

  it("ignores the half-space (ZWNJ), vowel marks and Persian digits", () => {
    expect(normalize("میان‌رودان")).toBe("میان رودان");
    expect(normalize("تِبس")).toBe("تبس");
    expect(normalize("۵۵۰")).toBe("550");
  });
});

describe("search in English", () => {
  it("finds entities, people, events and places", () => {
    expect(top("achaemenid")).toMatchObject({ type: "entity", id: "achaemenid-empire" });
    expect(top("ashoka")).toMatchObject({ type: "person", id: "ashoka" });
    expect(top("gaugamela")?.id).toMatch(/gaugamela/);
    expect(top("ctesiphon")).toMatchObject({ type: "place", id: "ctesiphon" });
  });

  it("is case-insensitive and matches word prefixes", () => {
    expect(top("CYRUS")).toMatchObject({ type: "person", id: "cyrus-ii" });
    expect(resultIds("sasan")).toContain("entity:sasanian-empire");
  });

  it("matches alternative names", () => {
    expect(top("Cheops")).toMatchObject({ type: "person", id: "khufu" });
    expect(top("Byzantine Empire")).toMatchObject({ type: "entity", id: "roman-empire" });
    expect(top("Xi'an")).toMatchObject({ type: "place", id: "changan" });
    expect(top("sassanid")).toMatchObject({ type: "entity", id: "sasanian-empire" });
  });

  it("requires every word of the query to match", () => {
    expect(resultIds("battle edessa")).toContain("event:battle-of-edessa");
    expect(resultIds("battle edessa")).not.toContain("event:battle-of-actium");
    expect(search(index, "cyrus zzzz")).toEqual([]);
  });

  it("returns links that open the right page", () => {
    expect(top("han dynasty")?.href).toBe("/entities/han-dynasty");
    expect(top("trajan")?.href).toBe("/people/trajan");
    expect(top("kalinga war")?.href).toBe("/events/kalinga-war");
    expect(top("merv")?.href).toBe("/atlas?p=merv");
  });
});

describe("search in Persian", () => {
  it("finds records by Persian name", () => {
    expect(top("هخامنشی")).toMatchObject({ type: "entity", id: "achaemenid-empire" });
    expect(top("کوروش")).toMatchObject({ type: "person", id: "cyrus-ii" });
    expect(top("تخت جمشید")?.id).toMatch(/persepolis/);
    expect(resultIds("ساسانی")).toContain("entity:sasanian-empire");
  });

  it("accepts Arabic keyboard variants and missing half-spaces", () => {
    expect(top("كوروش")).toMatchObject({ type: "person", id: "cyrus-ii" });
    expect(resultIds("ساساني")).toContain("entity:sasanian-empire");
    expect(top("میان رودان")).toBeDefined();
  });

  it("matches Persian alternative names", () => {
    expect(top("انوشیروان")).toMatchObject({ type: "person", id: "khosrow-i" });
    expect(top("اسکندر بزرگ")).toMatchObject({ type: "person", id: "alexander-iii" });
    expect(top("مدائن")).toMatchObject({ type: "place", id: "ctesiphon" });
  });
});

describe("empty and edge cases", () => {
  it("returns nothing for short, blank or unknown queries", () => {
    expect(search(index, "")).toEqual([]);
    expect(search(index, " ")).toEqual([]);
    expect(search(index, "a")).toEqual([]);
    expect(search(index, "atlantis")).toEqual([]);
    expect(search(index, "!!!")).toEqual([]);
  });

  it("respects the result limit", () => {
    expect(search(index, "of", 5).length).toBeLessThanOrEqual(5);
  });

  it("groups results by type and leads with the group holding the best match", () => {
    const results = search(index, "cyrus");
    const groups = groupResults(results);
    expect(groups[0].type).toBe("person");
    expect(groups[0].results[0].item.id).toBe("cyrus-ii");
    // groups are ordered by their best score, and nothing is lost or duplicated
    const best = groups.map((group) => group.results[0].score);
    expect(best).toEqual([...best].sort((a, b) => b - a));
    expect(groups.flatMap((group) => group.results)).toHaveLength(results.length);
    expect(new Set(groups.map((group) => group.type)).size).toBe(groups.length);
  });
});
