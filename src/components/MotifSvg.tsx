import React, { useId } from 'react';
import { loadDynamicStickers, getRawSvg, colorizeSvg, EMBROIDERY_COLORS } from '../utils/stickerLoader';

interface MotifSvgProps {
  motifId?: string;
  imgUrl?: string;
  color?: string;
  className?: string;
  glow?: boolean;
}

export const MotifSvg: React.FC<MotifSvgProps> = ({
  motifId,
  imgUrl,
  color = '#C29B38',
  className = '',
  glow = false,
}) => {
  const reactId = useId();
  const filterStyle = glow
    ? { filter: `drop-shadow(0 0 5px ${color}88)` }
    : undefined;

  // Resolve matching key for dynamic stickers
  let targetKey = motifId || '';
  if (!targetKey && imgUrl) {
    const filename = imgUrl.split('/').pop() || '';
    targetKey = filename.replace(/\.[^/.]+$/, '');
  }

  // Legacy ID aliases mapping
  const aliasMap: Record<string, string> = {
    'sea-cliff-hem': 'haishui_jiangya',
    'flying-crane': 'xiangyun_xianhe',
    'auspicious-cloud': 'ruyi_xiangyun',
    'baoxiang-flower': 'baoxiang_hua',
    'dragon-roundel': 'tuanlong_wen',
    'flying-fish': 'feiyu_wen',
    'lotus-scroll': 'chanzhi_lian',
    'ruyi-crest': 'ruyi_xiangyun',
  };

  const resolvedKey = aliasMap[targetKey] || targetKey;

  // 1. Try to fetch raw SVG from sticker library assets and recolor it with thread color
  const rawSvg = getRawSvg(resolvedKey) || (imgUrl ? getRawSvg(imgUrl) : null);
  if (rawSvg) {
    const colorized = colorizeSvg(rawSvg, color, `${resolvedKey}-${reactId}`);
    return (
      <div
        className={`inline-flex items-center justify-center select-none pointer-events-none [&>svg]:w-full [&>svg]:h-auto [&>svg]:block ${className}`}
        style={filterStyle}
        dangerouslySetInnerHTML={{ __html: colorized }}
      />
    );
  }

  // 2. If direct image URL is provided (e.g. custom user upload), colorize via CSS mask
  if (imgUrl) {
    const preset = EMBROIDERY_COLORS.find(
      (c) => c.hex.toLowerCase() === color.toLowerCase()
    );
    const bgGradient = preset
      ? `linear-gradient(135deg, ${preset.light} 0%, ${preset.base} 50%, ${preset.dark} 100%)`
      : color;

    return (
      <div className={`relative inline-block select-none pointer-events-none ${className}`} style={filterStyle}>
        <img
          src={imgUrl}
          alt=""
          className="w-full h-auto block opacity-0 pointer-events-none select-none"
          referrerPolicy="no-referrer"
          draggable={false}
        />
        <div
          className="absolute inset-0 select-none pointer-events-none"
          style={{
            background: bgGradient,
            WebkitMaskImage: `url("${imgUrl}")`,
            maskImage: `url("${imgUrl}")`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        />
      </div>
    );
  }

  // Fallback inline vector paths
  const strokeColor = color;
  const fillColor = color;

  switch (motifId) {
    case 'sea-cliff-hem':
      // 海水江崖纹 (Bottom hem waves + mountain peaks)
      return (
        <svg
          viewBox="0 0 350 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={filterStyle}
        >
          {/* Top border decorative line */}
          <path d="M0 6 L350 6" stroke={strokeColor} strokeWidth="2.5" strokeDasharray="6 3" />
          <path d="M0 12 L350 12" stroke={strokeColor} strokeWidth="1.5" />

          {/* Mountains/Cliff Peaks */}
          <path
            d="M50 80 L65 30 L80 80 M65 30 L65 80"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M160 85 L175 22 L190 85 M175 22 L175 85"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M270 80 L285 30 L300 80 M285 30 L285 80"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Rolling Water waves */}
          <path
            d="M0 80 Q 25 65 50 80 T 100 80 T 150 80 T 200 80 T 250 80 T 300 80 T 350 80"
            stroke={strokeColor}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 88 Q 25 73 50 88 T 100 88 T 150 88 T 200 88 T 250 88 T 300 88 T 350 88"
            stroke={strokeColor}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 96 Q 25 81 50 96 T 100 96 T 150 96 T 200 96 T 250 96 T 300 96 T 350 96"
            stroke={strokeColor}
            strokeWidth="2.5"
            fill="none"
          />

          {/* Water drops & sprays */}
          <circle cx="65" cy="24" r="2.5" fill={fillColor} />
          <circle cx="175" cy="16" r="3" fill={fillColor} />
          <circle cx="285" cy="24" r="2.5" fill={fillColor} />
          <circle cx="115" cy="55" r="2" fill={fillColor} opacity="0.8" />
          <circle cx="225" cy="55" r="2" fill={fillColor} opacity="0.8" />
        </svg>
      );

    case 'flying-crane':
      // 仙鹤穿云 (Spread wings crane with clouds)
      return (
        <svg
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={filterStyle}
        >
          {/* Wings */}
          <path
            d="M60 45 C 45 20, 20 15, 8 22 C 20 28, 30 38, 48 48 Z"
            fill={fillColor}
            opacity="0.85"
          />
          <path
            d="M60 45 C 75 20, 100 15, 112 22 C 100 28, 90 38, 72 48 Z"
            fill={fillColor}
            opacity="0.85"
          />
          {/* Wing Feathers lines */}
          <path
            d="M10 23 Q 32 30 50 46 M22 18 Q 40 28 54 44 M35 15 Q 48 26 58 43"
            stroke={strokeColor}
            strokeWidth="1.2"
          />
          <path
            d="M110 23 Q 88 30 70 46 M98 18 Q 80 28 66 44 M85 15 Q 72 26 62 43"
            stroke={strokeColor}
            strokeWidth="1.2"
          />
          {/* Body & Tail */}
          <path
            d="M56 42 Q 60 55 60 70 Q 56 85 52 92 C 58 88 62 88 68 92 Q 64 85 60 70 Q 60 55 64 42 Z"
            fill={fillColor}
          />
          {/* Neck & Head */}
          <path
            d="M60 42 C 59 32, 63 25, 61 16 C 58 12, 64 12, 63 15 C 65 24, 62 32, 60 42 Z"
            fill={fillColor}
          />
          {/* Beak */}
          <path d="M62 14 L72 13" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          {/* Crown spot */}
          <circle cx="61" cy="13" r="2" fill="#B23A48" />
          {/* Clouds beneath */}
          <path
            d="M30 82 C 22 82 18 86 20 90 C 22 93 28 93 32 91 C 36 93 45 93 46 88 C 47 84 40 82 36 82 C 34 78 28 78 24 82 Z"
            stroke={strokeColor}
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
      );

    case 'auspicious-cloud':
      // 如意祥云 (Flowing auspicious ruyi cloud spirals)
      return (
        <svg
          viewBox="0 0 160 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={filterStyle}
        >
          <path
            d="M30 65 C 20 65 12 58 15 48 C 18 36 32 35 38 42 C 42 30 60 25 72 35 C 80 25 102 24 112 36 C 122 28 140 32 144 45 C 148 58 138 68 125 67 C 122 75 110 82 98 78 C 90 85 70 85 62 76 C 50 82 35 78 30 65 Z"
            stroke={strokeColor}
            strokeWidth="2.5"
            fill={fillColor}
            fillOpacity="0.15"
          />
          {/* Inner spirals */}
          <path
            d="M26 52 C 25 45 32 40 38 45 C 44 50 40 60 30 58 C 22 56 22 42 32 36 C 42 30 52 38 52 48"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M72 40 C 70 32 80 28 86 34 C 92 40 88 50 78 48 C 68 46 68 32 80 26 C 92 20 104 30 104 42"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Floating tail */}
          <path
            d="M130 62 C 145 65 155 72 152 82 C 148 90 135 88 128 82"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'baoxiang-flower':
      // 盛世宝相花团 (Symmetrical Baoxiang Floral Medallion)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={filterStyle}
        >
          {/* Central Core */}
          <circle cx="50" cy="50" r="8" fill={fillColor} opacity="0.3" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="50" cy="50" r="3.5" fill={fillColor} />

          {/* 8 Petals radiating */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              <path
                d="M50 42 C 45 32, 42 22, 50 14 C 58 22, 55 32, 50 42 Z"
                fill={fillColor}
                fillOpacity={i % 2 === 0 ? '0.7' : '0.4'}
                stroke={strokeColor}
                strokeWidth="1.2"
              />
              <circle cx="50" cy="18" r="1.5" fill={fillColor} />
            </g>
          ))}

          {/* Outer ring of pearls */}
          <circle cx="50" cy="50" r="44" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'dragon-roundel':
      // 云龙戏珠团窠 (Dragon Medallion)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={filterStyle}
        >
          {/* Outer circular border */}
          <circle cx="50" cy="50" r="47" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="50" cy="50" r="43" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 2" />

          {/* Dragon Body Curves */}
          <path
            d="M35 30 C 25 45, 30 70, 50 75 C 72 80, 78 60, 68 45 C 60 32, 45 42, 48 55 C 50 62, 60 62, 62 55"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Dragon Head */}
          <path
            d="M35 30 C 38 24, 46 22, 44 18 C 40 18, 36 22, 33 24 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1"
          />
          {/* Horns & Beard */}
          <path d="M38 22 C 42 16, 48 14, 52 15" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M33 26 C 28 28, 25 35, 26 40" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />

          {/* Claws */}
          <path d="M32 50 L24 48 M32 50 L23 53 M32 50 L26 56" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M68 62 L75 66 M68 62 L74 71 M68 62 L78 63" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />

          {/* Flaming Pearl */}
          <circle cx="54" cy="40" r="5" fill="#D14935" stroke={strokeColor} strokeWidth="1.5" />
          <path d="M54 35 Q 58 30 54 26 M59 38 Q 65 37 68 41 M50 44 Q 45 48 43 53" stroke={strokeColor} strokeWidth="1.2" />
        </svg>
      );

    case 'flying-fish':
      // 飞鱼祥瑞 (Flying Fish / Feiyu Winged Beast)
      return (
        <svg
          viewBox="0 0 110 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={filterStyle}
        >
          {/* Body S-curve */}
          <path
            d="M25 45 C 35 25, 65 20, 80 35 C 95 50, 75 75, 55 78 C 38 80, 32 70, 38 60 C 44 50, 60 52, 60 62"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Feiyu Wings */}
          <path
            d="M50 30 C 58 12, 75 8, 88 12 C 78 18, 70 24, 62 33 Z"
            fill={fillColor}
            opacity="0.8"
            stroke={strokeColor}
            strokeWidth="1"
          />
          {/* Head & Fins */}
          <circle cx="23" cy="46" r="6" fill={fillColor} opacity="0.6" />
          <path d="M19 43 L12 40 M18 47 L10 49" stroke={strokeColor} strokeWidth="1.5" />
          {/* Fish Tail */}
          <path
            d="M38 60 C 28 65, 20 62, 14 55 C 20 65, 22 75, 16 85 C 26 78, 34 76, 38 68 Z"
            fill={fillColor}
            opacity="0.85"
            stroke={strokeColor}
            strokeWidth="1"
          />
        </svg>
      );

    case 'lotus-scroll':
      // 富贵缠枝莲 (Flowering lotus with flowing scroll vines)
      return (
        <svg
          viewBox="0 0 220 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={filterStyle}
        >
          {/* Winding Vine */}
          <path
            d="M0 50 C 40 20, 60 80, 110 50 C 160 20, 180 80, 220 50"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Center Lotus Flower */}
          <path
            d="M110 32 C 102 20, 96 15, 102 8 C 108 15, 110 24, 110 32 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.2"
          />
          <path
            d="M110 32 C 118 20, 124 15, 118 8 C 112 15, 110 24, 110 32 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.2"
          />
          <path
            d="M110 32 C 110 18, 110 10, 110 4 C 110 10, 110 18, 110 32 Z"
            stroke={strokeColor}
            strokeWidth="2"
          />
          <circle cx="110" cy="35" r="4" fill={fillColor} />
          {/* Leaves and buds */}
          <path
            d="M55 45 C 50 35 40 38 45 48 C 50 58 60 55 55 45 Z"
            fill={fillColor}
            opacity="0.6"
            stroke={strokeColor}
            strokeWidth="1"
          />
          <path
            d="M165 55 C 160 65 150 62 155 52 C 160 42 170 45 165 55 Z"
            fill={fillColor}
            opacity="0.6"
            stroke={strokeColor}
            strokeWidth="1"
          />
        </svg>
      );

    case 'ruyi-crest':
    default:
      // 吉庆如意纹 (Auspicious Ruyi Knot / Medallion)
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={filterStyle}
        >
          {/* 4 Ruyi heads connected */}
          {[0, 90, 180, 270].map((rot) => (
            <g key={rot} transform={`rotate(${rot} 50 50)`}>
              <path
                d="M50 30 C 44 20, 36 22, 40 14 C 44 6, 56 6, 60 14 C 64 22, 56 20, 50 30 Z"
                fill={fillColor}
                fillOpacity="0.6"
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path d="M50 30 L50 42" stroke={strokeColor} strokeWidth="1.8" />
            </g>
          ))}
          <circle cx="50" cy="50" r="6" fill={fillColor} />
          <circle cx="50" cy="50" r="3" fill="#FAF7F0" />
        </svg>
      );
  }
};
