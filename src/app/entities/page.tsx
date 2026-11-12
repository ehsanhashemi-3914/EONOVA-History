/**
 * /entities — the collection, filterable by kind and region.
 *
 * The filters are ordinary links that change the query string (?kind=empire).
 * The server reads the query and renders the filtered list, so the page works
 * even without JavaScript and every filtered view has its own URL.
 */
import type { Metadata } from "next";
import { entities } from "@/data";
import { entityKindSchema, regionSchema } from "@/data/schema";
import { getI18n } from "@/i18n/server";
import { EntityCard } from "@/components/ui/cards";
import { EmptyState, FilterChips, PageHeader } from "@/components/ui/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.entities.title, description: t.entities.intro };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function hrefWith(kind: string | null, region: string | null) {
  const params = new URLSearchParams();
  if (kind) params.set("kind", kind);
  if (region) params.set("region", region);
  const query = params.toString();
  return query ? `/entities?${query}` : "/entities";
}

export default async function EntitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const { t, locale } = await getI18n();
  const params = await searchParams;
  const kindParam = entityKindSchema.safeParse(first(params.kind));
  const regionParam = regionSchema.safeParse(first(params.region));
  const kind = kindParam.success ? kindParam.data : null;
  const region = regionParam.success ? regionParam.data : null;

  const list = entities.filter((entity) => (!kind || entity.kind === kind) && (!region || entity.region === region));
  const kindsInUse = entityKindSchema.options.filter((value) => entities.some((entity) => entity.kind === value));
  const regionsInUse = regionSchema.options.filter((value) => entities.some((entity) => entity.region === value));

  return (
    <>
      <PageHeader eyebrow={t.nav.entities} title={t.entities.title} intro={t.entities.intro} />
      <div className="shell py-10">
        <div className="flex flex-col gap-3 mb-8">
          <FilterChips
            label={t.entities.filterKind}
            options={[
              { label: t.common.all, href: hrefWith(null, region), active: kind === null },
              ...kindsInUse.map((value) => ({ label: t.kinds[value], href: hrefWith(value, region), active: kind === value })),
            ]}
          />
          <FilterChips
            label={t.entities.filterRegion}
            options={[
              { label: t.common.all, href: hrefWith(kind, null), active: region === null },
              ...regionsInUse.map((value) => ({ label: t.regions[value], href: hrefWith(kind, value), active: region === value })),
            ]}
          />
        </div>

        {list.length === 0 ? (
          <EmptyState title={t.entities.empty} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((entity) => (
              <EntityCard key={entity.id} entity={entity} t={t} locale={locale} />
            ))}
          </div>
        )}

        <section className="mt-14" aria-labelledby="kinds-heading">
          <h2 id="kinds-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">
            {t.entities.kindsTitle}
          </h2>
          <dl className="grid gap-px bg-line border border-line rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {entityKindSchema.options.map((value) => (
              <div key={value} className="bg-coal p-5">
                <dt className="font-semibold text-parchment">{t.kinds[value]}</dt>
                <dd className="mt-1.5 text-[13.5px] text-sand">{t.kindDefinitions[value]}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
