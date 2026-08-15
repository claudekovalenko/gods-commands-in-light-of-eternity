// Interface languages, Bible translations, and reference localisation.
//
// Adding a language: add an entry to LANGS and UI, add an `ar`-style key to every
// label/sublabel/summary in data.js, and list its translations in TRANSLATIONS.

const LANGS = [
  { id: 'en', name: 'English', dir: 'ltr' },
  { id: 'ar', name: 'العربية', dir: 'rtl' },
];

// Bible translations offered per interface language. `id` keys verses[].text in data.js.
const TRANSLATIONS = {
  en: [
    { id: 'esv', name: 'ESV', abbr: '', full: 'English Standard Version' },
  ],
  ar: [
    { id: 'keh', name: 'كتاب الحياة', abbr: 'KEH', full: 'Ketab El Hayat — Word of Life (New Arabic Version)' },
    { id: 'svd', name: 'فان دايك', abbr: 'SVD', full: 'Smith & Van Dyck (Arabic, 1865)' },
  ],
};

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
    pending: 'Arabic text for this translation is not bundled yet — showing the ESV below.',
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
    pending: 'النص العربي لهذه الترجمة غير مُضمَّن بعد — يُعرض أدناه نص ESV الإنجليزي.',
    footer: 'الاقتباسات الكتابية من ترجمة ESV® (The Holy Bible, English Standard Version®)، © 2001 Crossway. مستخدمة بإذن. جميع الحقوق محفوظة.',
  },
};

// Arabic names of every book referenced in data.js.
const AR_BOOKS = {
  'Exodus': 'الخروج',
  'Leviticus': 'اللاويين',
  'Deuteronomy': 'التثنية',
  'Proverbs': 'الأمثال',
  'Ecclesiastes': 'الجامعة',
  'Micah': 'ميخا',
  'Matthew': 'متى',
  'Mark': 'مرقس',
  'Luke': 'لوقا',
  'John': 'يوحنا',
  'Acts': 'أعمال الرسل',
  'Romans': 'رومية',
  '1 Corinthians': 'كورنثوس الأولى',
  '2 Corinthians': 'كورنثوس الثانية',
  'Galatians': 'غلاطية',
  'Ephesians': 'أفسس',
  'Philippians': 'فيلبي',
  'Colossians': 'كولوسي',
  '1 Thessalonians': 'تسالونيكي الأولى',
  '1 Timothy': 'تيموثاوس الأولى',
  'Titus': 'تيطس',
  'Hebrews': 'العبرانيين',
  'James': 'يعقوب',
  '1 Peter': 'بطرس الأولى',
  '2 Peter': 'بطرس الثانية',
  '1 John': 'يوحنا الأولى',
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
  const nums = m[2].replace(/\d/g, d => AR_DIGITS[+d]);
  return `${book} ${nums}`;
}

// label/summary fields hold {en, ar}; fall back to English if a language is missing.
function pick(field, lang) {
  if (field == null) return '';
  return typeof field === 'string' ? field : (field[lang] || field.en || '');
}
