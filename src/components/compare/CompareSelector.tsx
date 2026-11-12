"use client";

/**
 * The two entity pickers on /compare.
 *
 * The CHOICE lives in the URL (?a=…&b=…), not in React state: changing a select
 * navigates to a new URL, the server renders the comparison for it, and the
 * result can be bookmarked or shared.
 */
import { useRouter } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { entities } from "@/data";

export function CompareSelector({ a, b }: { a: string; b: string }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const go = (nextA: string, nextB: string) => router.replace(`/compare?a=${nextA}&b=${nextB}`, { scroll: false });

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
      <Picker id="compare-a" label={t.compare.first} value={a} onChange={(value) => go(value, b)} locale={locale} />
      <button
        type="button"
        onClick={() => go(b, a)}
        aria-label={t.compare.swap}
        title={t.compare.swap}
        className="h-11 w-11 grid place-items-center rounded-md border border-line-strong text-sand hover:border-gold hover:text-gold justify-self-center"
      >
        <ArrowLeftRight aria-hidden="true" className="size-4" />
      </button>
      <Picker id="compare-b" label={t.compare.second} value={b} onChange={(value) => go(a, value)} locale={locale} />
    </div>
  );
}

function Picker({
  id,
  label,
  value,
  onChange,
  locale,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  locale: "fa" | "en";
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-[12px] text-dust mb-1.5">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-line-strong bg-ink px-3 text-[15px] text-parchment"
      >
        {entities.map((entity) => (
          <option key={entity.id} value={entity.id}>
            {entity.name[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
