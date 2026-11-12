/**
 * Historical locations: capitals, cities, sites and battlefields.
 *
 * A place is a POINT. It never stands for a whole territory — the interface says
 * so wherever a marker is the only thing we can honestly show.
 * Coordinates are [longitude, latitude] of the archaeological site (or of the
 * modern city that covers it) and are rounded to two decimals.
 */
import { fromEra } from "@/lib/dates";
import type { Place } from "./schema";

type PlaceInput = Omit<Place, "altNames" | "approximateLocation"> &
  Partial<Pick<Place, "altNames" | "approximateLocation">>;

function place(input: PlaceInput): Place {
  return { altNames: { fa: [], en: [] }, approximateLocation: false, ...input };
}

export const places: Place[] = [
  /* ── Egypt ── */
  place({
    id: "memphis",
    name: { fa: "ممفیس", en: "Memphis" },
    altNames: { fa: ["منف"], en: ["Men-nefer"] },
    kind: "capital",
    coordinates: [31.25, 29.85],
    modernLocation: { fa: "میت رهینه، جنوب قاهره، مصر", en: "Mit Rahina, south of Cairo, Egypt" },
    description: {
      fa: "پایتخت مصر در دورهٔ پادشاهی کهن، نزدیک رأس دلتای نیل؛ گورستان‌های سلطنتی آن از جیزه تا دهشور کشیده شده است.",
      en: "Capital of Egypt during the Old Kingdom, near the apex of the Nile Delta; its royal cemeteries stretch from Giza to Dahshur.",
    },
    entityIds: ["ancient-egypt"],
    sourceIds: ["unesco-memphis", "met-old-kingdom"],
  }),
  place({
    id: "giza",
    name: { fa: "جیزه", en: "Giza" },
    kind: "site",
    existsFrom: fromEra(2600, "BCE"), // the royal pyramid field of the Fourth Dynasty
    coordinates: [31.13, 29.98],
    modernLocation: { fa: "جیزه، مصر", en: "Giza, Egypt" },
    description: {
      fa: "فلات اهرام بزرگ دودمان چهارم، از جمله هرم بزرگ که در دوران خوفو ساخته شد.",
      en: "Plateau of the great Fourth-Dynasty pyramids, including the Great Pyramid built in the reign of Khufu.",
    },
    entityIds: ["ancient-egypt"],
    sourceIds: ["unesco-memphis", "br-ancient-egypt"],
  }),
  place({
    id: "thebes",
    name: { fa: "تِبس", en: "Thebes" },
    altNames: { fa: ["طیبه", "واست"], en: ["Waset", "Luxor"] },
    kind: "capital",
    coordinates: [32.64, 25.72],
    modernLocation: { fa: "اقصر، مصر", en: "Luxor, Egypt" },
    description: {
      fa: "شهر خدای آمون و مرکز دینی و سلطنتی مصر در پادشاهی میانه و نو؛ معابد کرنک و اقصر و درهٔ شاهان در آن قرار دارند.",
      en: "City of the god Amun and royal and religious centre of Egypt in the Middle and New Kingdoms; site of the Karnak and Luxor temples and the Valley of the Kings.",
    },
    entityIds: ["ancient-egypt"],
    sourceIds: ["unesco-thebes"],
  }),
  place({
    id: "kadesh",
    name: { fa: "قادِش", en: "Kadesh" },
    altNames: { fa: ["کادش"], en: ["Qadesh", "Tell Nebi Mend"] },
    kind: "battlefield",
    coordinates: [36.52, 34.56],
    modernLocation: { fa: "تل نبی مند، کنار رود عاصی، سوریه", en: "Tell Nebi Mend on the Orontes, Syria" },
    description: {
      fa: "شهری در کنار رود عاصی که رامسس دوم در نزدیکی آن با سپاه هیتی جنگید.",
      en: "City on the Orontes near which Ramses II fought the Hittite army.",
    },
    entityIds: ["ancient-egypt"],
    sourceIds: ["br-ramses-ii"],
  }),
  place({
    id: "alexandria",
    name: { fa: "اسکندریه", en: "Alexandria" },
    kind: "capital",
    existsFrom: fromEra(331, "BCE"), // founded by Alexander
    coordinates: [29.92, 31.2],
    modernLocation: { fa: "اسکندریه، مصر", en: "Alexandria, Egypt" },
    description: {
      fa: "شهری که اسکندر در مصر بنیاد نهاد و پایتخت پادشاهی بطلمیوسی شد.",
      en: "City founded by Alexander in Egypt, later the capital of the Ptolemaic kingdom.",
    },
    entityIds: ["macedon-hellenistic", "ancient-egypt"],
    sourceIds: ["met-ptolemaic", "br-alexander"],
  }),

  /* ── Assyria ── */
  place({
    id: "ashur",
    name: { fa: "آشور (شهر)", en: "Ashur" },
    altNames: { fa: ["قلعه شرقاط"], en: ["Assur", "Qal'at Sherqat"] },
    kind: "capital",
    coordinates: [43.26, 35.46],
    modernLocation: { fa: "قلعه شرقاط، کنار دجله، عراق", en: "Qal'at Sherqat on the Tigris, Iraq" },
    description: {
      fa: "نخستین پایتخت و مرکز دینی آشور که نام خدای آشور و خودِ سرزمین از آن گرفته شده است.",
      en: "First capital and religious centre of Assyria, from which both the god Ashur and the land take their name.",
    },
    entityIds: ["neo-assyrian-empire"],
    sourceIds: ["unesco-ashur"],
  }),
  place({
    id: "nineveh",
    name: { fa: "نینوا", en: "Nineveh" },
    altNames: { fa: [], en: ["Kuyunjik"] },
    kind: "capital",
    coordinates: [43.15, 36.36],
    modernLocation: { fa: "روبه‌روی موصل، کنار دجله، عراق", en: "Opposite Mosul on the Tigris, Iraq" },
    description: {
      fa: "پایتخت واپسین شاهان بزرگ آشور و جایگاه کتابخانهٔ آشوربانیپال؛ در ۶۱۲ پ.م ویران شد.",
      en: "Capital of the last great Assyrian kings and home of Ashurbanipal's library; destroyed in 612 BCE.",
    },
    entityIds: ["neo-assyrian-empire"],
    sourceIds: ["br-nineveh", "br-ashurbanipal"],
  }),

  /* ── Achaemenid ── */
  place({
    id: "pasargadae",
    name: { fa: "پاسارگاد", en: "Pasargadae" },
    kind: "capital",
    existsFrom: fromEra(546, "BCE"), // built by Cyrus after his conquest of Lydia
    coordinates: [53.18, 30.2],
    modernLocation: { fa: "دشت مرغاب، استان فارس، ایران", en: "Dasht-e Morghab, Fars province, Iran" },
    description: {
      fa: "پایتخت و آرامگاه کوروش بزرگ در شمال فارس، با کاخ‌ها و باغ شاهی.",
      en: "Capital and burial place of Cyrus the Great in northern Fars, with palaces and a royal garden.",
    },
    entityIds: ["achaemenid-empire"],
    sourceIds: ["ir-pasargadae", "unesco-pasargadae"],
  }),
  place({
    id: "persepolis",
    name: { fa: "تخت جمشید", en: "Persepolis" },
    altNames: { fa: ["پارسه", "پرسپولیس"], en: ["Pārsa", "Takht-e Jamshid"] },
    kind: "capital",
    existsFrom: fromEra(518, "BCE"), // begun by Darius I in about 518 BCE
    coordinates: [52.89, 29.94],
    modernLocation: { fa: "مرودشت، استان فارس، ایران", en: "Marvdasht, Fars province, Iran" },
    description: {
      fa: "مجموعهٔ کاخ‌های تشریفاتی هخامنشی که داریوش بزرگ ساخت آن را حدود ۵۱۸ پ.م آغاز کرد.",
      en: "Achaemenid ceremonial palace complex begun by Darius the Great in about 518 BCE.",
    },
    entityIds: ["achaemenid-empire"],
    sourceIds: ["ir-persepolis", "unesco-persepolis"],
  }),
  place({
    id: "susa",
    name: { fa: "شوش", en: "Susa" },
    kind: "capital",
    coordinates: [48.26, 32.19],
    modernLocation: { fa: "شوش، استان خوزستان، ایران", en: "Shush, Khuzestan province, Iran" },
    description: {
      fa: "شهر کهن ایلامی که از مراکز اصلی اداری و اقامتگاه‌های شاهان هخامنشی شد.",
      en: "Ancient Elamite city that became a principal administrative centre and royal residence of the Achaemenid kings.",
    },
    entityIds: ["achaemenid-empire"],
    sourceIds: ["ir-capital-cities", "ir-achaemenid-empire"],
  }),
  place({
    id: "ecbatana",
    name: { fa: "هگمتانه", en: "Ecbatana" },
    altNames: { fa: ["اکباتان", "همدان"], en: ["Hagmatāna", "Hamadan"] },
    kind: "capital",
    coordinates: [48.52, 34.8],
    modernLocation: { fa: "همدان، ایران", en: "Hamadan, Iran" },
    description: {
      fa: "پایتخت ماد که پس از پیروزی کوروش بر آستیاگ، اقامتگاه تابستانی شاهان هخامنشی شد.",
      en: "Median capital that became a summer residence of the Achaemenid kings after Cyrus defeated Astyages.",
    },
    entityIds: ["achaemenid-empire"],
    sourceIds: ["ir-capital-cities", "ir-cyrus-ii"],
  }),
  place({
    id: "babylon",
    name: { fa: "بابل", en: "Babylon" },
    kind: "city",
    coordinates: [44.42, 32.54],
    modernLocation: { fa: "نزدیک حِلّه، عراق", en: "Near Hillah, Iraq" },
    description: {
      fa: "کلان‌شهر میان‌رودان؛ در ۵۳۹ پ.م به دست کوروش افتاد و اسکندر در ۳۲۳ پ.م در آن درگذشت.",
      en: "Great city of Mesopotamia; taken by Cyrus in 539 BCE, and the place where Alexander died in 323 BCE.",
    },
    entityIds: ["achaemenid-empire", "macedon-hellenistic", "neo-assyrian-empire"],
    sourceIds: ["ir-cyrus-ii", "bm-cyrus-cylinder", "br-alexander"],
  }),

  /* ── Macedon and the Hellenistic world ── */
  place({
    id: "pella",
    name: { fa: "پِلا", en: "Pella" },
    kind: "capital",
    coordinates: [22.52, 40.76],
    modernLocation: { fa: "مقدونیهٔ مرکزی، یونان", en: "Central Macedonia, Greece" },
    description: {
      fa: "پایتخت پادشاهی مقدونیه و زادگاه اسکندر.",
      en: "Capital of the kingdom of Macedon and birthplace of Alexander.",
    },
    entityIds: ["macedon-hellenistic"],
    sourceIds: ["br-alexander"],
  }),
  place({
    id: "gaugamela",
    name: { fa: "گوگمل", en: "Gaugamela" },
    altNames: { fa: ["گوگامل", "نبرد اربیل"], en: ["Arbela (battle name)"] },
    kind: "battlefield",
    coordinates: [43.25, 36.56],
    approximateLocation: true,
    modernLocation: { fa: "شمال عراق، در دشت‌های شرق موصل (جای دقیق نامعلوم)", en: "Northern Iraq, plains east of Mosul (exact site unknown)" },
    description: {
      fa: "میدان نبرد سرنوشت‌ساز اسکندر و داریوش سوم. جای دقیق آن بازیافتنی نیست و نشانهٔ روی نقشه تقریبی است.",
      en: "Field of the decisive battle between Alexander and Darius III. The exact location cannot be recovered; the map marker is approximate.",
    },
    entityIds: ["achaemenid-empire", "macedon-hellenistic"],
    sourceIds: ["ir-gaugamela"],
  }),
  place({
    id: "antioch",
    name: { fa: "انطاکیه", en: "Antioch" },
    altNames: { fa: [], en: ["Antioch on the Orontes", "Antakya"] },
    kind: "capital",
    existsFrom: fromEra(300, "BCE"), // founded by Seleucus I
    coordinates: [36.16, 36.2],
    modernLocation: { fa: "انطاکیه، ترکیه", en: "Antakya, Türkiye" },
    description: {
      fa: "شهری که سلوکوس یکم بنیاد نهاد و پایتخت غربی شاهنشاهی سلوکی شد.",
      en: "City founded by Seleucus I that became the western capital of the Seleucid empire.",
    },
    entityIds: ["macedon-hellenistic"],
    sourceIds: ["br-seleucus-i", "ir-seleucid-empire"],
  }),

  /* ── Maurya ── */
  place({
    id: "pataliputra",
    name: { fa: "پاتلی‌پوترا", en: "Pataliputra" },
    altNames: { fa: ["پتنه"], en: ["Patna"] },
    kind: "capital",
    coordinates: [85.14, 25.61],
    modernLocation: { fa: "پتنه، ایالت بیهار، هند", en: "Patna, Bihar, India" },
    description: {
      fa: "پایتخت شاهنشاهی مائوریا در نزدیکی پیوندگاه رودهای سون و گنگ.",
      en: "Capital of the Mauryan empire, near the junction of the Son and Ganges rivers.",
    },
    entityIds: ["maurya-empire"],
    sourceIds: ["br-mauryan"],
  }),
  place({
    id: "kalinga",
    name: { fa: "کالینگا", en: "Kalinga" },
    kind: "site",
    coordinates: [85.84, 20.19],
    approximateLocation: true,
    modernLocation: { fa: "کرانهٔ ایالت اودیشا، هند (ناحیه، نه یک نقطهٔ دقیق)", en: "Coastal Odisha, India (a region, not an exact spot)" },
    description: {
      fa: "ناحیه‌ای در کرانهٔ خاوری هند که آشوکا آن را گشود. نشانه جای تقریبی ناحیه را نشان می‌دهد.",
      en: "Region on India's east coast conquered by Ashoka. The marker shows the approximate position of the region.",
    },
    entityIds: ["maurya-empire"],
    sourceIds: ["br-ashoka", "br-mauryan"],
  }),

  /* ── Han ── */
  place({
    id: "changan",
    name: { fa: "چانگ‌آن", en: "Chang'an" },
    altNames: { fa: ["شی‌آن"], en: ["Xi'an"] },
    kind: "capital",
    coordinates: [108.86, 34.31],
    modernLocation: { fa: "شی‌آن، استان شاآنشی، چین", en: "Xi'an, Shaanxi province, China" },
    description: {
      fa: "پایتخت هان غربی (پیشین).",
      en: "Capital of the Western (Former) Han.",
    },
    entityIds: ["han-dynasty"],
    sourceIds: ["br-han", "met-han"],
  }),
  place({
    id: "luoyang",
    name: { fa: "لویانگ", en: "Luoyang" },
    kind: "capital",
    existsFrom: fromEra(25, "CE"), // Han capital from the restoration of 25 CE
    coordinates: [112.45, 34.62],
    modernLocation: { fa: "لویانگ، استان هنان، چین", en: "Luoyang, Henan province, China" },
    description: {
      fa: "پایتخت هان شرقی (پسین) پس از بازگشت دودمان در ۲۵ م.",
      en: "Capital of the Eastern (Later) Han after the dynasty was restored in 25 CE.",
    },
    entityIds: ["han-dynasty"],
    sourceIds: ["br-han", "met-han"],
  }),

  /* ── Rome ── */
  place({
    id: "rome",
    name: { fa: "رُم", en: "Rome" },
    kind: "capital",
    coordinates: [12.48, 41.89],
    modernLocation: { fa: "رم، ایتالیا", en: "Rome, Italy" },
    description: {
      fa: "شهر بنیادین و پایتخت امپراتوری روم.",
      en: "Founding city and capital of the Roman Empire.",
    },
    entityIds: ["roman-empire"],
    sourceIds: ["br-roman-empire"],
  }),
  place({
    id: "constantinople",
    name: { fa: "قسطنطنیه", en: "Constantinople" },
    altNames: { fa: ["کنستانتینوپل", "بیزانتیوم", "استانبول"], en: ["Byzantium", "New Rome", "Istanbul"] },
    kind: "capital",
    existsFrom: fromEra(330, "CE"), // inaugurated by Constantine in 330 CE
    coordinates: [28.98, 41.01],
    modernLocation: { fa: "استانبول، ترکیه", en: "Istanbul, Türkiye" },
    description: {
      fa: "«رم نو» که کنستانتین در ۳۳۰ م گشود؛ پایتخت امپراتوری روم شرقی.",
      en: "The 'New Rome' inaugurated by Constantine in 330 CE; capital of the Eastern Roman Empire.",
    },
    entityIds: ["roman-empire"],
    sourceIds: ["br-constantine", "br-roman-timeline"],
  }),
  place({
    id: "actium",
    name: { fa: "آکتیوم", en: "Actium" },
    kind: "battlefield",
    coordinates: [20.72, 38.95],
    modernLocation: { fa: "کرانهٔ باختری یونان", en: "Western coast of Greece" },
    description: {
      fa: "دماغه‌ای که نبرد دریایی اکتاویان با آنتونی و کلئوپاترا در برابر آن رخ داد.",
      en: "Promontory off which Octavian's fleet fought Antony and Cleopatra.",
    },
    entityIds: ["roman-empire", "macedon-hellenistic"],
    sourceIds: ["br-actium"],
  }),

  /* ── Sasanian ── */
  place({
    id: "ctesiphon",
    name: { fa: "تیسفون", en: "Ctesiphon" },
    altNames: { fa: ["مدائن"], en: ["Ṭīsfūn", "al-Madāʾin"] },
    kind: "capital",
    coordinates: [44.58, 33.09],
    modernLocation: { fa: "کنار دجله، حدود ۳۵ کیلومتری جنوب بغداد، عراق", en: "On the Tigris, about 35 km south of Baghdad, Iraq" },
    description: {
      fa: "پایتخت و شهر تاج‌گذاری ساسانیان از روزگار اردشیر یکم تا فتح به دست سپاهیان مسلمان در ۶۳۷ م.",
      en: "Sasanian capital and coronation city from Ardashir I until its conquest by Muslim armies in 637 CE.",
    },
    entityIds: ["sasanian-empire"],
    sourceIds: ["ir-ctesiphon", "ir-capital-cities"],
  }),
  place({
    id: "firuzabad",
    name: { fa: "فیروزآباد (اردشیرخوره)", en: "Firuzabad (Ardashir-Khwarrah)" },
    altNames: { fa: ["گور"], en: ["Gōr"] },
    kind: "city",
    coordinates: [52.53, 28.85],
    modernLocation: { fa: "فیروزآباد، استان فارس، ایران", en: "Firuzabad, Fars province, Iran" },
    description: {
      fa: "شهر دایره‌ای و کاخ اردشیر یکم در فارس؛ از آثار آغازین دوران ساسانی.",
      en: "Circular city and palace of Ardashir I in Fars; among the earliest Sasanian monuments.",
    },
    entityIds: ["sasanian-empire"],
    sourceIds: ["unesco-sassanid-fars", "ir-ardashir-i"],
  }),
  place({
    id: "bishapur",
    name: { fa: "بیشاپور", en: "Bishapur" },
    kind: "city",
    existsFrom: fromEra(260, "CE"), // founded by Shapur I
    coordinates: [51.57, 29.78],
    modernLocation: { fa: "نزدیک کازرون، استان فارس، ایران", en: "Near Kazerun, Fars province, Iran" },
    description: {
      fa: "شهر شاپور یکم با نقش‌برجسته‌هایی که پیروزی‌های او بر رومیان را نشان می‌دهد.",
      en: "City of Shapur I, with rock reliefs showing his victories over Rome.",
    },
    entityIds: ["sasanian-empire"],
    sourceIds: ["unesco-sassanid-fars", "ir-shapur-i"],
  }),
  place({
    id: "edessa",
    name: { fa: "اِدِسا", en: "Edessa" },
    altNames: { fa: ["رُها", "اورفا"], en: ["Şanlıurfa"] },
    kind: "battlefield",
    coordinates: [38.79, 37.16],
    modernLocation: { fa: "شانلی‌اورفا، ترکیه", en: "Şanlıurfa, Türkiye" },
    description: {
      fa: "شهری در میان‌رودان بالا که در نزدیکی آن شاپور یکم امپراتور والرین را شکست داد.",
      en: "City in upper Mesopotamia near which Shapur I defeated the emperor Valerian.",
    },
    entityIds: ["sasanian-empire", "roman-empire"],
    sourceIds: ["ir-shapur-i", "br-edessa"],
  }),
  place({
    id: "qadisiyyah",
    name: { fa: "قادسیه", en: "al-Qadisiyyah" },
    altNames: { fa: [], en: ["Qādesiya"] },
    kind: "battlefield",
    coordinates: [44.3, 31.8],
    approximateLocation: true,
    modernLocation: { fa: "مرز بیابانی عراق ساسانی، جنوب باختری حیره", en: "Desert frontier of Sasanian Iraq, south-west of al-Hirah" },
    description: {
      fa: "آبادی مرزی که سپاه ساسانی در نزدیکی آن از سپاهیان عرب مسلمان شکست خورد. جای نشانه تقریبی است.",
      en: "Frontier settlement near which a Sasanian army was defeated by Arab Muslim forces. The marker position is approximate.",
    },
    entityIds: ["sasanian-empire"],
    sourceIds: ["ir-qadesiya"],
  }),
  place({
    id: "merv",
    name: { fa: "مرو", en: "Merv" },
    altNames: { fa: [], en: ["Marv"] },
    kind: "city",
    coordinates: [62.19, 37.66],
    modernLocation: { fa: "نزدیک ماری، ترکمنستان", en: "Near Mary, Turkmenistan" },
    description: {
      fa: "شهر مرزی شمال‌خاوری ساسانیان که یزدگرد سوم در ۶۵۱ م در نزدیکی آن کشته شد.",
      en: "North-eastern frontier city of the Sasanians, near which Yazdegerd III was killed in 651 CE.",
    },
    entityIds: ["sasanian-empire"],
    sourceIds: ["ir-sasanian-dynasty", "ir-chronology"],
  }),
];
