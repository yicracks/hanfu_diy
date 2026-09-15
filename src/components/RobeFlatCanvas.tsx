import React, { useRef, useState } from 'react';
import { PanelData, HanfuSticker, HanfuStyle } from '../types/hanfu';
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

  // SVG Geometry Paths based on the user's reference drawing
  // ViewBox: 0 0 600 660
  // Center X: 300, Shoulder Y: 70
  // Cuff Left: X=40, Y=70..280 | Cuff Right: X=560, Y=70..280
  // Sleeve Extension (接袖缝): Left X=145 | Right X=455
  // Body Armhole Seam: Left X=235 | Right X=365
  // Armpit slit tip: Left (212, 195) | Right (388, 195)
  // Hem corners: Left (224, 570) | Right (376, 570)
  // Hem bottom center: (300, 585)

  // 1. Left sleeve outer boundary
  const leftSleevePath =
    'M 235 70 L 40 70 L 40 280 L 145 280 Q 180 280 205 240 Q 215 215 212 195 L 235 195 Z';

  // 2. Right sleeve outer boundary
  const rightSleevePath =
    'M 365 70 L 560 70 L 560 280 L 455 280 Q 420 280 395 240 Q 385 215 388 195 L 365 195 Z';

  // 3. Front View: Left Front Body (左前身)
  const frontLeftBodyPath =
    'M 286 70 L 235 70 L 235 195 L 212 195 Q 214 340 224 570 Q 255 578 286 582 Z';

  // 4. Front View: Right Front Body (右前身)
  const frontRightBodyPath =
    'M 314 70 L 365 70 L 365 195 L 388 195 Q 386 340 376 570 Q 345 578 314 582 Z';

  // 5. Front View: Straight Collar Band (直领通身领缘)
  const frontCollarBandPath =
    'M 286 70 L 290 46 L 310 46 L 314 70 L 314 582 L 300 585 L 286 582 Z';

  // 6. Back View: Left Back Body (左后身)
  const backLeftBodyPath =
    'M 300 70 L 286 70 L 235 70 L 235 195 L 212 195 Q 214 340 224 570 Q 260 580 300 585 Z';

  // 7. Back View: Right Back Body (右后身)
  const backRightBodyPath =
    'M 300 70 L 314 70 L 365 70 L 365 195 L 388 195 Q 386 340 376 570 Q 340 580 300 585 Z';

  // 8. Back View: Back Neck Collar (后领缘)
  const backNeckCollarPath =
    'M 286 70 L 290 46 L 310 46 L 314 70 Q 300 74 286 70 Z';

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
        viewBox="0 0 600 660"
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
            <foreignObject x="0" y="0" width="600" height="660">
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
            x1="145"
            y1="70"
            x2="145"
            y2="280"
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
            <foreignObject x="0" y="0" width="600" height="660">
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
            x1="455"
            y1="70"
            x2="455"
            y2="280"
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
              <foreignObject x="0" y="0" width="600" height="660">
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
              <foreignObject x="0" y="0" width="600" height="660">
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
              <foreignObject x="0" y="0" width="600" height="660">
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
              <foreignObject x="0" y="0" width="600" height="660">
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
              x1="300"
              y1="70"
              x2="300"
              y2="585"
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
              <foreignObject x="0" y="0" width="600" height="660">
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
              x1="300"
              y1="70"
              x2="300"
              y2="585"
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
              <foreignObject x="0" y="0" width="600" height="660">
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

        {/* 5. SEAM HIGHLIGHTS & INTERNAL LINES */}
        {/* Armhole Seam (肩袖分割缝) */}
        <line x1="235" y1="70" x2="235" y2="195" stroke="#292524" strokeWidth="1.8" />
        <line x1="365" y1="70" x2="365" y2="195" stroke="#292524" strokeWidth="1.8" />

        {/* Slit inner line under armpit */}
        <path
          d="M 235 195 L 212 195"
          fill="none"
          stroke="#292524"
          strokeWidth="1.6"
        />
        <path
          d="M 365 195 L 388 195"
          fill="none"
          stroke="#292524"
          strokeWidth="1.6"
        />

        {/* 6. TECHNICAL DIMENSION ANNOTATIONS (Optional toggle) */}
        {showDimensions && (
          <g className="pointer-events-none text-stone-500 font-mono text-[10px] opacity-75">
            {/* Top sleeve span line (通袖 210cm) */}
            <line x1="40" y1="35" x2="560" y2="35" stroke="#78716C" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1="40" y1="28" x2="40" y2="42" stroke="#78716C" strokeWidth="0.8" />
            <line x1="560" y1="28" x2="560" y2="42" stroke="#78716C" strokeWidth="0.8" />
            <text x="300" y="30" fill="#57534E" fontSize="10" textAnchor="middle" fontWeight="bold">
              通袖 210cm
            </text>

            {/* Cuff height (袖口 110cm) */}
            <line x1="22" y1="70" x2="22" y2="280" stroke="#78716C" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1="16" y1="70" x2="28" y2="70" stroke="#78716C" strokeWidth="0.8" />
            <line x1="16" y1="280" x2="28" y2="280" stroke="#78716C" strokeWidth="0.8" />
            <text x="18" y="180" fill="#57534E" fontSize="9" textAnchor="end">
              袖宽 110
            </text>

            {/* Length (衣长 130cm) */}
            <line x1="578" y1="70" x2="578" y2="580" stroke="#78716C" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1="572" y1="70" x2="584" y2="70" stroke="#78716C" strokeWidth="0.8" />
            <line x1="572" y1="580" x2="584" y2="580" stroke="#78716C" strokeWidth="0.8" />
            <text x="582" y="325" fill="#57534E" fontSize="9" textAnchor="start">
              衣长 130
            </text>

            {/* Feature tags */}
            {isFront ? (
              <text x="300" y="618" fill="#78716C" fontSize="10" textAnchor="middle">
                直领通身门襟 · 对襟
              </text>
            ) : (
              <text x="300" y="618" fill="#78716C" fontSize="10" textAnchor="middle">
                背中缝贯通 · 接袖对称
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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Header Bar: Information, Views switcher, Dimensions Toggle */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 px-1 mb-2.5 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800 text-sm">大袖衫两面图</span>
          <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
            衣长 130cm · 通袖 210cm · 袖宽 110cm
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
              <div className="flex items-center justify-between px-2 py-1 mb-1.5 text-xs text-stone-700">
                <span className="font-medium flex items-center gap-1.5 text-stone-900">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  正面 · 直领对襟
                </span>
                <span className="text-[11px] text-stone-400">门襟贯通 · 接袖大袖</span>
              </div>

              {/* Front Canvas */}
              <div
                ref={frontContainerRef}
                id="robe-canvas-front"
                className="w-full relative aspect-[1/1.08] bg-white rounded-lg shadow-inner overflow-hidden border border-stone-300"
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
              <div className="flex items-center justify-between px-2 py-1 mb-1.5 text-xs text-stone-700">
                <span className="font-medium flex items-center gap-1.5 text-stone-900">
                  <span className="w-2 h-2 rounded-full bg-stone-700"></span>
                  背面 · 贯通中缝
                </span>
                <span className="text-[11px] text-stone-400">背中缝合 · 接袖大袖</span>
              </div>

              {/* Back Canvas */}
              <div
                ref={backContainerRef}
                id="robe-canvas-back"
                className="w-full relative aspect-[1/1.08] bg-white rounded-lg shadow-inner overflow-hidden border border-stone-300"
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
              <span className="text-stone-400">点击上方按钮或图中裁片即可配置颜色与面料</span>
            )}
          </div>
          <span className="text-stone-400 text-[11px]">点击图案可拖拽与调整绣色</span>
        </div>

        {/* Active sticker quick toolbar */}
        {selectedSticker && (
          <div className="mt-3 bg-white p-2.5 rounded-lg border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>纹样调校</span>
              <span className="text-xs text-stone-400 font-normal">
                ({selectedSticker.side === 'back' ? '位于背面' : '位于正面'})
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
