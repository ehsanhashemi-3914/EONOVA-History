# Learning notes

A study guide to this codebase: terms, the files worth reading first, and
questions to test yourself. Read alongside `PROJECT_ARCHITECTURE.md`.

## Read these files first, in this order

1. `src/lib/dates/index.ts` — small, pure, heavily commented. Then `tests/dates.test.ts`.
2. `src/data/schema.ts` — the shape of every record.
3. `src/data/entities/achaemenid-empire.ts` — what content looks like.
4. `src/lib/atlas/index.ts` — "what existed in year Y?"
5. `src/app/atlas/page.tsx` → `src/components/atlas/AtlasExplorer.tsx` — a request becoming a screen.
6. `src/components/map/AtlasMap.tsx` — the hardest file; read it last.

## Glossary

| Term | Say it | Meaning | Here |
|---|---|---|---|
| Component | kum-POH-nent | a function that returns a piece of UI | everything in `src/components` |
| Props | props | inputs passed to a component | `<TimeBar year onChange>` |
| State | state | data a component remembers between renders | `year` in `AtlasExplorer` |
| Hook | hook | a `use…` function that gives a component a capability | `useState`, `useI18n`, `useFavorites` |
| Effect | ih-FEKT | code that runs after render to sync with something outside React | creating the map; writing the URL |
| Ref | ref | a box that survives renders without causing them | the MapLibre instance |
| Server Component | — | renders on the server only; no state | every `page.tsx` |
| Client Component | — | also runs in the browser; marked `"use client"` | the atlas, quiz, header |
| Hydration | hy-DRAY-shun | React attaching behaviour to server-made HTML | why dates are formatted identically on both sides |
| Route / dynamic segment | root | a URL handled by a folder; `[slug]` matches any value | `src/app/entities/[slug]` |
| Query string | — | the `?y=-499` part of a URL | atlas and timeline state |
| Schema | SKEE-muh | a formal description of a data shape | Zod schemas in `schema.ts` |
| Pure function | — | same input → same output, no side effects | everything in `src/lib` |
| Derived state | — | values computed from state, not stored | active entities for a year |
| Controlled component | — | an input whose value is owned by its parent | `TimeBar` |
| i18n / locale | eye-eighteen-en / LOH-kal | internationalization / a language setting | `src/i18n` |
| RTL / LTR | — | right-to-left / left-to-right | Persian / English |
| GeoJSON | JEE-oh-JAY-son | JSON format for map shapes | `public/geo/*.json` |
| Tile | — | a small square piece of a map, loaded on demand | OpenFreeMap |
| Web worker | — | a background JavaScript thread | MapLibre's tile parser |
| Fallback | — | what the app does when the preferred path fails | offline basemap |
| Unit / e2e test | — | tests one function / tests the whole app in a browser | `tests/` / `e2e/` |
| Lint | lint | static checking for likely mistakes | `npm run lint` |
| Provenance | PROV-uh-nunss | where a piece of data came from | every outline's metadata |

## Kinds of knowledge — keep them apart

| Kind | Example from this project |
|---|---|
| Syntax | `const [year, setYear] = useState(0)` is array destructuring |
| Concept | single source of truth; separation of concerns |
| Framework convention | a file named `page.tsx` becomes a route (Next.js only) |
| Architecture decision | no backend; content as typed files |
| Project decision | astronomical year numbering; outlines shown only inside validity windows |
| Best practice | validate untrusted input (the URL) at the boundary |
| Preference | Tailwind utility classes instead of separate CSS files |

## Debugging lessons from the build

1. **A map 300 px tall.** Symptom: the map filled only a strip. Evidence: measured each
   ancestor's height in the browser. Cause: two conflicting position classes, and a third-party
   stylesheet overriding ours. Lesson: when layout is wrong, measure the chain of parents.
2. **Markers 1000 px off, only in Persian.** Cause: our CSS changed `position` on an element the
   library positions itself. Lesson: a bug that appears in one language/direction is a clue.
3. **A blank map in screenshots.** The page was fine; the capture tool missed the WebGL frame.
   Lesson: confirm the measuring instrument before debugging the thing measured.
4. **404 pages answering 200.** A loading screen started the response before the page knew it
   was missing. Lesson: a test asserting the status code caught what the eye could not.
5. **Tests that were wrong.** Two failures were mistakes in the tests, not the app (Egypt and Rome
   miss each other by three years). Lesson: a failing test is a claim to investigate, not a verdict.

## Check your understanding

1. Why is 550 BCE stored as −549 and not −550? What is stored for 1 BCE?
2. Which single line of state changes when you drag the slider, and name three things on screen
   that are recomputed from it.
3. Why can `AtlasMap` not be a Server Component?
4. A year has an active entity but no outline. Which function decides that, and what does the
   interface show instead?
5. Where would you add a new event, and which test would fail if you misspelled its entity id?
6. Why are place labels HTML elements rather than text drawn by the map engine?
7. What would happen to the language choice if the cookie were removed but localStorage kept?
