import React from 'react';
import { TRADITIONAL_COLORS } from '../data/hanfuData';
import { PanelData } from '../types/hanfu';
import { Palette, Check, Paintbrush } from 'lucide-react';

interface MaterialColorPickerProps {
  selectedPanelId: number | null;
  panels: PanelData[];
  onApplyToPanel: (panelId: number, updates: Partial<PanelData>) => void;
  onApplyToAll: (updates: Partial<PanelData>) => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  activeMaterialId: string;
  setActiveMaterialId: (materialId: string) => void;
}

export const MaterialColorPicker: React.FC<MaterialColorPickerProps> = ({
  selectedPanelId,
  panels,
  onApplyToPanel,
  onApplyToAll,
  activeColor,
  setActiveColor,
  activeMaterialId,
  setActiveMaterialId,
}) => {
  const selectedPanel = panels.find((p) => p.id === selectedPanelId);

  const handleColorClick = (hex: string) => {
    setActiveColor(hex);
    if (selectedPanelId !== null) {
      onApplyToPanel(selectedPanelId, { color: hex });
    }
  };

  const handleMaterialClick = (matId: string) => {
    setActiveMaterialId(matId);
    if (selectedPanelId !== null) {
      onApplyToPanel(selectedPanelId, { materialId: matId });
    }
  };

  const handleApplyAll = () => {
    onApplyToAll({
      color: activeColor,
      materialId: activeMaterialId,
    });
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-col gap-4">
      {/* Header & Target Selector */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-semibold text-stone-800">裁片颜色</span>
        </div>

        {/* Target indication */}
        <div className="flex items-center gap-2">
          {selectedPanel ? (
            <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
              已选: {selectedPanel.label || `裁片${selectedPanel.id + 1}`}
            </span>
          ) : (
            <span className="text-[11px] text-stone-400">
              (未选裁片)
            </span>
          )}

          <button
            type="button"
            onClick={handleApplyAll}
            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-md transition-colors cursor-pointer"
            title="应用到全部裁片"
          >
            <Paintbrush className="w-3 h-3 text-amber-400" />
            <span>填充全部</span>
          </button>
        </div>
      </div>

      {/* 1. Traditional Chinese Colors Palette */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-stone-700 flex items-center gap-1">
            <span>传统配色</span>
          </label>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-stone-400">自定义:</span>
            <input
              type="color"
              value={activeColor}
              onChange={(e) => handleColorClick(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 p-0"
              title="自定义颜色"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {TRADITIONAL_COLORS.map((c) => {
            const isChosen = activeColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.hex}
                type="button"
                onClick={() => handleColorClick(c.hex)}
                className={`flex flex-col items-center p-1 rounded-md border transition-all cursor-pointer ${
                  isChosen
                    ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div
                  className="w-full h-5 rounded-sm border border-stone-300/40 relative flex items-center justify-center"
                  style={{ backgroundColor: c.hex }}
                >
                  {isChosen && <Check className="w-3 h-3 text-white drop-shadow-sm" />}
                </div>
                <span className="text-[10px] font-serif text-stone-800 mt-1 leading-none">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
