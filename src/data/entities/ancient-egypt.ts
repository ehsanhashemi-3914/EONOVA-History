import type { Entity } from "../schema";
import { bce, tx } from "../helpers";

export const ancientEgypt: Entity = {
  id: "ancient-egypt",
  slug: "ancient-egypt",
  kind: "civilization",
  kindNote: tx(
    "مصر باستان یک «تمدن» است، نه یک دولت واحد: در حدود سه هزار سال، بیش از سی دودمان و چندین دورهٔ یکپارچگی و پراکندگی سیاسی را در بر می‌گیرد.",
    "Ancient Egypt is a civilization, not a single state: over roughly three thousand years it spans more than thirty dynasties and several periods of political unity and fragmentation.",
  ),
  name: tx("مصر باستان", "Ancient Egypt"),
  altNames: { fa: ["کِمِت", "تمدن نیل"], en: ["Kemet", "Pharaonic Egypt"] },
  start: bce(
    3100,
    "approximate",
    tx(
      "یکپارچگی مصر علیا و سفلی در منابع گوناگون میان حدود ۳۱۰۰ تا ۲۹۰۰ پ.م تاریخ‌گذاری می‌شود.",
      "The unification of Upper and Lower Egypt is dated between about 3100 and 2900 BCE in different reference works.",
    ),
  ),
  end: bce(
    30,
    "exact",
    tx(
      "پایان استقلال سیاسی با الحاق به روم؛ فرهنگ و دین مصری در دورهٔ رومی نیز ادامه یافت.",
      "End of political independence with annexation by Rome; Egyptian culture and religion continued under Roman rule.",
    ),
  ),
  region: "north-africa",
  regionLabel: tx("درهٔ نیل و دلتای آن، شمال‌خاوری آفریقا", "The Nile Valley and Delta, north-eastern Africa"),
  summary: tx(
    "تمدنی دیرپا در کرانهٔ نیل که با پادشاهی خداگونهٔ فرعون، خط هیروگلیف و معماری سنگی عظیم شناخته می‌شود.",
    "A long-lived civilization along the Nile, known for the divine kingship of the pharaoh, hieroglyphic writing and monumental stone architecture.",
  ),
  overview: [
    tx(
      "مصر باستان در درهٔ باریک و حاصل‌خیز نیل شکل گرفت. طغیان سالانهٔ رود، کشاورزی پایدار و دولتی متمرکز را ممکن ساخت. بنا بر سنت مصری، شاهی به نام «مِنِس» مصر علیا و سفلی را در یک پادشاهی یگانه کرد؛ هویت تاریخی او روشن نیست و تاریخ این یکپارچگی تقریبی است.",
      "Ancient Egypt took shape in the narrow, fertile valley of the Nile. The river's annual flood made stable agriculture and a centralized state possible. Egyptian tradition credited a king called Menes with joining Upper and Lower Egypt into one monarchy; his historical identity is unclear and the date of unification is approximate.",
    ),
    tx(
      "تاریخ‌نگاران این تمدن را به سه «پادشاهی» بزرگ — کهن، میانه و نو — تقسیم می‌کنند که با «دوره‌های میانی» پراکندگی از هم جدا می‌شوند. پادشاهی کهن روزگار هرم‌سازی بود و پادشاهی نو، دوران گسترش مصر به سوی شام و نوبه.",
      "Historians divide this civilization into three great 'Kingdoms' — Old, Middle and New — separated by 'Intermediate Periods' of fragmentation. The Old Kingdom was the age of pyramid building; the New Kingdom was the era of Egyptian expansion into the Levant and Nubia.",
    ),
    tx(
      "در هزارهٔ یکم پ.م مصر بارها زیر فرمان قدرت‌های بیرونی رفت: آشوریان به آن لشکر کشیدند، هخامنشیان در ۵۲۵ پ.م آن را گشودند، اسکندر در ۳۳۲ پ.م وارد آن شد و دودمان مقدونی‌تبار بطلمیوسی تا مرگ کلئوپاترای هفتم در ۳۰ پ.م بر آن فرمان راند. از آن پس مصر استانی از امپراتوری روم بود.",
      "In the first millennium BCE Egypt repeatedly came under outside powers: Assyrian armies invaded it, the Achaemenids conquered it in 525 BCE, Alexander entered it in 332 BCE, and the Macedonian Ptolemaic dynasty ruled it until the death of Cleopatra VII in 30 BCE. From then on Egypt was a province of the Roman Empire.",
    ),
  ],
  politicalStructure: tx(
    "پادشاهی متمرکز به رهبری فرعون که هم فرمانروا و هم میانجی خدایان و مردم شمرده می‌شد. در پادشاهی کهن، بیشتر مقام‌های بلندپایه خویشاوندان نزدیک شاه بودند. سرزمین به استان‌هایی (نوم‌ها) تقسیم می‌شد و دیوان‌سالاری گسترده‌ای از دبیران، مالیات و کار همگانی را اداره می‌کرد.",
    "A centralized monarchy led by the pharaoh, regarded both as ruler and as intermediary between gods and people. In the Old Kingdom most high officials were the king's close relatives. The land was divided into provinces (nomes), and an extensive bureaucracy of scribes administered taxation and public works.",
  ),
  periods: [
    { id: "early-dynastic", name: tx("دورهٔ دودمان‌های آغازین", "Early Dynastic Period"), start: bce(3100, "approximate"), end: bce(2649, "approximate") },
    { id: "old-kingdom", name: tx("پادشاهی کهن", "Old Kingdom"), start: bce(2649, "approximate"), end: bce(2130, "approximate"), note: tx("روزگار هرم‌سازی؛ پایتخت: ممفیس.", "Age of the pyramids; capital at Memphis.") },
    { id: "first-intermediate", name: tx("دورهٔ میانی نخست", "First Intermediate Period"), start: bce(2130, "approximate"), end: bce(2030, "approximate") },
    { id: "middle-kingdom", name: tx("پادشاهی میانه", "Middle Kingdom"), start: bce(2030, "approximate"), end: bce(1650, "approximate") },
    { id: "second-intermediate", name: tx("دورهٔ میانی دوم", "Second Intermediate Period"), start: bce(1650, "approximate"), end: bce(1550, "approximate") },
    { id: "new-kingdom", name: tx("پادشاهی نو", "New Kingdom"), start: bce(1550, "approximate"), end: bce(1070, "approximate"), note: tx("دوران امپراتوری مصر؛ مرکز دینی و سلطنتی: تبس.", "Egypt's age of empire; royal and religious centre at Thebes.") },
    { id: "third-intermediate", name: tx("دورهٔ میانی سوم", "Third Intermediate Period"), start: bce(1070, "approximate"), end: bce(664, "approximate") },
    { id: "late-period", name: tx("دورهٔ پسین", "Late Period"), start: bce(664), end: bce(332), note: tx("شامل دو دورهٔ فرمانروایی هخامنشیان.", "Includes two periods of Achaemenid rule.") },
    { id: "ptolemaic", name: tx("دورهٔ مقدونی و بطلمیوسی", "Macedonian and Ptolemaic Period"), start: bce(332), end: bce(30), note: tx("پایتخت: اسکندریه.", "Capital at Alexandria.") },
  ],
  capitals: [
    { placeId: "memphis", note: tx("پادشاهی کهن", "Old Kingdom") },
    { placeId: "thebes", note: tx("پادشاهی میانه و نو", "Middle and New Kingdoms") },
    { placeId: "alexandria", note: tx("دورهٔ بطلمیوسی", "Ptolemaic period") },
  ],
  achievements: [
    tx("خط هیروگلیف و سنت نوشتاری گسترده بر سنگ و پاپیروس.", "Hieroglyphic script and an extensive written tradition on stone and papyrus."),
    tx("هرم‌های جیزه؛ هرم بزرگ در روزگار خوفو ساخته شد.", "The pyramids of Giza; the Great Pyramid was built in the reign of Khufu."),
    tx("معماری عظیم سنگی در معابد کرنک و اقصر و آرامگاه‌های درهٔ شاهان.", "Monumental stone architecture at the Karnak and Luxor temples and the tombs of the Valley of the Kings."),
    tx("دیوان‌سالاری متمرکز و ماندگار بر پایهٔ دبیران.", "A durable, centralized bureaucracy based on scribes."),
  ],
  relations: [
    { entityId: "neo-assyrian-empire", type: "rival", note: tx("لشکرکشی‌های آشور به مصر در سدهٔ هفتم پ.م.", "Assyrian campaigns into Egypt in the seventh century BCE.") },
    { entityId: "achaemenid-empire", type: "conquered-by", note: tx("کمبوجیه در ۵۲۵ پ.م مصر را گشود.", "Cambyses conquered Egypt in 525 BCE.") },
    { entityId: "macedon-hellenistic", type: "conquered-by", note: tx("اسکندر در ۳۳۲ پ.م وارد مصر شد؛ سپس دودمان بطلمیوسی فرمان راند.", "Alexander entered Egypt in 332 BCE; the Ptolemaic dynasty ruled afterwards.") },
    { entityId: "roman-empire", type: "conquered-by", note: tx("پس از مرگ کلئوپاترای هفتم در ۳۰ پ.م به روم پیوست.", "Annexed by Rome after the death of Cleopatra VII in 30 BCE.") },
  ],
  uncertainty: [
    tx(
      "گاه‌شماری مصر پیش از ۶۶۴ پ.م تقریبی است و نظام‌های تاریخ‌گذاری گوناگون تا چند دهه با هم اختلاف دارند. تاریخ‌های دوره‌ها در این صفحه از گاه‌شماری موزهٔ متروپولیتن پیروی می‌کند.",
      "Egyptian chronology before 664 BCE is approximate, and different dating systems differ by up to several decades. Period dates on this page follow the chronology used by The Metropolitan Museum of Art.",
    ),
    tx(
      "«مِنِس» چهره‌ای سنتی و نیمه‌افسانه‌ای است و یکی‌بودن او با شاهی شناخته‌شده از راه باستان‌شناسی قطعی نیست.",
      "Menes is a traditional, semi-legendary figure; his identification with an archaeologically attested king is not settled.",
    ),
  ],
  color: "#d1a655",
  sourceIds: ["br-ancient-egypt", "br-egypt-dynasties", "met-egypt-rulers", "met-old-kingdom", "met-ptolemaic", "met-roman-egypt", "unesco-memphis", "unesco-thebes"],
};
