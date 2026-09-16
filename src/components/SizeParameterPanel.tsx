import React, { useState } from 'react';
import { HanfuStyle, PanelData, SkirtDimensions, RobeDimensions } from '../types/hanfu';
import {
  Ruler,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface SizeParameterPanelProps {
  currentStyle: HanfuStyle;
  panels: PanelData[];
  onUpdatePanel: (panelId: number, updates: Partial<PanelData>) => void;
  onUpdateAllPanels: (updates: Partial<PanelData>) => void;
  // Skirt parameters
  skirtDims: SkirtDimensions;
  onChangeSkirtDims: (dims: Partial<SkirtDimensions>) => void;
  onChangePanelCount: (count: number) => void;
  // Robe parameters
  robeDims: RobeDimensions;
  onChangeRobeDims: (dims: Partial<RobeDimensions>) => void;
}

export const SizeParameterPanel: React.FC<SizeParameterPanelProps> = ({
  currentStyle,
  panels,
  onUpdatePanel,
  onUpdateAllPanels,
  skirtDims,
  onChangeSkirtDims,
  onChangePanelCount,
  robeDims,
  onChangeRobeDims,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const isRobe = currentStyle.category === 'robe' || currentStyle.id === 'daxiushan';

  // Presets for quick tailoring standards
  const skirtPresets = [
    {
      name: '8片标准款',
      panelCount: 8,
      length: 95,
      defaultWidth: 28,
    },
    {
      name: '10片修长款',
      panelCount: 10,
      length: 102,
      defaultWidth: 26,
    },
    {
      name: '6片轻便款',
      panelCount: 6,
      length: 82,
      defaultWidth: 32,
    },
    {
      name: '12片密褶款',
      panelCount: 12,
      length: 96,
      defaultWidth: 22,
    },
  ];

  const robePresets = [
    {
      name: '图纸标准 (130/116/210/110)',
      span: 210,
      length: 130,
      chest: 116,
      sleeveWidth: 110,
      sleeveRoot: 38,
      neckWidth: 8.5,
      backNeckDepth: 2.8,
      collar: 8,
      hemWidth: 72,
    },
    {
      name: '盛唐大袍 (138/122/230/125)',
      span: 230,
      length: 138,
      chest: 122,
      sleeveWidth: 125,
      sleeveRoot: 42,
      neckWidth: 9,
      backNeckDepth: 3.0,
      collar: 9,
      hemWidth: 80,
    },
    {
      name: '对襟常服 (118/108/185/90)',
      span: 185,
      length: 118,
      chest: 108,
      sleeveWidth: 90,
      sleeveRoot: 35,
      neckWidth: 8,
      backNeckDepth: 2.5,
      collar: 7.5,
      hemWidth: 66,
    },
    {
      name: '短款大袖 (96/102/170/80)',
      span: 170,
      length: 96,
      chest: 102,
      sleeveWidth: 80,
      sleeveRoot: 32,
      neckWidth: 8,
      backNeckDepth: 2.4,
      collar: 7,
      hemWidth: 62,
    },
  ];

  // Apply a skirt preset uniformly
  const handleApplySkirtPreset = (preset: (typeof skirtPresets)[0]) => {
    onChangePanelCount(preset.panelCount);
    onChangeSkirtDims({
      panelCount: preset.panelCount,
      skirtLengthCm: preset.length,
      defaultPanelWidthCm: preset.defaultWidth,
    });
    onUpdateAllPanels({
      widthCm: preset.defaultWidth,
      lengthCm: preset.length,
    });
  };

  // Sync uniform panel width to all skirt panels
  const handleSyncAllPanelWidth = (width: number) => {
    onChangeSkirtDims({ defaultPanelWidthCm: width });
    onUpdateAllPanels({ widthCm: width });
  };

  // Sync uniform skirt length to all skirt panels
  const handleSyncAllPanelLength = (length: number) => {
    onChangeSkirtDims({ skirtLengthCm: length });
    onUpdateAllPanels({ lengthCm: length });
  };

  // Calculate total skirt width
  const totalSkirtSpreadWidth = panels.length * (skirtDims.defaultPanelWidthCm || 28);

  return (
    <div className="w-full bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden transition-all">
      {/* Header bar with toggle */}
      <div
        className="px-4 py-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between cursor-pointer select-none hover:bg-stone-100/70 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Ruler className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-stone-900 text-sm">
              尺寸参数
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {isRobe
                ? `通袖 ${robeDims.sleeveSpanCm} · 衣长 ${robeDims.garmentLengthCm} · 袖宽 ${robeDims.sleeveWidthCm} cm`
                : `${panels.length}片 · 裙长 ${skirtDims.skirtLengthCm} · 展宽 ${totalSkirtSpreadWidth} cm`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1 rounded text-stone-500 hover:text-stone-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Body */}
      {isExpanded && (
        <div className="p-4 flex flex-col gap-3.5">
          {/* ========================================================================= */}
          {/* SECTION A: MAMIANQUN (马面裙) PARAMETERS */}
          {/* ========================================================================= */}
          {!isRobe && (
            <div className="flex flex-col gap-3">
              {/* Presets Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs">
                <span className="text-stone-500 font-medium whitespace-nowrap">
                  预设:
                </span>
                {skirtPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplySkirtPreset(preset)}
                    className={`px-2.5 py-1 rounded border text-xs whitespace-nowrap transition-colors cursor-pointer ${
                      panels.length === preset.panelCount &&
                      skirtDims.skirtLengthCm === preset.length
                        ? 'bg-amber-50 text-amber-800 border-amber-300 font-medium'
                        : 'bg-stone-50 hover:bg-white text-stone-700 border-stone-200'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Main Core Inputs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-lg border border-stone-200">
                {/* 1. 裁片数 */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-panel-count" className="text-xs font-medium text-stone-700">
                    裁片数
                  </label>
                  <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden focus-within:ring-1 focus-within:ring-amber-500">
                    <button
                      type="button"
                      disabled={panels.length <= 4}
                      onClick={() => onChangePanelCount(Math.max(4, panels.length - 2))}
                      className="px-2.5 py-1 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed text-stone-600 font-bold"
                    >
                      -
                    </button>
                    <input
                      id="input-panel-count"
                      type="number"
                      min={4}
                      max={16}
                      step={2}
                      value={panels.length}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 4 && val <= 16) {
                          onChangePanelCount(val);
                        }
                      }}
                      className="w-full text-center text-xs font-semibold text-stone-900 py-1 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={panels.length >= 16}
                      onClick={() => onChangePanelCount(Math.min(16, panels.length + 2))}
                      className="px-2.5 py-1 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed text-stone-600 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 2. 裙长 */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-skirt-length" className="text-xs font-medium text-stone-700">
                    裙长 (cm)
                  </label>
                  <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                    <input
                      id="input-skirt-length"
                      type="number"
                      min={60}
                      max={130}
                      value={skirtDims.skirtLengthCm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          handleSyncAllPanelLength(val);
                        }
                      }}
                      className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                    />
                    <span className="text-xs text-stone-400 ml-1">cm</span>
                  </div>
                </div>

                {/* 3. 单片宽 */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-panel-width" className="text-xs font-medium text-stone-700">
                    单片宽 (cm)
                  </label>
                  <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                    <input
                      id="input-panel-width"
                      type="number"
                      min={15}
                      max={60}
                      value={skirtDims.defaultPanelWidthCm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          handleSyncAllPanelWidth(val);
                        }
                      }}
                      className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                    />
                    <span className="text-xs text-stone-400 ml-1">cm</span>
                  </div>
                </div>

                {/* 4. 腰高 */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-waistband-height" className="text-xs font-medium text-stone-700">
                    腰高 (cm)
                  </label>
                  <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                    <input
                      id="input-waistband-height"
                      type="number"
                      min={4}
                      max={15}
                      value={skirtDims.waistbandHeightCm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          onChangeSkirtDims({ waistbandHeightCm: val });
                        }
                      }}
                      className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                    />
                    <span className="text-xs text-stone-400 ml-1">cm</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION B: DAXIUSHAN (大袖衫) PARAMETERS */}
          {/* ========================================================================= */}
          {isRobe && (
            <div className="flex flex-col gap-3">
              {/* Reference Diagram Specs Card Header */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-950">
                  <Ruler className="w-3.5 h-3.5 text-amber-700" />
                  <span>图纸标准尺寸:</span>
                  <span className="font-mono text-[11px] font-normal text-amber-900">
                    衣长130 · 胸围116(1/4=29) · 通袖210(1/2=105) · 袖口110 · 袖肥38 · 横开8.5 · 后深2.8 · 缘宽8 · 下摆72(微展)
                  </span>
                </div>

                {/* Reset to Diagram Specs Button */}
                <button
                  type="button"
                  onClick={() =>
                    onChangeRobeDims({
                      garmentLengthCm: 130,
                      chestCircumferenceCm: 116,
                      sleeveSpanCm: 210,
                      sleeveWidthCm: 110,
                      sleeveRootDepthCm: 38,
                      neckWidthCm: 8.5,
                      backNeckDepthCm: 2.8,
                      collarBandWidthCm: 8,
                      hemWidthCm: 72,
                    })
                  }
                  className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>载入标准</span>
                </button>
              </div>

              {/* Presets Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs">
                <span className="text-stone-500 font-medium whitespace-nowrap">
                  预设:
                </span>
                {robePresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() =>
                      onChangeRobeDims({
                        sleeveSpanCm: preset.span,
                        garmentLengthCm: preset.length,
                        chestCircumferenceCm: preset.chest,
                        sleeveWidthCm: preset.sleeveWidth,
                        sleeveRootDepthCm: preset.sleeveRoot,
                        neckWidthCm: preset.neckWidth,
                        backNeckDepthCm: preset.backNeckDepth,
                        collarBandWidthCm: preset.collar,
                        hemWidthCm: preset.hemWidth,
                      })
                    }
                    className={`px-2 py-0.5 rounded border text-xs whitespace-nowrap transition-colors cursor-pointer ${
                      robeDims.sleeveSpanCm === preset.span &&
                      robeDims.garmentLengthCm === preset.length &&
                      (robeDims.chestCircumferenceCm ?? 116) === preset.chest
                        ? 'bg-amber-50 text-amber-800 border-amber-300 font-medium'
                        : 'bg-stone-50 hover:bg-white text-stone-700 border-stone-200'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Core Dimensions */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-stone-700">主要尺寸</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  {/* 衣长 */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-garment-length" className="text-xs text-stone-600">
                      衣长 (cm)
                    </label>
                    <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                      <input
                        id="input-garment-length"
                        type="number"
                        min={70}
                        max={180}
                        step={1}
                        value={robeDims.garmentLengthCm}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onChangeRobeDims({ garmentLengthCm: val });
                          }
                        }}
                        className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-400 ml-1">cm</span>
                    </div>
                  </div>

                  {/* 胸围 */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <label htmlFor="input-chest-circ">胸围 (cm)</label>
                      <span className="text-[10px] text-amber-800 font-mono">1/4={Math.round((robeDims.chestCircumferenceCm ?? 116) / 4)}</span>
                    </div>
                    <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                      <input
                        id="input-chest-circ"
                        type="number"
                        min={80}
                        max={160}
                        step={1}
                        value={robeDims.chestCircumferenceCm ?? 116}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onChangeRobeDims({
                              chestCircumferenceCm: val,
                              bodyHalfWidthCm: Math.round(val / 2),
                            });
                          }
                        }}
                        className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-400 ml-1">cm</span>
                    </div>
                  </div>

                  {/* 通袖长 */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <label htmlFor="input-sleeve-span">通袖长 (cm)</label>
                      <span className="text-[10px] text-amber-800 font-mono">1/2={Math.round((robeDims.sleeveSpanCm ?? 210) / 2)}</span>
                    </div>
                    <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                      <input
                        id="input-sleeve-span"
                        type="number"
                        min={140}
                        max={280}
                        step={1}
                        value={robeDims.sleeveSpanCm}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onChangeRobeDims({ sleeveSpanCm: val, totalSleeveSpanCm: val });
                          }
                        }}
                        className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-400 ml-1">cm</span>
                    </div>
                  </div>

                  {/* 袖口宽 */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-sleeve-width" className="text-xs text-stone-600">
                      袖口宽 (cm)
                    </label>
                    <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                      <input
                        id="input-sleeve-width"
                        type="number"
                        min={50}
                        max={160}
                        step={1}
                        value={robeDims.sleeveWidthCm}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onChangeRobeDims({ sleeveWidthCm: val, sleeveOpeningCm: val });
                          }
                        }}
                        className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-400 ml-1">cm</span>
                    </div>
                  </div>

                  {/* 下摆半宽 */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-hem-width" className="text-xs text-stone-600 flex items-center justify-between">
                      <span>下摆半宽 (cm)</span>
                      <span className="text-[10px] text-amber-800">微展</span>
                    </label>
                    <div className="flex items-center border border-amber-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                      <input
                        id="input-hem-width"
                        type="number"
                        min={50}
                        max={120}
                        step={1}
                        value={robeDims.hemWidthCm ?? 72}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onChangeRobeDims({ hemWidthCm: val });
                          }
                        }}
                        className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-400 ml-1">cm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tailoring Details */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-stone-700">细部尺寸</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  {/* 袖肥 */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-sleeve-root" className="text-xs text-stone-600">
                      袖肥 (cm)
                    </label>
                    <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                      <input
                        id="input-sleeve-root"
                        type="number"
                        min={20}
                        max={60}
                        step={0.5}
                        value={robeDims.sleeveRootDepthCm ?? 38}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onChangeRobeDims({ sleeveRootDepthCm: val });
                          }
                        }}
                        className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-400 ml-1">cm</span>
                    </div>
                  </div>

                  {/* 横开领口宽 */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-neck-width" className="text-xs text-stone-600">
                      横开领口 (cm)
                    </label>
                    <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                      <input
                        id="input-neck-width"
                        type="number"
                        min={5}
                        max={15}
                        step={0.1}
                        value={robeDims.neckWidthCm ?? 8.5}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onChangeRobeDims({ neckWidthCm: val });
                          }
                        }}
                        className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-400 ml-1">cm</span>
                    </div>
                  </div>

                  {/* 后领口深 */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-back-neck-depth" className="text-xs text-stone-600">
                      后领深 (cm)
                    </label>
                    <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                      <input
                        id="input-back-neck-depth"
                        type="number"
                        min={1}
                        max={8}
                        step={0.1}
                        value={robeDims.backNeckDepthCm ?? 2.8}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onChangeRobeDims({ backNeckDepthCm: val });
                          }
                        }}
                        className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-400 ml-1">cm</span>
                    </div>
                  </div>

                  {/* 领缘宽 */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-collar-width" className="text-xs text-stone-600">
                      领缘宽 (cm)
                    </label>
                    <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden px-2 py-1 focus-within:ring-1 focus-within:ring-amber-500">
                      <input
                        id="input-collar-width"
                        type="number"
                        min={4}
                        max={20}
                        step={0.5}
                        value={robeDims.collarBandWidthCm}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            onChangeRobeDims({
                              collarBandWidthCm: val,
                              collarBandLengthCm: Math.round(robeDims.garmentLengthCm * 2 + 8),
                            });
                          }
                        }}
                        className="w-full text-xs font-semibold text-stone-900 focus:outline-none"
                      />
                      <span className="text-xs text-stone-400 ml-1">cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
