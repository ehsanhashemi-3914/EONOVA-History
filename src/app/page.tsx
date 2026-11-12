/**
 * / — the home page.
 *
 * A Server Component: the text, lists and links are rendered to HTML on the
 * server. Only two islands are interactive Client Components — the live atlas
 * preview and the lifespan chart.
 */
import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, MapPinned, ScanSearch } from "lucide-react";
import { entities, events, getEntity, getEvent, people, sources } from "@/data";
import { milestones } from "@/data/milestones";
import { getI18n } from "@/i18n/server";
import { formatNumber, formatYear } from "@/lib/dates";
import { atlasHref } from "@/lib/format";
import { HomeAtlasPreview } from "@/components/home/HomeAtlasPreview";
import { LifespanChart } from "@/components/timeline/LifespanChart";
import { LogoMark } from "@/components/layout/Logo";
import { EntityCard, EventRow } from "@/components/ui/cards";
import { ButtonLink, SectionHeading } from "@/components/ui/primitives";

/** A cross-section of the collection: one or two events per region and era. */
const FEATURED_EVENT_IDS = [
  "capture-of-babylon",
  "battle-of-gaugamela",
  "kalinga-war",
  "mission-of-zhang-qian",
  "battle-of-edessa",
  "end-of-the-western-roman-empire",
];

const METHOD_ICONS = [BookOpenCheck, ScanSearch, MapPinned];

export default async function HomePage() {
  const { t, locale } = await getI18n();
  const featuredEvents = FEATURED_EVENT_IDS.map((id) => getEvent(id)).filter((event) => event !== undefined);

  const stats = [
    { value: entities.length, label: t.home.stats.entities },
    { value: events.length, label: t.home.stats.events },
    { value: people.length, label: t.home.stats.people },
    { value: sources.length, label: t.home.stats.sources },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-line graticule">
        <LogoMark className="pointer-events-none absolute -end-24 -top-24 size-[520px] text-gold/[0.045]" />
        <div className="shell relative py-16 md:py-24">
          <p className="eyebrow">{t.home.eyebrow}</p>
          <h1 className="mt-5 text-[40px] md:text-[64px] font-semibold tracking-tight text-parchment leading-[1.05]">
            {/* The Latin brand name keeps its own left-to-right order but follows the page's alignment. */}
            <span dir="ltr" className="inline-block">
              EONOVA <span className="text-gold">ATLAS</span>
            </span>
          </h1>
          <p className="mt-4 text-[20px] md:text-[26px] text-parchment/90 font-light">{t.meta.tagline}</p>
          <p className="mt-6 max-w-2xl text-sand text-[16px]">{t.home.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/atlas" variant="primary" className="h-11 px-5 text-[15px]">
              {t.common.openAtlas}
              <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </ButtonLink>
            <ButtonLink href="/entities" className="h-11 px-5 text-[15px]">
              {t.home.browseEntities}
            </ButtonLink>
          </div>

          <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line rounded-lg overflow-hidden max-w-3xl">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-coal px-5 py-4">
                <dd className="text-[26px] font-semibold tabular-nums text-parchment">{formatNumber(stat.value, locale)}</dd>
                <dt className="text-[12.5px] text-dust">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Atlas preview ── */}
      <section className="shell py-16 md:py-20">
        <SectionHeading
          eyebrow={t.home.previewEyebrow}
          title={t.home.previewTitle}
          text={t.home.previewText}
          action={
            <ButtonLink href="/atlas">
              {t.common.openAtlas}
              <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </ButtonLink>
          }
        />
        <HomeAtlasPreview />
      </section>

      {/* ── Entities ── */}
      <section className="border-y border-line bg-coal/50">
        <div className="shell py-16 md:py-20">
          <SectionHeading
            eyebrow={t.home.entitiesEyebrow}
            title={t.home.entitiesTitle}
            text={t.home.entitiesText}
            action={<ButtonLink href="/entities">{t.common.viewAll}</ButtonLink>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {entities.map((entity) => (
              <EntityCard key={entity.id} entity={entity} t={t} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Milestones ── */}
      <section className="shell py-16 md:py-20">
        <SectionHeading eyebrow={t.home.milestonesEyebrow} title={t.home.milestonesTitle} />
        <ol className="grid gap-px bg-line border border-line rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone) => (
            <li key={milestone.key} className="group relative bg-coal p-6 transition-colors hover:bg-graphite">
              <p className="text-[24px] font-semibold tabular-nums text-gold">{formatYear(milestone.year, locale)}</p>
              <h3 className="mt-3 font-semibold text-parchment">
                <Link href={atlasHref({ year: milestone.year, entityId: milestone.entityId })} className="after:absolute after:inset-0 group-hover:text-gold-bright">
                  {t.milestones[milestone.key].title}
                </Link>
              </h3>
              <p className="mt-2 text-[13.5px] text-sand">{t.milestones[milestone.key].text}</p>
              <p className="mt-4 text-[12.5px] text-dust flex items-center gap-1">
                {t.common.showOnMap}
                <ArrowUpRight aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Timeline preview ── */}
      <section className="border-y border-line bg-coal/50">
        <div className="shell py-16 md:py-20">
          <SectionHeading
            eyebrow={t.home.timelineEyebrow}
            title={t.home.timelineTitle}
            text={t.home.timelineText}
            action={<ButtonLink href="/timeline">{t.home.openTimeline}</ButtonLink>}
          />
          <LifespanChart />
        </div>
      </section>

      {/* ── Selected events ── */}
      <section className="shell py-16 md:py-20">
        <SectionHeading
          eyebrow={t.home.eventsEyebrow}
          title={t.home.eventsTitle}
          action={<ButtonLink href="/events">{t.common.viewAll}</ButtonLink>}
        />
        <div className="panel px-5 md:px-6">
          {featuredEvents.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              t={t}
              locale={locale}
              entityNames={event.entityIds.map((id) => getEntity(id)?.name[locale]).filter((name) => name !== undefined)}
            />
          ))}
        </div>
      </section>

      {/* ── Method ── */}
      <section className="border-t border-line bg-coal/50">
        <div className="shell py-16 md:py-20">
          <SectionHeading
            eyebrow={t.home.methodEyebrow}
            title={t.home.methodTitle}
            action={<ButtonLink href="/about">{t.home.readMethod}</ButtonLink>}
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {t.home.methodPoints.map((point, index) => {
              const Icon = METHOD_ICONS[index] ?? BookOpenCheck;
              return (
                <li key={point.title} className="panel p-6">
                  <Icon aria-hidden="true" className="size-5 text-gold" />
                  <h3 className="mt-4 font-semibold text-parchment">{point.title}</h3>
                  <p className="mt-2 text-[14px] text-sand">{point.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
