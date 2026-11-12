"use client";

/**
 * Global search dialog ("command palette").
 *
 * Data flow:
 *   keystroke → `query` state → search(index, query) → grouped results → list
 *   ↑/↓ change `activeIndex`; Enter navigates to the active result.
 *
 * The index is built once per page load (useMemo) from the dataset that is
 * already in the browser — nothing is sent to a server.
 */
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Crown, Landmark, MapPin, Search, Swords, X } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n";
import { entities, events, getEntity, people, places } from "@/data";
import { buildSearchIndex, groupResults, MIN_QUERY_LENGTH, normalize, search, type SearchItemType } from "@/lib/search";
import { atlasHref, yearForPlace } from "@/lib/format";
import { formatNumber } from "@/lib/dates";
import { cn } from "@/lib/cn";

const ICONS: Record<SearchItemType, typeof Landmark> = {
  entity: Landmark,
  person: Crown,
  event: Swords,
  place: MapPin,
};

export function SearchPalette({ onClose }: { onClose: () => void }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const index = useMemo(
    () =>
      buildSearchIndex({
        entities,
        people,
        events,
        places,
        placeHref: (place) => atlasHref({ year: yearForPlace(place, events, getEntity), placeId: place.id }),
        entityName: (id) => getEntity(id)?.name,
      }),
    [],
  );

  const results = useMemo(() => search(index, query), [index, query]);
  const groups = useMemo(() => groupResults(results), [results]);
  // Flat list in display order, so ↑/↓ follow what the eye sees.
  const flat = useMemo(() => groups.flatMap((group) => group.results), [groups]);
  const hasQuery = normalize(query).length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    inputRef.current?.focus();
    // Stop the page behind the dialog from scrolling while it is open.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Keep the highlighted row visible while moving with the keyboard.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const open = (href: string) => {
    onClose();
    router.push(href);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (flat.length === 0 ? 0 : (current + 1) % flat.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (flat.length === 0 ? 0 : (current - 1 + flat.length) % flat.length));
    } else if (event.key === "Enter" && flat[activeIndex]) {
      event.preventDefault();
      open(flat[activeIndex].item.href);
    }
  };

  // Position of each result in the flat list, used for keyboard highlighting.
  const positionOf = new Map(flat.map((result, position) => [`${result.item.type}-${result.item.id}`, position]));

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-3 pt-[9vh]" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.search.title}
        className="relative w-full max-w-2xl panel shadow-panel overflow-hidden flex flex-col max-h-[78vh]"
      >
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search aria-hidden="true" className="size-[18px] text-dust shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder={t.search.placeholder}
            aria-label={t.search.placeholder}
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls="search-results"
            aria-activedescendant={flat[activeIndex] ? `search-option-${activeIndex}` : undefined}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 h-14 bg-transparent text-[15.5px] text-parchment placeholder:text-dust outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="size-8 inline-flex items-center justify-center rounded-md text-dust hover:text-parchment hover:bg-slate"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div ref={listRef} id="search-results" role="listbox" aria-label={t.search.title} className="overflow-y-auto">
          {!hasQuery ? (
            <p className="px-5 py-9 text-center text-sm text-dust">
              {t.search.start} {t.search.hint}
            </p>
          ) : flat.length === 0 ? (
            <div className="px-5 py-9 text-center">
              <p className="text-parchment">{fill(t.search.empty, { query: query.trim() })}</p>
              <p className="mt-2 text-sm text-dust">{t.search.emptyHint}</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.type} role="group" aria-label={t.search.groups[group.type]} className="py-2">
                <p className="px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                  {t.search.groups[group.type]}
                </p>
                {group.results.map(({ item }) => {
                  const optionIndex = positionOf.get(`${item.type}-${item.id}`) ?? 0;
                  const Icon = ICONS[item.type];
                  const active = optionIndex === activeIndex;
                  return (
                    <button
                      key={`${item.type}-${item.id}`}
                      id={`search-option-${optionIndex}`}
                      data-index={optionIndex}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onMouseMove={() => setActiveIndex(optionIndex)}
                      onClick={() => open(item.href)}
                      className={cn("w-full flex items-start gap-3 px-5 py-2.5 text-start", active ? "bg-slate" : "")}
                    >
                      <Icon aria-hidden="true" className={cn("size-4 mt-1 shrink-0", active ? "text-gold" : "text-dust")} />
                      <span className="min-w-0">
                        <span className={cn("block text-[14.5px]", active ? "text-gold-bright" : "text-parchment")}>
                          {item.title[locale]}
                        </span>
                        <span className="block text-[12.5px] text-dust truncate">{item.subtitle[locale]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-2.5 border-t border-line text-[11.5px] text-dust">
          <span>{t.search.keyboard}</span>
          {hasQuery ? <span aria-live="polite">{fill(t.search.resultCount, { count: formatNumber(flat.length, locale) })}</span> : null}
        </div>
      </div>
    </div>
  );
}
