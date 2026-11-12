"use client";

/**
 * LifespanChart — one horizontal bar per entity on a shared time axis.
 *
 * Positions are percentages of the atlas' time span, applied with CSS *logical*
 * properties (inset-inline-start). In Persian (right-to-left) the same numbers
 * therefore run from the right edge, so time flows the way the text does.
 *
 * Two modes:
 *   - with `onSelectYear`: bars and event dots are buttons that move the year;
 *   - without it: they are plain links to profile and event pages.
 */
import Link from "next/link";
import { useI18n } from "@/i18n/LocaleProvider";
import { entities, eventsOfEntity } from "@/data";
import { yearToPercent } from "@/data/milestones";
import { ATLAS_MAX_YEAR, ATLAS_MIN_YEAR, clampYear, formatYear } from "@/lib/dates";
import { entityRange, eventDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const TICKS = [-3499, -2999, -2499, -1999, -1499, -999, -499, 1, 500, 700];

const position = (year: number) => yearToPercent(year, ATLAS_MIN_YEAR, ATLAS_MAX_YEAR);

export function LifespanChart({
  selectedYear,
  onSelectYear,
  highlightEntityId,
}: {
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
  highlightEntityId?: string | null;
}) {
  const { t, locale } = useI18n();

  return (
    <div className="panel p-4 md:p-6">
      {/* Axis */}
      <div className="md:ps-[230px]" aria-hidden="true">
        <div className="relative h-5 text-[10.5px] text-dust tabular-nums">
          {TICKS.map((tick, index) => (
            <span
              key={tick}
              className={cn(
                "absolute whitespace-nowrap",
                index === 0 ? "" : index === TICKS.length - 1 ? "" : "-translate-x-1/2 rtl:translate-x-1/2",
                index % 2 === 1 && index !== TICKS.length - 1 ? "hidden lg:inline" : "",
              )}
              style={index === TICKS.length - 1 ? { insetInlineEnd: 0 } : { insetInlineStart: `${position(tick)}%` }}
            >
              {formatYear(tick, locale)}
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-1 space-y-3 md:space-y-1.5" aria-label={t.timeline.axisLabel}>
        {entities.map((entity) => {
          const start = position(entity.start.year);
          const end = position(entity.end.year);
          const continues = entity.end.year > ATLAS_MAX_YEAR;
          const active = selectedYear !== undefined && selectedYear >= entity.start.year && selectedYear <= entity.end.year;
          const dimmed = highlightEntityId ? highlightEntityId !== entity.id : false;
          return (
            <li key={entity.id} className={cn("md:grid md:grid-cols-[230px_minmax(0,1fr)] md:items-center", dimmed && "opacity-45")}>
              <div className="md:pe-4 pb-1 md:pb-0 flex md:block items-baseline justify-between gap-3">
                <Link href={`/entities/${entity.slug}`} className={cn("text-[13.5px] hover:text-gold", active ? "text-parchment font-medium" : "text-sand")}>
                  {entity.name[locale]}
                </Link>
                <p className="text-[11.5px] text-dust tabular-nums">{entityRange(entity, locale)}</p>
              </div>

              <div className="relative h-7 rounded-sm bg-ink/70">
                {/* gridlines */}
                {TICKS.slice(1, -1).map((tick) => (
                  <span key={tick} aria-hidden="true" className="absolute inset-y-0 w-px bg-line/60" style={{ insetInlineStart: `${position(tick)}%` }} />
                ))}

                <Bar
                  label={`${entity.name[locale]} — ${entityRange(entity, locale)}`}
                  href={`/entities/${entity.slug}`}
                  onClick={onSelectYear ? () => onSelectYear(clampYear(entity.start.year)) : undefined}
                  style={{
                    insetInlineStart: `${start}%`,
                    width: `${Math.max(end - start, 0.5)}%`,
                    backgroundColor: entity.color,
                    opacity: active || selectedYear === undefined ? 0.9 : 0.5,
                  }}
                  className={cn("absolute top-2 h-3", continues ? "rounded-s-sm" : "rounded-sm")}
                />
                {continues ? (
                  <span
                    title={t.timeline.continuesAfter}
                    aria-label={t.timeline.continuesAfter}
                    className="absolute top-2 end-0 h-3 w-2 translate-x-full rtl:-translate-x-full"
                    style={{ background: `repeating-linear-gradient(90deg, ${entity.color} 0 2px, transparent 2px 4px)` }}
                  />
                ) : null}

                {/* events of this entity */}
                {eventsOfEntity(entity.id)
                  .filter((event) => event.entityIds[0] === entity.id)
                  .map((event) => {
                    const label = `${event.title[locale]} — ${eventDate(event, locale)}`;
                    const dotClass =
                      "absolute top-[9px] size-2.5 -translate-x-1/2 rtl:translate-x-1/2 rounded-full border-2 border-ink bg-parchment hover:bg-gold-bright hover:scale-125 transition-transform";
                    const style = { insetInlineStart: `${position(event.start.year)}%` };
                    return onSelectYear ? (
                      <button key={event.id} type="button" title={label} aria-label={label} onClick={() => onSelectYear(event.start.year)} className={dotClass} style={style} />
                    ) : (
                      <Link key={event.id} href={`/events/${event.slug}`} title={label} aria-label={label} className={dotClass} style={style} />
                    );
                  })}

                {selectedYear !== undefined ? (
                  <span aria-hidden="true" className="absolute -inset-y-1 w-px bg-gold" style={{ insetInlineStart: `${position(selectedYear)}%` }} />
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Bar({
  label,
  href,
  onClick,
  style,
  className,
}: {
  label: string;
  href: string;
  onClick?: () => void;
  style: React.CSSProperties;
  className: string;
}) {
  return onClick ? (
    <button type="button" onClick={onClick} title={label} aria-label={label} style={style} className={className} />
  ) : (
    <Link href={href} title={label} aria-label={label} style={style} className={className} />
  );
}
