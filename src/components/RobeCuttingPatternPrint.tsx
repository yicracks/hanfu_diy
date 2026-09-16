import React, { useRef } from 'react';
import { PanelData, HanfuSticker, RobeDimensions } from '../types/hanfu';
import { Printer, Scissors, Ruler, AlertCircle, Sparkles } from 'lucide-react';
import { MotifSvg } from './MotifSvg';

interface RobeCuttingPatternPrintProps {
  panels: PanelData[];
  stickers: HanfuSticker[];
  robeLengthCm?: number;
  robeDims?: RobeDimensions;
  onClose?: () => void;
}

export const RobeCuttingPatternPrint: React.FC<RobeCuttingPatternPrintProps> = ({
  panels,
  stickers,
  robeLengthCm = 130,
  robeDims,
  onClose,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Dynamic specs matching customized parameters or reference defaults
  const currentLength = robeDims?.garmentLengthCm || robeLengthCm || 130;
  const fullSleeveLengthCm = robeDims?.totalSleeveSpanCm || robeDims?.sleeveSpanCm || 210;
  const halfSleeveLengthCm = Math.round(fullSleeveLengthCm / 2);
  const sleeveOpeningCm = robeDims?.sleeveOpeningCm || robeDims?.sleeveWidthCm || 110;
  const collarBandWidthCm = robeDims?.collarBandWidthCm || 8;
  const bustCm = robeDims?.chestCircumferenceCm || 116;
  const bustQuarterCm = Math.round(bustCm / 4);
  const sleeveRootCm = robeDims?.sleeveRootDepthCm ?? 38;
  const neckWidthCm = robeDims?.neckWidthCm ?? 8.5;
  const backNeckDepthCm = robeDims?.backNeckDepthCm ?? 2.8;
  const hemHalfWidthCm = robeDims?.hemWidthCm ?? 72; // 半身下摆宽
  const hemQuarterCm = Math.round(hemHalfWidthCm / 2); // 1/4 下摆宽 (微展)
  const collarBandLengthCm = robeDims?.collarBandLengthCm || Math.round(currentLength * 2 + 8); // 领缘长
  const seamAllowanceCm = 1.5;
  const hemAllowanceCm = 3.0;
  const totalFabricMeters = ((currentLength * 2 + sleeveOpeningCm * 2 + 40) / 100).toFixed(1);

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
              <span className="text-stone-500">下摆: </span>
              <strong className="text-stone-900">{hemHalfWidthCm * 2}cm (微展比 {Math.round((hemHalfWidthCm / (bustCm / 2)) * 100)}%)</strong>
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
              单位: cm · 标示净样 · 缝份增加 {seamAllowanceCm}cm · 下摆比上面稍微宽微展
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

            {/* SECTION 1: Left Mini Finished Garment Drawings & Authentic Specs Table */}
            <g id="bp-mini-garment-sketches" transform="translate(15, 20)">
              {/* Box border */}
              <rect x="0" y="0" width="180" height="470" fill="#FAFAF9" stroke="#D6D3D1" strokeWidth="1" rx="4" />
              <text x="90" y="20" textAnchor="middle" fill="#292524" fontSize="11" fontWeight="bold" fontFamily="serif">
                大袖衫款式与尺寸参数表
              </text>

              {/* Front & Back Mini Sketches side-by-side */}
              <g transform="translate(8, 28)">
                {/* Mini Front */}
                <g transform="translate(0, 0)">
                  <text x="40" y="10" textAnchor="middle" fill="#57534E" fontSize="9" fontWeight="bold">
                    【前襟正视】
                  </text>
                  <path
                    d="M 32 18 L 14 30 C 6 45 6 70 14 85 C 23 95 34 92 40 60 L 40 105 L 18 105 L 26 60 L 32 18 Z"
                    fill="#F5F5F4"
                    stroke="#44403C"
                    strokeWidth="1"
                  />
                  <path
                    d="M 48 18 L 66 30 C 74 45 74 70 66 85 C 57 95 46 92 40 60 L 40 105 L 62 105 L 54 60 L 48 18 Z"
                    fill="#F5F5F4"
                    stroke="#44403C"
                    strokeWidth="1"
                  />
                  <line x1="40" y1="18" x2="40" y2="105" stroke="#B45309" strokeWidth="1.2" />
                  <text x="40" y="118" textAnchor="middle" fill="#78716C" fontSize="8">
                    对襟直领·微展
                  </text>
                </g>

                {/* Mini Back */}
                <g transform="translate(84, 0)">
                  <text x="40" y="10" textAnchor="middle" fill="#57534E" fontSize="9" fontWeight="bold">
                    【后背正视】
                  </text>
                  <path
                    d="M 32 18 L 14 30 C 6 45 6 70 14 85 C 23 95 34 92 40 60 L 40 105 L 18 105 L 26 60 L 32 18 Z"
                    fill="#F5F5F4"
                    stroke="#44403C"
                    strokeWidth="1"
                  />
                  <path
                    d="M 48 18 L 66 30 C 74 45 74 70 66 85 C 57 95 46 92 40 60 L 40 105 L 62 105 L 54 60 L 48 18 Z"
                    fill="#F5F5F4"
                    stroke="#44403C"
                    strokeWidth="1"
                  />
                  <path d="M 34 18 Q 40 22 46 18" fill="none" stroke="#B45309" strokeWidth="1.2" />
                  <line x1="40" y1="21" x2="40" y2="105" stroke="#44403C" strokeWidth="1" strokeDasharray="2,1" />
                  <text x="40" y="118" textAnchor="middle" fill="#78716C" fontSize="8">
                    后中缝·微展摆
                  </text>
                </g>
              </g>

              {/* Authentic Parameters Table from Reference Image (大袖衫尺寸参数表) */}
              <g transform="translate(8, 158)">
                <rect x="0" y="0" width="164" height="300" fill="#FFFFFF" stroke="#A8A29E" strokeWidth="1" rx="2" />
                <rect x="0" y="0" width="164" height="24" fill="#E7E5E4" />
                <text x="82" y="16" textAnchor="middle" fill="#1C1917" fontSize="10.5" fontWeight="bold" fontFamily="serif">
                  大袖衫尺寸参数表
                </text>
                
                {/* Table Header */}
                <rect x="0" y="24" width="164" height="18" fill="#F5F5F4" />
                <line x1="0" y1="42" x2="164" y2="42" stroke="#D6D3D1" strokeWidth="1" />
                <line x1="95" y1="24" x2="95" y2="295" stroke="#E7E5E4" strokeWidth="1" />
                <text x="48" y="37" textAnchor="middle" fill="#57534E" fontSize="9" fontWeight="bold">部位名称</text>
                <text x="130" y="37" textAnchor="middle" fill="#57534E" fontSize="9" fontWeight="bold">尺寸 (cm)</text>

                {/* Rows mapping to uploaded reference drawing */}
                {[
                  { label: '衣长', val: currentLength },
                  { label: '胸围', val: `${bustCm} (1/4=${bustQuarterCm})` },
                  { label: '通袖长', val: `${fullSleeveLengthCm} (1/2=${halfSleeveLengthCm})` },
                  { label: '袖口宽', val: sleeveOpeningCm },
                  { label: '袖肥', val: sleeveRootCm },
                  { label: '横开领口宽', val: neckWidthCm },
                  { label: '后领口深', val: backNeckDepthCm },
                  { label: '领缘宽', val: collarBandWidthCm },
                  { label: '下摆宽/4', val: `${hemQuarterCm} (微展)` },
                ].map((row, idx) => {
                  const y = 43 + idx * 25;
                  return (
                    <g key={row.label}>
                      {idx % 2 === 1 && <rect x="0" y={y} width="164" height="25" fill="#FAFAF9" />}
                      <line x1="0" y1={y + 25} x2="164" y2={y + 25} stroke="#F5F5F4" strokeWidth="1" />
                      <text x="10" y={y + 16} fill="#44403C" fontSize="9.5">
                        {row.label}
                      </text>
                      <text x="160" y={y + 16} textAnchor="end" fill="#0C0A09" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                        {row.val}
                      </text>
                    </g>
                  );
                })}

                {/* Table Footer note */}
                <text x="82" y="285" textAnchor="middle" fill="#B45309" fontSize="8" fontWeight="medium">
                  ※ 样式设定：下摆比上面稍微宽
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

              {/* Main Cutting Piece: Body + Sleeve continuous, with flared hem */}
              {/* Back body: X: 80 to 200 at armpit, flaring out to 235 at hem */}
              <path
                d="M 80 248 Q 95 248 112 260 L 200 260 L 200 195 L 235 50 L 80 50 L 80 248 Z"
                fill="#FEF3C7"
                stroke="#44403C"
                strokeWidth="1.8"
              />
              {/* Front body: X: 80 to 200 at armpit, flaring out to 235 at hem */}
              <path
                d="M 112 260 L 80 320 L 80 470 L 235 470 L 200 325 L 200 260 Z"
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
                d="M 72 42 L 243 42 L 208 190 L 488 157 L 488 363 C 385 460 283 450 208 333 L 243 478 L 72 478 Z"
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
                后衣长 {currentLength}
              </text>

              {/* Front length (前衣长 130) */}
              <line x1="55" y1="260" x2="55" y2="470" stroke="#292524" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <line x1="45" y1="470" x2="65" y2="470" stroke="#292524" strokeWidth="1" />
              <text x="50" y="370" textAnchor="end" fill="#1C1917" fontSize="11" fontWeight="bold">
                前衣长 {currentLength}
              </text>

              {/* Neck width & depth (横开领 8.5 / 后领深 2.8) */}
              <text x="82" y="240" fill="#1C1917" fontSize="9">后领深 {backNeckDepthCm}</text>
              <text x="115" y="252" fill="#1C1917" fontSize="9">横开 {neckWidthCm}</text>

              {/* Body width at chest (胸围/4 = bustQuarterCm) */}
              <line x1="80" y1="325" x2="200" y2="325" stroke="#78716C" strokeWidth="1" strokeDasharray="3,3" />
              <text x="140" y="320" textAnchor="middle" fill="#1C1917" fontSize="10" fontWeight="bold">
                胸围/4 = {bustQuarterCm}
              </text>

              {/* Hem width (下摆微展宽) */}
              <line x1="80" y1="480" x2="235" y2="480" stroke="#B45309" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <line x1="80" y1="474" x2="80" y2="486" stroke="#B45309" strokeWidth="1" />
              <line x1="235" y1="474" x2="235" y2="486" stroke="#B45309" strokeWidth="1" />
              <text x="157" y="496" textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="bold">
                下摆宽/4 = {hemQuarterCm} (微展 +{hemQuarterCm - bustQuarterCm}cm)
              </text>

              {/* Sleeve root (袖肥) */}
              <line x1="200" y1="260" x2="200" y2="325" stroke="#292524" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <text x="195" y="295" textAnchor="end" fill="#1C1917" fontSize="10" fontWeight="bold">
                袖肥 {sleeveRootCm}
              </text>

              {/* Half sleeve length (通袖长/2) */}
              <line x1="80" y1="30" x2="480" y2="30" stroke="#292524" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <line x1="80" y1="20" x2="80" y2="40" stroke="#292524" strokeWidth="1" />
              <line x1="480" y1="20" x2="480" y2="40" stroke="#292524" strokeWidth="1" />
              <text x="280" y="24" textAnchor="middle" fill="#1C1917" fontSize="12" fontWeight="bold">
                通袖长/2 = {halfSleeveLengthCm}
              </text>

              {/* Sleeve opening (袖口宽) */}
              <line x1="495" y1="165" x2="495" y2="355" stroke="#292524" strokeWidth="1.2" markerEnd="url(#bp-arrow)" markerStart="url(#bp-arrow)" />
              <line x1="485" y1="165" x2="505" y2="165" stroke="#292524" strokeWidth="1" />
              <line x1="485" y1="355" x2="505" y2="355" stroke="#292524" strokeWidth="1" />
              <text x="510" y="265" fill="#1C1917" fontSize="11" fontWeight="bold">
                袖口宽 {sleeveOpeningCm}
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
                  宽 {collarBandWidthCm}
                </text>
                <line x1="0" y1="-5" x2="40" y2="-5" stroke="#292524" strokeWidth="1" />

                {/* Collar length callout */}
                <text x="50" y="180" fill="#1C1917" fontSize="10" fontWeight="bold">
                  长 {collarBandLengthCm}cm
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
                  <td className="text-right">{currentLength * 2} × {bustQuarterCm}~{hemQuarterCm}</td>
                  <td className="text-right text-stone-500">+1.5，底+3</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">袖片</td>
                  <td className="text-center">2 片</td>
                  <td className="text-right">{halfSleeveLengthCm - bustQuarterCm} × {sleeveOpeningCm}</td>
                  <td className="text-right text-stone-500">+1.5，口+3</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">领缘</td>
                  <td className="text-center">1 条</td>
                  <td className="text-right">{collarBandLengthCm} × {collarBandWidthCm}</td>
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
