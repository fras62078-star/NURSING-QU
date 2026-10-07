/* =====================================================================
   نَسْج — البيانات التجريبية
   ⚠️ جميع المنتجات والأسعار والمواصفات هنا بيانات عرض وتجربة فقط
   وليست معلومات حقيقية مؤكدة. عند التحويل لمتجر فعلي تُستبدل
   هذه البيانات بواجهة برمجية (API) من قاعدة البيانات.
   ===================================================================== */

function seededRandom(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- أنماط السجاد ---------- */
const STYLES = [
  { id: 'bohemian',    ar: 'البوهيمي',  en: 'Bohemian',    name: 'السجاد البوهيمي',  tint: '#f2e6d6', tagline: 'روح حرّة ونقوش منسوجة بألوان الأرض الدافئة',
    desc: 'مستوحى من سجاد الرحّالة وقبائل الأطلس؛ أشرطة ومعينات منسوجة بألوان ترابية تمنح المكان دفئًا وطابعًا شخصيًا.' },
  { id: 'modern',      ar: 'المودرن',   en: 'Modern',      name: 'السجاد المودرن',   tint: '#ecebe6', tagline: 'خطوط معاصرة وتجريد فني بألوان محايدة',
    desc: 'تصاميم تجريدية وأشكال ناعمة بدرجات محايدة هادئة، تناسب المساحات العصرية والديكورات البسيطة.' },
  { id: 'classic',     ar: 'الكلاسيكي', en: 'Classic',     name: 'السجاد الكلاسيكي', tint: '#efe2dc', tagline: 'ميداليات وزخارف خالدة بإطارات غنية',
    desc: 'ميداليات مركزية وزوايا متناظرة وإطارات متعددة الطبقات؛ حضور فخم يليق بالمجالس وغرف الاستقبال.' },
  { id: 'french',      ar: 'الفرنسي',   en: 'French',      name: 'السجاد الفرنسي',   tint: '#f3ebe7', tagline: 'زهور أوبوسون الناعمة بدرجات الباستيل',
    desc: 'مستوحى من سجاد أوبوسون وسافونري الفرنسي؛ أكاليل زهور وألوان باستيل رقيقة لأجواء رومانسية أنيقة.' },
  { id: 'oriental',    ar: 'الشرقي',    en: 'Oriental',    name: 'السجاد الشرقي',    tint: '#efe3d5', tagline: 'إرث الشرق في نقوش متكررة دقيقة',
    desc: 'نقوش متكررة دقيقة وإطارات عريضة بألوان الأحمر والكحلي والذهبي، بروح السجاد الفارسي العريق.' },
  { id: 'luxury',      ar: 'الفاخر',    en: 'Luxury',      name: 'السجاد الفاخر',    tint: '#e6e2db', tagline: 'لمسات ذهبية وخامات حريرية لامعة',
    desc: 'خامات حريرية وخيوط ذهبية وزخارف آرت ديكو ورخام؛ قطع استثنائية للمساحات الراقية.' },
  { id: 'kids',        ar: 'الأطفال',   en: 'Kids',        name: 'سجاد الأطفال',     tint: '#f5ede3', tagline: 'ألوان مرحة وملمس ناعم آمن للعب',
    desc: 'ألوان مبهجة ورسومات مرحة بخامات ناعمة وسهلة التنظيف، صُممت لتكون جزءًا من عالم الطفل.' },
  { id: 'geometric',   ar: 'الهندسي',   en: 'Geometric',   name: 'السجاد الهندسي',   tint: '#ebe9e3', tagline: 'إيقاع الأشكال والخطوط المتناظرة',
    desc: 'مثلثات وسداسيات وشيفرون بتناظر دقيق وإيقاع بصري واضح يضيف حيوية للمكان.' },
  { id: 'minimalist',  ar: 'البسيط',    en: 'Minimalist',  name: 'السجاد البسيط',    tint: '#f1eee8', tagline: 'هدوء الألوان ونقاء التفاصيل',
    desc: 'ألوان أحادية هادئة وملمس غني بتفاصيل قليلة مدروسة؛ أساس مثالي لأي ديكور.' },
  { id: 'traditional', ar: 'التراثي',   en: 'Traditional', name: 'السجاد التراثي',   tint: '#efe0d4', tagline: 'السدو والكليم بروح الموروث',
    desc: 'نقوش السدو العربي والكليم المنسوج المسطح؛ حكايات الموروث بألوان بيت الشعر.' },
];

/* ---------- تصنيفات حسب الغرفة ---------- */
const ROOMS = [
  { id: 'living',  ar: 'سجاد الصالات والمجالس' },
  { id: 'bedroom', ar: 'سجاد غرف النوم' },
  { id: 'dining',  ar: 'سجاد غرف الطعام' },
  { id: 'kids',    ar: 'سجاد غرف الأطفال' },
  { id: 'entry',   ar: 'سجاد المداخل والممرات' },
];

/* ---------- الألوان (للفلترة) ---------- */
const COLORS = {
  beige:      { ar: 'بيج',       hex: '#d6c3a5' },
  cream:      { ar: 'كريمي',     hex: '#efe6d4' },
  grey:       { ar: 'رمادي',     hex: '#9d9a94' },
  black:      { ar: 'أسود',      hex: '#2a2928' },
  red:        { ar: 'أحمر',      hex: '#93302a' },
  blue:       { ar: 'أزرق',      hex: '#2f4a6d' },
  green:      { ar: 'أخضر',      hex: '#4f6b55' },
  pink:       { ar: 'وردي',      hex: '#e2b2aa' },
  purple:     { ar: 'بنفسجي',    hex: '#9a86ad' },
  terracotta: { ar: 'تيراكوتا',  hex: '#b5603d' },
  gold:       { ar: 'ذهبي',      hex: '#c4a15a' },
  multi:      { ar: 'متعدد',     hex: 'multi' },
};

/* ---------- المقاسات الافتراضية (قابلة للتعديل من لوحة التحكم) ---------- */
const DEFAULT_SIZES = [
  { id: 's50x80',   w: 50,  h: 80 },
  { id: 's80x150',  w: 80,  h: 150 },
  { id: 's100x200', w: 100, h: 200 },
  { id: 's150x220', w: 150, h: 220 },
  { id: 's200x300', w: 200, h: 300 },
  { id: 's250x350', w: 250, h: 350 },
  { id: 's300x400', w: 300, h: 400 },
];

/* ---------- لوحات الألوان لكل نمط ---------- */
const pal = (id, ar, c) => ({ id, ar, c });
const PAL = {
  boho: {
    terracotta: pal('terracotta', 'تيراكوتا', ['#efe3cf', '#b5603d', '#d9a441', '#3f5e5a', '#7a3b2a']),
    cream:      pal('cream', 'كريمي', ['#f1e9db', '#2f2a26', '#b8a68a', '#c47a53', '#6b5d4f']),
    sunset:     pal('multi', 'غروب', ['#f3dcc4', '#c8553d', '#f2a65a', '#6a4c93', '#8c2f39']),
    teal:       pal('green', 'أخضر مائي', ['#e9e2d0', '#2e6e6a', '#d18b47', '#a8443a', '#e0c27a']),
    grey:       pal('grey', 'رمادي', ['#e7e4de', '#5b5a57', '#a39e93', '#c9a27a', '#2f2f2e']),
  },
  modern: {
    neutral: pal('beige', 'بيج محايد', ['#ece6dc', '#c9b8a0', '#8f7e6a', '#3d3934', '#e0d3c0']),
    grey:    pal('grey', 'رمادي', ['#e4e3e0', '#9c9a95', '#5e5d5a', '#c7b299', '#2d2c2a']),
    earth:   pal('terracotta', 'ترابي', ['#efe5d6', '#c47f5a', '#6f7d63', '#d8b37a', '#3e3530']),
    blue:    pal('blue', 'أزرق', ['#e9ecef', '#3b5068', '#9fb1c2', '#c9a77c', '#1f2a36']),
    blush:   pal('pink', 'وردي', ['#f3e7e1', '#d8a69a', '#9b6b5e', '#e9cfc4', '#4a3a36']),
  },
  classic: {
    red:   pal('red', 'أحمر عنابي', ['#8e2a26', '#1f2b45', '#d8b86a', '#efe1c2', '#5a1a18']),
    navy:  pal('blue', 'كحلي', ['#1f2f4a', '#8e2a26', '#c9a35a', '#e8dcc0', '#13203a']),
    ivory: pal('cream', 'عاجي', ['#ede3cf', '#6b4a3a', '#9a2f2b', '#c79b55', '#2c3b55']),
    green: pal('green', 'زمردي', ['#2f4a3a', '#7a2c28', '#c9a35a', '#e8dcc0', '#1d3127']),
  },
  french: {
    blush:    pal('pink', 'وردي فرنسي', ['#f2e6dc', '#cdb7a3', '#d79a96', '#8fa58a', '#b86e6a']),
    sage:     pal('green', 'أخضر مريمي', ['#e6e8dc', '#a9b39a', '#d6a49c', '#6f8768', '#c9a77c']),
    ivory:    pal('cream', 'عاجي', ['#f4ede0', '#c5b08e', '#c08d7f', '#8d9a7a', '#a06b5a']),
    blue:     pal('blue', 'أزرق باهت', ['#e3e8ec', '#a8b7c4', '#d4a5a0', '#7f9a8a', '#5d7590']),
    lavender: pal('purple', 'لافندر', ['#ece6ee', '#bfb3c9', '#c99ab0', '#8fa18a', '#8a6f9e']),
  },
  oriental: {
    red:  pal('red', 'أحمر شرقي', ['#9a2b23', '#1e2a48', '#e3c27d', '#f0e2c4', '#3d5a7a']),
    navy: pal('blue', 'كحلي', ['#1c2946', '#9a2b23', '#d9b46a', '#efe2c6', '#5e7f8a']),
    rust: pal('terracotta', 'نحاسي', ['#a5502f', '#3a2a23', '#e0bb73', '#efe0c2', '#5f7556']),
    gold: pal('gold', 'ذهبي', ['#c49a52', '#5a2620', '#2a3a5a', '#f2e6c9', '#8a3a2b']),
  },
  luxury: {
    onyx:    pal('black', 'أسود أونكس', ['#1d1d1f', '#2e2d31', '#c8a45c', '#e8d9b0', '#5a4a2c']),
    emerald: pal('green', 'زمردي', ['#0f3b33', '#1b5246', '#c9a75d', '#e7d7ab', '#0a2a24']),
    navy:    pal('blue', 'كحلي ملكي', ['#16223a', '#22345a', '#c7a55e', '#e7d8ae', '#0e1729']),
    ivory:   pal('cream', 'عاجي ذهبي', ['#efe7d8', '#e1d5c0', '#b8955a', '#8a6a3a', '#cdbb9b']),
    champ:   pal('gold', 'شمبانيا', ['#e9e1d3', '#d7cab4', '#b38d4f', '#ffffff', '#9e8a6c']),
  },
  kids: {
    pastel: pal('multi', 'باستيل', ['#f6efe6', '#f2b8a2', '#f6d58e', '#a8d5c2', '#9fc1e3']),
    night:  pal('blue', 'سماء الليل', ['#24345a', '#f4d78a', '#ffffff', '#9fb6e0', '#3a4d7a']),
    candy:  pal('multi', 'حلوى', ['#fbf3ee', '#f28c8c', '#7cc6b8', '#f5c451', '#8aa8e6']),
    mint:   pal('green', 'نعناعي', ['#eaf4ef', '#7cc3a9', '#f3b6a5', '#f5d27a', '#6c9fd1']),
    pink:   pal('pink', 'وردي', ['#fbe9ec', '#f19cb0', '#f7d38a', '#b9a3e3', '#8fd1c5']),
  },
  geometric: {
    mono:    pal('black', 'أبيض وأسود', ['#efebe4', '#2c2b29', '#8d877d', '#cbbfae', '#5a554e']),
    earth:   pal('terracotta', 'ترابي', ['#ebe1d1', '#b86d48', '#3e4b44', '#d8b375', '#7d5a45']),
    blue:    pal('blue', 'أزرق', ['#e6e9ec', '#2f4b6e', '#86a1bb', '#d3b07a', '#1d2b3d']),
    sand:    pal('beige', 'رملي', ['#efe6d8', '#c6ae8b', '#8a7660', '#e2d3bb', '#4a4038']),
    mustard: pal('gold', 'خردلي', ['#f0e6d2', '#d4a03a', '#3b4a5a', '#c46a4a', '#2b2b2b']),
  },
  minimalist: {
    ivory:    pal('cream', 'عاجي', ['#efe9df', '#e2d9cb', '#b9ab96', '#8c7f6d', '#f6f2ea']),
    stone:    pal('grey', 'حجري', ['#d9d5ce', '#c6c0b6', '#8f897f', '#5c5852', '#ebe8e2']),
    oat:      pal('beige', 'شوفاني', ['#e5d9c5', '#d3c3a7', '#a8956f', '#6e604c', '#f1e8d9']),
    charcoal: pal('black', 'فحمي', ['#4a4845', '#58564f', '#7a7772', '#c9c3b8', '#3a3836']),
  },
  traditional: {
    sadu:   pal('red', 'سدو أحمر', ['#8a1f1c', '#1c1a19', '#efe4cf', '#c99a3c', '#3b5b4f']),
    black:  pal('black', 'سدو أسود', ['#1c1a19', '#8a1f1c', '#efe4cf', '#c99a3c', '#5a4636']),
    kilim:  pal('terracotta', 'كليم ترابي', ['#b5532f', '#2d3a4a', '#e9d9b8', '#c9973e', '#6b2a22']),
    indigo: pal('blue', 'نيلي', ['#2b3a5c', '#a83a2c', '#e8dcc3', '#d6a74a', '#1a2236']),
  },
};

/* ---------- قائمة المنتجات الخام ----------
   [المعرّف، النمط، شكل النقشة، الاسم، لوحات الألوان، علامات] */
const P = PAL;
const RAW_PRODUCTS = [
  ['boh-01', 'bohemian', 'bands',   'سجادة الواحة البوهيمية',   [P.boho.terracotta, P.boho.sunset], 'best'],
  ['boh-02', 'bohemian', 'lattice', 'سجادة بربر الناعمة',       [P.boho.cream, P.boho.grey], 'new'],
  ['boh-03', 'bohemian', 'bands',   'سجادة طيف الرحّالة',        [P.boho.teal, P.boho.terracotta], ''],
  ['boh-04', 'bohemian', 'lattice', 'سجادة مراكش المنسوجة',     [P.boho.terracotta, P.boho.teal], 'sale'],
  ['boh-05', 'bohemian', 'bands',   'سجادة غروب الكثبان',       [P.boho.sunset, P.boho.cream], 'best'],
  ['boh-06', 'bohemian', 'bands',   'سجادة جوت الريف',          [P.boho.grey, P.boho.cream], 'new'],

  ['mod-01', 'modern', 'arcs',    'سجادة أفق المودرن',     [P.modern.neutral, P.modern.blush], 'best'],
  ['mod-02', 'modern', 'blocks',  'سجادة كتل الرمل',       [P.modern.earth, P.modern.neutral], ''],
  ['mod-03', 'modern', 'waves',   'سجادة خطوط التضاريس',   [P.modern.grey, P.modern.blue], 'new'],
  ['mod-04', 'modern', 'strokes', 'سجادة ضربات الفرشاة',   [P.modern.neutral, P.modern.earth], 'sale'],
  ['mod-05', 'modern', 'arcs',    'سجادة القمر الهادئ',    [P.modern.grey, P.modern.blue], ''],
  ['mod-06', 'modern', 'blocks',  'سجادة نيوترال بلوك',    [P.modern.blush, P.modern.grey], 'new'],

  ['cls-01', 'classic', 'medallion', 'سجادة القصر الكلاسيكية',   [P.classic.red, P.classic.navy], 'best'],
  ['cls-02', 'classic', 'diamond',   'سجادة الميدالية العاجية',  [P.classic.ivory, P.classic.red], ''],
  ['cls-03', 'classic', 'medallion', 'سجادة الإرث الكحلية',     [P.classic.navy, P.classic.green], 'sale'],
  ['cls-04', 'classic', 'diamond',   'سجادة الزمرد الملكية',    [P.classic.green, P.classic.ivory], 'new'],
  ['cls-05', 'classic', 'medallion', 'سجادة دار الضيافة',       [P.classic.ivory, P.classic.navy], 'best'],

  ['fr-01', 'french', 'wreath', 'سجادة أوبوسون الوردية',  [P.french.blush, P.french.ivory], 'best'],
  ['fr-02', 'french', 'open',   'سجادة حديقة فرساي',     [P.french.sage, P.french.blush], 'new'],
  ['fr-03', 'french', 'wreath', 'سجادة بروفانس الناعمة', [P.french.ivory, P.french.blue], ''],
  ['fr-04', 'french', 'open',   'سجادة صالون باريس',     [P.french.blue, P.french.sage], 'sale'],
  ['fr-05', 'french', 'wreath', 'سجادة لافندر الريفية',  [P.french.lavender, P.french.blush], 'new'],

  ['ori-01', 'oriental', 'allover',   'سجادة تبريز الشرقية',   [P.oriental.red, P.oriental.navy], 'best'],
  ['ori-02', 'oriental', 'medallion', 'سجادة كاشان الحمراء',   [P.oriental.red, P.oriental.gold], ''],
  ['ori-03', 'oriental', 'allover',   'سجادة أصفهان الكحلية',  [P.oriental.navy, P.oriental.rust], 'new'],
  ['ori-04', 'oriental', 'medallion', 'سجادة هريز النحاسية',   [P.oriental.rust, P.oriental.navy], 'sale'],
  ['ori-05', 'oriental', 'allover',   'سجادة قُم الذهبية',      [P.oriental.gold, P.oriental.red], 'best'],

  ['lux-01', 'luxury', 'deco',   'سجادة آرت ديكو الذهبية',  [P.luxury.onyx, P.luxury.navy], 'best'],
  ['lux-02', 'luxury', 'marble', 'سجادة رخام الشمبانيا',    [P.luxury.champ, P.luxury.ivory], 'new'],
  ['lux-03', 'luxury', 'deco',   'سجادة الزمرد الحريرية',   [P.luxury.emerald, P.luxury.onyx], ''],
  ['lux-04', 'luxury', 'marble', 'سجادة أونكس اللامعة',     [P.luxury.onyx, P.luxury.emerald], ''],
  ['lux-05', 'luxury', 'deco',   'سجادة الجناح الملكي',     [P.luxury.navy, P.luxury.ivory], 'sale'],

  ['kid-01', 'kids', 'rainbow', 'سجادة قوس قزح',        [P.kids.pastel, P.kids.mint], 'best'],
  ['kid-02', 'kids', 'night',   'سجادة نجوم الليل',      [P.kids.night], 'new'],
  ['kid-03', 'kids', 'shapes',  'سجادة أشكال مرحة',      [P.kids.candy, P.kids.pink], ''],
  ['kid-04', 'kids', 'rainbow', 'سجادة السحاب الوردية',  [P.kids.pink, P.kids.candy], 'sale'],
  ['kid-05', 'kids', 'shapes',  'سجادة ملعب الألوان',    [P.kids.mint, P.kids.pastel], 'new'],

  ['geo-01', 'geometric', 'chevron',   'سجادة شيفرون',              [P.geometric.mono, P.geometric.earth], 'best'],
  ['geo-02', 'geometric', 'triangles', 'سجادة مثلثات الرمل',        [P.geometric.sand, P.geometric.mustard], ''],
  ['geo-03', 'geometric', 'hex',       'سجادة خلية النحل',          [P.geometric.mustard, P.geometric.mono], 'new'],
  ['geo-04', 'geometric', 'squares',   'سجادة المربعات المتداخلة',  [P.geometric.blue, P.geometric.earth], 'sale'],
  ['geo-05', 'geometric', 'triangles', 'سجادة فسيفساء',             [P.geometric.earth, P.geometric.blue], ''],

  ['min-01', 'minimalist', 'border', 'سجادة الإطار الهادئ',  [P.minimalist.ivory, P.minimalist.stone], 'best'],
  ['min-02', 'minimalist', 'split',  'سجادة الكثيب',         [P.minimalist.oat, P.minimalist.ivory], 'new'],
  ['min-03', 'minimalist', 'lines',  'سجادة الخطوط الرفيعة', [P.minimalist.stone, P.minimalist.charcoal], ''],
  ['min-04', 'minimalist', 'border', 'سجادة الفحم الناعم',   [P.minimalist.charcoal, P.minimalist.oat], ''],
  ['min-05', 'minimalist', 'split',  'سجادة ضوء الصباح',     [P.minimalist.ivory, P.minimalist.oat], 'sale'],

  ['tra-01', 'traditional', 'sadu',  'سجادة السدو النجدية',  [P.traditional.sadu, P.traditional.black], 'best'],
  ['tra-02', 'traditional', 'kilim', 'سجادة كليم الأناضول',  [P.traditional.kilim, P.traditional.indigo], ''],
  ['tra-03', 'traditional', 'sadu',  'سجادة بيت الشعر',      [P.traditional.black, P.traditional.sadu], 'new'],
  ['tra-04', 'traditional', 'kilim', 'سجادة الكليم النيلي',  [P.traditional.indigo, P.traditional.kilim], 'sale'],
  ['tra-05', 'traditional', 'sadu',  'سجادة القافلة',        [P.traditional.indigo], ''],
];

/* ---------- معلومات وصفية لكل نمط (تجريبية) ---------- */
const STYLE_META = {
  bohemian:    { ppm: 240, sizes: [0, 6], rooms: ['living', 'bedroom'], materials: ['قطن وجوت منسوج يدويًا', 'صوف وقطن مخلوط'], weave: 'منسوج يدويًا', pile: [6, 9], origins: ['المغرب', 'الهند'] },
  modern:      { ppm: 280, sizes: [1, 6], rooms: ['living', 'bedroom', 'dining'], materials: ['بوليستر ناعم عالي الكثافة', 'صوف نيوزيلندي مخلوط'], weave: 'آلي بوبر كثيف', pile: [10, 14], origins: ['تركيا', 'بلجيكا'] },
  classic:     { ppm: 420, sizes: [1, 6], rooms: ['living', 'dining'], materials: ['صوف طبيعي 100%', 'صوف وفسكوز'], weave: 'آلي عالي الدقة', pile: [9, 12], origins: ['تركيا', 'بلجيكا', 'مصر'] },
  french:      { ppm: 480, sizes: [1, 6], rooms: ['bedroom', 'living'], materials: ['صوف ناعم وحرير صناعي', 'صوف طبيعي'], weave: 'آلي عالي الدقة', pile: [8, 11], origins: ['بلجيكا', 'تركيا'] },
  oriental:    { ppm: 520, sizes: [0, 6], rooms: ['living', 'dining', 'entry'], materials: ['صوف طبيعي معقود يدويًا', 'صوف وحرير'], weave: 'معقود يدويًا', pile: [8, 12], origins: ['إيران', 'الهند'] },
  luxury:      { ppm: 950, sizes: [2, 6], rooms: ['living', 'bedroom'], materials: ['حرير البامبو وفسكوز', 'صوف وحرير طبيعي'], weave: 'معقود يدويًا', pile: [12, 16], origins: ['الهند', 'نيبال'] },
  kids:        { ppm: 220, sizes: [0, 4], rooms: ['kids', 'bedroom'], materials: ['بوليستر ناعم مضاد للانزلاق', 'قطن قابل للغسل'], weave: 'مطبوع رقميًا', pile: [6, 9], origins: ['تركيا', 'مصر'] },
  geometric:   { ppm: 300, sizes: [0, 6], rooms: ['living', 'entry', 'dining'], materials: ['صوف مخلوط', 'بولي بروبلين متين'], weave: 'آلي', pile: [8, 12], origins: ['تركيا', 'مصر'] },
  minimalist:  { ppm: 260, sizes: [0, 6], rooms: ['bedroom', 'living', 'entry'], materials: ['صوف بوبر مرتفع ومنخفض', 'قطن وصوف'], weave: 'منسوج يدويًا', pile: [8, 12], origins: ['الهند', 'تركيا'] },
  traditional: { ppm: 340, sizes: [0, 5], rooms: ['living', 'entry'], materials: ['صوف منسوج مسطح', 'صوف ووبر ماعز'], weave: 'نسج مسطح يدوي', pile: [4, 6], origins: ['السعودية', 'تركيا'] },
};

const VARIANT_COPY = {
  bands: 'تتناوب فيها الأشرطة المنسوجة بزخارف المعين والمثلثات والخطوط المتعرجة.',
  lattice: 'شبكة معينات بخطوط داكنة على أرضية فاتحة مستوحاة من سجاد قبائل الأطلس.',
  arcs: 'دوائر وأقواس متداخلة بتدرجات هادئة تمنح المكان إحساسًا فنيًا معاصرًا.',
  blocks: 'كتل لونية متناسقة بتقسيم هندسي ناعم يوازن بين الدفء والبساطة.',
  waves: 'خطوط متموجة مستوحاة من خرائط التضاريس بإيقاع هادئ.',
  strokes: 'ضربات فرشاة عريضة تشبه لوحة تجريدية على الأرض.',
  medallion: 'ميدالية مركزية مزخرفة تحيط بها زوايا متناظرة وإطار متعدد الطبقات.',
  diamond: 'معين مركزي كبير بزخارف وردية دقيقة وإطار كلاسيكي غني.',
  wreath: 'إكليل زهور بيضاوي في المنتصف وإطار مزهر ناعم.',
  open: 'تكوين زهري مفتوح بمساحة أرضية رحبة ودرجات باستيل رقيقة.',
  allover: 'نقشة متكررة تغطي الأرضية كاملة مع إطار عريض غني بالتفاصيل.',
  deco: 'زخارف آرت ديكو مروحية بخيوط ذهبية لامعة.',
  marble: 'عروق رخامية متدفقة بلمعة حريرية فاخرة.',
  rainbow: 'قوس قزح وغيوم ناعمة بألوان مبهجة.',
  night: 'سماء ليلية بالنجوم والقمر لغرف نوم هادئة.',
  shapes: 'أشكال مرحة متناثرة تحفّز خيال الطفل.',
  chevron: 'خطوط شيفرون متعرجة بإيقاع جريء.',
  triangles: 'مثلثات متجاورة بتوزيع لوني متوازن.',
  hex: 'شبكة سداسية مستوحاة من خلايا النحل.',
  squares: 'مربعات ومعينات متداخلة بتناظر دقيق.',
  border: 'لون واحد هادئ بإطار رفيع يحدد المساحة بأناقة.',
  split: 'تدرج لوني بانحناءة ناعمة تشبه الكثبان الرملية.',
  lines: 'وبر مضلّع بخطوط رفيعة غير متماثلة.',
  sadu: 'أشرطة السدو التقليدية بالمثلثات والمعينات بألوان بيت الشعر.',
  kilim: 'معينات متدرجة بأسلوب الكليم المنسوج المسطح.',
};

/* ---------- توليد المنتجات الكاملة ---------- */
const PRODUCTS = RAW_PRODUCTS.map((row, i) => {
  const [id, style, variant, name, colors, flags] = row;
  const r = seededRandom(1000 + i * 7919);
  const meta = STYLE_META[style];
  const [lo, hi] = meta.sizes;
  const start = lo + Math.floor(r() * 2);
  const end = Math.max(start + 2, hi - Math.floor(r() * 2));
  const sizes = DEFAULT_SIZES.slice(start, end + 1).map(s => s.id);
  const rooms = [...meta.rooms];
  if (start <= 1 && !rooms.includes('entry')) rooms.push('entry');
  const ppm = Math.round(meta.ppm * (0.85 + r() * 0.35));
  const flagList = flags ? flags.split(',') : [];
  const isSale = flagList.includes('sale');
  return {
    id, style, variant, name, colors,
    seed: 4000 + i * 131,
    sizes, rooms, ppm,
    minPrice: style === 'luxury' ? 690 : 129,
    isNew: flagList.includes('new'),
    isBest: flagList.includes('best'),
    discount: isSale ? [15, 20, 25, 30][Math.floor(r() * 4)] : 0,
    rating: Math.round((4.2 + r() * 0.8) * 10) / 10,
    reviews: 8 + Math.floor(r() * 180),
    sold: Math.floor(r() * 400) + (flagList.includes('best') ? 600 : 0),
    order: i,
    specs: {
      material: meta.materials[Math.floor(r() * meta.materials.length)],
      pile: `${meta.pile[0] + Math.floor(r() * (meta.pile[1] - meta.pile[0] + 1))} ملم`,
      weave: meta.weave,
      origin: meta.origins[Math.floor(r() * meta.origins.length)],
      backing: style === 'traditional' ? 'بدون ظهر (وجهان)' : (style === 'kids' ? 'ظهر مطاطي مانع للانزلاق' : 'ظهر قطني'),
      care: style === 'kids' ? 'قابلة للغسل بالماء البارد' : 'تنظيف بالمكنسة وتنظيف احترافي سنوي',
      sku: 'NJ-' + id.toUpperCase(),
    },
    description: `${name}. ${VARIANT_COPY[variant]} ${STYLES.find(s => s.id === style).desc}`,
  };
});
