/**
 * Join CSS class names, skipping empty / false values:
 *   cn("btn", isActive && "btn-active")  →  "btn btn-active"  or  "btn"
 */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
