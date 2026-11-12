/**
 * Data access layer — the ONLY module the rest of the app imports data from.
 *
 * Pages and components ask this file for records ("give me the entity with this
 * slug"); they never reach into the individual content files. That keeps the
 * storage format an internal detail: if the data ever moved to a database, only
 * this file would need to change.
 */
import { ancientEgypt } from "./entities/ancient-egypt";
import { neoAssyrianEmpire } from "./entities/neo-assyrian-empire";
import { achaemenidEmpire } from "./entities/achaemenid-empire";
import { macedonHellenistic } from "./entities/macedon-hellenistic";
import { mauryaEmpire } from "./entities/maurya-empire";
import { hanDynasty } from "./entities/han-dynasty";
import { romanEmpire } from "./entities/roman-empire";
import { sasanianEmpire } from "./entities/sasanian-empire";
import { events as rawEvents } from "./events";
import { people as rawPeople } from "./people";
import { places as rawPlaces } from "./places";
import { quizQuestions as rawQuiz } from "./quiz";
import { sources as rawSources } from "./sources";
import territoryMeta from "./generated/territory-meta.json";
import type { Entity, HistoricalEvent, Person, Place, QuizQuestion, Source, TerritoryProperties } from "./schema";

/** Entities in chronological order of their beginning. */
export const entities: Entity[] = [
  ancientEgypt,
  neoAssyrianEmpire,
  achaemenidEmpire,
  macedonHellenistic,
  mauryaEmpire,
  hanDynasty,
  romanEmpire,
  sasanianEmpire,
].sort((a, b) => a.start.year - b.start.year);

/** Events, earliest first. */
export const events: HistoricalEvent[] = [...rawEvents].sort((a, b) => a.start.year - b.start.year);

export const people: Person[] = rawPeople;
export const places: Place[] = rawPlaces;
export const sources: Source[] = rawSources;
export const quizQuestions: QuizQuestion[] = rawQuiz;

/** Provenance records for every polygon in public/geo/territories.json (no geometry). */
export const territories = territoryMeta as TerritoryProperties[];

function indexBy<T, K extends keyof T>(items: T[], key: K): Map<T[K], T> {
  return new Map(items.map((item) => [item[key], item]));
}

const entityById = indexBy(entities, "id");
const entityBySlug = indexBy(entities, "slug");
const eventById = indexBy(events, "id");
const eventBySlug = indexBy(events, "slug");
const personById = indexBy(people, "id");
const personBySlug = indexBy(people, "slug");
const placeById = indexBy(places, "id");
const sourceById = indexBy(sources, "id");

export const getEntity = (id: string) => entityById.get(id);
export const getEntityBySlug = (slug: string) => entityBySlug.get(slug);
export const getEvent = (id: string) => eventById.get(id);
export const getEventBySlug = (slug: string) => eventBySlug.get(slug);
export const getPerson = (id: string) => personById.get(id);
export const getPersonBySlug = (slug: string) => personBySlug.get(slug);
export const getPlace = (id: string) => placeById.get(id);
export const getSource = (id: string) => sourceById.get(id);

/** Resolve a list of source ids, silently skipping unknown ones (tests forbid those). */
export function getSources(ids: readonly string[]): Source[] {
  return ids.map((id) => sourceById.get(id)).filter((s): s is Source => s !== undefined);
}

/* ── relations, derived instead of stored twice ── */

export const eventsOfEntity = (entityId: string) => events.filter((e) => e.entityIds.includes(entityId));
export const peopleOfEntity = (entityId: string) => people.filter((p) => p.entityId === entityId);
export const placesOfEntity = (entityId: string) => places.filter((p) => p.entityIds.includes(entityId));
export const eventsOfPerson = (personId: string) => events.filter((e) => e.personIds.includes(personId));
export const eventsAtPlace = (placeId: string) => events.filter((e) => e.placeId === placeId);
export const territoriesOfEntity = (entityId: string) =>
  territories.filter((t) => t.entityIds.includes(entityId)).sort((a, b) => a.snapshotYear - b.snapshotYear);
