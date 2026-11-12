/**
 * /compare — two entities side by side.
 *
 * The page never ranks. Where the two are different KINDS of entity (say, a
 * civilization and an empire) it says so before showing a single row, because
 * their durations, capitals and rulers are then not like-for-like.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Info, Scale } from "lucide-react";
import { events, eventsOfEntity, getEntity, getPlace, peopleOfEntity } from "@/data";
import type { Entity } from "@/data/schema";
import { getI18n } from "@/i18n/server";
import { fill, type Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { compareEntities } from "@/lib/compare";
import { formatNumber, formatRange } from "@/lib/dates";
import { entityRange, eventDate } from "@/lib/format";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { Badge, ColorSwatch, EmptyState, PageHeader } from "@/components/ui/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.compare.title, description: t.compare.intro };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const DEFAULT_A = "achaemenid-empire";
const DEFAULT_B = "sasanian-empire";

export default async function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const { t, locale } = await getI18n();
  const params = await searchParams;

  const a = getEntity(first(params.a) ?? "") ?? getEntity(DEFAULT_A)!;
  const requestedB = getEntity(first(params.b) ?? "");
  // If only ?a= was given, pick a sensible partner that is not the same entity.
  const b = requestedB ?? (a.id === DEFAULT_B ? getEntity(DEFAULT_A)! : getEntity(DEFAULT_B)!);
  const same = a.id === b.id;
  const comparison = compareEntities(a, b, events);

  return (
    <>
      <PageHeader eyebrow={t.nav.compare} title={t.compare.title} intro={t.compare.intro}>
        <div className="max-w-3xl">
          <CompareSelector a={a.id} b={b.id} />
        </div>
      </PageHeader>

      <div className="shell py-10">
        {same ? (
          <EmptyState title={t.compare.sameEntity} />
        ) : (
          <>
            {/* Context first: are these even the same kind of thing? */}
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <aside className={`flex gap-3 rounded-lg border p-5 ${comparison.sameKind ? "border-line bg-coal" : "border-gold/50 bg-gold/[0.06]"}`}>
                <Info aria-hidden="true" className="size-5 mt-0.5 shrink-0 text-gold" />
                <div>
                  {comparison.sameKind ? (
                    <p className="text-[14.5px] text-parchment">{fill(t.compare.sameKind, { kind: t.kinds[a.kind] })}</p>
                  ) : (
                    <>
                      <h2 className="font-semibold text-parchment">{t.compare.kindMismatchTitle}</h2>
                      <p className="mt-1.5 text-[14px] text-sand">
                        {fill(t.compare.kindMismatch, {
                          a: a.name[locale],
                          b: b.name[locale],
                          kindA: t.kinds[a.kind],
                          kindB: t.kinds[b.kind],
                        })}
                      </p>
                    </>
                  )}
                </div>
              </aside>
              <aside className="flex gap-3 rounded-lg border border-line bg-coal p-5">
                <Scale aria-hidden="true" className="size-5 mt-0.5 shrink-0 text-gold" />
                <div>
                  <h2 className="font-semibold text-parchment">{t.compare.overlapTitle}</h2>
                  <p className="mt-1.5 text-[14px] text-sand">
                    {comparison.overlap
                      ? fill(t.compare.overlap, {
                          years: formatNumber(comparison.overlap.years, locale),
                          range: formatRange(comparison.overlap.start, comparison.overlap.end, locale),
                        })
                      : fill(t.compare.noOverlap, { gap: formatNumber(comparison.gapYears ?? 0, locale) })}
                  </p>
                </div>
              </aside>
            </div>

            {/* Side-by-side table */}
            <div className="panel overflow-hidden">
              <div className="grid md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] border-b border-line bg-graphite">
                <div className="hidden md:block" />
                <ColumnHead entity={a} t={t} locale={locale} />
                <ColumnHead entity={b} t={t} locale={locale} />
              </div>

              <Row label={t.compare.rows.kind}>
                <KindCell entity={a} t={t} locale={locale} />
                <KindCell entity={b} t={t} locale={locale} />
              </Row>
              <Row label={t.compare.rows.period}>
                <p className="tabular-nums">{entityRange(a, locale)}</p>
                <p className="tabular-nums">{entityRange(b, locale)}</p>
              </Row>
              <Row label={t.compare.rows.duration}>
                <p className="tabular-nums">{fill(t.common.years, { count: formatNumber(comparison.durationA, locale) })}</p>
                <p className="tabular-nums">{fill(t.common.years, { count: formatNumber(comparison.durationB, locale) })}</p>
              </Row>
              <Row label={t.compare.rows.region}>
                <p>{a.regionLabel[locale]}</p>
                <p>{b.regionLabel[locale]}</p>
              </Row>
              <Row label={t.compare.rows.political}>
                <p>{a.politicalStructure[locale]}</p>
                <p>{b.politicalStructure[locale]}</p>
              </Row>
              <Row label={t.compare.rows.capitals}>
                <CapitalsCell entity={a} locale={locale} t={t} />
                <CapitalsCell entity={b} locale={locale} t={t} />
              </Row>
              <Row label={t.compare.rows.people}>
                <PeopleCell entity={a} locale={locale} t={t} />
                <PeopleCell entity={b} locale={locale} t={t} />
              </Row>
              <Row label={t.compare.rows.events}>
                <EventsCell entity={a} locale={locale} t={t} />
                <EventsCell entity={b} locale={locale} t={t} />
              </Row>
              <Row label={t.compare.rows.achievements}>
                <ListCell items={a.achievements.map((item) => item[locale])} t={t} />
                <ListCell items={b.achievements.map((item) => item[locale])} t={t} />
              </Row>
              <Row label={t.compare.rows.uncertainty}>
                <ListCell items={a.uncertainty.map((item) => item[locale])} t={t} />
                <ListCell items={b.uncertainty.map((item) => item[locale])} t={t} />
              </Row>
              <Row label={t.compare.rows.sources}>
                <p>
                  <Link href={`/entities/${a.slug}#sources-heading`} className="text-gold hover:text-gold-bright tabular-nums">
                    {formatNumber(a.sourceIds.length, locale)} · {t.common.sources}
                  </Link>
                </p>
                <p>
                  <Link href={`/entities/${b.slug}#sources-heading`} className="text-gold hover:text-gold-bright tabular-nums">
                    {formatNumber(b.sourceIds.length, locale)} · {t.common.sources}
                  </Link>
                </p>
              </Row>
            </div>

            {/* What connects them */}
            <div className="grid gap-4 md:grid-cols-2 mt-8">
              <section className="panel p-5" aria-labelledby="relation-heading">
                <h2 id="relation-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">
                  {t.compare.directRelation}
                </h2>
                {comparison.relationAtoB || comparison.relationBtoA ? (
                  <ul className="space-y-3 text-[14px]">
                    {comparison.relationAtoB ? (
                      <li>
                        <p className="text-parchment">
                          {a.name[locale]} → {b.name[locale]}: <span className="text-gold">{t.relationTypes[comparison.relationAtoB.type]}</span>
                        </p>
                        <p className="text-sand text-[13.5px] mt-0.5">{comparison.relationAtoB.note[locale]}</p>
                      </li>
                    ) : null}
                    {comparison.relationBtoA ? (
                      <li>
                        <p className="text-parchment">
                          {b.name[locale]} → {a.name[locale]}: <span className="text-gold">{t.relationTypes[comparison.relationBtoA.type]}</span>
                        </p>
                        <p className="text-sand text-[13.5px] mt-0.5">{comparison.relationBtoA.note[locale]}</p>
                      </li>
                    ) : null}
                  </ul>
                ) : (
                  <p className="text-[13.5px] text-dust">{t.common.none}</p>
                )}
              </section>
              <section className="panel p-5" aria-labelledby="shared-heading">
                <h2 id="shared-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">
                  {t.compare.sharedEvents}
                </h2>
                {comparison.sharedEvents.length > 0 ? (
                  <ul className="space-y-2.5 text-[14px]">
                    {comparison.sharedEvents.map((event) => (
                      <li key={event.id}>
                        <Link href={`/events/${event.slug}`} className="text-parchment hover:text-gold">
                          {event.title[locale]}
                        </Link>
                        <span className="text-dust tabular-nums text-[12.5px]"> · {eventDate(event, locale)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13.5px] text-dust">{t.compare.noSharedEvents}</p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </>
  );
}

interface CellProps {
  entity: Entity;
  locale: Locale;
  t: Dictionary;
}

function ColumnHead({ entity, t, locale }: CellProps) {
  return (
    <div className="px-5 py-4 md:border-s border-line border-t md:border-t-0 first:border-t-0">
      <p className="flex items-center gap-2.5 font-semibold text-[16px]">
        <ColorSwatch color={entity.color} />
        <Link href={`/entities/${entity.slug}`} className="text-parchment hover:text-gold">
          {entity.name[locale]}
        </Link>
      </p>
      <p className="mt-1 text-[12.5px] text-dust">{t.kinds[entity.kind]}</p>
    </div>
  );
}

/** One comparison row: a label and exactly two cells. */
function Row({ label, children }: { label: string; children: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className="grid md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] border-b border-line last:border-b-0">
      <h3 className="px-5 pt-4 md:py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-dust">{label}</h3>
      <div className="px-5 py-3 md:py-4 md:border-s border-line text-[14px] text-parchment">{children[0]}</div>
      <div className="px-5 py-3 md:py-4 md:border-s border-line border-t md:border-t-0 border-dashed md:border-solid text-[14px] text-parchment">{children[1]}</div>
    </div>
  );
}

function KindCell({ entity, t, locale }: CellProps) {
  return (
    <div>
      <Badge tone="gold">{t.kinds[entity.kind]}</Badge>
      <p className="mt-2 text-[13.5px] text-sand">{entity.kindNote[locale]}</p>
    </div>
  );
}

function CapitalsCell({ entity, locale, t }: CellProps) {
  if (entity.capitals.length === 0) return <p className="text-dust">{t.common.none}</p>;
  return (
    <ul className="space-y-1">
      {entity.capitals.map((capital) => {
        const place = getPlace(capital.placeId);
        return place ? (
          <li key={capital.placeId}>
            {place.name[locale]}
            {capital.note ? <span className="text-dust text-[13px]"> — {capital.note[locale]}</span> : null}
          </li>
        ) : null;
      })}
    </ul>
  );
}

function PeopleCell({ entity, locale, t }: CellProps) {
  const list = peopleOfEntity(entity.id);
  if (list.length === 0) return <p className="text-dust">{t.common.none}</p>;
  return (
    <ul className="space-y-1">
      {list.map((person) => (
        <li key={person.id}>
          <Link href={`/people/${person.slug}`} className="hover:text-gold">
            {person.name[locale]}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function EventsCell({ entity, locale, t }: CellProps) {
  const list = eventsOfEntity(entity.id);
  if (list.length === 0) return <p className="text-dust">{t.common.none}</p>;
  return (
    <ul className="space-y-1">
      {list.map((event) => (
        <li key={event.id}>
          <Link href={`/events/${event.slug}`} className="hover:text-gold">
            {event.title[locale]}
          </Link>
          <span className="text-dust tabular-nums text-[12.5px]"> · {eventDate(event, locale)}</span>
        </li>
      ))}
    </ul>
  );
}

function ListCell({ items, t }: { items: string[]; t: Dictionary }) {
  if (items.length === 0) return <p className="text-dust">{t.common.none}</p>;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.slice(0, 40)} className="flex gap-2.5 text-[13.5px]">
          <span aria-hidden="true" className="mt-[0.75em] size-1 shrink-0 rotate-45 bg-gold" />
          {item}
        </li>
      ))}
    </ul>
  );
}
