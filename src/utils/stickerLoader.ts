/**
 * 动态加载 /src/assets/stickers 目录下的全部图片合集
 * 采用双重保证机制：
 * 1. 静态引入内置的高清矢量传统纹样图片（海水江崖、团龙、飞鱼、双凤、仙鹤、宝相花等）；
 * 2. 同时使用 Vite 的 import.meta.glob 机制，随时支持在 /src/assets/stickers/ 文件夹中新增图片。
 */

import baoxiangHuaUrl from '../assets/stickers/baoxiang_hua.svg';
import chanzhiLianUrl from '../assets/stickers/chanzhi_lian.svg';
import feiyuWenUrl from '../assets/stickers/feiyu_wen.svg';
import fuguiMudanUrl from '../assets/stickers/fugui_mudan.svg';
import haishuiJiangyaUrl from '../assets/stickers/haishui_jiangya.svg';
import ruyiXiangyunUrl from '../assets/stickers/ruyi_xiangyun.svg';
import shuangfengWenUrl from '../assets/stickers/shuangfeng_wen.svg';
import tuanlongWenUrl from '../assets/stickers/tuanlong_wen.svg';
import xiangyunXianheUrl from '../assets/stickers/xiangyun_xianhe.svg';
import zhezhiMeihuaUrl from '../assets/stickers/zhezhi_meihua.svg';

export interface DynamicStickerItem {
  id: string;
  url: string;
  aspectRatio: number;
}

// 预定义内置传统纹样
const BUILTIN_STICKERS: DynamicStickerItem[] = [
  { id: 'haishui_jiangya', url: haishuiJiangyaUrl, aspectRatio: 3.3 },
  { id: 'tuanlong_wen', url: tuanlongWenUrl, aspectRatio: 1.0 },
  { id: 'feiyu_wen', url: feiyuWenUrl, aspectRatio: 1.0 },
  { id: 'shuangfeng_wen', url: shuangfengWenUrl, aspectRatio: 1.0 },
  { id: 'xiangyun_xianhe', url: xiangyunXianheUrl, aspectRatio: 1.3 },
  { id: 'baoxiang_hua', url: baoxiangHuaUrl, aspectRatio: 1.0 },
  { id: 'fugui_mudan', url: fuguiMudanUrl, aspectRatio: 1.0 },
  { id: 'chanzhi_lian', url: chanzhiLianUrl, aspectRatio: 1.2 },
  { id: 'ruyi_xiangyun', url: ruyiXiangyunUrl, aspectRatio: 1.6 },
  { id: 'zhezhi_meihua', url: zhezhiMeihuaUrl, aspectRatio: 1.0 },
];

// 使用 Vite 标准 import.meta.glob 动态扫描文件
const globModules = import.meta.glob<string>(
  '../assets/stickers/*.{svg,png,jpg,jpeg,webp}',
  { eager: true, import: 'default' }
);

// 动态读取 SVG 原始文本，用于高保真绣线色彩渐变置换
const rawSvgModules = import.meta.glob<string>(
  '../assets/stickers/*.svg',
  { eager: true, query: '?raw', import: 'default' }
);

export interface ThreadColorConfig {
  name: string;
  hex: string;
  light: string;
  base: string;
  dark: string;
}

export const EMBROIDERY_COLORS: ThreadColorConfig[] = [
  { name: '泥金', hex: '#C29B38', light: '#DFC378', base: '#C29B38', dark: '#8C6721' },
  { name: '银白', hex: '#FAF7F0', light: '#FFFFFF', base: '#FAF7F0', dark: '#9CA3AF' },
  { name: '玄黑', hex: '#1C1D21', light: '#4B5563', base: '#1C1D21', dark: '#000000' },
  { name: '朱砂', hex: '#B23A48', light: '#F87171', base: '#B23A48', dark: '#7F1D1D' },
  { name: '霁蓝', hex: '#2B5B84', light: '#60A5FA', base: '#2B5B84', dark: '#1E3A8A' },
  { name: '翡翠', hex: '#2A7B5F', light: '#6EE7B7', base: '#2A7B5F', dark: '#064E3B' },
  { name: '紫棠', hex: '#632B59', light: '#C084FC', base: '#632B59', dark: '#3B0764' },
];

export function getRawSvg(idOrUrl: string): string | null {
  if (!idOrUrl) return null;
  const cleanKey = idOrUrl.split('/').pop()?.replace(/\.[^/.]+$/, '') || idOrUrl;

  for (const [path, content] of Object.entries(rawSvgModules)) {
    const filename = path.split('/').pop() || '';
    const id = filename.replace(/\.[^/.]+$/, '');
    if (id === cleanKey || id === idOrUrl || path.endsWith(`${idOrUrl}.svg`) || path.endsWith(`${cleanKey}.svg`)) {
      return content;
    }
  }
  return null;
}

export function colorizeSvg(rawSvg: string, color: string = '#C29B38', instanceKey: string = '1'): string {
  if (!rawSvg) return '';

  const preset = EMBROIDERY_COLORS.find(
    (c) => c.hex.toLowerCase() === color.toLowerCase()
  );

  let light = color;
  let base = color;
  let dark = color;

  if (preset) {
    light = preset.light;
    base = preset.base;
    dark = preset.dark;
  } else {
    const hex = color.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const lightR = Math.min(255, Math.round(r * 1.3 + 35));
      const lightG = Math.min(255, Math.round(g * 1.3 + 35));
      const lightB = Math.min(255, Math.round(b * 1.3 + 35));
      const darkR = Math.max(0, Math.round(r * 0.7));
      const darkG = Math.max(0, Math.round(g * 0.7));
      const darkB = Math.max(0, Math.round(b * 0.7));
      light = `rgb(${lightR}, ${lightG}, ${lightB})`;
      base = color;
      dark = `rgb(${darkR}, ${darkG}, ${darkB})`;
    }
  }

  // Safe unique gradient ID per instance and color
  const safeColorHex = color.replace(/[^a-zA-Z0-9]/g, '');
  const safeKey = instanceKey.replace(/[^a-zA-Z0-9_-]/g, '');
  const gradId = `th-grad-${safeKey}-${safeColorHex}`;

  let result = rawSvg;
  // Replace gradient ID
  result = result.replace(/id="gold-grad-[^"]+"/g, `id="${gradId}"`);
  result = result.replace(/url\(#gold-grad-[^)]+\)/g, `url(#${gradId})`);
  result = result.replace(/id="th-grad-[^"]+"/g, `id="${gradId}"`);
  result = result.replace(/url\(#th-grad-[^)]+\)/g, `url(#${gradId})`);

  // Replace gradient stop colors
  result = result.replace(/stopColor="#DFC378"/gi, `stopColor="${light}"`);
  result = result.replace(/stopColor="#C29B38"/gi, `stopColor="${base}"`);
  result = result.replace(/stopColor="#8C6721"/gi, `stopColor="${dark}"`);

  // Ensure root <svg> has 100% width & height
  if (!result.includes('width="100%"')) {
    result = result.replace('<svg ', '<svg width="100%" height="100%" ');
  }

  return result;
}

export function loadDynamicStickers(): DynamicStickerItem[] {
  const map = new Map<string, DynamicStickerItem>();

  // 1. 放入内置基础库
  for (const item of BUILTIN_STICKERS) {
    map.set(item.id, item);
  }

  // 2. 融合动态扫描到的所有图片（支持文件夹内新放入的任何图片）
  try {
    if (globModules && typeof globModules === 'object') {
      for (const [filePath, fileUrl] of Object.entries(globModules)) {
        if (!fileUrl) continue;
        const filename = filePath.split('/').pop() || '';
        const id = filename.replace(/\.[^/.]+$/, '');
        const urlStr = typeof fileUrl === 'string' ? fileUrl : (fileUrl as { default?: string }).default || '';
        if (!urlStr) continue;

        const isHem = id.includes('haishui') || id.includes('jiangya') || id.includes('hem');
        const isCloud = id.includes('xiangyun') || id.includes('ruyi') || id.includes('cloud');
        const aspectRatio = isHem ? 3.3 : isCloud ? 1.6 : 1.0;

        map.set(id, {
          id,
          url: urlStr,
          aspectRatio,
        });
      }
    }
  } catch (err) {
    console.warn('动态扫描贴纸目录异常，已采用内置集:', err);
  }

  return Array.from(map.values());
}
