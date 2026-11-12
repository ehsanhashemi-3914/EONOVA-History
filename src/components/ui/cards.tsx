/**
 * Cards and rows for the three main record types. Server-renderable: the only
 * interactive part (the bookmark button) is its own small Client Component.
 */
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import type { Entity, HistoricalEvent, Person } from "@/data/schema";
import { entityRange, eventDate, personDateLine } from "@/lib/format";
import { Badge, ColorSwatch } from "./primitives";
import { FavoriteButton } from "./FavoriteButton";

interface Localized {
  t: Dictionary;
  locale: Locale;
}

export function PrecisionBadge({ precision, t }: { precision: "exact" | "approximate" | "disputed"; t: Dictionary }) {
  if (precision === "exact") return null;
  return <Badge tone={precision === "disputed" ? "warn" : "muted"}>{t.precision[precision]}</Badge>;
}

export function EntityCard({ entity, t, locale }: Localized & { entity: Entity }) {
  return (
    <article className="group relative panel p-5 transition-colors hover:border-line-strong">
      <div className="flex items-start justify-between gap-3">
        <Badge tone="gold">{t.kinds[entity.kind]}</Badge>
        <FavoriteButton type="entity" id={entity.id} itemName={entity.name[locale]} compact className="relative z-10 -mt-1 -me-1" />
      </div>
      <h3 className="mt-4 text-[18px] font-semibold text-parchment flex items-center gap-2.5">
        <ColorSwatch color={entity.color} />
        <Link href={`/entities/${entity.slug}`} className="after:absolute after:inset-0 group-hover:text-gold-bright">
          {entity.name[locale]}
        </Link>
      </h3>
      <p className="mt-1 text-[13px] text-gold/90 tabular-nums">{entityRange(entity, locale)}</p>
      <p className="mt-3 text-[13.5px] text-sand line-clamp-3">{entity.summary[locale]}</p>
      <p className="mt-4 text-[12px] text-dust">{t.regions[entity.region]}</p>
    </article>
  );
}

export function EventRow({
  event,
  t,
  locale,
  entityNames,
  showFavorite = true,
}: Localized & { event: HistoricalEvent; entityNames?: string[]; showFavorite?: boolean }) {
  return (
    <article className="group relative grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_auto] gap-x-5 gap-y-1 py-4 border-t border-line first:border-t-0">
      <p className="text-[13px] text-gold tabular-nums pt-0.5">{eventDate(event, locale)}</p>
      <div className="min-w-0">
        <h3 className="font-medium text-parchment">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0 group-hover:text-gold-bright">
            {event.title[locale]}
          </Link>
        </h3>
        <p className="mt-1 text-[13.5px] text-sand">{event.summary[locale]}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone="muted">{t.eventCategories[event.category]}</Badge>
          <PrecisionBadge precision={event.start.precision} t={t} />
          {entityNames?.map((name) => (
            <span key={name} className="text-[12px] text-dust">
              {name}
            </span>
          ))}
        </div>
      </div>
      {showFavorite ? <FavoriteButton type="event" id={event.id} itemName={event.title[locale]} compact className="relative z-10" /> : <span />}
    </article>
  );
}

export function PersonCard({ person, t, locale, entityName, color }: Localized & { person: Person; entityName?: string; color?: string }) {
  const dates = personDateLine(person, locale);
  return (
    <article className="group relative panel p-5 transition-colors hover:border-line-strong">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] text-dust flex items-center gap-2">
          {color ? <ColorSwatch color={color} /> : null}
          {entityName}
        </p>
        <FavoriteButton type="person" id={person.id} itemName={person.name[locale]} compact className="relative z-10 -mt-1 -me-1" />
      </div>
      <h3 className="mt-3 text-[17px] font-semibold text-parchment">
        <Link href={`/people/${person.slug}`} className="after:absolute after:inset-0 group-hover:text-gold-bright">
          {person.name[locale]}
        </Link>
      </h3>
      <p className="mt-1 text-[13px] text-sand">{person.role[locale]}</p>
      {dates ? (
        <p className="mt-2 text-[12.5px] text-gold/90 tabular-nums">
          {person.reign ? `${t.common.reign}: ` : ""}
          {dates}
        </p>
      ) : null}
    </article>
  );
}
