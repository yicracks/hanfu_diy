

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
