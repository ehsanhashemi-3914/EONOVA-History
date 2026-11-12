import type { Entity } from "../schema";
import { bce, ce, tx } from "../helpers";

export const romanEmpire: Entity = {
  id: "roman-empire",
  slug: "roman-empire",
  kind: "empire",
  kindNote: tx(
    "یک دولت امپراتوری که از ۲۷ پ.م جانشین جمهوری روم شد. پس از ۳۹۵ م دو دربار داشت: دربار باختری در ۴۷۶ م برافتاد، اما امپراتوری روم شرقی (بیزانس) تا ۱۴۵۳ م پابرجا ماند.",
    "An imperial state that succeeded the Roman Republic from 27 BCE. After 395 CE it had two courts: the western one fell in 476 CE, but the Eastern Roman (Byzantine) Empire lasted until 1453 CE.",
  ),
  name: tx("امپراتوری روم", "Roman Empire"),
  altNames: {
    fa: ["روم", "روم باستان", "امپراتوری روم شرقی", "بیزانس", "روم غربی"],
    en: ["Imperium Romanum", "Rome", "Eastern Roman Empire", "Byzantine Empire", "Western Roman Empire"],
  },
  start: bce(27, "exact", tx("آغاز فرمانروایی آگوستوس و گذار از جمهوری به امپراتوری.", "Start of Augustus' rule and the transition from republic to empire.")),
  end: ce(
    1453,
    "exact",
    tx(
      "گشوده‌شدن قسطنطنیه به دست محمد دوم عثمانی. توجه: دربار باختری در ۴۷۶ م پایان یافت و این اطلس تنها تا ۷۰۰ م را پوشش می‌دهد.",
      "Capture of Constantinople by the Ottoman sultan Mehmed II. Note: the western court ended in 476 CE, and this atlas covers events only up to 700 CE.",
    ),
  ),
  region: "mediterranean",
  regionLabel: tx("حوضهٔ مدیترانه، اروپای باختری، آناتولی، شام و شمال آفریقا", "The Mediterranean basin, western Europe, Anatolia, the Levant and North Africa"),
  summary: tx(
    "دولتی که سراسر کرانه‌های مدیترانه را یکپارچه کرد؛ نیمهٔ باختری آن در سدهٔ پنجم فروپاشید و نیمهٔ خاوری هزار سال دیگر ادامه یافت.",
    "The state that united the entire Mediterranean shore; its western half broke up in the fifth century while its eastern half continued for another thousand years.",
  ),
  overview: [
    tx(
      "در ۳۱ پ.م اکتاویان در نبرد دریایی آکتیوم بر مارک آنتونی پیروز شد و فرمانروای بی‌رقیب جهان رومی گشت. از ۲۷ پ.م، با نام آگوستوس، نظامی پدید آورد که جمهوری را به امپراتوری بدل کرد. امپراتوری در روزگار ترایانوس (۹۸–۱۱۷ م) به بیشترین گسترهٔ خود رسید.",
      "In 31 BCE Octavian defeated Mark Antony in the naval Battle of Actium and became undisputed master of the Roman world. From 27 BCE, under the name Augustus, he created the system that turned the republic into an empire. The empire reached its greatest extent under Trajan (98–117 CE).",
    ),
    tx(
      "در سدهٔ سوم، امپراتوری با بحران‌های درونی و با همسایهٔ نیرومند تازه‌ای در خاور — ساسانیان — روبه‌رو شد. کنستانتین یکم در ۳۳۰ م قسطنطنیه را به‌عنوان «رم نو» گشود. پس از مرگ تئودوسیوس یکم در ۳۹۵ م، امپراتوری میان دو دربار خاوری و باختری تقسیم شد.",
      "In the third century the empire faced internal crises and a powerful new neighbour in the east: the Sasanians. Constantine I inaugurated Constantinople as the 'New Rome' in 330 CE. After the death of Theodosius I in 395 CE the empire was divided between an eastern and a western court.",
    ),
    tx(
      "در ۴۷۶ م اودوآکر واپسین امپراتور باختر، رومولوس آگوستولوس، را برکنار کرد. این رویداد پایان «امپراتوری روم غربی» است، نه پایان امپراتوری روم: نیمهٔ خاوری که همواره ثروتمندتر بود، با پایتختی قسطنطنیه تا ۱۴۵۳ م ادامه یافت. نام «بیزانس» را تاریخ‌نگاران بعدها بر آن نهادند؛ مردمانش خود را «رومی» می‌خواندند.",
      "In 476 CE Odoacer deposed the last emperor in the West, Romulus Augustulus. That event marks the end of the Western Roman Empire, not of the Roman Empire: the eastern half, always the richer one, continued with its capital at Constantinople until 1453 CE. The name 'Byzantine' was applied by later historians; its people called themselves Romans.",
    ),
  ],
  politicalStructure: tx(
    "در آغاز، نظامی که در آن امپراتور قدرت واقعی را در دست داشت اما نهادهای جمهوری مانند سنا به‌ظاهر برجا بودند. قلمرو به استان‌هایی زیر نظر فرمانداران تقسیم می‌شد. در دورهٔ پسین، فرمانروایی آشکارا پادشاهی شد و اداره میان دو دربار خاور و باختر تقسیم گشت.",
    "At first, a system in which the emperor held real power while republican institutions such as the Senate formally survived. The realm was divided into provinces under governors. In the later period rule became openly monarchical and administration was divided between eastern and western courts.",
  ),
  periods: [
    { id: "principate", name: tx("امپراتوری آغازین (پرینکیپاتوس)", "Early empire (Principate)"), start: bce(27), end: ce(284) },
    { id: "late-empire", name: tx("امپراتوری پسین، پیش از تقسیم", "Later empire, before the division"), start: ce(284), end: ce(395), note: tx("از دیوکلتیان تا تئودوسیوس یکم.", "From Diocletian to Theodosius I.") },
    { id: "western-empire", name: tx("امپراتوری روم غربی", "Western Roman Empire"), start: ce(395), end: ce(476), note: tx("در ۴۷۶ م پایان یافت.", "Ended in 476 CE.") },
    { id: "eastern-empire", name: tx("امپراتوری روم شرقی (بیزانس)", "Eastern Roman (Byzantine) Empire"), start: ce(395), end: ce(1453), note: tx("ادامهٔ دولت روم با پایتختی قسطنطنیه.", "The continuing Roman state, with its capital at Constantinople.") },
  ],
  capitals: [
    { placeId: "rome", note: tx("پایتخت آغازین", "Original capital") },
    { placeId: "constantinople", note: tx("پایتخت از ۳۳۰ م", "Capital from 330 CE") },
  ],
  achievements: [
    tx("یکپارچه‌سازی سیاسی سراسر حوضهٔ مدیترانه.", "Political unification of the whole Mediterranean basin."),
    tx("نظام استانی و حقوقی که بر دولت‌های بعدی اروپا و مدیترانه اثر گذاشت.", "A provincial and legal order that shaped later states of Europe and the Mediterranean."),
    tx("بنیاد قسطنطنیه، که بیش از هزار سال پایتخت ماند.", "The foundation of Constantinople, a capital for more than a thousand years."),
  ],
  relations: [
    { entityId: "macedon-hellenistic", type: "conquered", note: tx("جذب تدریجی پادشاهی‌های هلنیستی؛ مصر بطلمیوسی در ۳۰ پ.م.", "Gradual absorption of the Hellenistic kingdoms; Ptolemaic Egypt in 30 BCE.") },
    { entityId: "ancient-egypt", type: "conquered", note: tx("مصر از ۳۰ پ.م استان روم شد.", "Egypt became a Roman province from 30 BCE.") },
    { entityId: "sasanian-empire", type: "rival", note: tx("چهار سده رقابت و جنگ بر سر میان‌رودان و ارمنستان.", "Four centuries of rivalry and war over Mesopotamia and Armenia.") },
    { entityId: "han-dynasty", type: "trade-contact", note: tx("بازرگانی غیرمستقیم ابریشم از راه واسطه‌ها.", "Indirect silk trade through intermediaries.") },
  ],
  uncertainty: [
    tx(
      "سال ۴۷۶ م را نباید «پایان امپراتوری روم» خواند؛ این سال تنها پایان دربار باختری است و حتی اهمیت آن نزد معاصران محل بحث تاریخ‌نگاران است.",
      "The year 476 CE should not be called 'the end of the Roman Empire': it marks only the end of the western court, and even its significance to contemporaries is debated by historians.",
    ),
    tx(
      "پوشش این اطلس در ۷۰۰ م پایان می‌یابد؛ تاریخ بعدیِ امپراتوری روم شرقی در آن بازنمایی نشده است.",
      "This atlas ends its coverage at 700 CE; the later history of the Eastern Roman Empire is not represented.",
    ),
  ],
  color: "#9a6fb0",
  sourceIds: ["br-roman-empire", "br-roman-timeline", "br-trajan", "br-constantine", "br-actium", "ir-byzantine-iranian", "met-roman-egypt", "met-rome-asia-trade"],
};
