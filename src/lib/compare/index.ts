/**
 * Comparison logic for two historical entities.
 *
 * Pure functions only: the page decides how to DRAW a comparison, this file
 * decides what is TRUE about one (do the kinds match? did they coexist?).
 */
import type { Entity, EntityRelation, HistoricalEvent } from "@/data/schema";

export interface Overlap {
  start: number;
  end: number;
  /** Number of years both existed. */
  years: number;
}

export interface Comparison {
  /** False when the two are different kinds of entity (e.g. civilization vs empire). */
  sameKind: boolean;
  /** The years in which both existed, or null. */
  overlap: Overlap | null;
  /** When they did not coexist: years between the end of one and the start of the other. */
  gapYears: number | null;
  durationA: number;
  durationB: number;
  /** Events that involve both entities. */
  sharedEvents: HistoricalEvent[];
  /** How A's record describes its relation to B, and vice versa. */
  relationAtoB: EntityRelation | null;
  relationBtoA: EntityRelation | null;
}

export function durationOf(entity: Pick<Entity, "start" | "end">): number {
  return entity.end.year - entity.start.year;
}

export function overlapOf(a: Pick<Entity, "start" | "end">, b: Pick<Entity, "start" | "end">): Overlap | null {
  const start = Math.max(a.start.year, b.start.year);
  const end = Math.min(a.end.year, b.end.year);
  return start <= end ? { start, end, years: end - start } : null;
}

export function compareEntities(a: Entity, b: Entity, events: readonly HistoricalEvent[]): Comparison {
  const overlap = overlapOf(a, b);
  const gapYears = overlap ? null : Math.max(a.start.year, b.start.year) - Math.min(a.end.year, b.end.year);

  return {
    sameKind: a.kind === b.kind,
    overlap,
    gapYears,
    durationA: durationOf(a),
    durationB: durationOf(b),
    sharedEvents: events.filter((event) => event.entityIds.includes(a.id) && event.entityIds.includes(b.id)),
    relationAtoB: a.relations.find((relation) => relation.entityId === b.id) ?? null,
    relationBtoA: b.relations.find((relation) => relation.entityId === a.id) ?? null,
  };
}
