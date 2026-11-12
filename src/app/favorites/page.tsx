/** /favorites — items saved in this browser. */
import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";
import { FavoritesList } from "@/components/ui/FavoritesList";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.favorites.title, description: t.favorites.intro };
}

export default async function FavoritesPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader eyebrow={t.nav.favorites} title={t.favorites.title} intro={t.favorites.intro} />
      <div className="shell py-10">
        <FavoritesList />
      </div>
    </>
  );
}
