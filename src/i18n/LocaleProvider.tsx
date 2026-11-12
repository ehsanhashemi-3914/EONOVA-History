"use client";

/**
 * Client-side access to the current language.
 *
 * React "context" lets a value be read by any component below the provider
 * without passing it down through every level as a prop. The root layout
 * (a Server Component) reads the locale from the cookie and hands it to this
 * provider; client components then call `useI18n()`.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_STORAGE_KEY, directionOf, isLocale, type Direction, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./index";

interface I18nContextValue {
  locale: Locale;
  dir: Direction;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage can be blocked (private mode). The cookie alone is enough.
  }
}

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      persistLocale(next);
      // Ask the server to render the current route again, now in the new language.
      router.refresh();
    },
    [router],
  );

  // If the cookie was lost but localStorage still remembers a choice, restore it.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      return;
    }
    if (isLocale(stored) && stored !== locale && !document.cookie.includes(`${LOCALE_STORAGE_KEY}=`)) {
      setLocale(stored);
    }
  }, [locale, setLocale]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dir: directionOf(locale), t: getDictionary(locale), setLocale }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <LocaleProvider>.");
  return value;
}
