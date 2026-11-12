/**
 * The atlas query layer: what exists, and what may be drawn, in a given year.
 * These tests use the REAL dataset, so they also pin down the behaviour of the
 * four demonstration years from the brief (550 BCE, 330 BCE, 117 CE, 651 CE).
 */
import { describe, expect, it } from "vitest";
import { entities, events, places, territories } from "@/data";
import {
  BATTLEFIELD_SPAN,
  distanceToEvent,
  entitiesActiveIn,
  eventsNear,
  filterEvents,
  isEntityActive,
  periodsAt,
  placesVisibleIn,
  resolveTerritory,
  sortEvents,
  territoriesAt,
} from "@/lib/atlas";
import { fromEra } from "@/lib/dates";

const ids = (list: { id: string }[]) => list.map((item) => item.id).sort();
const bce = (n: number) => fromEra(n, "BCE");
const ce = (n: number) => fromEra(n, "CE");

describe("entity date ranges", () => {
  it("includes both the first and the last year (inclusive range)", () => {
    const achaemenid = entities.find((e) => e.id === "achaemenid-empire")!;
    expect(isEntityActive(achaemenid, bce(551))).toBe(false);
    expect(isEntityActive(achaemenid, bce(550))).toBe(true);
    expect(isEntityActive(achaemenid, bce(330))).toBe(true);
    expect(isEntityActive(achaemenid, bce(329))).toBe(false);
  });

  it("handles a range that crosses from BCE to CE", () => {
    const han = entities.find((e) => e.id === "han-dynasty")!;
    expect(isEntityActive(han, bce(207))).toBe(false);
    expect(isEntityActive(han, bce(206))).toBe(true);
    expect(isEntityActive(han, bce(1))).toBe(true); // internal year 0
    expect(isEntityActive(han, ce(1))).toBe(true);
    expect(isEntityActive(han, ce(220))).toBe(true);
    expect(isEntityActive(han, ce(221))).toBe(false);
  });
});

describe("which entities exist in the milestone years", () => {
  it("550 BCE: Egypt and the newly founded Achaemenid Empire", () => {
    expect(ids(entitiesActiveIn(bce(550), entities))).toEqual(["achaemenid-empire", "ancient-egypt"]);
  });

  it("330 BCE: Egypt, the Achaemenids in their last year, and Macedon", () => {
    expect(ids(entitiesActiveIn(bce(330), entities))).toEqual(["achaemenid-empire", "ancient-egypt", "macedon-hellenistic"]);
  });

  it("117 CE: Han and Rome", () => {
    expect(ids(entitiesActiveIn(ce(117), entities))).toEqual(["han-dynasty", "roman-empire"]);
  });

  it("651 CE: Rome (eastern) and the Sasanians in their last year", () => {
    expect(ids(entitiesActiveIn(ce(651), entities))).toEqual(["roman-empire", "sasanian-empire"]);
    expect(ids(entitiesActiveIn(ce(652), entities))).toEqual(["roman-empire"]);
  });

  it("returns nothing before the collection begins", () => {
    expect(entitiesActiveIn(bce(3500), entities)).toEqual([]);
  });
});

describe("periods", () => {
  const rome = entities.find((e) => e.id === "roman-empire")!;
  const han = entities.find((e) => e.id === "han-dynasty")!;

  it("reports one period before the Roman division and two after it", () => {
    expect(periodsAt(rome, ce(117)).map((p) => p.id)).toEqual(["principate"]);
    expect(periodsAt(rome, ce(450)).map((p) => p.id).sort()).toEqual(["eastern-empire", "western-empire"]);
    expect(periodsAt(rome, ce(651)).map((p) => p.id)).toEqual(["eastern-empire"]);
  });

  it("knows the Xin interregnum inside the Han span", () => {
    expect(periodsAt(han, ce(15)).map((p) => p.id)).toEqual(["xin"]);
    expect(periodsAt(han, ce(24))).toEqual([]); // civil war between Wang Mang's death and the restoration
  });
});

describe("map outlines follow the selected year", () => {
  const shownFor = (entityId: string, year: number) => resolveTerritory(entityId, year, territories).shown.map((t) => t.id);

  it("changes when the year changes", () => {
    expect(ids(territoriesAt(bce(500), territories))).not.toEqual(ids(territoriesAt(ce(117), territories)));
    expect(ids(territoriesAt(ce(117), territories))).toEqual(["han-100", "rome-200"]);
  });

  it("550 BCE: no Achaemenid outline yet — only a nearest reference", () => {
    const resolution = resolveTerritory("achaemenid-empire", bce(550), territories);
    expect(resolution.shown).toEqual([]);
    expect(resolution.nearest?.id).toBe("achaemenid-bc500");
    expect(resolution.nearestYear).toBe(bce(520));
    // …while Egypt does have one
    expect(shownFor("ancient-egypt", bce(550))).toEqual(["egypt-bc700"]);
  });

  it("500 BCE: the Achaemenid outline under Darius", () => {
    expect(shownFor("achaemenid-empire", bce(500))).toEqual(["achaemenid-bc500"]);
  });

  it("330 BCE: neither the collapsing Achaemenid realm nor Alexander's unfinished conquest is outlined", () => {
    expect(shownFor("achaemenid-empire", bce(330))).toEqual([]);
    expect(shownFor("macedon-hellenistic", bce(330))).toEqual([]);
    expect(resolveTerritory("macedon-hellenistic", bce(330), territories).nearest?.id).toBe("alexander-bc323");
  });

  it("323 BCE: the empire of Alexander", () => {
    expect(shownFor("macedon-hellenistic", bce(323))).toEqual(["alexander-bc323"]);
  });

  it("651 CE: the Eastern Roman outline, but none for the collapsing Sasanian Empire", () => {
    expect(shownFor("roman-empire", ce(651))).toEqual(["rome-east-700"]);
    const sasanian = resolveTerritory("sasanian-empire", ce(651), territories);
    expect(sasanian.shown).toEqual([]);
    expect(sasanian.nearest?.id).toBe("sasanian-600");
  });

  it("shows several outlines for the rival Hellenistic kingdoms", () => {
    expect(shownFor("macedon-hellenistic", bce(220)).sort()).toEqual(["antigonid-bc200", "ptolemaic-bc200", "seleucid-bc200"]);
  });

  it("shares the Ptolemaic outline with Ancient Egypt", () => {
    expect(shownFor("ancient-egypt", bce(250))).toEqual(["ptolemaic-bc200"]);
    // …but never offers another entity's outline as Egypt's own "nearest" reference
    const nearest = resolveTerritory("ancient-egypt", bce(400), territories).nearest;
    expect(nearest?.entityIds[0]).toBe("ancient-egypt");
  });

  it("draws no Han outline during the Xin interregnum", () => {
    expect(shownFor("han-dynasty", ce(15))).toEqual([]);
    expect(shownFor("han-dynasty", ce(30))).toEqual(["han-100"]);
  });

  it("distinguishes West and East after 395 CE and drops the West after 409", () => {
    expect(shownFor("roman-empire", ce(400)).sort()).toEqual(["rome-east-400", "rome-west-400"]);
    expect(shownFor("roman-empire", ce(450))).toEqual(["rome-east-400"]);
  });

  it("never returns an outline outside its validity window", () => {
    for (const year of [bce(3000), bce(700), bce(480), bce(1), ce(1), ce(300), ce(700)]) {
      for (const territory of territoriesAt(year, territories)) {
        expect(year).toBeGreaterThanOrEqual(territory.validFrom);
        expect(year).toBeLessThanOrEqual(territory.validTo);
      }
    }
  });
});

describe("events", () => {
  it("sorts across the BCE/CE boundary", () => {
    const sorted = sortEvents([...events].reverse());
    const years = sorted.map((e) => e.start.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(sorted[0].id).toBe("unification-of-egypt");
    expect(sorted.at(-1)?.id).toBe("death-of-yazdegerd-iii");
    // Actium (31 BCE) comes before the division of the empire (395 CE)
    expect(sorted.findIndex((e) => e.id === "battle-of-actium")).toBeLessThan(sorted.findIndex((e) => e.id === "division-of-the-roman-empire"));
  });

  it("measures distance to single-year and multi-year events", () => {
    const zhang = events.find((e) => e.id === "mission-of-zhang-qian")!; // 138–c.125 BCE
    expect(distanceToEvent(zhang, bce(140))).toBe(2);
    expect(distanceToEvent(zhang, bce(130))).toBe(0);
    expect(distanceToEvent(zhang, bce(120))).toBe(5);
  });

  it("lists events near a year, nearest first", () => {
    const near = eventsNear(bce(330), 10, events).map((e) => e.id);
    expect(near).toEqual(["fall-of-the-achaemenids", "battle-of-gaugamela", "death-of-alexander"]);
    expect(eventsNear(bce(2000), 10, events)).toEqual([]);
  });

  it("filters by region, category and entity, alone and combined", () => {
    expect(filterEvents(events, {})).toHaveLength(events.length);
    expect(filterEvents(events, { category: "battle" }).every((e) => e.category === "battle")).toBe(true);
    expect(filterEvents(events, { region: "east-asia" }).map((e) => e.id).sort()).toEqual(
      ["end-of-the-han", "founding-of-the-han", "wang-mang-usurpation"].sort(),
    );
    expect(filterEvents(events, { entityId: "sasanian-empire", category: "battle" }).map((e) => e.id)).toEqual([
      "battle-of-hormozdgan",
      "battle-of-edessa",
      "battle-of-al-qadisiyyah",
    ]);
    expect(filterEvents(events, { region: "east-asia", category: "battle" })).toEqual([]);
  });
});

describe("place markers", () => {
  const visible = (year: number) => placesVisibleIn(year, places, entities, events).map((p) => p.id);

  it("shows only places of entities that exist", () => {
    expect(visible(ce(117))).toEqual(expect.arrayContaining(["rome", "changan", "luoyang"]));
    expect(visible(ce(117))).not.toContain("persepolis");
    expect(visible(bce(3500))).toEqual([]);
  });

  it("does not show a city before it was founded", () => {
    expect(visible(ce(117))).not.toContain("constantinople");
    expect(visible(ce(330))).toContain("constantinople");
    expect(visible(bce(550))).not.toContain("persepolis");
    expect(visible(bce(500))).toContain("persepolis");
    expect(visible(bce(2000))).not.toContain("alexandria");
  });

  it("shows a battlefield only around its battle", () => {
    expect(visible(bce(331))).toContain("gaugamela");
    expect(visible(bce(331 - BATTLEFIELD_SPAN))).toContain("gaugamela");
    expect(visible(bce(500))).not.toContain("gaugamela");
    expect(visible(ce(260))).toContain("edessa");
    expect(visible(ce(400))).not.toContain("edessa");
  });
});
