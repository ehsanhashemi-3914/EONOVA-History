/**
 * Data integrity — the content is treated like code and tested like code.
 *
 * These tests do not check that history is "true" (no test can); they check
 * that every record is well-formed, fully translated, dated consistently and
 * that every cross-reference points at something that exists.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  entities,
  events,
  getEntity,
  getEvent,
  getPerson,
  getPlace,
  getSource,
  people,
  places,
  quizQuestions,
  sources,
  territories,
} from "@/data";
import {
  entitySchema,
  eventSchema,
  personSchema,
  placeSchema,
  quizQuestionSchema,
  sourceSchema,
  territoryPropertiesSchema,
} from "@/data/schema";
import { ATLAS_MAX_YEAR, ATLAS_MIN_YEAR } from "@/lib/dates";

function expectUnique(values: string[], what: string) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  expect(duplicates, `duplicate ${what}`).toEqual([]);
}

describe("schemas", () => {
  it.each(sources.map((s) => [s.id, s] as const))("source %s is valid", (_id, record) => {
    expect(() => sourceSchema.parse(record)).not.toThrow();
  });
  it.each(entities.map((e) => [e.id, e] as const))("entity %s is valid", (_id, record) => {
    expect(() => entitySchema.parse(record)).not.toThrow();
  });
  it.each(events.map((e) => [e.id, e] as const))("event %s is valid", (_id, record) => {
    expect(() => eventSchema.parse(record)).not.toThrow();
  });
  it.each(people.map((p) => [p.id, p] as const))("person %s is valid", (_id, record) => {
    expect(() => personSchema.parse(record)).not.toThrow();
  });
  it.each(places.map((p) => [p.id, p] as const))("place %s is valid", (_id, record) => {
    expect(() => placeSchema.parse(record)).not.toThrow();
  });
  it.each(quizQuestions.map((q) => [q.id, q] as const))("quiz question %s is valid", (_id, record) => {
    expect(() => quizQuestionSchema.parse(record)).not.toThrow();
  });
  it.each(territories.map((t) => [t.id, t] as const))("territory %s is valid", (_id, record) => {
    expect(() => territoryPropertiesSchema.parse(record)).not.toThrow();
  });
});

describe("content targets of the first release", () => {
  it("meets the minimum collection sizes", () => {
    expect(entities.length).toBeGreaterThanOrEqual(8);
    expect(events.length).toBeGreaterThanOrEqual(16);
    expect(people.length).toBeGreaterThanOrEqual(12);
    expect(places.length).toBeGreaterThanOrEqual(8);
    expect(quizQuestions.length).toBeGreaterThanOrEqual(12);
  });

  it("includes the eight required subjects", () => {
    expect(entities.map((e) => e.id).sort()).toEqual(
      [
        "achaemenid-empire",
        "ancient-egypt",
        "han-dynasty",
        "macedon-hellenistic",
        "maurya-empire",
        "neo-assyrian-empire",
        "roman-empire",
        "sasanian-empire",
      ].sort(),
    );
  });

  it("classifies entity kinds as the brief requires", () => {
    expect(getEntity("ancient-egypt")?.kind).toBe("civilization");
    expect(getEntity("achaemenid-empire")?.kind).toBe("empire");
    expect(getEntity("han-dynasty")?.kind).toBe("dynasty");
    expect(getEntity("roman-empire")?.kind).toBe("empire");
  });

  it("does not end the Roman Empire in 476 CE", () => {
    const rome = getEntity("roman-empire")!;
    expect(rome.end.year).toBeGreaterThan(476);
    const west = rome.periods.find((p) => p.id === "western-empire")!;
    const east = rome.periods.find((p) => p.id === "eastern-empire")!;
    expect(west.end.year).toBe(476);
    expect(east.end.year).toBe(1453);
  });
});

describe("identifiers", () => {
  it("are unique within each collection", () => {
    expectUnique(sources.map((s) => s.id), "source id");
    expectUnique(entities.map((e) => e.id), "entity id");
    expectUnique(entities.map((e) => e.slug), "entity slug");
    expectUnique(events.map((e) => e.id), "event id");
    expectUnique(events.map((e) => e.slug), "event slug");
    expectUnique(people.map((p) => p.id), "person id");
    expectUnique(people.map((p) => p.slug), "person slug");
    expectUnique(places.map((p) => p.id), "place id");
    expectUnique(quizQuestions.map((q) => q.id), "quiz id");
    expectUnique(territories.map((t) => t.id), "territory id");
  });
});

describe("cross-references resolve", () => {
  const missingSources = (ids: string[]) => ids.filter((id) => !getSource(id));

  it("every cited source exists", () => {
    const problems: string[] = [];
    const check = (owner: string, ids: string[]) =>
      missingSources(ids).forEach((id) => problems.push(`${owner} → ${id}`));
    entities.forEach((e) => check(`entity ${e.id}`, e.sourceIds));
    events.forEach((e) => check(`event ${e.id}`, e.sourceIds));
    people.forEach((p) => check(`person ${p.id}`, p.sourceIds));
    places.forEach((p) => check(`place ${p.id}`, p.sourceIds));
    quizQuestions.forEach((q) => check(`quiz ${q.id}`, q.sourceIds));
    territories.forEach((t) => check(`territory ${t.id}`, t.sourceIds));
    expect(problems).toEqual([]);
  });

  it("entities point at existing places and entities", () => {
    const problems: string[] = [];
    for (const entity of entities) {
      entity.capitals.forEach((c) => !getPlace(c.placeId) && problems.push(`${entity.id} capital ${c.placeId}`));
      entity.relations.forEach((r) => !getEntity(r.entityId) && problems.push(`${entity.id} relation ${r.entityId}`));
      entity.relations.forEach((r) => r.entityId === entity.id && problems.push(`${entity.id} relates to itself`));
    }
    expect(problems).toEqual([]);
  });

  it("events point at existing entities, people and places", () => {
    const problems: string[] = [];
    for (const event of events) {
      event.entityIds.forEach((id) => !getEntity(id) && problems.push(`${event.id} entity ${id}`));
      event.personIds.forEach((id) => !getPerson(id) && problems.push(`${event.id} person ${id}`));
      if (event.placeId && !getPlace(event.placeId)) problems.push(`${event.id} place ${event.placeId}`);
    }
    expect(problems).toEqual([]);
  });

  it("people point at existing entities and places", () => {
    const problems: string[] = [];
    for (const person of people) {
      if (!getEntity(person.entityId)) problems.push(`${person.id} entity ${person.entityId}`);
      person.placeIds.forEach((id) => !getPlace(id) && problems.push(`${person.id} place ${id}`));
    }
    expect(problems).toEqual([]);
  });

  it("places and territories point at existing entities", () => {
    const problems: string[] = [];
    places.forEach((p) => p.entityIds.forEach((id) => !getEntity(id) && problems.push(`place ${p.id} → ${id}`)));
    territories.forEach((t) => t.entityIds.forEach((id) => !getEntity(id) && problems.push(`territory ${t.id} → ${id}`)));
    expect(problems).toEqual([]);
  });

  it("quiz questions point at existing records", () => {
    const lookup = { entity: getEntity, event: getEvent, person: getPerson };
    const problems = quizQuestions
      .filter((q) => !lookup[q.related.type](q.related.id))
      .map((q) => `${q.id} → ${q.related.type}:${q.related.id}`);
    expect(problems).toEqual([]);
  });

  it("every source is cited at least once", () => {
    const cited = new Set<string>([
      ...entities.flatMap((e) => e.sourceIds),
      ...events.flatMap((e) => e.sourceIds),
      ...people.flatMap((p) => p.sourceIds),
      ...places.flatMap((p) => p.sourceIds),
      ...quizQuestions.flatMap((q) => q.sourceIds),
      ...territories.flatMap((t) => t.sourceIds),
    ]);
    // The two basemap datasets are cited by the map itself, not by a record.
    const exempt = new Set(["ds-natural-earth", "ds-openfreemap"]);
    expect(sources.filter((s) => !cited.has(s.id) && !exempt.has(s.id)).map((s) => s.id)).toEqual([]);
  });
});

describe("chronological consistency", () => {
  it("entities and their periods start before they end", () => {
    const problems: string[] = [];
    for (const entity of entities) {
      if (entity.start.year > entity.end.year) problems.push(entity.id);
      for (const period of entity.periods) {
        if (period.start.year > period.end.year) problems.push(`${entity.id}/${period.id}`);
        if (period.start.year < entity.start.year || period.end.year > entity.end.year) {
          problems.push(`${entity.id}/${period.id} lies outside the entity's lifespan`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("events happen while at least one of their entities exists", () => {
    const problems = events
      .filter((event) => !event.entityIds.some((id) => {
        const entity = getEntity(id)!;
        return event.start.year >= entity.start.year && event.start.year <= entity.end.year;
      }))
      .map((event) => event.id);
    expect(problems).toEqual([]);
  });

  it("multi-year events end after they start", () => {
    expect(events.filter((e) => e.end && e.end.year < e.start.year).map((e) => e.id)).toEqual([]);
  });

  it("people's dates are internally consistent", () => {
    const problems: string[] = [];
    for (const person of people) {
      if (person.birth && person.death && person.birth.year >= person.death.year) problems.push(`${person.id} life`);
      if (person.reign) {
        if (person.reign.start.year > person.reign.end.year) problems.push(`${person.id} reign order`);
        if (person.birth && person.reign.start.year < person.birth.year) problems.push(`${person.id} reign before birth`);
        if (person.death && person.reign.end.year > person.death.year) problems.push(`${person.id} reign after death`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("the events list is sorted chronologically", () => {
    const years = events.map((e) => e.start.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it("every event falls inside the atlas' coverage", () => {
    expect(events.filter((e) => e.start.year < ATLAS_MIN_YEAR || e.start.year > ATLAS_MAX_YEAR).map((e) => e.id)).toEqual([]);
  });
});

describe("quiz questions", () => {
  it("have four distinct options in both languages", () => {
    const problems = quizQuestions
      .filter((q) => new Set(q.options.map((o) => o.en)).size !== 4 || new Set(q.options.map((o) => o.fa)).size !== 4)
      .map((q) => q.id);
    expect(problems).toEqual([]);
  });

  it("cover every category and difficulty", () => {
    expect(new Set(quizQuestions.map((q) => q.category))).toEqual(new Set(["chronology", "people", "geography", "concepts"]));
    expect(new Set(quizQuestions.map((q) => q.difficulty))).toEqual(new Set(["easy", "medium", "hard"]));
  });
});

describe("territories (map outlines)", () => {
  const geojson = JSON.parse(
    fs.readFileSync(path.resolve(import.meta.dirname, "../public/geo/territories.json"), "utf8"),
  ) as { features: { properties: { id: string }; geometry: { type: string; coordinates: number[][][][] } }[] };

  it("metadata and geometry files describe the same outlines", () => {
    expect(geojson.features.map((f) => f.properties.id).sort()).toEqual(territories.map((t) => t.id).sort());
  });

  it("every outline has real geometry inside world bounds", () => {
    for (const feature of geojson.features) {
      expect(feature.geometry.type).toBe("MultiPolygon");
      const points = feature.geometry.coordinates.flat(2);
      expect(points.length, feature.properties.id).toBeGreaterThanOrEqual(4);
      for (const [lng, lat] of points) {
        expect(Math.abs(lng)).toBeLessThanOrEqual(180);
        expect(Math.abs(lat)).toBeLessThanOrEqual(90);
      }
    }
  });

  it("is only ever shown while its primary entity exists", () => {
    const problems = territories
      .filter((t) => {
        const entity = getEntity(t.entityIds[0])!;
        return t.validFrom < entity.start.year || t.validTo > entity.end.year;
      })
      .map((t) => t.id);
    expect(problems).toEqual([]);
  });

  it("has a non-empty validity window", () => {
    expect(territories.filter((t) => t.validFrom > t.validTo).map((t) => t.id)).toEqual([]);
  });

  it("claims no exact borders: none is labelled a 'boundary' or high confidence", () => {
    expect(territories.filter((t) => t.representation === "boundary").map((t) => t.id)).toEqual([]);
    expect(territories.filter((t) => t.confidence === "high").map((t) => t.id)).toEqual([]);
  });

  it("always cites the upstream dataset", () => {
    expect(territories.filter((t) => !t.sourceIds.includes("ds-historical-basemaps")).map((t) => t.id)).toEqual([]);
  });

  it("does not draw two outlines of the same primary entity with the same label at once", () => {
    const problems: string[] = [];
    for (let year = ATLAS_MIN_YEAR; year <= ATLAS_MAX_YEAR; year++) {
      const seen = new Set<string>();
      for (const t of territories) {
        if (year < t.validFrom || year > t.validTo) continue;
        const key = `${t.entityIds[0]}|${t.label.en}`;
        if (seen.has(key)) problems.push(`${year}: ${key}`);
        seen.add(key);
      }
    }
    expect(problems.slice(0, 5)).toEqual([]);
  });
});
