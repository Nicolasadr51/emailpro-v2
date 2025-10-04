// Types pour l'éditeur d'emails avancé
// Architecture définie par Claude 4.5 Sonnet

export type BlockType = 'text' | 'heading' | 'image' | 'button' | 'divider' | 'social' | 'spacer' | 'layout' | 'template';

export interface EmailBlock {
  id: string;
  type: BlockType;
  content: any; // Peut être string ou objet selon le type d'élément
  styles?: BlockStyles;
  style?: any; // Pour compatibilité avec les nouveaux composants
  position: Position;
  size?: { width: number; height: number };
  visible?: boolean;
  locked?: boolean;
  customId?: string;
  cssClasses?: string;
  layout?: any;
  spacing?: any;
}

export interface BlockStyles {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  textAlign?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
  maxWidth?: string;
  lineHeight?: string;
}

export interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  elements: EmailBlock[];
  layout: TemplateLayout;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  category?: string;
}

export interface TemplateLayout {
  width: number;
  height: number;
  backgroundColor: string;
  padding?: string;
  margin?: string;
}

export interface DragItem {
  type: string;
  elementType?: BlockType;
  element?: EmailBlock;
}

export interface EditorState {
  elements: EmailBlock[];
  selectedBlock: EmailBlock | null;
  template: EmailTemplate | null;
  isLoading: boolean;
  isDragging: boolean;
  zoom: number;
  history: EmailBlock[][];
  historyIndex: number;
}

export interface EditorActions {
  addElement: (element: Omit<EmailBlock, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<EmailBlock>) => void;
  deleteElement: (id: string) => void;
  selectBlock: (id: string | null) => void;
  moveElement: (id: string, position: Position) => void;
  duplicateElement: (id: string) => void;
  setTemplate: (template: EmailTemplate) => void;
  setZoom: (zoom: number) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export type EditorStore = EditorState & EditorActions;

// Types pour les éléments spécifiques
export interface TextBlockContent {
  text: string;
  isRichText: boolean;
}

export interface ImageBlockContent {
  src: string;
  alt: string;
  link?: string;
}



export interface DividerBlockContent {
  thickness: number;
  style: 'solid' | 'dashed' | 'dotted';
}

// Types pour les templates prédéfinis
export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: EmailTemplate[];
}

export interface TemplatePreview {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  isPopular: boolean;
}
