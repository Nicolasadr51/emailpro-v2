import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { 
  EmailEditorState, 
  EmailEditorAction, 
  EmailEditorContextType,
  EmailTemplate,
  BlockType,
  EmailBlock,
  GlobalStyles,
  createDefaultTemplate,
  createDefaultBlock
} from '../types/emailEditor';

// État initial de l'éditeur
const initialState: EmailEditorState = {
  template: createDefaultTemplate(),
  selectedBlockId: null,
  isEditing: false,
  editingBlockId: null,
  previewMode: 'desktop',
  isDragging: false,
  draggedBlockType: null,
  history: [],
  historyIndex: -1,
  isLoading: false,
  error: null,
};

// Reducer pour gérer les actions de l'éditeur
const emailEditorReducer = (state: EmailEditorState, action: EmailEditorAction): EmailEditorState => {
  switch (action.type) {
    case 'LOAD_TEMPLATE':
      return {
        ...state,
        template: action.payload,
        selectedBlockId: null,
        isEditing: false,
        editingBlockId: null,
        history: [action.payload],
        historyIndex: 0,
      };

    case 'ADD_BLOCK': {
      const newBlock = createDefaultBlock(action.payload.blockType);
      const position = action.payload.position ?? state.template.blocks.length;
      
      // Ajuster les positions des blocs existants
      const updatedBlocks = state.template.blocks.map(block => 
        block.position >= position 
          ? { ...block, position: block.position + 1 }
          : block
      );
      
      newBlock.position = position;
      
      const newTemplate: EmailTemplate = {
        ...state.template,
        blocks: [...updatedBlocks as EmailBlock[], newBlock].sort((a, b) => a.position - b.position),
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        template: newTemplate,
        selectedBlockId: newBlock.id,
        history: [...state.history.slice(0, state.historyIndex + 1), newTemplate],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'UPDATE_BLOCK': {
      const updatedBlocks = state.template.blocks.map(block =>
        block.id === action.payload.blockId
          ? { ...block, ...action.payload.updates }
          : block
      );

      const newTemplate: EmailTemplate = {
        ...state.template,
        blocks: updatedBlocks as EmailBlock[] as EmailBlock[],
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        template: newTemplate,
        history: [...state.history.slice(0, state.historyIndex + 1), newTemplate],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'DELETE_BLOCK': {
      const updatedBlocks = state.template.blocks
        .filter(block => block.id !== action.payload.blockId)
        .map((block, index) => ({ ...block, position: index }));

      const newTemplate: EmailTemplate = {
        ...state.template,
        blocks: updatedBlocks as EmailBlock[] as EmailBlock[],
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        template: newTemplate,
        selectedBlockId: state.selectedBlockId === action.payload.blockId ? null : state.selectedBlockId,
        isEditing: state.editingBlockId === action.payload.blockId ? false : state.isEditing,
        editingBlockId: state.editingBlockId === action.payload.blockId ? null : state.editingBlockId,
        history: [...state.history.slice(0, state.historyIndex + 1), newTemplate],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'DUPLICATE_BLOCK': {
      const blockToDuplicate = state.template.blocks.find(b => b.id === action.payload.blockId);
      if (!blockToDuplicate) return state;

      const duplicatedBlock = {
        ...blockToDuplicate,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: blockToDuplicate.position + 1,
      };

      // Ajuster les positions des blocs suivants
      const updatedBlocks = state.template.blocks.map(block =>
        block.position > blockToDuplicate.position
          ? { ...block, position: block.position + 1 }
          : block
      );

      const newTemplate: EmailTemplate = {
        ...state.template,
        blocks: [...updatedBlocks as EmailBlock[], duplicatedBlock].sort((a, b) => a.position - b.position),
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        template: newTemplate,
        selectedBlockId: duplicatedBlock.id,
        history: [...state.history.slice(0, state.historyIndex + 1), newTemplate],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'MOVE_BLOCK': {
      const { blockId, newPosition } = action.payload;
      const blockToMove = state.template.blocks.find(b => b.id === blockId);
      if (!blockToMove) return state;

      const otherBlocks = state.template.blocks.filter(b => b.id !== blockId);
      
      // Réorganiser les positions
      const updatedBlocks = otherBlocks
        .map(block => {
          if (block.position >= newPosition) {
            return { ...block, position: block.position + 1 };
          }
          return block;
        })
        .concat({ ...blockToMove, position: newPosition })
        .sort((a, b) => a.position - b.position)
        .map((block, index) => ({ ...block, position: index }));

      const newTemplate: EmailTemplate = {
        ...state.template,
        blocks: updatedBlocks as EmailBlock[] as EmailBlock[],
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        template: newTemplate,
        history: [...state.history.slice(0, state.historyIndex + 1), newTemplate],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'SELECT_BLOCK':
      return {
        ...state,
        selectedBlockId: action.payload.blockId,
        isEditing: false,
        editingBlockId: null,
      };

    case 'START_EDITING':
      return {
        ...state,
        isEditing: true,
        editingBlockId: action.payload.blockId,
        selectedBlockId: action.payload.blockId,
      };

    case 'STOP_EDITING':
      return {
        ...state,
        isEditing: false,
        editingBlockId: null,
      };

    case 'UPDATE_GLOBAL_STYLES': {
      const newTemplate: EmailTemplate = {
        ...state.template,
        globalStyles: { ...state.template.globalStyles, ...action.payload },
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        template: newTemplate,
        history: [...state.history.slice(0, state.historyIndex + 1), newTemplate],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        previewMode: action.payload.mode,
      };

    case 'START_DRAGGING':
      return {
        ...state,
        isDragging: true,
        draggedBlockType: action.payload.blockType,
      };

    case 'STOP_DRAGGING':
      return {
        ...state,
        isDragging: false,
        draggedBlockType: null,
      };

    case 'UNDO':
      if (state.historyIndex > 0) {
        const previousTemplate = state.history[state.historyIndex - 1];
        return {
          ...state,
          template: previousTemplate,
          historyIndex: state.historyIndex - 1,
          selectedBlockId: null,
          isEditing: false,
          editingBlockId: null,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const nextTemplate = state.history[state.historyIndex + 1];
        return {
          ...state,
          template: nextTemplate,
          historyIndex: state.historyIndex + 1,
          selectedBlockId: null,
          isEditing: false,
          editingBlockId: null,
        };
      }
      return state;

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.loading,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
      };

    case 'RESET_TEMPLATE':
      return {
        ...initialState,
        template: createDefaultTemplate() as EmailTemplate | null,
      };

    default:
      return state;
  }
};

// Contexte de l'éditeur
const EmailEditorContext = createContext<EmailEditorContextType | undefined>(undefined);

// Provider du contexte
export const EmailEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("EmailEditorProvider mounted");
  const [state, dispatch] = useReducer(emailEditorReducer, initialState);

  // Actions de l'éditeur
  const actions = {
    loadTemplate: useCallback((template: EmailTemplate) => {
      dispatch({ type: 'LOAD_TEMPLATE', payload: template });
    }, []),

    saveTemplate: useCallback(async () => {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      try {
        // TODO: Implémenter la sauvegarde API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
        dispatch({ type: 'SET_ERROR', payload: { error: null } });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: { error: 'Erreur lors de la sauvegarde' } });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { loading: false } });
      }
    }, []),

    resetTemplate: useCallback(() => {
      dispatch({ type: 'RESET_TEMPLATE' });
    }, []),

    addBlock: useCallback((blockType: BlockType, position?: number) => {
      dispatch({ type: 'ADD_BLOCK', payload: { blockType, position } });
    }, []),

    updateBlock: useCallback((blockId: string, updates: Partial<EmailBlock>) => {
      dispatch({ type: 'UPDATE_BLOCK', payload: { blockId, updates } });
    }, []),

    deleteBlock: useCallback((blockId: string) => {
      dispatch({ type: 'DELETE_BLOCK', payload: { blockId } });
    }, []),

    duplicateBlock: useCallback((blockId: string) => {
      dispatch({ type: 'DUPLICATE_BLOCK', payload: { blockId } });
    }, []),

    moveBlock: useCallback((blockId: string, newPosition: number) => {
      dispatch({ type: 'MOVE_BLOCK', payload: { blockId, newPosition } });
    }, []),

    selectBlock: useCallback((blockId: string | null) => {
      dispatch({ type: 'SELECT_BLOCK', payload: { blockId } });
    }, []),

    startEditing: useCallback((blockId: string) => {
      dispatch({ type: 'START_EDITING', payload: { blockId } });
    }, []),

    stopEditing: useCallback(() => {
      dispatch({ type: 'STOP_EDITING' });
    }, []),

    updateGlobalStyles: useCallback((styles: Partial<GlobalStyles>) => {
      dispatch({ type: 'UPDATE_GLOBAL_STYLES', payload: styles });
    }, []),

    setPreviewMode: useCallback((mode: 'desktop' | 'mobile') => {
      dispatch({ type: 'SET_PREVIEW_MODE', payload: { mode } });
    }, []),

    startDragging: useCallback((blockType: BlockType) => {
      dispatch({ type: 'START_DRAGGING', payload: { blockType } });
    }, []),

    stopDragging: useCallback(() => {
      dispatch({ type: 'STOP_DRAGGING' });
    }, []),

    undo: useCallback(() => {
      dispatch({ type: 'UNDO' });
    }, []),

    redo: useCallback(() => {
      dispatch({ type: 'REDO' });
    }, []),

    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: { loading } });
    }, []),

    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: { error } });
    }, []),
  };

  const contextValue: EmailEditorContextType = {
    state,
    actions,
  };

  return (
    <EmailEditorContext.Provider value={contextValue}>
      {children}
    </EmailEditorContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useEmailEditorStore = (): EmailEditorContextType => {
  const context = useContext(EmailEditorContext);
  if (context === undefined) {
    throw new Error('useEmailEditorStore must be used within an EmailEditorProvider');
  }
  return context;
};
