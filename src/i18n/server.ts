/**
 * Server-side locale lookup.
 *
 * The chosen language is remembered in a cookie. Cookies travel with every
 * request, so the SERVER can read the choice and send HTML that is already in
 * the right language and direction — no flash of the wrong language, and no
 * mismatch between server HTML and client React ("hydration error").
 */
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, directionOf, isLocale, type Locale } from "./config";
import { getDictionary } from "./index";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_STORAGE_KEY)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Everything a Server Component needs to render localized text. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, dir: directionOf(locale), t: getDictionary(locale) };
}
