"use client";

/**
 * AtlasExplorer — the atlas page's "brain".
 *
 * STATE (what the user has chosen) lives here and nowhere else:
 *   year · selected entity · selected place · reference-outline toggle
 *
 * DATA FLOW
 *   TimeBar ──onChange──► setYear ──► year ──► AtlasMap (redraws outlines)
 *                                        └──► side panel (recomputes lists)
 *   map click ─► onSelectEntity ─► selectedEntityId ─► panel + map highlight
 *
 * Everything shown is DERIVED from that state by the pure functions in
 * src/lib/atlas — nothing is stored twice, so nothing can get out of sync.
 * The state is also mirrored into the URL so a view can be shared or reloaded.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, Link as LinkIcon, MapPin, X } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n";
import { entities, events, eventsAtPlace, getPlace, getSources, territories } from "@/data";
import type { Entity, TerritoryProperties } from "@/data/schema";
import { entitiesActiveIn, eventsNear, periodsAt, resolveTerritory } from "@/lib/atlas";
import { formatNumber, formatYear } from "@/lib/dates";
import { atlasHref, entityRange, eventDate, territoryWindow } from "@/lib/format";
import { cn } from "@/lib/cn";
import { AtlasMapLazy } from "@/components/map/AtlasMapLazy";
import { MapLegend } from "@/components/map/MapLegend";
import { TimeBar } from "@/components/timeline/TimeBar";
import { Badge, ColorSwatch } from "@/components/ui/primitives";

/** Events this many years either side of the selected year are listed. */
const EVENT_SPAN = 25;

export interface AtlasInitialState {
  year: number;
  entityId: string | null;
  placeId: string | null;
  reference: boolean;
}

export function AtlasExplorer({ initial }: { initial: AtlasInitialState }) {
  const { t, locale } = useI18n();
  const [year, setYear] = useState(initial.year);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(initial.entityId);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(initial.placeId);
  const [showReference, setShowReference] = useState(initial.reference);
  const [copied, setCopied] = useState(false);

  const href = atlasHref({ year, entityId: selectedEntityId, placeId: selectedPlaceId, reference: showReference });

  // Mirror the state into the address bar (without a navigation or a server
  // round-trip). Delayed slightly so dragging the slider does not flood the
  // browser's history API.
  useEffect(() => {
    const timer = window.setTimeout(() => window.history.replaceState(null, "", href), 250);
    return () => window.clearTimeout(timer);
  }, [href]);

  const activeEntities = useMemo(() => entitiesActiveIn(year, entities), [year]);
  const nearbyEvents = useMemo(() => eventsNear(year, EVENT_SPAN, events), [year]);
  const selectedPlace = selectedPlaceId ? getPlace(selectedPlaceId) : undefined;
  const yearLabel = formatYear(year, locale);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(href, window.location.origin).toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be refused; the address bar still holds the link.
    }
  };

  return (
    <div className="grid lg:h-[calc(100dvh-60px)] lg:grid-cols-[minmax(340px,400px)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto]">
      {/* ── Map ── */}
      <div className="relative h-[58dvh] min-h-[340px] lg:h-auto lg:col-start-2 lg:row-start-1">
        <AtlasMapLazy
          className="absolute inset-0"
          year={year}
          selectedEntityId={selectedEntityId}
          selectedPlaceId={selectedPlaceId}
          showReference={showReference}
          onSelectEntity={setSelectedEntityId}
          onSelectPlace={setSelectedPlaceId}
        />

        {selectedPlace ? (
          <aside
            aria-label={t.atlas.placeDetails}
            className="absolute bottom-9 start-3 z-10 w-[min(21rem,calc(100%-1.5rem))] panel shadow-panel p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gold">{t.placeKinds[selectedPlace.kind]}</p>
                <h2 className="mt-1 text-[16px] font-semibold text-parchment">{selectedPlace.name[locale]}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlaceId(null)}
                aria-label={t.atlas.closeDetails}
                className="size-7 grid place-items-center rounded-md text-dust hover:text-parchment hover:bg-slate"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-[12.5px] text-dust">
              {t.common.modernLocation}: {selectedPlace.modernLocation[locale]}
            </p>
            {selectedPlace.approximateLocation ? (
              <Badge tone="warn" className="mt-2">
                {t.common.approximateLocation}
              </Badge>
            ) : null}
            <p className="mt-2.5 text-[13px] text-sand">{selectedPlace.description[locale]}</p>
            {eventsAtPlace(selectedPlace.id).length > 0 ? (
              <div className="mt-3 border-t border-line pt-2.5">
                <p className="text-[11.5px] text-dust mb-1">{t.atlas.eventsHere}</p>
                <ul className="space-y-1">
                  {eventsAtPlace(selectedPlace.id).map((event) => (
                    <li key={event.id} className="text-[13px]">
                      <Link href={`/events/${event.slug}`} className="text-parchment hover:text-gold">
                        {event.title[locale]}
                      </Link>
                      <span className="text-dust tabular-nums"> · {eventDate(event, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        ) : null}
      </div>

      {/* ── Time controls ── */}
      <div className="lg:col-span-2 lg:row-start-2">
        <TimeBar year={year} onChange={setYear} />
      </div>

      {/* ── Side panel ── */}
      <aside
        aria-label={t.atlas.details}
        className="border-t lg:border-t-0 lg:border-e border-line bg-coal lg:col-start-1 lg:row-start-1 lg:overflow-y-auto"
      >
        <div className="px-5 pt-5 pb-4 border-b border-line">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="eyebrow">{t.atlas.title}</h1>
              <p className="mt-2 text-[26px] font-semibold tabular-nums text-parchment leading-tight">{yearLabel}</p>
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="h-8 inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 text-[12px] text-sand hover:border-gold hover:text-gold"
            >
              {copied ? <Check aria-hidden="true" className="size-3.5" /> : <LinkIcon aria-hidden="true" className="size-3.5" />}
              <span aria-live="polite">{copied ? t.common.linkCopied : t.common.copyLink}</span>
            </button>
          </div>
          <p className="mt-2 text-[13px] text-dust">{t.atlas.intro}</p>
        </div>

        {/* Entities existing this year */}
        <section className="px-5 py-4 border-b border-line" aria-labelledby="atlas-entities">
          <h2 id="atlas-entities" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-dust mb-3">
            {fill(t.atlas.activeEntities, { year: yearLabel })}
            <span className="ms-2 text-gold tabular-nums">{formatNumber(activeEntities.length, locale)}</span>
          </h2>
          {activeEntities.length === 0 ? (
            <div className="rounded-md border border-dashed border-line px-4 py-5">
              <p className="text-[13.5px] text-parchment">{fill(t.atlas.noEntities, { year: yearLabel })}</p>
              <p className="mt-1.5 text-[12.5px] text-dust">{t.atlas.noEntitiesHint}</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {activeEntities.map((entity) => (
                <li key={entity.id}>
                  <EntityYearCard
                    entity={entity}
                    year={year}
                    selected={entity.id === selectedEntityId}
                    onSelect={() => setSelectedEntityId((current) => (current === entity.id ? null : entity.id))}
                    onJump={setYear}
                  />
                </li>
              ))}
            </ul>
          )}

          <label className="mt-4 flex items-start gap-2.5 text-[12.5px] text-sand cursor-pointer">
            <input
              type="checkbox"
              checked={showReference}
              onChange={(event) => setShowReference(event.target.checked)}
              className="mt-1 size-3.5 accent-[#c6a463]"
            />
            <span>
              {t.atlas.referenceToggle}
              <span className="block text-dust text-[12px] mt-0.5">{t.atlas.referenceHint}</span>
            </span>
          </label>
        </section>

        {/* Events near this year */}
        <section className="px-5 py-4 border-b border-line" aria-labelledby="atlas-events">
          <h2 id="atlas-events" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-dust mb-3">
            {fill(t.atlas.eventsNear, { span: formatNumber(EVENT_SPAN, locale) })}
          </h2>
          {nearbyEvents.length === 0 ? (
            <p className="text-[13px] text-dust">{t.atlas.noEventsNear}</p>
          ) : (
            <ul className="space-y-3">
              {nearbyEvents.map((event) => (
                <li key={event.id} className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-gold tabular-nums">{eventDate(event, locale)}</p>
                    <Link href={`/events/${event.slug}`} className="text-[14px] text-parchment hover:text-gold-bright">
                      {event.title[locale]}
                    </Link>
                    <p className="text-[12px] text-dust">{t.eventCategories[event.category]}</p>
                  </div>
                  {event.placeId ? (
                    <button
                      type="button"
                      onClick={() => setSelectedPlaceId(event.placeId ?? null)}
                      aria-label={`${t.common.showOnMap}: ${getPlace(event.placeId)?.name[locale] ?? ""}`}
                      title={`${t.common.showOnMap}: ${getPlace(event.placeId)?.name[locale] ?? ""}`}
                      className={cn(
                        "size-8 grid place-items-center rounded-md border shrink-0",
                        selectedPlaceId === event.placeId ? "border-gold text-gold" : "border-line text-dust hover:border-gold hover:text-gold",
                      )}
                    >
                      <MapPin aria-hidden="true" className="size-4" />
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="px-5 py-4" aria-labelledby="atlas-legend">
          <h2 id="atlas-legend" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-dust mb-3">
            {t.atlas.legend}
          </h2>
          <MapLegend />
        </section>
      </aside>
    </div>
  );
}

/** One entity as it stood in the selected year: its period and what the map can honestly show. */
function EntityYearCard({
  entity,
  year,
  selected,
  onSelect,
  onJump,
}: {
  entity: Entity;
  year: number;
  selected: boolean;
  onSelect: () => void;
  onJump: (year: number) => void;
}) {
  const { t, locale } = useI18n();
  const resolution = useMemo(() => resolveTerritory(entity.id, year, territories), [entity.id, year]);
  const periods = periodsAt(entity, year);
  const yearLabel = formatYear(year, locale);

  return (
    <div className={cn("rounded-md border transition-colors", selected ? "border-gold/70 bg-gold/[0.04]" : "border-line hover:border-line-strong")}>
      <button type="button" onClick={onSelect} aria-expanded={selected} className="w-full text-start px-3.5 py-3">
        <span className="flex items-center gap-2.5">
          <ColorSwatch color={entity.color} />
          <span className="font-medium text-parchment text-[14.5px] flex-1">{entity.name[locale]}</span>
          <Badge tone="gold">{t.kinds[entity.kind]}</Badge>
        </span>
        <span className="mt-1.5 block text-[12px] text-dust tabular-nums">{entityRange(entity, locale)}</span>
        {periods.length > 0 ? (
          <span className="mt-1 block text-[12.5px] text-sand">{periods.map((period) => period.name[locale]).join(" · ")}</span>
        ) : null}
      </button>

      <div className="px-3.5 pb-3 space-y-2">
        {resolution.shown.length > 0 ? (
          resolution.shown.map((territory) => (
            <OutlineNote key={territory.id} territory={territory} expanded={selected} />
          ))
        ) : (
          <div className="rounded-sm bg-slate/60 px-3 py-2">
            <p className="text-[12.5px] text-parchment">{fill(t.atlas.noOutline, { year: yearLabel })}</p>
            <p className="text-[12px] text-dust mt-0.5">{t.atlas.noOutlineHint}</p>
            {resolution.nearest && resolution.nearestYear !== null ? (
              <p className="mt-1.5 text-[12px] text-sand">
                {fill(t.atlas.nearestOutline, { year: formatYear(resolution.nearestYear, locale) })}{" "}
                <button
                  type="button"
                  onClick={() => onJump(resolution.nearestYear as number)}
                  className="text-gold underline underline-offset-2 hover:text-gold-bright"
                >
                  {fill(t.atlas.jumpToNearest, { year: formatYear(resolution.nearestYear, locale) })}
                </button>
              </p>
            ) : null}
          </div>
        )}

        {selected ? (
          <>
            <p className="text-[13px] text-sand">{entity.summary[locale]}</p>
            <Link
              href={`/entities/${entity.slug}`}
              className="inline-flex items-center gap-1 text-[13px] text-gold hover:text-gold-bright"
            >
              {t.common.readProfile}
              <ArrowUpRight aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}

/** What kind of shape is on the map, what it is based on and — when expanded — its caveats and sources. */
function OutlineNote({ territory, expanded }: { territory: TerritoryProperties; expanded: boolean }) {
  const { t, locale } = useI18n();
  const cited = getSources(territory.sourceIds);
  return (
    <div className="rounded-sm bg-slate/60 px-3 py-2 text-[12.5px]">
      <p className="text-parchment">
        <span className="font-medium">{territory.label[locale]}</span>
      </p>
      <p className="text-dust mt-0.5">
        {t.representation[territory.representation]} ·{" "}
        {fill(t.atlas.outlineBasis, { year: formatYear(territory.snapshotYear, locale, { approximate: true }) })}
      </p>
      {expanded ? (
        <dl className="mt-2 space-y-1.5 border-t border-line pt-2">
          <div>
            <dt className="text-dust text-[11.5px]">{t.atlas.caveats}</dt>
            <dd className="text-sand">{territory.notes[locale]}</dd>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div>
              <dt className="inline text-dust text-[11.5px]">{t.confidence.label}: </dt>
              <dd className="inline text-sand">{t.confidence[territory.confidence]}</dd>
            </div>
            <div>
              <dt className="inline text-dust text-[11.5px]">{t.atlas.validFor}: </dt>
              <dd className="inline text-sand tabular-nums">{territoryWindow(territory, locale)}</dd>
            </div>
          </div>
          <div>
            <dt className="text-dust text-[11.5px]">{t.common.sources}</dt>
            <dd className="text-sand" dir="ltr">
              {cited.map((source, index) => (
                <span key={source.id}>
                  {index > 0 ? "; " : ""}
                  <Link href={`/sources#source-${source.id}`} className="underline decoration-line-strong underline-offset-2 hover:text-gold">
                    {source.title}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
