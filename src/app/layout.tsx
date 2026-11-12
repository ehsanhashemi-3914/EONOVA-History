/**
 * Root layout — the frame around every page.
 *
 * In the Next.js App Router, `layout.tsx` wraps all routes below it. This one is
 * a Server Component: it runs on the server for each request, reads the
 * language cookie, and sends HTML whose <html lang dir> is already correct.
 */
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/vazirmatn";
import "@fontsource-variable/inter";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { getI18n } from "@/i18n/server";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: { default: `${t.meta.name} — ${t.meta.tagline}`, template: `%s · ${t.meta.name}` },
    description: t.meta.description,
    applicationName: "EONOVA ATLAS",
  };
}

export const viewport: Viewport = {
  themeColor: "#0f1012",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale, dir, t } = await getI18n();

  return (
    <html lang={locale} dir={dir}>
      <body className="flex min-h-dvh flex-col">
        <LocaleProvider locale={locale}>
          <SiteHeader />
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter t={t} />
        </LocaleProvider>
      </body>
    </html>
  );
}
