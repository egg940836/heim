
import { Material, MaterialType, Size, Product, BlogPost, Stamp, FaqItem } from './types';

export const STORE_INFO = {
  name: '海姆名床',
  englishName: 'Heim Mattress',
  address: '新北市樹林區俊興街224巷9號',
  phone: '02-26888090',
  lineId: '@heimbed',
  lineUrl: 'https://line.me/ti/p/~@heimbed',
  hours: {
    weekday: '服務處開放：週一至週五 08:30 - 17:30',
    weekend: '週末特別服務：週六、週日 10:00 - 18:00'
  },
  googleMapsUrl: 'https://maps.app.goo.gl/ZfFQtfZhq97CPtam6'
};

// Pricing Logic (Heim Island V4):
// 1. Support Layer Price = Base Chassis Cost ($10,000) + Spring Unit Cost + Mandatory EPE if applicable.
// 2. Size Price = Price Difference from Standard 5.0 Size.
//    - 3.5: -$3000
//    - 5.0: $0
//    - 6.0: +$3000
//    - 7.0: +$6000
export const SIZES: Size[] = [
  { id: 'single_xl', name: '單人加大 (3.5尺)', width: 105, length: 188, basePrice: -3000 },
  { id: 'double', name: '標準雙人 (5.0尺)', width: 150, length: 188, basePrice: 0 },
  { id: 'queen', name: '雙人加大 (6.0尺)', width: 180, length: 188, basePrice: 3000 },
  { id: 'king', name: '雙人特大 (7.0尺)', width: 180, length: 210, basePrice: 6000 },
];

export const MATERIALS: Material[] = [
  // --- COVERS (表布) ---
  {
    id: 'soft_fabric',
    name: '豆狸柔軟絨毛表布', // 舒柔表布
    type: MaterialType.COVER,
    price: 1500,
    description: '像豆狸的絨毛一樣舒服是也！親膚透氣，入門首選。',
    color: 'bg-[#FFF59D]', // Soft Yellow
    thickness: 2,
    benefits: ['親膚', '透氣', '柔軟'],
    stats: { firmness: 3, breathability: 4 }
  },
  {
    id: 'tencel',
    name: '奧地利天絲表布', // 天絲
    type: MaterialType.COVER,
    price: 2400,
    description: '奧地利蘭精纖維，像瀑布一樣涼爽絲滑，強韌耐用。',
    color: 'bg-[#E0F7FA]', // Cyan 50
    thickness: 2,
    benefits: ['絲滑', '環保', '涼爽'],
    stats: { firmness: 2, breathability: 5 }
  },
  {
    id: 'sanitized',
    name: '山寧泰抗菌表布', // 山寧泰
    type: MaterialType.COVER,
    price: 2500,
    description: '瑞士 Sanitized 抗菌技術，利用鋅離子抑制壞菌，為敏感島民建立防護罩。',
    color: 'bg-[#E8EAF6]', // Indigo 50
    thickness: 2,
    benefits: ['抗菌', '防蟎', '衛生'],
    stats: { firmness: 3, breathability: 4 }
  },
  {
    id: 'graphene',
    name: '石墨烯能量表布', // 石墨烯
    type: MaterialType.COVER,
    price: 2500,
    description: '具備調溫功能的黑科技能量石，抗靜電，促進循環。',
    color: 'bg-[#CFD8DC]', // Blue Grey
    thickness: 2,
    benefits: ['調溫', '抗靜電', '循環'],
    stats: { firmness: 3, breathability: 4 }
  },
  {
    id: 'silver_ion',
    name: '奈米銀離子表布', // 銀離子
    type: MaterialType.COVER,
    price: 2800,
    description: '奈米銀離子強力除臭，徹底發揮殺菌力，空氣都變清新了。',
    color: 'bg-[#F5F5F5]', // Grey
    thickness: 2,
    benefits: ['除臭', '淨化', '抗菌'],
    stats: { firmness: 3, breathability: 4 }
  },
  {
    id: 'cashmere_cover',
    name: '喀什米爾羊毛表布', // 喀什米爾羊毛
    type: MaterialType.COVER,
    price: 2800,
    description: '喀什米爾羊毛，冬天溫暖，夏天也能調節濕度喔！',
    color: 'bg-[#FFF8E1]', // Amber 50
    thickness: 3,
    benefits: ['保暖', '柔軟', '調濕'],
    stats: { firmness: 2, breathability: 5 }
  },
  {
    id: 'cooling',
    name: '極地冰川涼感表布', // 涼感冰紗
    type: MaterialType.COVER,
    price: 3000,
    description: '瞬間降溫很有感！高導熱材質快速帶走熱氣，怕熱島民的夏天救星。',
    color: 'bg-[#B3E5FC]', // Light Blue
    thickness: 2,
    benefits: ['瞬涼', '散熱', '降溫'],
    stats: { firmness: 3, breathability: 5 }
  },

  // --- COMFORT LAYERS (舒適層) ---
  {
    id: 'relief_foam_25',
    name: '高支撐釋壓泡棉 (2.5cm)', 
    type: MaterialType.COMFORT_LAYER,
    price: 2000,
    description: '吸收震動減少干擾，有效緩衝壓力，基礎的舒適雲朵。',
    color: 'bg-orange-100',
    thickness: 2.5,
    benefits: ['釋壓', '緩衝', '靜音'],
    stats: { firmness: 3, breathability: 4 }
  },
  {
    id: 'super_hard_foam',
    name: '極高密度高支撐泡棉 (2cm)',
    type: MaterialType.COMFORT_LAYER,
    price: 2000,
    description: '密度 50kg/m³ 以上！像岩石一樣穩固，支撐性極佳。',
    color: 'bg-stone-300',
    thickness: 2,
    benefits: ['硬挺', '耐用', '支撐'],
    stats: { firmness: 5, breathability: 4 }
  },
  {
    id: 'latex_1',
    name: '泰國天然乳膠 (1cm)',
    type: MaterialType.COMFORT_LAYER,
    price: 2500,
    description: '泰國原料，天然蛋白酶防螨抗菌，薄薄一層增加彈性。',
    color: 'bg-[#FFF59D]',
    thickness: 1,
    benefits: ['防蟎', 'Q彈', '透氣'],
    stats: { firmness: 3, breathability: 4 }
  },
  {
    id: 'charcoal_foam',
    name: '竹炭釋壓棉 (4cm)',
    type: MaterialType.COMFORT_LAYER,
    price: 3200,
    description: '添加抗臭竹炭！吸濕除臭，透氣性佳，保持清爽。',
    color: 'bg-gray-400',
    thickness: 4,
    benefits: ['除臭', '吸濕', '清爽'],
    stats: { firmness: 4, breathability: 3 }
  },
  {
    id: 'hard_foam',
    name: '高密度高支撐硬泡棉 (2.5cm)',
    type: MaterialType.COMFORT_LAYER,
    price: 3200,
    description: '穩固支撐，透氣性佳。不喜歡身體陷進去的選擇。',
    color: 'bg-stone-400',
    thickness: 2.5,
    benefits: ['硬挺', '護脊', '穩固'],
    stats: { firmness: 5, breathability: 4 }
  },
  {
    id: 'wool_layer',
    name: '喀什米爾羊毛層',
    type: MaterialType.COMFORT_LAYER,
    price: 3500,
    description: '選用喀什米爾羊毛，柔軟強韌，天然的溫度調節器。',
    color: 'bg-[#FAF8F5]',
    thickness: 2,
    benefits: ['恆溫', '吸濕', '天然'],
    stats: { firmness: 2, breathability: 5 }
  },
  {
    id: 'relief_foam_5',
    name: '高支撐釋壓泡棉 (5cm)',
    type: MaterialType.COMFORT_LAYER,
    price: 4000,
    description: '超厚切！紮實睡感，減震抗干擾，像睡在紮實的雲朵上。',
    color: 'bg-orange-200',
    thickness: 5,
    benefits: ['厚實', '包覆', '安靜'],
    stats: { firmness: 3, breathability: 3 }
  },
  {
    id: 'latex_25',
    name: '泰國天然乳膠 (2.5cm)',
    type: MaterialType.COMFORT_LAYER,
    price: 4500,
    description: '厚度升級！嚴選泰國原料，Q彈支撐感更明顯。',
    color: 'bg-[#FFF176]',
    thickness: 2.5,
    benefits: ['防蟎', 'Q彈', '支撐'],
    stats: { firmness: 3, breathability: 4 }
  },
  {
    id: 'agro_mini',
    name: '德國 Agro 短彈簧',
    type: MaterialType.COMFORT_LAYER,
    price: 5000,
    description: '德國進口 Agro 短彈簧！放在舒適層形成「雙層彈簧」，服貼度 Max！',
    color: 'bg-slate-300',
    thickness: 3,
    benefits: ['服貼', '雙彈簧', '細緻'],
    stats: { firmness: 3, breathability: 5 }
  },
  {
    id: 'horsehair',
    name: '荷蘭 ENKEV 馬尾毛',
    type: MaterialType.COMFORT_LAYER,
    price: 6000,
    description: '荷蘭 ENKEV 馬毛，中空結構能吸濕排汗，透氣度第一名！',
    color: 'bg-[#8D6E63]',
    thickness: 2,
    benefits: ['排濕', '透氣', '頂級'],
    stats: { firmness: 3, breathability: 5 }
  },
  {
    id: 'hydro_foam',
    name: '高密度高回彈親水棉 (5cm)',
    type: MaterialType.COMFORT_LAYER,
    price: 6500,
    description: '高透氣不悶熱！強力包覆身體重量，分散釋放壓力。',
    color: 'bg-cyan-100',
    thickness: 5,
    benefits: ['涼爽', '釋壓', '恆溫'],
    stats: { firmness: 2, breathability: 4 }
  },
  {
    id: 'latex_5',
    name: '泰國天然乳膠 (5cm)',
    type: MaterialType.COMFORT_LAYER,
    price: 9000,
    description: '最頂規的乳膠厚度！滿滿的 Q 彈包覆，宛如雲端的睡感。',
    color: 'bg-[#FFEE58]',
    thickness: 5,
    benefits: ['極致', '防蟎', '雲端'],
    stats: { firmness: 3, breathability: 3 }
  },

  // --- SUPPORT LAYERS (彈簧) ---
  // Price Logic: Base 10000 + Add-on Price
  {
    id: 'spring_20',
    name: '中鋼 2.0mm 獨立筒',
    type: MaterialType.SUPPORT_LAYER,
    price: 15000, // 10000 Base + 5000
    description: '中鋼 2.0mm 線徑。輕柔服貼，貼合身型，適合喜歡軟硬適中的島民。',
    color: 'bg-gray-300',
    thickness: 20,
    benefits: ['服貼', '標準', '舒適'],
    stats: { firmness: 2, breathability: 5 }
  },
  {
    id: 'spring_honeycomb',
    name: '中鋼 2.0mm 蜂巢式獨立筒',
    type: MaterialType.SUPPORT_LAYER,
    price: 15250, // 10000 Base + 5250
    description: '排列密集像蜂巢一樣！支撐點更多，睡感較硬實耐用。',
    color: 'bg-amber-100',
    thickness: 20,
    benefits: ['密集', '硬實', '耐用'],
    stats: { firmness: 3.5, breathability: 5 }
  },
  {
    id: 'spring_23',
    name: '中鋼 2.3mm 硬式獨立筒',
    type: MaterialType.SUPPORT_LAYER,
    price: 15500, // 10000 Base + 5500
    description: '加粗鋼線！硬度更佳，強力護脊，適合喜歡硬床的人。',
    color: 'bg-gray-400',
    thickness: 20,
    benefits: ['護脊', '硬挺', '支撐'],
    stats: { firmness: 4.5, breathability: 5 }
  },
  {
    id: 'spring_5zone',
    name: '五段式分區獨立筒 (含EPE)',
    type: MaterialType.SUPPORT_LAYER,
    price: 18000, // 10000 Base + 6000 + 2000 (EPE)
    description: '根據身型分為2.3/2.0線徑。腰部加強支撐。標配 EPE 護邊！',
    color: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300',
    thickness: 20,
    benefits: ['分區', '人體工學', '護邊'],
    stats: { firmness: 4, breathability: 5 }
  },
  {
    id: 'spring_agro',
    name: '德國 Agro 獨立筒 (含EPE)',
    type: MaterialType.SUPPORT_LAYER,
    price: 20500, // 10000 Base + 8500 + 2000 (EPE)
    description: '四次回火淬鍊！Agro 德國進口，更佳耐用穩固。標配 EPE 護邊！',
    color: 'bg-slate-400',
    thickness: 20,
    benefits: ['德國工藝', '回火', '頂級'],
    stats: { firmness: 4, breathability: 5 }
  },
  {
    id: 'spring_uk',
    name: '英國橄欖球型獨立筒 (含EPE)',
    type: MaterialType.SUPPORT_LAYER,
    price: 22000, // 10000 Base + 10000(Est) + 2000 (EPE)
    description: '橄欖球型彈簧，上下窄中間寬。大幅減少干擾與釋放壓力。標配 EPE 護邊！',
    color: 'bg-indigo-100',
    thickness: 20,
    benefits: ['橄欖球型', '抗干擾', '釋壓'],
    stats: { firmness: 4, breathability: 5 }
  },
];

export const COLLAB_PRODUCTS: Product[] = [
  {
    id: 'claire_type_1',
    name: '軟綿綿雲朵床 (克蕾一型)',
    category: 'Home',
    price: 9999, // Base price display
    variants: [
      { id: 'single_xl', name: '3.5尺 (單人加大)', price: 8999 },
      { id: 'double', name: '5尺 (標準雙人)', price: 9999 },
      { id: 'queen', name: '6尺 (雙人加大)', price: 12999 },
      { id: 'king', name: '7尺 (雙人特大)', price: 15999 },
    ],
    description: '促銷款！一年保固。軟綿綿的雲朵睡感。',
    fullDescription: '克蕾一型 (Claire Type 1) 是海姆島最受歡迎的入門款。使用 2.0mm 線徑獨立筒，搭配 5cm 天然乳膠與舒柔表布，提供輕柔服貼的包覆感。',
    imagePrompt: 'Animal Crossing style 3D render, isometric, cute bedroom, soft white fluffy mattress, clouds decoration',
    galleryPrompts: ['Close up of soft fabric texture', 'Cross section showing latex layer', 'Cute hamster sleeping on it'],
    tags: ['HOT', 'SALE'],
    features: [
      { icon: '☁️', label: '雲端睡感' },
      { icon: '🧴', label: '天然乳膠' },
      { icon: '🧸', label: '親膚絨毛' },
    ],
    specs: [
      { label: '支撐層', value: '2.0線徑獨立筒' },
      { label: '舒適層', value: '5公分天然乳膠' },
      { label: '表布', value: '舒柔表布' },
      { label: '保固', value: '1年保固' },
    ],
    reviews: [
      { author: '莉莉安', rating: 5, content: '真的太舒服了！每天都不想起床～', date: '2023-11-20', helpfulCount: 12, tags: ['超好睡', '軟綿綿'] },
      { author: '雷妮', rating: 4, content: '軟軟的很喜歡，CP值很高。', date: '2023-11-25', helpfulCount: 5, tags: ['CP值高'] },
    ]
  },
  {
    id: 's306',
    name: '堅固龜殼床 (S306)',
    category: 'Home',
    price: 23500, // Base price display
    variants: [
      { id: 'single_xl', name: '3.5尺 (單人加大)', price: 20500 },
      { id: 'double', name: '5尺 (標準雙人)', price: 23500 },
      { id: 'queen', name: '6尺 (雙人加大)', price: 26500 },
      { id: 'king', name: '7尺 (雙人特大)', price: 29500 },
    ],
    description: '15年保固！銀離子抗菌，硬式支撐首選。',
    fullDescription: 'S306 專為需要強力支撐的島民設計。採用 2.3mm 線徑獨立筒，搭配 5cm 高支撐釋壓泡棉與銀離子表布，硬挺護脊，抗菌防臭。',
    imagePrompt: 'Animal Crossing style 3D render, isometric, sturdy mattress, grey and blue tones, shield decoration',
    galleryPrompts: ['Close up of silver ion fabric', 'Cross section showing foam layer', 'Strong bear sitting on it'],
    tags: ['HOT'],
    features: [
      { icon: '🛡️', label: '強力護脊' },
      { icon: '🦠', label: '銀離子抗菌' },
      { icon: '🧱', label: '硬式支撐' },
    ],
    specs: [
      { label: '支撐層', value: '2.3線徑獨立筒' },
      { label: '舒適層', value: '高支撐釋壓泡棉 5cm' },
      { label: '表布', value: '銀離子表布' },
      { label: '保固', value: '15年保固' },
    ],
    reviews: [
      { author: '阿波羅', rating: 5, content: '這才是我要的硬度！腰不酸了！', date: '2023-12-01', helpfulCount: 28, tags: ['護脊', '腰痛救星'] },
    ]
  },
  {
    id: 'neck_pillow',
    name: '工學護頸枕',
    category: 'Pillow',
    price: 1280,
    description: '完美貼合頸部曲線，放鬆整天的疲勞。',
    fullDescription: '符合人體工學設計，有效支撐頸椎，改善睡眠品質。適合長時間低頭抓蟲的島民。',
    imagePrompt: 'Animal Crossing style, ergonomic pillow, white, soft, on a wooden bed',
    galleryPrompts: [],
    tags: [],
    features: [{ icon: '🦴', label: '護頸' }, { icon: '🌙', label: '助眠' }],
    specs: [{ label: '材質', value: '高密度記憶棉' }],
    reviews: []
  },
  {
    id: 'cooling_pillow',
    name: '涼感記憶枕',
    category: 'Pillow',
    price: 1980,
    description: '怕熱必備！瞬間涼感，記憶棉慢回彈。',
    fullDescription: '結合涼感表布與高密度記憶棉，夏天也能睡得清爽舒適。再也不怕睡到滿頭大汗。',
    imagePrompt: 'Animal Crossing style, blue cooling pillow, ice cubes effect, refreshing',
    galleryPrompts: [],
    tags: ['NEW'],
    features: [{ icon: '❄️', label: '涼感' }, { icon: '🌬️', label: '透氣' }],
    specs: [{ label: '材質', value: '涼感記憶棉' }],
    reviews: []
  },
  {
    id: 'potato_pillow',
    name: 'Potato 枕',
    category: 'Pillow',
    price: 1980,
    description: '像馬鈴薯一樣Q軟可愛，隨意揉捏。',
    fullDescription: '特殊造型與材質，提供多種睡姿支撐，或是當作抱枕使用也很合適。外型就像一顆可愛的馬鈴薯！',
    imagePrompt: 'Animal Crossing style, potato shaped pillow, cute face, brown, soft',
    galleryPrompts: [],
    tags: [],
    features: [{ icon: '🥔', label: 'Q軟' }, { icon: '💤', label: '多功能' }],
    specs: [{ label: '材質', value: '特殊棉' }],
    reviews: []
  },
  {
    id: 'protector',
    name: '吸濕透氣保潔墊',
    category: 'Accessory',
    price: 599, // Base price
    variants: [
      { id: 'single_xl', name: '3.5尺 (單人加大)', price: 499 },
      { id: 'double', name: '5尺 (標準雙人)', price: 599 },
      { id: 'queen', name: '6尺 (雙人加大)', price: 699 },
      { id: 'king', name: '7尺 (雙人特大)', price: 799 },
    ],
    description: '保護床墊的好幫手，吸濕快乾。',
    fullDescription: '有效阻隔髒污與汗水，保持床墊清潔衛生，延長使用壽命。每個島民家裡都該備一件！',
    imagePrompt: 'Animal Crossing style, white mattress protector sheet, folded neatly, clean',
    galleryPrompts: [],
    tags: [],
    features: [{ icon: '🛡️', label: '保護' }, { icon: '💧', label: '吸濕' }],
    specs: [{ label: '材質', value: '透氣纖維' }],
    reviews: []
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '為什麼馬毛這麼厲害？',
    date: '2023-10-15',
    excerpt: '床墊界的愛馬仕材料！揭開它透氣排濕的秘密。',
    category: '知識',
    content: '<p>吱吱！大家知道嗎？在海姆島的頂級床墊中，藏著一種珍貴的材料——荷蘭 ENKEV 馬毛！</p><h2>1. 微型空氣管道</h2><p>每一根馬尾毛都有 4 個中空毛孔，就像內建空調一樣，透氣性超級好！</p><h2>2. 吸濕排汗</h2><p>它能迅速帶走睡覺時產生的濕氣，讓你整晚乾爽，不再黏踢踢。</p><h2>3. 彈力支撐</h2><p>經過像編辮子一樣的工法處理，馬毛變成了無數個微型彈簧，耐用度甚至可以用 20 年喔！</p>',
    imagePrompt: 'Animal Crossing style, cute horse character showing mattress material, magnifying glass, educational',
    tags: ['馬毛', '透氣', '頂級'],
    author: '哈姆店長'
  },
  {
    id: '2',
    title: '直排 vs 蜂巢？獨立筒大解密！',
    date: '2023-10-20',
    excerpt: '排列方式不同，睡感也大不同！你是哪一派？',
    category: '選購',
    content: '<p>選床墊時常常聽到「蜂巢式獨立筒」，到底跟一般的有什麼不一樣呢？</p><h2>直排式 (基礎)</h2><p>就像整齊排隊的士兵。優點是干擾性低，翻身不會吵到隔壁的島民，平均分散重量。</p><h2>蜂巢式 (蜜糖)</h2><p>就像蜂窩一樣交錯排列，縫隙變小了，彈簧數量更多！所以支撐性更強，睡起來會比較硬實一點喔！</p>',
    imagePrompt: 'Animal Crossing style, diagram of spring coils, honeycomb pattern vs grid pattern, isometric',
    tags: ['獨立筒', '知識', '比較'],
    author: '哈姆店長'
  },
  {
    id: '3',
    title: '床墊保養小秘訣',
    date: '2023-11-05',
    excerpt: '想要床墊陪你久一點？這幾招一定要學起來！',
    category: '保養',
    content: '<p>買了好床墊，當然要好好愛惜它！</p><ol><li><strong>不要拆表布：</strong> 我們的科技表布設計精密，拆了可能會裝不回去喔！起毛球是正常的物理現象。</li><li><strong>用保潔墊：</strong> 防止汗水或打翻果汁滲透進去，細菌才不會開派對。</li><li><strong>定期轉向：</strong> 每 3-6 個月把床頭床尾調換一下，避免固定位置壓出凹痕（人體壓痕 3cm 內是正常的喔！）。</li><li><strong>不要曬太陽：</strong> 乳膠和泡棉怕紫外線，放在通風處陰乾就好。</li></ol>',
    imagePrompt: 'Animal Crossing style, hamster cleaning mattress, vacuum cleaner, sunshine through window',
    tags: ['保養', '清潔', '耐用'],
    author: '哈姆店長'
  },
  {
    id: '4',
    title: '天然乳膠的 Q 彈秘密',
    date: '2023-11-12',
    excerpt: '為什麼大家都愛泰國來的白色果凍？原來是因為這個...',
    category: '材質',
    content: '<p>吱吱！今天要介紹海姆島超受歡迎的材料——「天然乳膠」！</p><h2>1. 橡膠樹的眼淚</h2><p>它是從珍貴的橡膠樹採集下來的汁液，發泡後變成像海綿蛋糕一樣的結構。</p><h2>2. 天然防蟎</h2><p>乳膠有一種橡膠蛋白酶，塵蟎超級討厭這個味道，所以過敏島民一定要選這個！</p><h2>3. Q彈支撐</h2><p>躺上去會有「ㄉㄨㄞ ㄉㄨㄞ」的感覺，能完美貼合你的身體曲線喔！</p>',
    imagePrompt: 'Animal Crossing style, cute slime character bouncing on latex mattress, rubber trees in background',
    tags: ['乳膠', '防蟎', '舒適'],
    author: '哈姆店長'
  },
  {
    id: '5',
    title: '你的脖子不想努力了嗎？挑枕頭攻略',
    date: '2023-11-20',
    excerpt: '睡醒總是肩頸痠痛？可能是你的枕頭在抗議了！',
    category: '選購',
    content: '<p>哈姆店長發現很多島民都睡錯枕頭了！</p><h2>側睡派</h2><p>你需要高一點的枕頭（像涼感記憶枕），填補脖子和肩膀的空隙。</p><h2>正躺派</h2><p>適合高度適中的枕頭（像護頸枕），下巴和額頭要保持水平喔。</p><h2>趴睡派</h2><p>你需要很低很軟的枕頭（或者乾脆不要枕頭），才不會折到脖子。</p>',
    imagePrompt: 'Animal Crossing style, three different pillows, sleeping positions diagram, cute icons',
    tags: ['枕頭', '護頸', '睡眠'],
    author: '哈姆店長'
  },
  {
    id: '6',
    title: '失眠退散！哈姆的睡前儀式',
    date: '2023-12-01',
    excerpt: '數羊數到天亮？試試看這些放鬆小撇步吧。',
    category: '生活',
    content: '<p>晚上翻來翻去睡不著嗎？試試看哈姆的獨家秘方：</p><ol><li><strong>喝杯熱牛奶：</strong> 溫暖的牛奶能讓身體放鬆。</li><li><strong>遠離 Nook Phone：</strong> 睡前 30 分鐘不要滑手機，藍光會趕走睡意喔！</li><li><strong>聽白噪音：</strong> 下雨聲、營火聲，或是海姆島的海浪聲，都能幫助入睡。</li></ol>',
    imagePrompt: 'Animal Crossing style, hamster sleeping peacefully, moon and stars, warm milk cup',
    tags: ['助眠', '健康', '放鬆'],
    author: '哈姆店長'
  }
];

export const ACHIEVEMENTS: Stamp[] = [
  { id: 'new_resident', name: '新島民', description: '第一次登入海姆島', milesReward: 500, icon: '✈️' },
  { id: 'diy_master', name: 'DIY 達人', description: '嘗試製作一次客製化床墊', milesReward: 300, icon: '🔨' },
  { id: 'shopaholic', name: '購物狂', description: '將商品加入置物籃', milesReward: 100, icon: '🛍️' },
  { id: 'knowledge_seeker', name: '求知若渴', description: '閱讀一篇島民日誌', milesReward: 200, icon: '📖' },
  { id: 'wealthy', name: '鈴錢大亨', description: '購物車總金額超過 50,000', milesReward: 1000, icon: '💰' },
];

export const INITIAL_FAQS: FaqItem[] = [
  { id: '1', category: '配送', question: '下單後多久會收到呢？', answer: '因為床墊都是收到訂單後由職人手工製作，Dodo 配送團隊大約需要 10-14 個工作天會飛到您府上！出發前會打電話跟您約時間喔。' },
  { id: '2', category: '配送', question: '舊床墊可以幫忙回收嗎？', answer: '我們可以幫忙把舊床墊搬下樓（就像搬大頭菜一樣），但回收要請您自行聯絡當地的清潔隊支援喔！' },
  { id: '3', category: '保養', question: '塑膠套要拆嗎？兩面都能睡嗎？', answer: '當然要拆！拆掉才能感受到舒適層的魔力。建議睡有舒適層的那一面（正面），背面是止滑布，睡起來會硬硬的喔！' },
  { id: '4', category: '保養', question: '保固範圍包含什麼？', answer: '我們提供 15 年彈簧結構保固！如果是正常使用下凹陷超過 3.8 公分，我們免費換新！但表布弄髒或是在床上跳壞的就不算喔！' },
  { id: '5', category: '材質', question: '怕悶熱怎麼辦？', answer: '海姆島氣候濕熱，推薦選擇「極地冰川涼感表布」搭配「親水棉」，透氣散熱效果一級棒，夏天也能睡得香甜！' },
  { id: '6', category: '材質', question: '翻身怕吵到人怎麼辦？', answer: '我們的獨立筒都是個別受力，已經將干擾降到最低囉！就像豆狸和粒狸分開結帳一樣互不影響。' },
];
