/**
 * build-geo.mjs — turns raw downloaded geodata into the small files the app ships.
 *
 *   data-raw/historical-basemaps/world_*.geojson   (GPL-3.0, A. Ourednik et al.)
 *        └─► public/geo/territories.json           polygons + provenance
 *        └─► src/data/generated/territory-meta.json provenance only (no geometry)
 *
 *   data-raw/natural-earth/ne_50m_*.geojson         (public domain)
 *        └─► public/geo/basemap/{land,lakes,rivers}.json   offline fallback basemap
 *
 * Run with:  npm run geo:build
 *
 * WHY A BUILD SCRIPT?
 * The raw snapshots contain every polity on Earth (≈19 MB in total). The atlas
 * needs about forty outlines. Filtering once, ahead of time, keeps the browser
 * download small and — more importantly — forces every outline we show to pass
 * through the MANIFEST below, where it gets a validity window, caveats and sources.
 *
 * EDITORIAL RULES ENCODED IN THE MANIFEST
 * 1. A snapshot is only shown for years in which it is a fair approximation.
 *    Outside those windows the app shows a point marker and says so.
 * 2. Upstream features that are anachronistic are NOT used (see EXCLUDED below).
 * 3. Every caveat we know about an outline is written into its `notes`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW_HB = path.join(ROOT, "data-raw", "historical-basemaps");
const RAW_NE = path.join(ROOT, "data-raw", "natural-earth");
const OUT_GEO = path.join(ROOT, "public", "geo");
const OUT_META = path.join(ROOT, "src", "data", "generated");

/** Historian's year → astronomical year (must match src/lib/dates). */
const bce = (n) => 1 - n;
const ce = (n) => n;

const HB = "ds-historical-basemaps";

/** Upstream "BORDERPRECISION" (1–3) → our confidence label. */
const CONFIDENCE = { 1: "low", 2: "moderate", 3: "high" };

const method = (file) => ({
  en: `Outline taken unchanged from the Historical Basemaps dataset (snapshot ${file}), filtered to this polity and rounded to three decimal places. It was not independently surveyed. The years for which it is shown were assigned editorially by comparing the snapshot with the cited historical sources.`,
  fa: `محدوده بدون تغییر از مجموعه‌دادهٔ Historical Basemaps (برش ${file}) گرفته، به همین دولت محدود و تا سه رقم اعشار گرد شده است. این محدوده به‌طور مستقل نقشه‌برداری نشده است. سال‌هایی که در آن‌ها نمایش داده می‌شود با سنجش این برش با منابع تاریخیِ یادشده، به‌صورت ویراستاری تعیین شده است.`,
});

/**
 * MANIFEST — one entry per outline shown in the atlas.
 *   file        upstream snapshot (world_<file>.geojson)
 *   names       upstream NAME values merged into this outline
 *   entityIds   primary entity first
 *   snapshot    the year the upstream file claims to depict
 *   from / to   years for which we show it (inclusive)
 */
const MANIFEST = [
  /* ───────── Ancient Egypt ───────── */
  ...[
    ["bc3000", bce(3000), bce(3100), bce(2501)],
    ["bc2000", bce(2000), bce(2500), bce(1700)],
    ["bc1500", bce(1500), bce(1699), bce(1251)],
    ["bc1000", bce(1000), bce(1250), bce(851)],
    ["bc700", bce(700), bce(850), bce(526)],
  ].map(([file, snapshot, from, to]) => ({
    id: `egypt-${file}`,
    file,
    names: ["Egypt"],
    entityIds: ["ancient-egypt"],
    label: { en: "Egypt (Nile valley core)", fa: "مصر (هستهٔ درهٔ نیل)" },
    snapshot,
    from,
    to,
    representation: "approximate-extent",
    sourceIds: [HB, "br-ancient-egypt"],
    notes: {
      en: "A schematic outline of the Egyptian heartland along the Nile. It does not show the wider dominion of the New Kingdom in Nubia and the Levant, nor periods of political division.",
      fa: "طرحی کلی از هستهٔ سرزمینی مصر در امتداد نیل. قلمرو گسترده‌تر پادشاهی نو در نوبه و شام و نیز دوره‌های پراکندگی سیاسی را نشان نمی‌دهد.",
    },
  })),

  /* ───────── Neo-Assyrian Empire ───────── */
  {
    id: "assyria-heartland",
    file: "bc700",
    names: ["Assyria"],
    entityIds: ["neo-assyrian-empire"],
    label: { en: "Assyrian heartland", fa: "هستهٔ سرزمینی آشور" },
    snapshot: bce(700),
    from: bce(911),
    to: bce(609),
    representation: "approximate-extent",
    sourceIds: [HB, "br-neo-assyrian"],
    notes: {
      en: "Only the Assyrian core on the upper Tigris. The empire at its height reached far beyond this — to the Levant and, briefly, Egypt — but no reliable outline of that extent was available, so none is drawn.",
      fa: "تنها هستهٔ آشور در دجلهٔ بالا. امپراتوری در اوج خود بسیار فراتر از این، تا شام و برای مدتی کوتاه تا مصر، می‌رسید؛ اما چون محدودهٔ معتبری برای آن گستره در دست نبود، ترسیم نشده است.",
    },
  },

  /* ───────── Achaemenid Empire ───────── */
  {
    id: "achaemenid-bc500",
    file: "bc500",
    names: ["Achaemenid Empire"],
    entityIds: ["achaemenid-empire"],
    label: { en: "Achaemenid Empire", fa: "شاهنشاهی هخامنشی" },
    snapshot: bce(500),
    from: bce(520),
    to: bce(486),
    representation: "approximate-extent",
    sourceIds: [HB, "ir-darius-i", "met-achaemenid"],
    notes: {
      en: "Approximate extent under Darius I. The outline omits Thrace, which Darius added in about 513 BCE. Frontiers in Central Asia, Arabia and the Indus valley are especially uncertain.",
      fa: "گسترهٔ تقریبی در روزگار داریوش یکم. این محدوده تراکیه را که داریوش حدود ۵۱۳ پ.م افزود در بر ندارد. مرزها در آسیای مرکزی، عربستان و درهٔ سند به‌ویژه نامطمئن‌اند.",
    },
  },
  {
    id: "achaemenid-bc400",
    file: "bc400",
    names: ["Achaemenid Empire"],
    entityIds: ["achaemenid-empire"],
    label: { en: "Achaemenid Empire", fa: "شاهنشاهی هخامنشی" },
    snapshot: bce(400),
    from: bce(485),
    to: bce(334),
    representation: "approximate-extent",
    sourceIds: [HB, "ir-achaemenid-empire", "met-achaemenid"],
    notes: {
      en: "Approximate extent of the later empire. Known mismatches: the outline includes Thrace, lost after 479 BCE, and Egypt, which was independent from 404 to 343 BCE. It is shown until Alexander's invasion in 334 BCE.",
      fa: "گسترهٔ تقریبی شاهنشاهی پسین. ناهمخوانی‌های شناخته‌شده: محدوده تراکیه را که پس از ۴۷۹ پ.م از دست رفت، و مصر را که از ۴۰۴ تا ۳۴۳ پ.م مستقل بود، در بر دارد. تا یورش اسکندر در ۳۳۴ پ.م نمایش داده می‌شود.",
    },
  },

  /* ───────── Macedonian Empire and the Hellenistic world ───────── */
  {
    id: "alexander-bc323",
    file: "bc323",
    names: ["Empire of Alexander"],
    entityIds: ["macedon-hellenistic"],
    label: { en: "Empire of Alexander", fa: "امپراتوری اسکندر" },
    snapshot: bce(323),
    from: bce(325),
    to: bce(323),
    representation: "approximate-extent",
    sourceIds: [HB, "br-alexander", "ir-alexander"],
    notes: {
      en: "Approximate extent at Alexander's death. Shown only for 325–323 BCE: during the campaign of 334–326 BCE the area under his control changed almost yearly. Control in the far east was thin and short-lived.",
      fa: "گسترهٔ تقریبی هنگام مرگ اسکندر. تنها برای ۳۲۵ تا ۳۲۳ پ.م نمایش داده می‌شود: در لشکرکشی ۳۳۴ تا ۳۲۶ پ.م، ناحیهٔ زیر فرمان او تقریباً هر سال دگرگون می‌شد. کنترل در خاورِ دور سست و کوتاه‌مدت بود.",
    },
  },
  {
    id: "seleucid-bc300",
    file: "bc300",
    names: ["Seleucid Kingdom"],
    entityIds: ["macedon-hellenistic"],
    label: { en: "Kingdom of Seleucus", fa: "پادشاهی سلوکوس" },
    snapshot: bce(300),
    from: bce(305),
    to: bce(302),
    representation: "approximate-extent",
    sourceIds: [HB, "br-seleucus-i", "ir-seleucid-empire"],
    notes: {
      en: "The upstream '300 BCE' snapshot depicts the Successor kingdoms as they stood before the Battle of Ipsos (301 BCE), so it is shown only for 305–302 BCE. It still includes the eastern lands that Seleucus ceded to Chandragupta in about 305–303 BCE.",
      fa: "برش «۳۰۰ پ.م» مجموعه‌داده، پادشاهی‌های جانشینان را به شکل پیش از نبرد ایپسوس (۳۰۱ پ.م) نشان می‌دهد؛ از این رو تنها برای ۳۰۵ تا ۳۰۲ پ.م نمایش داده می‌شود. این محدوده هنوز سرزمین‌های خاوری را که سلوکوس حدود ۳۰۵–۳۰۳ پ.م به چندراگوپتا واگذاشت در بر دارد.",
    },
  },
  {
    id: "antigonus-bc300",
    file: "bc300",
    names: ["Kingdom of Antigonus"],
    entityIds: ["macedon-hellenistic"],
    label: { en: "Kingdom of Antigonus", fa: "پادشاهی آنتیگونوس" },
    snapshot: bce(300),
    from: bce(305),
    to: bce(302),
    representation: "approximate-extent",
    sourceIds: [HB, "br-ipsos"],
    notes: {
      en: "Antigonus was killed at Ipsos in 301 BCE and his lands were divided, so this outline is shown only for the years before the battle (305–302 BCE).",
      fa: "آنتیگونوس در ۳۰۱ پ.م در ایپسوس کشته شد و سرزمین‌هایش تقسیم شد؛ بنابراین این محدوده تنها برای سال‌های پیش از نبرد (۳۰۵ تا ۳۰۲ پ.م) نمایش داده می‌شود.",
    },
  },
  {
    id: "lysimachus-bc300",
    file: "bc300",
    names: ["Kingdom of Lysimachus"],
    entityIds: ["macedon-hellenistic"],
    label: { en: "Kingdom of Lysimachus", fa: "پادشاهی لوسیماخوس" },
    snapshot: bce(300),
    from: bce(305),
    to: bce(302),
    representation: "approximate-extent",
    sourceIds: [HB, "br-ipsos"],
    notes: {
      en: "Thrace under Lysimachus before the Battle of Ipsos. Shown only for 305–302 BCE.",
      fa: "تراکیه زیر فرمان لوسیماخوس، پیش از نبرد ایپسوس. تنها برای ۳۰۵ تا ۳۰۲ پ.م نمایش داده می‌شود.",
    },
  },
  {
    id: "ptolemaic-early",
    file: "bc300",
    names: ["Ptolemaic Kingdom"],
    entityIds: ["macedon-hellenistic", "ancient-egypt"],
    label: { en: "Ptolemaic Kingdom (Egypt)", fa: "پادشاهی بطلمیوسی (مصر)" },
    snapshot: bce(300),
    from: bce(305),
    to: bce(302),
    representation: "approximate-extent",
    sourceIds: [HB, "met-ptolemaic"],
    notes: {
      en: "Egypt and Cyrenaica under Ptolemy I. Ptolemaic possessions outside Egypt changed often and are not shown.",
      fa: "مصر و برقه (سیرنائیک) زیر فرمان بطلمیوس یکم. متصرفات بطلمیوسیان در بیرون از مصر بارها دگرگون شد و نمایش داده نشده است.",
    },
  },
  {
    id: "ptolemaic-bc200",
    file: "bc200",
    names: ["Ptolemaic Kingdom"],
    entityIds: ["macedon-hellenistic", "ancient-egypt"],
    label: { en: "Ptolemaic Kingdom", fa: "پادشاهی بطلمیوسی" },
    snapshot: bce(200),
    from: bce(301),
    to: bce(201),
    representation: "approximate-extent",
    sourceIds: [HB, "met-ptolemaic", "met-hellenistic"],
    notes: {
      en: "The Ptolemaic kingdom of the third century BCE, including Cyprus and the southern Levant, which the Ptolemies held until about 200 BCE.",
      fa: "پادشاهی بطلمیوسی در سدهٔ سوم پ.م، همراه با قبرس و شامِ جنوبی که بطلمیوسیان تا حدود ۲۰۰ پ.م در دست داشتند.",
    },
  },
  {
    id: "ptolemaic-late",
    file: "bc300",
    names: ["Ptolemaic Kingdom"],
    entityIds: ["macedon-hellenistic", "ancient-egypt"],
    label: { en: "Ptolemaic Kingdom (Egyptian core)", fa: "پادشاهی بطلمیوسی (هستهٔ مصر)" },
    snapshot: bce(300),
    from: bce(200),
    to: bce(30),
    representation: "approximate-extent",
    sourceIds: [HB, "met-ptolemaic", "met-roman-egypt"],
    notes: {
      en: "A schematic core only. The upstream outline for 100 BCE still includes the southern Levant, which had been lost about a century earlier, so it is not used; the Egypt-only outline from the '300 BCE' snapshot is shown instead as the kingdom's core until its end in 30 BCE.",
      fa: "تنها هسته‌ای کلی. محدودهٔ مجموعه‌داده برای ۱۰۰ پ.م هنوز شامِ جنوبی را که حدود یک سده پیش‌تر از دست رفته بود در بر دارد و از این رو به کار نرفته است؛ به جای آن، محدودهٔ «تنها مصر» از برش «۳۰۰ پ.م» به‌عنوان هستهٔ پادشاهی تا پایان آن در ۳۰ پ.م نمایش داده می‌شود.",
    },
  },
  {
    id: "seleucid-bc200",
    file: "bc200",
    names: ["Seleucid Kingdom"],
    entityIds: ["macedon-hellenistic"],
    label: { en: "Seleucid Empire", fa: "شاهنشاهی سلوکی" },
    snapshot: bce(200),
    from: bce(240),
    to: bce(190),
    representation: "approximate-extent",
    sourceIds: [HB, "ir-seleucid-empire"],
    notes: {
      en: "The Seleucid realm after the loss of Bactria and Parthia in the mid-third century BCE. Real control east of the Zagros fluctuated and is poorly documented.",
      fa: "قلمرو سلوکی پس از ازدست‌رفتن باختر (بلخ) و پارت در میانهٔ سدهٔ سوم پ.م. کنترل واقعی در خاور زاگرس نوسان داشت و اسناد اندکی از آن مانده است.",
    },
  },
  {
    id: "antigonid-bc200",
    file: "bc200",
    names: ["Macedon and Hellenic League"],
    entityIds: ["macedon-hellenistic"],
    label: { en: "Antigonid Macedon and the Hellenic League", fa: "مقدونیهٔ آنتیگونی و اتحادیهٔ هلنی" },
    snapshot: bce(200),
    from: bce(224),
    to: bce(197),
    representation: "influence",
    sourceIds: [HB, "br-hellenistic-age"],
    notes: {
      en: "Macedon together with allied Greek states. This is an area of alliance and influence, not a single directly ruled territory.",
      fa: "مقدونیه همراه با دولت‌های یونانیِ هم‌پیمان. این محدوده ناحیهٔ اتحاد و نفوذ است، نه سرزمینی یکپارچه با فرمانروایی مستقیم.",
    },
  },

  /* ───────── Maurya Empire ───────── */
  {
    id: "maurya-bc300",
    file: "bc300",
    names: ["Mauryan Empire"],
    entityIds: ["maurya-empire"],
    label: { en: "Maurya Empire", fa: "شاهنشاهی مائوریا" },
    snapshot: bce(300),
    from: bce(303),
    to: bce(262),
    representation: "approximate-extent",
    sourceIds: [HB, "br-mauryan", "met-mauryan"],
    notes: {
      en: "Approximate extent after the settlement with Seleucus. Known mismatch: the outline already includes Kalinga, which Ashoka conquered only in about 261 BCE.",
      fa: "گسترهٔ تقریبی پس از سازش با سلوکوس. ناهمخوانی شناخته‌شده: این محدوده کالینگا را در بر دارد، حال آنکه آشوکا آن را تنها حدود ۲۶۱ پ.م گشود.",
    },
  },
  {
    id: "maurya-ashoka",
    file: "bc200",
    names: ["Mauryan Empire"],
    entityIds: ["maurya-empire"],
    label: { en: "Maurya Empire under Ashoka", fa: "شاهنشاهی مائوریا در روزگار آشوکا" },
    snapshot: bce(200),
    from: bce(261),
    to: bce(232),
    representation: "approximate-extent",
    sourceIds: [HB, "br-mauryan", "br-ashoka"],
    notes: {
      en: "Re-dated editorially: the upstream file assigns this large outline to 200 BCE, but by then the empire had shrunk after Ashoka's death. It is shown here for Ashoka's reign after the Kalinga war instead. How directly the far south was ruled is debated.",
      fa: "تاریخ‌گذاری ویراستاری: مجموعه‌داده این محدودهٔ بزرگ را به ۲۰۰ پ.م نسبت می‌دهد، اما تا آن زمان امپراتوری پس از مرگ آشوکا کوچک شده بود. در اینجا برای دوران آشوکا پس از جنگ کالینگا نمایش داده می‌شود. میزان فرمانروایی مستقیم بر جنوبِ دور محل بحث است.",
    },
  },

  /* ───────── Han Dynasty ───────── */
  {
    id: "han-bc200",
    file: "bc200",
    names: ["Han Empire"],
    entityIds: ["han-dynasty"],
    label: { en: "Western Han (early)", fa: "هان غربی (آغازین)" },
    snapshot: bce(200),
    from: bce(202),
    to: bce(112),
    representation: "approximate-extent",
    sourceIds: [HB, "br-han", "met-han"],
    notes: {
      en: "Approximate extent of the early Western Han. Known mismatch: the outline reaches the far south, where the independent kingdom of Nanyue ruled until 111 BCE.",
      fa: "گسترهٔ تقریبی هان غربی در آغاز. ناهمخوانی شناخته‌شده: محدوده تا جنوبِ دور می‌رسد، جایی که پادشاهی مستقل نان‌یوئه تا ۱۱۱ پ.م فرمان می‌راند.",
    },
  },
  {
    id: "han-bc1",
    file: "bc1",
    names: ["Han"],
    entityIds: ["han-dynasty"],
    label: { en: "Western Han (after Wudi's expansion)", fa: "هان غربی (پس از گسترش وودی)" },
    snapshot: bce(1),
    from: bce(110),
    to: ce(8),
    representation: "approximate-extent",
    sourceIds: [HB, "br-wudi", "met-han"],
    notes: {
      en: "Approximate extent after the expansion under Emperor Wu, including the Hexi corridor and the far south. Han authority in the Western Regions (Tarim basin) was a protectorate and is not outlined.",
      fa: "گسترهٔ تقریبی پس از گسترش در روزگار امپراتور وو، همراه با دالان هِشی و جنوبِ دور. اقتدار هان در «سرزمین‌های باختری» (حوضهٔ تاریم) از نوع سرپرستی بود و ترسیم نشده است.",
    },
  },
  {
    id: "han-100",
    file: "100",
    names: ["Han"],
    entityIds: ["han-dynasty"],
    label: { en: "Eastern Han", fa: "هان شرقی" },
    snapshot: ce(100),
    from: ce(25),
    to: ce(150),
    representation: "approximate-extent",
    sourceIds: [HB, "br-han", "met-han"],
    notes: {
      en: "Approximate extent of the restored (Eastern) Han. No outline is shown for 9–24 CE, when Wang Mang's Xin dynasty ruled.",
      fa: "گسترهٔ تقریبی هانِ بازگشته (شرقی). برای سال‌های ۹ تا ۲۴ م که دودمان شینِ وانگ مانگ فرمان می‌راند، محدوده‌ای نمایش داده نمی‌شود.",
    },
  },
  {
    id: "han-200",
    file: "200",
    names: ["Han"],
    entityIds: ["han-dynasty"],
    label: { en: "Eastern Han (late)", fa: "هان شرقی (پسین)" },
    snapshot: ce(200),
    from: ce(151),
    to: ce(220),
    representation: "approximate-extent",
    sourceIds: [HB, "br-han"],
    notes: {
      en: "Nominal extent of the late Eastern Han. In its last decades real power lay with regional warlords, so the outline overstates the court's actual control.",
      fa: "گسترهٔ اسمی هان شرقی پسین. در دهه‌های پایانی، قدرت واقعی در دست جنگ‌سالاران محلی بود؛ بنابراین محدوده کنترل واقعی دربار را بیش از واقع نشان می‌دهد.",
    },
  },

  /* ───────── Roman Empire ───────── */
  {
    id: "rome-bc1",
    file: "bc1",
    names: ["Roman Empire"],
    entityIds: ["roman-empire"],
    label: { en: "Roman Empire (Augustan)", fa: "امپراتوری روم (دوران آگوستوس)" },
    snapshot: bce(1),
    from: bce(27),
    to: ce(42),
    representation: "approximate-extent",
    sourceIds: [HB, "br-roman-empire"],
    notes: {
      en: "Approximate extent of the early empire, before the conquest of Britain. Client kingdoms on the fringes are not distinguished from provinces.",
      fa: "گسترهٔ تقریبی امپراتوری آغازین، پیش از فتح بریتانیا. پادشاهی‌های دست‌نشاندهٔ حاشیه‌ای از استان‌ها بازشناخته نشده‌اند.",
    },
  },
  {
    id: "rome-100",
    file: "100",
    names: ["Roman Empire"],
    entityIds: ["roman-empire"],
    label: { en: "Roman Empire", fa: "امپراتوری روم" },
    snapshot: ce(100),
    from: ce(43),
    to: ce(105),
    representation: "approximate-extent",
    sourceIds: [HB, "br-roman-empire", "br-roman-timeline"],
    notes: {
      en: "Approximate extent around 100 CE, with Britain but before Trajan's conquest of Dacia. The conquest of Britain was gradual, so the outline is too generous for the 40s–70s CE.",
      fa: "گسترهٔ تقریبی حدود ۱۰۰ م، همراه با بریتانیا اما پیش از فتح داکیا به دست ترایانوس. فتح بریتانیا تدریجی بود و از این رو محدوده برای دهه‌های ۴۰ تا ۷۰ م دست‌بالا است.",
    },
  },
  {
    id: "rome-200",
    file: "200",
    names: ["Roman Empire"],
    entityIds: ["roman-empire"],
    label: { en: "Roman Empire (with Dacia)", fa: "امپراتوری روم (همراه با داکیا)" },
    snapshot: ce(200),
    from: ce(106),
    to: ce(284),
    representation: "approximate-extent",
    sourceIds: [HB, "br-trajan", "br-roman-timeline"],
    notes: {
      en: "Approximate extent from Trajan's conquest of Dacia onward. For 117 CE — the empire's greatest extent — Trajan's short-lived eastern provinces (Armenia, Mesopotamia and Assyria, 114–117 CE) are NOT shown. Dacia was abandoned in the 270s.",
      fa: "گسترهٔ تقریبی از فتح داکیا به دست ترایانوس به بعد. برای ۱۱۷ م — بیشترین گسترهٔ امپراتوری — استان‌های خاوریِ کوتاه‌عمر ترایانوس (ارمنستان، میان‌رودان و آشور، ۱۱۴ تا ۱۱۷ م) نمایش داده نشده‌اند. داکیا در دههٔ ۲۷۰ م رها شد.",
    },
  },
  {
    id: "rome-tetrarchy",
    file: "300",
    names: ["Rome (Constantinus)", "Rome (Maximian)", "Rome (Galerius)", "Rome (Diocletianus)"],
    entityIds: ["roman-empire"],
    label: { en: "Roman Empire (Tetrarchy)", fa: "امپراتوری روم (تترارشی)" },
    snapshot: ce(300),
    from: ce(285),
    to: ce(394),
    representation: "approximate-extent",
    sourceIds: [HB, "br-roman-timeline", "ir-byzantine-iranian"],
    notes: {
      en: "The internal lines mark the four administrative portions of Diocletian's Tetrarchy around 300 CE; it was still one empire. The same outline is kept for the fourth century, when the internal division changed several times.",
      fa: "خط‌های درونی، چهار بخش اداری تترارشیِ دیوکلتیان را در حدود ۳۰۰ م نشان می‌دهد؛ امپراتوری همچنان یکی بود. همین محدوده برای سدهٔ چهارم نیز نگه داشته شده، هرچند تقسیم درونی چند بار دگرگون شد.",
    },
  },
  {
    id: "rome-west-400",
    file: "400",
    names: ["Western Roman Empire"],
    entityIds: ["roman-empire"],
    label: { en: "Western Roman Empire", fa: "امپراتوری روم غربی" },
    snapshot: ce(400),
    from: ce(395),
    to: ce(409),
    representation: "approximate-extent",
    sourceIds: [HB, "br-roman-timeline"],
    notes: {
      en: "The western court's territory just after the division of 395 CE. From about 410 CE the West lost provinces rapidly (Britain, then much of Gaul, Spain and Africa); no reliable outlines for those decades were available, so none is drawn until the court's end in 476 CE.",
      fa: "قلمرو دربار باختری درست پس از تقسیم ۳۹۵ م. از حدود ۴۱۰ م باختر به‌سرعت استان‌هایش را از دست داد (بریتانیا، سپس بخش بزرگی از گُل، اسپانیا و آفریقا)؛ برای آن دهه‌ها محدودهٔ معتبری در دست نبود و از این رو تا پایان دربار در ۴۷۶ م چیزی ترسیم نشده است.",
    },
  },
  {
    id: "rome-east-400",
    file: "400",
    names: ["Eastern Roman Empire"],
    entityIds: ["roman-empire"],
    label: { en: "Eastern Roman Empire", fa: "امپراتوری روم شرقی" },
    snapshot: ce(400),
    from: ce(395),
    to: ce(475),
    representation: "approximate-extent",
    sourceIds: [HB, "br-roman-timeline", "br-roman-empire"],
    notes: {
      en: "Approximate extent of the eastern court's territory in the fifth century.",
      fa: "گسترهٔ تقریبی قلمرو دربار خاوری در سدهٔ پنجم.",
    },
  },
  {
    id: "rome-east-500",
    file: "500",
    names: ["Eastern Roman Empire"],
    entityIds: ["roman-empire"],
    label: { en: "Eastern Roman Empire", fa: "امپراتوری روم شرقی" },
    snapshot: ce(500),
    from: ce(476),
    to: ce(532),
    representation: "approximate-extent",
    sourceIds: [HB, "br-roman-empire"],
    notes: {
      en: "Approximate extent after the end of the western court and before Justinian's reconquests in Africa and Italy.",
      fa: "گسترهٔ تقریبی پس از پایان دربار باختری و پیش از بازپس‌گیری‌های یوستینیان در آفریقا و ایتالیا.",
    },
  },
  {
    id: "rome-east-600",
    file: "600",
    names: ["Eastern Roman Empire"],
    entityIds: ["roman-empire"],
    label: { en: "Eastern Roman Empire (after Justinian)", fa: "امپراتوری روم شرقی (پس از یوستینیان)" },
    snapshot: ce(600),
    from: ce(555),
    to: ce(610),
    representation: "approximate-extent",
    sourceIds: [HB, "br-roman-empire"],
    notes: {
      en: "Approximate extent after Justinian's reconquests. The outline shows all Italy, although the Lombards took much of it from 568 CE. No outline is drawn for 533–554 CE, while the reconquests were in progress.",
      fa: "گسترهٔ تقریبی پس از بازپس‌گیری‌های یوستینیان. محدوده سراسر ایتالیا را نشان می‌دهد، هرچند لومباردها از ۵۶۸ م بخش بزرگی از آن را گرفتند. برای ۵۳۳ تا ۵۵۴ م که بازپس‌گیری‌ها در جریان بود محدوده‌ای ترسیم نشده است.",
    },
  },
  {
    id: "rome-east-700",
    file: "700",
    names: ["Eastern Roman Empire"],
    entityIds: ["roman-empire"],
    label: { en: "Eastern Roman Empire (after the Arab conquests)", fa: "امپراتوری روم شرقی (پس از فتوحات عرب)" },
    snapshot: ce(700),
    from: ce(650),
    to: ce(700),
    representation: "approximate-extent",
    sourceIds: [HB, "br-roman-empire"],
    notes: {
      en: "Approximate extent after the loss of Syria and Egypt in the 630s–640s CE. The outline already omits North Africa, which was held until the 690s. No outline is drawn for 611–649 CE, when the frontiers changed drastically.",
      fa: "گسترهٔ تقریبی پس از ازدست‌رفتن شام و مصر در دهه‌های ۶۳۰ و ۶۴۰ م. این محدوده شمال آفریقا را که تا دههٔ ۶۹۰ م در دست بود در بر ندارد. برای ۶۱۱ تا ۶۴۹ م که مرزها به‌شدت دگرگون شد محدوده‌ای ترسیم نشده است.",
    },
  },

  /* ───────── Sasanian Empire ───────── */
  {
    id: "sasanian-300",
    file: "300",
    names: ["Parthian Empire"],
    entityIds: ["sasanian-empire"],
    label: { en: "Sasanian Empire (early)", fa: "شاهنشاهی ساسانی (آغازین)" },
    snapshot: ce(300),
    from: ce(240),
    to: ce(386),
    representation: "approximate-extent",
    sourceIds: [HB, "ir-sasanian-dynasty", "ir-shapur-i"],
    notes: {
      en: "Upstream labelling error corrected: the dataset's 300 CE snapshot calls this outline 'Parthian Empire', although the Sasanians had replaced the Parthians in 224 CE. The geometry is used as the early Sasanian realm, with low confidence. It does not show Shapur I's temporary advances into Roman territory.",
      fa: "اصلاح خطای برچسب در مجموعه‌داده: برش ۳۰۰ م این محدوده را «شاهنشاهی اشکانی» نامیده، حال آنکه ساسانیان در ۲۲۴ م جای اشکانیان را گرفته بودند. این هندسه با اطمینان پایین به‌عنوان قلمرو آغازین ساسانی به کار رفته است. پیشروی‌های موقت شاپور یکم در خاک روم را نشان نمی‌دهد.",
    },
  },
  {
    id: "sasanian-400",
    file: "400",
    names: ["Persia"],
    entityIds: ["sasanian-empire"],
    label: { en: "Sasanian Empire", fa: "شاهنشاهی ساسانی" },
    snapshot: ce(400),
    from: ce(387),
    to: ce(483),
    representation: "approximate-extent",
    sourceIds: [HB, "ir-sasanian-dynasty", "ir-byzantine-iranian"],
    notes: {
      en: "Approximate extent in the fifth century, including the Sasanian share of Armenia. The eastern frontier facing the Hephthalites is uncertain.",
      fa: "گسترهٔ تقریبی در سدهٔ پنجم، همراه با سهم ساسانیان از ارمنستان. مرز خاوری در برابر هپتالیان نامطمئن است.",
    },
  },
  {
    id: "sasanian-500",
    file: "500",
    names: ["Sasanian Empire"],
    entityIds: ["sasanian-empire"],
    label: { en: "Sasanian Empire", fa: "شاهنشاهی ساسانی" },
    snapshot: ce(500),
    from: ce(484),
    to: ce(559),
    representation: "approximate-extent",
    sourceIds: [HB, "ir-sasanian-dynasty", "ir-khosrow-i"],
    notes: {
      en: "Approximate extent around 500 CE. The outline reaches far to the east, where the Hephthalites were in fact dominant until about 560 CE; treat the eastern part as especially doubtful.",
      fa: "گسترهٔ تقریبی حدود ۵۰۰ م. محدوده تا خاورِ دور می‌رسد، جایی که در واقع هپتالیان تا حدود ۵۶۰ م چیره بودند؛ بخش خاوری را به‌ویژه تردیدآمیز بدانید.",
    },
  },
  {
    id: "sasanian-600",
    file: "600",
    names: ["Sasanian Empire"],
    entityIds: ["sasanian-empire"],
    label: { en: "Sasanian Empire (after Khosrow I)", fa: "شاهنشاهی ساسانی (پس از خسرو یکم)" },
    snapshot: ce(600),
    from: ce(560),
    to: ce(609),
    representation: "approximate-extent",
    sourceIds: [HB, "ir-sasanian-dynasty", "ir-khosrow-i"],
    notes: {
      en: "Approximate extent after Khosrow I's reign. No outline is drawn for 610–651 CE: Khosrow II's conquests in Syria, Palestine and Egypt were temporary, and afterwards the empire disintegrated during the Arab conquest.",
      fa: "گسترهٔ تقریبی پس از پادشاهی خسرو یکم. برای ۶۱۰ تا ۶۵۱ م محدوده‌ای ترسیم نشده است: فتوحات خسرو دوم در شام، فلسطین و مصر موقتی بود و پس از آن شاهنشاهی در جریان فتح عرب از هم پاشید.",
    },
  },
  {
    id: "sasanian-dependencies-600",
    file: "600",
    names: ["Sasanian dependencies"],
    entityIds: ["sasanian-empire"],
    label: { en: "Sasanian dependency in southern Arabia", fa: "سرزمین وابسته به ساسانیان در جنوب عربستان" },
    snapshot: ce(600),
    from: ce(575),
    to: ce(609),
    representation: "influence",
    sourceIds: [HB, "ir-sasanian-dynasty"],
    notes: {
      en: "An area of dependency and influence in Yemen, not directly administered imperial territory.",
      fa: "ناحیهٔ وابستگی و نفوذ در یمن، نه سرزمینی با ادارهٔ مستقیم شاهنشاهی.",
    },
  },
];

/**
 * Upstream features deliberately NOT used, with the reason. Listed in the
 * methodology document and printed at the end of every build.
 */
const EXCLUDED = [
  {
    file: "world_bc100",
    name: "Mauryan Empire",
    reason: {
      en: "The Maurya Empire ended about 185 BCE; a Mauryan outline at 100 BCE is anachronistic.",
      fa: "شاهنشاهی مائوریا حدود ۱۸۵ پ.م پایان یافت؛ محدودهٔ مائوریا در ۱۰۰ پ.م ناهم‌زمان است.",
    },
  },
  {
    file: "world_bc100",
    name: "Seleucid Kingdom",
    reason: {
      en: "Identical to the 200 BCE outline (Mesopotamia and Iran included), although by 100 BCE the Seleucids held little beyond Syria.",
      fa: "با محدودهٔ ۲۰۰ پ.م یکسان است (همراه با میان‌رودان و ایران)، حال آنکه تا ۱۰۰ پ.م سلوکیان جز سوریه چیز چندانی در دست نداشتند.",
    },
  },
  {
    file: "world_bc100",
    name: "Ptolemaic Kingdom",
    reason: {
      en: "Still includes the southern Levant, lost to the Seleucids about 200–198 BCE.",
      fa: "هنوز شامِ جنوبی را در بر دارد که حدود ۲۰۰ تا ۱۹۸ پ.م به سلوکیان واگذار شده بود.",
    },
  },
  {
    file: "world_bc100",
    name: "Han Empire",
    reason: {
      en: "Identical to the 200 BCE outline; does not reflect the expansion under Emperor Wu.",
      fa: "با محدودهٔ ۲۰۰ پ.م یکسان است و گسترش روزگار امپراتور وو را بازتاب نمی‌دهد.",
    },
  },
  {
    file: "world_500",
    name: "Western Roman Empire",
    reason: {
      en: "The western court ended in 476 CE; a Western Roman outline at 500 CE is anachronistic.",
      fa: "دربار باختری در ۴۷۶ م پایان یافت؛ محدودهٔ روم غربی در ۵۰۰ م ناهم‌زمان است.",
    },
  },
  {
    file: "world_700",
    name: "Sasanian Empire",
    reason: {
      en: "The Sasanian Empire ended in 651 CE; an outline at 700 CE is anachronistic.",
      fa: "شاهنشاهی ساسانی در ۶۵۱ م پایان یافت؛ محدوده‌ای برای ۷۰۰ م ناهم‌زمان است.",
    },
  },
  {
    file: "world_bc1000, world_bc1500",
    name: "Assyria",
    reason: {
      en: "Predates the Neo-Assyrian period covered by the atlas.",
      fa: "به پیش از دورهٔ آشور نو که اطلس پوشش می‌دهد تعلق دارد.",
    },
  },
];

/* ───────────────────────────── helpers ───────────────────────────── */

const round = (n, digits) => Number(n.toFixed(digits));

function roundCoords(coords, digits) {
  return typeof coords[0] === "number" ? [round(coords[0], digits), round(coords[1], digits)] : coords.map((c) => roundCoords(c, digits));
}

/** Remove consecutive duplicate points created by rounding. */
function dedupeRing(ring) {
  const out = [];
  for (const p of ring) {
    const last = out[out.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
  }
  return out;
}

/** Any Polygon / MultiPolygon → list of polygons (each a list of rings). */
function polygonsOf(geometry) {
  if (geometry.type === "Polygon") return [geometry.coordinates];
  if (geometry.type === "MultiPolygon") return geometry.coordinates;
  throw new Error(`Unsupported geometry type: ${geometry.type}`);
}

const snapshotCache = new Map();
function loadSnapshot(file) {
  if (!snapshotCache.has(file)) {
    const full = path.join(RAW_HB, `world_${file}.geojson`);
    snapshotCache.set(file, JSON.parse(fs.readFileSync(full, "utf8")));
  }
  return snapshotCache.get(file);
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value));
  return fs.statSync(file).size;
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

/* ─────────────────────────── territories ─────────────────────────── */

function buildTerritories() {
  const features = [];
  const seenIds = new Set();

  for (const entry of MANIFEST) {
    if (seenIds.has(entry.id)) throw new Error(`Duplicate territory id: ${entry.id}`);
    seenIds.add(entry.id);
    if (entry.from > entry.to) throw new Error(`${entry.id}: 'from' is after 'to'`);

    const snapshot = loadSnapshot(entry.file);
    const polygons = [];
    let precision = 3;

    for (const name of entry.names) {
      const matches = snapshot.features.filter((f) => f.properties?.NAME === name && f.geometry);
      if (matches.length === 0) throw new Error(`${entry.id}: no upstream feature named "${name}" in world_${entry.file}`);
      for (const match of matches) {
        precision = Math.min(precision, Number(match.properties.BORDERPRECISION) || 1);
        for (const polygon of polygonsOf(match.geometry)) {
          const rings = polygon.map((ring) => dedupeRing(roundCoords(ring, 3))).filter((ring) => ring.length >= 4);
          if (rings.length > 0) polygons.push(rings);
        }
      }
    }

    features.push({
      type: "Feature",
      properties: {
        id: entry.id,
        entityIds: entry.entityIds,
        label: entry.label,
        snapshotYear: entry.snapshot,
        validFrom: entry.from,
        validTo: entry.to,
        representation: entry.representation,
        confidence: CONFIDENCE[precision] ?? "low",
        method: method(`world_${entry.file}.geojson`),
        notes: entry.notes,
        sourceIds: entry.sourceIds,
        upstreamNames: entry.names,
        upstreamFile: `world_${entry.file}.geojson`,
      },
      geometry: { type: "MultiPolygon", coordinates: polygons },
    });
  }

  const geoSize = writeJson(path.join(OUT_GEO, "territories.json"), { type: "FeatureCollection", features });
  const metaSize = writeJson(
    path.join(OUT_META, "territory-meta.json"),
    features.map((f) => f.properties),
  );
  console.log(`territories: ${features.length} outlines → public/geo/territories.json (${kb(geoSize)}), territory-meta.json (${kb(metaSize)})`);
}

/* ───────────────────────── fallback basemap ───────────────────────── */

function buildBasemap() {
  const read = (name) => JSON.parse(fs.readFileSync(path.join(RAW_NE, `${name}.geojson`), "utf8"));

  const strip = (collection, keep, digits) => ({
    type: "FeatureCollection",
    features: collection.features
      .filter((f) => f.geometry && keep(f.properties ?? {}))
      .map((f) => ({
        type: "Feature",
        properties: {},
        geometry: { type: f.geometry.type, coordinates: roundCoords(f.geometry.coordinates, digits) },
      })),
  });

  const land = writeJson(path.join(OUT_GEO, "basemap", "land.json"), strip(read("ne_50m_land"), () => true, 2));
  const lakes = writeJson(
    path.join(OUT_GEO, "basemap", "lakes.json"),
    strip(read("ne_50m_lakes"), (p) => (p.scalerank ?? 9) <= 1, 2),
  );
  const rivers = writeJson(
    path.join(OUT_GEO, "basemap", "rivers.json"),
    strip(read("ne_50m_rivers_lake_centerlines"), (p) => (p.scalerank ?? 9) <= 5, 2),
  );
  console.log(`basemap: land ${kb(land)}, lakes ${kb(lakes)}, rivers ${kb(rivers)} → public/geo/basemap/`);
}

buildTerritories();
buildBasemap();
// The exclusion list is published too, so the methodology page can show it.
writeJson(path.join(OUT_META, "excluded-outlines.json"), EXCLUDED);
console.log(`\nExcluded upstream features (${EXCLUDED.length}):`);
for (const { file, name, reason } of EXCLUDED) console.log(`  - ${file} / ${name}: ${reason.en}`);
