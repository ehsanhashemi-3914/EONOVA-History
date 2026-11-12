/**
 * Source registry — every reference the atlas cites, in one place.
 *
 * Records elsewhere point here by `id` (see `sourceIds` on entities, events,
 * people, places and territories). Each URL below was confirmed to exist on the
 * access date; bibliographic details are copied from the source's own citation
 * block where it provides one, and left out where it does not.
 */
import type { Source } from "./schema";

const ACCESSED = "2026-11-11";

const IRANICA = "Encyclopaedia Iranica (Encyclopaedia Iranica Foundation / Brill)";
const MET = "The Metropolitan Museum of Art — Heilbrunn Timeline of Art History";
const MET_AUTHOR = "The Metropolitan Museum of Art (curatorial departments)";
const BRITANNICA = "Encyclopaedia Britannica";
const BRITANNICA_AUTHOR = "The Editors of Encyclopaedia Britannica and contributors";
const UNESCO = "UNESCO World Heritage Centre";

function iranica(id: string, title: string, author: string, path: string, published?: string): Source {
  return {
    id,
    title,
    author,
    publisher: IRANICA,
    published,
    url: `https://www.iranicaonline.org/articles/${path}/`,
    type: "encyclopedia",
    accessed: ACCESSED,
  };
}

function met(id: string, title: string, url: string): Source {
  return { id, title, author: MET_AUTHOR, publisher: MET, url, type: "museum", accessed: ACCESSED };
}

function britannica(id: string, title: string, path: string): Source {
  return {
    id,
    title,
    author: BRITANNICA_AUTHOR,
    publisher: BRITANNICA,
    url: `https://www.britannica.com/${path}`,
    type: "encyclopedia",
    accessed: ACCESSED,
  };
}

function unesco(id: string, title: string, listNumber: number): Source {
  return {
    id,
    title,
    author: UNESCO,
    publisher: UNESCO,
    url: `https://whc.unesco.org/en/list/${listNumber}/`,
    type: "institution",
    accessed: ACCESSED,
  };
}

export const sources: Source[] = [
  /* ── Encyclopaedia Iranica ── */
  iranica(
    "ir-achaemenid-dynasty",
    "ACHAEMENID DYNASTY i. The clan and dynasty",
    "Rüdiger Schmitt",
    "achaemenid-dynasty/achaemenid-dynasty-i-the-clan-and-dynasty",
    "Vol. I, Fasc. 4, pp. 414–426; published 15 December 1983",
  ),
  iranica(
    "ir-achaemenid-empire",
    "ACHAEMENID DYNASTY ii. The empire",
    "Rüdiger Schmitt",
    "achaemenid-dynasty/achaemenid-dynasty-ii-the-empire",
    "Vol. I, Fasc. 4, pp. 414–426; published 15 December 1983",
  ),
  iranica(
    "ir-cyrus-ii",
    "CYRUS iii. Cyrus II The Great",
    "Muhammad A. Dandamayev",
    "cyrus-iii",
    "Vol. VI, Fasc. 5, pp. 516–521; published 15 December 1993",
  ),
  iranica(
    "ir-darius-i",
    "DARIUS iii. Darius I the Great",
    "A. Shapur Shahbazi",
    "darius-iii",
    "Vol. VII, Fasc. 1, pp. 41–50; published 15 December 1994",
  ),
  iranica("ir-pasargadae", "PASARGADAE", "David Stronach and Hilary Gopnik", "pasargadae", "Published 20 July 2009"),
  iranica("ir-persepolis", "PERSEPOLIS", "A. Shapur Shahbazi", "persepolis", "Published 15 August 2009"),
  iranica(
    "ir-alexander",
    "ALEXANDER THE GREAT",
    "Pierre Briant",
    "alexander-the-great-356-23-bc",
    "Vol. I, Fasc. 8, pp. 827–830; published 15 December 1985",
  ),
  iranica(
    "ir-gaugamela",
    "GAUGAMELA",
    "Ernst Badian",
    "gaugamela-",
    "Vol. X, Fasc. 3, pp. 332–333; published 15 December 2000",
  ),
  iranica("ir-seleucid-empire", "SELEUCID EMPIRE", "Rolf Strootman", "seleucid-empire", "Published 16 April 2015"),
  iranica("ir-sasanian-dynasty", "SASANIAN DYNASTY", "A. Shapur Shahbazi", "sasanian-dynasty", "Published 20 July 2005"),
  iranica(
    "ir-ardashir-i",
    "ARDAŠĪR I i. History",
    "Josef Wiesehöfer",
    "ardasir-i",
    "Vol. II, Fasc. 4, pp. 371–376; published 15 December 1986",
  ),
  iranica(
    "ir-hormozdgan",
    "HORMOZDGĀN, Battle of",
    "A. Shapur Shahbazi",
    "hormozdgan",
    "Vol. XII, Fasc. 5, pp. 469–470; published 15 December 2004",
  ),
  iranica("ir-shapur-i", "ŠĀPUR I: History", "A. Shapur Shahbazi", "shapur-i", "Published 20 July 2002"),
  iranica("ir-khosrow-i", "ḴOSROW I", "Encyclopaedia Iranica", "kosrow", "Published 18 November 2015"),
  iranica(
    "ir-ctesiphon",
    "CTESIPHON",
    "Jens Kröger",
    "ctesiphon",
    "Vol. VI, Fasc. 4, pp. 446–448; published 15 December 1993",
  ),
  iranica(
    "ir-byzantine-iranian",
    "BYZANTINE-IRANIAN RELATIONS",
    "A. Shapur Shahbazi",
    "byzantine-iranian-relations",
    "Vol. IV, Fasc. 6, pp. 588–599; published 15 December 1990",
  ),
  iranica(
    "ir-arab-conquest",
    "ʿARAB ii. Arab conquest of Iran",
    "Michael G. Morony",
    "arab-ii",
    "Vol. II, Fasc. 2, pp. 203–210; published 15 December 1986",
  ),
  iranica("ir-qadesiya", "QĀDESIYA, BATTLE OF", "D. Gershon Lewental", "qadesiya-battle", "Published 21 July 2014"),
  iranica(
    "ir-capital-cities",
    "CAPITAL CITIES",
    "A. Shapur Shahbazi and C. Edmund Bosworth",
    "capital-cities",
    "Vol. IV, Fasc. 7, pp. 768–774; published 15 December 1990",
  ),
  iranica("ir-chronology", "Chronology of Iranian History, Part 1", "Ehsan Yarshater", "chronology-of-iranian-history-part-1"),

  /* ── The Metropolitan Museum of Art ── */
  met(
    "met-achaemenid",
    "The Achaemenid Persian Empire (550–330 B.C.)",
    "https://www.metmuseum.org/essays/the-achaemenid-persian-empire-550-330-b-c",
  ),
  met(
    "met-sasanian",
    "The Sasanian Empire (224–651 A.D.)",
    "https://www.metmuseum.org/essays/the-sasanian-empire-224-651-a-d",
  ),
  met("met-han", "Han Dynasty (206 B.C.–220 A.D.)", "https://www.metmuseum.org/essays/han-dynasty-206-b-c-220-a-d"),
  met(
    "met-old-kingdom",
    "Egypt in the Old Kingdom (ca. 2649–2130 B.C.)",
    "https://www.metmuseum.org/essays/egypt-in-the-old-kingdom-ca-2649-2150-b-c",
  ),
  met("met-ptolemaic", "Egypt in the Ptolemaic Period", "https://www.metmuseum.org/essays/egypt-in-the-ptolemaic-period"),
  met("met-roman-egypt", "Roman Egypt", "https://www.metmuseum.org/essays/roman-egypt"),
  met("met-egypt-rulers", "List of Rulers of Ancient Egypt and Nubia", "https://www.metmuseum.org/toah/hd/phar/hd_phar.htm"),
  met("met-mauryan", "Mauryan Empire (ca. 323–185 B.C.)", "https://metmuseum.org/toah/hd/maur/hd_maur.htm"),
  met(
    "met-hellenistic",
    "Art of the Hellenistic Age and the Hellenistic Tradition",
    "https://www.metmuseum.org/essays/art-of-the-hellenistic-age-and-the-hellenistic-tradition",
  ),
  met(
    "met-rome-asia-trade",
    "Trade between the Romans and the Empires of Asia",
    "https://www.metmuseum.org/essays/trade-between-the-romans-and-the-empires-of-asia",
  ),

  /* ── The British Museum ── */
  {
    id: "bm-cyrus-cylinder",
    title: "The Cyrus Cylinder (collection object 1880,0617.1941)",
    author: "The Trustees of the British Museum",
    publisher: "The British Museum — Collection online",
    url: "https://www.britishmuseum.org/collection/object/W_1880-0617-1941",
    type: "museum",
    accessed: ACCESSED,
    notes: {
      en: "Museum record for a primary source: a clay foundation cylinder inscribed in Akkadian after Cyrus took Babylon in 539 BCE.",
      fa: "سند موزه‌ای یک منبع دست‌اول: استوانهٔ گلی بنیادگذاری به خط اکدی که پس از تصرف بابل به دست کوروش در ۵۳۹ پ.م نوشته شد.",
    },
  },
  {
    id: "bm-ashurbanipal-annals",
    title: "Ten-sided clay cylinder with the annals of Ashurbanipal (collection object Rm.1)",
    author: "The Trustees of the British Museum",
    publisher: "The British Museum — Collection online",
    url: "https://www.britishmuseum.org/collection/object/W_Rm-1",
    type: "museum",
    accessed: ACCESSED,
    notes: {
      en: "Museum record for a primary source excavated at Nineveh; catalogued in the Library of Ashurbanipal series.",
      fa: "سند موزه‌ای یک منبع دست‌اول که در نینوا کاوش شده و در مجموعهٔ «کتابخانهٔ آشوربانیپال» فهرست شده است.",
    },
  },

  /* ── UNESCO World Heritage Centre ── */
  unesco("unesco-persepolis", "Persepolis (World Heritage List no. 114)", 114),
  unesco("unesco-pasargadae", "Pasargadae (World Heritage List no. 1106)", 1106),
  unesco("unesco-sassanid-fars", "Sassanid Archaeological Landscape of Fars Region (World Heritage List no. 1568)", 1568),
  unesco("unesco-memphis", "Memphis and its Necropolis – the Pyramid Fields from Giza to Dahshur (no. 86)", 86),
  unesco("unesco-thebes", "Ancient Thebes with its Necropolis (World Heritage List no. 87)", 87),
  unesco("unesco-ashur", "Ashur (Qal'at Sherqat) (World Heritage List no. 1130)", 1130),

  /* ── Encyclopaedia Britannica ── */
  britannica("br-ancient-egypt", "Ancient Egypt", "place/ancient-Egypt"),
  britannica("br-egypt-dynasties", "List of dynasties of ancient Egypt", "topic/list-of-dynasties-of-ancient-Egypt"),
  britannica("br-ramses-ii", "Ramses II", "biography/Ramses-II-king-of-Egypt"),
  britannica("br-hatshepsut", "Hatshepsut", "biography/Hatshepsut"),
  britannica("br-assyria", "The rise and fall of Assyria (summary)", "summary/Assyria"),
  britannica(
    "br-neo-assyrian",
    "History of Mesopotamia — The Neo-Assyrian Empire (746–609)",
    "place/Mesopotamia-historical-region-Asia/The-Neo-Assyrian-Empire-746-609",
  ),
  britannica("br-tiglath-pileser-iii", "Tiglath-pileser III", "biography/Tiglath-pileser-III"),
  britannica("br-ashurbanipal", "Ashurbanipal", "biography/Ashurbanipal"),
  britannica("br-nineveh", "Nineveh", "place/Nineveh-ancient-city-Iraq"),
  britannica("br-alexander", "Alexander the Great", "biography/Alexander-the-Great"),
  britannica("br-gaugamela", "Battle of Gaugamela", "event/Battle-of-Gaugamela"),
  britannica("br-ipsos", "Battle of Ipsos (301 BCE)", "event/Battle-of-Ipsos"),
  britannica("br-seleucus-i", "Seleucus I Nicator", "biography/Seleucus-I-Nicator"),
  britannica("br-hellenistic-age", "Hellenistic age", "event/Hellenistic-Age"),
  britannica("br-mauryan", "Mauryan empire", "place/Mauryan-Empire"),
  britannica("br-chandragupta", "Chandragupta", "biography/Chandragupta"),
  britannica("br-ashoka", "Ashoka (summary)", "summary/Ashoka"),
  britannica("br-han", "Han dynasty", "topic/Han-dynasty"),
  britannica("br-gaozu", "Gaozu, emperor of Han dynasty", "biography/Gaozu-emperor-of-Han-dynasty"),
  britannica("br-wudi", "Wudi, emperor of Han dynasty", "biography/Wudi-emperor-of-Han-dynasty"),
  britannica("br-wang-mang", "Wang Mang", "biography/Wang-Mang"),
  britannica("br-zhang-qian", "Zhang Qian", "biography/Zhang-Qian"),
  britannica("br-roman-empire", "Roman Empire", "place/Roman-Empire"),
  britannica("br-roman-timeline", "Timeline of the Roman Empire", "place/Timeline-of-the-Roman-Empire"),
  britannica("br-trajan", "Trajan", "biography/Trajan"),
  britannica("br-constantine", "Constantine I", "biography/Constantine-I-Roman-emperor"),
  britannica("br-actium", "Battle of Actium", "event/Battle-of-Actium-ancient-Roman-history"),
  britannica("br-edessa", "Battle of Edessa (260)", "event/Battle-of-Edessa-260"),
  britannica("br-shapur-i", "Shāpūr I", "biography/Shapur-I"),
  britannica("br-qadisiyyah", "Battle of al-Qādisiyyah", "event/Battle-of-al-Qadisiyyah"),

  /* ── Datasets used for the map ── */
  {
    id: "ds-historical-basemaps",
    title: "Historical Basemaps — world historical borders as GeoJSON",
    author: "André Ourednik and contributors",
    publisher: "GitHub repository aourednik/historical-basemaps",
    url: "https://github.com/aourednik/historical-basemaps",
    type: "dataset",
    accessed: ACCESSED,
    license: "GPL-3.0",
    notes: {
      en: "Source of every territory outline in the atlas. The project describes itself as a work in progress and rates all outlines used here as border precision 1 (approximate). Outlines are therefore shown as approximate reconstructions, never as exact borders.",
      fa: "منبع همهٔ محدوده‌های سرزمینی این اطلس. خودِ پروژه خود را «در دست تکمیل» می‌داند و دقت مرزِ همهٔ محدوده‌های به‌کاررفته را ۱ (تقریبی) ثبت کرده است؛ بنابراین این محدوده‌ها به‌عنوان بازسازی تقریبی نمایش داده می‌شوند، نه مرز دقیق.",
    },
  },
  {
    id: "ds-natural-earth",
    title: "Natural Earth — 1:50m land, lakes and river centerlines",
    author: "Natural Earth contributors (NACIS)",
    publisher: "naturalearthdata.com",
    url: "https://www.naturalearthdata.com/about/terms-of-use/",
    type: "dataset",
    accessed: ACCESSED,
    license: "Public domain",
    notes: {
      en: "Bundled with the app as the offline fallback basemap (modern coastlines and rivers).",
      fa: "به‌عنوان نقشهٔ پایهٔ جایگزینِ آفلاین همراه برنامه است (خطوط ساحلی و رودهای امروزی).",
    },
  },
  {
    id: "ds-openfreemap",
    title: "OpenFreeMap vector tiles (OpenMapTiles schema, OpenStreetMap data)",
    author: "OpenFreeMap; OpenMapTiles; OpenStreetMap contributors",
    publisher: "openfreemap.org",
    url: "https://openfreemap.org/",
    type: "dataset",
    accessed: ACCESSED,
    license: "Map data © OpenStreetMap contributors (ODbL); tile schema © OpenMapTiles",
    notes: {
      en: "Online basemap tiles. No API key is required; attribution is displayed on the map.",
      fa: "کاشی‌های نقشهٔ پایهٔ آنلاین. نیازی به کلید API ندارد و انتساب روی نقشه نمایش داده می‌شود.",
    },
  },
];
