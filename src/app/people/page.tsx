/** /people — rulers and other figures, filterable by entity (via the query string). */
import type { Metadata } from "next";
import { entities, getEntity, people } from "@/data";
import { getI18n } from "@/i18n/server";
import { PersonCard } from "@/components/ui/cards";
import { EmptyState, FilterChips, PageHeader } from "@/components/ui/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.peoplePage.title, description: t.peoplePage.intro };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** Order people by when they were active. */
const activeYear = (person: (typeof people)[number]) => person.reign?.start.year ?? person.birth?.year ?? person.death?.year ?? 0;

export default async function PeoplePage({ searchParams }: { searchParams: SearchParams }) {
  const { t, locale } = await getI18n();
  const params = await searchParams;
  const requested = first(params.entity);
  const entityId = requested && getEntity(requested) ? requested : null;

  const list = people.filter((person) => !entityId || person.entityId === entityId).sort((a, b) => activeYear(a) - activeYear(b));

  return (
    <>
      <PageHeader eyebrow={t.nav.people} title={t.peoplePage.title} intro={t.peoplePage.intro} />
      <div className="shell py-10">
        <div className="mb-8">
          <FilterChips
            label={t.peoplePage.filterEntity}
            options={[
              { label: t.common.all, href: "/people", active: entityId === null },
              ...entities.map((entity) => ({
                label: entity.name[locale],
                href: `/people?entity=${entity.id}`,
                active: entityId === entity.id,
              })),
            ]}
          />
        </div>
        {list.length === 0 ? (
          <EmptyState title={t.peoplePage.empty} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((person) => {
              const entity = getEntity(person.entityId);
              return <PersonCard key={person.id} person={person} t={t} locale={locale} entityName={entity?.name[locale]} color={entity?.color} />;
            })}
          </div>
        )}
        <p className="mt-8 text-[12.5px] text-dust">{t.person.noQuotes}</p>
      </div>
    </>
  );
}
