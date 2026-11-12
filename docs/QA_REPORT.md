# QA report

Date of final run: 12 November 2026 · Windows 11, Node 24.16, npm 11.13.
Every result below was produced by actually running the command on the final code.

## 1. Automated checks

| Check | Command | Result |
|---|---|---|
| Type checking | `npm run typecheck` | **Pass** — 0 errors |
| Lint | `npm run lint` | **Pass** — 0 errors, 0 warnings |
| Unit / component tests | `npm test` | **Pass** — 364 tests in 6 files |
| Production build | `npm run build` | **Pass** — 15 routes compiled |
| End-to-end tests | `PW_CHANNEL=msedge npm run test:e2e` | **Pass** — 62 tests (31 × desktop 1440×900 and phone "Pixel 7") |

No error was suppressed to obtain these results. One ESLint rule is disabled on one line
(`react-hooks/exhaustive-deps` for the effect that creates the map exactly once), with a comment.

## 2. What the unit tests cover (`tests/`)

| File | Covers |
|---|---|
| `dates.test.ts` | 550 BCE, 330 BCE, 1 BCE, 1 CE, 117 CE, 651 CE ↔ internal years; **no year zero** for every year 3500 BCE–700 CE in both languages; ranges; centuries; BCE→CE sorting and arithmetic; URL year parsing |
| `data-integrity.test.ts` | every record against its schema; unique ids; all cross-references and citations resolve; chronological consistency; Rome does not end in 476; outlines never labelled as exact borders; geometry file matches metadata |
| `atlas.test.ts` | entity date ranges; who exists in the four milestone years; **map outline selection by year**; honest gaps and nearest references; event sorting, proximity and filtering; place visibility rules |
| `search.test.ts` | Persian/Arabic normalization; English and Persian search; alternative names; AND logic; empty states; result links |
| `compare-quiz.test.ts` | kind mismatch, overlap, gap, shared events; quiz scoring, filtering, deterministic shuffle |
| `i18n-favorites.test.tsx` | dictionary key and placeholder parity; language switch (cookie, localStorage, refresh); favorites persistence, corrupted storage, button state |

## 3. What the end-to-end tests cover (`e2e/atlas.spec.ts`)

Persian RTL by default · language switch and persistence after reload · year change updates
entities, markers and URL · honest "no reliable outline" state and jump to nearest · **offline
basemap fallback** (tile host blocked) · restoring a shared URL · garbage in the URL · step buttons
across 1 BCE/1 CE · search by keyboard (English) and in Persian with empty state · profile →
event → person navigation and source links · favorites surviving reload · comparison kind warning ·
a complete quiz round · timeline filters · HTTP 404 page · every route free of console errors and
horizontal overflow at both viewport sizes.

## 4. Manual browser review

Checked in the built-in browser at desktop width: home page (Persian and English), atlas at
500 BCE and 117 CE, entity profile, language switch. Result: layouts correct in both directions,
no console errors.

## 5. Defects found during QA and fixed

| Found by | Problem | Fix |
|---|---|---|
| Browser | Map only 300 px tall | conflicting `relative`/`absolute` classes; MapLibre's own CSS overrides position → explicit height/width |
| Browser | Place markers far off in RTL | custom `position: relative` overrode MapLibre's absolute positioning → removed |
| Review | Cities shown before they existed; battlefields shown in every century | `existsFrom` on places; battlefields limited to ±25 years of their battle |
| E2E | Unknown slugs returned HTTP 200 | root `loading.tsx` started streaming before `notFound()`; moved to leaf routes |
| E2E | Search "cyrus" led with an entity instead of the person | result groups now ordered by best score |
| E2E | Ten identical "Add to saved" button labels on one page | accessible label now includes the item name |
| E2E | Two test expectations were wrong (ambiguous selector; Egypt and Rome do not overlap) | tests corrected |
| Browser | Overlapping place labels | label de-cluttering by importance |

## 6. Not verified / limits of this QA

- Browsers other than Chromium-based (Edge) were **not** tested. Firefox and Safari are untested.
- No test on a physical phone; mobile was checked by viewport emulation only.
- Automated accessibility auditing (axe, screen-reader passes) was **not** run; accessibility
  rests on semantic HTML, labels, focus styles and keyboard support written by hand.
- Performance was not measured (no Lighthouse run).
- Screenshots of the WebGL map could only be captured reliably after forcing a repaint, so the
  visual review of the map is less thorough than of the other pages.
- Historical content was checked against the cited sources as described in the methodology,
  with the stated limits; it has not been reviewed by a historian.
- The online basemap depends on a third-party service; only its failure path is tested.
