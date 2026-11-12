"use client";

/**
 * The saved-items page body. It must be a Client Component: the list lives in
 * the visitor's own browser (localStorage), which the server cannot see.
 */
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { getEntity, getEvent, getPerson } from "@/data";
import { parseFavoriteKey, useFavorites, type FavoriteType } from "@/lib/storage/favorites";
import { entityRange, eventDate, personDateLine } from "@/lib/format";
import { FavoriteButton } from "./FavoriteButton";
import { Button, ButtonLink, ColorSwatch, EmptyState } from "./primitives";

interface Row {
  type: FavoriteType;
  id: string;
  href: string;
  title: string;
  meta: string;
  color?: string;
}

export function FavoritesList() {
  const { t, locale } = useI18n();
  const { favorites, clear } = useFavorites();

  // Turn stored keys back into records; keys whose record no longer exists are skipped.
  const rows: Row[] = favorites.flatMap((key): Row[] => {
    const { type, id } = parseFavoriteKey(key);
    if (type === "entity") {
      const entity = getEntity(id);
      return entity
        ? [{ type, id, href: `/entities/${entity.slug}`, title: entity.name[locale], meta: `${t.kinds[entity.kind]} · ${entityRange(entity, locale)}`, color: entity.color }]
        : [];
    }
    if (type === "event") {
      const event = getEvent(id);
      return event ? [{ type, id, href: `/events/${event.slug}`, title: event.title[locale], meta: eventDate(event, locale) }] : [];
    }
    const person = getPerson(id);
    return person
      ? [{ type, id, href: `/people/${person.slug}`, title: person.name[locale], meta: [person.role[locale], personDateLine(person, locale)].filter(Boolean).join(" · ") }]
      : [];
  });

  if (rows.length === 0) {
    return (
      <EmptyState title={t.favorites.empty} hint={t.favorites.emptyHint}>
        <ButtonLink href="/entities">{t.home.browseEntities}</ButtonLink>
      </EmptyState>
    );
  }

  const groups: { type: FavoriteType; title: string }[] = [
    { type: "entity", title: t.favorites.groupEntities },
    { type: "event", title: t.favorites.groupEvents },
    { type: "person", title: t.favorites.groupPeople },
  ];

  return (
    <div className="max-w-3xl">
      <div className="flex justify-end mb-4">
        <Button variant="ghost" onClick={clear}>
          <Trash2 aria-hidden="true" className="size-4" />
          {t.favorites.clear}
        </Button>
      </div>
      <div className="space-y-8">
        {groups.map((group) => {
          const items = rows.filter((row) => row.type === group.type);
          if (items.length === 0) return null;
          return (
            <section key={group.type} aria-label={group.title}>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">{group.title}</h2>
              <ul className="panel divide-y divide-line">
                {items.map((row) => (
                  <li key={`${row.type}:${row.id}`} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2.5">
                        {row.color ? <ColorSwatch color={row.color} /> : null}
                        <Link href={row.href} className="font-medium text-parchment hover:text-gold">
                          {row.title}
                        </Link>
                      </p>
                      <p className="text-[12.5px] text-dust tabular-nums mt-0.5">{row.meta}</p>
                    </div>
                    <FavoriteButton type={row.type} id={row.id} itemName={row.title} compact />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
