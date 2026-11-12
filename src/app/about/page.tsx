/** /about — methodology, map caveats, exclusions and licences. */
import type { Metadata } from "next";
import excluded from "@/data/generated/excluded-outlines.json";
import { getI18n } from "@/i18n/server";
import { ButtonLink, PageHeader } from "@/components/ui/primitives";
import { MapLegend } from "@/components/map/MapLegend";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.about.title, description: t.about.intro };
}

interface ExcludedOutline {
  file: string;
  name: string;
  reason: { en: string; fa: string };
}

export default async function AboutPage() {
  const { t, locale } = await getI18n();
  const exclusions = excluded as ExcludedOutline[];

  return (
    <>
      <PageHeader eyebrow={t.nav.about} title={t.about.title} intro={t.about.intro} />
      <div className="shell py-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-12">
          {t.about.sections.map((section) => (
            <section key={section.title} aria-label={section.title}>
              <h2 className="text-[22px] font-semibold text-parchment mb-4">{section.title}</h2>
              <div className="prose-atlas">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="excluded-heading">
            <h2 id="excluded-heading" className="text-[22px] font-semibold text-parchment mb-4">
              {t.about.excludedTitle}
            </h2>
            <ul className="panel divide-y divide-line">
              {exclusions.map((item) => (
                <li key={`${item.file}-${item.name}`} className="px-5 py-3.5">
                  <p className="text-[13px] text-gold" dir="ltr">
                    {item.name} <span className="text-dust">· {item.file}</span>
                  </p>
                  <p className="mt-1 text-[14px] text-sand">{item.reason[locale]}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="licence-heading">
            <h2 id="licence-heading" className="text-[22px] font-semibold text-parchment mb-4">
              {t.about.licenceTitle}
            </h2>
            <p className="prose-atlas">{t.about.licenceText}</p>
            <ButtonLink href="/sources" className="mt-6">
              {t.about.seeSources}
            </ButtonLink>
          </section>
        </div>

        <aside className="lg:sticky lg:top-[84px] lg:self-start space-y-6">
          <section className="panel p-5" aria-labelledby="legend-heading">
            <h2 id="legend-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">
              {t.atlas.legend}
            </h2>
            <MapLegend />
          </section>
          <section className="panel p-5" aria-labelledby="labels-heading">
            <h2 id="labels-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">
              {t.common.date}
            </h2>
            <dl className="space-y-3 text-[13.5px]">
              {(["exact", "approximate", "disputed"] as const).map((key) => (
                <div key={key}>
                  <dt className="text-parchment font-medium">{t.precision[key]}</dt>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </>
  );
}
