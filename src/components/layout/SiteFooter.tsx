import Link from "next/link";
import type { Dictionary } from "@/i18n";
import { LogoMark } from "./Logo";

/** Site footer. A Server Component: plain links and text, no interactivity. */
export function SiteFooter({ t }: { t: Dictionary }) {
  const explore = [
    { href: "/atlas", label: t.nav.atlas },
    { href: "/timeline", label: t.nav.timeline },
    { href: "/entities", label: t.nav.entities },
    { href: "/people", label: t.nav.people },
    { href: "/events", label: t.common.events },
  ];
  const reference = [
    { href: "/compare", label: t.nav.compare },
    { href: "/quiz", label: t.nav.quiz },
    { href: "/sources", label: t.nav.sources },
    { href: "/about", label: t.nav.about },
    { href: "/favorites", label: t.nav.favorites },
  ];

  return (
    <footer className="border-t border-line bg-coal mt-auto">
      <div className="shell py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2.5 text-gold">
            <LogoMark className="size-6" />
            <span className="font-semibold tracking-[0.2em] text-[13px] text-parchment uppercase" dir="ltr">
              Eonova Atlas
            </span>
          </p>
          <p className="mt-4 text-sand max-w-sm">{t.footer.about}</p>
          <p className="mt-3 text-[13px] text-gold/90">{t.meta.tagline}</p>
        </div>
        <FooterColumn title={t.footer.explore} links={explore} />
        <FooterColumn title={t.footer.reference} links={reference} />
      </div>
      <div className="border-t border-line">
        <div className="shell py-5 text-[12px] text-dust space-y-1.5">
          <p>{t.footer.approximate}</p>
          <p>{t.footer.dataNote}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-dust mb-3">{title}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[14px] text-sand hover:text-gold">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
