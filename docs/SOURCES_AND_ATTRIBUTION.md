# Sources and attribution

The authoritative, machine-checked list of references is `src/data/sources.ts`
(shown in the app at `/sources`). This document summarizes it and records the
licences of everything redistributed with the app.

## 1. Historical references (71 entries, accessed 11 November 2026)

| Publisher | Entries | Used for | How consulted |
|---|---|---|---|
| Encyclopaedia Iranica | 20 | Achaemenid and Sasanian history, Alexander, the Seleucids, the Arab conquest | Retrieved directly; author and publication details taken from each article's citation block |
| Encyclopaedia Britannica | 30 | Egypt, Assyria, Maurya, Han, Rome, battles | Via search results; only URLs returned by search are cited |
| The Metropolitan Museum of Art — Heilbrunn Timeline | 10 | Chronologies and overviews | Via search results |
| UNESCO World Heritage Centre | 6 | Persepolis, Pasargadae, Sasanian Fars, Memphis, Thebes, Ashur | Retrieved directly |
| The British Museum — Collection online | 2 | Cyrus Cylinder; annals of Ashurbanipal | Via search results |
| Datasets | 3 | Map outlines and basemaps | See below |

No text from these sources is reproduced; all prose in the app is original.
Encyclopaedia Iranica entry "ḴOSROW I" is credited to the encyclopaedia because its
author line could not be extracted automatically.

## 2. Redistributed data

### Historical Basemaps — territory outlines
- Author: André Ourednik and contributors · <https://github.com/aourednik/historical-basemaps>
- Licence: **GPL-3.0** (copy in `data-raw/historical-basemaps/LICENSE` and `/LICENSE`)
- Files used: `world_bc3000 … world_700.geojson` (19 snapshots), stored unmodified in `data-raw/`
- What ships: `public/geo/territories.json` — 37 selected outlines, coordinates rounded to
  three decimals, with added provenance metadata. Modifications are described in
  `scripts/build-geo.mjs` and in `HISTORICAL_DATA_METHODOLOGY.md` §5.
- Consequence: this project is licensed **GPL-3.0-or-later**.

### Natural Earth — offline basemap
- <https://www.naturalearthdata.com/> · **Public domain** (no attribution required; given anyway)
- Files used: `ne_50m_land`, `ne_50m_lakes`, `ne_50m_rivers_lake_centerlines`
- What ships: `public/geo/basemap/{land,lakes,rivers}.json`, rounded to two decimals;
  lakes and rivers filtered by scale rank.

### OpenFreeMap — online basemap tiles (not redistributed)
- <https://openfreemap.org/> — free, no API key, no registration.
- Tiles follow the OpenMapTiles schema; data © OpenStreetMap contributors (ODbL).
- Attribution "OpenFreeMap © OpenMapTiles Data from OpenStreetMap" is displayed on the map
  by MapLibre's attribution control. Tiles are requested only as the visitor views them;
  nothing is scraped or bulk-downloaded.

## 3. Software

| Package | Licence |
|---|---|
| Next.js, React | MIT |
| MapLibre GL JS | BSD-3-Clause |
| Tailwind CSS, Zod, Vitest, Testing Library | MIT |
| lucide-react | ISC |
| Playwright | Apache-2.0 |
| Vazirmatn, Inter (via Fontsource) | SIL Open Font License 1.1 |

## 4. Images

None are used in this release.

## 5. Suggested credit line

> EONOVA ATLAS. Outlines: Historical Basemaps (A. Ourednik et al., GPL-3.0), shown as
> approximate reconstructions. Basemap: © OpenStreetMap contributors, OpenFreeMap,
> OpenMapTiles; Natural Earth.
