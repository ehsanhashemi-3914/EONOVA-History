/**
 * Locale configuration — the single place that says which languages exist.
 *
 * "Locale" (LOH-kal) = a language + its regional conventions. We support two.
 * Persian is the default, and it is written right-to-left (RTL).
 */
export const LOCALES = ["fa", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fa";

/** Name of the cookie / localStorage key that remembers the chosen language. */
export const LOCALE_STORAGE_KEY = "eonova-locale";

export type Direction = "rtl" | "ltr";

export function directionOf(locale: Locale): Direction {
  return locale === "fa" ? "rtl" : "ltr";
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** A piece of text that exists in every supported language. */
export interface LocalizedText {
  fa: string;
  en: string;
}

/** Pick the right language out of a LocalizedText. */
export function pick(text: LocalizedText, locale: Locale): string {
  return text[locale];
}
