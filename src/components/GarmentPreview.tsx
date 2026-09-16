import React, { useState } from 'react';
import { PanelData, HanfuSticker, HanfuStyle, SkirtDimensions, RobeDimensions } from '../types/hanfu';
import { getFabricStyle } from '../utils/fabricTextures';
import { MotifSvg } from './MotifSvg';
import { Eye, Shirt, Sparkles } from 'lucide-react';
import { RobePreview } from './RobePreview';

interface GarmentPreviewProps {
  currentStyle?: HanfuStyle;
  panels: PanelData[];
  stickers: HanfuSticker[];
  waistbandColor: string;
  skirtLengthCm: number;
  skirtDims?: SkirtDimensions;
  robeDims?: RobeDimensions;
}

export const GarmentPreview: React.FC<GarmentPreviewProps> = ({
  currentStyle,
  panels,
  stickers,
  waistbandColor,
  skirtLengthCm,
  skirtDims,
  robeDims,
}) => {
  // If current style is robe (唐宋大袖衫), render the dedicated RobePreview
  if (currentStyle?.category === 'robe' || currentStyle?.id === 'daxiushan') {
    return (
      <RobePreview
        panels={panels}
        stickers={stickers}
        robeLengthCm={robeDims?.garmentLengthCm || currentStyle.defaultLengthCm || 130}
        robeDims={robeDims}
      />
    );
  }

  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');

  const n = panels.length;
  // Identify key panels for front vs back preview
  // For standard 8 panels:
  // Panels 0, 1: Left pleats
  // Panels 2, 3: Front apron (inner/outer)
  // Panels 4, 5: Right pleats
  // Panels 6, 7: Back apron (inner/outer)
  const frontApronPanel = panels[Math.floor(n / 2) - 1] || panels[0];
  const frontUnderApron = panels[Math.floor(n / 2)] || panels[1];
  const leftPleatPanel = panels[0];
  const rightPleatPanel = panels[Math.min(n - 1, Math.floor(n * 0.75))];
  const backApronPanel = panels[n - 1] || panels[0];

  const currentApron = viewAngle === 'front' ? frontApronPanel : backApronPanel;
  const underApron = viewAngle === 'front' ? frontUnderApron : leftPleatPanel;

  // Filter stickers that fall on the front apron area (roughly x: 30% to 70% in flat pattern)
  // or bottom hem stickers
  const relevantStickers = stickers.filter((stk) => {
    if (viewAngle === 'front') {
      return stk.x >= 25 && stk.x <= 75;
    }
    return stk.x < 30 || stk.x > 70;
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Control row */}
      <div className="w-full max-w-2xl flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-800 flex items-center gap-1.5">
            <Shirt className="w-3.5 h-3.5 text-amber-700" />
            成衣效果
          </span>
        </div>

        {/* View toggle */}
        <div className="inline-flex bg-stone-200/80 p-0.5 rounded-lg border border-stone-300">
          <button
            type="button"
            onClick={() => setViewAngle('front')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewAngle === 'front'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            前身
          </button>
          <button
            type="button"
            onClick={() => setViewAngle('back')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewAngle === 'back'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            后身
          </button>
        </div>
      </div>

      {/* Draped Skirt Display Stage */}
      <div className="w-full max-w-xl aspect-[3/3.8] bg-gradient-to-b from-stone-100 to-stone-200/90 rounded-2xl border border-stone-200 shadow-inner flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Subtle background calligraphy/aesthetic watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none font-serif text-8xl text-stone-900 tracking-widest">
          马面裙
        </div>

        {/* Mannequin / Hanger top anchor */}
        <div className="w-48 h-2.5 bg-stone-700 rounded-full shadow-md mb-1 relative flex items-center justify-center">
          <div className="w-8 h-12 border-2 border-stone-600 rounded-t-full -top-12 absolute -z-0" />
          <div className="w-3 h-3 rounded-full bg-amber-600" />
        </div>

        {/* The Skirt Model */}
        <div className="w-72 sm:w-80 relative flex flex-col items-center filter drop-shadow-xl transition-all duration-500">
          {/* 1. Waistband with ties */}
          <div
            className="w-48 h-6 rounded-t border-t border-x border-stone-300 shadow-sm flex items-center justify-center text-[10px] tracking-wider text-stone-700 font-medium relative z-20"
            style={{ backgroundColor: waistbandColor }}
          >
            <span>腰围 72cm</span>
            {/* Hanging ties */}
            <div
              className="absolute -left-5 top-2 w-7 h-28 border-l-2 border-stone-300 rounded-bl shadow-sm transform -rotate-12 pointer-events-none"
              style={{ backgroundColor: waistbandColor }}
            />
            <div
              className="absolute -right-5 top-2 w-7 h-32 border-r-2 border-stone-300 rounded-br shadow-sm transform rotate-6 pointer-events-none"
              style={{ backgroundColor: waistbandColor }}
            />
          </div>

          {/* 2. Main Skirt Body: Left pleats, Center apron, Right pleats */}
          <div className="w-full relative flex items-stretch h-84 sm:h-96">
            {/* Left Side Pleats (梯级叠褶) */}
            <div className="w-20 sm:w-24 relative overflow-hidden flex shadow-md -mr-2 z-10">
              {[0, 1, 2, 3].map((pIdx) => (
                <div
                  key={pIdx}
                  className="flex-1 h-full transform -skew-x-2 border-r border-black/20 shadow-inner"
                  style={{
                    ...getFabricStyle(leftPleatPanel.materialId, leftPleatPanel.color),
                    filter: `brightness(${0.85 + pIdx * 0.05})`,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-r from-black/25 via-transparent to-black/10" />
                </div>
              ))}
            </div>

            {/* Center Smooth Apron (平整裙门) */}
            <div
              className="flex-1 h-full relative z-20 shadow-2xl border-x border-black/20 overflow-hidden"
              style={getFabricStyle(currentApron.materialId, currentApron.color)}
            >
              {/* Subtle fabric lighting drape highlights */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-white/10 to-black/20 pointer-events-none" />

              {/* Underlying overlap shadow */}
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

              {/* Render stickers that map onto the front apron */}
              {relevantStickers.map((stk) => {
                // Map sticker x relative to center apron
                const apronLeft = ((stk.x - 30) / 40) * 100;
                return (
                  <div
                    key={stk.id}
                    style={{
                      position: 'absolute',
                      left: `${Math.max(10, Math.min(90, apronLeft))}%`,
                      top: `${stk.y}%`,
                      width: `${Math.min(90, stk.width * 2.2)}%`,
                      transform: `translate(-50%, -50%) rotate(${stk.rotation}deg) scaleX(${stk.flipX ? -1 : 1})`,
                    }}
                    className="pointer-events-none drop-shadow-md"
                  >
                    <MotifSvg motifId={stk.motifId} imgUrl={stk.imgUrl} color={stk.color} className="w-full h-auto" />
                  </div>
                );
              })}

              {/* Bottom Hem Guard */}
              <div className="absolute bottom-0 inset-x-0 h-10 border-t border-amber-600/40 bg-black/10" />
            </div>

            {/* Right Side Pleats */}
            <div className="w-20 sm:w-24 relative overflow-hidden flex shadow-md -ml-2 z-10">
              {[3, 2, 1, 0].map((pIdx) => (
                <div
                  key={pIdx}
                  className="flex-1 h-full transform skew-x-2 border-l border-black/20 shadow-inner"
                  style={{
                    ...getFabricStyle(rightPleatPanel.materialId, rightPleatPanel.color),
                    filter: `brightness(${0.85 + pIdx * 0.05})`,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-l from-black/25 via-transparent to-black/10" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom ground shadow */}
          <div className="w-72 h-4 bg-stone-800/20 rounded-full blur-md -mt-1" />
        </div>

        {/* Specs tag */}
        <div className="mt-4 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] text-stone-600 border border-stone-200 shadow-xs flex items-center gap-2">
          <span>裙长 {skirtLengthCm}cm</span>
          <span>·</span>
          <span>腰围 72cm</span>
        </div>
      </div>
    </div>
  );
};
