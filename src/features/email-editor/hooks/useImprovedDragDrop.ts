import { useRef, useState, useCallback, useEffect } from 'react';
import { EmailBlock } from '../../../types/emailEditor';
import { useEmailEditorStore } from '../../../contexts/EmailEditorContext';

interface DragState {
  isDragging: boolean;
  draggedElement: EmailBlock | null;
  draggedFromSidebar: boolean;
  dragOffset: { x: number; y: number };
  dropZone: string | null;
  insertPosition: 'before' | 'after' | 'inside' | null;
}

interface DropZone {
  id: string;
  element: HTMLElement;
  rect: DOMRect;
  accepts: string[];
}

export const useImprovedDragDrop = () => {
  const { state, actions } = useEmailEditorStore();
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedElement: null,
    draggedFromSidebar: false,
    dragOffset: { x: 0, y: 0 },
    dropZone: null,
    insertPosition: null,
  });

  const dropZonesRef = useRef<Map<string, DropZone>>(new Map());
  const dragPreviewRef = useRef<HTMLElement | null>(null);

  // Enregistrer une zone de drop
  const registerDropZone = useCallback((
    id: string, 
    element: HTMLElement, 
    accepts: string[] = ['*']
  ) => {
    const rect = element.getBoundingClientRect();
    dropZonesRef.current.set(id, {
      id,
      element,
      rect,
      accepts,
    });

    return () => {
      dropZonesRef.current.delete(id);
    };
  }, []);

  // Démarrer le drag depuis la sidebar
  const startSidebarDrag = useCallback((
    blockData: any,
    event: React.DragEvent | React.MouseEvent
  ) => {
    const clientX = 'clientX' in event ? event.clientX : event.touches?.[0]?.clientX || 0;
    const clientY = 'clientY' in event ? event.clientY : event.touches?.[0]?.clientY || 0;

    setDragState({
      isDragging: true,
      draggedElement: null,
      draggedFromSidebar: true,
      dragOffset: { x: clientX, y: clientY },
      dropZone: null,
      insertPosition: null,
    });

    // Créer un aperçu de drag personnalisé
    createDragPreview(blockData, clientX, clientY);

    // Empêcher le comportement par défaut
    if ('preventDefault' in event) {
      event.preventDefault();
    }
  }, []);

  // Démarrer le drag d'un élément existant
  const startElementDrag = useCallback((
    element: EmailBlock,
    event: React.DragEvent | React.MouseEvent
  ) => {
    const clientX = 'clientX' in event ? event.clientX : event.touches?.[0]?.clientX || 0;
    const clientY = 'clientY' in event ? event.clientY : event.touches?.[0]?.clientY || 0;

    setDragState({
      isDragging: true,
      draggedElement: element,
      draggedFromSidebar: false,
      dragOffset: { x: clientX, y: clientY },
      dropZone: null,
      insertPosition: null,
    });

    createDragPreview(element, clientX, clientY);

    if ('preventDefault' in event) {
      event.preventDefault();
    }
  }, []);

  // Créer un aperçu visuel du drag
  const createDragPreview = useCallback((
    data: any,
    x: number,
    y: number
  ) => {
    // Supprimer l'ancien aperçu s'il existe
    if (dragPreviewRef.current) {
      document.body.removeChild(dragPreviewRef.current);
    }

    const preview = document.createElement('div');
    preview.style.cssText = `
      position: fixed;
      top: ${y - 20}px;
      left: ${x - 20}px;
      width: 200px;
      height: 60px;
      background: white;
      border: 2px solid #3B82F6;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 500;
      color: #3B82F6;
      z-index: 10000;
      pointer-events: none;
      transform: rotate(-2deg);
      transition: transform 0.2s ease;
    `;

    const type = data.type || data.blockData?.type || 'Element';
    preview.textContent = `📧 ${type}`;

    document.body.appendChild(preview);
    dragPreviewRef.current = preview;

    // Animation d'entrée
    requestAnimationFrame(() => {
      if (preview) {
        preview.style.transform = 'rotate(0deg) scale(1.05)';
      }
    });
  }, []);

  // Mettre à jour la position de l'aperçu
  const updateDragPreview = useCallback((x: number, y: number) => {
    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.left = `${x - 20}px`;
      dragPreviewRef.current.style.top = `${y - 20}px`;
    }
  }, []);

  // Gérer le mouvement de la souris pendant le drag
  const handleDragMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging) return;

    const clientX = 'clientX' in event ? event.clientX : event.touches?.[0]?.clientX || 0;
    const clientY = 'clientY' in event ? event.clientY : event.touches?.[0]?.clientY || 0;

    updateDragPreview(clientX, clientY);

    // Détecter la zone de drop
    let foundDropZone: DropZone | null = null;
    let insertPosition: 'before' | 'after' | 'inside' | null = null;

    for (const [id, dropZone] of dropZonesRef.current) {
      const rect = dropZone.element.getBoundingClientRect();
      
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        foundDropZone = dropZone;
        
        // Déterminer la position d'insertion
        const relativeY = (clientY - rect.top) / rect.height;
        if (relativeY < 0.25) {
          insertPosition = 'before';
        } else if (relativeY > 0.75) {
          insertPosition = 'after';
        } else {
          insertPosition = 'inside';
        }
        
        break;
      }
    }

    setDragState(prev => ({
      ...prev,
      dropZone: foundDropZone?.id || null,
      insertPosition,
    }));

    // Mettre à jour les styles visuels des zones de drop
    updateDropZoneStyles(foundDropZone, insertPosition);
  }, [dragState.isDragging, updateDragPreview]);

  // Mettre à jour les styles visuels des zones de drop
  const updateDropZoneStyles = useCallback((
    activeDropZone: DropZone | null,
    insertPosition: 'before' | 'after' | 'inside' | null
  ) => {
    // Réinitialiser tous les styles
    for (const [id, dropZone] of dropZonesRef.current) {
      const element = dropZone.element;
      element.style.backgroundColor = '';
      element.style.border = '';
      element.style.outline = '';
      
      // Supprimer les indicateurs d'insertion
      const indicators = element.querySelectorAll('.drop-indicator');
      indicators.forEach(indicator => indicator.remove());
    }

    // Appliquer les styles à la zone active
    if (activeDropZone && insertPosition) {
      const element = activeDropZone.element;
      
      if (insertPosition === 'inside') {
        element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        element.style.border = '2px dashed #3B82F6';
      } else {
        // Créer un indicateur d'insertion
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        indicator.style.cssText = `
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: #3B82F6;
          border-radius: 2px;
          z-index: 1000;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
          ${insertPosition === 'before' ? 'top: -2px;' : 'bottom: -2px;'}
        `;
        
        element.style.position = 'relative';
        element.appendChild(indicator);
      }
    }
  }, []);

  // Terminer le drag
  const endDrag = useCallback((event?: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging) return;

    const clientX = event ? ('clientX' in event ? event.clientX : event.touches?.[0]?.clientX || 0) : 0;
    const clientY = event ? ('clientY' in event ? event.clientY : event.touches?.[0]?.clientY || 0) : 0;

    // Supprimer l'aperçu de drag
    if (dragPreviewRef.current) {
      // Animation de sortie
      dragPreviewRef.current.style.transform = 'scale(0.8) rotate(-5deg)';
      dragPreviewRef.current.style.opacity = '0';
      
      setTimeout(() => {
        if (dragPreviewRef.current) {
          document.body.removeChild(dragPreviewRef.current);
          dragPreviewRef.current = null;
        }
      }, 200);
    }

    // Traiter le drop si on est dans une zone valide
    if (dragState.dropZone && dragState.insertPosition) {
      handleDrop(dragState.dropZone, dragState.insertPosition);
    }

    // Nettoyer les styles
    updateDropZoneStyles(null, null);

    // Réinitialiser l'état
    setDragState({
      isDragging: false,
      draggedElement: null,
      draggedFromSidebar: false,
      dragOffset: { x: 0, y: 0 },
      dropZone: null,
      insertPosition: null,
    });
  }, [dragState]);

  // Gérer le drop
  const handleDrop = useCallback((
    dropZoneId: string,
    insertPosition: 'before' | 'after' | 'inside'
  ) => {
    if (dragState.draggedFromSidebar) {
      // Ajouter un nouvel élément depuis la sidebar
      const newElement: EmailBlock = {
        id: `element-${Date.now()}`,
        type: 'text', // À adapter selon le type réel
        position: { x: 0, y: 0 },
        size: { width: 200, height: 50 },
        content: { text: 'Nouveau contenu' },
        style: {},
        visible: true,
      };

      actions.addBlock(newElement.type, dropZoneId, insertPosition);
    } else if (dragState.draggedElement) {
      // Déplacer un élément existant
      actions.moveBlock(
        dragState.draggedElement.id,
        dropZoneId,
        insertPosition
      );
    }
  }, [dragState, addElement, moveElement]);

  // Écouteurs d'événements globaux
  useEffect(() => {
    if (dragState.isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
      const handleMouseUp = (e: MouseEvent) => endDrag(e);
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        handleDragMove(e);
      };
      const handleTouchEnd = (e: TouchEvent) => endDrag(e);

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [dragState.isDragging, handleDragMove, endDrag]);

  // Nettoyer à la destruction du composant
  useEffect(() => {
    return () => {
      if (dragPreviewRef.current) {
        document.body.removeChild(dragPreviewRef.current);
      }
    };
  }, []);

  return {
    dragState,
    registerDropZone,
    startSidebarDrag,
    startElementDrag,
    endDrag,
    isDragOver: dragState.isDragging && !!dragState.dropZone,
    draggedItem: dragState.draggedElement,
    insertPosition: dragState.insertPosition,
  };
};
