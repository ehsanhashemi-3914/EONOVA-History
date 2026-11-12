import type { Entity } from "../schema";
import { bce, tx } from "../helpers";

export const mauryaEmpire: Entity = {
  id: "maurya-empire",
  slug: "maurya-empire",
  kind: "empire",
  kindNote: tx(
    "یک دولت امپراتوری مشخص به فرمانروایی دودمان مائوریا؛ نخستین دولتی که بیشتر شبه‌قارهٔ هند را در بر گرفت.",
    "One specific imperial state ruled by the Maurya dynasty: the first state to encompass most of the Indian subcontinent.",
  ),
  name: tx("شاهنشاهی مائوریا", "Maurya Empire"),
  altNames: { fa: ["امپراتوری موریا", "مائوریاها"], en: ["Mauryan Empire", "Mauryas"] },
  start: bce(
    321,
    "approximate",
    tx("تاریخ آغاز فرمانروایی چندراگوپتا تقریبی است (حدود ۳۲۵ تا ۳۲۱ پ.م).", "The start of Chandragupta's rule is approximate (about 325–321 BCE)."),
  ),
  end: bce(185, "approximate", tx("کشته‌شدن بریهدرتهه، واپسین شاه مائوریا.", "Killing of Brihadratha, the last Mauryan ruler.")),
  region: "south-asia",
  regionLabel: tx("شبه‌قارهٔ هند، با مرکزیت دشت گنگ", "The Indian subcontinent, centred on the Ganges plain"),
  summary: tx(
    "نخستین امپراتوری فراگیر هند که چندراگوپتا بنیاد نهاد و در روزگار آشوکا به اوج رسید.",
    "India's first subcontinental empire, founded by Chandragupta and at its height under Ashoka.",
  ),
  overview: [
    tx(
      "چندراگوپتا مائوریا با براندازی دودمان نَندا در مَگَدهه به قدرت رسید و با بهره‌گیری از خلأ پس از مرگ اسکندر، پنجاب را گرفت. تا حدود ۳۰۳ پ.م قلمرو او از بنگال تا افغانستان امروزی می‌رسید. پیشروی سلوکوس یکم را نیز متوقف کرد و با او به سازش رسید.",
      "Chandragupta Maurya came to power by overthrowing the Nanda dynasty in Magadha and, using the vacuum after Alexander's death, took the Punjab. By about 303 BCE his realm reached from Bengal to present-day Afghanistan. He also halted the advance of Seleucus I and came to terms with him.",
    ),
    tx(
      "پسرش بیندوسارا قلمرو را به سوی جنوب گسترش داد. نوه‌اش آشوکا پس از فتح خونین کالینگا از کشورگشایی دست کشید، به آیین بودا گروید و اندرزهای اخلاقی خود را بر صخره‌ها و ستون‌ها در سراسر قلمرو نگاشت. پس از مرگ آشوکا امپراتوری کوچک شد و حدود ۱۸۵ پ.م پایان یافت.",
      "His son Bindusara extended the realm southward. His grandson Ashoka, after the bloody conquest of Kalinga, renounced military conquest, embraced Buddhism and had his moral edicts inscribed on rocks and pillars across the realm. After Ashoka's death the empire shrank, and it ended around 185 BCE.",
    ),
  ],
  politicalStructure: tx(
    "پادشاهی متمرکز با پایتختی در پاتلی‌پوترا. فرمان‌های آشوکا نشان می‌دهد که شاه از راه کارگزاران و سنگ‌نبشته‌های همگانی با مردم سراسر قلمرو سخن می‌گفت.",
    "A centralized monarchy with its capital at Pataliputra. Ashoka's edicts show a king addressing subjects across the realm through officials and public inscriptions.",
  ),
  periods: [
    { id: "chandragupta", name: tx("چندراگوپتا", "Chandragupta"), start: bce(321, "approximate"), end: bce(297, "approximate") },
    { id: "bindusara", name: tx("بیندوسارا", "Bindusara"), start: bce(297, "approximate"), end: bce(268, "approximate") },
    { id: "ashoka", name: tx("آشوکا", "Ashoka"), start: bce(268, "approximate"), end: bce(232, "approximate"), note: tx("اوج گسترهٔ امپراتوری.", "The empire at its greatest extent.") },
    { id: "later-mauryas", name: tx("مائوریاهای پسین", "Later Mauryas"), start: bce(232, "approximate"), end: bce(185, "approximate") },
  ],
  capitals: [{ placeId: "pataliputra" }],
  achievements: [
    tx("یکپارچه‌سازی بیشتر شبه‌قارهٔ هند زیر یک فرمانروایی برای نخستین بار.", "Unifying most of the Indian subcontinent under one administration for the first time."),
    tx("فرمان‌های صخره‌ای و ستونی آشوکا.", "Ashoka's Rock Edicts and Pillar Edicts."),
    tx("پشتیبانی آشوکا از آیین بودا و فرستادن پیک‌های دینی نزد فرمانروایان هلنیستی.", "Ashoka's patronage of Buddhism and his sending of religious envoys to Hellenistic rulers."),
  ],
  relations: [
    { entityId: "macedon-hellenistic", type: "rival", note: tx("رویارویی و سپس سازش چندراگوپتا با سلوکوس یکم؛ پیک‌های آشوکا نزد شاهان هلنیستی.", "Chandragupta's confrontation and settlement with Seleucus I; Ashoka's envoys to Hellenistic kings.") },
  ],
  uncertainty: [
    tx(
      "تاریخ‌های مائوریا تقریبی‌اند. برای پادشاهی آشوکا در منابع معتبر بازه‌های گوناگونی مانند حدود ۲۷۳–۲۳۲، ۲۶۹–۲۳۲ و ۲۶۵–۲۳۸ پ.م آمده است.",
      "Mauryan dates are approximate. For Ashoka's reign, reputable references give differing ranges such as c. 273–232, c. 269–232 and c. 265–238 BCE.",
    ),
    tx(
      "میزان کنترل مستقیم دولت مرکزی بر نواحی دوردست قلمرو محل بحث است؛ محدودهٔ نقشه بازسازی تقریبی است.",
      "How directly the central government controlled the outlying parts of the realm is debated; the map outline is an approximate reconstruction.",
    ),
  ],
  color: "#a9b665",
  sourceIds: ["br-mauryan", "br-chandragupta", "br-ashoka", "met-mauryan", "br-seleucus-i"],
};
