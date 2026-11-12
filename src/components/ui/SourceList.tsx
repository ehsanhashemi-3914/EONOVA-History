/**
 * Citations. Every profile page ends with one of these so that a reader can
 * open the references behind what they just read.
 */
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { fill, type Dictionary } from "@/i18n";
import type { Source } from "@/data/schema";
import { Badge } from "./primitives";

export function SourceList({ sources, t, locale, heading }: { sources: Source[]; t: Dictionary; locale: Locale; heading?: string }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading" className="py-7 border-t border-line">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 id="sources-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">
          {heading ?? t.common.sourcesFor}
        </h2>
        <Link href="/sources" className="text-[12.5px] text-dust hover:text-gold">
          {t.nav.sources}
        </Link>
      </div>
      <ol className="space-y-3">
        {sources.map((source, index) => (
          <SourceItem key={source.id} source={source} t={t} locale={locale} number={index + 1} />
        ))}
      </ol>
    </section>
  );
}

export function SourceItem({ source, t, locale, number }: { source: Source; t: Dictionary; locale: Locale; number?: number }) {
  return (
    <li id={`source-${source.id}`} className="flex gap-3 text-[13.5px] leading-relaxed scroll-mt-24">
      {number ? <span className="text-dust tabular-nums w-5 shrink-0 text-end">{number}.</span> : null}
      {/* Bibliographic text stays left-to-right even on Persian pages: titles and names are in Latin script. */}
      <div className="min-w-0" dir="ltr" lang="en">
        <p className="text-parchment">
          <span>{source.author}. </span>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="italic underline decoration-line-strong underline-offset-3 hover:text-gold hover:decoration-gold"
          >
            {source.title}
            <ExternalLink aria-hidden="true" className="inline size-3 ms-1 -mt-0.5 opacity-70" />
            <span className="sr-only"> ({t.common.externalLink})</span>
          </a>
          <span>. {source.publisher}.</span>
          {source.published ? <span> {source.published}.</span> : null}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-dust" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
          <Badge tone="muted">{t.sourceTypes[source.type]}</Badge>
          <span className="text-[12px]">{fill(t.common.accessed, { date: source.accessed })}</span>
          {source.license ? (
            <span className="text-[12px]">
              {t.common.license}: <span dir="ltr">{source.license}</span>
            </span>
          ) : null}
          <code className="text-[11px] text-dust/80" dir="ltr">
            {source.id}
          </code>
        </div>
        {source.notes ? (
          <p className="mt-1.5 text-[12.5px] text-sand" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
            {source.notes[locale]}
          </p>
        ) : null}
      </div>
    </li>
  );
}
