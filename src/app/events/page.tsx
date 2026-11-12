/** /events — every documented event, in chronological order. */
import type { Metadata } from "next";
import { events, getEntity } from "@/data";
import { getI18n } from "@/i18n/server";
import { fill } from "@/i18n";
import { formatNumber } from "@/lib/dates";
import { EventRow } from "@/components/ui/cards";
import { ButtonLink, PageHeader } from "@/components/ui/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.events.title, description: t.events.intro };
}

export default async function EventsPage() {
  const { t, locale } = await getI18n();
  return (
    <>
      <PageHeader eyebrow={t.common.events} title={t.events.title} intro={t.events.intro}>
        <ButtonLink href="/timeline">{t.home.openTimeline}</ButtonLink>
      </PageHeader>
      <div className="shell py-10">
        <p className="text-[13px] text-dust mb-3">{fill(t.common.resultsCount, { count: formatNumber(events.length, locale) })}</p>
        <div className="panel px-5 md:px-6">
          {events.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              t={t}
              locale={locale}
              entityNames={event.entityIds.map((id) => getEntity(id)?.name[locale]).filter((name) => name !== undefined)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
