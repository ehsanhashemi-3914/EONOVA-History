"use client";

/**
 * Live atlas preview on the home page: the real map and the real data, with the
 * four milestone years as one-click presets.
 */
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n";
import { entities, territories } from "@/data";
import { milestones } from "@/data/milestones";
import { entitiesActiveIn, resolveTerritory } from "@/lib/atlas";
import { formatYear } from "@/lib/dates";
import { atlasHref } from "@/lib/format";
import { cn } from "@/lib/cn";
import { AtlasMapLazy } from "@/components/map/AtlasMapLazy";
import { ColorSwatch, buttonClass } from "@/components/ui/primitives";

export function HomeAtlasPreview() {
  const { t, locale } = useI18n();
  const [index, setIndex] = useState(2); // start at 117 CE: the richest of the four maps
  const milestone = milestones[index];
  const year = milestone.year;
  const active = entitiesActiveIn(year, entities);

  return (
    <div className="panel overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <AtlasMapLazy className="relative h-[340px] sm:h-[420px] lg:h-[500px]" year={year} cooperativeGestures />

        <div className="border-t lg:border-t-0 lg:border-s border-line p-5 flex flex-col">
          <p className="text-[12px] text-dust mb-2.5">{t.home.previewPickYear}</p>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label={t.atlas.milestones}>
            {milestones.map((item, itemIndex) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-pressed={itemIndex === index}
                className={cn(
                  "h-10 rounded-sm border text-[13.5px] tabular-nums transition-colors",
                  itemIndex === index ? "border-gold bg-gold text-ink font-semibold" : "border-line-strong text-sand hover:border-gold hover:text-gold",
                )}
              >
                {formatYear(item.year, locale)}
              </button>
            ))}
          </div>

          <div className="mt-5" aria-live="polite">
            <h3 className="text-[17px] font-semibold text-parchment">{t.milestones[milestone.key].title}</h3>
            <p className="mt-1.5 text-[13.5px] text-sand">{t.milestones[milestone.key].text}</p>

            <p className="mt-5 text-[11.5px] uppercase tracking-[0.14em] text-dust">
              {fill(t.atlas.activeEntities, { year: formatYear(year, locale) })}
            </p>
            <ul className="mt-2 space-y-1.5">
              {active.map((entity) => {
                const hasOutline = resolveTerritory(entity.id, year, territories).shown.length > 0;
                return (
                  <li key={entity.id} className="flex items-center gap-2.5 text-[13.5px]">
                    <ColorSwatch color={entity.color} className={hasOutline ? "" : "opacity-40"} />
                    <Link href={`/entities/${entity.slug}`} className="text-parchment hover:text-gold">
                      {entity.name[locale]}
                    </Link>
                    {hasOutline ? null : <span className="text-[11.5px] text-dust">· {t.representation.marker}</span>}
                  </li>
                );
              })}
            </ul>
          </div>

          <Link href={atlasHref({ year, entityId: milestone.entityId })} className={buttonClass("primary", "mt-6 lg:mt-auto")}>
            {fill(t.common.openInAtlas, { year: formatYear(year, locale) })}
            <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </div>
  );
}
