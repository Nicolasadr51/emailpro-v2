// Hook pour la gestion du drag and drop dans l'éditeur
// Architecture définie par Claude 4.5 Sonnet

import { useRef, useCallback } from 'react';
import { ElementType, Position } from '../types/editor.types';
import { useEmailEditorStore, useElementCreator } from './useEmailEditor';

export const useDragDrop = () => {
  const { createElement } = useElementCreator();
  const { moveElement } = useEmailEditorStore();
  const dragRef = useRef<HTMLDivElement>(null);

  // Gestion du drop sur le canvas
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const elementType = e.dataTransfer.getData('elementType') as ElementType;
    const elementId = e.dataTransfer.getData('elementId');
    
    if (!dragRef.current) return;

    const rect = dragRef.current.getBoundingClientRect();
    const position: Position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (elementType && !elementId) {
      // Création d'un nouvel élément depuis la palette
      createElement(elementType, position);
    } else if (elementId) {
      // Déplacement d'un élément existant
      moveElement(elementId, position);
    }
  }, [createElement, moveElement]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return {
    dropRef: dragRef,
    dropHandlers: {
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
    },
  };
};

// Hook pour rendre les éléments draggables
export const useDraggableElement = (elementId: string) => {
  const { selectElement } = useEmailEditorStore();

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('elementId', elementId);
    e.dataTransfer.effectAllowed = 'move';
    selectElement(elementId);
  }, [elementId, selectElement]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    // Cleanup si nécessaire
  }, []);

  return {
    draggable: true,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  };
};

// Hook pour les éléments de la palette
export const usePaletteElement = (elementType: ElementType) => {
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('elementType', elementType);
    e.dataTransfer.effectAllowed = 'copy';
  }, [elementType]);

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
};

// Hook pour la sélection par clic
export const useElementSelection = (elementId: string) => {
  const { selectElement, selectedElement } = useEmailEditorStore();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(elementId);
  }, [elementId, selectElement]);

  const isSelected = selectedElement?.id === elementId;

  return {
    isSelected,
    onClick: handleClick,
  };
};

// Hook pour le redimensionnement des éléments
export const useElementResize = (elementId: string) => {
  const { updateElement } = useEmailEditorStore();
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    
    const element = e.currentTarget.parentElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      startSize.current = { width: rect.width, height: rect.height };
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;

      if (direction.includes('right')) {
        newWidth = Math.max(50, startSize.current.width + deltaX);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(50, startSize.current.width - deltaX);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(30, startSize.current.height + deltaY);
      }
      if (direction.includes('top')) {
        newHeight = Math.max(30, startSize.current.height - deltaY);
      }

      updateElement(elementId, {
        styles: {
          width: `${newWidth}px`,
          height: `${newHeight}px`,
        },
      });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [elementId, updateElement]);

  return {
    handleResizeStart,
  };
};
