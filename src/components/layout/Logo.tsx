/**
 * The EONOVA ATLAS mark: a globe graticule crossed by a meridian, drawn as an
 * inline SVG so it needs no image file and inherits the text colour.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="12.5" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="16" cy="16" rx="5.4" ry="12.5" stroke="currentColor" strokeWidth="1" opacity="0.75" />
      <path d="M3.5 16h25M5.6 9.6h20.8M5.6 22.4h20.8" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M16 1.5v29" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="16" cy="16" r="1.9" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2.5 text-gold">
      <LogoMark className="size-7" />
      <span className="font-semibold tracking-[0.2em] text-[13.5px] text-parchment uppercase">{name}</span>
    </span>
  );
}
