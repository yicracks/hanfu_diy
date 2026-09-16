import React, { useRef } from 'react';
import { PanelData, HanfuSticker, HanfuStyle, SkirtDimensions, RobeDimensions } from '../types/hanfu';
import { Printer, Download, Scissors, Ruler, Compass, AlertCircle } from 'lucide-react';
import { MotifSvg } from './MotifSvg';
import { RobeCuttingPatternPrint } from './RobeCuttingPatternPrint';

interface CuttingPatternPrintProps {
  currentStyle?: HanfuStyle;
  panels: PanelData[];
  stickers: HanfuSticker[];
  skirtLengthCm: number;
  waistbandColor: string;
  skirtDims?: SkirtDimensions;
  robeDims?: RobeDimensions;
  onClose?: () => void;
}

export const CuttingPatternPrint: React.FC<CuttingPatternPrintProps> = ({
  currentStyle,
  panels,
  stickers,
  skirtLengthCm,
  waistbandColor,
  skirtDims,
  robeDims,
  onClose,
}) => {
  // If current style is Daxiushan (robe category), render the authentic Daxiushan blueprint
  if (currentStyle?.category === 'robe' || currentStyle?.id === 'daxiushan') {
    return (
      <RobeCuttingPatternPrint
        panels={panels}
        stickers={stickers}
        robeLengthCm={robeDims?.garmentLengthCm || currentStyle.defaultLengthCm || 130}
        robeDims={robeDims}
        onClose={onClose}
      />
    );
  }

  const printAreaRef = useRef<HTMLDivElement>(null);
  const n = panels.length;
  const actualSkirtLength = skirtDims?.skirtLengthCm || skirtLengthCm || 95;
  const defaultWidth = skirtDims?.defaultPanelWidthCm || Math.round(280 / n);
  const panelWidthCm = panels[0]?.widthCm || defaultWidth;
  const hemAllowanceCm = 4;
  const seamAllowanceCm = 1.5;
  const waistAllowanceCm = 1.0;
  const cutLengthCm = actualSkirtLength + hemAllowanceCm + waistAllowanceCm;
  const cutWidthCm = panelWidthCm + seamAllowanceCm * 2;
  const totalFabricMeters = ((cutLengthCm * Math.ceil(n / 3) + 40) / 100).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Action Header - Hidden when printing */}
      <div className="w-full max-w-5xl flex items-center justify-between px-2 mb-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-amber-700" />
            马面裙裁剪图
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>打印</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs rounded-lg transition-colors cursor-pointer"
            >
              返回
            </button>
          )}
        </div>
      </div>

      {/* Printable Technical Blueprint Container */}
      <div
        ref={printAreaRef}
        id="cutting-blueprint"
        className="w-full max-w-5xl bg-white border border-stone-300 rounded-xl p-6 shadow-sm text-stone-900 font-mono print:border-none print:shadow-none print:p-0"
      >
        {/* Blueprint Title Block */}
        <div className="border-b-2 border-stone-800 pb-3 mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-lg font-serif font-bold tracking-wider text-stone-900">
              马面裙裁剪工艺图
            </div>
            <div className="text-xs text-stone-600 mt-0.5">
              规格: {n}片款 · 裙长 {skirtLengthCm}cm
            </div>
          </div>

          {/* Key Measurements spec box */}
          <div className="flex items-center gap-4 text-xs border border-stone-300 bg-stone-50 px-3 py-1.5 rounded">
            <div>
              <span className="text-stone-500">净长: </span>
              <strong className="text-stone-900">{skirtLengthCm}cm</strong>
            </div>
            <div>
              <span className="text-stone-500">实裁: </span>
              <strong className="text-stone-900">{cutWidthCm} × {cutLengthCm}cm</strong>
            </div>
            <div>
              <span className="text-stone-500">用料: </span>
              <strong className="text-stone-900">{totalFabricMeters}m (门幅140cm)</strong>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 text-[11px] text-stone-600 mb-4 pb-2 border-b border-stone-200">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-[2px] bg-stone-900" />
            <span>实线: 净样</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-[2px] border-b-2 border-dashed border-stone-600" />
            <span>虚线: 缝份 {seamAllowanceCm}cm / 底边 {hemAllowanceCm}cm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-700 font-bold">↕</span>
            <span>经纱方向</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-stone-800 font-bold">▽</span>
            <span>剪口定位</span>
          </div>
        </div>

        {/* 1. Skirt Panels Breakdown (The N Blocks) */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-stone-600" />
            裁片规格 ({n}片)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {panels.map((p, idx) => {
              // Find stickers mapped to this panel
              const panelStickers = stickers.filter((stk) => {
                const pLeft = (idx / n) * 100;
                const pRight = ((idx + 1) / n) * 100;
                return stk.x >= pLeft && stk.x <= pRight;
              });

              return (
                <div
                  key={p.id}
                  className="border-2 border-stone-800 rounded bg-stone-50/50 p-2 flex flex-col justify-between relative min-h-[220px]"
                >
                  {/* Seam Allowance inner border */}
                  <div className="absolute inset-1.5 border border-dashed border-stone-400 pointer-events-none" />

                  {/* Grainline arrow */}
                  <div className="absolute inset-y-6 right-3 flex flex-col items-center justify-between opacity-30 pointer-events-none text-xs">
                    <span>▲</span>
                    <div className="w-[1px] flex-1 bg-stone-900 my-1" />
                    <span>▼</span>
                  </div>

                  {/* Panel Top */}
                  <div>
                    <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                      <span className="font-bold text-xs bg-stone-900 text-white px-1 rounded">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] text-stone-500">上腰</span>
                    </div>

                    <div className="text-[10px] text-stone-700 font-medium mt-1">
                      {p.label || (idx % 2 === 0 ? '侧褶片' : '裙门片')}
                    </div>

                    {/* Color badge */}
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-stone-600">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-400"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="truncate">{p.color}</span>
                    </div>
                  </div>

                  {/* Middle area with sticker preview */}
                  <div className="my-2 flex-1 flex flex-col items-center justify-center relative">
                    {panelStickers.length > 0 ? (
                      <div className="flex flex-col items-center gap-1">
                        {panelStickers.map((stk) => (
                          <div key={stk.id} className="w-8 h-8 flex items-center justify-center">
                            <MotifSvg motifId={stk.motifId} imgUrl={stk.imgUrl} color={stk.color} className="w-full h-full" />
                          </div>
                        ))}
                        <span className="text-[8px] text-amber-800 bg-amber-50 border border-amber-200 px-1 rounded">
                          含纹样
                        </span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-stone-400">素面</span>
                    )}

                    {/* Pleat Fold Mark notch */}
                    <div className="absolute top-1/2 -left-1 text-[9px] text-stone-700">▽</div>
                    <div className="absolute top-1/2 -right-1 text-[9px] text-stone-700">▽</div>
                  </div>

                  {/* Panel Bottom */}
                  <div className="border-t border-stone-300 pt-1 text-[9px] text-stone-500 flex items-center justify-between">
                    <span>底贴边 4cm</span>
                    <span className="font-bold text-stone-800">{cutWidthCm}cm</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Waistband & Ties (裙腰与系带裁片) */}
        <div className="mb-6 border-t border-stone-300 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-stone-600" />
            裙腰与系带
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Waistband pattern */}
            <div className="md:col-span-2 border border-stone-400 p-2.5 rounded bg-stone-50 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-stone-900">裙腰 (1片)</span>
                <span className="text-[11px] text-stone-600">88 × 11 cm</span>
              </div>
              <div className="h-6 border-2 border-dashed border-stone-700 rounded bg-white flex items-center justify-center text-[10px] text-stone-600">
                <span>中心折痕线</span>
              </div>
              <div className="text-[10px] text-stone-500 mt-1">
                搭门 12cm，放缝 1cm
              </div>
            </div>

            {/* Ties pattern */}
            <div className="border border-stone-400 p-2.5 rounded bg-stone-50 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-stone-900">系带 (2条)</span>
                <span className="text-[11px] text-stone-600">85 × 3.5 cm</span>
              </div>
              <div className="h-6 border border-stone-500 rounded bg-white flex items-center justify-center text-[10px] text-stone-600">
                折边车缝
              </div>
              <div className="text-[10px] text-stone-500 mt-1">
                腰头两端固定
              </div>
            </div>
          </div>
        </div>

        {/* 3. Sewing Checklist */}
        <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-600">
          <div className="font-bold text-stone-800 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-700" />
            缝制步骤:
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-stone-600 leading-relaxed">
            <li>裁片顺号对缝，缝份 1.5cm 烫平。</li>
            <li>底摆折边 4cm 车缝固定。</li>
            <li>褶片打褶固定，裙门保持平整。</li>
            <li>缝合裙腰，嵌入系带封口。</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
