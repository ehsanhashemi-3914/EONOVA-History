"use client";

/**
 * Error boundary for every route.
 *
 * If a page throws while rendering, React shows this component INSTEAD of a
 * blank screen; the header and footer (which live in the layout, outside the
 * boundary) keep working. `retry` asks Next.js to render the route again.
 */
import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { Button, buttonClass } from "@/components/ui/primitives";

export default function RouteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const { t } = useI18n();

  useEffect(() => {
    // Keep the technical detail for developers; visitors get a plain message.
    console.error("EONOVA ATLAS route error:", error);
  }, [error]);

  return (
    <div className="flex-1 grid place-items-center graticule px-6 py-24 text-center" role="alert">
      <div>
        <TriangleAlert aria-hidden="true" className="mx-auto size-9 text-ember" />
        <h1 className="mt-5 text-[26px] font-semibold text-parchment">{t.errors.errorTitle}</h1>
        <p className="mt-3 text-sand max-w-md mx-auto">{t.errors.errorText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="primary" onClick={() => retry()}>
            {t.errors.retry}
          </Button>
          <Link href="/" className={buttonClass("outline")}>
            {t.errors.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
