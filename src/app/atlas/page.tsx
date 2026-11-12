/**
 * /atlas — the central experience.
 *
 * This file is a Server Component. Its only job is to read the URL's query
 * string (?y=-549&e=achaemenid-empire), validate it, and hand a clean initial
 * state to the interactive Client Component. Untrusted input (anyone can type
 * anything into a URL) is checked HERE, once, at the system's edge.
 */
import type { Metadata } from "next";
import { getEntity, getPlace } from "@/data";
import { milestones } from "@/data/milestones";
import { getI18n } from "@/i18n/server";
import { parseYearParam } from "@/lib/dates";
import { AtlasExplorer } from "@/components/atlas/AtlasExplorer";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.atlas.title, description: t.atlas.intro };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function AtlasPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const entityId = first(params.e);
  const placeId = first(params.p);

  return (
    <AtlasExplorer
      initial={{
        year: parseYearParam(first(params.y), milestones[0].year),
        entityId: entityId && getEntity(entityId) ? entityId : null,
        placeId: placeId && getPlace(placeId) ? placeId : null,
        reference: first(params.ref) === "1",
      }}
    />
  );
}
