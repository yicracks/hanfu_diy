import React from 'react';

/**
 * Returns inline CSS styles or SVG patterns for fabric materials
 */
export function getFabricStyle(materialId: string, baseColor: string): React.CSSProperties {
  switch (materialId) {
    case 'woven-gold':
      // 织金缎: subtle diagonal gold metallic threads across base color
      return {
        backgroundColor: baseColor,
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(218, 178, 77, 0.18) 0px, rgba(218, 178, 77, 0.18) 1.5px, transparent 1.5px, transparent 6px),
          repeating-linear-gradient(-45deg, rgba(255, 235, 160, 0.12) 0px, rgba(255, 235, 160, 0.12) 1px, transparent 1px, transparent 6px),
          radial-gradient(ellipse at 50% 30%, rgba(255, 240, 180, 0.15) 0%, transparent 70%)
        `,
        backgroundBlendMode: 'screen, overlay, normal',
      };

    case 'jacquard-damask':
      // 缠枝暗花提花: subtle tone-on-tone relief brocade pattern
      return {
        backgroundColor: baseColor,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 15%, transparent 16%),
          radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.12) 10%, transparent 11%),
          radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.12) 12%, transparent 13%),
          repeating-linear-gradient(60deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 3px, transparent 3px, transparent 9px)
        `,
      };

    case 'heavy-silk-satin':
      // 重磅素绉缎: rich fluid diagonal silk sheen
      return {
        backgroundColor: baseColor,
        backgroundImage: `
          linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, transparent 40%, rgba(0, 0, 0, 0.15) 85%),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%, rgba(0, 0, 0, 0.05) 100%)
        `,
      };

    case 'cloud-gauze':
      // 轻透如意云纱: delicate sheer micro-grid
      return {
        backgroundColor: baseColor,
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.18) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.18) 1px, transparent 1px)
        `,
        backgroundSize: '8px 8px',
      };

    case 'linen-cotton':
      // 粗纺棉麻: organic linen slub crosshatch
      return {
        backgroundColor: baseColor,
        backgroundImage: `
          repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.08) 0px, rgba(0, 0, 0, 0.08) 1px, transparent 1px, transparent 5px),
          repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0px, rgba(255, 255, 255, 0.08) 1px, transparent 1px, transparent 4px)
        `,
      };

    case 'plain-crepe':
    default:
      // 素罗双绉: clean matte weave with very faint grain
      return {
        backgroundColor: baseColor,
        backgroundImage: `
          radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 0)
        `,
        backgroundSize: '4px 4px',
      };
  }
}
