// Types pour l'éditeur d'emails avancé
// Architecture définie par Claude 4.5 Sonnet

export type ElementType = 'text' | 'heading' | 'image' | 'button' | 'divider' | 'social' | 'spacer' | 'layout' | 'template';

export interface EditorElement {
  id: string;
  type: ElementType;
  content: any; // Peut être string ou objet selon le type d'élément
  styles?: ElementStyles;
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

export interface ElementStyles {
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
  elements: EditorElement[];
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
  elementType?: ElementType;
  element?: EditorElement;
}

export interface EditorState {
  elements: EditorElement[];
  selectedElement: EditorElement | null;
  template: EmailTemplate | null;
  isLoading: boolean;
  isDragging: boolean;
  zoom: number;
  history: EditorElement[][];
  historyIndex: number;
}

export interface EditorActions {
  addElement: (element: Omit<EditorElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
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
export interface TextElementContent {
  text: string;
  isRichText: boolean;
}

export interface ImageElementContent {
  src: string;
  alt: string;
  link?: string;
}

export interface ButtonElementContent {
  text: string;
  link: string;
  target?: '_blank' | '_self';
}

export interface DividerElementContent {
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
