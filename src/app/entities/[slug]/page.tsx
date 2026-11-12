/**
 * /entities/[slug] — one entity's profile.
 *
 * The folder name [slug] is a "dynamic segment": the same file serves
 * /entities/achaemenid-empire, /entities/han-dynasty, … and receives the
 * matching part of the URL as `params.slug`.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info, TriangleAlert } from "lucide-react";
import {
  eventsOfEntity,
  getEntity,
  getEntityBySlug,
  getPlace,
  getSources,
  peopleOfEntity,
  placesOfEntity,
  territories,
  territoriesOfEntity,
} from "@/data";
import { getI18n } from "@/i18n/server";
import { fill } from "@/i18n";
import { formatDated, formatDatedRange, formatNumber } from "@/lib/dates";
import { entityRange, yearForEntity } from "@/lib/format";
import { EntityMiniMap } from "@/components/entity/EntityMiniMap";
import { EventRow, PersonCard, PrecisionBadge } from "@/components/ui/cards";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { Badge, Block, ButtonLink, ColorSwatch } from "@/components/ui/primitives";
import { SourceList } from "@/components/ui/SourceList";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  const entity = getEntityBySlug(slug);
  if (!entity) return {};
  return { title: entity.name[locale], description: entity.summary[locale] };
}

export default async function EntityPage({ params }: { params: Params }) {
  const { slug } = await params;
  const entity = getEntityBySlug(slug);
  if (!entity) notFound();

  const { t, locale } = await getI18n();
  const relatedEvents = eventsOfEntity(entity.id);
  const relatedPeople = peopleOfEntity(entity.id);
  const relatedPlaces = placesOfEntity(entity.id);
  // Outlines this entity owns, plus shared ones (e.g. Ptolemaic Egypt for Ancient Egypt).
  const outlines = territoriesOfEntity(entity.id);
  const duration = entity.end.year - entity.start.year;
  const alternativeNames = entity.altNames[locale];

  return (
    <article>
      <header className="border-b border-line graticule">
        <div className="shell py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-[12.5px] text-dust mb-5">
            <Link href="/entities" className="hover:text-gold">
              {t.entities.title}
            </Link>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge tone="gold">{t.kinds[entity.kind]}</Badge>
                <span className="text-[13px] text-dust">{t.regions[entity.region]}</span>
              </div>
              <h1 className="mt-4 text-[30px] md:text-[42px] font-semibold tracking-tight text-parchment flex items-center gap-3.5">
                <ColorSwatch color={entity.color} className="size-3.5" />
                {entity.name[locale]}
              </h1>
              <p className="mt-3 text-[18px] text-gold tabular-nums">{entityRange(entity, locale)}</p>
              <p className="mt-4 text-sand text-[16px] max-w-2xl">{entity.summary[locale]}</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <FavoriteButton type="entity" id={entity.id} itemName={entity.name[locale]} />
              <ButtonLink href={`/compare?a=${entity.id}`}>{t.nav.compare}</ButtonLink>
            </div>
          </div>
        </div>
      </header>

      <div className="shell py-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* ── Main column ── */}
        <div className="min-w-0">
          <Block title={t.common.overview}>
            <div className="prose-atlas">
              {entity.overview.map((paragraph) => (
                <p key={paragraph.en.slice(0, 40)}>{paragraph[locale]}</p>
              ))}
            </div>
            <aside className="mt-6 flex gap-3 rounded-md border border-line bg-coal p-4 max-w-[68ch]">
              <Info aria-hidden="true" className="size-4 mt-1 shrink-0 text-gold" />
              <p className="text-[13.5px] text-sand">
                <span className="font-semibold text-parchment">
                  {t.common.type}: {t.kinds[entity.kind]}.{" "}
                </span>
                {entity.kindNote[locale]}
              </p>
            </aside>
          </Block>

          <Block title={t.common.politicalStructure}>
            <p className="prose-atlas">{entity.politicalStructure[locale]}</p>
          </Block>

          {entity.periods.length > 0 ? (
            <Block title={t.common.periods}>
              <ol className="border border-line rounded-lg overflow-hidden divide-y divide-line">
                {entity.periods.map((period) => (
                  <li key={period.id} className="grid sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] gap-x-5 gap-y-1 bg-coal px-4 py-3">
                    <p className="text-[13px] text-gold tabular-nums">{formatDatedRange(period.start, period.end, locale)}</p>
                    <div>
                      <p className="text-parchment font-medium text-[14.5px]">{period.name[locale]}</p>
                      {period.note ? <p className="text-[13px] text-sand mt-0.5">{period.note[locale]}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </Block>
          ) : null}

          {entity.achievements.length > 0 ? (
            <Block title={t.common.achievements}>
              <ul className="space-y-2.5 max-w-[68ch]">
                {entity.achievements.map((item) => (
                  <li key={item.en.slice(0, 40)} className="flex gap-3 text-[15px] text-parchment">
                    <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rotate-45 bg-gold" />
                    {item[locale]}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {entity.relations.length > 0 ? (
            <Block title={t.common.relations}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {entity.relations.map((relation) => {
                  const other = getEntity(relation.entityId);
                  if (!other) return null;
                  return (
                    <li key={relation.entityId} className="panel p-4">
                      <p className="text-[11.5px] uppercase tracking-[0.12em] text-dust">{t.relationTypes[relation.type]}</p>
                      <p className="mt-1.5 flex items-center gap-2 font-medium">
                        <ColorSwatch color={other.color} />
                        <Link href={`/entities/${other.slug}`} className="text-parchment hover:text-gold">
                          {other.name[locale]}
                        </Link>
                      </p>
                      <p className="mt-1.5 text-[13.5px] text-sand">{relation.note[locale]}</p>
                    </li>
                  );
                })}
              </ul>
            </Block>
          ) : null}

          {relatedEvents.length > 0 ? (
            <Block title={t.common.events}>
              <div>
                {relatedEvents.map((event) => (
                  <EventRow key={event.id} event={event} t={t} locale={locale} />
                ))}
              </div>
            </Block>
          ) : null}

          {relatedPeople.length > 0 ? (
            <Block title={t.common.people}>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedPeople.map((person) => (
                  <PersonCard key={person.id} person={person} t={t} locale={locale} />
                ))}
              </div>
            </Block>
          ) : null}

          {entity.uncertainty.length > 0 ? (
            <Block title={t.common.uncertainty}>
              <ul className="space-y-3 max-w-[68ch]">
                {entity.uncertainty.map((item) => (
                  <li key={item.en.slice(0, 40)} className="flex gap-3 rounded-md border border-ember/30 bg-ember/[0.05] p-4 text-[14px] text-parchment">
                    <TriangleAlert aria-hidden="true" className="size-4 mt-1 shrink-0 text-ember" />
                    {item[locale]}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          <SourceList sources={getSources(entity.sourceIds)} t={t} locale={locale} />
        </div>

        {/* ── Side column ── */}
        <aside className="space-y-6 lg:sticky lg:top-[84px] lg:self-start">
          <section aria-labelledby="map-heading">
            <h2 id="map-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">
              {t.entity.mapTitle}
            </h2>
            <EntityMiniMap
              entityId={entity.id}
              fallbackYear={yearForEntity(entity, territories)}
              outlines={outlines}
            />
            <p className="mt-2 text-[12px] text-dust">{t.atlas.legendNote}</p>
          </section>

          <section aria-labelledby="facts-heading" className="panel p-5">
            <h2 id="facts-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">
              {t.entity.keyFacts}
            </h2>
            <dl className="space-y-3.5 text-[13.5px]">
              <Fact term={t.common.type}>{t.kinds[entity.kind]}</Fact>
              <Fact term={t.common.period}>
                <span className="tabular-nums">{entityRange(entity, locale)}</span>
                <span className="mt-1.5 flex flex-wrap gap-1.5">
                  <PrecisionBadge precision={entity.start.precision} t={t} />
                </span>
                {entity.start.note ? (
                  <span className="mt-1.5 block text-[12.5px] text-dust">
                    {formatDated(entity.start, locale)}: {entity.start.note[locale]}
                  </span>
                ) : null}
                {entity.end.note ? (
                  <span className="mt-1.5 block text-[12.5px] text-dust">
                    {formatDated(entity.end, locale)}: {entity.end.note[locale]}
                  </span>
                ) : null}
              </Fact>
              <Fact term={t.entity.duration}>{fill(t.common.years, { count: formatNumber(duration, locale) })}</Fact>
              <Fact term={t.common.region}>{entity.regionLabel[locale]}</Fact>
              {alternativeNames.length > 0 ? <Fact term={t.common.altNames}>{alternativeNames.join(locale === "fa" ? "، " : ", ")}</Fact> : null}
              <Fact term={t.common.capitals}>
                <ul className="space-y-1.5">
                  {entity.capitals.map((capital) => {
                    const place = getPlace(capital.placeId);
                    return place ? (
                      <li key={capital.placeId}>
                        <span className="text-parchment">{place.name[locale]}</span>
                        {capital.note ? <span className="text-dust"> — {capital.note[locale]}</span> : null}
                      </li>
                    ) : null;
                  })}
                </ul>
              </Fact>
            </dl>
          </section>

          {relatedPlaces.length > 0 ? (
            <section aria-labelledby="places-heading" className="panel p-5">
              <h2 id="places-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">
                {t.common.relatedPlaces}
              </h2>
              <ul className="space-y-3 text-[13.5px]">
                {relatedPlaces.map((place) => (
                  <li key={place.id}>
                    <p className="text-parchment">
                      {place.name[locale]} <span className="text-dust text-[12px]">· {t.placeKinds[place.kind]}</span>
                    </p>
                    <p className="text-[12.5px] text-dust">{place.modernLocation[locale]}</p>
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

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11.5px] uppercase tracking-[0.12em] text-dust">{term}</dt>
      <dd className="mt-1 text-parchment">{children}</dd>
    </div>
  );
}
