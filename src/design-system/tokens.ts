/**
 * Design tokens - Système de design centralisé
 * Basé sur l'analyse UX Mailchimp
 * @version 2.0.0
 */

export const BLOCK_TYPES = {
  IMAGE: 'IMAGE',
  HEADING: 'HEADING',
  TEXT: 'TEXT',
  BUTTON: 'BUTTON',
  DIVIDER: 'DIVIDER',
  SOCIAL: 'SOCIAL',
  SPACER: 'SPACER',
  LAYOUT: 'LAYOUT',
  TEMPLATE: 'TEMPLATE',
} as const;

export type BlockType = typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES];

export const BLOCK_COLOR_MAP = {
  [BLOCK_TYPES.IMAGE]: '#10B981',
  [BLOCK_TYPES.HEADING]: '#EF4444',
  [BLOCK_TYPES.TEXT]: '#3B82F6',
  [BLOCK_TYPES.BUTTON]: '#F59E0B',
  [BLOCK_TYPES.DIVIDER]: '#8B5CF6',
  [BLOCK_TYPES.SOCIAL]: '#EC4899',
  [BLOCK_TYPES.SPACER]: '#6B7280',
} as const;

export type BlockColorKey = keyof typeof BLOCK_COLOR_MAP;

// Tokens avec types stricts
export const designTokens = {
  colors: {
    blocks: BLOCK_COLOR_MAP,
    states: {
      hover: '#F3F4F6',
      active: '#E5E7EB',
      dropzone: '#DBEAFE',
      dropzoneActive: '#BFDBFE',
      dragging: '#FEF3C7',
      focus: '#3B82F6',
    },
    semantic: {
      background: '#FFFFFF',
      border: '#E5E7EB',
      borderHover: '#D1D5DB',
      text: {
        primary: '#111827',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  
  typography: {
    sizes: {
      xs: 11,
      sm: 13,
      base: 14,
      lg: 16,
      xl: 18,
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    drag: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
  },
  
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
  },
  
  transitions: {
    fast: 150,
    base: 200,
    slow: 300,
  },
  
  zIndex: {
    base: 1,
    dropdown: 1000,
    modal: 2000,
    tooltip: 3000,
  },
} as const;

// Types dérivés
export type DesignTokens = typeof designTokens;
export type ColorKey = keyof typeof designTokens.colors.blocks;
export type SpacingKey = keyof typeof designTokens.spacing;
export type ShadowKey = keyof typeof designTokens.shadows;

// Helpers typés
export const px = (value: number): string => `${value}px`;
export const ms = (value: number): string => `${value}ms`;

export const getSpacing = (key: SpacingKey): string => 
  px(designTokens.spacing[key]);

export const getTransition = (
  property: string = 'all',
  duration: keyof typeof designTokens.transitions = 'base'
): string => 
  `${property} ${ms(designTokens.transitions[duration])} ease-in-out`;
