"use client";

/**
 * Bookmark toggle. Reads and writes the favorites store (localStorage).
 *
 * `aria-pressed` tells assistive technology that this is a two-state toggle
 * button and which state it is in.
 */
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { useFavorites, type FavoriteType } from "@/lib/storage/favorites";
import { cn } from "@/lib/cn";

export function FavoriteButton({
  type,
  id,
  itemName,
  compact = false,
  className,
}: {
  type: FavoriteType;
  id: string;
  /** Name of the record, added to the accessible label so that several buttons on one page can be told apart. */
  itemName?: string;
  compact?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const { has, toggle } = useFavorites();
  const saved = has(type, id);
  const Icon = saved ? BookmarkCheck : Bookmark;
  const action = saved ? t.common.removeSaved : t.common.addSaved;
  const label = itemName ? `${action}: ${itemName}` : action;

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault(); // the button may sit inside a card that is a link
        event.stopPropagation();
        toggle(type, id);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border text-sm transition-colors",
        compact ? "size-8" : "h-10 px-3.5",
        saved ? "border-gold/70 bg-gold/10 text-gold" : "border-line-strong text-sand hover:border-gold hover:text-gold",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {compact ? null : <span>{saved ? t.common.saved : t.common.save}</span>}
    </button>
  );
}
