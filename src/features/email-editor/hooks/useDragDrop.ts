// Hook pour la gestion du drag and drop dans l'éditeur
// Architecture définie par Claude 4.5 Sonnet

import { useRef, useCallback, useState } from 'react';
import { BlockType, Position } from '../../../types/emailEditor';
import { useEmailEditorStore } from '../../../contexts/EmailEditorContext';

export const useDragDrop = () => {
  const { actions, moveElement } = useEmailEditorStore();
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ type: 'new' | 'existing'; id: string | BlockType } | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const elementType = e.dataTransfer.getData('elementType') as BlockType;
    const elementId = e.dataTransfer.getData('elementId');

    if (!dropRef.current) return;

    const rect = dropRef.current.getBoundingClientRect();
    const position: Position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (elementType && !elementId) {
      actions.addBlock(elementType, position);
    } else if (elementId) {
      moveElement(elementId, position);
    }
    setDraggedItem(null);
  }, [actions, moveElement]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    const elementType = e.dataTransfer.getData('elementType');
    const elementId = e.dataTransfer.getData('elementId');
    if (elementType) {
      setDraggedItem({ type: 'new', id: elementType as BlockType });
    } else if (elementId) {
      setDraggedItem({ type: 'existing', id: elementId });
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
    setDraggedItem(null);
  }, []);

  return {
    dropRef,
    dropHandlers: {
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
    },
    isDragOver,
    draggedItem,
  };
};

// Hook pour rendre les éléments draggables
export const useDraggableElement = (elementId: string) => {
  const { actions: { selectBlock } } = useEmailEditorStore();

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('elementId', elementId);
    e.dataTransfer.effectAllowed = 'move';
    selectBlock(elementId);
  }, [elementId, selectBlock]);

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
export const usePaletteElement = (elementType: BlockType) => {
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
  const { state: { selectedBlock }, actions: { selectBlock } } = useEmailEditorStore();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(elementId);
  }, [elementId, selectBlock]);

  const isSelected = selectedBlock?.id === elementId;

  return {
    isSelected,
    onClick: handleClick,
  };
};

// Hook pour le redimensionnement des éléments
export const useElementResize = (elementId: string) => {
  const { updateBlock } = useEmailEditorStore();
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

      updateBlock(elementId, {
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
  }, [elementId, updateBlock]);

  return {
    handleResizeStart,
  };
};

