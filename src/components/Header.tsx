import React from 'react';
import { HanfuStyle } from '../types/hanfu';
import { HANFU_STYLES } from '../data/hanfuData';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentStyle: HanfuStyle;
  onSelectStyle: (style: HanfuStyle) => void;
  panelCount: number;
  onChangePanelCount: (count: number) => void;
  activeView: 'flat' | 'drape' | 'print';
  setActiveView: (view: 'flat' | 'drape' | 'print') => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStyle,
  onSelectStyle,
  panelCount,
  onChangePanelCount,
  activeView,
  setActiveView,
  onReset,
}) => {
  return (
    <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: App title & Style selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              汉
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-serif font-bold text-stone-900 leading-tight">
                汉服定制设计
              </h1>
            </div>
          </div>

          {/* Style Selector (Selectable styles, built for future extensions) */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-stone-200">
            <label htmlFor="style-select" className="text-xs text-stone-500">
              形制:
            </label>
            <select
              id="style-select"
              value={currentStyle.id}
              onChange={(e) => {
                const found = HANFU_STYLES.find((s) => s.id === e.target.value);
                if (found) onSelectStyle(found);
              }}
              className="text-xs font-medium bg-stone-50 border border-stone-300 text-stone-800 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {HANFU_STYLES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} · {st.dynasty}
                </option>
              ))}
            </select>
          </div>

          {/* Panel Count adjuster */}
          {currentStyle.id === 'mamianqun' ? (
            <div className="hidden sm:flex items-center gap-1 text-xs text-stone-600 bg-stone-100/70 border border-stone-200 px-2 py-0.5 rounded-md">
              <span className="text-[11px]">裁片数:</span>
              <button
                type="button"
                disabled={panelCount <= currentStyle.minPanels}
                onClick={() => onChangePanelCount(Math.max(currentStyle.minPanels, panelCount - 2))}
                className="w-5 h-5 rounded hover:bg-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed font-bold cursor-pointer"
                title="减少"
              >
                -
              </button>
              <span className="font-mono font-bold text-stone-900 px-1">{panelCount}</span>
              <button
                type="button"
                disabled={panelCount >= currentStyle.maxPanels}
                onClick={() => onChangePanelCount(Math.min(currentStyle.maxPanels, panelCount + 2))}
                className="w-5 h-5 rounded hover:bg-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed font-bold cursor-pointer"
                title="增加"
              >
                +
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100/70 border border-stone-200 px-2.5 py-1 rounded-md">
              <span className="text-[11px] text-stone-500">结构:</span>
              <span className="font-medium text-stone-800">5裁片部位</span>
            </div>
          )}
        </div>

        {/* Right: Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            title="重置设计"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>
    </header>
  );
};
