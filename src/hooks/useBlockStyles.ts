import { useMemo } from 'react';
import { BlockStyles, GlobalStyles, Spacing, Border } from '../types/emailEditor';

/**
 * Utilitaire pour convertir un objet de spacing en chaîne CSS
 */
const convertSpacingToCSS = (spacing?: Spacing): string => {
  if (!spacing) return '0px';
  return `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`;
};

/**
 * Utilitaire pour convertir un objet border en chaîne CSS
 */
const convertBorderToCSS = (border?: Border): { border?: string; borderRadius?: string } => {
  if (!border) return {};
  
  return {
    border: `${border.width}px ${border.style} ${border.color}`,
    borderRadius: border.radius ? `${border.radius}px` : undefined
  };
};

/**
 * Hook pour convertir BlockStyles en CSS Properties compatibles React
 * Gère la conversion des objets (padding, margin, border) en chaînes CSS
 */
export const useBlockStyles = (blockStyles?: BlockStyles): React.CSSProperties => {
  return useMemo(() => {
    if (!blockStyles) return {};

    const cssStyles: React.CSSProperties = {};

    // Couleurs
    if (blockStyles.backgroundColor) {
      cssStyles.backgroundColor = blockStyles.backgroundColor;
    }
    if (blockStyles.color) {
      cssStyles.color = blockStyles.color;
    }

    // Espacement - conversion des objets en chaînes CSS
    if (blockStyles.padding) {
      cssStyles.padding = convertSpacingToCSS(blockStyles.padding);
    }
    if (blockStyles.margin) {
      cssStyles.margin = convertSpacingToCSS(blockStyles.margin);
    }

    // Bordures - conversion de l'objet en chaînes CSS
    if (blockStyles.border) {
      const borderStyles = convertBorderToCSS(blockStyles.border);
      if (borderStyles.border) {
        cssStyles.border = borderStyles.border;
      }
      if (borderStyles.borderRadius) {
        cssStyles.borderRadius = borderStyles.borderRadius;
      }
    }
    
    // Support de borderRadius en tant que propriété séparée
    if (blockStyles.borderRadius && !blockStyles.border) {
      cssStyles.borderRadius = blockStyles.borderRadius;
    }

    // Typographie
    if (blockStyles.fontSize) {
      cssStyles.fontSize = blockStyles.fontSize;
    }
    if (blockStyles.fontWeight) {
      cssStyles.fontWeight = blockStyles.fontWeight;
    }
    if (blockStyles.fontFamily) {
      cssStyles.fontFamily = blockStyles.fontFamily;
    }
    if (blockStyles.lineHeight) {
      cssStyles.lineHeight = blockStyles.lineHeight;
    }
    if (blockStyles.textAlign) {
      cssStyles.textAlign = blockStyles.textAlign;
    }
    if (blockStyles.textDecoration) {
      cssStyles.textDecoration = blockStyles.textDecoration;
    }

    // Dimensions
    if (blockStyles.width) {
      cssStyles.width = blockStyles.width;
    }
    if (blockStyles.height) {
      cssStyles.height = blockStyles.height;
    }

    // Autres propriétés
    if (blockStyles.opacity !== undefined) {
      cssStyles.opacity = blockStyles.opacity;
    }
    if (blockStyles.zIndex !== undefined) {
      cssStyles.zIndex = blockStyles.zIndex;
    }

    return cssStyles;
  }, [blockStyles]);
};

/**
 * Version alternative qui combine les styles de bloc avec des styles globaux
 * Compatible avec la structure GlobalStyles du projet
 */
export const useBlockStylesWithGlobalStyles = (
  blockStyles?: BlockStyles, 
  globalStyles?: GlobalStyles
): React.CSSProperties => {
  const baseStyles = useBlockStyles(blockStyles);
  
  return useMemo(() => {
    const combinedStyles = { ...baseStyles };
    
    // Appliquer les styles globaux comme fallback
    if (globalStyles) {
      if (!combinedStyles.fontFamily) {
        combinedStyles.fontFamily = globalStyles.fontFamily;
      }
      if (!combinedStyles.fontSize) {
        combinedStyles.fontSize = `${globalStyles.fontSize}px`;
      }
      if (!combinedStyles.lineHeight) {
        combinedStyles.lineHeight = globalStyles.lineHeight;
      }
      if (!combinedStyles.color) {
        combinedStyles.color = globalStyles.color;
      }
    }
    
    return combinedStyles;
  }, [baseStyles, globalStyles]);
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

/**
 * Utilitaire pour valider et nettoyer les objets de style
 * Garantit que tous les objets complexes sont convertis en chaînes CSS
 * (Moins pertinent avec la nouvelle structure, mais peut servir pour d'autres validations)
 */
export const sanitizeBlockStyles = (styles?: BlockStyles): Partial<BlockStyles> => {
  if (!styles) return {};
  
  const sanitized: Partial<BlockStyles> = { ...styles };
  
  // Aucune conversion d'objet n'est nécessaire ici avec la nouvelle structure
  // Les propriétés sont déjà des chaînes ou undefined
  
  return sanitized;
};

/**
 * Hook utilitaire pour créer des styles de conteneur sécurisés
 * Recommandé pour tous les composants de blocs
 */
export const useSafeContainerStyle = (
  blockStyles?: BlockStyles,
  additionalStyles?: React.CSSProperties
): React.CSSProperties => {
  const sanitizedStyles = useMemo(() => sanitizeBlockStyles(blockStyles), [blockStyles]);
  const baseStyles = useBlockStyles(sanitizedStyles);
  
  return useMemo(() => ({
    ...baseStyles,
    ...additionalStyles
  }), [baseStyles, additionalStyles]);
};
