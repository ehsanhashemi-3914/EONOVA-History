"use client";

/**
 * Small map on a profile page: one entity only, with a chooser for the dates
 * for which an outline exists. When there is none, only places are shown and
 * the caption says so.
 */
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import type { TerritoryProperties } from "@/data/schema";
import { clampYear, formatYear } from "@/lib/dates";
import { atlasHref, territoryWindow } from "@/lib/format";
import { cn } from "@/lib/cn";
import { AtlasMapLazy } from "@/components/map/AtlasMapLazy";

/** A year inside the outline's window, as close as possible to the year the snapshot depicts. */
function displayYear(territory: TerritoryProperties): number {
  return clampYear(Math.min(Math.max(territory.snapshotYear, territory.validFrom), territory.validTo));
}

export function EntityMiniMap({
  entityId,
  fallbackYear,
  outlines,
}: {
  entityId: string;
  /** Year used when the entity has no outline at all. */
  fallbackYear: number;
  /** The entity's outlines, earliest first (provenance only; the map loads the geometry). */
  outlines: TerritoryProperties[];
}) {
  const { t, locale } = useI18n();
  const [selectedId, setSelectedId] = useState<string | null>(outlines[0]?.id ?? null);
  const selected = outlines.find((outline) => outline.id === selectedId) ?? null;
  const year = selected ? displayYear(selected) : clampYear(fallbackYear);

  return (
    <figure className="panel overflow-hidden">
      <AtlasMapLazy className="relative h-[300px]" year={year} focusEntityId={entityId} interactive={false} />
      <figcaption className="p-4 border-t border-line">
        {outlines.length === 0 ? (
          <p className="text-[12.5px] text-sand">{t.entity.noOutlines}</p>
        ) : (
          <>
            <p className="text-[11.5px] text-dust mb-2">{t.entity.outlinesAvailable}</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t.entity.outlinesAvailable}>
              {outlines.map((outline) => (
                <button
                  key={outline.id}
                  type="button"
                  onClick={() => setSelectedId(outline.id)}
                  aria-pressed={outline.id === selectedId}
                  title={outline.label[locale]}
                  className={cn(
                    "h-7 rounded-sm border px-2 text-[11.5px] tabular-nums transition-colors",
                    outline.id === selectedId ? "border-gold bg-gold/10 text-gold" : "border-line text-sand hover:border-line-strong",
                  )}
                >
                  {territoryWindow(outline, locale)}
                </button>
              ))}
            </div>
            {selected ? (
              <div className="mt-3 text-[12.5px]" aria-live="polite">
                <p className="text-parchment font-medium">{selected.label[locale]}</p>
                <p className="text-dust">
                  {t.representation[selected.representation]} · {t.confidence.label}: {t.confidence[selected.confidence]}
                </p>
                <p className="mt-1.5 text-sand">{selected.notes[locale]}</p>
              </div>
            ) : null}
          </>
        )}
        <Link href={atlasHref({ year, entityId })} className="mt-3 inline-flex items-center gap-1 text-[13px] text-gold hover:text-gold-bright">
          {t.common.showOnMap} · {formatYear(year, locale)}
          <ArrowUpRight aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
        </Link>
      </figcaption>
    </figure>
  );
}
