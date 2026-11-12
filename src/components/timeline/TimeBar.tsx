"use client";

/**
 * TimeBar — the year controls shared by the atlas and the home-page preview.
 *
 * It is a "controlled component": it does not store the year itself. The parent
 * owns the value and passes `year` down and `onChange` up, so the map, the side
 * panel and this bar can never disagree about which year is selected.
 */
import { useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { entities } from "@/data";
import { jumpYears, milestones, yearToPercent } from "@/data/milestones";
import {
  ATLAS_MAX_YEAR,
  ATLAS_MIN_YEAR,
  clampYear,
  eraLabel,
  formatCentury,
  formatNumber,
  formatYear,
  fromEra,
  toEra,
  type Era,
} from "@/lib/dates";
import { cn } from "@/lib/cn";

const AXIS_TICKS = [-3499, -2999, -1999, -999, -499, 1, 500, 700];

export function TimeBar({ year, onChange, compact = false }: { year: number; onChange: (year: number) => void; compact?: boolean }) {
  const { t, locale } = useI18n();
  const set = (next: number) => onChange(clampYear(next));
  const percent = yearToPercent(year, ATLAS_MIN_YEAR, ATLAS_MAX_YEAR);

  const steps: { delta: number; label: string; icon: typeof ChevronLeft; text: string }[] = [
    { delta: -100, label: t.atlas.step.back100, icon: ChevronsLeft, text: "100" },
    { delta: -10, label: t.atlas.step.back10, icon: ChevronLeft, text: "10" },
    { delta: -1, label: t.atlas.step.back1, icon: ChevronLeft, text: "1" },
    { delta: 1, label: t.atlas.step.forward1, icon: ChevronRight, text: "1" },
    { delta: 10, label: t.atlas.step.forward10, icon: ChevronRight, text: "10" },
    { delta: 100, label: t.atlas.step.forward100, icon: ChevronsRight, text: "100" },
  ];

  return (
    <section aria-label={t.atlas.selectedYear} className="border-t border-line bg-coal">
      <div className="px-4 md:px-6 pt-3 pb-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {/* Selected year and step buttons */}
          <div className="flex items-center gap-1.5">
            {steps.slice(0, 3).map((step) => (
              <StepButton key={step.delta} {...step} onClick={() => set(year + step.delta)} disabled={year <= ATLAS_MIN_YEAR} />
            ))}
            <output aria-live="polite" className="mx-2 min-w-[8.5rem] text-center">
              <span className="block text-[21px] font-semibold tabular-nums text-parchment leading-tight">{formatYear(year, locale)}</span>
              <span className="block text-[11.5px] text-dust leading-tight">{formatCentury(year, locale)}</span>
            </output>
            {steps.slice(3).map((step) => (
              <StepButton key={step.delta} {...step} onClick={() => set(year + step.delta)} disabled={year >= ATLAS_MAX_YEAR} />
            ))}
          </div>

          {/* Milestones */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.atlas.milestones}>
            <span className="text-[11.5px] text-dust me-1 hidden sm:inline">{t.atlas.milestones}</span>
            {milestones.map((milestone) => (
              <button
                key={milestone.key}
                type="button"
                onClick={() => set(milestone.year)}
                aria-pressed={year === milestone.year}
                title={t.milestones[milestone.key].title}
                className={cn(
                  "h-8 rounded-sm border px-2.5 text-[12.5px] tabular-nums transition-colors",
                  year === milestone.year
                    ? "border-gold bg-gold text-ink font-semibold"
                    : "border-bronze/70 text-gold hover:bg-gold/10",
                )}
              >
                {formatYear(milestone.year, locale)}
              </button>
            ))}
            {compact
              ? null
              : jumpYears.map((jump) => (
                  <button
                    key={jump}
                    type="button"
                    onClick={() => set(jump)}
                    aria-pressed={year === jump}
                    className={cn(
                      "hidden lg:inline-flex h-8 items-center rounded-sm border px-2 text-[12px] tabular-nums transition-colors",
                      year === jump ? "border-gold text-gold" : "border-line text-dust hover:border-line-strong hover:text-parchment",
                    )}
                  >
                    {formatYear(jump, locale)}
                  </button>
                ))}
          </div>

          {compact ? null : <GoToYear onGo={set} />}
        </div>

        {/* Lifespans of the eight entities, as context for the slider below */}
        <div className="relative mt-3 h-[34px]" aria-hidden="true">
          {entities.map((entity, index) => {
            const start = yearToPercent(entity.start.year, ATLAS_MIN_YEAR, ATLAS_MAX_YEAR);
            const end = yearToPercent(entity.end.year, ATLAS_MIN_YEAR, ATLAS_MAX_YEAR);
            const active = year >= entity.start.year && year <= entity.end.year;
            return (
              <span
                key={entity.id}
                className="absolute h-[3px] rounded-full transition-opacity"
                style={{
                  insetInlineStart: `${start}%`,
                  width: `${Math.max(end - start, 0.4)}%`,
                  top: `${index * 4 + 1}px`,
                  backgroundColor: entity.color,
                  opacity: active ? 1 : 0.32,
                }}
              />
            );
          })}
          <span className="absolute top-0 bottom-0 w-px bg-gold" style={{ insetInlineStart: `${percent}%` }} />
        </div>

        <input
          type="range"
          className="year-slider block"
          min={ATLAS_MIN_YEAR}
          max={ATLAS_MAX_YEAR}
          step={1}
          value={year}
          onChange={(event) => set(Number(event.target.value))}
          aria-label={t.atlas.yearSlider}
          aria-valuetext={formatYear(year, locale)}
        />

        <div className="relative h-4 text-[10.5px] text-dust tabular-nums" aria-hidden="true">
          {AXIS_TICKS.map((tick, index) => {
            const position = yearToPercent(tick, ATLAS_MIN_YEAR, ATLAS_MAX_YEAR);
            const edge = index === 0 ? "start" : index === AXIS_TICKS.length - 1 ? "end" : "middle";
            return (
              <span
                key={tick}
                className={cn(
                  "absolute whitespace-nowrap",
                  edge === "middle" && "-translate-x-1/2 rtl:translate-x-1/2",
                  // hide the crowded ticks on narrow screens
                  (tick === -499 || tick === 500) && "hidden sm:inline",
                )}
                style={edge === "end" ? { insetInlineEnd: 0 } : { insetInlineStart: `${position}%` }}
              >
                {formatYear(tick, locale)}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepButton({
  label,
  icon: Icon,
  text,
  onClick,
  disabled,
}: {
  label: string;
  icon: typeof ChevronLeft;
  text: string;
  onClick: () => void;
  disabled: boolean;
}) {
  const { locale } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="h-8 min-w-8 inline-flex items-center justify-center gap-0.5 rounded-sm border border-line px-1 text-[11px] tabular-nums text-sand hover:border-line-strong hover:text-parchment disabled:opacity-35 disabled:pointer-events-none"
    >
      {/* The arrows are mirrored in right-to-left layouts, where the past lies to the right. */}
      <Icon aria-hidden="true" className="size-3.5 rtl:rotate-180" />
      <span className="hidden sm:inline">{formatNumber(Number(text), locale)}</span>
    </button>
  );
}

/** Type a year directly: a number plus an era, because "550" alone is ambiguous. */
function GoToYear({ onGo }: { onGo: (year: number) => void }) {
  const { t, locale } = useI18n();
  const [value, setValue] = useState("");
  const [era, setEra] = useState<Era>("BCE");

  const limit = era === "BCE" ? toEra(ATLAS_MIN_YEAR).value : toEra(ATLAS_MAX_YEAR).value;
  const parsed = Number(value);
  const valid = /^\d{1,4}$/.test(value) && parsed >= 1 && parsed <= limit;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onGo(fromEra(parsed, era));
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-1.5 ms-auto" aria-label={t.atlas.goToYear}>
      <label className="sr-only" htmlFor="go-year">
        {t.atlas.yearInput}
      </label>
      <input
        id="go-year"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        dir="ltr"
        value={value}
        onChange={(event) => setValue(event.target.value.replace(/[^\d]/g, ""))}
        placeholder={t.atlas.goToYear}
        aria-invalid={value !== "" && !valid}
        className="h-8 w-[7.5rem] rounded-sm border border-line bg-ink px-2.5 text-[13px] text-parchment placeholder:text-dust text-center aria-[invalid=true]:border-ember"
      />
      <label className="sr-only" htmlFor="go-era">
        {t.atlas.era}
      </label>
      <select
        id="go-era"
        value={era}
        onChange={(event) => setEra(event.target.value as Era)}
        className="h-8 rounded-sm border border-line bg-ink px-1.5 text-[13px] text-parchment"
      >
        <option value="BCE">{eraLabel("BCE", locale)}</option>
        <option value="CE">{eraLabel("CE", locale)}</option>
      </select>
      <button
        type="submit"
        disabled={!valid}
        className="h-8 rounded-sm border border-line-strong px-3 text-[13px] text-parchment hover:border-gold hover:text-gold disabled:opacity-40 disabled:pointer-events-none"
      >
        {t.atlas.go}
      </button>
    </form>
  );
}
