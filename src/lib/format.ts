/**
 * Presentation helpers shared by pages and components: turning records into the
 * date labels and links the interface shows. Pure functions, usable on the
 * server and in the browser.
 */
import type { Locale } from "@/i18n/config";
import type { Entity, HistoricalEvent, Person, Place, TerritoryProperties } from "@/data/schema";
import { clampYear, formatDated, formatDatedRange, formatYear } from "@/lib/dates";

export function entityRange(entity: Pick<Entity, "start" | "end">, locale: Locale): string {
  return formatDatedRange(entity.start, entity.end, locale);
}

export function eventDate(event: Pick<HistoricalEvent, "start" | "end">, locale: Locale): string {
  return event.end ? formatDatedRange(event.start, event.end, locale) : formatDated(event.start, locale);
}

export function reignRange(person: Pick<Person, "reign">, locale: Locale): string | null {
  return person.reign ? formatDatedRange(person.reign.start, person.reign.end, locale) : null;
}

/** The single most useful date line for a person: reign if known, else life dates. */
export function personDateLine(person: Pick<Person, "reign" | "birth" | "death">, locale: Locale): string | null {
  if (person.reign) return reignRange(person, locale);
  if (person.birth && person.death) return formatDatedRange(person.birth, person.death, locale);
  if (person.death) return formatDated(person.death, locale);
  if (person.birth) return formatDated(person.birth, locale);
  return null;
}

export function territoryWindow(territory: Pick<TerritoryProperties, "validFrom" | "validTo">, locale: Locale): string {
  return formatDatedRange(
    { year: territory.validFrom, precision: "exact" },
    { year: territory.validTo, precision: "exact" },
    locale,
  );
}

export function snapshotLabel(territory: Pick<TerritoryProperties, "snapshotYear">, locale: Locale): string {
  return formatYear(territory.snapshotYear, locale, { approximate: true });
}

/* ───────────────────────────── links ───────────────────────────── */

export interface AtlasLinkState {
  year: number;
  entityId?: string | null;
  placeId?: string | null;
  reference?: boolean;
}

/** Build a shareable atlas URL: /atlas?y=-549&e=achaemenid-empire */
export function atlasHref(state: AtlasLinkState): string {
  const params = new URLSearchParams();
  params.set("y", String(clampYear(state.year)));
  if (state.entityId) params.set("e", state.entityId);
  if (state.placeId) params.set("p", state.placeId);
  if (state.reference) params.set("ref", "1");
  return `/atlas?${params.toString()}`;
}

/**
 * A good year at which to show an entity on the map: the first year for which
 * one of its own outlines exists, otherwise its first year inside the atlas.
 */
export function yearForEntity(entity: Pick<Entity, "id" | "start">, territories: readonly TerritoryProperties[]): number {
  const own = territories
    .filter((territory) => territory.entityIds[0] === entity.id)
    .sort((a, b) => a.validFrom - b.validFrom);
  return clampYear(own.length > 0 ? own[0].validFrom : entity.start.year);
}

/** A good year at which to show a place: its first event, otherwise its entity's start. */
export function yearForPlace(
  place: Pick<Place, "id" | "entityIds">,
  events: readonly Pick<HistoricalEvent, "placeId" | "start">[],
  getEntity: (id: string) => Pick<Entity, "start"> | undefined,
): number {
  const here = events.filter((event) => event.placeId === place.id).sort((a, b) => a.start.year - b.start.year);
  if (here.length > 0) return clampYear(here[0].start.year);
  return clampYear(getEntity(place.entityIds[0])?.start.year ?? 1);
}
