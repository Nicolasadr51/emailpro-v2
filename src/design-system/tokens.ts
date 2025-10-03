// Design tokens basés sur l'analyse UX Mailchimp par Claude 4.5 Sonnet

export const designTokens = {
  colors: {
    // Codage couleur par type de bloc (inspiré Mailchimp)
    blocks: {
      image: '#10B981',      // Vert
      heading: '#EF4444',    // Rouge
      text: '#3B82F6',       // Bleu
      button: '#F59E0B',     // Orange
      divider: '#8B5CF6',    // Violet
      social: '#EC4899',     // Rose
      spacer: '#6B7280',     // Gris
    },
    // États interactifs
    states: {
      hover: '#F3F4F6',
      active: '#E5E7EB',
      dropzone: '#DBEAFE',
      dropzoneActive: '#BFDBFE',
      dragging: '#FEF3C7',
    },
    // Sémantique
    semantic: {
      background: '#FFFFFF',
      border: '#E5E7EB',
      borderHover: '#D1D5DB',
      text: {
        primary: '#111827',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      }
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  
  typography: {
    sizes: {
      xs: '11px',
      sm: '13px',
      base: '14px',
      lg: '16px',
      xl: '18px',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    drag: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
  },
  
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  }
} as const;

export type DesignTokens = typeof designTokens;
