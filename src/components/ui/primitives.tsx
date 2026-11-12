/**
 * Small presentational building blocks used across the site.
 * They hold no state and no data logic — only consistent styling — so they work
 * in both Server and Client Components.
 */
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ───────────────────────────── Badge ───────────────────────────── */

type BadgeTone = "neutral" | "gold" | "warn" | "muted";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "border-line-strong text-sand",
  gold: "border-bronze/70 text-gold",
  warn: "border-ember/50 text-ember",
  muted: "border-line text-dust",
};

export function Badge({ tone = "neutral", className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11.5px] leading-5 font-medium whitespace-nowrap",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ───────────────────────────── Buttons ───────────────────────────── */

type ButtonVariant = "primary" | "outline" | "ghost";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-45 disabled:pointer-events-none";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-gold text-ink hover:bg-gold-bright px-4 h-10",
  outline: "border border-line-strong text-parchment hover:border-gold hover:text-gold px-4 h-10",
  ghost: "text-sand hover:text-parchment hover:bg-slate px-3 h-9",
};

export function buttonClass(variant: ButtonVariant = "outline", className?: string) {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], className);
}

export function Button({
  variant = "outline",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "outline",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

/* ───────────────────────────── Headings ───────────────────────────── */

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className="border-b border-line graticule">
      <div className="shell py-10 md:py-14">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="text-[28px] md:text-[38px] font-semibold tracking-tight text-parchment">{title}</h1>
        {intro ? <p className="mt-3 max-w-2xl text-sand text-[15.5px]">{intro}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  action?: ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 mb-7">
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-2.5">{eyebrow}</p> : null}
        <Tag className="text-[22px] md:text-[27px] font-semibold tracking-tight text-parchment">{title}</Tag>
        {text ? <p className="mt-2.5 text-sand">{text}</p> : null}
      </div>
      {action}
    </div>
  );
}

/** Small titled block used inside profile pages. */
export function Block({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("py-7 border-t border-line first:border-t-0 first:pt-0", className)}>
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold mb-4">{title}</h2>
      {children}
    </section>
  );
}

/* ───────────────────────────── Misc ───────────────────────────── */

/** A coloured square that identifies an entity on the map and in lists. */
export function ColorSwatch({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-2.5 shrink-0 rounded-[2px]", className)}
      style={{ backgroundColor: color, boxShadow: `0 0 0 1px ${color}55` }}
    />
  );
}

export function EmptyState({ title, hint, children }: { title: string; hint?: string; children?: ReactNode }) {
  return (
    <div className="panel px-6 py-12 text-center">
      <p className="text-parchment font-medium">{title}</p>
      {hint ? <p className="mt-2 text-sm text-dust max-w-md mx-auto">{hint}</p> : null}
      {children ? <div className="mt-5 flex justify-center">{children}</div> : null}
    </div>
  );
}

/** Row of filter links; the active one is highlighted. Works without JavaScript. */
export function FilterChips({
  label,
  options,
}: {
  label: string;
  options: { label: string; href: string; active: boolean }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="text-[12.5px] text-dust me-1">{label}</span>
      {options.map((option) => (
        <Link
          key={option.href}
          href={option.href}
          scroll={false}
          aria-current={option.active ? "true" : undefined}
          className={cn(
            "rounded-sm border px-2.5 py-1 text-[12.5px] transition-colors",
            option.active
              ? "border-gold bg-gold/10 text-gold"
              : "border-line text-sand hover:border-line-strong hover:text-parchment",
          )}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
