import React, { useMemo, useState, useRef } from 'react';
import { PanelData } from '../types/hanfu';
import { loadDynamicStickers, DynamicStickerItem, EMBROIDERY_COLORS } from '../utils/stickerLoader';
import { MotifSvg } from './MotifSvg';
import { Stamp, Plus, Info, Upload } from 'lucide-react';

interface StickerLibraryProps {
  onAddSticker: (sticker: DynamicStickerItem, targetPanelId?: number | null, threadColor?: string) => void;
  selectedPanelId: number | null;
  panelCount: number;
  panels?: PanelData[];
}

export const StickerLibrary: React.FC<StickerLibraryProps> = ({
  onAddSticker,
  selectedPanelId,
  panels,
}) => {
  // 动态扫描载入图片文件夹下的所有贴纸图片合集（随文件夹内新增图片自动扩充）
  const baseStickers = useMemo(() => loadDynamicStickers(), []);
  const [uploadedStickers, setUploadedStickers] = useState<DynamicStickerItem[]>([]);
  const [selectedThreadColor, setSelectedThreadColor] = useState<string>('#C29B38');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allStickers = useMemo(() => {
    return [...uploadedStickers, ...baseStickers];
  }, [uploadedStickers, baseStickers]);

  const selectedPanel = panels && selectedPanelId !== null ? panels[selectedPanelId] : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (url) {
          const newCustom: DynamicStickerItem = {
            id: `custom-${Date.now()}-${i}`,
            url,
            aspectRatio: 1.0,
          };
          setUploadedStickers((prev) => [newCustom, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
    // 重置 input
    e.target.value = '';
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-col gap-3">
      {/* 标题栏 */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
        <div className="flex items-center gap-2">
          <Stamp className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-semibold text-stone-800">纹样贴纸库</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>上传图片</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/svg+xml,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileUpload}
            multiple
          />
        </div>
      </div>

      {/* 绣线色彩选择行 */}
      <div className="flex items-center justify-between bg-stone-50/90 border border-stone-200 rounded-lg px-2.5 py-1.5">
        <span className="text-[11px] text-stone-600 font-medium shrink-0">绣线颜色:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {EMBROIDERY_COLORS.map((c) => {
            const isSelected = selectedThreadColor === c.hex;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedThreadColor(c.hex)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-amber-600 bg-white text-stone-900 font-medium shadow-2xs scale-105'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
                title={c.name}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 提示栏 */}
      <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-2 text-[11px] text-stone-600 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        <span>
          {selectedPanel ? (
            <>已选: <strong>{selectedPanel.label}</strong>，点击纹样直接添加。</>
          ) : (
            <>点击纹样添加至画布，支持拖拽、缩放与旋转。</>
          )}
        </span>
      </div>

      {/* 纹样图片网格 */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {allStickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => onAddSticker(sticker, selectedPanelId, selectedThreadColor)}
            className="group aspect-square bg-stone-50/80 hover:bg-amber-50/40 rounded-lg border border-stone-200 hover:border-amber-500 p-2 flex items-center justify-center transition-all cursor-pointer relative shadow-2xs hover:shadow-xs"
          >
            <div className="w-full h-full flex items-center justify-center p-1">
              <MotifSvg
                motifId={sticker.id}
                imgUrl={sticker.url}
                color={selectedThreadColor}
                className="max-h-full max-w-full drop-shadow-xs group-hover:scale-105 transition-transform"
              />
            </div>

            {/* 鼠标悬停快捷添加标识 */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-amber-600 text-white p-0.5 rounded-full shadow transition-opacity">
              <Plus className="w-2.5 h-2.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
