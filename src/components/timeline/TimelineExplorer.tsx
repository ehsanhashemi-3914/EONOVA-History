"use client";

/**
 * TimelineExplorer — lifespans and events on one scale, with filters.
 *
 * State: the selected year and three filters. All of it is mirrored into the
 * URL (?y=…&region=…&category=…&entity=…) so a filtered view can be shared.
 * The event list is DERIVED with filterEvents() from src/lib/atlas — the same
 * function the unit tests exercise.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n";
import { entities, events, getEntity } from "@/data";
import { eventCategorySchema, regionSchema } from "@/data/schema";
import { filterEvents } from "@/lib/atlas";
import { formatNumber, formatYear, fromEra } from "@/lib/dates";
import { atlasHref, eventDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { LifespanChart } from "./LifespanChart";
import { TimeBar } from "./TimeBar";
import { PrecisionBadge } from "@/components/ui/cards";
import { Badge, buttonClass, ColorSwatch, EmptyState } from "@/components/ui/primitives";

export interface TimelineInitialState {
  year: number;
  region: string | null;
  category: string | null;
  entityId: string | null;
}

const ERA_JUMPS = [
  { key: "bronze", year: fromEra(2550, "BCE") },
  { key: "iron", year: fromEra(700, "BCE") },
  { key: "classical", year: fromEra(250, "BCE") },
  { key: "late", year: fromEra(400, "CE") },
] as const;

export function TimelineExplorer({ initial }: { initial: TimelineInitialState }) {
  const { t, locale } = useI18n();
  const [year, setYear] = useState(initial.year);
  const [region, setRegion] = useState<string | null>(initial.region);
  const [category, setCategory] = useState<string | null>(initial.category);
  const [entityId, setEntityId] = useState<string | null>(initial.entityId);

  useEffect(() => {
    const params = new URLSearchParams({ y: String(year) });
    if (region) params.set("region", region);
    if (category) params.set("category", category);
    if (entityId) params.set("entity", entityId);
    const timer = window.setTimeout(() => window.history.replaceState(null, "", `/timeline?${params.toString()}`), 250);
    return () => window.clearTimeout(timer);
  }, [year, region, category, entityId]);

  const filtered = useMemo(() => filterEvents(events, { region, category, entityId }), [region, category, entityId]);
  const hasFilters = Boolean(region || category || entityId);

  // Only offer filter values that actually occur in the dataset.
  const regions = regionSchema.options.filter((value) => events.some((event) => event.region === value));
  const categories = eventCategorySchema.options.filter((value) => events.some((event) => event.category === value));

  return (
    <div className="shell py-10 space-y-10">
      {/* Selected year */}
      <section aria-label={t.atlas.selectedYear} className="panel overflow-hidden">
        <div className="px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.timeline.jumpPeriods}>
            <span className="text-[12px] text-dust me-1">{t.timeline.jumpPeriods}</span>
            {ERA_JUMPS.map((era) => (
              <button
                key={era.key}
                type="button"
                onClick={() => setYear(era.year)}
                className="h-8 rounded-sm border border-line px-2.5 text-[12.5px] text-sand hover:border-gold hover:text-gold"
              >
                {t.timeline.eras[era.key]}
              </button>
            ))}
          </div>
          <Link href={atlasHref({ year })} className={buttonClass("primary", "h-9")}>
            {fill(t.common.openInAtlas, { year: formatYear(year, locale) })}
            <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
        <TimeBar year={year} onChange={setYear} />
      </section>

      {/* Lifespans */}
      <section aria-labelledby="timeline-lifespans">
        <h2 id="timeline-lifespans" className="text-[20px] font-semibold text-parchment mb-4">
          {t.timeline.lifespans}
        </h2>
        <LifespanChart selectedYear={year} onSelectYear={setYear} highlightEntityId={entityId} />
      </section>

      {/* Events */}
      <section aria-labelledby="timeline-events">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <h2 id="timeline-events" className="text-[20px] font-semibold text-parchment">
            {t.timeline.eventsTitle}
            <span className="ms-2.5 text-[13px] font-normal text-dust tabular-nums">
              {fill(t.common.resultsCount, { count: formatNumber(filtered.length, locale) })}
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-2.5">
            <FilterSelect
              id="filter-region"
              label={t.timeline.filterRegion}
              value={region}
              onChange={setRegion}
              allLabel={t.common.all}
              options={regions.map((value) => ({ value, label: t.regions[value] }))}
            />
            <FilterSelect
              id="filter-category"
              label={t.timeline.filterCategory}
              value={category}
              onChange={setCategory}
              allLabel={t.common.all}
              options={categories.map((value) => ({ value, label: t.eventCategories[value] }))}
            />
            <FilterSelect
              id="filter-entity"
              label={t.timeline.filterEntity}
              value={entityId}
              onChange={setEntityId}
              allLabel={t.common.all}
              options={entities.map((entity) => ({ value: entity.id, label: entity.name[locale] }))}
            />
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setRegion(null);
                  setCategory(null);
                  setEntityId(null);
                }}
                className="h-9 px-2.5 text-[12.5px] text-gold hover:text-gold-bright"
              >
                {t.common.clearFilters}
              </button>
            ) : null}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title={t.timeline.noEvents} />
        ) : (
          <ol className="panel divide-y divide-line">
            {filtered.map((event) => {
              const selected = year >= event.start.year && year <= (event.end?.year ?? event.start.year);
              return (
                <li key={event.id} className={cn("grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-4 md:px-6 py-3.5", selected && "bg-gold/[0.05]")}>
                  <button
                    type="button"
                    onClick={() => setYear(event.start.year)}
                    aria-pressed={selected}
                    title={fill(t.timeline.selected, { year: formatYear(event.start.year, locale) })}
                    className={cn("text-start text-[13px] tabular-nums pt-0.5 hover:text-gold-bright", selected ? "text-gold-bright font-semibold" : "text-gold")}
                  >
                    {eventDate(event, locale)}
                  </button>
                  <div className="min-w-0">
                    <Link href={`/events/${event.slug}`} className="font-medium text-parchment hover:text-gold-bright">
                      {event.title[locale]}
                    </Link>
                    <p className="mt-0.5 text-[13.5px] text-sand">{event.summary[locale]}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <Badge tone="muted">{t.eventCategories[event.category]}</Badge>
                      <span className="text-[12px] text-dust">{t.regions[event.region]}</span>
                      <PrecisionBadge precision={event.start.precision} t={t} />
                      {event.entityIds.map((id) => {
                        const entity = getEntity(id);
                        return entity ? (
                          <span key={id} className="inline-flex items-center gap-1.5 text-[12px] text-dust">
                            <ColorSwatch color={entity.color} className="size-2" />
                            {entity.name[locale]}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <Link
                    href={atlasHref({ year: event.start.year, placeId: event.placeId, entityId: event.entityIds[0] })}
                    title={t.common.showOnMap}
                    aria-label={`${t.common.showOnMap}: ${event.title[locale]}`}
                    className="size-8 grid place-items-center rounded-md border border-line text-dust hover:border-gold hover:text-gold"
                  >
                    <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-[12.5px] text-dust">
      {label}
      <select
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className={cn(
          "h-9 max-w-[13rem] rounded-sm border bg-ink px-2 text-[13px] text-parchment",
          value ? "border-gold" : "border-line",
        )}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
