/**
 * Historical people.
 *
 * Birth and death years are given only where the cited sources state them.
 * No quotations are attributed to anyone: words put in the mouths of ancient
 * figures are rarely verifiable.
 */
import type { Person } from "./schema";
import { bce, ce, tx } from "./helpers";

type PersonInput = Omit<Person, "slug" | "altNames" | "placeIds" | "contributions"> &
  Partial<Pick<Person, "altNames" | "placeIds" | "contributions">>;

function person(input: PersonInput): Person {
  return { slug: input.id, altNames: { fa: [], en: [] }, placeIds: [], contributions: [], ...input };
}

export const people: Person[] = [
  /* ── Egypt ── */
  person({
    id: "khufu",
    name: tx("خوفو", "Khufu"),
    altNames: { fa: ["خئوپس"], en: ["Cheops"] },
    role: tx("شاه دودمان چهارم مصر", "King of Egypt's Fourth Dynasty"),
    entityId: "ancient-egypt",
    reign: { start: bce(2551, "approximate"), end: bce(2528, "approximate") },
    summary: tx("فرعونی که هرم بزرگ جیزه در روزگار او ساخته شد.", "The pharaoh in whose reign the Great Pyramid of Giza was built."),
    overview: [
      tx(
        "خوفو از شاهان پادشاهی کهن بود. هرم بزرگ جیزه، بزرگ‌ترین هرم مصر باستان، در دوران فرمانروایی او ساخته شد. از زندگی خودِ او آگاهی اندکی در دست است.",
        "Khufu was a king of the Old Kingdom. The Great Pyramid of Giza, the largest pyramid of ancient Egypt, was built during his reign. Little is known about his own life.",
      ),
    ],
    contributions: [tx("ساخت هرم بزرگ جیزه.", "Construction of the Great Pyramid of Giza.")],
    placeIds: ["giza", "memphis"],
    uncertainty: tx("سال‌های پادشاهی تقریبی است و از گاه‌شماری موزهٔ متروپولیتن گرفته شده.", "Regnal years are approximate and follow the Metropolitan Museum's chronology."),
    sourceIds: ["met-egypt-rulers", "br-ancient-egypt", "unesco-memphis"],
  }),
  person({
    id: "hatshepsut",
    name: tx("حتشپسوت", "Hatshepsut"),
    role: tx("فرعون زنِ دودمان هجدهم مصر", "Female pharaoh of Egypt's Eighteenth Dynasty"),
    entityId: "ancient-egypt",
    reign: { start: bce(1479, "approximate"), end: bce(1458, "approximate") },
    summary: tx("زنی که همهٔ عنوان‌ها و نشان‌های فرعونی را به خود گرفت و دورانی آرام را رقم زد.", "A woman who adopted the full titles and regalia of a pharaoh and presided over a largely peaceful reign."),
    overview: [
      tx(
        "حتشپسوت به قدرتی دست یافت که برای یک زن در مصر بی‌سابقه بود و عنوان‌ها و جامهٔ کامل فرعون را برگزید. دوران او بیشتر با آرامش همراه بود.",
        "Hatshepsut attained power unprecedented for a woman in Egypt, adopting the full titles and regalia of a pharaoh. Her reign was essentially peaceful.",
      ),
    ],
    placeIds: ["thebes"],
    uncertainty: tx("سال‌های پادشاهی تقریبی است؛ منابع دیگر حدود ۱۴۷۳–۱۴۵۸ پ.م را می‌آورند.", "Regnal years are approximate; other references give about 1473–1458 BCE."),
    sourceIds: ["br-hatshepsut", "met-egypt-rulers"],
  }),
  person({
    id: "ramses-ii",
    name: tx("رامسس دوم", "Ramses II"),
    altNames: { fa: ["رامسس بزرگ", "رعمسیس دوم"], en: ["Ramesses II", "Ramses the Great"] },
    role: tx("فرعون دودمان نوزدهم مصر", "Pharaoh of Egypt's Nineteenth Dynasty"),
    entityId: "ancient-egypt",
    reign: { start: bce(1279, "approximate"), end: bce(1213, "approximate") },
    summary: tx("فرعون پادشاهی نو که در قادش با هیتیان جنگید.", "New Kingdom pharaoh who fought the Hittites at Kadesh."),
    overview: [
      tx(
        "رامسس دوم یکی از بلندترین دوران‌های پادشاهی مصر را داشت. در نبرد قادش، سپاه او در آغاز در آستانهٔ شکست بود اما با رسیدن نیروهای کمکی نبرد بی‌برنده پایان یافت؛ نگاره‌های مصری آن را پیروزی نشان می‌دهند، هرچند هیتیان دست‌کم به همان اندازه کامیاب بودند.",
        "Ramses II had one of the longest reigns in Egyptian history. At the Battle of Kadesh his army at first faced a rout, but reinforcements arrived and the battle ended in stalemate; Egyptian scenes present it as a victory, although the Hittite coalition fared at least as well.",
      ),
    ],
    placeIds: ["kadesh", "thebes"],
    sourceIds: ["br-ramses-ii", "met-egypt-rulers"],
  }),

  /* ── Assyria ── */
  person({
    id: "tiglath-pileser-iii",
    name: tx("تیگلت‌پیلسر سوم", "Tiglath-pileser III"),
    role: tx("شاه آشور", "King of Assyria"),
    entityId: "neo-assyrian-empire",
    reign: { start: bce(745), end: bce(727) },
    summary: tx("شاهی که استان‌های آشور را از نو سازمان داد و مرحلهٔ امپراتوری آن را آغاز کرد.", "The king who reorganized Assyria's provinces and opened its imperial phase."),
    overview: [
      tx(
        "تیگلت‌پیلسر سوم قلمرو آشور را بسیار گسترش داد و استان‌ها را از نو سامان داد تا قدرت فرمانداران محلی کاهش یابد.",
        "Tiglath-pileser III greatly enlarged Assyria's realm and reorganized its provinces to weaken local governors.",
      ),
    ],
    contributions: [tx("بازسازمان‌دهی نظام استانی آشور.", "Reorganization of the Assyrian provincial system.")],
    placeIds: ["ashur"],
    sourceIds: ["br-tiglath-pileser-iii", "br-neo-assyrian"],
  }),
  person({
    id: "ashurbanipal",
    name: tx("آشوربانیپال", "Ashurbanipal"),
    role: tx("واپسین شاه بزرگ آشور", "Last great king of Assyria"),
    entityId: "neo-assyrian-empire",
    reign: { start: bce(668), end: bce(627, "approximate") },
    summary: tx("شاهی که در نینوا نخستین کتابخانهٔ نظام‌مند خاور نزدیک باستان را گرد آورد.", "The king who assembled at Nineveh the first systematically organized library of the ancient Middle East."),
    overview: [
      tx(
        "آشوربانیپال شورش مصر را فرونشاند، صور را محاصره کرد و با قبیله‌های عرب و ایلام جنگید. شهرت ماندگار او از کتابخانهٔ لوح‌های میخی است که در نینوا فراهم آورد. جنگ داخلی میان پسرانش دولت را سست کرد.",
        "Ashurbanipal put down a revolt in Egypt, besieged Tyre and fought Arab tribes and Elam. His lasting fame rests on the library of cuneiform tablets he gathered at Nineveh. Civil war between his sons weakened the state.",
      ),
    ],
    contributions: [tx("کتابخانهٔ آشوربانیپال در نینوا.", "The Library of Ashurbanipal at Nineveh.")],
    placeIds: ["nineveh"],
    uncertainty: tx("سال پایان پادشاهی او به‌قطع دانسته نیست.", "The year his reign ended is not securely known."),
    sourceIds: ["br-ashurbanipal", "bm-ashurbanipal-annals", "br-assyria"],
  }),

  /* ── Achaemenid ── */
  person({
    id: "cyrus-ii",
    name: tx("کوروش دوم (بزرگ)", "Cyrus II (the Great)"),
    altNames: { fa: ["کوروش بزرگ", "کورش"], en: ["Cyrus the Great", "Cyrus the Elder", "Kūruš"] },
    role: tx("بنیادگذار شاهنشاهی هخامنشی", "Founder of the Achaemenid Empire"),
    entityId: "achaemenid-empire",
    birth: bce(600, "approximate"),
    death: bce(530),
    reign: { start: bce(559), end: bce(530) },
    summary: tx("شاه پارسی که با گشودن ماد، لیدیه و بابل شاهنشاهی هخامنشی را بنیاد نهاد.", "The Persian king who founded the Achaemenid Empire by conquering Media, Lydia and Babylon."),
    overview: [
      tx(
        "نیاکان کوروش چند نسل بر قبیله‌های پارسی فرمان رانده بودند. او آستیاگ مادی را شکست داد، در ۵۴۷ پ.م لیدیه را گرفت و پس از لشکرکشی به آسیای مرکزی، در ۵۳۹ پ.م بابل را گشود.",
        "Cyrus's ancestors had ruled the Persian tribes for several generations. He defeated Astyages of Media, took Lydia in 547 BCE and, after campaigning in Central Asia, captured Babylon in 539 BCE.",
      ),
      tx(
        "او اقامتگاه خود را در پاسارگاد، سرزمین خاندان هخامنشی، برپا کرد و در همان‌جا به خاک سپرده شد. استوانهٔ گلی‌ای که پس از تصرف بابل نوشته شد، بازگرداندن تندیس خدایان به پرستشگاه‌هایشان را گزارش می‌کند.",
        "He established his residence at Pasargadae, the home of the Achaemenid clan, and was buried there. A clay cylinder written after the capture of Babylon reports the return of divine statues to their temples.",
      ),
    ],
    contributions: [
      tx("بنیادگذاری شاهنشاهی هخامنشی.", "Founding of the Achaemenid Empire."),
      tx("ساخت پاسارگاد.", "Building of Pasargadae."),
    ],
    placeIds: ["pasargadae", "babylon", "ecbatana"],
    uncertainty: tx("سال زادروز تقریبی است. برخی کتیبه‌های پاسارگاد به نام او احتمالاً بیش از یک دهه پس از مرگش برپا شده‌اند.", "The birth year is approximate. Some Pasargadae inscriptions in his name appear to have been set up more than a decade after his death."),
    sourceIds: ["ir-cyrus-ii", "ir-pasargadae", "bm-cyrus-cylinder", "met-achaemenid"],
  }),
  person({
    id: "darius-i",
    name: tx("داریوش یکم (بزرگ)", "Darius I (the Great)"),
    altNames: { fa: ["داریوش بزرگ"], en: ["Darius the Great", "Dārayavauš"] },
    role: tx("سومین شاهنشاه هخامنشی", "Third Achaemenid king of kings"),
    entityId: "achaemenid-empire",
    birth: bce(550),
    death: bce(486),
    reign: { start: bce(522), end: bce(486) },
    summary: tx("شاهی که شاهنشاهی را سازمان داد، مرزها را گسترد و تخت جمشید را بنیاد نهاد.", "The king who organized the empire, extended its frontiers and founded Persepolis."),
    overview: [
      tx(
        "داریوش پسر ویشتاسپ و از شاخهٔ دیگری از خاندان هخامنشی بود. پیش از شاهی، در مصر نیزه‌دار کمبوجیه بود. در ۵۲۲ پ.م به تخت نشست و مرزهای شاهنشاهی را تا تراکیه، لیبی و درهٔ سند گسترد.",
        "Darius was the son of Hystaspes, from another branch of the Achaemenid family. Before his accession he served Cambyses in Egypt as a spear-bearer. He took the throne in 522 BCE and extended the empire's frontiers to Thrace, Libya and the Indus valley.",
      ),
      tx(
        "سکهٔ زرین دریک و یکسان‌سازی یکاهای فلز برای دادوستد از کارهای اوست. حدود ۵۱۸ پ.م ساخت مجموعهٔ کاخ‌های تخت جمشید را آغاز کرد.",
        "He introduced the gold daric and standardized units of metal for exchange. In about 518 BCE he began building the palace complex of Persepolis.",
      ),
    ],
    contributions: [
      tx("سازمان‌دهی ساتراپی‌ها و مالیات.", "Organization of the satrapies and taxation."),
      tx("ضرب سکهٔ دریک.", "Introduction of the daric coinage."),
      tx("بنیاد تخت جمشید.", "Foundation of Persepolis."),
    ],
    placeIds: ["persepolis", "susa"],
    sourceIds: ["ir-darius-i", "ir-persepolis", "ir-achaemenid-dynasty"],
  }),

  /* ── Macedon and the Hellenistic world ── */
  person({
    id: "alexander-iii",
    name: tx("اسکندر سوم مقدونی", "Alexander III of Macedon"),
    altNames: { fa: ["اسکندر بزرگ", "اسکندر مقدونی", "الکساندر"], en: ["Alexander the Great"] },
    role: tx("شاه مقدونیه و فاتح شاهنشاهی هخامنشی", "King of Macedon and conqueror of the Achaemenid Empire"),
    entityId: "macedon-hellenistic",
    birth: bce(356),
    death: bce(323),
    reign: { start: bce(336), end: bce(323) },
    summary: tx("شاه مقدونی که در یازده سال از یونان تا هند را گشود.", "The Macedonian king who in eleven years conquered from Greece to India."),
    overview: [
      tx(
        "اسکندر در ۳۵۶ پ.م در پلا زاده شد و در ۳۳۶ پ.م پس از کشته‌شدن پدرش فیلیپ دوم به شاهی رسید. در ۱ اکتبر ۳۳۱ پ.م در گوگمل بر داریوش سوم پیروز شد و در بهار ۳۳۰ پ.م تخت جمشید را به آتش کشید.",
        "Alexander was born at Pella in 356 BCE and became king in 336 BCE after the assassination of his father Philip II. On 1 October 331 BCE he defeated Darius III at Gaugamela, and in the spring of 330 BCE he burned Persepolis.",
      ),
      tx(
        "لشکرکشی او تا درهٔ سند ادامه یافت. در ژوئن ۳۲۳ پ.م در بابل درگذشت و سردارانش قلمرو را میان خود تقسیم کردند.",
        "His campaign continued to the Indus valley. He died in Babylon in June 323 BCE, and his generals divided the realm among themselves.",
      ),
    ],
    contributions: [tx("براندازی شاهنشاهی هخامنشی و گشودن راه دوران هلنیستی.", "Overthrow of the Achaemenid Empire, opening the Hellenistic age.")],
    placeIds: ["pella", "gaugamela", "persepolis", "babylon", "alexandria"],
    sourceIds: ["br-alexander", "ir-alexander", "ir-gaugamela"],
  }),
  person({
    id: "seleucus-i",
    name: tx("سلوکوس یکم نیکاتور", "Seleucus I Nicator"),
    altNames: { fa: ["سلوکوس"], en: ["Seleucus Nicator"] },
    role: tx("سردار مقدونی و بنیادگذار پادشاهی سلوکی", "Macedonian general and founder of the Seleucid kingdom"),
    entityId: "macedon-hellenistic",
    birth: bce(358, "approximate"),
    death: bce(281),
    reign: { start: bce(312), end: bce(281) },
    summary: tx("از سرداران اسکندر که بخش آسیایی قلمرو او را به پادشاهی سلوکی بدل کرد.", "One of Alexander's officers, who turned the Asian part of his realm into the Seleucid kingdom."),
    overview: [
      tx(
        "سلوکوس پس از مرگ اسکندر فرماندار بابل شد و در ۳۱۲ پ.م کنترل آن را به دست گرفت؛ این سال آغاز پادشاهی سلوکی شمرده می‌شود. در ۳۰۵ پ.م عنوان شاهی گرفت. پیشروی او به سوی هند را چندراگوپتا متوقف کرد و سلوکوس در برابر ۵۰۰ فیل سرزمین واگذار کرد.",
        "After Alexander's death Seleucus became governor of Babylon, and he took control of it in 312 BCE — the year counted as the start of the Seleucid kingdom. He assumed the royal title in 305 BCE. His advance toward India was halted by Chandragupta, and he ceded territory in exchange for 500 elephants.",
      ),
      tx(
        "در ۳۰۱ پ.م در نبرد ایپسوس در شکست آنتیگونوس سهیم بود و سوریه را به دست آورد. پایتخت را به انطاکیه برد و در ۲۸۱ پ.م کشته شد.",
        "In 301 BCE he shared in the defeat of Antigonus at Ipsos and gained Syria. He moved his capital to Antioch and was assassinated in 281 BCE.",
      ),
    ],
    placeIds: ["babylon", "antioch"],
    uncertainty: tx("سال زادروز تقریبی است. بازهٔ فرمانروایی از تصرف بابل (۳۱۲ پ.م) شمرده شده، نه از پذیرش عنوان شاهی (۳۰۵ پ.م).", "The birth year is approximate. The reign is counted from the seizure of Babylon (312 BCE), not from his assumption of the royal title (305 BCE)."),
    sourceIds: ["br-seleucus-i", "ir-seleucid-empire", "br-ipsos"],
  }),

  /* ── Maurya ── */
  person({
    id: "chandragupta",
    name: tx("چندراگوپتا مائوریا", "Chandragupta Maurya"),
    role: tx("بنیادگذار شاهنشاهی مائوریا", "Founder of the Maurya Empire"),
    entityId: "maurya-empire",
    reign: { start: bce(321, "approximate"), end: bce(297, "approximate") },
    summary: tx("نخستین فرمانروایی که بیشتر هند را زیر یک دولت گرد آورد.", "The first ruler to unite most of India under one administration."),
    overview: [
      tx(
        "چندراگوپتا با براندازی دودمان نندا در مگدهه به قدرت رسید و پس از مرگ اسکندر پنجاب را گرفت. بنا بر سنت، در پایان عمر به آیین جَین گروید؛ این گزارش سنتی است، نه تاریخ قطعی.",
        "Chandragupta took power by overthrowing the Nanda dynasty in Magadha and seized the Punjab after Alexander's death. According to tradition he embraced Jainism late in life; this is a traditional account, not established history.",
      ),
    ],
    contributions: [tx("بنیادگذاری شاهنشاهی مائوریا.", "Founding of the Maurya Empire.")],
    placeIds: ["pataliputra"],
    uncertainty: tx("همهٔ تاریخ‌ها تقریبی است.", "All dates are approximate."),
    sourceIds: ["br-chandragupta", "br-mauryan", "met-mauryan"],
  }),
  person({
    id: "ashoka",
    name: tx("آشوکا", "Ashoka"),
    altNames: { fa: ["اشوکا"], en: ["Aśoka", "Asoka"] },
    role: tx("شاهنشاه مائوریا و پشتیبان آیین بودا", "Mauryan emperor and patron of Buddhism"),
    entityId: "maurya-empire",
    reign: { start: bce(268, "approximate"), end: bce(232, "approximate") },
    summary: tx("واپسین شاهنشاه بزرگ مائوریا که پس از فتح کالینگا از جنگ‌افروزی دست کشید.", "The last major Mauryan emperor, who renounced military aggression after conquering Kalinga."),
    overview: [
      tx(
        "آشوکا پس از کشمکش جانشینی به تخت نشست. پس از فتح کالینگا از کشورگشایی نظامی دست کشید و بر آن شد که بر پایهٔ «دَرمه» زندگی کند. آموزه‌های خود را در سنگ‌نبشته‌هایی به نام فرمان‌های صخره‌ای و ستونی پراکند؛ در فرمان سیزدهم صخره‌ای از فتح کالینگا ابراز پشیمانی می‌کند.",
        "Ashoka gained the throne after a succession struggle. After conquering Kalinga he renounced military conquest and resolved to live according to the dharma. He spread his teachings through inscriptions known as the Rock Edicts and Pillar Edicts; the thirteenth Rock Edict expresses regret over the conquest of Kalinga.",
      ),
    ],
    contributions: [tx("فرمان‌های صخره‌ای و ستونی.", "The Rock Edicts and Pillar Edicts."), tx("پشتیبانی از آیین بودا.", "Patronage of Buddhism.")],
    placeIds: ["pataliputra", "kalinga"],
    uncertainty: tx("سال‌های پادشاهی در منابع معتبر متفاوت است (حدود ۲۷۳–۲۳۲، ۲۶۹–۲۳۲ یا ۲۶۵–۲۳۸ پ.م).", "Reign dates differ between reputable references (c. 273–232, c. 269–232 or c. 265–238 BCE)."),
    sourceIds: ["br-ashoka", "br-mauryan", "met-mauryan"],
  }),

  /* ── Han ── */
  person({
    id: "gaozu",
    name: tx("گائوزو (لیو بانگ)", "Gaozu (Liu Bang)"),
    altNames: { fa: ["لیو بانگ"], en: ["Liu Bang", "Emperor Gaozu of Han"] },
    role: tx("بنیادگذار دودمان هان", "Founder of the Han dynasty"),
    entityId: "han-dynasty",
    reign: { start: bce(206), end: bce(195) },
    summary: tx("رهبر شورش بر ضد دودمان چین (Qin) که چین را دوباره یکپارچه کرد.", "Leader of the revolt against the Qin who reunited China."),
    overview: [
      tx(
        "لیو بانگ شورش بر ضد دودمان چین (Qin) را رهبری کرد و دودمان هان را بنیاد نهاد. پس از مرگ، با نام «گائوزو» شناخته شد.",
        "Liu Bang led the revolt against the Qin and founded the Han dynasty. He is known by the posthumous name Gaozu.",
      ),
    ],
    contributions: [tx("بنیادگذاری دودمان هان.", "Founding of the Han dynasty.")],
    placeIds: ["changan"],
    sourceIds: ["br-gaozu", "br-han", "met-han"],
  }),
  person({
    id: "wudi",
    name: tx("وودی (امپراتور وو)", "Wudi (Emperor Wu)"),
    altNames: { fa: ["امپراتور وو"], en: ["Emperor Wu of Han", "Han Wudi"] },
    role: tx("امپراتور هان غربی", "Emperor of the Western Han"),
    entityId: "han-dynasty",
    reign: { start: bce(141), end: bce(87) },
    summary: tx("امپراتوری که اقتدار هان را به اوج رساند و نفوذ چین را به آسیای مرکزی گسترد.", "The emperor who brought Han authority to its height and extended Chinese influence into Central Asia."),
    overview: [
      tx(
        "وودی اقتدار دودمان هان را بسیار افزود، آیین کنفوسیوس را آیین رسمی دولت کرد و نفوذ چین را به بیرون از مرزها گسترش داد. او جانگ چیان را در ۱۳۸ پ.م برای پیوند با قوم یوئه‌جی به آسیای مرکزی فرستاد.",
        "Wudi vastly increased the authority of the Han dynasty, made Confucianism the official state doctrine and extended Chinese influence abroad. In 138 BCE he sent Zhang Qian to Central Asia to build ties with the Yuezhi.",
      ),
    ],
    contributions: [tx("رسمیت‌بخشیدن به آیین کنفوسیوس.", "Establishing Confucianism as state doctrine."), tx("گسترش به سوی آسیای مرکزی.", "Expansion toward Central Asia.")],
    placeIds: ["changan"],
    sourceIds: ["br-wudi", "br-han", "br-zhang-qian"],
  }),

  /* ── Rome ── */
  person({
    id: "augustus",
    name: tx("آگوستوس (اکتاویان)", "Augustus (Octavian)"),
    altNames: { fa: ["اکتاویان", "اوگوست"], en: ["Octavian", "Caesar Augustus"] },
    role: tx("نخستین امپراتور روم", "First Roman emperor"),
    entityId: "roman-empire",
    death: ce(14),
    reign: { start: bce(27), end: ce(14) },
    summary: tx("برندهٔ نبرد آکتیوم که جمهوری روم را به امپراتوری بدل کرد.", "Victor of Actium, who turned the Roman Republic into an empire."),
    overview: [
      tx(
        "اکتاویان در ۲ سپتامبر ۳۱ پ.م در نبرد دریایی آکتیوم بر مارک آنتونی پیروز شد و فرمانروای جهان رومی گشت. سال بعد مصر را به قلمرو روم افزود. فرمانروایی او با نام آگوستوس از ۲۷ پ.م، آغاز امپراتوری روم شمرده می‌شود.",
        "On 2 September 31 BCE Octavian defeated Mark Antony in the naval Battle of Actium and became master of the Roman world. The following year he annexed Egypt. His rule under the name Augustus, from 27 BCE, is counted as the beginning of the Roman Empire.",
      ),
    ],
    contributions: [tx("بنیادگذاری نظام امپراتوری روم.", "Founding of the Roman imperial system.")],
    placeIds: ["rome", "actium"],
    sourceIds: ["br-roman-empire", "br-roman-timeline", "br-actium", "met-roman-egypt"],
  }),
  person({
    id: "trajan",
    name: tx("ترایانوس", "Trajan"),
    altNames: { fa: ["تراژان"], en: ["Marcus Ulpius Traianus"] },
    role: tx("امپراتور روم", "Roman emperor"),
    entityId: "roman-empire",
    death: ce(117),
    reign: { start: ce(98), end: ce(117) },
    summary: tx("امپراتوری که روم در روزگار او به بیشترین گسترهٔ خود رسید.", "The emperor under whom Rome reached its greatest territorial extent."),
    overview: [
      tx(
        "در دوران ترایانوس (۹۸–۱۱۷ م) امپراتوری روم به بیشترین گسترهٔ خود رسید. پس از مرگ او در ۱۱۷ م، جانشینش هادریانوس به استوارسازی مرزها پرداخت.",
        "Under Trajan (98–117 CE) the Roman Empire reached its greatest extent. After his death in 117 CE his successor Hadrian turned to consolidating the frontiers.",
      ),
    ],
    placeIds: ["rome"],
    sourceIds: ["br-trajan", "br-roman-timeline", "br-roman-empire"],
  }),
  person({
    id: "constantine-i",
    name: tx("کنستانتین یکم", "Constantine I"),
    altNames: { fa: ["کنستانتین بزرگ", "قسطنطین"], en: ["Constantine the Great"] },
    role: tx("امپراتور روم و بنیادگذار قسطنطنیه", "Roman emperor and founder of Constantinople"),
    entityId: "roman-empire",
    death: ce(337),
    reign: { start: ce(306), end: ce(337) },
    summary: tx("امپراتوری که «رم نو» را در کنار بسفر پایتخت کرد.", "The emperor who made a 'New Rome' on the Bosporus his capital."),
    overview: [
      tx(
        "کنستانتین در ۱۱ مه ۳۳۰ م قسطنطنیه را به‌عنوان پایتخت تازهٔ امپراتوری گشود؛ شهری که بیش از هزار سال مرکز امپراتوری روم شرقی ماند.",
        "On 11 May 330 CE Constantine inaugurated Constantinople as the empire's new capital — a city that remained the centre of the Eastern Roman Empire for more than a thousand years.",
      ),
    ],
    contributions: [tx("بنیاد قسطنطنیه.", "Foundation of Constantinople.")],
    placeIds: ["constantinople"],
    sourceIds: ["br-constantine", "ir-byzantine-iranian", "br-roman-timeline"],
  }),

  /* ── Sasanian ── */
  person({
    id: "ardashir-i",
    name: tx("اردشیر یکم", "Ardashir I"),
    altNames: { fa: ["اردشیر بابکان", "اردشیر پاپکان"], en: ["Ardašīr I", "Ardashir Papakan"] },
    role: tx("بنیادگذار شاهنشاهی ساسانی", "Founder of the Sasanian Empire"),
    entityId: "sasanian-empire",
    reign: { start: ce(224), end: ce(241, "approximate") },
    summary: tx("فرمانروای پارسی که اشکانیان را برانداخت و در تیسفون تاج‌گذاری کرد.", "The Persian ruler who overthrew the Parthians and was crowned at Ctesiphon."),
    overview: [
      tx(
        "گزارش‌ها دربارهٔ تبار و جوانی اردشیر در بسیاری جزئیات با هم ناسازگارند. او در ۲۲۴ م اردوان، شاه اشکانی، را در نبرد هرمزدگان شکست داد و کشت. سپس تیسفون را گرفت و در ۲۲۶ م در آنجا تاج‌گذاری کرد.",
        "Accounts of Ardashir's origins and early years differ on many points. In 224 CE he defeated and killed the Parthian king Ardavan at the Battle of Hormozdgan. He then took Ctesiphon and was crowned there in 226 CE.",
      ),
    ],
    contributions: [tx("بنیادگذاری شاهنشاهی ساسانی.", "Founding of the Sasanian Empire."), tx("ساخت شهر اردشیرخوره (فیروزآباد).", "Building the city of Ardashir-Khwarrah (Firuzabad).")],
    placeIds: ["firuzabad", "ctesiphon"],
    uncertainty: tx("سال پایان پادشاهی و آغاز فرمانروایی مستقل شاپور یکم محل بحث است.", "The end of his reign and the start of Shapur I's sole rule are debated."),
    sourceIds: ["ir-ardashir-i", "ir-hormozdgan", "ir-sasanian-dynasty", "ir-ctesiphon"],
  }),
  person({
    id: "shapur-i",
    name: tx("شاپور یکم", "Shapur I"),
    altNames: { fa: [], en: ["Šāpur I", "Sapor I"] },
    role: tx("دومین شاهنشاه ساسانی", "Second Sasanian king of kings"),
    entityId: "sasanian-empire",
    reign: { start: ce(240, "disputed"), end: ce(270) },
    summary: tx("شاهی که امپراتور روم، والرین، را در ۲۶۰ م اسیر کرد.", "The king who captured the Roman emperor Valerian in 260 CE."),
    overview: [
      tx(
        "شاپور یکم عنوان «شاهنشاه ایران و انیران» را به کار برد. در سومین لشکرکشی‌اش، هنگام محاصرهٔ حرّان و ادسا، سپاه والرین را شکست داد و امپراتور را اسیر کرد. گزارش او در کتیبهٔ سه‌زبانهٔ کعبهٔ زرتشت با منابع رومی همخوان است.",
        "Shapur I used the title 'King of Kings of Ērān and Anērān'. In his third campaign, while besieging Carrhae and Edessa, he defeated Valerian's army and took the emperor prisoner. His account in the trilingual inscription on the Kaʿba-ye Zardosht agrees with the Roman sources.",
      ),
    ],
    contributions: [tx("کتیبهٔ سه‌زبانهٔ کعبهٔ زرتشت.", "The trilingual inscription on the Kaʿba-ye Zardosht."), tx("ساخت شهر بیشاپور.", "Building the city of Bishapur.")],
    placeIds: ["bishapur", "edessa", "ctesiphon"],
    uncertainty: tx("تاریخ آغاز پادشاهی محل بحث است: ۲۳۹، ۲۴۰ یا ۲۴۱ م.", "The accession date is debated: 239, 240 or 241 CE."),
    sourceIds: ["ir-shapur-i", "br-shapur-i", "br-edessa", "ir-sasanian-dynasty"],
  }),
  person({
    id: "khosrow-i",
    name: tx("خسرو یکم انوشیروان", "Khosrow I Anushirvan"),
    altNames: { fa: ["انوشیروان", "خسرو انوشیروان", "انوشیروان دادگر"], en: ["Ḵosrow I", "Chosroes I", "Anōširavān"] },
    role: tx("شاهنشاه ساسانی", "Sasanian king of kings"),
    entityId: "sasanian-empire",
    death: ce(579),
    reign: { start: ce(531), end: ce(579) },
    summary: tx("شاهی که با اصلاحات گسترده، دوران درخشان ساسانی را آغاز کرد.", "The king whose wide-ranging reforms opened a brilliant era of Sasanian rule."),
    overview: [
      tx(
        "خسرو یکم پسر قباد یکم بود. لقب «انوشیروان» (روانِ جاوید) پس از مرگ به او داده شد تا از خسرو دوم پرویز بازشناخته شود. او با اصلاحات اقتصادی، مالی، اداری، دینی و نظامی شناخته می‌شود و پس از به تخت نشستن، «صلح جاودان» را با یوستینیان بست. در سراسر دوران اسلامی نمونهٔ شاه «دادگر» شمرده می‌شد.",
        "Khosrow I was the son of Kawad I. The title Anushirvan ('of immortal soul') was given to him posthumously to distinguish him from Khosrow II Parviz. He is known for economic, fiscal, administrative, religious and military reforms, and after his accession he concluded the 'Endless Peace' with Justinian. Throughout the Islamic period he was celebrated as the ideal 'just' king.",
      ),
    ],
    contributions: [tx("اصلاحات مالی، اداری و نظامی.", "Fiscal, administrative and military reforms.")],
    placeIds: ["ctesiphon"],
    sourceIds: ["ir-khosrow-i", "ir-sasanian-dynasty", "ir-byzantine-iranian"],
  }),
  person({
    id: "yazdegerd-iii",
    name: tx("یزدگرد سوم", "Yazdegerd III"),
    altNames: { fa: ["یزدگرد"], en: ["Yazdgerd III", "Yazdgird III"] },
    role: tx("واپسین شاهنشاه ساسانی", "Last Sasanian king of kings"),
    entityId: "sasanian-empire",
    death: ce(651),
    reign: { start: ce(632, "approximate"), end: ce(651) },
    summary: tx("شاهی که در کودکی به تخت نشست و فرمانروایی‌اش با فتح ایران به دست عرب‌ها هم‌زمان شد.", "The king enthroned as a child, whose reign coincided with the Arab conquest of Iran."),
    overview: [
      tx(
        "یزدگرد سوم پس از دوره‌ای از پادشاهی‌های کوتاه، در کودکی بر تخت نشانده شد. پس از شکست سپاه ساسانی در قادسیه و افتادن تیسفون، به خاور واپس نشست. ماهوی سوری از مرو به او خیانت کرد و یزدگرد در آسیابی که در آن پناه گرفته بود کشته شد.",
        "Yazdegerd III was placed on the throne as a child after a period of short reigns. After the Sasanian defeat at al-Qadisiyyah and the fall of Ctesiphon he withdrew eastward. He was betrayed by Mahoy Suri of Merv and murdered in a mill where he had taken refuge.",
      ),
    ],
    placeIds: ["ctesiphon", "merv", "qadisiyyah"],
    uncertainty: tx("سال به تخت نشستن ۶۳۲ یا ۶۳۳ م ذکر می‌شود.", "His accession is given as 632 or 633 CE."),
    sourceIds: ["ir-sasanian-dynasty", "ir-chronology", "ir-arab-conquest"],
  }),
];
