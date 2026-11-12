/** /timeline — lifespans and events on one time scale. */
import type { Metadata } from "next";
import { getEntity } from "@/data";
import { eventCategorySchema, regionSchema } from "@/data/schema";
import { milestones } from "@/data/milestones";
import { getI18n } from "@/i18n/server";
import { parseYearParam } from "@/lib/dates";
import { TimelineExplorer } from "@/components/timeline/TimelineExplorer";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.timeline.title, description: t.timeline.intro };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function TimelinePage({ searchParams }: { searchParams: SearchParams }) {
  const { t } = await getI18n();
  const params = await searchParams;
  const region = regionSchema.safeParse(first(params.region));
  const category = eventCategorySchema.safeParse(first(params.category));
  const entityId = first(params.entity);

  return (
    <>
      <PageHeader eyebrow={t.nav.timeline} title={t.timeline.title} intro={t.timeline.intro} />
      <TimelineExplorer
        initial={{
          year: parseYearParam(first(params.y), milestones[0].year),
          region: region.success ? region.data : null,
          category: category.success ? category.data : null,
          entityId: entityId && getEntity(entityId) ? entityId : null,
        }}
      />
    </>
  );
}
