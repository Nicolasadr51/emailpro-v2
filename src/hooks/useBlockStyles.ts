import { useMemo } from 'react';
import { BlockStyles } from '../types/emailEditor';

/**
 * Hook pour convertir BlockStyles en CSS Properties compatibles React
 * Recommandation Claude 4.5 pour résoudre définitivement les erreurs de styles
 */
export const useBlockStyles = (blockStyles?: BlockStyles): React.CSSProperties => {
  return useMemo(() => {
    if (!blockStyles) return {};

    const cssStyles: React.CSSProperties = {};

    // Conversion border objet → border + borderRadius CSS
    if (blockStyles.border && typeof blockStyles.border === 'object') {
      cssStyles.border = `${blockStyles.border.width}px ${blockStyles.border.style} ${blockStyles.border.color}`;
      cssStyles.borderRadius = `${blockStyles.border.radius}px`;
    } else if (typeof blockStyles.border === 'string') {
      cssStyles.border = blockStyles.border;
    }

    // Conversion padding objet → padding CSS string
    if (blockStyles.padding && typeof blockStyles.padding === 'object') {
      cssStyles.padding = `${blockStyles.padding.top}px ${blockStyles.padding.right}px ${blockStyles.padding.bottom}px ${blockStyles.padding.left}px`;
    } else if (typeof blockStyles.padding === 'string') {
      cssStyles.padding = blockStyles.padding;
    }

    // Conversion margin objet → margin CSS string
    if (blockStyles.margin && typeof blockStyles.margin === 'object') {
      cssStyles.margin = `${blockStyles.margin.top}px ${blockStyles.margin.right}px ${blockStyles.margin.bottom}px ${blockStyles.margin.left}px`;
    } else if (typeof blockStyles.margin === 'string') {
      cssStyles.margin = blockStyles.margin;
    }

    // Propriétés CSS directes (déjà compatibles)
    if (blockStyles.backgroundColor) cssStyles.backgroundColor = blockStyles.backgroundColor;
    if (blockStyles.color) cssStyles.color = blockStyles.color;
    if (blockStyles.fontSize) cssStyles.fontSize = typeof blockStyles.fontSize === 'number' ? `${blockStyles.fontSize}px` : blockStyles.fontSize;
    if (blockStyles.fontWeight) cssStyles.fontWeight = blockStyles.fontWeight;
    if (blockStyles.fontFamily) cssStyles.fontFamily = blockStyles.fontFamily;
    if (blockStyles.lineHeight) cssStyles.lineHeight = blockStyles.lineHeight;
    if (blockStyles.textAlign) cssStyles.textAlign = blockStyles.textAlign;
    if (blockStyles.textDecoration) cssStyles.textDecoration = blockStyles.textDecoration;
    if (blockStyles.borderRadius) cssStyles.borderRadius = blockStyles.borderRadius;
    if (blockStyles.opacity !== undefined) cssStyles.opacity = blockStyles.opacity;
    if (blockStyles.zIndex !== undefined) cssStyles.zIndex = blockStyles.zIndex;
    if (blockStyles.display) cssStyles.display = blockStyles.display;
    if (blockStyles.position) cssStyles.position = blockStyles.position;
    if (blockStyles.top !== undefined) cssStyles.top = blockStyles.top;
    if (blockStyles.right !== undefined) cssStyles.right = blockStyles.right;
    if (blockStyles.bottom !== undefined) cssStyles.bottom = blockStyles.bottom;
    if (blockStyles.left !== undefined) cssStyles.left = blockStyles.left;
    if (blockStyles.width) cssStyles.width = blockStyles.width;
    if (blockStyles.height) cssStyles.height = blockStyles.height;
    if (blockStyles.minWidth) cssStyles.minWidth = blockStyles.minWidth;
    if (blockStyles.minHeight) cssStyles.minHeight = blockStyles.minHeight;
    if (blockStyles.maxWidth) cssStyles.maxWidth = blockStyles.maxWidth;
    if (blockStyles.maxHeight) cssStyles.maxHeight = blockStyles.maxHeight;

    return cssStyles;
  }, [blockStyles]);
};

/**
 * Version alternative qui combine les styles de bloc avec des styles additionnels
 */
export const useBlockStylesWithOverrides = (
  blockStyles?: BlockStyles, 
  overrides?: React.CSSProperties
): React.CSSProperties => {
  const baseStyles = useBlockStyles(blockStyles);
  
  return useMemo(() => ({
    ...baseStyles,
    ...overrides
  }), [baseStyles, overrides]);
};
