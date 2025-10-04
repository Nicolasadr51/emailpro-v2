// Types pour l'éditeur d'email avec corrections Claude 4.x

export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Border {
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  radius: number;
}

// Interface pour la position des éléments
export interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
  order: number; // Pour l'ordonnancement des blocs dans le template
}

export type BlockType =
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'columns'
  | 'social'
  | 'footer'
  | 'html';

// Styles de base pour tous les blocs
export interface BlockStyles {
  // Couleurs
  backgroundColor?: string;
  color?: string;
  
  // Espacement
  padding?: Spacing;
  margin?: Spacing;
  
  // Bordures
  border?: Border;
  
  // Typographie
  fontSize?: string;
  fontWeight?: string | number;
  fontFamily?: string;
  lineHeight?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textDecoration?: string;
  
  // Dimensions
  width?: string;
  height?: string;
  
  // Autres propriétés CSS communes
  borderRadius?: string;
  opacity?: number;
  zIndex?: number;
}

// Valeurs par défaut pour BlockStyles (recommandation Claude 4.5)
export const DEFAULT_BLOCK_STYLES: BlockStyles = {
  backgroundColor: '#ffffff',
  color: '#000000',
  fontSize: '16px',
  fontWeight: '400',
  fontFamily: 'Arial, sans-serif',
  lineHeight: '1.4',
  textAlign: 'left',
  borderRadius: '0px',
  opacity: 1,
  zIndex: 1,
};

// Fonction utilitaire pour appliquer les styles par défaut
export const applyDefaultStyles = (styles?: Partial<BlockStyles>): BlockStyles => {
  return { ...DEFAULT_BLOCK_STYLES, ...styles };
};

// Contenu spécifique pour chaque type de bloc
export interface TextBlockContent {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color: string;
  lineHeight: number;
  letterSpacing: number;
}

export interface HeadingBlockContent {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color: string;
  lineHeight: number;
  letterSpacing: number;
}

export interface ImageBlockContent {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  link?: string;
  linkTarget?: '_blank' | '_self';
}

// Type pour le comportement des liens (recommandation Claude 4.5)
export type ButtonTarget = '_self' | '_blank';

export interface ButtonBlockContent {
  text: string;
  link: string;
  linkTarget: '_blank' | '_self'; // Maintenu pour compatibilité
  target: ButtonTarget; // Ajouté selon l'usage dans le composant
  backgroundColor: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  paddingVertical: number;
  paddingHorizontal: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
}

export interface DividerBlockContent {
  height: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
  thickness: number;
}

export interface SpacerBlockContent {
  height: number;
}

export interface ColumnsBlockContent {
  columns: Array<{
    id: string;
    width: number; // Pourcentage
    blocks: EmailBlock[];

  }>;
}

export interface SocialBlockContent {
  platforms: Array<{
    name: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
    url: string;
    icon: string;
  }>;
  iconSize: number;
  spacing: number;
}

export interface FooterBlockContent {
  companyName: string;
  address: string;
  unsubscribeText: string;
  unsubscribeLink: string;
  socialLinks?: SocialBlockContent['platforms'];
}

export interface HtmlBlockContent {
  html: string;
}

// Interface générique de base pour tous les blocs (correction Claude 4.x)
export interface BaseEmailBlock<T extends BlockType, C> {
  id: string;
  type: T;
  position: Position;
  styles: BlockStyles;
  size?: { width: number; height: number };
  locked?: boolean;
  hidden?: boolean;
  visible?: boolean;
  content: C;
}

// Types spécifiques pour chaque bloc (correction Claude 4.x)
export type TextBlock = BaseEmailBlock<'text', TextBlockContent>;
export type HeadingBlock = BaseEmailBlock<'heading', HeadingBlockContent>;
export type ImageBlock = BaseEmailBlock<'image', ImageBlockContent>;
export type ButtonBlock = BaseEmailBlock<'button', ButtonBlockContent>;
export type DividerBlock = BaseEmailBlock<'divider', DividerBlockContent>;
export type SpacerBlock = BaseEmailBlock<'spacer', SpacerBlockContent>;
export type ColumnsBlock = BaseEmailBlock<'columns', ColumnsBlockContent>;
export type SocialBlock = BaseEmailBlock<'social', SocialBlockContent>;
export type FooterBlock = BaseEmailBlock<'footer', FooterBlockContent>;
export type HtmlBlock = BaseEmailBlock<'html', HtmlBlockContent>;

// Union type pour tous les blocs (discriminated union)
export type EmailBlock =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | ButtonBlock
  | DividerBlock
  | SpacerBlock
  | ColumnsBlock
  | SocialBlock
  | FooterBlock
  | HtmlBlock;

// Helper type pour extraire le type de contenu en fonction du type de bloc
export type BlockContent<T extends BlockType> = Extract<EmailBlock, { type: T }>['content'];

// Type helper pour créer un nouveau bloc
export type CreateBlock<T extends BlockType> = Omit<Extract<EmailBlock, { type: T }>, 'id' | 'position'>;

// Type guard pour vérifier le type d'un bloc
export const isBlockType = <T extends BlockType>(
  block: EmailBlock,
  type: T
): block is Extract<EmailBlock, { type: T }> => {
  return block.type === type;
};

// Styles globaux du template
export interface GlobalStyles {
  backgroundColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  color: string;
  containerWidth: number;
  containerPadding: number;
}

// Layout du template
export interface Layout {
  width: number;
  height: number;
  padding?: number;
  backgroundColor: string; // Rendu obligatoire pour la compatibilité
  maxWidth?: number;
  alignment?: 'left' | 'center' | 'right';
}

// Constantes par défaut pour Layout
export const DEFAULT_LAYOUT: Layout = {
  width: 600,
  height: 800,
  padding: 20,
  backgroundColor: '#ffffff',
  maxWidth: 800,
  alignment: 'center',
};

// Utilitaire de validation Layout
export const validateLayout = (layout: Partial<Layout>): Layout => {
  return {
    ...DEFAULT_LAYOUT,
    ...layout,
  };
};

// Template d'email complet
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  layout: Layout;
  blocks: EmailBlock[];
    globalStyles: GlobalStyles;
  createdAt: string;
  updatedAt: string;
  version: string;
}

// État de l'éditeur
export interface EmailEditorState {
  template: EmailTemplate;
  selectedBlockId: string | null;
  isEditing: boolean;
  editingBlockId: string | null;
  previewMode: 'desktop' | 'mobile';
  isDragging: boolean;
  draggedBlockType: BlockType | null;
  history: EmailTemplate[];
  historyIndex: number;
  isLoading: boolean;
  error: string | null;
}

// Actions de l'éditeur
export interface EmailEditorActions {
  // Gestion du template
  loadTemplate: (template: EmailTemplate) => void;
  saveTemplate: () => Promise<void>;
  resetTemplate: () => void;
  
  // Gestion des blocs
  addBlock: (blockType: BlockType, position?: number) => void;
  updateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  moveBlock: (blockId: string, newPosition: number) => void;
  
  // Sélection et édition
  selectBlock: (blockId: string | null) => void;
  startEditing: (blockId: string) => void;
  stopEditing: () => void;
  
  // Styles globaux
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  
  // Prévisualisation
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  
  // Drag & Drop
  startDragging: (blockType: BlockType) => void;
  stopDragging: () => void;
  
  // Historique
  undo: () => void;
  redo: () => void;
  
  // États
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Contexte de l'éditeur
export interface EmailEditorContextType {
  state: EmailEditorState;
  actions: EmailEditorActions;
  selectedBlock: EmailBlock | null;
}

// Props pour les composants de blocs
export interface BlockComponentProps<T extends EmailBlock = EmailBlock> {
  block: T;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (e: React.MouseEvent<Element, MouseEvent>) => void;
  onUpdate: (updates: Partial<T>) => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

// Configuration de l'éditeur
export interface EmailEditorConfig {
  maxBlocks?: number;
  allowedBlockTypes?: BlockType[];
  autoSave?: boolean;
  autoSaveInterval?: number;
  enableHistory?: boolean;
  maxHistorySize?: number;
  enablePreview?: boolean;
  enableExport?: boolean;
}

// Données d'export
export interface EmailExportData {
  html: string;
  text: string;
  subject: string;
  preheader?: string;
  metadata: {
    templateId: string;
    templateName: string;
    exportedAt: string;
    version: string;
  };
}

// Actions du reducer
export type EmailEditorAction =
  | { type: 'LOAD_TEMPLATE'; payload: EmailTemplate }
  | { type: 'ADD_BLOCK'; payload: { blockType: BlockType; position?: number } }
  | { type: 'UPDATE_BLOCK'; payload: { blockId: string; updates: Partial<EmailBlock> } }
  | { type: 'DELETE_BLOCK'; payload: { blockId: string } }
  | { type: 'DUPLICATE_BLOCK'; payload: { blockId: string } }
  | { type: 'MOVE_BLOCK'; payload: { blockId: string; newPosition: number } }
  | { type: 'SELECT_BLOCK'; payload: { blockId: string | null } }
  | { type: 'START_EDITING'; payload: { blockId: string } }
  | { type: 'STOP_EDITING' }
  | { type: 'UPDATE_GLOBAL_STYLES'; payload: Partial<GlobalStyles> }
  | { type: 'SET_PREVIEW_MODE'; payload: { mode: 'desktop' | 'mobile' } }
  | { type: 'START_DRAGGING'; payload: { blockType: BlockType } }
  | { type: 'STOP_DRAGGING' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'RESET_TEMPLATE' };

// Factory pour créer des blocs par défaut (correction Claude 4.x)
export const createDefaultBlock = (type: BlockType): EmailBlock => {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position: {
      x: 0,
      y: 0,
      width: 300,
      height: 100,
      order: 0, // Sera défini lors de l'ajout au template
    },
    styles: {
      backgroundColor: 'transparent',
      padding: { top: 10, right: 10, bottom: 10, left: 10 },
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      border: { width: 0, style: 'solid', color: 'transparent', radius: 0 },
      textAlign: 'left' as const,
    },
  };

  switch (type) {
    case 'text':
      return {
        ...baseBlock,
        type: 'text',
        content: {
          text: 'Votre texte ici...',
          fontSize: 16,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'normal',
          color: '#333333',
          lineHeight: 1.5,
          letterSpacing: 0,
        },
      } as TextBlock;

    case 'heading':
      return {
        ...baseBlock,
        type: 'heading',
        content: {
          text: 'Votre titre ici',
          level: 1,
          fontSize: 24,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#333333',
          lineHeight: 1.2,
          letterSpacing: 0,
        },
      } as HeadingBlock;

    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        content: {
          src: 'https://via.placeholder.com/600x300',
          alt: 'Image',
          width: 600,
          height: 300,
          linkTarget: '_self',
        },
      } as ImageBlock;

    case 'button':
      return {
        ...baseBlock,
        type: 'button',
        content: {
          text: 'Cliquez ici',
          link: '#',
          linkTarget: '_self', // Maintenu pour compatibilité
          target: '_self', // Ajouté selon l'usage dans le composant
          backgroundColor: '#007bff',
          color: '#ffffff',
          fontSize: 16,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 4,
          borderWidth: 0,
          borderColor: 'transparent',
        },
      } as ButtonBlock;

    case 'divider':
      return {
        ...baseBlock,
        type: 'divider',
        content: {
          height: 1,
          color: '#cccccc',
          style: 'solid',
          thickness: 1,
        },
      } as DividerBlock;

    case 'spacer':
      return {
        ...baseBlock,
        type: 'spacer',
        content: {
          height: 20,
        },
      } as SpacerBlock;

    case 'columns':
      return {
        ...baseBlock,
        type: 'columns',
        content: {
          columns: [
            { id: `column-${Date.now()}-1`, width: 50, blocks: [] },
            { id: `column-${Date.now()}-2`, width: 50, blocks: [] },
          ],
        },
      } as ColumnsBlock;

    case 'social':
      return {
        ...baseBlock,
        type: 'social',
        content: {
          platforms: [
            { name: 'facebook', url: 'https://facebook.com', icon: 'facebook' },
            { name: 'twitter', url: 'https://twitter.com', icon: 'twitter' },
            { name: 'instagram', url: 'https://instagram.com', icon: 'instagram' },
          ],
          iconSize: 24,
          spacing: 10,
        },
      } as SocialBlock;

    case 'footer':
      return {
        ...baseBlock,
        type: 'footer',
        content: {
          companyName: 'Votre Entreprise',
          address: '123 Rue de l\'Exemple, 75000 Paris',
          unsubscribeText: 'Se désabonner',
          unsubscribeLink: '#',
        },
      } as FooterBlock;

    case 'html':
      return {
        ...baseBlock,
        type: 'html',
        content: {
          html: '<!-- Votre code HTML personnalisé ici -->',
        },
      } as HtmlBlock;

    default:
      // Fallback pour les types inconnus ou non implémentés
      return {
        ...baseBlock,
        type: type,
        content: {},
      } as EmailBlock;
  }
};



export const createDefaultTemplate = (): EmailTemplate => ({
  id: `template-${Date.now()}`,
  name: 'Nouveau Template',
  subject: 'Sujet de votre email',
  preheader: 'Pré-en-tête de votre email',
  layout: DEFAULT_LAYOUT,
  blocks: [
    createDefaultBlock('text'),
    createDefaultBlock('image'),
    createDefaultBlock('button'),
  ],
  globalStyles: {
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif',
    fontSize: 16,
    lineHeight: 1.5,
    color: '#333333',
    containerWidth: 600,
    containerPadding: 20,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: '1.0.0',
});

