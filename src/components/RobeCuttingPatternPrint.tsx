import React, { useRef } from 'react';
import { PanelData, HanfuSticker } from '../types/hanfu';
import { Printer, Scissors, Ruler, AlertCircle, Sparkles } from 'lucide-react';
import { MotifSvg } from './MotifSvg';

interface RobeCuttingPatternPrintProps {
  panels: PanelData[];
  stickers: HanfuSticker[];
  robeLengthCm?: number;
  onClose?: () => void;
}

export const RobeCuttingPatternPrint: React.FC<RobeCuttingPatternPrintProps> = ({
  panels,
  stickers,
  robeLengthCm = 130,
  onClose,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Exact specs matching the user reference photo
  const bustCm = 116;
  const bustQuarterCm = 29;
  const halfSleeveLengthCm = 105; // 通袖长/2
  const fullSleeveLengthCm = 210;
  const sleeveOpeningCm = 110; // 袖口宽
  const sleeveDepthCm = 38; // 袖肥
  const neckWidthCm = 8.5; // 横开领宽
  const backNeckDepthCm = 2.8; // 后领口深
  const collarBandWidthCm = 8; // 领缘宽
  const collarBandLengthCm = 268; // 领缘长 (前衣长130*2 + 后领约8)
  const seamAllowanceCm = 1.5;
  const hemAllowanceCm = 3.0;
  const totalFabricMeters = '4.8';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Action Header - Hidden during print */}
      <div className="w-full max-w-5xl flex items-center justify-between px-2 mb-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-amber-700" />
            大袖衫裁剪图
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
        id="robe-cutting-blueprint"
        className="w-full max-w-5xl bg-white border border-stone-300 rounded-xl p-6 shadow-sm text-stone-900 font-mono print:border-none print:shadow-none print:p-0"
      >
        {/* Blueprint Title Block */}
        <div className="border-b-2 border-stone-800 pb-3 mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-lg font-serif font-bold tracking-wider text-stone-900">
              大袖衫裁剪工艺图
            </div>
            <div className="text-xs text-stone-600 mt-0.5">
              款式: 唐宋大袖衫 · 衣长 {robeLengthCm}cm
            </div>
          </div>

          {/* Key Measurements spec box */}
          <div className="flex items-center gap-4 text-xs border border-stone-300 bg-stone-50 px-3 py-1.5 rounded">
            <div>
              <span className="text-stone-500">衣长: </span>
              <strong className="text-stone-900">{robeLengthCm}cm</strong>
            </div>
            <div>
              <span className="text-stone-500">通袖: </span>
              <strong className="text-stone-900">{fullSleeveLengthCm}cm</strong>
            </div>
            <div>
              <span className="text-stone-500">胸围: </span>
              <strong className="text-stone-900">{bustCm}cm (1/4为{bustQuarterCm}cm)</strong>
            </div>
            <div>
              <span className="text-stone-500">用料: </span>
              <strong className="text-stone-900">{totalFabricMeters}m (门幅140cm)</strong>
            </div>
          </div>
        </div>

        {/* Blueprint CAD Schematic Area */}
        <div className="border border-stone-400 bg-stone-50/40 p-4 rounded-lg mb-5">
          <div className="text-xs font-serif font-bold text-stone-700 mb-2 flex items-center justify-between border-b border-stone-200 pb-1">
            <span>排料与尺寸标注</span>
            <span className="text-[10px] font-mono text-stone-500 font-normal">
              单位: cm · 标示净样 · 缝份增加 {seamAllowanceCm}cm
            </span>
          </div>

          {/* Technical Drawing SVG */}
          <svg
            viewBox="0 0 960 520"
            className="w-full h-auto bg-white border border-stone-200 shadow-2xs"
          >
            <defs>
              <marker
                id="bp-arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#44403C" />
              </marker>
            </defs>

            {/* SECTION 1: Left Mini Finished Garment Drawings (Directly matching photo's top-left) */}
            <g id="bp-mini-garment-sketches" transform="translate(15, 20)">
              {/* Box border */}
              <rect x="0" y="0" width="180" height="470" fill="#FAFAF9" stroke="#D6D3D1" strokeWidth="1" rx="4" />
              <text x="90" y="24" textAnchor="middle" fill="#292524" fontSize="12" fontWeight="bold" fontFamily="serif">
                款式成衣结构示意
              </text>

              {/* Front View Mini Sketch */}
              <g transform="translate(10, 35)">
                <text x="80" y="16" textAnchor="middle" fill="#57534E" fontSize="11" fontWeight="bold">
                  【前襟正视】
                </text>
                {/* Front robe outline */}
                <path
                  d="M 65 30 L 30 50 C 15 75 15 110 30 130 C 48 145 70 140 85 90 L 85 160 L 45 160 L 55 90 L 65 30 Z"
                  fill="#F5F5F4"
                  stroke="#44403C"
                  strokeWidth="1.2"
                />
                <path
                  d="M 95 30 L 130 50 C 145 75 145 110 130 130 C 112 145 90 140 75 90 L 75 160 L 115 160 L 105 90 L 95 30 Z"
                  fill="#F5F5F4"
                  stroke="#44403C"
                  strokeWidth="1.2"
                />
                {/* Straight front lapels (直领对襟) */}
                <line x1="80" y1="30" x2="80" y2="160" stroke="#78350F" strokeWidth="1.8" />
                <rect x="76" y="30" width="8" height="130" fill="none" stroke="#B45309" strokeWidth="1" />
                <text x="80" y="180" textAnchor="middle" fill="#78716C" fontSize="9">
                  直领对襟 · 领缘通身
                </text>
              </g>

              {/* Back View Mini Sketch */}
              <g transform="translate(10, 240)">
                <text x="80" y="16" textAnchor="middle" fill="#57534E" fontSize="11" fontWeight="bold">
                  【后背正视】
                </text>
                {/* Back robe outline */}
                <path
                  d="M 65 30 L 30 50 C 15 75 15 110 30 130 C 48 145 70 140 85 90 L 85 160 L 45 160 L 55 90 L 65 30 Z"
                  fill="#F5F5F4"
                  stroke="#44403C"
                  strokeWidth="1.2"
                />
                <path
                  d="M 95 30 L 130 50 C 145 75 145 110 130 130 C 112 145 90 140 75 90 L 75 160 L 115 160 L 105 90 L 95 30 Z"
                  fill="#F5F5F4"
                  stroke="#44403C"
                  strokeWidth="1.2"
                />
                {/* Back neck collar curve */}
                <path d="M 68 30 Q 80 36 92 30" fill="none" stroke="#B45309" strokeWidth="1.5" />
                {/* Center Back Seam (中缝) */}
                <line x1="80" y1="34" x2="80" y2="160" stroke="#44403C" strokeWidth="1.2" strokeDasharray="3,1" />
                <text x="80" y="180" textAnchor="middle" fill="#78716C" fontSize="9">
                  后背正中缝 (中缝通长)
                </text>
                <text x="80" y="195" textAnchor="middle" fill="#78716C" fontSize="9">
                  后领深 2.8厘米 · 横开 8.5厘米
                </text>
              </g>
            </g>

            {/* SECTION 2: Center Main Unfolded Cutting Pattern (1/2 展开连肩大裁图) */}
            <g id="bp-main-unfolded-pattern" transform="translate(210, 10)">
              {/* Title inside drawing */}
              <text x="310" y="24" textAnchor="middle" fill="#1C1917" fontSize="13" fontWeight="bold" fontFamily="serif">
                连肩通袖大裁排料展开净版图
              </text>

              {/* Shoulder center line (肩线) */}
              <line x1="80" y1="260" x2="480" y2="260" stroke="#78716C" strokeWidth="1.2" strokeDasharray="6,4" />
              <text x="280" y="255" textAnchor="middle" fill="#78716C" fontSize="10">
                肩线 (连肩连裁折叠线)
              </text>

              {/* Main Cutting Piece: Body + Sleeve continuous */}
              {/* Back body: X: 80 to 200, Y: 260 up to 50 */}
              {/* Front body: X: 80 to 200, Y: 260 down to 470 */}
              {/* Sleeve: X: 200 to 480, Y: 130 to 390 (袖口 110) */}
              {/* Underarm arc: from (200, 325) curving to (480, 390) */}

              {/* Pattern fill background */}
              <path
                d="M 80 248 Q 95 248 112 260 L 200 260 L 200 195 L 225 50 L 80 50 L 80 248 Z"
                fill="#FEF3C7"
                stroke="#44403C"
                strokeWidth="1.8"
              />
              <path
                d="M 112 260 L 80 320 L 80 470 L 225 470 L 200 325 L 200 260 Z"
                fill="#FEF3C7"
                stroke="#44403C"
                strokeWidth="1.8"
              />
              <path
                d="M 200 260 L 480 260 L 480 165 Q 340 180 200 195 Z"
                fill="#FEF9C3"
                stroke="#44403C"
                strokeWidth="1.8"
              />
              <path
                d="M 200 260 L 480 260 L 480 355 C 380 450 280 440 200 325 Z"
                fill="#FEF9C3"
                stroke="#44403C"
                strokeWidth="1.8"
              />

              {/* Grainline arrow */}
              <g transform="translate(140, 200)">
                <line x1="0" y1="-50" x2="0" y2="50" stroke="#78350F" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
                <text x="10" y="4" fill="#78350F" fontSize="9">经纱方向</text>
              </g>

              {/* Seam allowance dotted preview line */}
              <path
                d="M 72 42 L 233 42 L 208 190 L 488 157 L 488 363 C 385 460 283 450 208 333 L 233 478 L 72 478 Z"
                fill="none"
                stroke="#B45309"
                strokeWidth="1"
                strokeDasharray="4,3"
                opacity="0.8"
              />
              <text x="350" y="475" fill="#B45309" fontSize="10">
                缝份 1.5cm (底摆与袖口 3cm)
              </text>

              {/* Technical Dimension Callouts matching uploaded image */}
              {/* Back length (后衣长 130) */}
              <line x1="55" y1="50" x2="55" y2="260" stroke="#292524" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <line x1="45" y1="50" x2="65" y2="50" stroke="#292524" strokeWidth="1" />
              <text x="50" y="155" textAnchor="end" fill="#1C1917" fontSize="11" fontWeight="bold">
                后衣长 130
              </text>

              {/* Front length (前衣长 130) */}
              <line x1="55" y1="260" x2="55" y2="470" stroke="#292524" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <line x1="45" y1="470" x2="65" y2="470" stroke="#292524" strokeWidth="1" />
              <text x="50" y="370" textAnchor="end" fill="#1C1917" fontSize="11" fontWeight="bold">
                前衣长 130
              </text>

              {/* Neck width & depth (横开领 8.5 / 后领深 2.8) */}
              <text x="82" y="240" fill="#1C1917" fontSize="9">后领深 2.8</text>
              <text x="115" y="252" fill="#1C1917" fontSize="9">横开 8.5</text>

              {/* Body width (胸围/4 = 29) */}
              <line x1="80" y1="325" x2="200" y2="325" stroke="#78716C" strokeWidth="1" strokeDasharray="3,3" />
              <text x="140" y="320" textAnchor="middle" fill="#1C1917" fontSize="10" fontWeight="bold">
                胸围/4 = 29
              </text>

              {/* Sleeve root (袖肥 38) */}
              <line x1="200" y1="260" x2="200" y2="325" stroke="#292524" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <text x="195" y="295" textAnchor="end" fill="#1C1917" fontSize="10" fontWeight="bold">
                袖肥 38
              </text>

              {/* Half sleeve length (通袖长/2 = 105) */}
              <line x1="80" y1="30" x2="480" y2="30" stroke="#292524" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <line x1="80" y1="20" x2="80" y2="40" stroke="#292524" strokeWidth="1" />
              <line x1="480" y1="20" x2="480" y2="40" stroke="#292524" strokeWidth="1" />
              <text x="280" y="24" textAnchor="middle" fill="#1C1917" fontSize="12" fontWeight="bold">
                通袖长/2 = 105
              </text>

              {/* Sleeve opening (袖口宽 110) */}
              <line x1="495" y1="165" x2="495" y2="355" stroke="#292524" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <line x1="485" y1="165" x2="505" y2="165" stroke="#292524" strokeWidth="1" />
              <line x1="485" y1="355" x2="505" y2="355" stroke="#292524" strokeWidth="1" />
              <text x="510" y="265" fill="#1C1917" fontSize="11" fontWeight="bold">
                袖口宽 110
              </text>
            </g>

            {/* SECTION 3: Far Right Collar Band Strip */}
            <g id="bp-collar-band" transform="translate(800, 20)">
              <rect x="0" y="0" width="130" height="470" fill="#FAFAF9" stroke="#D6D3D1" strokeWidth="1" rx="4" />
              <text x="65" y="24" textAnchor="middle" fill="#292524" fontSize="12" fontWeight="bold" fontFamily="serif">
                领缘裁片
              </text>

              {/* Collar strip */}
              <g transform="translate(45, 45)">
                <rect x="0" y="0" width="40" height="360" fill="#FEF3C7" stroke="#44403C" strokeWidth="1.5" />
                <line x1="20" y1="20" x2="20" y2="340" stroke="#78350F" strokeWidth="1" strokeDasharray="4,2" />

                {/* Collar width callout */}
                <text x="20" y="-10" textAnchor="middle" fill="#1C1917" fontSize="10" fontWeight="bold">
                  宽 8
                </text>
                <line x1="0" y1="-5" x2="40" y2="-5" stroke="#292524" strokeWidth="1" />

                {/* Collar length callout */}
                <text x="50" y="180" fill="#1C1917" fontSize="10" fontWeight="bold">
                  长 268cm
                </text>
              </g>

              <text x="65" y="445" textAnchor="middle" fill="#78716C" fontSize="9">
                表布1片 + 衬布1片
              </text>
            </g>
          </svg>
        </div>

        {/* Construction Checklist & Cutting Specification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Col 1: 裁片清单 */}
          <div className="border border-stone-300 rounded-lg p-3.5 bg-stone-50/70">
            <div className="font-bold text-stone-900 border-b border-stone-200 pb-1.5 mb-2 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-amber-700" />
              <span>裁片规格</span>
            </div>
            <table className="w-full text-stone-700">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px]">
                  <th className="text-left py-1">部位</th>
                  <th className="text-center py-1">数量</th>
                  <th className="text-right py-1">净样 (cm)</th>
                  <th className="text-right py-1">缝份</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60">
                <tr>
                  <td className="py-1 font-medium">身片</td>
                  <td className="text-center">2 片</td>
                  <td className="text-right">260 × 29~34</td>
                  <td className="text-right text-stone-500">+1.5，底+3</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">袖片</td>
                  <td className="text-center">2 片</td>
                  <td className="text-right">76 × 110</td>
                  <td className="text-right text-stone-500">+1.5，口+3</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">领缘</td>
                  <td className="text-center">1 条</td>
                  <td className="text-right">268 × 8</td>
                  <td className="text-right text-stone-500">+1.0</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">系带</td>
                  <td className="text-center">2 对</td>
                  <td className="text-right">45 × 2</td>
                  <td className="text-right text-stone-500">折边车缝</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Col 2: 工艺缝制顺序与规范 */}
          <div className="border border-stone-300 rounded-lg p-3.5 bg-stone-50/70">
            <div className="font-bold text-stone-900 border-b border-stone-200 pb-1.5 mb-2 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-amber-700" />
              <span>缝制步骤</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-stone-700 text-[11px] leading-relaxed">
              <li>左右后身片拼合背中缝，劈缝烫平。</li>
              <li>大袖片与身片袖肥处拼缝接袖。</li>
              <li>缝合袖底大圆弧，弧顶剪口防扯紧。</li>
              <li>领缘衬布烫平，由后领中点向两侧顺缝至底摆。</li>
              <li>袖口与底摆折边 3cm 缝合。</li>
            </ol>
          </div>
        </div>

        {/* Print Footer */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <div>
            汉服定制设计系统 · 自动排料打版模块 · 适用于唐宋制式大袖礼服制作
          </div>
          <div>
            打印建议: 勾选「背景图形」以呈现完整经纱与放缝实线
          </div>
        </div>
      </div>
    </div>
  );
};
