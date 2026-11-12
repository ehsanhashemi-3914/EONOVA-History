/**
 * i18n ("internationalization" — i, 18 letters, n) helpers that work on both
 * the server and the client.
 */
import { en, type Dictionary } from "./dictionaries/en";
import { fa } from "./dictionaries/fa";
import type { Locale } from "./config";

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { fa, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * Fill {placeholders} in a template:
 *   fill("Question {current} of {total}", { current: 2, total: 10 })
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole));
}
