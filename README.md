# EONOVA ATLAS

**Explore the Past. Understand the World.** · «گذشته را بکاوید. جهان را بفهمید.»

EONOVA ATLAS is an interactive historical atlas and digital museum. Pick a year between
3500 BCE and 700 CE and see which civilizations, empires and dynasties of the collection existed,
roughly where they ruled, what happened around that time and who was involved — with every record
tied to a source and every uncertainty labelled.

It is Persian-first (right-to-left) with a complete English mode, runs entirely in the browser from
a local dataset, and needs no account, API key, database or backend.

> This is a curated **first release**: eight subjects, 30 events, 20 people, 28 places, 71 sources.
> It is not an exhaustive encyclopedia, and its map outlines are **approximate reconstructions**, not
> surveyed borders. See [Known limitations](#known-limitations).

## Features

| Area | What it does |
|---|---|
| **Atlas** `/atlas` | MapLibre map driven by the selected year: approximate outlines, place markers, hover captions, legend, reset view, shareable URL (`?y=-499&e=achaemenid-empire`). Falls back to a bundled offline basemap if the tile server is unreachable. |
| **Time controls** | Slider, ±1/±10/±100 steps, "go to year" form, four milestone presets (550 BCE, 330 BCE, 117 CE, 651 CE) and further jump years. |
| **Honest gaps** | When no trustworthy outline exists for a year, the atlas shows markers only, says so, and offers the nearest reconstruction as a clearly labelled reference. |
| **Timeline** `/timeline` | Lifespans of all entities and every event on one scale; filters by region, category and entity. |
| **Profiles** | Entities `/entities/[slug]`, events `/events/[slug]`, people `/people/[slug]`, with cross-links, uncertainty notes and citations. Entity pages include a mini-map. |
| **Search** | Ctrl+K palette over entities, people, events and places; Persian and English; alternative names; keyboard navigation; empty state. |
| **Compare** `/compare` | Two entities side by side, with an explicit warning when they are different *kinds* of entity. |
| **Quiz** `/quiz` | 24 multiple-choice questions derived from the dataset, by category and difficulty, with explanations, source links, scoring and replay. |
| **Favorites** `/favorites` | Save entities, events and people in this browser (localStorage). |
| **Sources** `/sources`, **Method** `/about` | The full source registry with citation counts; methodology, exclusions and licences. |
| **Languages** | Persian (default, RTL) and English (LTR); the choice is remembered. |

## Technology

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript 6** (strict)
- **Tailwind CSS 4** with design tokens in `src/app/globals.css`
- **MapLibre GL JS 6** for the map (no API key)
- **Zod 4** for validating the historical dataset
- **Vitest 5** + Testing Library (unit/component tests) · **Playwright** (end-to-end tests)
- Fonts: **Vazirmatn** (Persian) and **Inter** (English), bundled via `@fontsource-variable`
- Icons: **lucide-react**

## Getting started

Requirements: Node.js 20.9 or newer (developed on Node 24) and npm.

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

### Production build

```bash
npm run build
```

```bash
npm run start
```

### All commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no output files |
| `npm test` | Unit and component tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) — run `npm run build` first |
| `npm run geo:build` | Rebuild map data from `data-raw/` |

End-to-end tests use Playwright's own Chromium (`npx playwright install chromium` once). To reuse a
browser already installed instead, set `PW_CHANNEL`, e.g. in PowerShell:
`$env:PW_CHANNEL = 'msedge'; npm run test:e2e`.

## Project structure

```
src/
  app/                    Routes (one folder per URL) + layout, error, not-found
  components/
    layout/               Header, footer, logo
    ui/                   Buttons, badges, cards, citations, favorites
    map/                  AtlasMap (MapLibre), basemap styles, legend
    atlas/ timeline/      The interactive explorers and the year controls
    entity/ compare/ quiz/ search/ home/
  data/                   THE HISTORICAL CONTENT
    schema.ts             Zod schemas = the shape of every record
    sources.ts            Source registry
    entities/*.ts         One file per civilization / empire / dynasty
    events.ts people.ts places.ts quiz.ts milestones.ts
    generated/            Written by scripts/build-geo.mjs (do not edit by hand)
    index.ts              The only module the app imports data from
  i18n/                   Locale config, dictionaries (fa, en), provider
  lib/
    dates/                Astronomical-year utilities
    atlas/                "What existed in year Y?" queries
    search/ compare/ quiz/ storage/
public/geo/               Map data shipped to the browser
scripts/                  build-geo.mjs, copy-map-worker.mjs
data-raw/                 Downloaded source datasets (not shipped)
tests/                    Vitest unit tests
e2e/                      Playwright tests
docs/                     Architecture, methodology, attribution, QA, demo script
```

Longer explanations: [docs/PROJECT_ARCHITECTURE.md](docs/PROJECT_ARCHITECTURE.md).

## How historical dates work

Historians count `… 2 BCE, 1 BCE, 1 CE, 2 CE …` — there is no year zero. Arithmetic on such numbers
goes wrong at the boundary, so the atlas stores every year as an **astronomical year**:

| Historian's year | Stored as |
|---|---|
| 1 CE | `1` |
| 1 BCE | `0` |
| 2 BCE | `-1` |
| 550 BCE | `-549` |

`0` is a valid stored value (it means 1 BCE) but is never displayed: all labels go through
`src/lib/dates` (`formatYear`, `formatRange`, `formatCentury`, …). In content files you write
`bce(550)` or `ce(117)` and the helper converts. Each date also carries a **precision**:
`exact`, `approximate` (shown with "c." / «حدود») or `disputed` (shown as scholarly debate).

## How the data is organized

Every record is a plain TypeScript object checked against a schema in `src/data/schema.ts`.
Records refer to each other by `id`, and to references by `sourceIds`. `npm test` validates all of
it: schemas, unique ids, that every cross-reference resolves, and chronological consistency.

All text is bilingual: `tx("متن فارسی", "English text")`.

### Add a civilization, empire or dynasty

1. Add its references to `src/data/sources.ts`.
2. Create `src/data/entities/<id>.ts` exporting an `Entity` (copy an existing file). Choose the
   `kind` carefully — `civilization`, `empire`, `dynasty` and `kingdom` are not interchangeable —
   and explain the choice in `kindNote`.
3. Register it in the array in `src/data/index.ts`.
4. Optionally add capitals to `places.ts` and outlines (see below).
5. Run `npm test`.

### Add an event

Append an `event({...})` to `src/data/events.ts`: `id`, bilingual `title`, `start` (and `end` for
multi-year events), `category`, `region`, `summary`, `overview`, `significance`, `entityIds`,
optional `placeId`, `personIds`, `uncertainty`, and `sourceIds`. It then appears on the timeline, in
the atlas panel near its year, on related profiles and in search.

### Add a historical person

Append a `person({...})` to `src/data/people.ts`. Give `birth`, `death` and `reign` only where a
cited source states them, and use `uncertainty` for debated points. Do not add quotations.

### Add a place

Append a `place({...})` to `src/data/places.ts` with `[longitude, latitude]`. Set
`approximateLocation: true` when the spot is not securely identified, and `existsFrom` when the
place should not be shown before a founding date. Battlefields appear only within 25 years of an
event recorded at them.

### Add a geographical feature (outline)

Outlines are produced by `scripts/build-geo.mjs` from the snapshots in
`data-raw/historical-basemaps/`. Add an entry to its `MANIFEST`: the upstream file and feature
name(s), the entity, the years for which it may be shown (`from`/`to`), its `representation`,
bilingual `notes` listing every known caveat, and `sourceIds`. Then run `npm run geo:build`.
If an upstream outline is wrong for its date, add it to `EXCLUDED` with the reason instead.
**Never draw a border by hand to fill a gap.**

## How citations work

`src/data/sources.ts` is the registry: id, title, author or institution, publisher, publication
details where the source states them, URL, type, access date, optional notes and licence. Entities,
events, people, places, quiz questions and map outlines list `sourceIds`; profile pages render them
as a numbered reference list linking to the original, and `/sources` shows the whole registry with
how many records cite each entry. A test fails if a record cites an unknown id or a source is never
cited.

## Known limitations

- **Scope.** Eight subjects cannot represent world history; many regions and peoples are absent.
  Gaps on the map are gaps in the collection.
- **Outlines are approximate.** All come from the open *Historical Basemaps* dataset, which rates
  them at its lowest border precision and calls itself a work in progress. They are drawn dashed and
  labelled "approximate reconstructed extent".
- **Gaps in outlines.** No outline for the Achaemenid Empire before 520 BCE or for Alexander's
  empire before 325 BCE; none for the Sasanian Empire after 609 CE; none for the Western Roman court
  after 409 CE or for the Han during the Xin interregnum. The Neo-Assyrian outline shows only the
  Assyrian heartland; the Roman outline for 117 CE omits Trajan's short-lived eastern provinces.
- **Known mismatches** inside upstream outlines are listed in each outline's caveats (for example,
  the later Achaemenid outline includes Egypt during its independence).
- **Modern coastlines.** The basemap shows today's coastlines and rivers.
- **Sources.** Scholarly encyclopedias and institutional pages were used; no primary-source
  editions or specialist monographs were consulted directly. A few facts of general knowledge
  (e.g. some regnal dates in the Egyptian chronology) follow the cited chronologies as recalled and
  should be re-checked before academic use.
- **Language persistence** uses a cookie; pages are therefore rendered per request rather than
  pre-built as static files.
- No images are included in this release.

## Licence

The code is released under **GPL-3.0-or-later**, because the app redistributes outlines from the
GPL-3.0 *Historical Basemaps* dataset. See [docs/SOURCES_AND_ATTRIBUTION.md](docs/SOURCES_AND_ATTRIBUTION.md)
for all third-party data and their terms.
