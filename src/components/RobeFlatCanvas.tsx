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
  Info,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    stickerId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Panels mapping:
  // 0: 后身片 (Back body)
  // 1: 前身片 (Front body)
  // 2: 广袖主体 (Main broad sleeve)
  // 3: 袖底弧片 (Sweeping lower sleeve arc)
  // 4: 通身领缘 (Collar band strip)
  const backBodyPanel = panels[0] || { id: 0, color: '#891D28', materialId: 'cloud-gauze', label: '后身片' };
  const frontBodyPanel = panels[1] || { id: 1, color: '#891D28', materialId: 'cloud-gauze', label: '前身片' };
  const sleeveMainPanel = panels[2] || { id: 2, color: '#891D28', materialId: 'cloud-gauze', label: '广袖主体' };
  const sleeveArcPanel = panels[3] || { id: 3, color: '#891D28', materialId: 'cloud-gauze', label: '袖底弧片' };
  const collarBandPanel = panels[4] || { id: 4, color: '#FAF7F0', materialId: 'woven-gold', label: '通身领缘' };

  // Sticker dragging handler
  const handleStickerMouseDown = (e: React.MouseEvent, sticker: HanfuSticker) => {
    e.stopPropagation();
    onSelectSticker(sticker.id);
    onSelectPanel(null);

    const container = containerRef.current;
    if (!container) return;

    setIsDragging(true);
    dragStartRef.current = {
      stickerId: sticker.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: sticker.x,
      origY: sticker.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((moveEvent.clientX - dragStartRef.current.startX) / rect.width) * 100;
      const deltaY = ((moveEvent.clientY - dragStartRef.current.startY) / rect.height) * 100;

      const newX = Math.max(0, Math.min(100, dragStartRef.current.origX + deltaX));
      const newY = Math.max(0, Math.min(100, dragStartRef.current.origY + deltaY));

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

  // SVG Paths for pattern pieces in coordinate space 0 0 1000 800
  // Center shoulder fold line: Y = 400
  // Back hem: Y = 80 (后衣长 130)
  // Front hem: Y = 720 (前衣长 130)
  // Center back/front line: X = 130
  // Neck opening: horizontal 8.5cm -> X = 130 to 175
  // Body width: 胸围/4 = 29cm -> X = 130 to 295, flare to 335 at hem
  // Armhole / sleeve root: Y = 305 to 495 (袖肥 38)
  // Sleeve cuff (袖口): X = 730 (通袖长/2 105), Y = 265 to 535 (袖口宽 110)
  // Collar band: X = 830 to 870, Y = 80 to 720 (领缘宽 8, 长 268)

  const backBodyPath = 'M 130 385 Q 150 385 175 400 L 295 400 L 295 305 L 335 80 L 130 80 Z';
  const frontBodyPath = 'M 175 400 L 130 490 L 130 720 L 335 720 L 295 495 L 295 400 Z';
  const sleeveMainPath = 'M 295 400 L 730 400 L 730 265 Q 520 280 295 305 Z';
  const sleeveArcPath = 'M 295 400 L 730 400 L 730 535 C 560 670 410 680 295 495 Z';
  const collarBandPath = 'M 830 80 L 870 80 L 870 720 L 830 720 Z';

  const piecesConfig = [
    {
      id: 0,
      panel: backBodyPanel,
      name: '后身片',
      path: backBodyPath,
      labelX: 210,
      labelY: 220,
      desc: '后衣长 130厘米 · 胸围四分之一 29厘米',
    },
    {
      id: 1,
      panel: frontBodyPanel,
      name: '前身片',
      path: frontBodyPath,
      labelX: 210,
      labelY: 580,
      desc: '前衣长 130厘米 · 直领对襟',
    },
    {
      id: 2,
      panel: sleeveMainPanel,
      name: '广袖主体',
      path: sleeveMainPath,
      labelX: 510,
      labelY: 340,
      desc: '通袖长半幅 105厘米 · 宽袖上幅',
    },
    {
      id: 3,
      panel: sleeveArcPanel,
      name: '袖底弧片',
      path: sleeveArcPath,
      labelX: 510,
      labelY: 520,
      desc: '袖口宽 110厘米 · 袖底大圆弧',
    },
    {
      id: 4,
      panel: collarBandPanel,
      name: '通身领缘',
      path: collarBandPath,
      labelX: 850,
      labelY: 400,
      desc: '宽 8厘米 × 长 268厘米',
      vertical: true,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Canvas top bar info */}
      <div className="w-full max-w-5xl flex items-center justify-between px-2 mb-2 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800">大袖衫展开图</span>
          <span className="text-[11px] text-stone-500 font-mono">
            衣长 130厘米 · 通袖 210厘米 · 袖宽 110厘米
          </span>
        </div>
        <div className="text-[11px] text-stone-400 hidden sm:block">
          点击部位换色，拖拽调校纹样
        </div>
      </div>

      {/* Main interactive unfolded pattern viewport */}
      <div className="w-full max-w-5xl bg-stone-100/90 p-3 sm:p-5 rounded-xl border border-stone-200 shadow-sm relative select-none">
        {/* Pieces Header Bar - Placed cleanly ABOVE the canvas */}
        <div className="w-full grid grid-cols-5 gap-1.5 mb-2">
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

        <div
          ref={containerRef}
          id="flat-robe-canvas"
          className="w-full relative aspect-[1.25/1] bg-white rounded-lg shadow-inner overflow-hidden border border-stone-300"
          onClick={() => {
            onSelectSticker(null);
            onSelectPanel(null);
          }}
        >
          {/* Background CAD grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="robe-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#78716C" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#robe-grid)" />
          </svg>

          {/* Interactive Pattern Pieces SVG Layer */}
          <svg
            viewBox="0 0 1000 800"
            className="w-full h-full absolute inset-0"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Fabric pattern fills for SVG rendering */}
              <pattern id="fabric-woven-gold" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 20 L 20 0 M -5 5 L 5 -5 M 15 25 L 25 15" stroke="#C29B38" strokeWidth="1.2" opacity="0.35" />
              </pattern>
              <pattern id="fabric-cloud-gauze" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
              </pattern>
              <pattern id="fabric-linen" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 0 8 L 16 8 M 8 0 L 8 16" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.25" />
              </pattern>
              <pattern id="fabric-damask" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.3" />
              </pattern>
              {/* Clip paths for each piece */}
              {piecesConfig.map((p) => (
                <clipPath key={`clip-${p.id}`} id={`robe-clip-${p.id}`}>
                  <path d={p.path} />
                </clipPath>
              ))}
            </defs>

            {/* Render each pattern piece */}
            {piecesConfig.map((piece) => {
              const isSelected = selectedPanelId === piece.id;
              const fabricStyle = getFabricStyle(piece.panel.materialId, piece.panel.color);

              return (
                <g
                  key={piece.id}
                  id={`robe-piece-${piece.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSticker(null);
                    onSelectPanel(piece.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* HTML ForeignObject for realistic fabric texture rendering */}
                  <g clipPath={`url(#robe-clip-${piece.id})`}>
                    <foreignObject x="0" y="0" width="1000" height="800">
                      <div
                        style={fabricStyle}
                        className={`w-full h-full transition-all duration-200 ${
                          isSelected ? 'brightness-105' : 'group-hover:brightness-95'
                        }`}
                      />
                    </foreignObject>
                  </g>

                  {/* Piece border outline */}
                  <path
                    d={piece.path}
                    fill="none"
                    stroke={isSelected ? '#D97706' : '#57534E'}
                    strokeWidth={isSelected ? '4' : '2'}
                    strokeLinejoin="round"
                    className="transition-all"
                  />

                  {/* Glow outline when selected */}
                  {isSelected && (
                    <path
                      d={piece.path}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="8"
                      strokeOpacity="0.4"
                      strokeLinejoin="round"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}

            {/* Technical Dimension Lines & Text Annotations */}
            <g className="pointer-events-none text-stone-500 font-mono text-[11px]">
              {/* Shoulder line (肩线) */}
              <line x1="130" y1="400" x2="730" y2="400" stroke="#78716C" strokeWidth="1" strokeDasharray="5,4" opacity="0.6" />
              <text x="430" y="395" fill="#78716C" fontSize="11" textAnchor="middle">
                肩线
              </text>

              {/* Back Neck annotations */}
              <text x="140" y="365" fill="#57534E" fontSize="10">
                后领深 2.8
              </text>
              <line x1="130" y1="375" x2="175" y2="375" stroke="#A8A29E" strokeWidth="1" />
              <text x="155" y="388" fill="#57534E" fontSize="9" textAnchor="middle">
                横开领 8.5
              </text>

              {/* Length indicator (后衣长 130cm) */}
              <line x1="100" y1="80" x2="100" y2="400" stroke="#78716C" strokeWidth="1.2" markerEnd="url(#arrow)" />
              <line x1="90" y1="80" x2="110" y2="80" stroke="#78716C" strokeWidth="1" />
              <line x1="90" y1="400" x2="110" y2="400" stroke="#78716C" strokeWidth="1" />
              <text x="85" y="240" fill="#44403C" fontSize="11" fontWeight="bold" textAnchor="end">
                后衣长 130
              </text>

              {/* Length indicator (前衣长 130cm) */}
              <line x1="100" y1="400" x2="100" y2="720" stroke="#78716C" strokeWidth="1.2" />
              <line x1="90" y1="720" x2="110" y2="720" stroke="#78716C" strokeWidth="1" />
              <text x="85" y="560" fill="#44403C" fontSize="11" fontWeight="bold" textAnchor="end">
                前衣长 130
              </text>

              {/* Chest indicator */}
              <line x1="130" y1="495" x2="295" y2="495" stroke="#A8A29E" strokeWidth="1" strokeDasharray="3,3" />
              <text x="210" y="490" fill="#57534E" fontSize="10" textAnchor="middle">
                胸宽 29
              </text>

              {/* Sleeve depth (袖肥 38) */}
              <line x1="295" y1="400" x2="295" y2="495" stroke="#78716C" strokeWidth="1.2" />
              <text x="290" y="450" fill="#44403C" fontSize="10" textAnchor="end">
                袖肥 38
              </text>

              {/* Total sleeve length indicator */}
              <line x1="130" y1="45" x2="730" y2="45" stroke="#78716C" strokeWidth="1.2" />
              <line x1="130" y1="35" x2="130" y2="55" stroke="#78716C" strokeWidth="1" />
              <line x1="730" y1="35" x2="730" y2="55" stroke="#78716C" strokeWidth="1" />
              <text x="430" y="38" fill="#44403C" fontSize="12" fontWeight="bold" textAnchor="middle">
                通袖半长 105
              </text>

              {/* Sleeve opening indicator (袖口宽 110) */}
              <line x1="755" y1="265" x2="755" y2="535" stroke="#78716C" strokeWidth="1.2" />
              <line x1="745" y1="265" x2="765" y2="265" stroke="#78716C" strokeWidth="1" />
              <line x1="745" y1="535" x2="765" y2="535" stroke="#78716C" strokeWidth="1" />
              <text x="770" y="405" fill="#44403C" fontSize="11" fontWeight="bold">
                袖口宽 110
              </text>

              {/* Collar band indicator */}
              <text x="850" y="65" fill="#44403C" fontSize="11" fontWeight="bold" textAnchor="middle">
                领缘宽 8
              </text>
              <line x1="830" y1="50" x2="870" y2="50" stroke="#78716C" strokeWidth="1" />
              <text x="880" y="700" fill="#78716C" fontSize="10">
                领缘长 268
              </text>
            </g>
          </svg>

          {/* Stickers overlay layer */}
          <div className="absolute inset-0 pointer-events-none">
            {stickers.map((stk) => {
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
                  onMouseDown={(e) => handleStickerMouseDown(e, stk)}
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
        </div>

        {/* Selected piece indicator bar */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-stone-600 bg-white/70 px-3 py-1.5 rounded-md border border-stone-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-700">已选部位:</span>
            {selectedPanelId !== null ? (
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-amber-700" />
                {panels[selectedPanelId]?.label || `裁片${selectedPanelId + 1}`}
              </span>
            ) : (
              <span className="text-stone-400">点击上方按钮或画布裁片即可配置颜色与面料</span>
            )}
          </div>
        </div>

        {/* Active sticker quick toolbar */}
        {selectedSticker && (
          <div className="mt-3 bg-white p-2.5 rounded-lg border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>纹样调校</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Scale down */}
              <button
                type="button"
                title="缩小"
                onClick={() =>
                  onUpdateSticker(selectedSticker.id, {
                    width: Math.max(5, selectedSticker.width - 2),
                  })
                }
                className="p-1.5 rounded hover:bg-stone-100 text-stone-700 border border-stone-200 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              {/* Scale up */}
              <button
                type="button"
                title="放大"
                onClick={() =>
                  onUpdateSticker(selectedSticker.id, {
                    width: Math.min(80, selectedSticker.width + 2),
                  })
                }
                className="p-1.5 rounded hover:bg-stone-100 text-stone-700 border border-stone-200 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {/* Rotate */}
              <button
                type="button"
                title="旋转 45°"
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
