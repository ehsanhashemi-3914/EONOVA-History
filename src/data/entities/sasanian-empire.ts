import type { Entity } from "../schema";
import { ce, tx } from "../helpers";

export const sasanianEmpire: Entity = {
  id: "sasanian-empire",
  slug: "sasanian-empire",
  kind: "empire",
  kindNote: tx(
    "یک دولت امپراتوری مشخص به فرمانروایی دودمان ساسانی؛ واپسین شاهنشاهی ایرانیِ پیش از اسلام.",
    "One specific imperial state ruled by the Sasanian dynasty: the last Iranian empire before Islam.",
  ),
  name: tx("شاهنشاهی ساسانی", "Sasanian Empire"),
  altNames: {
    fa: ["ساسانیان", "ایرانشهر", "امپراتوری ساسانی"],
    en: ["Sassanid Empire", "Sasanid Empire", "Ērānshahr", "Neo-Persian Empire"],
  },
  start: ce(224, "exact", tx("پیروزی اردشیر یکم بر اردوان، شاه اشکانی، در نبرد هرمزدگان.", "Ardashir I's victory over the Parthian king Ardavan at the Battle of Hormozdgan.")),
  end: ce(
    651,
    "exact",
    tx(
      "کشته‌شدن یزدگرد سوم. برخی منابع پایان فرمانروایی ساسانی را ۶۵۰ م می‌نویسند.",
      "Murder of Yazdegerd III. Some sources give the end of Sasanian rule as 650 CE.",
    ),
  ),
  region: "iranian-plateau",
  regionLabel: tx("فلات ایران و میان‌رودان، از فرات تا آسیای مرکزی", "The Iranian plateau and Mesopotamia, from the Euphrates to Central Asia"),
  summary: tx(
    "واپسین دودمان ایرانی که پیش از اسلام بر بخش بزرگی از باختر آسیا چیره بود و چهار سده رقیب روم و بیزانس ماند.",
    "The last Persian dynasty to hold hegemony over much of Western Asia before Islam, and for four centuries the rival of Rome and Byzantium.",
  ),
  overview: [
    tx(
      "دولت اشکانی در آغاز سدهٔ سوم با کشمکش داخلی، بیماری همه‌گیر و جنگ‌های پیاپی با روم سست شده بود. در همین هنگام خاندانی پارسی در فارس نیرو گرفت. اردشیر یکم در ۲۲۴ م اردوان را در هرمزدگان شکست داد، سپس تیسفون را گرفت و در ۲۲۶ م در آنجا تاج بر سر نهاد.",
      "At the start of the third century the Parthian state had been weakened by civil strife, epidemic disease and repeated wars with Rome. At the same time a Persian family was gaining strength in Fars. Ardashir I defeated Ardavan at Hormozdgan in 224 CE, then took Ctesiphon and was crowned there in 226 CE.",
    ),
    tx(
      "پسرش شاپور یکم عنوان «شاهنشاه ایران و انیران» را به کار برد که لقب رسمی شاهان بعدی شد. او در ۲۶۰ م در نزدیکی ادسا امپراتور روم، والرین، را شکست داد و اسیر کرد و گزارش پیروزی‌هایش را در کتیبهٔ سه‌زبانهٔ کعبهٔ زرتشت و نقش‌برجسته‌های فارس به یادگار گذاشت.",
      "His son Shapur I used the title 'King of Kings of Ērān and Anērān', which became the standard style of later kings. In 260 CE, near Edessa, he defeated and captured the Roman emperor Valerian, and recorded his victories in the trilingual inscription on the Kaʿba-ye Zardosht and in the rock reliefs of Fars.",
    ),
    tx(
      "خسرو یکم انوشیروان (۵۳۱–۵۷۹ م) با اصلاحات مالی، اداری و نظامی دوره‌ای درخشان را آغاز کرد و در سنت ایرانی و اسلامی نماد «شاه دادگر» شد. پس از جنگ‌های فرسایندهٔ خسرو دوم با بیزانس، دولت دچار آشفتگی شد. سپاهیان عرب مسلمان در میانهٔ دههٔ ۶۳۰ م در قادسیه پیروز شدند، تیسفون در ۶۳۷ م گشوده شد و با کشته‌شدن یزدگرد سوم در ۶۵۱ م در نزدیکی مرو، دودمان پایان یافت.",
      "Khosrow I Anushirvan (531–579 CE) opened a brilliant era through fiscal, administrative and military reforms and became the model of the 'just king' in Iranian and Islamic tradition. After Khosrow II's exhausting wars with Byzantium the state fell into disorder. Arab Muslim armies won at al-Qadisiyyah in the mid-630s, Ctesiphon fell in 637 CE, and the dynasty ended when Yazdegerd III was killed near Merv in 651 CE.",
    ),
  ],
  politicalStructure: tx(
    "پادشاهی به رهبری «شاهنشاه» با پایتخت و شهر تاج‌گذاری در تیسفون. دین زرتشتی پشتیبانی دولت را داشت. اصلاحات خسرو یکم نظام مالیات و سپاه را دگرگون کرد. دیوان‌سالاری و اندیشهٔ شاهی ساسانی بعدها الگوی دولت‌های عباسی، عثمانی و صفوی شد.",
    "A monarchy led by the 'king of kings', with its capital and coronation city at Ctesiphon. Zoroastrianism enjoyed state support. Khosrow I's reforms reshaped taxation and the army. Sasanian bureaucracy and royal ideology were later imitated by the Abbasid, Ottoman and Safavid states.",
  ),
  periods: [
    { id: "foundation", name: tx("بنیادگذاری: اردشیر یکم و شاپور یکم", "Foundation: Ardashir I and Shapur I"), start: ce(224), end: ce(270) },
    { id: "middle", name: tx("دورهٔ میانه", "Middle period"), start: ce(270), end: ce(531), note: tx("شامل پادشاهی بلند شاپور دوم.", "Includes the long reign of Shapur II.") },
    { id: "khosrow", name: tx("خسرو یکم و جانشینانش", "Khosrow I and his successors"), start: ce(531), end: ce(628), note: tx("اصلاحات خسرو یکم؛ جنگ‌های بزرگ با بیزانس.", "Reforms of Khosrow I; great wars with Byzantium.") },
    { id: "collapse", name: tx("آشفتگی و فروپاشی", "Disorder and collapse"), start: ce(628), end: ce(651) },
  ],
  capitals: [
    { placeId: "ctesiphon", note: tx("پایتخت و شهر تاج‌گذاری", "Capital and coronation city") },
    { placeId: "firuzabad", note: tx("شهر اردشیر یکم در فارس", "Ardashir I's city in Fars") },
    { placeId: "bishapur", note: tx("شهر شاپور یکم", "City of Shapur I") },
  ],
  achievements: [
    tx("نقش‌برجسته‌های صخره‌ای فارس که بیشترشان در ۱۷۵ سال نخست شاهنشاهی تراشیده شد.", "The rock reliefs of Fars, most of them carved during the first 175 years of the empire."),
    tx("هنر و نقش‌مایه‌هایی که بر هنر اروپای سده‌های میانه، آسیای مرکزی و چین اثر گذاشت.", "Imagery and style that influenced the art of early medieval Europe, western Central Asia and China."),
    tx("اصلاحات مالی و اداری خسرو یکم و پشتیبانی او از دانش، از جمله گردآوری زیج شاهی.", "The fiscal and administrative reforms of Khosrow I and his patronage of learning, including the astronomical Royal Canon."),
    tx("شهرسازی آغاز دوران ساسانی در فیروزآباد و بیشاپور.", "Early Sasanian city planning at Firuzabad and Bishapur."),
  ],
  relations: [
    { entityId: "roman-empire", type: "rival", note: tx("رقابت دیرپا با روم و سپس بیزانس، از جمله اسارت والرین در ۲۶۰ م و «صلح جاودان» خسرو یکم با یوستینیان.", "Long rivalry with Rome and then Byzantium, including the capture of Valerian in 260 CE and Khosrow I's 'Endless Peace' with Justinian.") },
    { entityId: "achaemenid-empire", type: "predecessor", note: tx("پیشینهٔ غیرمستقیم: هر دو دودمان از فارس برخاستند، با فاصله‌ای بیش از پنج سده.", "An indirect predecessor: both dynasties arose in Fars, more than five centuries apart.") },
  ],
  uncertainty: [
    tx(
      "تاریخ آغاز پادشاهی شاپور یکم محل بحث است (۲۳۹، ۲۴۰ یا ۲۴۱ م).",
      "The date of Shapur I's accession is debated (239, 240 or 241 CE).",
    ),
    tx(
      "گزارش‌های فتح ایران به دست عرب‌ها اغلب ناسازگارند و تاریخ دقیق حتی رویدادهای بزرگ مانند نبرد قادسیه (۶۳۶ یا ۶۳۷ م، یا به پیشنهادی دیگر ۶۳۴–۶۳۵ م) قطعی نیست.",
      "Accounts of the Arab conquest of Iran are often contradictory, and precise dates even for major events such as the Battle of al-Qadisiyyah (636 or 637 CE, or by another proposal 634–635 CE) are not certain.",
    ),
    tx(
      "محدودهٔ نقشه بازسازی تقریبی است؛ مرزهای خاوری ساسانیان در آسیای مرکزی و مرز باختری در میان‌رودان و ارمنستان بارها جابه‌جا شد.",
      "The map outline is an approximate reconstruction; the Sasanian eastern frontier in Central Asia and the western frontier in Mesopotamia and Armenia shifted repeatedly.",
    ),
  ],
  color: "#4fa3c7",
  sourceIds: ["ir-sasanian-dynasty", "ir-ardashir-i", "ir-hormozdgan", "ir-shapur-i", "ir-khosrow-i", "ir-ctesiphon", "ir-byzantine-iranian", "ir-arab-conquest", "ir-qadesiya", "ir-chronology", "met-sasanian", "unesco-sassanid-fars"],
};
