/** /sources — the complete source registry, with how often each entry is cited. */
import type { Metadata } from "next";
import { entities, events, people, places, quizQuestions, sources, territories } from "@/data";
import { sourceTypeSchema } from "@/data/schema";
import { getI18n } from "@/i18n/server";
import { fill } from "@/i18n";
import { formatNumber } from "@/lib/dates";
import { FilterChips, PageHeader } from "@/components/ui/primitives";
import { SourceItem } from "@/components/ui/SourceList";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.sources.title, description: t.sources.intro };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** How many records cite each source id. */
function citationCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  const collections: { sourceIds: string[] }[][] = [entities, events, people, places, quizQuestions, territories];
  for (const collection of collections) {
    for (const record of collection) {
      for (const id of record.sourceIds) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return counts;
}

export default async function SourcesPage({ searchParams }: { searchParams: SearchParams }) {
  const { t, locale } = await getI18n();
  const params = await searchParams;
  const typeParam = sourceTypeSchema.safeParse(first(params.type));
  const type = typeParam.success ? typeParam.data : null;

  const counts = citationCounts();
  const typesInUse = sourceTypeSchema.options.filter((value) => sources.some((source) => source.type === value));
  const list = sources.filter((source) => !type || source.type === type);

  return (
    <>
      <PageHeader eyebrow={t.nav.sources} title={t.sources.title} intro={t.sources.intro} />
      <div className="shell py-10">
        <div className="mb-6">
          <FilterChips
            label={t.sources.filterType}
            options={[
              { label: t.common.all, href: "/sources", active: type === null },
              ...typesInUse.map((value) => ({ label: t.sourceTypes[value], href: `/sources?type=${value}`, active: type === value })),
            ]}
          />
        </div>
        <p className="text-[13px] text-dust mb-4">{fill(t.sources.count, { count: formatNumber(list.length, locale) })}</p>
        <ol className="panel divide-y divide-line">
          {list.map((source) => {
            const count = counts.get(source.id) ?? 0;
            return (
              <li key={source.id} className="px-5 md:px-6 py-4">
                <ul>
                  <SourceItem source={source} t={t} locale={locale} />
                </ul>
                <p className="mt-2 text-[12px] text-dust">
                  {count > 0 ? fill(t.sources.citedBy, { count: formatNumber(count, locale) }) : t.sources.notCited}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
