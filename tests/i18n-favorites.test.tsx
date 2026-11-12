/**
 * Language switching and favorites persistence, tested through real React
 * components in a simulated browser (jsdom).
 */
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { en } from "@/i18n/dictionaries/en";
import { fa } from "@/i18n/dictionaries/fa";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, directionOf, isLocale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n";
import { LocaleProvider, useI18n } from "@/i18n/LocaleProvider";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import {
  FAVORITES_STORAGE_KEY,
  favoriteKey,
  favoritesStore,
  parseFavoriteKey,
  toggleInList,
  useFavorites,
} from "@/lib/storage/favorites";
import { createLocalStore } from "@/lib/storage/local-store";

// The provider asks Next's router to re-render after a language change.
const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
}));

beforeEach(() => {
  refresh.mockClear();
  favoritesStore.set([]);
  window.localStorage.clear();
});

/* ───────────────────────── dictionaries ───────────────────────── */

/** Every key path in a nested object, e.g. "home.stats.entities". */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => keyPaths(item, `${prefix}[${index}]`));
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key));
  }
  return [prefix];
}

function leafValues(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(leafValues);
  if (typeof value === "object" && value !== null) return Object.values(value).flatMap(leafValues);
  return [];
}

describe("dictionaries", () => {
  it("have exactly the same keys in Persian and English", () => {
    expect(keyPaths(fa).sort()).toEqual(keyPaths(en).sort());
  });

  it("contain no empty strings", () => {
    expect(leafValues(fa).filter((text) => text.trim() === "")).toEqual([]);
    expect(leafValues(en).filter((text) => text.trim() === "")).toEqual([]);
  });

  it("use the same placeholders in both languages", () => {
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join(",");
    const faValues = leafValues(fa);
    const enValues = leafValues(en);
    const mismatches = enValues
      .map((text, index) => ({ en: text, fa: faValues[index] }))
      .filter((pair) => placeholders(pair.en) !== placeholders(pair.fa));
    expect(mismatches).toEqual([]);
  });

  it("actually translate the interface (Persian text is in Persian script)", () => {
    expect(fa.nav.atlas).toMatch(/[؀-ۿ]/);
    expect(fa.nav.atlas).not.toBe(en.nav.atlas);
    expect(getDictionary("fa")).toBe(fa);
    expect(getDictionary("en")).toBe(en);
  });

  it("fills placeholders", () => {
    expect(fill("Question {current} of {total}", { current: 2, total: 10 })).toBe("Question 2 of 10");
    expect(fill("{missing} stays", {})).toBe("{missing} stays");
  });
});

describe("locale configuration", () => {
  it("defaults to Persian, right-to-left", () => {
    expect(DEFAULT_LOCALE).toBe("fa");
    expect(directionOf("fa")).toBe("rtl");
    expect(directionOf("en")).toBe("ltr");
  });

  it("validates locale values", () => {
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

/* ───────────────────────── language switching ───────────────────────── */

function LanguageProbe() {
  const { t, locale, dir, setLocale } = useI18n();
  return (
    <div>
      <p data-testid="label">{t.nav.atlas}</p>
      <p data-testid="state">
        {locale}/{dir}
      </p>
      <button onClick={() => setLocale(locale === "fa" ? "en" : "fa")}>switch</button>
    </div>
  );
}

describe("language switching", () => {
  it("renders Persian labels and RTL for the Persian locale", () => {
    render(
      <LocaleProvider locale="fa">
        <LanguageProbe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("label")).toHaveTextContent(fa.nav.atlas);
    expect(screen.getByTestId("state")).toHaveTextContent("fa/rtl");
  });

  it("renders English labels and LTR for the English locale", () => {
    render(
      <LocaleProvider locale="en">
        <LanguageProbe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("label")).toHaveTextContent(en.nav.atlas);
    expect(screen.getByTestId("state")).toHaveTextContent("en/ltr");
  });

  it("persists the choice in a cookie and localStorage, then asks the server to re-render", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="fa">
        <LanguageProbe />
      </LocaleProvider>,
    );
    await user.click(screen.getByRole("button", { name: "switch" }));
    expect(document.cookie).toContain(`${LOCALE_STORAGE_KEY}=en`);
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("switches the labels when the server sends the new locale", () => {
    const { rerender } = render(
      <LocaleProvider locale="fa">
        <LanguageProbe />
      </LocaleProvider>,
    );
    rerender(
      <LocaleProvider locale="en">
        <LanguageProbe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("label")).toHaveTextContent(en.nav.atlas);
    expect(screen.getByTestId("state")).toHaveTextContent("en/ltr");
  });

  it("restores a remembered language when the cookie has been lost", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(
      <LocaleProvider locale="fa">
        <LanguageProbe />
      </LocaleProvider>,
    );
    expect(document.cookie).toContain(`${LOCALE_STORAGE_KEY}=en`);
    expect(refresh).toHaveBeenCalled();
  });

  it("refuses to work outside the provider", () => {
    const silence = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<LanguageProbe />)).toThrow(/LocaleProvider/);
    silence.mockRestore();
  });
});

/* ───────────────────────── favorites ───────────────────────── */

describe("favorites helpers", () => {
  it("builds and parses keys", () => {
    expect(favoriteKey("entity", "achaemenid-empire")).toBe("entity:achaemenid-empire");
    expect(parseFavoriteKey("person:cyrus-ii")).toEqual({ type: "person", id: "cyrus-ii" });
  });

  it("toggles without mutating the original list", () => {
    const start = [favoriteKey("entity", "a")];
    const added = toggleInList(start, favoriteKey("event", "b"));
    expect(added).toEqual(["entity:a", "event:b"]);
    expect(toggleInList(added, favoriteKey("entity", "a"))).toEqual(["event:b"]);
    expect(start).toEqual(["entity:a"]);
  });
});

describe("favorites persistence", () => {
  it("saves to localStorage and reads it back", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);

    act(() => result.current.toggle("entity", "sasanian-empire"));
    act(() => result.current.toggle("person", "shapur-i"));

    expect(result.current.has("entity", "sasanian-empire")).toBe(true);
    expect(JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY)!)).toEqual(["entity:sasanian-empire", "person:shapur-i"]);
  });

  it("survives a page reload (a new store reads the same storage)", () => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(["event:battle-of-edessa"]));
    // A brand-new store instance stands in for the app starting again after a refresh.
    const reloaded = createLocalStore<string[]>(FAVORITES_STORAGE_KEY, [], (v): v is string[] => Array.isArray(v));
    expect(reloaded.getSnapshot()).toEqual(["event:battle-of-edessa"]);
  });

  it("removes an item and clears the list", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle("event", "kalinga-war"));
    act(() => result.current.toggle("event", "kalinga-war"));
    expect(result.current.favorites).toEqual([]);

    act(() => result.current.toggle("entity", "han-dynasty"));
    act(() => result.current.clear());
    expect(result.current.favorites).toEqual([]);
    expect(window.localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe("[]");
  });

  it("ignores corrupted or malicious stored data", () => {
    for (const bad of ["not json", JSON.stringify({ a: 1 }), JSON.stringify(["entity:<script>"]), JSON.stringify([1, 2])]) {
      window.localStorage.setItem("probe-key", bad);
      const store = createLocalStore<string[]>("probe-key", [], (v): v is string[] =>
        Array.isArray(v) && v.every((item) => typeof item === "string" && /^(entity|event|person):[a-z0-9-]+$/.test(item)),
      );
      expect(store.getSnapshot()).toEqual([]);
    }
  });

  it("returns the same array object while nothing changes (required by useSyncExternalStore)", () => {
    favoritesStore.set(["entity:roman-empire"]);
    expect(favoritesStore.getSnapshot()).toBe(favoritesStore.getSnapshot());
  });
});

describe("FavoriteButton", () => {
  it("toggles its pressed state and label, and stores the item", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="en">
        <FavoriteButton type="entity" id="achaemenid-empire" />
      </LocaleProvider>,
    );
    const button = screen.getByRole("button", { name: en.common.addSaved });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(screen.getByRole("button", { name: en.common.removeSaved })).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem(FAVORITES_STORAGE_KEY)).toContain("entity:achaemenid-empire");

    await user.click(screen.getByRole("button", { name: en.common.removeSaved }));
    expect(screen.getByRole("button", { name: en.common.addSaved })).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps two buttons for the same item in sync", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="fa">
        <FavoriteButton type="event" id="battle-of-gaugamela" />
        <FavoriteButton type="event" id="battle-of-gaugamela" compact />
      </LocaleProvider>,
    );
    const [first] = screen.getAllByRole("button", { name: fa.common.addSaved });
    await user.click(first);
    expect(screen.getAllByRole("button", { name: fa.common.removeSaved })).toHaveLength(2);
  });
});
