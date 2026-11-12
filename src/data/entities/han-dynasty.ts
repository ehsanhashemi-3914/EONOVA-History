import type { Entity } from "../schema";
import { bce, ce, tx } from "../helpers";

export const hanDynasty: Entity = {
  id: "han-dynasty",
  slug: "han-dynasty",
  kind: "dynasty",
  kindNote: tx(
    "«هان» نام یک دودمان امپراتوری چین است: خاندان لیو و دولتی که در روزگار فرمانروایی آن خاندان برپا بود. خودِ تمدن چین بسیار کهن‌تر و دیرپاتر از این دودمان است.",
    "'Han' names a Chinese imperial dynasty: the Liu family and the state as it existed while that family ruled. Chinese civilization itself is far older and longer-lived than this dynasty.",
  ),
  name: tx("دودمان هان", "Han Dynasty"),
  altNames: { fa: ["امپراتوری هان", "هان غربی", "هان شرقی"], en: ["Han Empire", "Western Han", "Eastern Han"] },
  start: bce(
    206,
    "exact",
    tx(
      "سال بنیادگذاری به دست لیو بانگ. برخی آغاز را ۲۰۲ پ.م می‌دانند که او پس از پیروزی بر رقیبانش عنوان امپراتور گرفت.",
      "The year of foundation by Liu Bang. Some date the beginning to 202 BCE, when he took the imperial title after defeating his rivals.",
    ),
  ),
  end: ce(220, "exact", tx("واگذاری تخت از سوی شیان‌دی، واپسین امپراتور هان.", "Abdication of Xiandi, the last Han emperor.")),
  region: "east-asia",
  regionLabel: tx("چین، با گسترش به آسیای مرکزی، کره و ویتنام شمالی", "China, with expansion into Central Asia, Korea and northern Vietnam"),
  summary: tx(
    "دودمانی که چین را پس از فروپاشی دودمان چین (Qin) دوباره یکپارچه کرد و بیش از چهار سده، با یک وقفهٔ کوتاه، فرمان راند.",
    "The dynasty that reunited China after the fall of the Qin and ruled for more than four centuries, with one brief interruption.",
  ),
  overview: [
    tx(
      "پس از مرگ نخستین امپراتور چین در ۲۱۰ پ.م و جنگ داخلی پس از آن، لیو بانگ — که بعدها «گائوزو» خوانده شد — چین را دوباره یکپارچه کرد. دورهٔ نخست، با پایتختی چانگ‌آن، «هان غربی» یا «هان پیشین» نام دارد.",
      "After the death of the First Emperor in 210 BCE and the civil war that followed, Liu Bang — later known as Gaozu — reunited China. The first period, with its capital at Chang'an, is called the Western or Former Han.",
    ),
    tx(
      "امپراتور وو (وودی، ۱۴۱–۸۷ پ.م) اقتدار دولت را بسیار افزود، آیین کنفوسیوس را آیین رسمی دولت کرد و نفوذ چین را به آسیای مرکزی گسترش داد. سفرهای فرستاده‌اش جانگ چیان راه تبادل سفیران با دولت‌های آسیای مرکزی را گشود.",
      "Emperor Wu (Wudi, 141–87 BCE) greatly increased the authority of the state, made Confucianism the official doctrine and extended Chinese influence into Central Asia. The journeys of his envoy Zhang Qian opened the way to exchanges of envoys with Central Asian states.",
    ),
    tx(
      "وانگ مانگ در ۹ م قدرت را از خاندان لیو گرفت و دودمان کوتاه‌عمر «شین» را بنیاد نهاد. پس از کشته‌شدن او در ۲۳ م، لیو شیو دودمان هان را بازگرداند و پایتخت را به لویانگ برد؛ این دوره «هان شرقی» یا «هان پسین» (۲۵–۲۲۰ م) است. در ۲۲۰ م امپراتوری به سه پادشاهی تقسیم شد.",
      "In 9 CE Wang Mang took power from the Liu family and founded the short-lived Xin dynasty. After he was killed in 23 CE, Liu Xiu restored the Han and moved the capital to Luoyang; this period is the Eastern or Later Han (25–220 CE). In 220 CE the empire split into three kingdoms.",
    ),
  ],
  politicalStructure: tx(
    "امپراتوری متمرکز با دیوان‌سالاری گسترده. از روزگار وودی، آیین کنفوسیوس پایهٔ رسمی اندیشهٔ دولت شد.",
    "A centralized empire with an extensive bureaucracy. From Wudi's reign, Confucianism became the official basis of state ideology.",
  ),
  periods: [
    { id: "western-han", name: tx("هان غربی (پیشین)", "Western (Former) Han"), start: bce(206), end: ce(9), note: tx("پایتخت: چانگ‌آن.", "Capital at Chang'an.") },
    { id: "xin", name: tx("میان‌دورهٔ شین (وانگ مانگ)", "Xin interregnum (Wang Mang)"), start: ce(9), end: ce(23), note: tx("این دوره بخشی از دودمان هان نیست؛ وقفه‌ای میان دو نیمهٔ آن است.", "Not part of the Han dynasty: an interruption between its two halves.") },
    { id: "eastern-han", name: tx("هان شرقی (پسین)", "Eastern (Later) Han"), start: ce(25), end: ce(220), note: tx("پایتخت: لویانگ.", "Capital at Luoyang.") },
  ],
  capitals: [
    { placeId: "changan", note: tx("هان غربی", "Western Han") },
    { placeId: "luoyang", note: tx("هان شرقی", "Eastern Han") },
  ],
  achievements: [
    tx("یکپارچه‌سازی دوبارهٔ چین و پایه‌گذاری الگوی دیرپای دولت امپراتوری.", "Reuniting China and establishing a lasting model of imperial government."),
    tx("پذیرش آیین کنفوسیوس به‌عنوان آیین رسمی دولت در روزگار وودی.", "Adoption of Confucianism as the official state doctrine under Wudi."),
    tx("گشودن راه‌های ارتباط با آسیای مرکزی که بازرگانی ابریشم با باختر را ممکن ساخت.", "Opening routes to Central Asia that made the silk trade with the West possible."),
  ],
  relations: [
    { entityId: "roman-empire", type: "trade-contact", note: tx("پیوند بازرگانی غیرمستقیم: ابریشم چین از راه واسطه‌های آسیای مرکزی و ایران به روم می‌رسید.", "Indirect trade contact: Chinese silk reached Rome through Central Asian and Iranian intermediaries.") },
  ],
  uncertainty: [
    tx(
      "آغاز دودمان را ۲۰۶ یا ۲۰۲ پ.م می‌دانند؛ این اطلس ۲۰۶ پ.م را به کار می‌برد و اختلاف را یادآوری می‌کند.",
      "The dynasty's beginning is given as 206 or 202 BCE; this atlas uses 206 BCE and notes the difference.",
    ),
    tx(
      "سال‌های ۹ تا ۲۳ م (دودمان شین) بخشی از هان نیست، هرچند برای سادگی در بازهٔ کلی ۲۰۶ پ.م تا ۲۲۰ م جای می‌گیرد.",
      "The years 9–23 CE (the Xin dynasty) are not Han rule, although for simplicity they fall inside the overall span 206 BCE–220 CE.",
    ),
  ],
  color: "#c75f5f",
  sourceIds: ["br-han", "met-han", "br-gaozu", "br-wudi", "br-wang-mang", "br-zhang-qian", "met-rome-asia-trade"],
};
