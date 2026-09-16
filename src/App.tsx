import React, { useState } from 'react';
import { HANFU_STYLES, TRADITIONAL_COLORS, FABRIC_MATERIALS, TRADITIONAL_MOTIFS } from './data/hanfuData';
import { HanfuStyle, PanelData, HanfuSticker, MotifDef, SkirtDimensions, RobeDimensions } from './types/hanfu';
import { Header } from './components/Header';
import { FlatCanvas } from './components/FlatCanvas';
import { GarmentPreview } from './components/GarmentPreview';
import { CuttingPatternPrint } from './components/CuttingPatternPrint';
import { MaterialColorPicker } from './components/MaterialColorPicker';
import { StickerLibrary } from './components/StickerLibrary';
import { SizeParameterPanel } from './components/SizeParameterPanel';

function createDefaultPanels(style: HanfuStyle, count: number): PanelData[] {
  if (style.category === 'robe' || style.id === 'daxiushan') {
    const robeLabels = ['前身', '后身', '左广袖', '右广袖', '直领领缘'];
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      color: i === 4 ? '#FAF7F0' : '#891D28',
      materialId: i === 4 ? 'woven-gold' : 'cloud-gauze',
      label: robeLabels[i] || `裁片${i + 1}`,
      lengthCm: i === 4 ? 268 : 130,
      widthCm: i === 4 ? 8 : (i < 2 ? 58 : 110),
    }));
  }

  return Array.from({ length: count }, (_, i) => {
    let label = `第${i + 1}片`;
    if (count === 8) {
      const labels = [
        '左对褶1',
        '左对褶2',
        '前裙门',
        '前裙门内',
        '右对褶1',
        '右对褶2',
        '后裙门',
        '后裙门内',
      ];
      label = labels[i] || `第${i + 1}片`;
    } else {
      label = i % 2 === 0 ? '侧对褶' : '裙门';
    }
    return {
      id: i,
      color: '#1C3144',
      materialId: 'woven-gold',
      label,
      widthCm: 28,
      lengthCm: 95,
    };
  });
}

export default function App() {
  const [currentStyle, setCurrentStyle] = useState<HanfuStyle>(HANFU_STYLES[0]);
  const [panelCount, setPanelCount] = useState<number>(HANFU_STYLES[0].defaultPanels);
  const [panels, setPanels] = useState<PanelData[]>(() =>
    createDefaultPanels(HANFU_STYLES[0], HANFU_STYLES[0].defaultPanels)
  );
  // 初始无默认纹样，清爽初始画布供用户自由设计
  const [stickers, setStickers] = useState<HanfuSticker[]>([]);

  // Dimension customization state for Skirt (Mamianqun)
  const [skirtDims, setSkirtDims] = useState<SkirtDimensions>({
    panelCount: 8,
    skirtLengthCm: 95,
    waistbandHeightCm: 7,
    waistbandLengthCm: 110,
    defaultPanelWidthCm: 28,
  });

  // Dimension customization state for Robe (Daxiushan) - 完全参考图纸标准尺寸
  const [robeDims, setRobeDims] = useState<RobeDimensions>({
    garmentLengthCm: 130, // 衣长 130 (后衣长 / 前衣长)
    chestCircumferenceCm: 116, // 胸围 116 (胸围/4 = 29)
    sleeveSpanCm: 210, // 通袖长 210 (通袖长/2 = 105)
    totalSleeveSpanCm: 210,
    sleeveWidthCm: 110, // 袖口宽 110
    sleeveOpeningCm: 110,
    sleeveRootDepthCm: 38, // 袖肥 38
    neckWidthCm: 8.5, // 横开领口宽 8.5
    backNeckDepthCm: 2.8, // 后领口深 2.8
    collarBandWidthCm: 8, // 领缘宽 8
    collarBandLengthCm: 268, // 领缘长
    bodyHalfWidthCm: 58, // 胸宽半身 58 (胸围116 / 2)
    hemWidthCm: 72, // 下摆半宽 72 (整摆144，下摆/4=36，比胸围/4 29微展7cm)
    cuffWidthCm: 110,
  });

  // Active selections
  const [selectedPanelId, setSelectedPanelId] = useState<number | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'flat' | 'drape' | 'print'>('flat');

  // Currently chosen color & material for painting
  const [activeColor, setActiveColor] = useState<string>('#1C3144');
  const [activeMaterialId, setActiveMaterialId] = useState<string>('woven-gold');

  // Specs
  const skirtLengthCm = skirtDims.skirtLengthCm;
  const waistbandColor = '#FAF7F0'; // 传统白布或素色腰头

  // Switch style (extensible for future garment styles)
  const handleSelectStyle = (style: HanfuStyle) => {
    setCurrentStyle(style);
    setPanelCount(style.defaultPanels);
    setPanels(createDefaultPanels(style, style.defaultPanels));
    setStickers([]);
    if (style.id === 'daxiushan' || style.category === 'robe') {
      setActiveColor('#891D28');
      setActiveMaterialId('cloud-gauze');
    } else {
      setActiveColor('#1C3144');
      setActiveMaterialId('woven-gold');
    }
    setSelectedPanelId(null);
    setSelectedStickerId(null);
  };

  // Adjust panel count N
  const handleChangePanelCount = (newCount: number) => {
    setPanelCount(newCount);
    setSkirtDims((prev) => ({ ...prev, panelCount: newCount }));
    setPanels((prev) => {
      const updated: PanelData[] = [];
      for (let i = 0; i < newCount; i++) {
        if (i < prev.length) {
          updated.push({ ...prev[i], id: i });
        } else {
          updated.push({
            id: i,
            color: activeColor,
            materialId: activeMaterialId,
            label: i % 2 === 0 ? '侧褶片' : '裙门片',
            widthCm: skirtDims.defaultPanelWidthCm || 28,
            lengthCm: skirtDims.skirtLengthCm || 95,
          });
        }
      }
      return updated;
    });
    setSelectedPanelId(null);
  };

  // Handle updates to skirt dimensions
  const handleChangeSkirtDims = (updates: Partial<SkirtDimensions>) => {
    setSkirtDims((prev) => {
      const next = { ...prev, ...updates };
      // Keep panel lengths in sync with skirt length
      if (updates.skirtLengthCm) {
        setPanels((pList) =>
          pList.map((p) => ({ ...p, lengthCm: updates.skirtLengthCm }))
        );
      }
      return next;
    });
  };

  // Handle updates to robe dimensions
  const handleChangeRobeDims = (updates: Partial<RobeDimensions>) => {
    setRobeDims((prev) => ({ ...prev, ...updates }));
  };

  // Panel updates
  const handleApplyToPanel = (panelId: number, updates: Partial<PanelData>) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === panelId ? { ...p, ...updates } : p))
    );
  };

  const handleApplyToAll = (updates: Partial<PanelData>) => {
    setPanels((prev) => prev.map((p) => ({ ...p, ...updates })));
  };


  // Sticker updates
  const handleAddSticker = (motif: any, targetPanelId?: number | null, threadColor?: string) => {
    let posX = 50;
    let posY = 50;
    let stickerWidth = 14;

    let stickerSide: 'front' | 'back' = 'front';

    if (currentStyle.id === 'daxiushan' || currentStyle.category === 'robe') {
      if (targetPanelId === 1) {
        // Back body
        posX = 50;
        posY = 42;
        stickerWidth = 22;
        stickerSide = 'back';
      } else if (targetPanelId === 0) {
        // Front body
        posX = 50;
        posY = 45;
        stickerWidth = 20;
        stickerSide = 'front';
      } else if (targetPanelId === 2) {
        // Left broad sleeve
        posX = 20;
        posY = 36;
        stickerWidth = 18;
        stickerSide = selectedPanelId === 1 ? 'back' : 'front';
      } else if (targetPanelId === 3) {
        // Right broad sleeve
        posX = 80;
        posY = 36;
        stickerWidth = 18;
        stickerSide = selectedPanelId === 1 ? 'back' : 'front';
      } else if (targetPanelId === 4) {
        // Collar band
        posX = 50;
        posY = 45;
        stickerWidth = 10;
        stickerSide = 'front';
      } else {
        // Default smart placement for robe
        stickerSide = selectedPanelId === 1 ? 'back' : 'front';
        if (motif.category === 'auspicious') {
          posX = 50;
          posY = 40;
          stickerWidth = 22;
        } else if (motif.category === 'hem') {
          posX = 50;
          posY = 84;
          stickerWidth = 32;
        } else {
          posX = 50;
          posY = 45;
          stickerWidth = 20;
        }
      }
    } else {
      // Mamianqun skirt placement
      if (motif.category === 'hem') {
        posX = 50;
        posY = 86;
        stickerWidth = 96;
      } else if (targetPanelId !== undefined && targetPanelId !== null) {
        // Align to targeted panel center
        const panelWidth = 100 / panelCount;
        posX = panelWidth * targetPanelId + panelWidth / 2;
        posY = 50;
        stickerWidth = Math.min(22, panelWidth * 0.85);
      } else {
        // Default to front apron panel area
        posX = 37.5;
        posY = 48;
      }
    }

    const newSticker: HanfuSticker = {
      id: `stk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      motifId: motif.id,
      imgUrl: (motif as any).url || (motif as any).imgUrl,
      x: Math.round(posX * 10) / 10,
      y: Math.round(posY * 10) / 10,
      width: Math.round(stickerWidth),
      height: Math.round(stickerWidth / (motif.aspectRatio || 1)),
      rotation: 0,
      color: threadColor || (motif as any).color || '#C29B38',
      side: stickerSide,
    };

    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
    setSelectedPanelId(null);
    if (activeView !== 'flat') {
      setActiveView('flat');
    }
  };

  const handleUpdateSticker = (id: string, updates: Partial<HanfuSticker>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleDeleteSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
  };

  const handleReset = () => {
    setPanels(createDefaultPanels(currentStyle, panelCount));
    setStickers([]);
    setSelectedPanelId(null);
    setSelectedStickerId(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased">
      {/* Top navigation & controls */}
      <Header
        currentStyle={currentStyle}
        onSelectStyle={handleSelectStyle}
        panelCount={panelCount}
        onChangePanelCount={handleChangePanelCount}
        activeView={activeView}
        setActiveView={setActiveView}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-5">
        {/* VIEW 1: Flat Pattern Design Canvas (展开设计) */}
        {activeView === 'flat' && (
          <div className="flex flex-col gap-5">
            {/* Flat Canvas */}
            <FlatCanvas
              currentStyle={currentStyle}
              panels={panels}
              selectedPanelId={selectedPanelId}
              onSelectPanel={(id) => {
                setSelectedPanelId(id);
                if (id !== null) {
                  const targetPanel = panels.find((p) => p.id === id);
                  if (targetPanel) {
                    setActiveColor(targetPanel.color);
                    setActiveMaterialId(targetPanel.materialId);
                  }
                }
              }}
              stickers={stickers}
              selectedStickerId={selectedStickerId}
              onSelectSticker={setSelectedStickerId}
              onUpdateSticker={handleUpdateSticker}
              onDeleteSticker={handleDeleteSticker}
              skirtLengthCm={skirtLengthCm}
              waistbandColor={waistbandColor}
              skirtDims={skirtDims}
              robeDims={robeDims}
            />

            {/* Custom Dimension and Pattern Sizing Panel (可填长度参数面板) */}
            <SizeParameterPanel
              currentStyle={currentStyle}
              panels={panels}
              onUpdatePanel={handleApplyToPanel}
              onUpdateAllPanels={handleApplyToAll}
              skirtDims={skirtDims}
              onChangeSkirtDims={handleChangeSkirtDims}
              onChangePanelCount={handleChangePanelCount}
              robeDims={robeDims}
              onChangeRobeDims={handleChangeRobeDims}
            />

            {/* Bottom Tool Panels: Color/Fabric Material + Sticker Library */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Material & Color Picker (7 cols) */}
              <div className="lg:col-span-7">
                <MaterialColorPicker
                  selectedPanelId={selectedPanelId}
                  panels={panels}
                  onApplyToPanel={handleApplyToPanel}
                  onApplyToAll={handleApplyToAll}
                  activeColor={activeColor}
                  setActiveColor={setActiveColor}
                  activeMaterialId={activeMaterialId}
                  setActiveMaterialId={setActiveMaterialId}
                />
              </div>

              {/* Traditional Sticker Library (5 cols) */}
              <div className="lg:col-span-5">
                <StickerLibrary
                  onAddSticker={handleAddSticker}
                  selectedPanelId={selectedPanelId}
                  panelCount={panelCount}
                  panels={panels}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Draped Garment 3D Silhouette Preview (成衣预览) */}
        {activeView === 'drape' && (
          <GarmentPreview
            currentStyle={currentStyle}
            panels={panels}
            stickers={stickers}
            waistbandColor={waistbandColor}
            skirtLengthCm={skirtLengthCm}
            skirtDims={skirtDims}
            robeDims={robeDims}
          />
        )}

        {/* VIEW 3: Final Pattern Cutting Blueprint & Print (打印裁剪图) */}
        {activeView === 'print' && (
          <CuttingPatternPrint
            currentStyle={currentStyle}
            panels={panels}
            stickers={stickers}
            skirtLengthCm={skirtLengthCm}
            waistbandColor={waistbandColor}
            skirtDims={skirtDims}
            robeDims={robeDims}
            onClose={() => setActiveView('flat')}
          />
        )}
      </main>
    </div>
  );
}
