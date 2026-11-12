# Project architecture

This document explains how EONOVA ATLAS is put together and why. It is written for someone
learning to read a codebase: each section says **what exists, where it lives, who calls it, and
why it was designed that way**.

## 1. The big picture

EONOVA ATLAS is a *frontend-only* web application. There is no database and no API of our own.

```
Browser
  │  requests a URL, e.g. /atlas?y=-499
  ▼
Next.js server (App Router)
  │  1. reads the language cookie             src/i18n/server.ts
  │  2. validates the query string            src/app/atlas/page.tsx
  │  3. renders Server Components to HTML
  ▼
Browser receives HTML + JavaScript
  │  Client Components "hydrate" (become interactive)
  ▼
Interactive islands
  ├─ AtlasExplorer ──► lib/atlas (pure queries) ──► data/ (typed records)
  ├─ AtlasMap      ──► fetch /geo/territories.json ──► MapLibre GL (WebGL canvas)
  │                 └► tiles.openfreemap.org   (or bundled Natural Earth fallback)
  └─ favorites, quiz best scores ──► localStorage
```

The only network calls made at run time are for map data: the app's own static files under
`/geo/…` and, when online, vector tiles from OpenFreeMap.

## 2. Layers and the rule that connects them

| Layer | Folder | Knows about | Must not know about |
|---|---|---|---|
| Routes | `src/app` | URL, query string, which components to render | how anything is drawn |
| Components | `src/components` | layout, interaction, React state | historical facts |
| Logic | `src/lib` | years, ranges, scoring, searching | React, the DOM |
| Content | `src/data` | history, sources | presentation (except an entity's display colour) |
| Geodata | `public/geo`, `scripts/` | geometry and its provenance | anything else |

**The rule (separation of concerns):** components never contain historical facts, and the map only
draws what the data and logic layers hand it. If Sasanian dates change, one content file changes;
no component is touched. Conversely, the map component can be rewritten without re-checking history.

`src/data/index.ts` is the single doorway into the content ("data access layer"). Everything else
imports from `@/data`, never from individual content files, so the storage format stays private.

## 3. Server Components and Client Components

Next.js renders two kinds of React component:

- **Server Components** (the default) run only on the server. They can read cookies and produce
  HTML, but cannot hold state or respond to clicks. All pages (`page.tsx`) and the text-heavy
  profile pages are Server Components: fast first paint, little JavaScript.
- **Client Components** start with `"use client"`. They run in the browser too and can use state,
  effects and browser APIs. `AtlasExplorer`, `AtlasMap`, `TimeBar`, `SearchPalette`, `Quiz`,
  `FavoriteButton` and the header are Client Components.

A Server Component may render a Client Component and pass it *serializable* props (strings,
numbers, plain objects) — not functions. That is why, for example, `/atlas/page.tsx` passes an
`initial` state object to `AtlasExplorer`, and why `LifespanChart` switches between "links" and
"buttons" depending on whether a callback prop was given.

## 4. State: where it lives and how it flows

There is no global state library. Each kind of state lives in the smallest place that works:

| State | Lives in | Why |
|---|---|---|
| Selected year, selected entity/place, reference toggle | `useState` in `AtlasExplorer`, mirrored to the URL | one owner; shareable; survives reload |
| Timeline filters | `useState` in `TimelineExplorer`, mirrored to the URL | same |
| Compare selection, list filters (kind, region, source type) | **the URL only**; server renders the result | works without JavaScript |
| Language | cookie (+ localStorage copy), read on the server | correct `lang`/`dir` in the first HTML |
| Favorites, quiz best scores | localStorage via `createLocalStore` + `useSyncExternalStore` | per-browser, no account |

Atlas data flow for one slider move:

```
<input type=range> onChange
  → TimeBar.onChange(year)                       (child tells parent)
  → AtlasExplorer.setYear(year)                  (single source of truth)
     ├─► <AtlasMap year>  → effect → map.setFilter(validFrom ≤ year ≤ validTo)
     ├─► entitiesActiveIn(year) → side-panel cards
     ├─► resolveTerritory(entity, year) → "outline shown" / "no reliable outline"
     ├─► eventsNear(year, 25) → event list
     └─► history.replaceState(/atlas?y=…)        (debounced 250 ms)
```

Everything on screen is *derived* from the year by pure functions; nothing is stored twice.

## 5. The date system (`src/lib/dates`)

All years are integers in astronomical numbering (1 BCE = 0, 550 BCE = −549), so sorting,
subtracting and range checks are ordinary arithmetic. Conversion to "550 BCE" / «۵۵۰ پ.م» happens
only at display time. Digits are converted by hand rather than with `Intl` so that server and
browser always produce identical text (a mismatch would be a React hydration error).

## 6. The map (`src/components/map`)

- `AtlasMapLazy` loads MapLibre with `next/dynamic({ ssr: false })`: the ~1 MB library is fetched
  only when a map appears and never runs on the server.
- `AtlasMap` creates the MapLibre instance **once** in an effect and afterwards pushes prop changes
  into it (`setFilter`, `setPaintProperty`). Callback props are kept in refs so that changing them
  never recreates the map.
- **Year filtering is done by the map engine**: all 37 outlines are loaded as one GeoJSON source and
  each layer has a filter on the `validFrom`/`validTo` properties.
- **Labels are HTML markers**, not map text layers. The browser shapes Persian correctly and no
  font ("glyph") server is required, so labels also work on the offline basemap.
- **Basemap fallback**: before starting, the app probes the tile server with a 4-second timeout;
  if it is unreachable — or tiles start failing later — the style is swapped to three bundled
  Natural Earth files. Historical overlays are re-installed on every `style.load` event.
- `scripts/copy-map-worker.mjs` copies MapLibre's web-worker file into `public/vendor/` before
  `dev`/`build`, because MapLibre 6 cannot locate it after bundling.

## 7. Geodata pipeline (`scripts/build-geo.mjs`)

```
data-raw/historical-basemaps/world_*.geojson ─┐
                                              ├─► MANIFEST (which feature, which years, caveats, sources)
                                              │      └─► public/geo/territories.json      (geometry + provenance)
                                              │      └─► src/data/generated/territory-meta.json (provenance only)
                                              └─► EXCLUDED ─► src/data/generated/excluded-outlines.json
data-raw/natural-earth/ne_50m_*.geojson ───────► public/geo/basemap/{land,lakes,rivers}.json
```

The raw snapshots (~19 MB) never reach the browser; the shipped outline file is ~350 KB. Because
every outline must pass through the manifest, none can appear on the map without a validity window,
written caveats and sources.

## 8. Internationalization (`src/i18n`)

- `dictionaries/en.ts` defines the shape; `fa.ts` must match it (TypeScript + a unit test).
- Server Components call `getI18n()`; Client Components call `useI18n()`.
- Switching language writes the cookie and calls `router.refresh()`, which asks the server to
  render the current route again in the other language — no full page reload.
- Layout uses CSS *logical* properties (`ps-`, `me-`, `inset-inline-start`), so the same styles
  work in RTL and LTR. Timelines therefore run right-to-left in Persian.

## 9. Design system

Design tokens (colours, fonts, radii) are declared once in the `@theme` block of
`src/app/globals.css`; Tailwind turns them into utility classes (`bg-coal`, `text-gold`).
Reusable pieces live in `src/components/ui`. The visual language is deliberately restrained:
charcoal surfaces, parchment text, one antique-gold accent, dashed lines for anything approximate.

## 10. Error handling

- Query-string input is validated at the route (`parseYearParam`, Zod `safeParse`, id lookups);
  invalid values fall back to defaults instead of throwing.
- `src/app/error.tsx` is the route error boundary; `not-found.tsx` handles unknown URLs and
  unknown slugs (`notFound()`), returning a real HTTP 404.
- Storage access is wrapped in `try/catch` and stored data is validated before use, so blocked or
  corrupted localStorage cannot crash the app.
- The map reports "could not start" (no WebGL) or "offline basemap" instead of showing a blank box.

## 11. Testing strategy

| Level | Tool | What it proves |
|---|---|---|
| Unit | Vitest | date maths, atlas queries, search, comparison, quiz scoring, data integrity |
| Component | Vitest + Testing Library (jsdom) | language switching, favorites persistence |
| End-to-end | Playwright (desktop + phone viewport) | real user journeys against the production build |

See [QA_REPORT.md](QA_REPORT.md) for the results.

## 12. Decisions and alternatives

| Decision | Alternative considered | Why this one |
|---|---|---|
| Content as typed TypeScript files | JSON files, a CMS, a database | compile-time checking, zero infrastructure, easy to review |
| No backend | API routes + database | nothing needs server-side state; simpler to run and to trust |
| Cookie-based language, no `/fa` URL prefix | locale in the path | keeps the URLs exactly as specified; cost: pages render per request |
| HTML markers for labels | MapLibre symbol layers + RTL plugin | correct Persian shaping, offline-safe; fine for a few dozen labels |
| Hand-written search | a search library | a few hundred records; full control over Persian normalization |
| URL as state for compare/filters | client state | shareable and JavaScript-independent |
| Open dataset for outlines | drawing outlines by hand | provenance and honesty; cost: GPL-3.0 licence and coverage gaps |
