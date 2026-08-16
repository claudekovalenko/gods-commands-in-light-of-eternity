// Interface languages, Bible translations, and reference localisation.
//
// Adding a language: add an entry to LANGS and UI, add an `ar`-style key to every
// label/sublabel/summary in data.js, and list its translations in TRANSLATIONS.

const LANGS = [
  { id: 'en', name: 'English', dir: 'ltr' },
  { id: 'ar', name: 'العربية', dir: 'rtl' },
];

// Where real Scripture text is fetched from when it is not bundled. The endpoint
// shape comes from the official getBible client: /{translation}/{book}/{chapter}.json
// Overridable so tests can point it at a local fixture.
let SCRIPTURE_API = 'https://api.getbible.net/v2';

// Bible translations offered per interface language. `id` keys verses[].text in data.js.
// `source` is that translation's id at SCRIPTURE_API; a translation without one has no
// freely available text and falls back to the ESV, labelled as the ESV.
const TRANSLATIONS = {
  en: [
    { id: 'esv', name: 'ESV', abbr: '', full: 'English Standard Version (bundled excerpts)' },
    { id: 'kjv', name: 'KJV', abbr: '', source: 'kjv', full: 'King James Version — public domain, loaded from the published text' },
  ],
  ar: [
    { id: 'svd', name: 'فان دايك', abbr: 'SVD', source: 'arabicsv',
      full: 'Smith & Van Dyck (Arabic, 1865) — public domain' },
    // Ketab El Hayat is © Biblica and is in no free source, so it borrows Van Dyck's
    // Arabic for the same verse rather than dropping the reader back into English.
    { id: 'keh', name: 'كتاب الحياة', abbr: 'KEH', fallback: 'svd',
      full: 'Ketab El Hayat — Word of Life (New Arabic Version), © Biblica — needs a licensed source' },
  ],
};

// Protestant canon order, used to build the chapter URL.
const BOOK_NUMBERS = {
  'Genesis':1,'Exodus':2,'Leviticus':3,'Numbers':4,'Deuteronomy':5,'Joshua':6,'Judges':7,
  'Ruth':8,'1 Samuel':9,'2 Samuel':10,'1 Kings':11,'2 Kings':12,'1 Chronicles':13,
  '2 Chronicles':14,'Ezra':15,'Nehemiah':16,'Esther':17,'Job':18,'Psalms':19,'Proverbs':20,
  'Ecclesiastes':21,'Song of Solomon':22,'Isaiah':23,'Jeremiah':24,'Lamentations':25,
  'Ezekiel':26,'Daniel':27,'Hosea':28,'Joel':29,'Amos':30,'Obadiah':31,'Jonah':32,'Micah':33,
  'Nahum':34,'Habakkuk':35,'Zephaniah':36,'Haggai':37,'Zechariah':38,'Malachi':39,
  'Matthew':40,'Mark':41,'Luke':42,'John':43,'Acts':44,'Romans':45,'1 Corinthians':46,
  '2 Corinthians':47,'Galatians':48,'Ephesians':49,'Philippians':50,'Colossians':51,
  '1 Thessalonians':52,'2 Thessalonians':53,'1 Timothy':54,'2 Timothy':55,'Titus':56,
  'Philemon':57,'Hebrews':58,'James':59,'1 Peter':60,'2 Peter':61,'1 John':62,'2 John':63,
  '3 John':64,'Jude':65,'Revelation':66,
};

// "1 Corinthians 15:3–4" -> { book: 46, chapter: 15, from: 3, to: 4 }
function parseRef(ref) {
  const m = /^(.+?)\s+(\d+):(\d+)(?:\s*[–—-]\s*(\d+))?/.exec(ref);
  if (!m) return null;
  const book = BOOK_NUMBERS[m[1]];
  if (!book) return null;
  return { book, chapter: +m[2], from: +m[3], to: +(m[4] || m[3]) };
}

// Font stacks. The label fitter measures on a canvas, so JS and CSS must agree.
const FONTS = {
  en: "Georgia, 'Times New Roman', serif",
  ar: "'Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', 'Simplified Arabic', Georgia, serif",
};

const UI = {
  en: {
    title: 'God’s Commands in Light of Eternity',
    subtitle: 'What the Word of God emphasizes — to believe, to pursue, to avoid — summarized from the 66 books',
    language: 'Language',
    translation: 'Translation',
    hint: 'Pinch to zoom · drag to explore · tap a circle for verses',
    close: 'Close',
    legend: {
      center: 'The Gospel — the entrance',
      pursue: 'Pursue & grow in',
      avoid: 'Avoid & put to death',
      emphasis: 'Thicker ring = emphasized more often in Scripture',
    },
    categories: {
      center: 'The Gospel — the entrance',
      hub: 'Category',
      kingdom: 'Entering the Kingdom',
      pursue: 'Pursue & grow in',
      avoid: 'Avoid & put to death',
      eternity: 'In light of eternity',
    },
    emphasisNote: {
      1: 'Stated in Scripture.',
      2: 'Repeated in Scripture — God says it more than once.',
      3: 'Heavily emphasized — God presses this again and again across His Word.',
    },
    resetView: 'Reset view',
    pending: 'Showing the ESV — this translation\u2019s Arabic text could not be loaded.',
    licensed: 'Ketab El Hayat is under copyright and has no free source; showing the ESV below.',
    substituted: 'Ketab El Hayat needs a licence — showing Van Dyck\u2019s Arabic for the same verse.',
    footer: 'Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway. Used by permission. All rights reserved.',
  },
  ar: {
    title: 'وصايا الله في ضوء الأبدية',
    subtitle: 'ما يؤكِّده كلام الله — أن نؤمن، ونسعى، ونتجنَّب — مُلخَّصًا من الأسفار الستة والستين',
    language: 'اللغة',
    translation: 'الترجمة',
    hint: 'قرِّب بإصبعيك · اسحب للاستكشاف · انقر دائرة لعرض الآيات',
    close: 'إغلاق',
    legend: {
      center: 'الإنجيل — المدخل',
      pursue: 'اسعَ وانمُ فيه',
      avoid: 'تجنَّبْ وأمِتْ',
      emphasis: 'الحلقة الأسمك = تأكيد أكثر في الكتاب المقدس',
    },
    categories: {
      center: 'الإنجيل — المدخل',
      hub: 'فئة',
      kingdom: 'الدخول إلى الملكوت',
      pursue: 'السعي والنمو',
      avoid: 'التجنُّب والإماتة',
      eternity: 'في ضوء الأبدية',
    },
    emphasisNote: {
      1: 'مذكور في الكتاب المقدس.',
      2: 'متكرِّر في الكتاب المقدس — يقوله الله أكثر من مرة.',
      3: 'مؤكَّد بشدة — يكرِّره الله مرارًا وتكرارًا في كلمته.',
    },
    resetView: 'إعادة الضبط',
    pending: 'يُعرض نص ESV — تعذَّر تحميل النص العربي لهذه الترجمة.',
    licensed: 'ترجمة كتاب الحياة محمية بحقوق النشر ولا يتوفر لها مصدر حر؛ يُعرض أدناه نص ESV.',
    substituted: 'ترجمة كتاب الحياة تحتاج ترخيصًا — يُعرض نص فان دايك العربي للآية نفسها.',
    footer: 'الاقتباسات الكتابية من ترجمة ESV® (The Holy Bible, English Standard Version®)، © 2001 Crossway. مستخدمة بإذن. جميع الحقوق محفوظة.',
  },
};

// Arabic book names, taken from the Van Dyck translation's own naming so a
// reference matches the Bible whose text is shown.
const AR_BOOKS = {
  'Exodus': 'خروج',
  'Leviticus': 'لاويين',
  'Deuteronomy': 'تثنية',
  'Proverbs': 'الأمثال',
  'Ecclesiastes': 'الجامعة',
  'Micah': 'ميخا',
  'Matthew': 'متى',
  'Mark': 'مرقس',
  'Luke': 'لوقا',
  'John': 'يوحنا',
  'Acts': 'أعمال الرسل',
  'Romans': 'رومية',
  '1 Corinthians': '1 كورنثوس',
  '2 Corinthians': '2 كورنثوس',
  'Galatians': 'غلاطية',
  'Ephesians': 'أفسس',
  'Philippians': 'فيليبي',
  'Colossians': 'كولوسي',
  '1 Thessalonians': '1 تسالونيكي',
  '1 Timothy': '1 تيموثاوس',
  'Titus': 'تيطس',
  'Hebrews': 'عبرانيين',
  'James': 'يعقوب',
  '1 Peter': '1 بطرس',
  '2 Peter': '2 بطرس',
  '1 John': '1 يوحنا',
  'Revelation': 'الرؤيا',
};

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

// "1 Corinthians 6:9–10" -> "كورنثوس الأولى ٦:٩–١٠"
function localizeRef(ref, lang) {
  if (lang !== 'ar') return ref;
  const m = /^(.*?)\s+(\d.*)$/.exec(ref);
  if (!m) return ref;
  const book = AR_BOOKS[m[1]];
  if (!book) return ref;                       // unknown book: leave it legible
  const digits = t => t.replace(/\d/g, d => AR_DIGITS[+d]);
  return `${digits(book)} ${digits(m[2])}`;      // "1 كورنثوس" -> "١ كورنثوس"

}

// label/summary fields hold {en, ar}; fall back to English if a language is missing.
function pick(field, lang) {
  if (field == null) return '';
  return typeof field === 'string' ? field : (field[lang] || field.en || '');
}
