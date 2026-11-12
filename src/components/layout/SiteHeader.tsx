"use client";

/**
 * Site header: brand, primary navigation, search, saved items, language switch.
 *
 * It is a Client Component because it reacts to things only the browser knows:
 * the current path (to highlight the active link), whether the mobile menu is
 * open, and the Ctrl+K shortcut.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Bookmark, Languages, Menu, Search, X } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { useFavorites } from "@/lib/storage/favorites";
import { formatNumber } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { Wordmark } from "./Logo";
import { SearchPalette } from "@/components/search/SearchPalette";

export function SiteHeader() {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const links = [
    { href: "/atlas", label: t.nav.atlas },
    { href: "/timeline", label: t.nav.timeline },
    { href: "/entities", label: t.nav.entities },
    { href: "/people", label: t.nav.people },
    { href: "/compare", label: t.nav.compare },
    { href: "/quiz", label: t.nav.quiz },
    { href: "/sources", label: t.nav.sources },
    { href: "/about", label: t.nav.about },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // Ctrl+K / ⌘K opens search from anywhere; "/" too, unless the user is typing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.tagName === "SELECT" || target?.isContentEditable;
      if ((event.key === "k" || event.key === "K") && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const nextLocale = locale === "fa" ? "en" : "fa";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[70] focus:bg-gold focus:text-ink focus:px-3 focus:py-2 focus:rounded-md"
      >
        {t.nav.skipToContent}
      </a>
      <header className="sticky top-0 z-40 h-[60px] border-b border-line bg-ink/92 backdrop-blur-sm">
        <div className="h-full flex items-center gap-4 px-4 md:px-6">
          <Link href="/" aria-label={`${t.meta.name} — ${t.nav.home}`} className="shrink-0">
            <Wordmark name="Eonova Atlas" />
          </Link>

          <nav aria-label={t.nav.primary} className="hidden xl:flex items-center gap-0.5 ms-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "px-3 h-9 inline-flex items-center rounded-md text-[13.5px] transition-colors",
                  isActive(link.href) ? "text-gold bg-gold/8" : "text-sand hover:text-parchment hover:bg-slate",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.searchHint}
              aria-keyshortcuts="Control+K"
              className="h-9 inline-flex items-center gap-2.5 rounded-md border border-line px-3 text-[13px] text-dust hover:border-line-strong hover:text-parchment transition-colors"
            >
              <Search aria-hidden="true" className="size-4" />
              <span className="hidden md:inline">{t.nav.search}</span>
              <kbd className="hidden md:inline text-[10.5px] border border-line rounded-sm px-1.5 py-px text-dust font-sans" dir="ltr">
                Ctrl K
              </kbd>
            </button>

            <Link
              href="/favorites"
              aria-label={t.nav.favorites}
              title={t.nav.favorites}
              aria-current={isActive("/favorites") ? "page" : undefined}
              className={cn(
                "relative size-9 inline-flex items-center justify-center rounded-md transition-colors",
                isActive("/favorites") ? "text-gold bg-gold/8" : "text-sand hover:text-parchment hover:bg-slate",
              )}
            >
              <Bookmark aria-hidden="true" className="size-[17px]" />
              {favorites.length > 0 ? (
                <span className="absolute -top-0.5 -end-0.5 min-w-4 h-4 px-1 rounded-full bg-gold text-ink text-[10px] font-semibold leading-4 text-center">
                  {formatNumber(favorites.length, locale)}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={() => setLocale(nextLocale)}
              aria-label={t.nav.switchLanguageLabel}
              lang={nextLocale}
              className="h-9 inline-flex items-center gap-2 rounded-md px-2.5 text-[13px] text-sand hover:text-parchment hover:bg-slate transition-colors"
            >
              <Languages aria-hidden="true" className="size-4" />
              <span className={nextLocale === "fa" ? "font-[family-name:var(--font-fa)]" : "font-[family-name:var(--font-sans)]"}>
                {t.nav.switchLanguage}
              </span>
            </button>

            <button
              type="button"
              className="xl:hidden size-9 inline-flex items-center justify-center rounded-md text-sand hover:text-parchment hover:bg-slate"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            id="mobile-nav"
            aria-label={t.nav.primary}
            className="xl:hidden absolute inset-x-0 top-[60px] border-b border-line bg-coal shadow-panel"
          >
            <ul className="shell py-3 grid grid-cols-2 sm:grid-cols-4 gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center h-11 px-3 rounded-md text-[14.5px]",
                      isActive(link.href) ? "text-gold bg-gold/8" : "text-parchment hover:bg-slate",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      {searchOpen ? <SearchPalette onClose={closeSearch} /> : null}
    </>
  );
}
