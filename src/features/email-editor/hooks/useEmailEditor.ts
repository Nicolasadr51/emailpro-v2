// Store Zustand pour l'éditeur d'emails
// Architecture définie par Claude 4.5 Sonnet

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { EditorStore, EditorElement, Position } from '../types/editor.types';

const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createDefaultElement = (type: EditorElement['type'], position: Position): Omit<EditorElement, 'id'> => {
  const baseElement = {
    type,
    position,
    styles: {
      padding: '10px',
      margin: '5px',
    },
  };

  switch (type) {
    case 'TEXT':
      return {
        ...baseElement,
        content: 'Votre texte ici',
        styles: {
          ...baseElement.styles,
          fontSize: '16px',
          color: '#333333',
          lineHeight: '1.5',
        },
      };
    case 'IMAGE':
      return {
        ...baseElement,
        content: JSON.stringify({
          src: 'https://via.placeholder.com/300x200',
          alt: 'Image placeholder',
        }),
        styles: {
          ...baseElement.styles,
          width: '300px',
          height: '200px',
        },
      };
    case 'BUTTON':
      return {
        ...baseElement,
        content: JSON.stringify({
          text: 'Cliquez ici',
          link: '#',
          target: '_self',
        }),
        styles: {
          ...baseElement.styles,
          backgroundColor: '#007bff',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '4px',
          textAlign: 'center' as const,
          border: 'none',
        },
      };
    case 'DIVIDER':
      return {
        ...baseElement,
        content: JSON.stringify({
          thickness: 1,
          style: 'solid',
        }),
        styles: {
          ...baseElement.styles,
          width: '100%',
          height: '1px',
          backgroundColor: '#e0e0e0',
          margin: '20px 0',
        },
      };
    default:
      return baseElement as Omit<EditorElement, 'id'>;
  }
};

export const useEmailEditorStoreStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      // État initial
      elements: [],
      selectedElement: null,
      template: null,
      isLoading: false,
      isDragging: false,
      zoom: 1,
      history: [[]],
      historyIndex: 0,

      // Actions
      addElement: (elementData) => {
        const element: EditorElement = {
          id: generateId(),
          ...elementData,
        };

        set((state) => {
          const newElements = [...state.elements, element];
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);

          return {
            elements: newElements,
            selectedElement: element,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      updateElement: (id, updates) => {
        set((state) => {
          const newElements = state.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          );

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);

          return {
            elements: newElements,
            selectedElement: state.selectedElement?.id === id 
              ? { ...state.selectedElement, ...updates }
              : state.selectedElement,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      deleteElement: (id) => {
        set((state) => {
          const newElements = state.elements.filter((el) => el.id !== id);
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newElements);

          return {
            elements: newElements,
            selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      selectElement: (id) => {
        set((state) => ({
          selectedElement: id ? state.elements.find((el) => el.id === id) || null : null,
        }));
      },

      moveElement: (id, position) => {
        get().updateElement(id, { position });
      },

      duplicateElement: (id) => {
        const state = get();
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          const duplicatedElement = {
            ...element,
            position: {
              ...element.position,
              x: element.position.x + 20,
              y: element.position.y + 20,
            },
          };
          delete (duplicatedElement as any).id; // Remove id to generate new one
          state.addElement(duplicatedElement);
        }
      },

      setTemplate: (template) => {
        set({
          template,
          elements: template.elements,
          selectedElement: null,
          history: [template.elements],
          historyIndex: 0,
        });
      },

      setZoom: (zoom) => {
        set({ zoom: Math.max(0.25, Math.min(2, zoom)) });
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            return {
              elements: state.history[newIndex],
              historyIndex: newIndex,
              selectedElement: null,
            };
          }
          return state;
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            return {
              elements: state.history[newIndex],
              historyIndex: newIndex,
              selectedElement: null,
            };
          }
          return state;
        });
      },

      clearHistory: () => {
        set((state) => ({
          history: [state.elements],
          historyIndex: 0,
        }));
      },
    }),
    {
      name: 'email-editor-store',
    }
  )
);

// Hook utilitaire pour créer des éléments
export const useElementCreator = () => {
  const addElement = useEmailEditorStoreStore((state) => state.addElement);

  const createElement = (type: EditorElement['type'], position: Position) => {
    const elementData = createDefaultElement(type, position);
    addElement(elementData);
  };

  return { createElement };
};
