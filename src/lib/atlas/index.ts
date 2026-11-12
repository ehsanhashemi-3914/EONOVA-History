/**
 * Atlas query layer — pure functions that answer "what existed in year Y?".
 *
 * "Pure" means: same input → same output, no side effects, no React, no DOM.
 * That is what makes this file easy to unit-test, and it is why the map and the
 * timeline can both rely on it without knowing about each other.
 *
 * All years are internal astronomical years (see src/lib/dates).
 */
import type { Entity, EntityPeriod, HistoricalEvent, Place, TerritoryProperties } from "@/data/schema";

/* ───────────────────────────── entities ───────────────────────────── */

export function isEntityActive(entity: Pick<Entity, "start" | "end">, year: number): boolean {
  return year >= entity.start.year && year <= entity.end.year;
}

export function entitiesActiveIn<T extends Pick<Entity, "start" | "end">>(year: number, list: readonly T[]): T[] {
  return list.filter((entity) => isEntityActive(entity, year));
}

/**
 * The named period(s) an entity was in during the given year.
 * Usually one; the Roman Empire after 395 CE returns two (West and East).
 */
export function periodsAt(entity: Pick<Entity, "periods">, year: number): EntityPeriod[] {
  return entity.periods.filter((period) => year >= period.start.year && year <= period.end.year);
}

/* ────────────────────────────── events ────────────────────────────── */

/** Last year an event touches (its end, or its start for single-year events). */
export function eventEndYear(event: Pick<HistoricalEvent, "start" | "end">): number {
  return event.end?.year ?? event.start.year;
}

/** Chronological order; ties are broken by id so the order is stable. */
export function sortEvents<T extends Pick<HistoricalEvent, "start" | "id">>(list: readonly T[]): T[] {
  return [...list].sort((a, b) => a.start.year - b.start.year || a.id.localeCompare(b.id));
}

/** How many years separate a year from an event (0 while the event is under way). */
export function distanceToEvent(event: Pick<HistoricalEvent, "start" | "end">, year: number): number {
  if (year < event.start.year) return event.start.year - year;
  const end = eventEndYear(event);
  return year > end ? year - end : 0;
}

/** Events within `span` years of `year`, nearest first. */
export function eventsNear<T extends Pick<HistoricalEvent, "start" | "end" | "id">>(
  year: number,
  span: number,
  list: readonly T[],
): T[] {
  return list
    .filter((event) => distanceToEvent(event, year) <= span)
    .sort(
      (a, b) =>
        distanceToEvent(a, year) - distanceToEvent(b, year) || a.start.year - b.start.year || a.id.localeCompare(b.id),
    );
}

export interface EventFilters {
  region?: string | null;
  category?: string | null;
  entityId?: string | null;
}

export function filterEvents<T extends Pick<HistoricalEvent, "region" | "category" | "entityIds">>(
  list: readonly T[],
  filters: EventFilters,
): T[] {
  return list.filter(
    (event) =>
      (!filters.region || event.region === filters.region) &&
      (!filters.category || event.category === filters.category) &&
      (!filters.entityId || event.entityIds.includes(filters.entityId)),
  );
}

/* ──────────────────────────── territories ─────────────────────────── */

export function isTerritoryValid(territory: Pick<TerritoryProperties, "validFrom" | "validTo">, year: number): boolean {
  return year >= territory.validFrom && year <= territory.validTo;
}

/** Outlines that may honestly be drawn for the given year. */
export function territoriesAt<T extends Pick<TerritoryProperties, "validFrom" | "validTo">>(
  year: number,
  list: readonly T[],
): T[] {
  return list.filter((territory) => isTerritoryValid(territory, year));
}

function distanceToWindow(territory: Pick<TerritoryProperties, "validFrom" | "validTo">, year: number): number {
  if (year < territory.validFrom) return territory.validFrom - year;
  if (year > territory.validTo) return year - territory.validTo;
  return 0;
}

export interface TerritoryResolution<T> {
  /** Outlines valid for the year (may be several, e.g. rival Hellenistic kingdoms). */
  shown: T[];
  /**
   * When nothing is valid: the entity's own outline closest in time, offered as
   * a clearly labelled reference — never drawn as if it applied to the year.
   */
  nearest: T | null;
  /** The year inside the nearest outline's window that lies closest to the requested year. */
  nearestYear: number | null;
}

export function resolveTerritory<T extends Pick<TerritoryProperties, "entityIds" | "validFrom" | "validTo">>(
  entityId: string,
  year: number,
  list: readonly T[],
): TerritoryResolution<T> {
  const own = list.filter((territory) => territory.entityIds.includes(entityId));
  const shown = own.filter((territory) => isTerritoryValid(territory, year));
  if (shown.length > 0) return { shown, nearest: null, nearestYear: null };

  // Only outlines that primarily belong to this entity qualify as its reference.
  const candidates = own.filter((territory) => territory.entityIds[0] === entityId);
  if (candidates.length === 0) return { shown, nearest: null, nearestYear: null };

  const nearest = candidates.reduce((best, current) =>
    distanceToWindow(current, year) < distanceToWindow(best, year) ? current : best,
  );
  const nearestYear = year < nearest.validFrom ? nearest.validFrom : nearest.validTo;
  return { shown, nearest, nearestYear };
}

/* ────────────────────────────── places ────────────────────────────── */

/** How many years either side of a battle its battlefield stays on the map. */
export const BATTLEFIELD_SPAN = 25;

/**
 * Places to draw for a given year. A place is shown when
 *   1. one of its entities existed that year, AND
 *   2. the year is inside the place's own existence window (a city is not drawn
 *      before it was founded), AND
 *   3. for battlefields: an event at that place happened within BATTLEFIELD_SPAN
 *      years — a battlefield is only "significant" around its battle.
 */
export function placesVisibleIn<
  P extends Pick<Place, "id" | "kind" | "entityIds" | "existsFrom" | "existsTo">,
  E extends Pick<Entity, "id" | "start" | "end">,
>(
  year: number,
  places: readonly P[],
  entities: readonly E[],
  events: readonly Pick<HistoricalEvent, "placeId" | "start" | "end">[],
): P[] {
  const active = new Set(entitiesActiveIn(year, entities).map((entity) => entity.id));
  return places.filter((place) => {
    if (!place.entityIds.some((id) => active.has(id))) return false;
    if (place.existsFrom !== undefined && year < place.existsFrom) return false;
    if (place.existsTo !== undefined && year > place.existsTo) return false;
    if (place.kind === "battlefield") {
      return events.some((event) => event.placeId === place.id && distanceToEvent(event, year) <= BATTLEFIELD_SPAN);
    }
    return true;
  });
}
