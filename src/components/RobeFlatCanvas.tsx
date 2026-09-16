import React, { useRef, useState } from 'react';
import { PanelData, HanfuSticker, HanfuStyle, RobeDimensions } from '../types/hanfu';
import { getFabricStyle } from '../utils/fabricTextures';
import { EMBROIDERY_COLORS } from '../utils/stickerLoader';
import { MotifSvg } from './MotifSvg';
import {
  Trash2,
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Check,
  Sparkles,
  Layers,
  Eye,
  Ruler,
  ArrowLeftRight,
} from 'lucide-react';

interface RobeFlatCanvasProps {
  currentStyle: HanfuStyle;
  panels: PanelData[];
  selectedPanelId: number | null;
  onSelectPanel: (id: number | null) => void;
  stickers: HanfuSticker[];
  selectedStickerId: string | null;
  onSelectSticker: (id: string | null) => void;
  onUpdateSticker: (id: string, updates: Partial<HanfuSticker>) => void;
  onDeleteSticker: (id: string) => void;
  robeDims?: RobeDimensions;
}

export const RobeFlatCanvas: React.FC<RobeFlatCanvasProps> = ({
  currentStyle,
  panels,
  selectedPanelId,
  onSelectPanel,
  stickers,
  selectedStickerId,
  onSelectSticker,
  onUpdateSticker,
  onDeleteSticker,
  robeDims,
}) => {
  const frontContainerRef = useRef<HTMLDivElement>(null);
  const backContainerRef = useRef<HTMLDivElement>(null);

  const [activeSideView, setActiveSideView] = useState<'both' | 'front' | 'back'>('both');
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    stickerId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    container: HTMLDivElement;
  } | null>(null);

  // Panels mapping:
  // 0: 前身 (Front body)
  // 1: 后身 (Back body)
  // 2: 左广袖 (Left broad sleeve)
  // 3: 右广袖 (Right broad sleeve)
  // 4: 直领领缘 (Collar bands)
  const frontBodyPanel = panels[0] || { id: 0, color: '#891D28', materialId: 'cloud-gauze', label: '前身' };
  const backBodyPanel = panels[1] || { id: 1, color: '#891D28', materialId: 'cloud-gauze', label: '后身' };
  const leftSleevePanel = panels[2] || { id: 2, color: '#891D28', materialId: 'cloud-gauze', label: '左广袖' };
  const rightSleevePanel = panels[3] || { id: 3, color: '#891D28', materialId: 'cloud-gauze', label: '右广袖' };
  const collarBandPanel = panels[4] || { id: 4, color: '#FAF7F0', materialId: 'woven-gold', label: '直领领缘' };

  // Dynamic dimensions based on user inputs (参考图纸设计参数)
  const span = robeDims?.sleeveSpanCm ?? robeDims?.totalSleeveSpanCm ?? 210;
  const length = robeDims?.garmentLengthCm ?? 130;
  const sleeveWidth = robeDims?.sleeveWidthCm ?? 110;
  const collarBand = robeDims?.collarBandWidthCm ?? 8;
  const chestCirc = robeDims?.chestCircumferenceCm ?? 116;
  const chestQuarter = Math.round(chestCirc / 4); // 29cm
  const sleeveRoot = robeDims?.sleeveRootDepthCm ?? 38; // 袖肥 38cm
  const neckWidth = robeDims?.neckWidthCm ?? 8.5; // 横开领口宽 8.5cm
  const backNeckDepth = robeDims?.backNeckDepthCm ?? 2.8; // 后领口深 2.8cm
  const userHemWidth = robeDims?.hemWidthCm ?? 72; // 半身下摆宽 (cm)
  const userUpperWidth = robeDims?.bodyHalfWidthCm ?? (chestQuarter * 2); // 58cm

  // Geometry coordinate system (Directly modeled from the user's authentic reference drawing)
  const cx = 300;
  const sy = 68;

  // Relative coordinate math:
  // Base: span 210cm = 520px (from 40 to 560) => 2.476 px/cm
  const pxPerSpan = 520 / 210;
  const halfSpan = (span / 2) * pxPerSpan;
  const leftCuffX = cx - halfSpan;
  const rightCuffX = cx + halfSpan;

  // Sleeve width (cuff drop): base 110cm = 200px => 1.818 px/cm
  const pxPerSleeveWidth = 200 / 110;
  const cuffHeightPx = sleeveWidth * pxPerSleeveWidth;
  const cuffBottomY = sy + cuffHeightPx;

  // Garment length: base 130cm = 515px => 3.9615 px/cm
  const pxPerLength = 515 / 130;
  const lengthPx = length * pxPerLength;
  const hemCenterY = sy + lengthPx;
  const hemCornersY = hemCenterY - 14;

  // Collar band width: base 8cm = 24px wide (12px each side of center)
  const collarHalfW = Math.max(6, (collarBand / 8) * 12);
  const collarLeftX = cx - collarHalfW;
  const collarRightX = cx + collarHalfW;

  // Sleeve seam (接袖缝) - in reference drawing it sits roughly 38% from cuff to center
  const leftSeamX = leftCuffX + (cx - leftCuffX) * 0.38;
  const rightSeamX = rightCuffX - (rightCuffX - cx) * 0.38;

  // Upper body chest & armpit slit apex:
  // Upper body half-width at chest/shoulder root derived from chestQuarter (29cm)
  const chestHalfPx = Math.max(42, Math.min(75, Math.round((chestQuarter * 2) * 0.93))); // ~54px
  const armpitLeftX = cx - chestHalfPx; // ~246
  const armpitRightX = cx + chestHalfPx; // ~354
  // Armpit apex depth based on sleeve root (袖肥 38cm)
  const armpitY = sy + Math.max(75, Math.min(180, Math.round(sleeveRoot * 2.8))); // ~174px

  // Bottom Hem Width (下摆比上面稍微宽一点，呈传统优雅微展A字轮廓)
  const flareRatio = Math.max(1.15, Math.min(1.65, userHemWidth / userUpperWidth));
  const hemHalfPx = Math.round(chestHalfPx * flareRatio); // ~73px (227 to 373 => total 146px vs 108px)
  const hemLeftX = cx - hemHalfPx; // 227 (angles outward from 246)
  const hemRightX = cx + hemHalfPx; // 373 (angles outward from 354)

  // Dynamic ViewBox
  const minX = Math.min(-15, leftCuffX - 35);
  const maxX = Math.max(615, rightCuffX + 35);
  const minY = 10;
  const maxY = Math.max(650, hemCenterY + 45, cuffBottomY + 35);
  const vbWidth = maxX - minX;
  const vbHeight = maxY - minY;
  const dynamicViewBox = `${minX} ${minY} ${vbWidth} ${vbHeight}`;

  // Pieces quick config for top selection pills
  const piecesConfig = [
    { id: 0, panel: frontBodyPanel, name: '前身' },
    { id: 1, panel: backBodyPanel, name: '后身' },
    { id: 2, panel: leftSleevePanel, name: '左广袖' },
    { id: 3, panel: rightSleevePanel, name: '右广袖' },
    { id: 4, panel: collarBandPanel, name: '直领领缘' },
  ];

  // Drag sticker handler
  const handleStickerMouseDown = (
    e: React.MouseEvent,
    sticker: HanfuSticker,
    targetContainer: HTMLDivElement | null
  ) => {
    e.stopPropagation();
    onSelectSticker(sticker.id);
    onSelectPanel(null);

    if (!targetContainer) return;

    setIsDragging(true);
    dragStartRef.current = {
      stickerId: sticker.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: sticker.x,
      origY: sticker.y,
      container: targetContainer,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const rect = dragStartRef.current.container.getBoundingClientRect();
      const deltaX = ((moveEvent.clientX - dragStartRef.current.startX) / rect.width) * 100;
      const deltaY = ((moveEvent.clientY - dragStartRef.current.startY) / rect.height) * 100;

      const newX = Math.max(5, Math.min(95, dragStartRef.current.origX + deltaX));
      const newY = Math.max(8, Math.min(92, dragStartRef.current.origY + deltaY));

      onUpdateSticker(dragStartRef.current.stickerId, {
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const selectedSticker = stickers.find((s) => s.id === selectedStickerId);

  // SVG Geometry Paths based on the user's reference drawing & dynamic parameters
  // 1. Left sleeve outer boundary (大袖袖身：肩部平直、袖口垂顺、底弧向上收拢至袖根开衩)
  const leftSleevePath = `M ${armpitLeftX} ${sy} L ${leftCuffX} ${sy} L ${leftCuffX} ${cuffBottomY} L ${leftSeamX} ${cuffBottomY} C ${(leftSeamX + armpitLeftX) / 2 + 18} ${cuffBottomY} ${armpitLeftX - 32} ${cuffBottomY - 14} ${armpitLeftX - 14} ${armpitY + 48} C ${armpitLeftX - 5} ${armpitY + 26} ${armpitLeftX - 1} ${armpitY + 10} ${armpitLeftX} ${armpitY} L ${armpitLeftX} ${sy} Z`;

  // 2. Right sleeve outer boundary (右大袖对称)
  const rightSleevePath = `M ${armpitRightX} ${sy} L ${rightCuffX} ${sy} L ${rightCuffX} ${cuffBottomY} L ${rightSeamX} ${cuffBottomY} C ${(rightSeamX + armpitRightX) / 2 - 18} ${cuffBottomY} ${armpitRightX + 32} ${cuffBottomY - 14} ${armpitRightX + 14} ${armpitY + 48} C ${armpitRightX + 5} ${armpitY + 26} ${armpitRightX + 1} ${armpitY + 10} ${armpitRightX} ${armpitY} L ${armpitRightX} ${sy} Z`;

  // 3. Front View: Left Front Body (左前身：正身上窄下宽，侧摆向外倾斜微展)
  const frontLeftBodyPath = `M ${collarLeftX} ${sy} L ${armpitLeftX} ${sy} L ${armpitLeftX} ${armpitY} L ${hemLeftX} ${hemCornersY} Q ${(hemLeftX + collarLeftX) / 2} ${hemCenterY - 2} ${collarLeftX} ${hemCenterY - 2} Z`;

  // 4. Front View: Right Front Body (右前身：正身向外微展对称)
  const frontRightBodyPath = `M ${collarRightX} ${sy} L ${armpitRightX} ${sy} L ${armpitRightX} ${armpitY} L ${hemRightX} ${hemCornersY} Q ${(hemRightX + collarRightX) / 2} ${hemCenterY - 2} ${collarRightX} ${hemCenterY - 2} Z`;

  // 5. Front View: Straight Collar Band (直领通身领缘：对襟直下至下摆)
  const frontCollarBandPath = `M ${collarLeftX} ${sy} L ${cx - 10} 46 L ${cx + 10} 46 L ${collarRightX} ${sy} L ${collarRightX} ${hemCenterY - 2} L ${cx} ${hemCenterY} L ${collarLeftX} ${hemCenterY - 2} Z`;

  // 6. Back View: Left Back Body (左后身：从后领到下摆，侧摆外展)
  const backLeftBodyPath = `M ${cx} ${sy} L ${collarLeftX} ${sy} L ${armpitLeftX} ${sy} L ${armpitLeftX} ${armpitY} L ${hemLeftX} ${hemCornersY} Q ${(hemLeftX + cx) / 2} ${hemCenterY} ${cx} ${hemCenterY} Z`;

  // 7. Back View: Right Back Body (右后身：后中缝对称外展)
  const backRightBodyPath = `M ${cx} ${sy} L ${collarRightX} ${sy} L ${armpitRightX} ${sy} L ${armpitRightX} ${armpitY} L ${hemRightX} ${hemCornersY} Q ${(hemRightX + cx) / 2} ${hemCenterY} ${cx} ${hemCenterY} Z`;

  // 8. Back View: Back Neck Collar (后领缘)
  const backNeckCollarPath = `M ${collarLeftX} ${sy} L ${cx - 10} 46 L ${cx + 10} 46 L ${collarRightX} ${sy} Q ${cx} 68 ${collarLeftX} ${sy} Z`;

  // Render a garment diagram (Front or Back)
  const renderGarmentSvg = (side: 'front' | 'back') => {
    const isFront = side === 'front';

    // Piece selection flags
    const isFrontBodySelected = selectedPanelId === 0;
    const isBackBodySelected = selectedPanelId === 1;
    const isLeftSleeveSelected = selectedPanelId === 2;
    const isRightSleeveSelected = selectedPanelId === 3;
    const isCollarSelected = selectedPanelId === 4;

    const bodyPanel = isFront ? frontBodyPanel : backBodyPanel;
    const isBodySelected = isFront ? isFrontBodySelected : isBackBodySelected;
    const bodyFabricStyle = getFabricStyle(bodyPanel.materialId, bodyPanel.color);
    const leftSleeveFabricStyle = getFabricStyle(leftSleevePanel.materialId, leftSleevePanel.color);
    const rightSleeveFabricStyle = getFabricStyle(rightSleevePanel.materialId, rightSleevePanel.color);
    const collarFabricStyle = getFabricStyle(collarBandPanel.materialId, collarBandPanel.color);

    return (
      <svg
        viewBox={dynamicViewBox}
        className="w-full h-full absolute inset-0"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id={`${side}-clip-left-sleeve`}>
            <path d={leftSleevePath} />
          </clipPath>
          <clipPath id={`${side}-clip-right-sleeve`}>
            <path d={rightSleevePath} />
          </clipPath>
          {isFront ? (
            <>
              <clipPath id="front-clip-left-body">
                <path d={frontLeftBodyPath} />
              </clipPath>
              <clipPath id="front-clip-right-body">
                <path d={frontRightBodyPath} />
              </clipPath>
              <clipPath id="front-clip-collar">
                <path d={frontCollarBandPath} />
              </clipPath>
            </>
          ) : (
            <>
              <clipPath id="back-clip-left-body">
                <path d={backLeftBodyPath} />
              </clipPath>
              <clipPath id="back-clip-right-body">
                <path d={backRightBodyPath} />
              </clipPath>
              <clipPath id="back-clip-collar">
                <path d={backNeckCollarPath} />
              </clipPath>
            </>
          )}
        </defs>

        {/* 1. LEFT SLEEVE (左广袖) */}
        <g
          id={`${side}-piece-left-sleeve`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectSticker(null);
            onSelectPanel(2);
          }}
          className="cursor-pointer group"
        >
          <g clipPath={`url(#${side}-clip-left-sleeve)`}>
            <foreignObject x={minX} y={minY} width={vbWidth} height={vbHeight}>
              <div
                style={leftSleeveFabricStyle}
                className={`w-full h-full transition-all duration-200 ${
                  isLeftSleeveSelected ? 'brightness-105' : 'group-hover:brightness-95'
                }`}
              />
            </foreignObject>
          </g>
          <path
            d={leftSleevePath}
            fill="none"
            stroke={isLeftSleeveSelected ? '#D97706' : '#292524'}
            strokeWidth={isLeftSleeveSelected ? '3.5' : '1.8'}
            strokeLinejoin="round"
          />
          {/* 接袖缝 (Sleeve Extension Seam) */}
          <line
            x1={leftSeamX}
            y1={sy}
            x2={leftSeamX}
            y2={cuffBottomY}
            stroke={isLeftSleeveSelected ? '#D97706' : '#44403C'}
            strokeWidth="1.2"
          />
          {isLeftSleeveSelected && (
            <path
              d={leftSleevePath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="6"
              strokeOpacity="0.35"
              strokeLinejoin="round"
              className="animate-pulse"
            />
          )}
        </g>

        {/* 2. RIGHT SLEEVE (右广袖) */}
        <g
          id={`${side}-piece-right-sleeve`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectSticker(null);
            onSelectPanel(3);
          }}
          className="cursor-pointer group"
        >
          <g clipPath={`url(#${side}-clip-right-sleeve)`}>
            <foreignObject x={minX} y={minY} width={vbWidth} height={vbHeight}>
              <div
                style={rightSleeveFabricStyle}
                className={`w-full h-full transition-all duration-200 ${
                  isRightSleeveSelected ? 'brightness-105' : 'group-hover:brightness-95'
                }`}
              />
            </foreignObject>
          </g>
          <path
            d={rightSleevePath}
            fill="none"
            stroke={isRightSleeveSelected ? '#D97706' : '#292524'}
            strokeWidth={isRightSleeveSelected ? '3.5' : '1.8'}
            strokeLinejoin="round"
          />
          {/* 接袖缝 (Sleeve Extension Seam) */}
          <line
            x1={rightSeamX}
            y1={sy}
            x2={rightSeamX}
            y2={cuffBottomY}
            stroke={isRightSleeveSelected ? '#D97706' : '#44403C'}
            strokeWidth="1.2"
          />
          {isRightSleeveSelected && (
            <path
              d={rightSleevePath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="6"
              strokeOpacity="0.35"
              strokeLinejoin="round"
              className="animate-pulse"
            />
          )}
        </g>

        {/* 3. BODY PANELS (前身 / 后身) */}
        {isFront ? (
          /* FRONT VIEW BODY */
          <g
            id="front-piece-body"
            onClick={(e) => {
              e.stopPropagation();
              onSelectSticker(null);
              onSelectPanel(0);
            }}
            className="cursor-pointer group"
          >
            {/* Left Front Body */}
            <g clipPath="url(#front-clip-left-body)">
              <foreignObject x={minX} y={minY} width={vbWidth} height={vbHeight}>
                <div
                  style={bodyFabricStyle}
                  className={`w-full h-full transition-all duration-200 ${
                    isBodySelected ? 'brightness-105' : 'group-hover:brightness-95'
                  }`}
                />
              </foreignObject>
            </g>
            <path
              d={frontLeftBodyPath}
              fill="none"
              stroke={isBodySelected ? '#D97706' : '#292524'}
              strokeWidth={isBodySelected ? '3.5' : '1.8'}
              strokeLinejoin="round"
            />

            {/* Right Front Body */}
            <g clipPath="url(#front-clip-right-body)">
              <foreignObject x={minX} y={minY} width={vbWidth} height={vbHeight}>
                <div
                  style={bodyFabricStyle}
                  className={`w-full h-full transition-all duration-200 ${
                    isBodySelected ? 'brightness-105' : 'group-hover:brightness-95'
                  }`}
                />
              </foreignObject>
            </g>
            <path
              d={frontRightBodyPath}
              fill="none"
              stroke={isBodySelected ? '#D97706' : '#292524'}
              strokeWidth={isBodySelected ? '3.5' : '1.8'}
              strokeLinejoin="round"
            />

            {isBodySelected && (
              <>
                <path
                  d={frontLeftBodyPath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeOpacity="0.35"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
                <path
                  d={frontRightBodyPath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeOpacity="0.35"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
              </>
            )}
          </g>
        ) : (
          /* BACK VIEW BODY */
          <g
            id="back-piece-body"
            onClick={(e) => {
              e.stopPropagation();
              onSelectSticker(null);
              onSelectPanel(1);
            }}
            className="cursor-pointer group"
          >
            {/* Left Back Body */}
            <g clipPath="url(#back-clip-left-body)">
              <foreignObject x={minX} y={minY} width={vbWidth} height={vbHeight}>
                <div
                  style={bodyFabricStyle}
                  className={`w-full h-full transition-all duration-200 ${
                    isBodySelected ? 'brightness-105' : 'group-hover:brightness-95'
                  }`}
                />
              </foreignObject>
            </g>
            <path
              d={backLeftBodyPath}
              fill="none"
              stroke={isBodySelected ? '#D97706' : '#292524'}
              strokeWidth={isBodySelected ? '3.5' : '1.8'}
              strokeLinejoin="round"
            />

            {/* Right Back Body */}
            <g clipPath="url(#back-clip-right-body)">
              <foreignObject x={minX} y={minY} width={vbWidth} height={vbHeight}>
                <div
                  style={bodyFabricStyle}
                  className={`w-full h-full transition-all duration-200 ${
                    isBodySelected ? 'brightness-105' : 'group-hover:brightness-95'
                  }`}
                />
              </foreignObject>
            </g>
            <path
              d={backRightBodyPath}
              fill="none"
              stroke={isBodySelected ? '#D97706' : '#292524'}
              strokeWidth={isBodySelected ? '3.5' : '1.8'}
              strokeLinejoin="round"
            />

            {/* 背中缝 (Center Back Seam - Single continuous straight line) */}
            <line
              x1={cx}
              y1={sy}
              x2={cx}
              y2={hemCenterY}
              stroke={isBodySelected ? '#D97706' : '#292524'}
              strokeWidth="1.8"
            />

            {isBodySelected && (
              <>
                <path
                  d={backLeftBodyPath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeOpacity="0.35"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
                <path
                  d={backRightBodyPath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeOpacity="0.35"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
              </>
            )}
          </g>
        )}

        {/* 4. COLLAR BANDS (领缘) */}
        {isFront ? (
          /* FRONT COLLAR: Straight down to bottom hem */
          <g
            id="front-piece-collar"
            onClick={(e) => {
              e.stopPropagation();
              onSelectSticker(null);
              onSelectPanel(4);
            }}
            className="cursor-pointer group"
          >
            <g clipPath="url(#front-clip-collar)">
              <foreignObject x={minX} y={minY} width={vbWidth} height={vbHeight}>
                <div
                  style={collarFabricStyle}
                  className={`w-full h-full transition-all duration-200 ${
                    isCollarSelected ? 'brightness-105' : 'group-hover:brightness-95'
                  }`}
                />
              </foreignObject>
            </g>
            <path
              d={frontCollarBandPath}
              fill="none"
              stroke={isCollarSelected ? '#D97706' : '#292524'}
              strokeWidth={isCollarSelected ? '3.5' : '1.8'}
              strokeLinejoin="round"
            />
            {/* Center front opening seam (对襟门襟缝) */}
            <line
              x1={cx}
              y1={sy}
              x2={cx}
              y2={hemCenterY}
              stroke={isCollarSelected ? '#D97706' : '#292524'}
              strokeWidth="1.6"
            />
            {isCollarSelected && (
              <path
                d={frontCollarBandPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="6"
                strokeOpacity="0.35"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            )}
          </g>
        ) : (
          /* BACK COLLAR: Back neck band arch */
          <g
            id="back-piece-collar"
            onClick={(e) => {
              e.stopPropagation();
              onSelectSticker(null);
              onSelectPanel(4);
            }}
            className="cursor-pointer group"
          >
            <g clipPath="url(#back-clip-collar)">
              <foreignObject x={minX} y={minY} width={vbWidth} height={vbHeight}>
                <div
                  style={collarFabricStyle}
                  className={`w-full h-full transition-all duration-200 ${
                    isCollarSelected ? 'brightness-105' : 'group-hover:brightness-95'
                  }`}
                />
              </foreignObject>
            </g>
            <path
              d={backNeckCollarPath}
              fill="none"
              stroke={isCollarSelected ? '#D97706' : '#292524'}
              strokeWidth={isCollarSelected ? '3.5' : '1.8'}
              strokeLinejoin="round"
            />
            {isCollarSelected && (
              <path
                d={backNeckCollarPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="6"
                strokeOpacity="0.35"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            )}
          </g>
        )}

        {/* 5. SEAM HIGHLIGHTS & INTERNAL LINES (参考形制图结构线) */}
        {/* Armhole Seams (袖根/挂肩缝：自肩连贯至袖底开衩顶端) */}
        <line x1={armpitLeftX} y1={sy} x2={armpitLeftX} y2={armpitY} stroke="#292524" strokeWidth="1.8" />
        <line x1={armpitRightX} y1={sy} x2={armpitRightX} y2={armpitY} stroke="#292524" strokeWidth="1.8" />

        {/* Slit inner contour curves under armpit (腋下袖裉微圆开衩与放量) */}
        <path
          d={`M ${armpitLeftX} ${armpitY} C ${armpitLeftX - 4} ${armpitY + 20} ${armpitLeftX - 12} ${armpitY + 40} ${armpitLeftX - 24} ${armpitY + 56}`}
          fill="none"
          stroke="#44403C"
          strokeWidth="1.3"
          strokeDasharray="2,2"
        />
        <path
          d={`M ${armpitRightX} ${armpitY} C ${armpitRightX + 4} ${armpitY + 20} ${armpitRightX + 12} ${armpitY + 40} ${armpitRightX + 24} ${armpitY + 56}`}
          fill="none"
          stroke="#44403C"
          strokeWidth="1.3"
          strokeDasharray="2,2"
        />

        {/* 6. TECHNICAL DIMENSION ANNOTATIONS (Real-time dynamic from robeDims) */}
        {showDimensions && (
          <g className="pointer-events-none text-stone-500 font-mono text-[10px] opacity-80">
            {/* Top sleeve span line (通袖) */}
            <line
              x1={leftCuffX}
              y1={sy - 35}
              x2={rightCuffX}
              y2={sy - 35}
              stroke="#78716C"
              strokeWidth="0.9"
              strokeDasharray="3,3"
            />
            <line x1={leftCuffX} y1={sy - 42} x2={leftCuffX} y2={sy - 28} stroke="#78716C" strokeWidth="0.9" />
            <line x1={rightCuffX} y1={sy - 42} x2={rightCuffX} y2={sy - 28} stroke="#78716C" strokeWidth="0.9" />
            <text x={cx} y={sy - 40} fill="#57534E" fontSize="11" textAnchor="middle" fontWeight="bold">
              通袖 {span}cm
            </text>

            {/* Cuff height (袖宽) */}
            <line
              x1={leftCuffX - 18}
              y1={sy}
              x2={leftCuffX - 18}
              y2={cuffBottomY}
              stroke="#78716C"
              strokeWidth="0.9"
              strokeDasharray="3,3"
            />
            <line x1={leftCuffX - 24} y1={sy} x2={leftCuffX - 12} y2={sy} stroke="#78716C" strokeWidth="0.9" />
            <line
              x1={leftCuffX - 24}
              y1={cuffBottomY}
              x2={leftCuffX - 12}
              y2={cuffBottomY}
              stroke="#78716C"
              strokeWidth="0.9"
            />
            <text
              x={leftCuffX - 22}
              y={sy + cuffHeightPx / 2}
              fill="#57534E"
              fontSize="10"
              textAnchor="end"
              dominantBaseline="middle"
            >
              袖宽 {sleeveWidth}cm
            </text>

            {/* Length (衣长) */}
            <line
              x1={rightCuffX + 18}
              y1={sy}
              x2={rightCuffX + 18}
              y2={hemCenterY}
              stroke="#78716C"
              strokeWidth="0.9"
              strokeDasharray="3,3"
            />
            <line x1={rightCuffX + 12} y1={sy} x2={rightCuffX + 24} y2={sy} stroke="#78716C" strokeWidth="0.9" />
            <line
              x1={rightCuffX + 12}
              y1={hemCenterY}
              x2={rightCuffX + 24}
              y2={hemCenterY}
              stroke="#78716C"
              strokeWidth="0.9"
            />
            <text
              x={rightCuffX + 22}
              y={sy + lengthPx / 2}
              fill="#57534E"
              fontSize="10"
              textAnchor="start"
              dominantBaseline="middle"
            >
              衣长 {length}cm
            </text>

            {/* Chest quarter & Sleeve Root Annotations (胸围/4 与 袖肥) */}
            <line
              x1={armpitLeftX}
              y1={armpitY - 6}
              x2={cx}
              y2={armpitY - 6}
              stroke="#B45309"
              strokeWidth="0.9"
              strokeDasharray="2,2"
            />
            <text
              x={(armpitLeftX + cx) / 2}
              y={armpitY - 10}
              fill="#B45309"
              fontSize="9"
              textAnchor="middle"
              fontWeight="bold"
            >
              胸围/4 = {chestQuarter}cm
            </text>

            {/* Sleeve Root (袖肥) */}
            <line
              x1={armpitLeftX - 6}
              y1={sy}
              x2={armpitLeftX - 6}
              y2={armpitY}
              stroke="#B45309"
              strokeWidth="0.9"
              strokeDasharray="2,2"
            />
            <text
              x={armpitLeftX - 9}
              y={(sy + armpitY) / 2}
              fill="#B45309"
              fontSize="9"
              textAnchor="end"
              dominantBaseline="middle"
              fontWeight="bold"
            >
              袖肥 {sleeveRoot}cm
            </text>

            {/* Bottom Hem Width Line (下摆微展宽度标注) */}
            <line
              x1={hemLeftX}
              y1={hemCenterY + 18}
              x2={hemRightX}
              y2={hemCenterY + 18}
              stroke="#78716C"
              strokeWidth="0.9"
              strokeDasharray="3,3"
            />
            <line x1={hemLeftX} y1={hemCenterY + 12} x2={hemLeftX} y2={hemCenterY + 24} stroke="#78716C" strokeWidth="0.9" />
            <line x1={hemRightX} y1={hemCenterY + 12} x2={hemRightX} y2={hemCenterY + 24} stroke="#78716C" strokeWidth="0.9" />
            <text
              x={cx}
              y={hemCenterY + 14}
              fill="#57534E"
              fontSize="10"
              textAnchor="middle"
              fontWeight="bold"
            >
              下摆半宽 {userHemWidth}cm (下摆/4={Math.round(userHemWidth / 2)}cm · 微展+{Math.round(userHemWidth / 2 - chestQuarter)}cm) · 整摆 {userHemWidth * 2}cm
            </text>

            {/* Feature tags */}
            {isFront ? (
              <text x={cx} y={hemCenterY + 36} fill="#78716C" fontSize="10" textAnchor="middle">
                直领通身门襟 (宽{collarBand}cm · 横开{neckWidth}cm) · 对襟 · 下摆比上面微展
              </text>
            ) : (
              <text x={cx} y={hemCenterY + 36} fill="#78716C" fontSize="10" textAnchor="middle">
                背中缝贯通 ({length}cm) · 后领深{backNeckDepth}cm · 接袖对称 · A字微展轮廓
              </text>
            )}
          </g>
        )}
      </svg>
    );
  };

  // Filter stickers by side
  const frontStickers = stickers.filter((s) => s.side !== 'back');
  const backStickers = stickers.filter((s) => s.side === 'back');

  // Render sticker overlay on a container
  const renderStickersOverlay = (side: 'front' | 'back') => {
    const list = side === 'front' ? frontStickers : backStickers;
    const containerEl = side === 'front' ? frontContainerRef.current : backContainerRef.current;

    return (
      <div className="absolute inset-0 pointer-events-none">
        {list.map((stk) => {
          const isStkSelected = stk.id === selectedStickerId;

          return (
            <div
              key={stk.id}
              id={`robe-sticker-${stk.id}`}
              style={{
                position: 'absolute',
                left: `${stk.x}%`,
                top: `${stk.y}%`,
                width: `${stk.width}%`,
                transform: `translate(-50%, -50%) rotate(${stk.rotation}deg) scaleX(${
                  stk.flipX ? -1 : 1
                })`,
                cursor: isDragging && isStkSelected ? 'grabbing' : 'grab',
              }}
              className={`pointer-events-auto transition-transform ${
                isStkSelected
                  ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-transparent z-20'
                  : 'hover:outline-1 hover:outline-dashed hover:outline-amber-400'
              }`}
              onMouseDown={(e) => handleStickerMouseDown(e, stk, containerEl)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSticker(stk.id);
                onSelectPanel(null);
              }}
            >
              <MotifSvg
                motifId={stk.motifId}
                imgUrl={stk.imgUrl}
                color={stk.color}
                className="w-full h-auto drop-shadow-md"
                glow={isStkSelected}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // Aspect ratio calculated dynamically
  const containerAspect = (vbWidth / vbHeight).toFixed(3);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Header Bar: Information, Views switcher, Dimensions Toggle */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 px-1 mb-2.5 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800 text-sm">大袖衫两面图</span>
          <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
            衣长 {length}cm · 通袖 {span}cm · 袖宽 {sleeveWidth}cm · 领宽 {collarBand}cm
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dimension toggle */}
          <button
            type="button"
            onClick={() => setShowDimensions(!showDimensions)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border transition-colors cursor-pointer ${
              showDimensions
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            title="显示/隐藏尺寸标线"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>尺寸标线</span>
          </button>

          {/* View switcher: Both / Front / Back */}
          <div className="inline-flex rounded-md border border-stone-200 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveSideView('both')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                activeSideView === 'both'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              双面并排
            </button>
            <button
              type="button"
              onClick={() => setActiveSideView('front')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                activeSideView === 'front'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              正面
            </button>
            <button
              type="button"
              onClick={() => setActiveSideView('back')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                activeSideView === 'back'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              背面
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-stone-100/90 p-3 sm:p-5 rounded-xl border border-stone-200 shadow-sm relative select-none">
        {/* Pieces Header Bar - 5裁片快捷选择 */}
        <div className="w-full grid grid-cols-5 gap-1.5 mb-3">
          {piecesConfig.map((piece) => {
            const isSelected = selectedPanelId === piece.id;
            return (
              <button
                key={piece.id}
                type="button"
                onClick={() => {
                  onSelectSticker(null);
                  onSelectPanel(piece.id);
                }}
                className={`py-1.5 px-1 rounded-md border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 font-medium shadow-xs'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
                title={`选中${piece.name}`}
              >
                <div className="text-xs leading-tight font-medium">{piece.name}</div>
                <div
                  className={`text-[10px] leading-tight truncate ${
                    isSelected ? 'text-amber-100' : 'text-stone-400'
                  }`}
                >
                  {piece.panel.label || piece.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dual / Single View Canvas Grid */}
        <div
          className={`w-full grid gap-4 ${
            activeSideView === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'
          }`}
        >
          {/* FRONT VIEW DIAGRAM */}
          {(activeSideView === 'both' || activeSideView === 'front') && (
            <div className="flex flex-col">
              {/* Card Label */}
              <div className="flex items-center justify-between px-2 py-1 mb-1 text-xs text-stone-700">
                <span className="font-medium flex items-center gap-1.5 text-stone-900">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  正面
                </span>
              </div>

              {/* Front Canvas */}
              <div
                ref={frontContainerRef}
                id="robe-canvas-front"
                style={{ aspectRatio: `${vbWidth} / ${vbHeight}` }}
                className="w-full relative bg-white rounded-lg shadow-inner overflow-hidden border border-stone-300 transition-all duration-300"
                onClick={() => {
                  onSelectSticker(null);
                  onSelectPanel(null);
                }}
              >
                {/* Background CAD grid */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="robe-front-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#78716C" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#robe-front-grid)" />
                </svg>

                {/* SVG Garment Drawing */}
                {renderGarmentSvg('front')}

                {/* Sticker overlay for front */}
                {renderStickersOverlay('front')}
              </div>
            </div>
          )}

          {/* BACK VIEW DIAGRAM */}
          {(activeSideView === 'both' || activeSideView === 'back') && (
            <div className="flex flex-col">
              {/* Card Label */}
              <div className="flex items-center justify-between px-2 py-1 mb-1 text-xs text-stone-700">
                <span className="font-medium flex items-center gap-1.5 text-stone-900">
                  <span className="w-2 h-2 rounded-full bg-stone-700"></span>
                  背面
                </span>
              </div>

              {/* Back Canvas */}
              <div
                ref={backContainerRef}
                id="robe-canvas-back"
                style={{ aspectRatio: `${vbWidth} / ${vbHeight}` }}
                className="w-full relative bg-white rounded-lg shadow-inner overflow-hidden border border-stone-300 transition-all duration-300"
                onClick={() => {
                  onSelectSticker(null);
                  onSelectPanel(null);
                }}
              >
                {/* Background CAD grid */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="robe-back-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#78716C" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#robe-back-grid)" />
                </svg>

                {/* SVG Garment Drawing */}
                {renderGarmentSvg('back')}

                {/* Sticker overlay for back */}
                {renderStickersOverlay('back')}
              </div>
            </div>
          )}
        </div>

        {/* Selected piece indicator bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-stone-600 bg-white/70 px-3 py-1.5 rounded-md border border-stone-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-700">已选裁片:</span>
            {selectedPanelId !== null ? (
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-amber-700" />
                {panels[selectedPanelId]?.label || `裁片${selectedPanelId + 1}`}
              </span>
            ) : (
              <span className="text-stone-400">未选择</span>
            )}
          </div>
        </div>

        {/* Active sticker quick toolbar */}
        {selectedSticker && (
          <div className="mt-3 bg-white p-2.5 rounded-lg border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>纹样编辑</span>
              <span className="text-xs text-stone-400 font-normal">
                ({selectedSticker.side === 'back' ? '背面' : '正面'})
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Switch side between Front and Back */}
              <button
                type="button"
                title="切换到另一面"
                onClick={() =>
                  onUpdateSticker(selectedSticker.id, {
                    side: selectedSticker.side === 'back' ? 'front' : 'back',
                  })
                }
                className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 cursor-pointer font-medium"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-700" />
                <span>{selectedSticker.side === 'back' ? '移至正面' : '移至背面'}</span>
              </button>

              {/* Zoom Out */}
              <button
                type="button"
                title="缩小"
                onClick={() =>
                  onUpdateSticker(selectedSticker.id, {
                    width: Math.max(6, selectedSticker.width - 2),
                    height: Math.max(6, selectedSticker.height - 2),
                  })
                }
                className="p-1.5 rounded hover:bg-stone-100 text-stone-700 border border-stone-200 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              {/* Zoom In */}
              <button
                type="button"
                title="放大"
                onClick={() =>
                  onUpdateSticker(selectedSticker.id, {
                    width: Math.min(50, selectedSticker.width + 2),
                    height: Math.min(50, selectedSticker.height + 2),
                  })
                }
                className="p-1.5 rounded hover:bg-stone-100 text-stone-700 border border-stone-200 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {/* Rotate */}
              <button
                type="button"
                title="顺时针旋转45度"
                onClick={() =>
                  onUpdateSticker(selectedSticker.id, {
                    rotation: (selectedSticker.rotation + 45) % 360,
                  })
                }
                className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-stone-100 text-stone-700 border border-stone-200 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{selectedSticker.rotation}°</span>
              </button>

              {/* Flip */}
              <button
                type="button"
                title="水平镜像"
                onClick={() =>
                  onUpdateSticker(selectedSticker.id, {
                    flipX: !selectedSticker.flipX,
                  })
                }
                className={`p-1.5 rounded text-stone-700 border border-stone-200 cursor-pointer ${
                  selectedSticker.flipX ? 'bg-amber-100 border-amber-300' : 'hover:bg-stone-100'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
              </button>

              {/* Sticker thread colors */}
              <div className="flex items-center gap-1 pl-2 border-l border-stone-200">
                <span className="text-[11px] text-stone-500">绣色:</span>
                {EMBROIDERY_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => onUpdateSticker(selectedSticker.id, { color: c.hex })}
                    className={`w-4 h-4 rounded-full border border-stone-400/50 shadow-xs transition-transform cursor-pointer ${
                      selectedSticker.color === c.hex ? 'scale-125 ring-2 ring-amber-500' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>

              {/* Delete sticker */}
              <button
                type="button"
                title="删除"
                onClick={() => onDeleteSticker(selectedSticker.id)}
                className="p-1.5 rounded hover:bg-red-50 text-red-600 border border-red-200 ml-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
