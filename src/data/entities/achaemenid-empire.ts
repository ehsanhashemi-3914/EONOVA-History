import type { Entity } from "../schema";
import { bce, tx } from "../helpers";

export const achaemenidEmpire: Entity = {
  id: "achaemenid-empire",
  slug: "achaemenid-empire",
  kind: "empire",
  kindNote: tx(
    "یک دولت امپراتوری مشخص که دودمان هخامنشی بر آن فرمان می‌راند. «هخامنشی» نام دودمان است و «شاهنشاهی هخامنشی» نام دولتی که آن دودمان ساخت.",
    "One specific imperial state ruled by the Achaemenid dynasty. 'Achaemenid' names the ruling house; the 'Achaemenid Empire' is the state that house built.",
  ),
  name: tx("شاهنشاهی هخامنشی", "Achaemenid Empire"),
  altNames: {
    fa: ["هخامنشیان", "امپراتوری هخامنشی", "شاهنشاهی پارس"],
    en: ["Achaemenid Persian Empire", "First Persian Empire", "Achaemenian Empire"],
  },
  start: bce(
    550,
    "approximate",
    tx(
      "سال پیروزی کوروش دوم بر آستیاگ، شاه ماد. این تاریخ بر پایهٔ رویدادنامهٔ نبونید است و برخی پژوهشگران آن را قطعی نمی‌دانند.",
      "The year of Cyrus II's victory over Astyages of Media. The date rests on the Nabonidus Chronicle, and some scholars do not regard it as certain.",
    ),
  ),
  end: bce(330, "exact", tx("کشته‌شدن داریوش سوم در تابستان ۳۳۰ پ.م.", "Death of Darius III in the summer of 330 BCE.")),
  region: "iranian-plateau",
  regionLabel: tx("از آناتولی و مصر تا آسیای مرکزی و درهٔ سند", "From Anatolia and Egypt to Central Asia and the Indus valley"),
  summary: tx(
    "بزرگ‌ترین امپراتوری جهان باستان تا آن روزگار؛ دولتی چندملیتی که کوروش بنیاد نهاد و داریوش سازمان داد.",
    "The largest empire the ancient world had yet seen: a multinational state founded by Cyrus and organized by Darius.",
  ),
  overview: [
    tx(
      "شکل‌گیری این شاهنشاهی با پیروزی کوروش دوم، شاه پارسیِ انشان، بر آستیاگ مادی آغاز شد. کوروش سپس لیدیه را در آناتولی (۵۴۷ پ.م) و بابل را (۵۳۹ پ.م) گشود. پسرش کمبوجیه مصر را در ۵۲۵ پ.م به قلمرو افزود.",
      "The empire's formation began when Cyrus II, the Persian king of Anshan, defeated Astyages of Media. Cyrus then conquered Lydia in Anatolia (547 BCE) and Babylon (539 BCE). His son Cambyses added Egypt in 525 BCE.",
    ),
    tx(
      "داریوش یکم (۵۲۲–۴۸۶ پ.م) که از شاخه‌ای دیگر از خاندان بود، پس از بحران جانشینی به قدرت رسید و مرزها را تا درهٔ سند و تراکیه گسترش داد. او نظام ساتراپی، مالیات منظم و سکهٔ زرین «دَریک» را سامان داد و ساخت تخت جمشید را حدود ۵۱۸ پ.م آغاز کرد.",
      "Darius I (522–486 BCE), from a collateral branch of the family, took power after a succession crisis and extended the frontiers to the Indus valley and Thrace. He organized the satrapal system, regular taxation and the gold 'daric' coinage, and began building Persepolis in about 518 BCE.",
    ),
    tx(
      "شاهنشاهی بیش از دو سده پایدار ماند. اسکندر مقدونی از ۳۳۴ پ.م به آن یورش برد، در ۳۳۱ پ.م در گوگمل پیروز شد، در ۳۳۰ پ.م تخت جمشید را به آتش کشید و با مرگ داریوش سوم در همان سال، فرمانروایی هخامنشیان پایان یافت.",
      "The empire lasted more than two centuries. Alexander of Macedon invaded from 334 BCE, won at Gaugamela in 331 BCE and burned Persepolis in 330 BCE; with the death of Darius III in the same year, Achaemenid rule came to an end.",
    ),
  ],
  politicalStructure: tx(
    "دولتی چندملیتی به رهبری پارسیان که مادها در آن جایگاهی ویژه داشتند. «شاهِ شاهان» در رأس بود و قلمرو به ساتراپی‌هایی زیر نظر ساتراپ‌ها تقسیم می‌شد. دولت تا حد زیادی بر کارگزاران غیرپارسی و نهادهای محلیِ موجود تکیه داشت.",
    "A multinational state under Persian leadership in which the Medes held a special position. The 'king of kings' stood at its head, and the realm was divided into satrapies governed by satraps. The state relied heavily on non-Persian officials and on existing local institutions.",
  ),
  periods: [
    { id: "foundation", name: tx("بنیادگذاری: کوروش و کمبوجیه", "Foundation: Cyrus and Cambyses"), start: bce(550, "approximate"), end: bce(522) },
    { id: "consolidation", name: tx("سازمان‌دهی: داریوش یکم و خشایارشا", "Consolidation: Darius I and Xerxes"), start: bce(522), end: bce(465), note: tx("بیشترین گسترهٔ سرزمینی.", "Greatest territorial extent.") },
    { id: "later-empire", name: tx("شاهنشاهی پسین", "Later empire"), start: bce(465), end: bce(330), note: tx("مصر از ۴۰۴ تا ۳۴۳ پ.م از قلمرو جدا بود.", "Egypt was outside the empire from 404 to 343 BCE.") },
  ],
  capitals: [
    { placeId: "pasargadae", note: tx("پایتخت و آرامگاه کوروش", "Capital and burial place of Cyrus") },
    { placeId: "persepolis", note: tx("مرکز دودمانی و تشریفاتی", "Dynastic and ceremonial centre") },
    { placeId: "susa", note: tx("مرکز اداری", "Administrative centre") },
    { placeId: "ecbatana", note: tx("اقامتگاه تابستانی", "Summer residence") },
  ],
  achievements: [
    tx("نظام ساتراپی: ادارهٔ سرزمینی پهناور از راه استان‌هایی با فرمانداران پاسخ‌گو به شاه.", "The satrapal system: governing a vast territory through provinces whose governors answered to the king."),
    tx("ضرب سکهٔ زرین دریک و یکسان‌سازی یکاهای وزن فلز برای دادوستد در روزگار داریوش.", "The gold daric coinage and standardized units of metal for exchange, introduced under Darius."),
    tx("مجموعه‌های پاسارگاد و تخت جمشید و آرامگاه‌های نقش رستم.", "The complexes of Pasargadae and Persepolis and the royal tombs at Naqsh-e Rostam."),
    tx("استوانهٔ کوروش: سند بنیادگذاری بابلی که تصرف بابل و بازگرداندن تندیس خدایان به پرستشگاه‌ها را گزارش می‌کند.", "The Cyrus Cylinder: a Babylonian foundation text reporting the capture of Babylon and the return of divine statues to their temples."),
  ],
  relations: [
    { entityId: "neo-assyrian-empire", type: "predecessor", note: tx("پیشینهٔ غیرمستقیم: هخامنشیان وارث سرزمین‌ها و برخی شیوه‌های اداری آشور و بابل شدند.", "An indirect predecessor: the Achaemenids inherited Assyrian and Babylonian lands and some administrative practices.") },
    { entityId: "ancient-egypt", type: "conquered", note: tx("فتح مصر به دست کمبوجیه در ۵۲۵ پ.م.", "Conquest of Egypt by Cambyses in 525 BCE.") },
    { entityId: "macedon-hellenistic", type: "conquered-by", note: tx("لشکرکشی اسکندر، ۳۳۴ تا ۳۳۰ پ.م.", "Alexander's campaign, 334–330 BCE.") },
    { entityId: "sasanian-empire", type: "successor", note: tx("جانشین غیرمستقیم: ساسانیان بیش از پنج سده بعد از همان سرزمین پارس برخاستند.", "An indirect successor: the Sasanians rose from the same land of Persis more than five centuries later.") },
  ],
  uncertainty: [
    tx(
      "تاریخ دقیق شکست آستیاگ (معمولاً ۵۵۰ پ.م) به دلیل شکستگی رویدادنامهٔ بابلی کاملاً قطعی نیست.",
      "The exact date of Astyages' defeat (usually given as 550 BCE) is not fully certain because the Babylonian chronicle is damaged.",
    ),
    tx(
      "توصیف امروزیِ استوانهٔ کوروش به‌عنوان «منشور حقوق بشر» برداشتی نو است؛ متن در اصل یک کتیبهٔ بنیادگذاری بابلی به سنت شاهان میان‌رودان است.",
      "The modern description of the Cyrus Cylinder as a 'charter of human rights' is a recent interpretation; the text is in origin a Babylonian foundation inscription in the tradition of Mesopotamian kings.",
    ),
    tx(
      "محدودهٔ نقشه بازسازی تقریبی است. مرزهای هخامنشی، به‌ویژه در آسیای مرکزی، عربستان و کرانه‌های دریای سیاه، به‌دقت شناخته نیست.",
      "The map outline is an approximate reconstruction. Achaemenid frontiers — especially in Central Asia, Arabia and around the Black Sea — are not precisely known.",
    ),
  ],
  color: "#5fa39a",
  sourceIds: ["ir-achaemenid-dynasty", "ir-achaemenid-empire", "ir-cyrus-ii", "ir-darius-i", "ir-persepolis", "ir-pasargadae", "ir-alexander", "met-achaemenid", "bm-cyrus-cylinder", "unesco-persepolis", "unesco-pasargadae"],
};
