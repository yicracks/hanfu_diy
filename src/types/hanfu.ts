

export type HanfuCategory = 'skirt' | 'robe';

export interface HanfuStyle {
  id: string;
  name: string;
  dynasty: string;
  description: string;
  category: HanfuCategory;
  defaultPanels: number;
  minPanels: number;
  maxPanels: number;
  aspectRatio: number; // width / height
  defaultLengthCm: number;
  defaultWaistCm?: number;
  bustCm?: number;
  sleeveLengthCm?: number;
  sleeveOpeningCm?: number;
  sleeveDepthCm?: number;
  collarWidthCm?: number;
  collarDepthCm?: number;
  collarBandWidthCm?: number;
  panelLabels: string[];
}

export interface PanelData {
  id: number;
  color: string;
  materialId: string;
  label: string;
  widthCm?: number;
  lengthCm?: number;
}

export interface SkirtDimensions {
  panelCount: number;
  skirtLengthCm: number;
  defaultPanelWidthCm: number;
  waistbandHeightCm: number;
}

export interface RobeDimensions {
  garmentLengthCm: number; // 衣长 (图纸标准 130cm, 前后衣长)
  chestCircumferenceCm: number; // 胸围 (图纸标准 116cm, 胸围/4 = 29cm)
  sleeveSpanCm: number; // 通袖长 (图纸标准 210cm, 通袖长/2 = 105cm)
  totalSleeveSpanCm?: number; // 通袖长 (兼容字段)
  sleeveWidthCm: number; // 袖口宽 (图纸标准 110cm)
  sleeveOpeningCm?: number; // 袖口宽 (同义字段)
  sleeveRootDepthCm: number; // 袖肥 (图纸标准 38cm, 肩线至腋下深度)
  neckWidthCm: number; // 横开领口宽 (图纸标准 8.5cm)
  backNeckDepthCm: number; // 后领口深 (图纸标准 2.8cm)
  collarBandWidthCm: number; // 领缘宽 (图纸标准 8cm)
  collarBandLengthCm?: number; // 领缘长 (通常约 268cm)
  hemWidthCm: number; // 下摆半宽 (图纸下摆微展，约 72cm，比上身胸围半宽58cm宽)
  bodyHalfWidthCm?: number; // 上身半宽 (胸围/2 = 58cm 或 胸围/4 = 29cm)
  cuffWidthCm?: number;
  hemFlareRatio?: number; // 下摆微展比
}

export interface HanfuSticker {
  id: string;
  motifId: string;
  imgUrl?: string;
  x: number; // percentage 0-100 on total canvas width
  y: number; // percentage 0-100 on canvas height
  width: number; // percentage width (relative to canvas height or width)
  height: number;
  rotation: number; // degrees
  color: string;
  flipX?: boolean;
  side?: 'front' | 'back';
}

export interface FabricMaterial {
  id: string;
  name: string;
  pinyin: string;
  description: string;
  sheen: 'metallic' | 'satin' | 'matte' | 'gauze' | 'linen';
  patternType: 'gold-weave' | 'jacquard' | 'silk' | 'cloud' | 'linen' | 'plain';
}

export interface TraditionalColor {
  name: string;
  pinyin: string;
  hex: string;
  category: 'red' | 'blue' | 'yellow' | 'green' | 'neutral' | 'purple';
}

export interface MotifDef {
  id: string;
  name: string;
  pinyin: string;
  category: 'hem' | 'cloud' | 'creature' | 'flora' | 'auspicious';
  description: string;
  aspectRatio: number; // w / h
  path: string; // SVG path or SVG elements
}
