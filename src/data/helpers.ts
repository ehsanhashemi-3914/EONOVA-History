/**
 * Small helpers that keep the content files readable.
 * `bce(550)` reads like a history book but stores the astronomical year (-549).
 */
import type { LocalizedText } from "@/i18n/config";
import { fromEra, type DatePrecision } from "@/lib/dates";
import type { HistoricalDate } from "./schema";

/** A year Before the Common Era. */
export function bce(value: number, precision: DatePrecision = "exact", note?: LocalizedText): HistoricalDate {
  return note ? { year: fromEra(value, "BCE"), precision, note } : { year: fromEra(value, "BCE"), precision };
}

/** A year of the Common Era. */
export function ce(value: number, precision: DatePrecision = "exact", note?: LocalizedText): HistoricalDate {
  return note ? { year: fromEra(value, "CE"), precision, note } : { year: fromEra(value, "CE"), precision };
}

/** Bilingual text: Persian first (the primary language), then English. */
export function tx(fa: string, en: string): LocalizedText {
  return { fa, en };
}
