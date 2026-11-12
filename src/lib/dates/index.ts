/**
 * Historical date utilities.
 *
 * THE PROBLEM
 * Historians count "… 2 BCE, 1 BCE, 1 CE, 2 CE …" — there is no year zero.
 * That makes arithmetic awkward: from 1 BCE to 1 CE is one year, not two.
 *
 * THE SOLUTION — astronomical year numbering
 * Internally we store every year as a plain integer on a continuous number line:
 *
 *     1 CE  →  1
 *     1 BCE →  0
 *     2 BCE → -1
 *   550 BCE → -549
 *
 * Sorting, subtracting and range checks then work with ordinary maths.
 * The integer 0 is a perfectly valid *internal* value (it means 1 BCE), but it must
 * never be *displayed* as "year 0". Every label in the app therefore goes through
 * the formatting functions in this file.
 */
import type { Locale } from "@/i18n/config";

export type Era = "BCE" | "CE";

/**
 * How firmly a date is known.
 * - exact:       securely dated
 * - approximate: conventional / "circa" date
 * - disputed:    scholars actively disagree
 */
export type DatePrecision = "exact" | "approximate" | "disputed";

/** First and last year the atlas covers (3500 BCE – 700 CE), as internal years. */
export const ATLAS_MIN_YEAR = fromEra(3500, "BCE");
export const ATLAS_MAX_YEAR = fromEra(700, "CE");

/** Convert a historian's year ("550", "BCE") into the internal integer. */
export function fromEra(value: number, era: Era): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`A historical year must be a whole number ≥ 1 (got ${value}). There is no year 0.`);
  }
  return era === "CE" ? value : 1 - value;
}

/** Convert an internal integer back into a historian's year and era. */
export function toEra(year: number): { value: number; era: Era } {
  if (!Number.isInteger(year)) {
    throw new RangeError(`Internal years must be whole numbers (got ${year}).`);
  }
  return year >= 1 ? { value: year, era: "CE" } : { value: 1 - year, era: "BCE" };
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

/**
 * Write a number with the digits of the given language.
 * Done by hand (not with Intl) so the server and the browser always produce
 * exactly the same text — a mismatch would cause a React "hydration error".
 */
export function formatNumber(value: number, locale: Locale): string {
  const text = String(Math.abs(Math.trunc(value)));
  const sign = value < 0 ? (locale === "fa" ? "−" : "-") : "";
  if (locale !== "fa") return sign + text;
  return sign + text.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

const ERA_LABELS: Record<Locale, Record<Era, string>> = {
  en: { BCE: "BCE", CE: "CE" },
  fa: { BCE: "پ.م", CE: "م" },
};

const ERA_LABELS_LONG: Record<Locale, Record<Era, string>> = {
  en: { BCE: "Before Common Era", CE: "Common Era" },
  fa: { BCE: "پیش از میلاد", CE: "میلادی" },
};

const CIRCA: Record<Locale, string> = { en: "c.", fa: "حدود" };

export function eraLabel(era: Era, locale: Locale, long = false): string {
  return (long ? ERA_LABELS_LONG : ERA_LABELS)[locale][era];
}

export interface FormatYearOptions {
  /** Prefix the label with "c." / «حدود». */
  approximate?: boolean;
  /** Leave the era out (used inside ranges that share one era). */
  omitEra?: boolean;
}

/** 550 BCE → "550 BCE" / «۵۵۰ پ.م». Never produces "0". */
export function formatYear(year: number, locale: Locale, options: FormatYearOptions = {}): string {
  const { value, era } = toEra(year);
  const number = formatNumber(value, locale);
  const core = options.omitEra ? number : `${number} ${ERA_LABELS[locale][era]}`;
  return options.approximate ? `${CIRCA[locale]} ${core}` : core;
}

export interface DatedYear {
  year: number;
  precision: DatePrecision;
}

/** Format a year together with its precision ("c." is added unless the date is exact). */
export function formatDated(date: DatedYear, locale: Locale): string {
  return formatYear(date.year, locale, { approximate: date.precision !== "exact" });
}

/**
 * Format a span of years.
 *   same era:   "550–330 BCE"        / «۵۵۰ تا ۳۳۰ پ.م»
 *   two eras:   "27 BCE – 476 CE"    / «۲۷ پ.م تا ۴۷۶ م»
 */
export function formatRange(
  start: number,
  end: number,
  locale: Locale,
  options: { approximateStart?: boolean; approximateEnd?: boolean } = {},
): string {
  const a = toEra(start);
  const b = toEra(end);
  const sameEra = a.era === b.era;
  const left = formatYear(start, locale, {
    approximate: options.approximateStart,
    omitEra: sameEra && !options.approximateEnd,
  });
  const right = formatYear(end, locale, { approximate: options.approximateEnd });
  if (start === end) return right;
  if (locale === "fa") return `${left} تا ${right}`;
  return sameEra && !options.approximateEnd ? `${left}–${right}` : `${left} – ${right}`;
}

/** Format a span whose ends carry their own precision. */
export function formatDatedRange(start: DatedYear, end: DatedYear, locale: Locale): string {
  return formatRange(start.year, end.year, locale, {
    approximateStart: start.precision !== "exact",
    approximateEnd: end.precision !== "exact",
  });
}

/** Which century a year falls in: 550 BCE → 6th century BCE; 117 CE → 2nd century CE. */
export function centuryOf(year: number): { century: number; era: Era } {
  const { value, era } = toEra(year);
  return { century: Math.ceil(value / 100), era };
}

function englishOrdinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/** "6th century BCE" / «سدهٔ ۶ پ.م». */
export function formatCentury(year: number, locale: Locale): string {
  const { century, era } = centuryOf(year);
  if (locale === "fa") return `سدهٔ ${formatNumber(century, "fa")} ${ERA_LABELS.fa[era]}`;
  return `${englishOrdinal(century)} century ${ERA_LABELS.en[era]}`;
}

/** Number of years between two internal years (correct across the BCE/CE boundary). */
export function yearsBetween(start: number, end: number): number {
  return end - start;
}

/** Comparator for Array.prototype.sort — earliest first. */
export function compareYears(a: number, b: number): number {
  return a - b;
}

/** Is `year` inside the inclusive range [start, end]? */
export function isYearInRange(year: number, start: number, end: number): boolean {
  return year >= start && year <= end;
}

/** Keep a year inside the atlas' supported span. */
export function clampYear(year: number, min = ATLAS_MIN_YEAR, max = ATLAS_MAX_YEAR): number {
  if (Number.isNaN(year)) return min;
  return Math.min(max, Math.max(min, Math.trunc(year)));
}

/**
 * Read a year from a URL parameter (e.g. "?y=-549").
 * Returns `fallback` when the text is missing or not a whole number.
 */
export function parseYearParam(raw: string | null | undefined, fallback: number): number {
  if (raw == null || !/^-?\d{1,5}$/.test(raw.trim())) return fallback;
  return clampYear(Number(raw));
}
