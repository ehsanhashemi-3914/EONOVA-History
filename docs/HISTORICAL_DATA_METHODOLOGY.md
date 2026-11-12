# Historical data methodology

How the content of EONOVA ATLAS was researched, structured and limited.

## 1. Principles

1. **Accuracy before coverage.** The numbers in the brief (8 entities, 16 events, 12 people) were
   targets, not quotas. Nothing was added to reach a number.
2. **Every record is cited.** Entities, events, people, places, quiz questions and map outlines all
   carry `sourceIds`. A test fails if one is missing or points nowhere.
3. **Uncertainty is data.** Dates carry a precision; records carry `uncertainty` notes; outlines
   carry caveats and a confidence label. Uncertain things are never presented as settled.
4. **No invention.** No quotations, discoveries, documents or borders were made up. Where
   something could not be supported it was omitted or labelled.
5. **Original wording.** All text was written for this project; nothing was copied from a source.
6. **Neutral tone.** No superlatives of national pride; contested modern readings are flagged
   (for example the description of the Cyrus Cylinder as a "charter of human rights").

## 2. Research process

Research was done on 11 November 2026 using web search restricted to institutional and scholarly
sites, plus direct retrieval where the site allowed it.

| Source | How it was consulted |
|---|---|
| Encyclopaedia Iranica | Articles retrieved directly; author, volume/pages and publication dates copied from each article's own citation block |
| UNESCO World Heritage Centre | List pages retrieved directly |
| Encyclopaedia Britannica | Consulted through search results (the site blocks scripted access); only URLs returned by search are cited |
| The Metropolitan Museum of Art (Heilbrunn Timeline) | Same as Britannica |
| The British Museum (collection records) | Same as Britannica |

A source was added to the registry only if its URL was confirmed to exist on that date.

**Limits of this process — please read.** Specialist monographs, journals and primary-source
editions were *not* consulted directly. Britannica, Met and British Museum pages were read through
search-result extracts rather than in full. A small number of widely known details — notably the
approximate regnal years of Khufu and Hatshepsut — follow the Metropolitan Museum's published
chronology as recalled, without the page text in hand. The dataset is a careful reference-level
summary, not a piece of original scholarship, and should be checked against the cited sources
before academic use.

## 3. Kinds of entity

The schema forces every entity to declare what kind of thing it is, and to justify it in `kindNote`:

| Kind | Meaning | In this release |
|---|---|---|
| `civilization` | a long-lived cultural sphere spanning many states and dynasties | Ancient Egypt |
| `empire` | one specific imperial state | Neo-Assyrian, Achaemenid, Maurya, Roman, Sasanian; Macedonian (see note) |
| `dynasty` | a ruling house and the state while it ruled | Han |
| `kingdom` | a monarchy not usually classed as an empire | none yet |

- **Macedonian Empire and the Hellenistic world** is one profile covering two different things:
  Alexander's single empire (to 323 BCE) and then several rival successor kingdoms. The profile and
  the map label them separately.
- **Roman Empire** runs from 27 BCE to 1453 CE with four periods. The year 476 CE ends only the
  *western* court; the Eastern Roman (Byzantine) Empire continues. A unit test guards this.
- **Han** contains the Xin interregnum (9–23 CE) as a period explicitly marked "not Han".

The comparison page refuses to treat different kinds as like-for-like and says why.

## 4. Dates

- Stored as astronomical years (1 BCE = 0); see `src/lib/dates`.
- Precision values:
  - `exact` — securely dated (e.g. Gaugamela, 1 October 331 BCE, fixed by Babylonian astronomical diaries);
  - `approximate` — conventional or circa (e.g. the unification of Egypt, the founding of Persepolis);
  - `disputed` — active scholarly disagreement (e.g. al-Qadisiyyah: 636/637 CE, or 634–635 CE).
- Where reference works disagree, the disagreement is recorded rather than resolved silently:
  Ashoka's reign (c. 273–232, c. 269–232 or c. 265–238 BCE); the Han beginning (206 or 202 BCE);
  the Neo-Assyrian period (from 911 or from c. 746 BCE; to 612 or 609 BCE); Shapur I's accession
  (239, 240 or 241 CE); the day of the Battle of Hormozdgan, given two ways within Encyclopaedia
  Iranica itself.
- Egyptian period dates follow the Metropolitan Museum's chronology; other systems differ by decades.

## 5. Map outlines

### Source

All outlines come from **Historical Basemaps** (André Ourednik and contributors, GPL-3.0). Its own
README says it is a "work in progress" to be verified before academic use, and every feature used
here has `BORDERPRECISION = 1` ("approximate"), which we map to confidence **low**.

### What an outline is — and is not

| Representation | Meaning | Drawn as |
|---|---|---|
| `boundary` | a documented political border | *not used in this release* |
| `approximate-extent` | a modern reconstruction of roughly where rule reached | soft fill, dashed edge |
| `influence` | a zone of alliance, dependency or influence | faint fill, dotted edge |
| marker | a significant location (a point) | diamond / dot |
| reference outline | an outline from a *different* year, shown on request | dotted line, no fill |

A unit test asserts that no outline is labelled `boundary` or high-confidence.

### Validity windows

Each snapshot is shown only for the years in which it is a fair approximation. The window is an
editorial judgement made by comparing the snapshot with the cited sources, and is stored with the
outline (`validFrom`, `validTo`) together with the reasoning (`notes`).

Outside every window, the atlas shows the entity's documented places as markers, states
"No reliable outline for <year>", and offers the nearest reconstruction either as a jump link or —
if the visitor switches it on — as a dotted reference outline.

### Editorial interventions (all recorded in the outline's caveats)

- **Re-dating.** The upstream "200 BCE" Mauryan outline shows the empire at its Ashokan maximum; by
  200 BCE it had shrunk. It is shown for 261–232 BCE instead.
- **Label correction.** The upstream "300 CE" snapshot labels the Iranian state "Parthian Empire",
  although the Sasanians had replaced the Parthians in 224 CE. The geometry is used as the early
  Sasanian realm (240–386 CE) with the error documented.
- **Narrowed use.** The upstream "300 BCE" Successor kingdoms depict the situation before the
  Battle of Ipsos (301 BCE) and are shown only for 305–302 BCE. The Egypt-only Ptolemaic outline
  from that snapshot is reused as a schematic core for 200–30 BCE.
- **Merged features.** The four Tetrarchic portions of c. 300 CE are combined into one Roman outline.

### Known mismatches left visible

Listed in the relevant caveats, for example: the later Achaemenid outline includes Thrace and
(during 404–343 BCE) independent Egypt; the early Mauryan outline includes Kalinga before its
conquest; the early Han outline reaches into independent Nanyue; the 100 CE Roman outline is too
generous for Britain in the 40s–70s CE; the c. 500 CE Sasanian outline extends east into
Hephthalite-dominated lands.

### Excluded upstream features

Seven upstream features were rejected as anachronistic or duplicated (Mauryan, Seleucid, Ptolemaic
and Han at 100 BCE; Western Roman at 500 CE; Sasanian at 700 CE; pre-Neo-Assyrian Assyria). The
list with reasons is generated into `src/data/generated/excluded-outlines.json` and shown on the
Method page.

### Gaps

No outline exists for: the Achaemenid Empire 550–521 BCE and 333–330 BCE; Alexander's empire
336–326 BCE; much of the Hellenistic world between 189 and 30 BCE outside Egypt; the Maurya Empire
before 303 and after 232 BCE; the Han 111 BCE transition aside, the Xin years 9–24 CE; Rome
533–554 and 611–649 CE and the West after 409 CE; the Sasanian Empire 224–239 and 610–651 CE.
The Neo-Assyrian outline covers only the Assyrian heartland.

## 6. Places

Coordinates are those of the archaeological site or the modern city over it, rounded to two
decimals. `approximateLocation` marks uncertain spots (Gaugamela, al-Qadisiyyah, the Kalinga
region). `existsFrom` keeps a city off the map before its foundation (Alexandria, Persepolis,
Pasargadae, Antioch, Constantinople, Bishapur). Battlefields appear only within 25 years of a
battle recorded there. The Battle of Hormozdgan has no marker: its site is not securely identified.

## 7. People

Birth and death years are given only where the cited sources give them. Reigns state their
counting rule when ambiguous (Seleucus I from the seizure of Babylon, 312 BCE). Traditional
accounts are labelled as tradition (Chandragupta's Jainism; Menes). No quotations are attributed.

## 8. Quiz

Every question points at a dataset record (`related`) and reuses its sources; a test checks that the
record exists and that each question has four distinct options in both languages. Several questions
test the *method* (kinds of entity, the meaning of 476 CE, a disputed date) rather than recall.

## 9. Images

No images are used in this release, so no image licences apply.
