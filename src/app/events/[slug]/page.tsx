/** /events/[slug] — one event's detail page. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import { events, getEntity, getEventBySlug, getPerson, getPlace, getSources } from "@/data";
import { getI18n } from "@/i18n/server";
import { fill } from "@/i18n";
import { formatCentury, formatYear } from "@/lib/dates";
import { atlasHref, eventDate, personDateLine } from "@/lib/format";
import { PrecisionBadge } from "@/components/ui/cards";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { Badge, Block, ButtonLink, ColorSwatch } from "@/components/ui/primitives";
import { SourceList } from "@/components/ui/SourceList";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  const event = getEventBySlug(slug);
  if (!event) return {};
  return { title: event.title[locale], description: event.summary[locale] };
}

export default async function EventPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const { t, locale } = await getI18n();
  const place = event.placeId ? getPlace(event.placeId) : undefined;
  const involvedEntities = event.entityIds.map((id) => getEntity(id)).filter((entity) => entity !== undefined);
  const involvedPeople = event.personIds.map((id) => getPerson(id)).filter((person) => person !== undefined);

  // Neighbours in time, for "previous / next" navigation.
  const index = events.findIndex((candidate) => candidate.id === event.id);
  const previous = index > 0 ? events[index - 1] : undefined;
  const next = index < events.length - 1 ? events[index + 1] : undefined;

  return (
    <article>
      <header className="border-b border-line graticule">
        <div className="shell py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-[12.5px] text-dust mb-5">
            <Link href="/events" className="hover:text-gold">
              {t.events.title}
            </Link>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge tone="gold">{t.eventCategories[event.category]}</Badge>
                <span className="text-[13px] text-dust">{t.regions[event.region]}</span>
                <PrecisionBadge precision={event.start.precision} t={t} />
              </div>
              <h1 className="mt-4 text-[28px] md:text-[40px] font-semibold tracking-tight text-parchment">{event.title[locale]}</h1>
              <p className="mt-3 text-[18px] text-gold tabular-nums">
                {eventDate(event, locale)}
                <span className="ms-3 text-[13px] text-dust">{formatCentury(event.start.year, locale)}</span>
              </p>
              <p className="mt-4 text-sand text-[16px] max-w-2xl">{event.summary[locale]}</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <FavoriteButton type="event" id={event.id} itemName={event.title[locale]} />
              <ButtonLink href={atlasHref({ year: event.start.year, placeId: event.placeId, entityId: event.entityIds[0] })} variant="primary">
                {fill(t.common.openInAtlas, { year: formatYear(event.start.year, locale) })}
                <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </header>

      <div className="shell py-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <Block title={t.common.overview}>
            <div className="prose-atlas">
              {event.overview.map((paragraph) => (
                <p key={paragraph.en.slice(0, 40)}>{paragraph[locale]}</p>
              ))}
            </div>
          </Block>

          <Block title={t.common.significance}>
            <p className="prose-atlas border-s-2 border-gold ps-4">{event.significance[locale]}</p>
          </Block>

          {event.uncertainty ? (
            <Block title={t.common.uncertainty}>
              <p className="flex gap-3 rounded-md border border-ember/30 bg-ember/[0.05] p-4 text-[14px] text-parchment max-w-[68ch]">
                <TriangleAlert aria-hidden="true" className="size-4 mt-1 shrink-0 text-ember" />
                {event.uncertainty[locale]}
              </p>
            </Block>
          ) : null}

          <SourceList sources={getSources(event.sourceIds)} t={t} locale={locale} />

          <nav aria-label={t.common.relatedEvents} className="mt-4 grid gap-3 sm:grid-cols-2 border-t border-line pt-6">
            {previous ? (
              <Link href={`/events/${previous.slug}`} className="panel p-4 hover:border-line-strong">
                <span className="block text-[12px] text-gold tabular-nums">{eventDate(previous, locale)}</span>
                <span className="block text-parchment mt-0.5">{previous.title[locale]}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/events/${next.slug}`} className="panel p-4 hover:border-line-strong text-end">
                <span className="block text-[12px] text-gold tabular-nums">{eventDate(next, locale)}</span>
                <span className="block text-parchment mt-0.5">{next.title[locale]}</span>
              </Link>
            ) : null}
          </nav>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-[84px] lg:self-start">
          <section className="panel p-5" aria-labelledby="where-heading">
            <h2 id="where-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">
              {t.event.takesPlaceAt}
            </h2>
            {place ? (
              <>
                <p className="text-parchment font-medium">{place.name[locale]}</p>
                <p className="text-[12.5px] text-dust mt-0.5">
                  {t.common.modernLocation}: {place.modernLocation[locale]}
                </p>
                {place.approximateLocation ? (
                  <Badge tone="warn" className="mt-2">
                    {t.common.approximateLocation}
                  </Badge>
                ) : null}
                <p className="mt-2.5 text-[13.5px] text-sand">{place.description[locale]}</p>
              </>
            ) : (
              <p className="text-[13.5px] text-sand">{t.event.noPlace}</p>
            )}
          </section>

          <section className="panel p-5" aria-labelledby="involved-heading">
            <h2 id="involved-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">
              {t.event.involved}
            </h2>
            <ul className="space-y-2.5">
              {involvedEntities.map((entity) => (
                <li key={entity.id} className="flex items-center gap-2.5 text-[14px]">
                  <ColorSwatch color={entity.color} />
                  <Link href={`/entities/${entity.slug}`} className="text-parchment hover:text-gold">
                    {entity.name[locale]}
                  </Link>
                  <span className="text-[12px] text-dust">{t.kinds[entity.kind]}</span>
                </li>
              ))}
            </ul>
          </section>

          {involvedPeople.length > 0 ? (
            <section className="panel p-5" aria-labelledby="people-heading">
              <h2 id="people-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">
                {t.common.relatedPeople}
              </h2>
              <ul className="space-y-3">
                {involvedPeople.map((person) => (
                  <li key={person.id} className="text-[14px]">
                    <Link href={`/people/${person.slug}`} className="text-parchment hover:text-gold">
                      {person.name[locale]}
                    </Link>
                    <p className="text-[12.5px] text-dust">
                      {person.role[locale]}
                      {personDateLine(person, locale) ? <span className="tabular-nums"> · {personDateLine(person, locale)}</span> : null}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
