import type { Entity } from "../schema";
import { bce, tx } from "../helpers";

export const neoAssyrianEmpire: Entity = {
  id: "neo-assyrian-empire",
  slug: "neo-assyrian-empire",
  kind: "empire",
  kindNote: tx(
    "«امپراتوری آشور نو» واپسین و گسترده‌ترین مرحلهٔ دولت آشور است؛ یک دولت امپراتوری مشخص، نه کل تمدن آشوری که پیشینه‌ای بسیار کهن‌تر دارد.",
    "The Neo-Assyrian Empire is the last and largest phase of the Assyrian state: one specific imperial state, not Assyrian civilization as a whole, which is far older.",
  ),
  name: tx("امپراتوری آشور نو", "Neo-Assyrian Empire"),
  altNames: { fa: ["آشور نو", "امپراتوری آشور"], en: ["Assyrian Empire", "Late Assyrian Empire"] },
  start: bce(
    911,
    "approximate",
    tx(
      "آغاز قراردادی. برخی منابع مرحلهٔ امپراتوری را تنها از حدود ۷۴۶ پ.م (تیگلت‌پیلسر سوم) می‌شمارند.",
      "A conventional starting point. Some reference works count the imperial phase only from about 746 BCE (Tiglath-pileser III).",
    ),
  ),
  end: bce(
    609,
    "approximate",
    tx(
      "نینوا در ۶۱۲ پ.م سقوط کرد؛ واپسین ایستادگی آشوریان حدود سه سال بعد پایان یافت.",
      "Nineveh fell in 612 BCE; the last Assyrian resistance ended about three years later.",
    ),
  ),
  region: "mesopotamia",
  regionLabel: tx("میان‌رودان شمالی، با گسترش به شام، آناتولی خاوری و مصر", "Northern Mesopotamia, expanding into the Levant, eastern Anatolia and Egypt"),
  summary: tx(
    "دولتی نظامی و دیوانی در کرانهٔ دجله که در سده‌های هشتم و هفتم پ.م بر بخش بزرگی از خاور نزدیک فرمان راند.",
    "A military and bureaucratic state on the Tigris that dominated much of the Near East in the eighth and seventh centuries BCE.",
  ),
  overview: [
    tx(
      "آشور از شهر آشور در کرانهٔ دجله برخاست. در هزارهٔ یکم پ.م شاهان آن با لشکرکشی‌های پیاپی، قلمرو خود را از میان‌رودان به شام و سپس تا مصر گسترش دادند. تیگلت‌پیلسر سوم (۷۴۵–۷۲۷ پ.م) استان‌ها را از نو سازمان داد تا قدرت فرمانداران محلی کاهش یابد.",
      "Assyria grew from the city of Ashur on the Tigris. In the first millennium BCE its kings, through repeated campaigns, extended their rule from Mesopotamia into the Levant and eventually to Egypt. Tiglath-pileser III (745–727 BCE) reorganized the provinces to reduce the power of local governors.",
    ),
    tx(
      "از بزرگ‌ترین شاهان این دوره، سارگون دوم، سناخریب و آشوربانیپال بودند. آشوربانیپال (۶۶۸–۶۲۷ پ.م) در نینوا کتابخانه‌ای از لوح‌های میخی گرد آورد. پس از او جنگ داخلی دولت را سست کرد و ائتلاف بابلیان و مادها نینوا را در ۶۱۲ پ.م ویران کرد.",
      "Among its greatest kings were Sargon II, Sennacherib and Ashurbanipal. Ashurbanipal (668–627 BCE) assembled a library of cuneiform tablets at Nineveh. After him civil war weakened the state, and a coalition of Babylonians and Medes destroyed Nineveh in 612 BCE.",
    ),
  ],
  politicalStructure: tx(
    "پادشاهی که شاه در آن نمایندهٔ خدای آشور شمرده می‌شد. قلمرو به استان‌هایی زیر نظر فرمانداران منصوب شاه تقسیم بود و دولت‌های دست‌نشانده باج می‌پرداختند. تیگلت‌پیلسر سوم استان‌ها را کوچک‌تر و وابسته‌تر به مرکز کرد.",
    "A monarchy in which the king was regarded as the representative of the god Ashur. The realm was divided into provinces under royally appointed governors, while vassal states paid tribute. Tiglath-pileser III made the provinces smaller and more dependent on the centre.",
  ),
  periods: [
    { id: "revival", name: tx("بازخیزی و گسترش", "Revival and expansion"), start: bce(911, "approximate"), end: bce(745) },
    { id: "imperial", name: tx("اوج امپراتوری", "Imperial zenith"), start: bce(745), end: bce(627, "approximate"), note: tx("از تیگلت‌پیلسر سوم تا آشوربانیپال.", "From Tiglath-pileser III to Ashurbanipal.") },
    { id: "collapse", name: tx("فروپاشی", "Collapse"), start: bce(627, "approximate"), end: bce(609, "approximate") },
  ],
  capitals: [
    { placeId: "ashur", note: tx("پایتخت کهن و مرکز دینی", "Ancient capital and religious centre") },
    { placeId: "nineveh", note: tx("پایتخت در سدهٔ هفتم پ.م", "Capital in the seventh century BCE") },
  ],
  achievements: [
    tx("کتابخانهٔ آشوربانیپال در نینوا: نخستین کتابخانهٔ نظام‌مند شناخته‌شده در خاور نزدیک باستان.", "The Library of Ashurbanipal at Nineveh: the first systematically organized library known in the ancient Middle East."),
    tx("نظام استانی با فرمانداران منصوب که الگوی امپراتوری‌های بعدی منطقه شد.", "A provincial system with appointed governors that set a pattern for later empires of the region."),
    tx("سالنامه‌های شاهی بر لوح و استوانهٔ گلی که رویدادهای هر پادشاهی را ثبت می‌کرد.", "Royal annals on clay tablets and cylinders recording the events of each reign."),
  ],
  relations: [
    { entityId: "ancient-egypt", type: "rival", note: tx("لشکرکشی به مصر و سرکوب شورش آن در روزگار آشوربانیپال.", "Campaigns into Egypt and suppression of revolt there under Ashurbanipal.") },
    { entityId: "achaemenid-empire", type: "successor", note: tx("جانشینی غیرمستقیم: سرزمین‌های آشور نخست میان ماد و بابل تقسیم شد و سپس به هخامنشیان رسید.", "An indirect succession: Assyria's lands first passed to the Medes and Babylonians, and later to the Achaemenids.") },
  ],
  uncertainty: [
    tx(
      "تاریخ آغاز «آشور نو» قراردادی است و بسته به تعریف، ۹۱۱ یا حدود ۷۴۶ پ.م دانسته می‌شود. تاریخ پایان نیز ۶۱۲ (سقوط نینوا) یا ۶۰۹ پ.م ذکر می‌شود.",
      "The starting date of the 'Neo-Assyrian' period is a convention, given as 911 or about 746 BCE depending on definition. The end is likewise given as 612 (fall of Nineveh) or 609 BCE.",
    ),
    tx(
      "نقشهٔ این اطلس تنها هستهٔ سرزمینی آشور را نشان می‌دهد، نه گسترهٔ کامل امپراتوری در اوج آن؛ برای آن گستره دادهٔ جغرافیایی معتبری در اختیار نبود.",
      "The atlas map shows only the Assyrian heartland, not the full extent of the empire at its height; no reliable geographic data for that extent was available.",
    ),
  ],
  color: "#b86a52",
  sourceIds: ["br-assyria", "br-neo-assyrian", "br-tiglath-pileser-iii", "br-ashurbanipal", "br-nineveh", "unesco-ashur", "bm-ashurbanipal-annals"],
};
