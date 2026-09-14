import React, { useState } from 'react';
import { PanelData, HanfuSticker } from '../types/hanfu';
import { getFabricStyle } from '../utils/fabricTextures';
import { MotifSvg } from './MotifSvg';
import { Shirt, Sparkles } from 'lucide-react';

interface RobePreviewProps {
  panels: PanelData[];
  stickers: HanfuSticker[];
  robeLengthCm?: number;
}

export const RobePreview: React.FC<RobePreviewProps> = ({
  panels,
  stickers,
  robeLengthCm = 130,
}) => {
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');

  // Panels mapping:
  // 0: 后身片 (Back body)
  // 1: 前身片 (Front body)
  // 2: 广袖主体 (Main broad sleeve)
  // 3: 袖底弧片 (Sweeping lower sleeve arc)
  // 4: 通身领缘 (Collar band strip)
  const backBodyPanel = panels[0] || { id: 0, color: '#891D28', materialId: 'cloud-gauze' };
  const frontBodyPanel = panels[1] || { id: 1, color: '#891D28', materialId: 'cloud-gauze' };
  const sleeveMainPanel = panels[2] || { id: 2, color: '#891D28', materialId: 'cloud-gauze' };
  const sleeveArcPanel = panels[3] || { id: 3, color: '#891D28', materialId: 'cloud-gauze' };
  const collarBandPanel = panels[4] || { id: 4, color: '#FAF7F0', materialId: 'woven-gold' };

  const currentBodyPanel = viewAngle === 'front' ? frontBodyPanel : backBodyPanel;

  // Fabric styles
  const bodyStyle = getFabricStyle(currentBodyPanel.materialId, currentBodyPanel.color);
  const sleeveStyle = getFabricStyle(sleeveMainPanel.materialId, sleeveMainPanel.color);
  const sleeveArcStyle = getFabricStyle(sleeveArcPanel.materialId, sleeveArcPanel.color);
  const collarStyle = getFabricStyle(collarBandPanel.materialId, collarBandPanel.color);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Control row */}
      <div className="w-full max-w-3xl flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
            <Shirt className="w-3.5 h-3.5 text-amber-700" />
            成衣效果
          </span>
        </div>

        {/* View Angle Toggle */}
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

      {/* Draped Robe Display Stage */}
      <div className="w-full max-w-2xl aspect-[1.1/1] bg-gradient-to-b from-stone-100 to-stone-200/90 rounded-2xl border border-stone-200 shadow-inner flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
        {/* Aesthetic background calligraphy */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none font-serif text-8xl text-stone-900 tracking-widest">
          大袖衫
        </div>

        {/* Hanger / Stand Header */}
        <div className="w-64 h-3 bg-stone-700 rounded-full shadow-md mb-2 relative flex items-center justify-center">
          <div className="w-10 h-14 border-2 border-stone-600 rounded-t-full -top-14 absolute -z-0" />
          <div className="w-3.5 h-3.5 rounded-full bg-amber-600 shadow" />
        </div>

        {/* The 3D Draped Garment SVG Container */}
        <div className="w-full max-w-xl h-full relative flex items-center justify-center">
          <svg
            viewBox="0 0 600 520"
            className="w-full h-full max-h-[460px] drop-shadow-xl"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Shadows & linear gradients for folds and sleeve depth */}
              <linearGradient id="sleeve-left-shade" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#000000" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="sleeve-right-shade" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#000000" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="body-center-crease" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
                <stop offset="50%" stopColor="#000000" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="hem-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="70%" stopColor="#000000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Inner neck undergarment (抹胸 / 中衣) for front view */}
            {viewAngle === 'front' && (
              <g id="inner-undergarment">
                <polygon points="270,120 330,120 310,165 290,165" fill="#FAF7F0" />
                <line x1="270" y1="130" x2="330" y2="130" stroke="#E2DCD2" strokeWidth="1" />
                <line x1="275" y1="140" x2="325" y2="140" stroke="#E2DCD2" strokeWidth="1" />
              </g>
            )}

            {/* 1. LEFT SLEEVE (Huge curved draping broad sleeve) */}
            <g id="preview-left-sleeve">
              {/* Outer drape path: from shoulder (240, 80) sweeping down to (40, 240) and deep curve to (100, 390) */}
              <path
                d="M 255 90 L 80 160 C 40 230 40 330 90 380 C 140 430 200 420 250 250 Z"
                fill={sleeveMainPanel.color}
                stroke="#3E2723"
                strokeWidth="1.2"
              />
              {/* Fabric texture overlay */}
              <path
                d="M 255 90 L 80 160 C 40 230 40 330 90 380 C 140 430 200 420 250 250 Z"
                fill="none"
                stroke="url(#sleeve-left-shade)"
                strokeWidth="20"
                opacity="0.7"
              />
              {/* Inner sleeve hollow depth */}
              <path
                d="M 80 160 C 55 210 55 310 90 380 C 70 340 65 240 80 160 Z"
                fill="#1C1D21"
                opacity="0.35"
              />
              {/* Sleeve sweeping fold lines */}
              <path
                d="M 120 220 C 100 290 120 370 150 400"
                fill="none"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="1.5"
              />
              <path
                d="M 160 220 C 145 280 165 350 190 380"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.2"
              />
            </g>

            {/* 2. RIGHT SLEEVE (Symmetrical broad curved sleeve) */}
            <g id="preview-right-sleeve">
              <path
                d="M 345 90 L 520 160 C 560 230 560 330 510 380 C 460 430 400 420 350 250 Z"
                fill={sleeveMainPanel.color}
                stroke="#3E2723"
                strokeWidth="1.2"
              />
              <path
                d="M 345 90 L 520 160 C 560 230 560 330 510 380 C 460 430 400 420 350 250 Z"
                fill="none"
                stroke="url(#sleeve-right-shade)"
                strokeWidth="20"
                opacity="0.7"
              />
              {/* Inner sleeve hollow depth */}
              <path
                d="M 520 160 C 545 210 545 310 510 380 C 530 340 535 240 520 160 Z"
                fill="#1C1D21"
                opacity="0.35"
              />
              {/* Sleeve sweeping fold lines */}
              <path
                d="M 480 220 C 500 290 480 370 450 400"
                fill="none"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="1.5"
              />
              <path
                d="M 440 220 C 455 280 435 350 410 380"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.2"
              />
            </g>

            {/* 3. MAIN BODY (Flowing Robe Silhouette) */}
            <g id="preview-main-body">
              {/* Body polygon flaring slightly to hem */}
              <path
                d="M 255 90 Q 235 150 220 280 L 190 470 Q 300 485 410 470 L 380 280 Q 365 150 345 90 Z"
                fill={currentBodyPanel.color}
                stroke="#3E2723"
                strokeWidth="1.5"
              />
              {/* Body drape lighting and folds */}
              <path
                d="M 255 90 Q 235 150 220 280 L 190 470 Q 300 485 410 470 L 380 280 Q 365 150 345 90 Z"
                fill="url(#body-center-crease)"
              />
              <path
                d="M 190 450 Q 300 465 410 450 L 410 470 Q 300 485 190 470 Z"
                fill="url(#hem-shadow)"
              />

              {/* Vertical drape folds */}
              <path d="M 245 220 Q 235 340 225 465" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              <path d="M 247 220 Q 237 340 227 465" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <path d="M 355 220 Q 365 340 375 465" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              <path d="M 353 220 Q 363 340 373 465" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </g>

            {/* 4. DETAILS FOR FRONT vs BACK */}
            {viewAngle === 'front' ? (
              /* FRONT: 直领对襟 (Straight front lapels with collar band trim) */
              <g id="preview-front-lapels">
                {/* Left Collar Band (running straight down from neck to hem) */}
                <path
                  d="M 275 88 L 285 160 L 285 476 L 273 476 L 273 160 L 263 88 Z"
                  fill={collarBandPanel.color}
                  stroke="#3E2723"
                  strokeWidth="0.8"
                />
                {/* Right Collar Band */}
                <path
                  d="M 325 88 L 315 160 L 315 476 L 327 476 L 327 160 L 337 88 Z"
                  fill={collarBandPanel.color}
                  stroke="#3E2723"
                  strokeWidth="0.8"
                />
                {/* Center front slit */}
                <line x1="300" y1="160" x2="300" y2="476" stroke="rgba(0,0,0,0.4)" strokeWidth="1.2" />
                {/* Collar highlight sheen */}
                <line x1="279" y1="160" x2="279" y2="476" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <line x1="321" y1="160" x2="321" y2="476" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              </g>
            ) : (
              /* BACK: 经典中缝 (Center back seam) + Back collar */
              <g id="preview-back-details">
                {/* Back collar strip */}
                <path
                  d="M 265 88 Q 300 98 335 88 L 332 98 Q 300 108 268 98 Z"
                  fill={collarBandPanel.color}
                  stroke="#3E2723"
                  strokeWidth="0.8"
                />
                {/* Traditional Center Back Seam (中缝) */}
                <line
                  x1="300"
                  y1="98"
                  x2="300"
                  y2="478"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="1.5"
                  strokeDasharray="4,1"
                />
                <line
                  x1="301"
                  y1="98"
                  x2="301"
                  y2="478"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
              </g>
            )}

            {/* Bottom Hem Trim / Binding */}
            <path
              d="M 190 470 Q 300 485 410 470 L 410 474 Q 300 489 190 474 Z"
              fill={collarBandPanel.color}
              stroke="#3E2723"
              strokeWidth="0.6"
              opacity="0.9"
            />

            {/* 5. MOTIFS / STICKERS MAPPING ON DRAPED ROBE */}
            {stickers.map((stk) => {
              // Map 2D flat coordinates to 3D draped garment
              // Sleeve stickers: flat x in 40-70% mapped to right sleeve or left sleeve
              // Chest stickers: flat x in 15-30% mapped to front body
              let cx = 300;
              let cy = 250;
              let scale = 1.0;
              let opacity = 1.0;

              if (stk.x > 35 && stk.x <= 75) {
                // Mapped to Broad Sleeve
                // Right sleeve center: cx ≈ 460, cy ≈ 280
                // Left sleeve center: cx ≈ 140, cy ≈ 280
                cx = 460 + (stk.x - 55) * 4;
                cy = 220 + (stk.y - 45) * 3;
                scale = (stk.width / 14) * 0.9;
              } else if (stk.x <= 35) {
                // Mapped to Body Chest / Back
                if (viewAngle === 'front') {
                  cx = 240 + (stk.x - 18) * 3;
                  cy = 180 + (stk.y - 50) * 2.8;
                  scale = (stk.width / 14) * 0.85;
                } else {
                  cx = 300 + (stk.x - 18) * 3;
                  cy = 200 + (stk.y - 30) * 2.8;
                  scale = (stk.width / 14) * 0.85;
                }
              } else {
                // Hem / Collar
                cx = 300;
                cy = 440;
                scale = (stk.width / 14) * 0.7;
              }

              // Clamp inside visible area
              cx = Math.max(100, Math.min(500, cx));
              cy = Math.max(130, Math.min(460, cy));

              return (
                <g
                  key={`preview-stk-${stk.id}`}
                  transform={`translate(${cx}, ${cy}) rotate(${stk.rotation}) scale(${
                    (stk.flipX ? -1 : 1) * scale
                  }, ${scale})`}
                  opacity={opacity}
                  className="pointer-events-none"
                >
                  <foreignObject x="-40" y="-40" width="80" height="80">
                    <div className="w-full h-full flex items-center justify-center">
                      <MotifSvg
                        motifId={stk.motifId}
                        imgUrl={stk.imgUrl}
                        color={stk.color}
                        className="w-full h-full drop-shadow-md"
                      />
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Garment Spec Footer Badge */}
        <div className="mt-3 flex items-center gap-2 text-xs text-stone-600 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
          <span>衣长 {robeLengthCm}cm</span>
          <span>·</span>
          <span>通袖 210cm</span>
          <span>·</span>
          <span>袖宽 110cm</span>
        </div>
      </div>
    </div>
  );
};
