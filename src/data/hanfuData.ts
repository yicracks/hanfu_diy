import { HanfuStyle, FabricMaterial, TraditionalColor, MotifDef } from '../types/hanfu';

export const HANFU_STYLES: HanfuStyle[] = [
  {
    id: 'mamianqun',
    name: '明制马面裙',
    dynasty: '明代',
    description: '双马面裙门，两侧对褶',
    category: 'skirt',
    defaultPanels: 8,
    minPanels: 4,
    maxPanels: 16,
    aspectRatio: 2.8, // 展开后的长宽比
    defaultLengthCm: 95,
    defaultWaistCm: 72,
    panelLabels: ['左对褶1', '左对褶2', '前裙门(外)', '前裙门(内)', '右对褶1', '右对褶2', '后裙门(外)', '后裙门(内)'],
  },
  {
    id: 'daxiushan',
    name: '唐宋大袖衫',
    dynasty: '唐宋',
    description: '直领对襟，宽袍广袖',
    category: 'robe',
    defaultPanels: 5,
    minPanels: 3,
    maxPanels: 7,
    aspectRatio: 1.0, // 展开版式接近 1:1 或 1.1:1
    defaultLengthCm: 130, // 衣长 130
    bustCm: 116, // 胸围 116 (胸围/4 = 29)
    sleeveLengthCm: 210, // 通袖长 210 (通袖长/2 = 105)
    sleeveOpeningCm: 110, // 袖口宽 110
    sleeveDepthCm: 38, // 袖肥 38
    collarWidthCm: 8.5, // 横开领宽 8.5
    collarDepthCm: 2.8, // 后领口深 2.8
    collarBandWidthCm: 8, // 领缘宽 8
    panelLabels: ['前身', '后身', '左广袖', '右广袖', '直领领缘'],
  },
];

export const TRADITIONAL_COLORS: TraditionalColor[] = [
  { name: '玄墨', pinyin: 'Xuan Mo', hex: '#1C1D21', category: 'neutral' },
  { name: '黛蓝', pinyin: 'Dai Lan', hex: '#1C3144', category: 'blue' },
  { name: '霁蓝', pinyin: 'Ji Lan', hex: '#2B5B84', category: 'blue' },
  { name: '绛红', pinyin: 'Jiang Hong', hex: '#891D28', category: 'red' },
  { name: '胭脂', pinyin: 'Yan Zhi', hex: '#B23A48', category: 'red' },
  { name: '泥金', pinyin: 'Ni Jin', hex: '#C29B38', category: 'yellow' },
  { name: '鹅黄', pinyin: 'E Huang', hex: '#E5C058', category: 'yellow' },
  { name: '苍绿', pinyin: 'Cang Lu', hex: '#2D5A46', category: 'green' },
  { name: '竹青', pinyin: 'Zhu Qing', hex: '#5B7F61', category: 'green' },
  { name: '远山黛', pinyin: 'Yuan Shan Dai', hex: '#4A626A', category: 'blue' },
  { name: '月白', pinyin: 'Yue Bai', hex: '#D6E4E5', category: 'neutral' },
  { name: '藕荷', pinyin: 'Ou He', hex: '#B09398', category: 'purple' },
  { name: '沉香', pinyin: 'Chen Xiang', hex: '#584334', category: 'neutral' },
  { name: '牙白', pinyin: 'Ya Bai', hex: '#FAF7F0', category: 'neutral' },
  { name: '朱砂', pinyin: 'Zhu Sha', hex: '#D14935', category: 'red' },
  { name: '雪青', pinyin: 'Xue Qing', hex: '#8B7B9E', category: 'purple' },
];

export const FABRIC_MATERIALS: FabricMaterial[] = [
  {
    id: 'woven-gold',
    name: '妆花织金缎',
    pinyin: 'Zhi Jin Duan',
    description: '织金光泽，挺括华贵',
    sheen: 'metallic',
    patternType: 'gold-weave',
  },
  {
    id: 'jacquard-damask',
    name: '缠枝暗花提花',
    pinyin: 'An Hua Ti Hua',
    description: '暗花隐现，细腻光泽',
    sheen: 'satin',
    patternType: 'jacquard',
  },
  {
    id: 'heavy-silk-satin',
    name: '重磅素绉缎',
    pinyin: 'Zhong Bang Duan',
    description: '柔滑垂坠，真丝质感',
    sheen: 'satin',
    patternType: 'silk',
  },
  {
    id: 'cloud-gauze',
    name: '轻透如意云纱',
    pinyin: 'Ru Yi Yun Sha',
    description: '轻盈微透，飘逸清爽',
    sheen: 'gauze',
    patternType: 'cloud',
  },
  {
    id: 'linen-cotton',
    name: '肌理粗纺棉麻',
    pinyin: 'Cu Fang Mian Ma',
    description: '天然竹节，透气质朴',
    sheen: 'linen',
    patternType: 'linen',
  },
  {
    id: 'plain-crepe',
    name: '素罗双绉',
    pinyin: 'Su Luo Shuang Zhou',
    description: '哑光平纹，干爽细腻',
    sheen: 'matte',
    patternType: 'plain',
  },
];

export const TRADITIONAL_MOTIFS: MotifDef[] = [
  {
    id: 'sea-cliff-hem',
    name: '海水江崖',
    pinyin: 'Hai Shui Jiang Ya',
    category: 'hem',
    description: '裙摆横幅底襕',
    aspectRatio: 3.5,
    path: 'hem-sea-cliff',
  },
  {
    id: 'flying-fish',
    name: '飞鱼祥瑞',
    pinyin: 'Fei Yu Xiang Rui',
    category: 'creature',
    description: '双翼飞鱼纹',
    aspectRatio: 1.1,
    path: 'creature-flying-fish',
  },
  {
    id: 'flying-crane',
    name: '仙鹤穿云',
    pinyin: 'Xian He Chuan Yun',
    category: 'creature',
    description: '展翅飞鹤与祥云',
    aspectRatio: 1.2,
    path: 'creature-crane',
  },
  {
    id: 'auspicious-cloud',
    name: '如意祥云',
    pinyin: 'Xiang Yun',
    category: 'cloud',
    description: '传统卷云涡纹',
    aspectRatio: 1.6,
    path: 'cloud-auspicious',
  },
  {
    id: 'baoxiang-flower',
    name: '宝相花团',
    pinyin: 'Bao Xiang Hua',
    category: 'flora',
    description: '吉祥团花纹样',
    aspectRatio: 1.0,
    path: 'flora-baoxiang',
  },
  {
    id: 'lotus-scroll',
    name: '缠枝莲',
    pinyin: 'Chan Zhi Lian',
    category: 'flora',
    description: '连绵缠枝边饰',
    aspectRatio: 2.2,
    path: 'flora-lotus-scroll',
  },
  {
    id: 'ruyi-crest',
    name: '如意纹',
    pinyin: 'Ji Qing Ru Yi',
    category: 'auspicious',
    description: '灵芝首如意饰',
    aspectRatio: 1.0,
    path: 'auspicious-ruyi',
  },
  {
    id: 'dragon-roundel',
    name: '团龙纹',
    pinyin: 'Tuan Long',
    category: 'creature',
    description: '盘龙祥云团窠',
    aspectRatio: 1.0,
    path: 'creature-dragon',
  },
];
