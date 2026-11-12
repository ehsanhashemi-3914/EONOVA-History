/**
 * Data schemas — the "shape contract" for every historical record.
 *
 * Zod (rhymes with "god") lets us describe a shape once and get two things:
 *   1. a runtime validator  (schema.parse(data) throws if the data is wrong)
 *   2. a TypeScript type    (z.infer<typeof schema>)
 *
 * The tests run every record through these schemas, so a typo in the content
 * (a missing translation, a year typed as text, an unknown category) fails the
 * test suite instead of silently reaching the user.
 */
import { z } from "zod";

/* ───────────────────────── shared building blocks ───────────────────────── */

const nonEmpty = z.string().trim().min(1);

/** Text that must exist in both languages. */
export const localizedTextSchema = z.object({ fa: nonEmpty, en: nonEmpty });

/** Lists of alternative names, per language (may be empty). */
export const localizedNamesSchema = z.object({
  fa: z.array(nonEmpty),
  en: z.array(nonEmpty),
});

/** Lowercase-with-dashes identifier, also used in URLs ("achaemenid-empire"). */
export const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ids are lowercase words joined by dashes");

export const datePrecisionSchema = z.enum(["exact", "approximate", "disputed"]);

/**
 * A year in astronomical numbering (1 BCE = 0, 550 BCE = -549) plus how
 * firmly it is known. See src/lib/dates for the conversion helpers.
 */
export const historicalDateSchema = z.object({
  year: z.number().int().min(-5000).max(2100),
  precision: datePrecisionSchema,
  /** Optional explanation of the uncertainty. */
  note: localizedTextSchema.optional(),
});

export const regionSchema = z.enum([
  "north-africa",
  "mesopotamia",
  "iranian-plateau",
  "mediterranean",
  "south-asia",
  "east-asia",
  "anatolia-levant",
  "central-asia",
]);

/* ───────────────────────────────── sources ──────────────────────────────── */

export const sourceTypeSchema = z.enum([
  "encyclopedia",
  "museum",
  "academic",
  "institution",
  "primary-source",
  "dataset",
]);

export const sourceSchema = z.object({
  id: idSchema,
  title: nonEmpty,
  /** Person(s) or institution responsible for the text. */
  author: nonEmpty,
  /** Publisher / hosting institution. */
  publisher: nonEmpty,
  /** Publication or last-revision information, when the source states it. */
  published: nonEmpty.optional(),
  url: z.url(),
  type: sourceTypeSchema,
  /** ISO date (YYYY-MM-DD) on which the URL was consulted. */
  accessed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: localizedTextSchema.optional(),
  /** Only for datasets / assets that are redistributed inside the app. */
  license: nonEmpty.optional(),
});

/* ──────────────────────────────── entities ──────────────────────────────── */

/**
 * The kinds are deliberately NOT interchangeable:
 * - civilization: a long-lived cultural sphere spanning many states/dynasties
 * - empire:       one specific imperial state
 * - dynasty:      a ruling house (and the state while that house ruled)
 * - kingdom:      a monarchy that is not usually classed as an empire
 */
export const entityKindSchema = z.enum(["civilization", "empire", "dynasty", "kingdom"]);

export const entityPeriodSchema = z.object({
  id: idSchema,
  name: localizedTextSchema,
  start: historicalDateSchema,
  end: historicalDateSchema,
  note: localizedTextSchema.optional(),
});

export const relationTypeSchema = z.enum([
  "predecessor",
  "successor",
  "rival",
  "conquered",
  "conquered-by",
  "contemporary",
  "trade-contact",
]);

export const entityRelationSchema = z.object({
  entityId: idSchema,
  type: relationTypeSchema,
  note: localizedTextSchema,
});

export const entityCapitalSchema = z.object({
  placeId: idSchema,
  note: localizedTextSchema.optional(),
});

export const entitySchema = z.object({
  id: idSchema,
  slug: idSchema,
  kind: entityKindSchema,
  /** One or two sentences explaining why this kind applies. */
  kindNote: localizedTextSchema,
  name: localizedTextSchema,
  altNames: localizedNamesSchema,
  start: historicalDateSchema,
  end: historicalDateSchema,
  region: regionSchema,
  regionLabel: localizedTextSchema,
  /** One-sentence teaser used on cards and in search results. */
  summary: localizedTextSchema,
  /** Longer overview, one entry per paragraph. */
  overview: z.array(localizedTextSchema).min(1),
  politicalStructure: localizedTextSchema,
  periods: z.array(entityPeriodSchema),
  capitals: z.array(entityCapitalSchema),
  achievements: z.array(localizedTextSchema),
  relations: z.array(entityRelationSchema),
  /** Honest notes about what is uncertain or debated. */
  uncertainty: z.array(localizedTextSchema),
  /** Display colour on the map (hex). Purely presentational. */
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  sourceIds: z.array(idSchema).min(1),
});

/* ───────────────────────────────── places ───────────────────────────────── */

export const placeKindSchema = z.enum(["capital", "city", "site", "battlefield"]);

export const placeSchema = z.object({
  id: idSchema,
  name: localizedTextSchema,
  altNames: localizedNamesSchema,
  kind: placeKindSchema,
  /** [longitude, latitude] in decimal degrees (GeoJSON order). */
  coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
  /** True when the exact spot is not securely identified. */
  approximateLocation: z.boolean(),
  /**
   * Optional years (astronomical numbering) between which the place should be
   * shown at all — e.g. a city is not drawn before it was founded.
   */
  existsFrom: z.number().int().optional(),
  existsTo: z.number().int().optional(),
  modernLocation: localizedTextSchema,
  description: localizedTextSchema,
  entityIds: z.array(idSchema).min(1),
  sourceIds: z.array(idSchema).min(1),
});

/* ───────────────────────────────── events ───────────────────────────────── */

export const eventCategorySchema = z.enum([
  "battle",
  "foundation",
  "political",
  "conquest",
  "collapse",
  "cultural",
  "diplomacy",
]);

export const eventSchema = z.object({
  id: idSchema,
  slug: idSchema,
  title: localizedTextSchema,
  start: historicalDateSchema,
  /** Only for events that span several years. */
  end: historicalDateSchema.optional(),
  category: eventCategorySchema,
  region: regionSchema,
  summary: localizedTextSchema,
  overview: z.array(localizedTextSchema).min(1),
  significance: localizedTextSchema,
  placeId: idSchema.optional(),
  entityIds: z.array(idSchema).min(1),
  personIds: z.array(idSchema),
  uncertainty: localizedTextSchema.optional(),
  sourceIds: z.array(idSchema).min(1),
});

/* ───────────────────────────────── people ───────────────────────────────── */

export const personSchema = z.object({
  id: idSchema,
  slug: idSchema,
  name: localizedTextSchema,
  altNames: localizedNamesSchema,
  role: localizedTextSchema,
  entityId: idSchema,
  birth: historicalDateSchema.optional(),
  death: historicalDateSchema.optional(),
  /** Years in power, when the person was a ruler. */
  reign: z.object({ start: historicalDateSchema, end: historicalDateSchema }).optional(),
  summary: localizedTextSchema,
  overview: z.array(localizedTextSchema).min(1),
  contributions: z.array(localizedTextSchema),
  placeIds: z.array(idSchema),
  uncertainty: localizedTextSchema.optional(),
  sourceIds: z.array(idSchema).min(1),
});

/* ────────────────────────────────── quiz ────────────────────────────────── */

export const quizCategorySchema = z.enum(["chronology", "people", "geography", "concepts"]);
export const quizDifficultySchema = z.enum(["easy", "medium", "hard"]);

export const quizQuestionSchema = z.object({
  id: idSchema,
  category: quizCategorySchema,
  difficulty: quizDifficultySchema,
  question: localizedTextSchema,
  options: z.array(localizedTextSchema).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: localizedTextSchema,
  /** The record in the dataset that this question is derived from. */
  related: z.object({ type: z.enum(["entity", "event", "person"]), id: idSchema }),
  sourceIds: z.array(idSchema).min(1),
});

/* ─────────────────────────────── territories ────────────────────────────── */

/**
 * What a shape on the map actually claims. These are NOT equivalent:
 * - boundary:            a documented political border (none in this release)
 * - approximate-extent:  a modern reconstruction of roughly where rule reached
 * - influence:           a looser zone of dependency or influence
 */
export const territoryRepresentationSchema = z.enum(["boundary", "approximate-extent", "influence"]);

export const territoryConfidenceSchema = z.enum(["low", "moderate", "high"]);

/** Provenance stored with every polygon (as GeoJSON feature properties). */
export const territoryPropertiesSchema = z.object({
  id: idSchema,
  /** Primary entity first; further entities for which the shape is also relevant. */
  entityIds: z.array(idSchema).min(1),
  label: localizedTextSchema,
  /** The year the source snapshot depicts. */
  snapshotYear: z.number().int(),
  /** Years for which we consider the snapshot representative. */
  validFrom: z.number().int(),
  validTo: z.number().int(),
  representation: territoryRepresentationSchema,
  confidence: territoryConfidenceSchema,
  /** How the shape was produced. */
  method: localizedTextSchema,
  /** Geographical caveats specific to this shape. */
  notes: localizedTextSchema,
  sourceIds: z.array(idSchema).min(1),
  /** Name of the feature in the upstream dataset, for traceability. */
  upstreamNames: z.array(nonEmpty).min(1),
  upstreamFile: nonEmpty,
});

/* ─────────────────────────────── inferred types ─────────────────────────── */

export type HistoricalDate = z.infer<typeof historicalDateSchema>;
export type Region = z.infer<typeof regionSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type SourceType = z.infer<typeof sourceTypeSchema>;
export type EntityKind = z.infer<typeof entityKindSchema>;
export type EntityPeriod = z.infer<typeof entityPeriodSchema>;
export type EntityRelation = z.infer<typeof entityRelationSchema>;
export type RelationType = z.infer<typeof relationTypeSchema>;
export type Entity = z.infer<typeof entitySchema>;
export type Place = z.infer<typeof placeSchema>;
export type PlaceKind = z.infer<typeof placeKindSchema>;
export type EventCategory = z.infer<typeof eventCategorySchema>;
export type HistoricalEvent = z.infer<typeof eventSchema>;
export type Person = z.infer<typeof personSchema>;
export type QuizCategory = z.infer<typeof quizCategorySchema>;
export type QuizDifficulty = z.infer<typeof quizDifficultySchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type TerritoryRepresentation = z.infer<typeof territoryRepresentationSchema>;
export type TerritoryConfidence = z.infer<typeof territoryConfidenceSchema>;
export type TerritoryProperties = z.infer<typeof territoryPropertiesSchema>;
