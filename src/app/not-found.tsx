/**
 * Shown for any URL that matches no route, and whenever a page calls
 * `notFound()` (for example /entities/atlantis).
 */
import { getI18n } from "@/i18n/server";
import { LogoMark } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/primitives";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <div className="flex-1 grid place-items-center graticule px-6 py-24 text-center">
      <div>
        <LogoMark className="mx-auto size-12 text-gold/60" />
        <p className="mt-6 eyebrow" dir="ltr">
          404
        </p>
        <h1 className="mt-3 text-[26px] md:text-[32px] font-semibold text-parchment">{t.errors.notFoundTitle}</h1>
        <p className="mt-3 text-sand max-w-md mx-auto">{t.errors.notFoundText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            {t.errors.backHome}
          </ButtonLink>
          <ButtonLink href="/atlas">{t.common.openAtlas}</ButtonLink>
        </div>
      </div>
    </div>
  );
}
