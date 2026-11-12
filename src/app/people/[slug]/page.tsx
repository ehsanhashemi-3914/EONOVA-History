/** /people/[slug] — one person's profile. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { eventsOfPerson, getEntity, getPersonBySlug, getPlace, getSources, peopleOfEntity } from "@/data";
import { getI18n } from "@/i18n/server";
import { formatDated, formatDatedRange } from "@/lib/dates";
import { atlasHref, personDateLine } from "@/lib/format";
import { EventRow, PrecisionBadge } from "@/components/ui/cards";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { Block, ButtonLink, ColorSwatch } from "@/components/ui/primitives";
import { SourceList } from "@/components/ui/SourceList";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  const person = getPersonBySlug(slug);
  if (!person) return {};
  return { title: person.name[locale], description: person.summary[locale] };
}

export default async function PersonPage({ params }: { params: Params }) {
  const { slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) notFound();

  const { t, locale } = await getI18n();
  const entity = getEntity(person.entityId);
  const relatedEvents = eventsOfPerson(person.id);
  const relatedPlaces = person.placeIds.map((id) => getPlace(id)).filter((place) => place !== undefined);
  const others = peopleOfEntity(person.entityId).filter((other) => other.id !== person.id);
  const alternativeNames = person.altNames[locale];
  const atlasYear = person.reign?.start.year ?? person.death?.year ?? person.birth?.year;

  return (
    <article>
      <header className="border-b border-line graticule">
        <div className="shell py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-[12.5px] text-dust mb-5">
            <Link href="/people" className="hover:text-gold">
              {t.peoplePage.title}
            </Link>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              {entity ? (
                <p className="flex items-center gap-2.5 text-[13px]">
                  <ColorSwatch color={entity.color} />
                  <Link href={`/entities/${entity.slug}`} className="text-sand hover:text-gold">
                    {entity.name[locale]}
                  </Link>
                </p>
              ) : null}
              <h1 className="mt-4 text-[28px] md:text-[40px] font-semibold tracking-tight text-parchment">{person.name[locale]}</h1>
              <p className="mt-2 text-[17px] text-sand">{person.role[locale]}</p>
              {personDateLine(person, locale) ? (
                <p className="mt-3 text-[18px] text-gold tabular-nums">
                  {person.reign ? <span className="text-[13px] text-dust me-2">{t.common.reign}</span> : null}
                  {personDateLine(person, locale)}
                </p>
              ) : null}
              <p className="mt-4 text-sand text-[16px] max-w-2xl">{person.summary[locale]}</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <FavoriteButton type="person" id={person.id} itemName={person.name[locale]} />
              {atlasYear !== undefined ? (
                <ButtonLink href={atlasHref({ year: atlasYear, entityId: person.entityId })}>{t.common.showOnMap}</ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="shell py-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <Block title={t.common.overview}>
            <div className="prose-atlas">
              {person.overview.map((paragraph) => (
                <p key={paragraph.en.slice(0, 40)}>{paragraph[locale]}</p>
              ))}
            </div>
          </Block>

          {person.contributions.length > 0 ? (
            <Block title={t.common.contributions}>
              <ul className="space-y-2.5 max-w-[68ch]">
                {person.contributions.map((item) => (
                  <li key={item.en.slice(0, 40)} className="flex gap-3 text-[15px] text-parchment">
                    <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rotate-45 bg-gold" />
                    {item[locale]}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {relatedEvents.length > 0 ? (
            <Block title={t.common.relatedEvents}>
              <div>
                {relatedEvents.map((event) => (
                  <EventRow key={event.id} event={event} t={t} locale={locale} />
                ))}
              </div>
            </Block>
          ) : null}

          {person.uncertainty ? (
            <Block title={t.common.uncertainty}>
              <p className="flex gap-3 rounded-md border border-ember/30 bg-ember/[0.05] p-4 text-[14px] text-parchment max-w-[68ch]">
                <TriangleAlert aria-hidden="true" className="size-4 mt-1 shrink-0 text-ember" />
                {person.uncertainty[locale]}
              </p>
            </Block>
          ) : null}

          <SourceList sources={getSources(person.sourceIds)} t={t} locale={locale} />
          <p className="mt-2 text-[12.5px] text-dust">{t.person.noQuotes}</p>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-[84px] lg:self-start">
          <section className="panel p-5" aria-labelledby="dates-heading">
            <h2 id="dates-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">
              {t.person.datesTitle}
            </h2>
            <dl className="space-y-3.5 text-[13.5px]">
              {person.birth ? (
                <DateFact term={t.common.born} value={formatDated(person.birth, locale)}>
                  <PrecisionBadge precision={person.birth.precision} t={t} />
                </DateFact>
              ) : null}
              {person.reign ? (
                <DateFact term={t.common.reign} value={formatDatedRange(person.reign.start, person.reign.end, locale)}>
                  <PrecisionBadge precision={person.reign.start.precision === "disputed" ? "disputed" : person.reign.start.precision === "approximate" || person.reign.end.precision === "approximate" ? "approximate" : "exact"} t={t} />
                </DateFact>
              ) : null}
              {person.death ? (
                <DateFact term={t.common.died} value={formatDated(person.death, locale)}>
                  <PrecisionBadge precision={person.death.precision} t={t} />
                </DateFact>
              ) : null}
              {alternativeNames.length > 0 ? (
                <div>
                  <dt className="text-[11.5px] uppercase tracking-[0.12em] text-dust">{t.common.altNames}</dt>
                  <dd className="mt-1 text-parchment">{alternativeNames.join(locale === "fa" ? "، " : ", ")}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          {relatedPlaces.length > 0 ? (
            <section className="panel p-5" aria-labelledby="places-heading">
              <h2 id="places-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">
                {t.common.relatedPlaces}
              </h2>
              <ul className="space-y-2.5 text-[13.5px]">
                {relatedPlaces.map((place) => (
                  <li key={place.id}>
                    <Link
                      href={atlasHref({ year: atlasYear ?? 1, placeId: place.id, entityId: person.entityId })}
                      className="text-parchment hover:text-gold"
                    >
                      {place.name[locale]}
                    </Link>
                    <span className="text-dust text-[12px]"> · {t.placeKinds[place.kind]}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {others.length > 0 ? (
            <section className="panel p-5" aria-labelledby="others-heading">
              <h2 id="others-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">
                {t.common.relatedPeople}
              </h2>
              <ul className="space-y-2.5 text-[13.5px]">
                {others.map((other) => (
                  <li key={other.id}>
                    <Link href={`/people/${other.slug}`} className="text-parchment hover:text-gold">
                      {other.name[locale]}
                    </Link>
                    {personDateLine(other, locale) ? <span className="text-dust text-[12px] tabular-nums"> · {personDateLine(other, locale)}</span> : null}
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

function DateFact({ term, value, children }: { term: string; value: string; children?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11.5px] uppercase tracking-[0.12em] text-dust">{term}</dt>
      <dd className="mt-1 text-parchment tabular-nums flex flex-wrap items-center gap-2">
        {value}
        {children}
      </dd>
    </div>
  );
}
