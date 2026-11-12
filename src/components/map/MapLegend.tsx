"use client";

/**
 * Map legend. It exists to keep four things visibly distinct: an approximate
 * reconstructed extent, an area of influence, a reference outline borrowed from
 * another year, and a point location. They are not interchangeable.
 */
import { useI18n } from "@/i18n/LocaleProvider";

export function MapLegend() {
  const { t } = useI18n();
  return (
    <div className="text-[12.5px] text-sand">
      <ul className="space-y-2">
        <LegendRow label={t.atlas.legendExtent}>
          <svg viewBox="0 0 28 14" className="w-7 h-3.5" aria-hidden="true">
            <rect x="1" y="1" width="26" height="12" fill="#c6a463" fillOpacity="0.2" stroke="#c6a463" strokeWidth="1.3" strokeDasharray="4 2.5" />
          </svg>
        </LegendRow>
        <LegendRow label={t.atlas.legendInfluence}>
          <svg viewBox="0 0 28 14" className="w-7 h-3.5" aria-hidden="true">
            <rect x="1" y="1" width="26" height="12" fill="#c6a463" fillOpacity="0.08" stroke="#c6a463" strokeWidth="1.1" strokeDasharray="1 3" />
          </svg>
        </LegendRow>
        <LegendRow label={t.atlas.legendReference}>
          <svg viewBox="0 0 28 14" className="w-7 h-3.5" aria-hidden="true">
            <rect x="1" y="1" width="26" height="12" fill="none" stroke="#c6a463" strokeOpacity="0.7" strokeWidth="1.4" strokeDasharray="0.6 3.2" strokeLinecap="round" />
          </svg>
        </LegendRow>
        <LegendRow label={t.atlas.legendCapital}>
          <span className="block size-2.5 rotate-45 rounded-[2px] bg-gold" />
        </LegendRow>
        <LegendRow label={t.atlas.legendCity}>
          <span className="block size-2.5 rounded-full bg-gold" />
        </LegendRow>
        <LegendRow label={t.atlas.legendBattlefield}>
          <span className="block size-2.5 rounded-full border-2 border-gold" />
        </LegendRow>
        <LegendRow label={t.atlas.legendApproximatePlace}>
          <span className="block size-2.5 rounded-full bg-gold outline-1 outline-dashed outline-gold outline-offset-2" />
        </LegendRow>
      </ul>
      <p className="mt-3 text-[12px] text-dust">{t.atlas.legendNote}</p>
      <p className="mt-1 text-[12px] text-dust">{t.atlas.modernCoastlines}</p>
    </div>
  );
}

function LegendRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-7 flex justify-center shrink-0">{children}</span>
      <span>{label}</span>
    </li>
  );
}
