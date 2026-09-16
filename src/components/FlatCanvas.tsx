import React, { useRef, useState } from 'react';
import { PanelData, HanfuSticker, HanfuStyle, SkirtDimensions, RobeDimensions } from '../types/hanfu';
import { getFabricStyle } from '../utils/fabricTextures';
import { EMBROIDERY_COLORS } from '../utils/stickerLoader';
import { MotifSvg } from './MotifSvg';
import { Trash2, RotateCw, FlipHorizontal, ZoomIn, ZoomOut, Check, Sparkles, Ruler } from 'lucide-react';
import { RobeFlatCanvas } from './RobeFlatCanvas';

interface FlatCanvasProps {
  currentStyle: HanfuStyle;
  panels: PanelData[];
  selectedPanelId: number | null;
  onSelectPanel: (id: number | null) => void;
  stickers: HanfuSticker[];
  selectedStickerId: string | null;
  onSelectSticker: (id: string | null) => void;
  onUpdateSticker: (id: string, updates: Partial<HanfuSticker>) => void;
  onDeleteSticker: (id: string) => void;
  skirtLengthCm: number;
  waistbandColor: string;
  skirtDims?: SkirtDimensions;
  robeDims?: RobeDimensions;
}

export const FlatCanvas: React.FC<FlatCanvasProps> = ({
  currentStyle,
  panels,
  selectedPanelId,
  onSelectPanel,
  stickers,
  selectedStickerId,
  onSelectSticker,
  onUpdateSticker,
  onDeleteSticker,
  skirtLengthCm,
  waistbandColor,
  skirtDims,
  robeDims,
}) => {
  // If current style is Daxiushan (robe category), render the authentic broad-sleeve unfolded pattern
  if (currentStyle.category === 'robe' || currentStyle.id === 'daxiushan') {
    return (
      <RobeFlatCanvas
        currentStyle={currentStyle}
        panels={panels}
        selectedPanelId={selectedPanelId}
        onSelectPanel={onSelectPanel}
        stickers={stickers}
        selectedStickerId={selectedStickerId}
        onSelectSticker={onSelectSticker}
        onUpdateSticker={onUpdateSticker}
        onDeleteSticker={onDeleteSticker}
        robeDims={robeDims}
      />
    );
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ stickerId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const n = panels.length;
  const currentLength = skirtDims?.skirtLengthCm || skirtLengthCm || 95;
  const currentWaistband = skirtDims?.waistbandHeightCm || 7;
  const defaultWidth = skirtDims?.defaultPanelWidthCm || 28;

  // Calculate total unfolded width from all panel dimensions
  const totalWidthCm = panels.reduce(
    (sum, p) => sum + (p.widthCm || defaultWidth),
    0
  );

  // Proportional aspect ratio of the skirt unfolded container (Width : Height)
  const calculatedAspectRatio = Math.max(1.6, Math.min(4.5, totalWidthCm / currentLength));

  // Handle sticker mouse down to start dragging
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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Header Bar: Dimensions & Proportions */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs text-stone-600 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800 text-sm">展平裁片</span>
          <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
            {n}片 · 裙长 {currentLength}cm · 展宽 {totalWidthCm}cm
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-medium flex items-center gap-1">
            <Ruler className="w-3 h-3 text-amber-600" />
            比例 {(totalWidthCm / currentLength).toFixed(2)} : 1
          </span>
        </div>
      </div>

      {/* Main interactive unfolded pattern viewport */}
      <div className="w-full max-w-5xl bg-stone-100/80 p-3 sm:p-5 rounded-xl border border-stone-200 shadow-sm relative select-none">
        {/* Panel Labels Header Row */}
        <div className="w-full flex mb-2 border border-stone-300 rounded-lg bg-white overflow-hidden shadow-2xs">
          {panels.map((panel, idx) => {
            const isSelected = selectedPanelId === panel.id;
            const pWidth = panel.widthCm || defaultWidth;
            const widthPct = (pWidth / totalWidthCm) * 100;

            return (
              <button
                key={panel.id}
                type="button"
                style={{ width: `${widthPct}%`, flex: 'none' }}
                onClick={() => {
                  onSelectSticker(null);
                  onSelectPanel(panel.id);
                }}
                className={`min-w-0 py-1.5 px-0.5 text-center transition-colors border-r border-stone-200 last:border-r-0 cursor-pointer relative ${
                  isSelected
                    ? 'bg-amber-600 text-white font-medium shadow-xs'
                    : 'bg-white hover:bg-amber-50/50 text-stone-700'
                }`}
                title={`第${idx + 1}片（${panel.label}）`}
              >
                <div className="text-xs leading-tight font-medium truncate">
                  第{idx + 1}片
                </div>
                <div
                  className={`text-[10px] leading-tight truncate mt-0.5 ${
                    isSelected ? 'text-amber-100' : 'text-stone-400'
                  }`}
                >
                  {panel.label}
                </div>
                {isSelected && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-amber-600 z-10" />
                )}
              </button>
            );
          })}
        </div>

        {/* Waistband (裙腰) on top - 与裁片宽度完全对齐 */}
        <div
          className="w-full rounded-t border-t border-x border-stone-300 shadow-inner flex items-center justify-between px-3 text-[10px] tracking-wider text-stone-700 font-medium"
          style={{
            backgroundColor: waistbandColor,
            height: `${Math.max(20, Math.min(32, currentWaistband * 3))}px`,
          }}
        >
          <span>裙腰</span>
          <span className="font-mono text-stone-500">高 {currentWaistband}cm</span>
        </div>

        {/* The N panels container with dynamic proportional aspect ratio */}
        <div
          ref={containerRef}
          id="flat-skirt-canvas"
          style={{ aspectRatio: `${calculatedAspectRatio.toFixed(3)}` }}
          className="w-full relative bg-white rounded-b shadow-md overflow-hidden border border-stone-300 flex transition-all duration-300"
          onClick={() => {
            onSelectSticker(null);
            onSelectPanel(null);
          }}
        >
          {/* Render N rectangular blocks with proportional widths */}
          {panels.map((panel, idx) => {
            const isSelected = selectedPanelId === panel.id;
            const style = getFabricStyle(panel.materialId, panel.color);
            const pWidth = panel.widthCm || defaultWidth;
            const widthPct = (pWidth / totalWidthCm) * 100;

            return (
              <div
                key={panel.id}
                id={`panel-block-${idx + 1}`}
                style={{
                  ...style,
                  width: `${widthPct}%`,
                  flex: 'none',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSticker(null);
                  onSelectPanel(panel.id);
                }}
                className={`relative h-full border-r border-stone-300/60 transition-all cursor-pointer group flex flex-col justify-between ${
                  idx === n - 1 ? 'border-r-0' : ''
                } ${isSelected ? 'ring-2 ring-amber-500 ring-inset z-10 shadow-lg' : 'hover:brightness-95'}`}
              >
                {/* Selected outline icon */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white p-0.5 rounded-full shadow pointer-events-none z-10">
                    <Check className="w-3 h-3" />
                  </div>
                )}

                {/* Seam line & pleat indicators */}
                <div className="absolute inset-y-0 right-0 w-[1px] bg-dashed-line opacity-40 pointer-events-none" />

                {/* Top panel tag */}
                <div className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] bg-white/80 backdrop-blur-xs px-1 rounded text-stone-600 font-mono shadow-2xs">
                    {pWidth}cm
                  </span>
                </div>

                {/* Bottom hemline line & dimension label */}
                <div className="w-full border-t border-dashed border-stone-400/40 p-1 flex items-center justify-between text-[9px] font-mono text-stone-600 bg-white/40 backdrop-blur-2xs">
                  <span>P{idx + 1}</span>
                  <span>{pWidth}cm</span>
                </div>
              </div>
            );
          })}

          {/* Stickers overlay layer */}
          <div className="absolute inset-0 pointer-events-none">
            {stickers.map((stk) => {
              const isStkSelected = stk.id === selectedStickerId;

              return (
                <div
                  key={stk.id}
                  id={`sticker-elem-${stk.id}`}
                  style={{
                    position: 'absolute',
                    left: `${stk.x}%`,
                    top: `${stk.y}%`,
                    width: `${stk.width}%`,
                    transform: `translate(-50%, -50%) rotate(${stk.rotation}deg) scaleX(${stk.flipX ? -1 : 1})`,
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

        {/* Dimension summary footer bar */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 font-mono px-1">
          <div className="flex items-center gap-3">
            <span>裙长: {currentLength}cm</span>
            <span>·</span>
            <span>展开总宽: {totalWidthCm}cm</span>
            <span>·</span>
            <span>单片宽: {defaultWidth}cm</span>
          </div>
        </div>

        {/* Active sticker quick toolbar */}
        {selectedSticker && (
          <div className="mt-3 bg-white p-2.5 rounded-lg border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>纹样编辑</span>
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
