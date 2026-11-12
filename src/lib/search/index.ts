/**
 * Search — a small in-memory index over the whole dataset.
 *
 * With a few hundred records there is no need for a search library or a server:
 * we build a list of searchable items once, and for every keystroke we score
 * each item against the query. The interesting part is NORMALIZATION — making
 * "Cyrus", "cyrus", "كوروش" (Arabic kaf) and "کوروش" (Persian kaf) comparable.
 */
import type { LocalizedText } from "@/i18n/config";
import type { Entity, HistoricalEvent, Person, Place } from "@/data/schema";

export type SearchItemType = "entity" | "person" | "event" | "place";

export interface SearchItem {
  type: SearchItemType;
  id: string;
  href: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  /** Normalized primary names (both languages). */
  names: string[];
  /** Normalized alternative names. */
  aliases: string[];
  /** Normalized descriptive text. */
  body: string;
}

export interface SearchResult {
  item: SearchItem;
  score: number;
}

/** Arabic letter variants → the Persian letter a Persian reader would type. */
const ARABIC_TO_PERSIAN: Record<string, string> = {
  "ي": "ی", // ي → ی
  "ى": "ی", // ى → ی
  "ئ": "ی", // ئ → ی
  "ك": "ک", // ك → ک
  "ة": "ه", // ة → ه
  "ۀ": "ه", // ۀ → ه
  "ؤ": "و", // ؤ → و
  "أ": "ا", // أ → ا
  "إ": "ا", // إ → ا
  "آ": "ا", // آ → ا
  "ٱ": "ا", // ٱ → ا
};

const PERSIAN_ZERO = 0x06f0;
const ARABIC_ZERO = 0x0660;

/**
 * Reduce text to a comparable form:
 * lower case, no accents or Arabic vowel marks, Arabic letter variants mapped
 * to Persian ones, Persian/Arabic digits mapped to 0-9, the zero-width
 * non-joiner ("half-space") and punctuation turned into plain spaces.
 */
export function normalize(text: string): string {
  return (
    text
      // Fold Arabic variants BEFORE decomposing: NFKD would split "آ" into "ا" + a mark anyway.
      .replace(/[يىئكةۀؤأإآٱ]/g, (ch) => ARABIC_TO_PERSIAN[ch] ?? ch)
      .normalize("NFKD")
      // Latin accents, Arabic vowel marks (harakat), superscript alef, tatweel
      .replace(/[̀-ًͯ-ٰٟـ]/g, "")
      // zero-width non-joiner / joiner and direction marks → space
      .replace(/[‌‍‎‏]/g, " ")
      .replace(/[۰-۹]/g, (ch) => String(ch.charCodeAt(0) - PERSIAN_ZERO))
      .replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - ARABIC_ZERO))
      .toLowerCase()
      // transliteration marks and punctuation (Latin, Persian and typographic)
      .replace(/[ʿʾ'’‘`"“”«»()[\]{}.,;:!?،؛؟\-–—_/\\]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** Same text with all spaces removed ("میان رودان" ≈ "میان‌رودان"). */
function squash(text: string): string {
  return text.replace(/ /g, "");
}

export interface SearchSources {
  entities: readonly Entity[];
  people: readonly Person[];
  events: readonly HistoricalEvent[];
  places: readonly Place[];
  /** Where a place result should lead (places have no page of their own). */
  placeHref: (place: Place) => string;
  entityName: (id: string) => LocalizedText | undefined;
}

export function buildSearchIndex(sources: SearchSources): SearchItem[] {
  const both = (t: LocalizedText) => [normalize(t.fa), normalize(t.en)];
  const alt = (a: { fa: string[]; en: string[] }) => [...a.fa, ...a.en].map(normalize);

  return [
    ...sources.entities.map<SearchItem>((e) => ({
      type: "entity",
      id: e.id,
      href: `/entities/${e.slug}`,
      title: e.name,
      subtitle: e.summary,
      names: both(e.name),
      aliases: alt(e.altNames),
      body: normalize(`${e.summary.fa} ${e.summary.en} ${e.regionLabel.fa} ${e.regionLabel.en}`),
    })),
    ...sources.people.map<SearchItem>((p) => ({
      type: "person",
      id: p.id,
      href: `/people/${p.slug}`,
      title: p.name,
      subtitle: p.role,
      names: both(p.name),
      aliases: alt(p.altNames),
      body: normalize(`${p.role.fa} ${p.role.en} ${p.summary.fa} ${p.summary.en}`),
    })),
    ...sources.events.map<SearchItem>((ev) => ({
      type: "event",
      id: ev.id,
      href: `/events/${ev.slug}`,
      title: ev.title,
      subtitle: ev.summary,
      names: both(ev.title),
      aliases: [],
      body: normalize(`${ev.summary.fa} ${ev.summary.en}`),
    })),
    ...sources.places.map<SearchItem>((pl) => {
      const owners = pl.entityIds
        .map((id) => sources.entityName(id))
        .map((name) => (name ? `${name.fa} ${name.en}` : ""))
        .join(" ");
      return {
        type: "place",
        id: pl.id,
        href: sources.placeHref(pl),
        title: pl.name,
        subtitle: pl.modernLocation,
        names: both(pl.name),
        aliases: alt(pl.altNames),
        body: normalize(
          `${pl.description.fa} ${pl.description.en} ${pl.modernLocation.fa} ${pl.modernLocation.en} ${owners}`,
        ),
      };
    }),
  ];
}

interface Weights {
  exact: number;
  prefix: number;
  word: number;
  inside: number;
}

function scoreField(field: string, token: string, weights: Weights): number {
  if (!field) return 0;
  if (field === token) return weights.exact;
  if (field.startsWith(token)) return weights.prefix;
  if (field.split(" ").some((word) => word.startsWith(token))) return weights.word;
  if (field.includes(token) || squash(field).includes(squash(token))) return weights.inside;
  return 0;
}

const NAME_WEIGHTS: Weights = { exact: 100, prefix: 80, word: 65, inside: 45 };
const ALIAS_WEIGHTS: Weights = { exact: 90, prefix: 70, word: 55, inside: 40 };
const BODY_SCORE = 15;

/**
 * Score one item. Every word of the query must match somewhere (logical AND);
 * the best-matching field decides how many points each word earns.
 */
export function scoreItem(item: SearchItem, normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  const tokens = normalizedQuery.split(" ");

  let total = 0;
  for (const token of tokens) {
    const best = Math.max(
      0,
      ...item.names.map((name) => scoreField(name, token, NAME_WEIGHTS)),
      ...item.aliases.map((alias) => scoreField(alias, token, ALIAS_WEIGHTS)),
      item.body.split(" ").some((word) => word.startsWith(token)) ? BODY_SCORE : 0,
    );
    if (best === 0) return 0; // this word matched nothing → not a result
    total += best;
  }
  const perToken = total / tokens.length;

  // A hit on the whole phrase in a name beats any per-word result.
  const phrase = Math.max(
    0,
    ...item.names.map((name) => scoreField(name, normalizedQuery, NAME_WEIGHTS)),
    ...item.aliases.map((alias) => scoreField(alias, normalizedQuery, ALIAS_WEIGHTS)),
  );

  return Math.max(perToken, phrase > 0 ? phrase + 5 : 0);
}

const TYPE_ORDER: Record<SearchItemType, number> = { entity: 0, person: 1, event: 2, place: 3 };

/** Minimum number of characters before a search runs. */
export const MIN_QUERY_LENGTH = 2;

export function search(index: readonly SearchItem[], query: string, limit = 24): SearchResult[] {
  const normalized = normalize(query);
  if (normalized.length < MIN_QUERY_LENGTH) return [];
  return index
    .map((item) => ({ item, score: scoreItem(item, normalized) }))
    .filter((result) => result.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || TYPE_ORDER[a.item.type] - TYPE_ORDER[b.item.type] || a.item.id.localeCompare(b.item.id),
    )
    .slice(0, limit);
}

/**
 * Group results by type. Inside a group the score order is kept; the groups
 * themselves are ordered by their best result, so the strongest match is always
 * the first row (searching "cyrus" leads with the person, not with an entity
 * whose description merely mentions him).
 */
export function groupResults(results: readonly SearchResult[]): { type: SearchItemType; results: SearchResult[] }[] {
  const order: SearchItemType[] = ["entity", "person", "event", "place"];
  return order
    .map((type) => ({ type, results: results.filter((result) => result.item.type === type) }))
    .filter((group) => group.results.length > 0)
    .sort((a, b) => b.results[0].score - a.results[0].score || TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
}
