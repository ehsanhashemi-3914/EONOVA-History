import type { Entity } from "../schema";
import { bce, tx } from "../helpers";

export const macedonHellenistic: Entity = {
  id: "macedon-hellenistic",
  slug: "macedonian-empire-and-hellenistic-world",
  kind: "empire",
  kindNote: tx(
    "این پرونده دو چیز پیوسته را در بر می‌گیرد: امپراتوری کوتاه‌عمر اسکندر (یک دولت واحد تا ۳۲۳ پ.م) و سپس «جهان هلنیستی» که دیگر یک دولت نبود، بلکه چند پادشاهی جانشینِ رقیب بود.",
    "This profile covers two connected things: Alexander's short-lived empire (a single state until 323 BCE) and then the 'Hellenistic world', which was no longer one state but several rival successor kingdoms.",
  ),
  name: tx("امپراتوری مقدونی و جهان هلنیستی", "Macedonian Empire and the Hellenistic World"),
  altNames: {
    fa: ["امپراتوری اسکندر", "دولت‌های هلنیستی", "سلوکیان", "بطلمیوسیان", "دیادوخوی"],
    en: ["Empire of Alexander", "Hellenistic kingdoms", "Seleucid Empire", "Ptolemaic Kingdom", "Diadochi"],
  },
  start: bce(336, "exact", tx("بر تخت نشستن اسکندر سوم در مقدونیه.", "Accession of Alexander III in Macedon.")),
  end: bce(
    30,
    "exact",
    tx(
      "پایان پادشاهی بطلمیوسی، واپسین دولت بزرگ هلنیستی. پایان قراردادی این دوره را نبرد آکتیوم (۳۱ پ.م) نیز می‌دانند.",
      "End of the Ptolemaic kingdom, the last major Hellenistic state. The conventional end of the period is also given as the Battle of Actium (31 BCE).",
    ),
  ),
  region: "mediterranean",
  regionLabel: tx("از یونان و مصر تا آسیای مرکزی و مرزهای هند", "From Greece and Egypt to Central Asia and the borders of India"),
  summary: tx(
    "فتوحات اسکندر شاهنشاهی هخامنشی را برانداخت؛ پس از مرگ او سردارانش قلمرو را میان پادشاهی‌های سلوکی، بطلمیوسی و آنتیگونی تقسیم کردند.",
    "Alexander's conquests overthrew the Achaemenid Empire; after his death his generals divided the realm among the Seleucid, Ptolemaic and Antigonid kingdoms.",
  ),
  overview: [
    tx(
      "اسکندر سوم در ۳۳۶ پ.م پس از کشته‌شدن پدرش فیلیپ دوم به شاهی مقدونیه رسید. لشکرکشی او به آسیا از ۳۳۴ تا ۳۲۳ پ.م، قلمرو هخامنشی را از آناتولی و مصر تا درهٔ سند زیر فرمان او آورد. او در ژوئن ۳۲۳ پ.م در بابل درگذشت و جانشین نیرومندی نداشت.",
      "Alexander III became king of Macedon in 336 BCE after the assassination of his father Philip II. His campaign in Asia, from 334 to 323 BCE, brought the Achaemenid realm from Anatolia and Egypt to the Indus valley under his rule. He died in Babylon in June 323 BCE without a strong successor.",
    ),
    tx(
      "سرداران او — «دیادوخوی» یا جانشینان — دهه‌ها بر سر میراثش جنگیدند. نبرد ایپسوس در ۳۰۱ پ.م نقطهٔ عطفی بود و این جنگ‌ها تا ۲۸۱ پ.م ادامه یافت. از دل آن سه دودمان بزرگ پدید آمد: سلوکیان در آسیا، بطلمیوسیان در مصر و آنتیگونیان در مقدونیه.",
      "His generals — the Diadochi, or Successors — fought over his legacy for decades. The Battle of Ipsos in 301 BCE was a turning point, and the wars continued until 281 BCE. Three great dynasties emerged: the Seleucids in Asia, the Ptolemies in Egypt and the Antigonids in Macedon.",
    ),
    tx(
      "در این دوره زبان و هنر یونانی با سنت‌های خاور نزدیک درآمیخت. دولت‌های هلنیستی به‌تدریج به روم و در خاور به اشکانیان واگذار شدند؛ پادشاهی بطلمیوسی با مرگ کلئوپاترای هفتم در ۳۰ پ.م پایان یافت.",
      "In this period Greek language and art merged with Near Eastern traditions. The Hellenistic states gradually gave way to Rome and, in the east, to the Parthians; the Ptolemaic kingdom ended with the death of Cleopatra VII in 30 BCE.",
    ),
  ],
  politicalStructure: tx(
    "در روزگار اسکندر: پادشاهی شخصی که ساختار ساتراپی هخامنشی را تا حد زیادی نگه داشت. پس از او: پادشاهی‌های دودمانیِ جدا از هم که شاهانشان مقدونی‌تبار بودند و بر جمعیت‌های گوناگون بومی فرمان می‌راندند.",
    "Under Alexander: a personal monarchy that largely kept the Achaemenid satrapal structure. After him: separate dynastic kingdoms whose kings were of Macedonian descent and ruled over diverse local populations.",
  ),
  periods: [
    { id: "alexander", name: tx("امپراتوری اسکندر", "Empire of Alexander"), start: bce(336), end: bce(323), note: tx("یک دولت واحد.", "A single state.") },
    { id: "diadochi", name: tx("جنگ‌های جانشینان", "Wars of the Successors"), start: bce(323), end: bce(281) },
    { id: "kingdoms", name: tx("پادشاهی‌های هلنیستی", "Hellenistic kingdoms"), start: bce(281), end: bce(30), note: tx("چند دولت رقیب: سلوکی، بطلمیوسی، آنتیگونی و دیگران.", "Several rival states: Seleucid, Ptolemaic, Antigonid and others.") },
  ],
  capitals: [
    { placeId: "pella", note: tx("پایتخت مقدونیه", "Capital of Macedon") },
    { placeId: "babylon", note: tx("مرکز عملی فرمانروایی اسکندر در پایان عمر", "Alexander's effective seat at the end of his life") },
    { placeId: "alexandria", note: tx("پایتخت بطلمیوسیان", "Ptolemaic capital") },
    { placeId: "antioch", note: tx("پایتخت باختری سلوکیان", "Western Seleucid capital") },
  ],
  achievements: [
    tx("گسترش زبان یونانی به‌عنوان زبان مشترک از مدیترانه تا آسیای مرکزی.", "The spread of Greek as a common language from the Mediterranean to Central Asia."),
    tx("بنیاد شهرهای تازه مانند اسکندریه و انطاکیه.", "The foundation of new cities such as Alexandria and Antioch."),
    tx("هنری که از آمیزش سنت‌های یونانی و خاور نزدیک پدید آمد.", "An art born from the fusion of Greek and Near Eastern traditions."),
  ],
  relations: [
    { entityId: "achaemenid-empire", type: "conquered", note: tx("اسکندر شاهنشاهی هخامنشی را برانداخت.", "Alexander overthrew the Achaemenid Empire.") },
    { entityId: "ancient-egypt", type: "conquered", note: tx("دودمان بطلمیوسی تا ۳۰ پ.م بر مصر فرمان راند.", "The Ptolemaic dynasty ruled Egypt until 30 BCE.") },
    { entityId: "maurya-empire", type: "rival", note: tx("پیشروی سلوکوس یکم به سوی هند را چندراگوپتا متوقف کرد؛ سلوکوس در برابر ۵۰۰ فیل سرزمین واگذار کرد.", "Seleucus I's advance toward India was halted by Chandragupta; Seleucus ceded territory in exchange for 500 elephants.") },
    { entityId: "roman-empire", type: "conquered-by", note: tx("دولت‌های هلنیستی به‌تدریج به روم پیوستند؛ مصر در ۳۰ پ.م.", "The Hellenistic states were gradually absorbed by Rome; Egypt in 30 BCE.") },
  ],
  uncertainty: [
    tx(
      "پس از ۳۲۳ پ.م «جهان هلنیستی» یک دولت نیست. محدوده‌های نقشه برای هر پادشاهی جداگانه برچسب خورده‌اند و نباید آن‌ها را یک قلمرو واحد پنداشت.",
      "After 323 BCE the 'Hellenistic world' is not one state. Map outlines are labelled per kingdom and should not be read as a single realm.",
    ),
    tx(
      "گسترهٔ واقعی کنترل سلوکیان در خاور ایران و آسیای مرکزی در گذر زمان بسیار دگرگون شد و منابع بازمانده بیشتر از دید باختری نوشته شده‌اند.",
      "The real extent of Seleucid control in eastern Iran and Central Asia changed greatly over time, and the surviving sources are mostly written from a western perspective.",
    ),
  ],
  color: "#7c93c4",
  sourceIds: ["br-alexander", "ir-alexander", "br-hellenistic-age", "met-hellenistic", "br-ipsos", "br-seleucus-i", "ir-seleucid-empire", "met-ptolemaic"],
};
