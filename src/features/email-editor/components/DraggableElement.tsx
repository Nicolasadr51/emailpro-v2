// Composant pour les éléments draggables dans l'éditeur
// Architecture définie par Claude 4.5 Sonnet

import React, { useState } from 'react';
import { EditorElement } from '../types/editor.types';
import { useDraggableElement, useElementSelection, useElementResize } from '../hooks/useDragDrop';
import { useEmailEditor } from '../hooks/useEmailEditor';
import { TextBlock } from './elements/TextBlock';
import { ImageBlock } from './elements/ImageBlock';
import { ButtonBlock } from './elements/ButtonBlock';
import { DividerBlock } from './elements/DividerBlock';

interface DraggableElementProps {
  element: EditorElement;
  isSelected: boolean;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  isSelected,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { deleteElement, duplicateElement } = useEmailEditor();
  const draggableProps = useDraggableElement(element.id);
  const { onClick } = useElementSelection(element.id);
  const { handleResizeStart } = useElementResize(element.id);

  const elementStyle = {
    position: 'absolute' as const,
    left: element.position.x,
    top: element.position.y,
    width: element.position.width || 'auto',
    height: element.position.height || 'auto',
    cursor: 'move',
    zIndex: isSelected ? 1000 : 1,
    ...element.styles,
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return <TextBlock element={element} />;
      case 'image':
        return <ImageBlock element={element} />;
      case 'button':
        return <ButtonBlock element={element} />;
      case 'divider':
        return <DividerBlock element={element} />;
      default:
        return <div>Élément non supporté</div>;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateElement(element.id);
  };

  return (
    <div
      className={`draggable-element ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      style={elementStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...draggableProps}
    >
      {/* Contenu de l'élément */}
      <div className="element-content" style={{ width: '100%', height: '100%' }}>
        {renderElement()}
      </div>

      {/* Bordure de sélection */}
      {(isSelected || isHovered) && (
        <div
          className="selection-border"
          style={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            border: `2px ${isSelected ? 'solid' : 'dashed'} #007bff`,
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}

      {/* Poignées de redimensionnement */}
      {isSelected && (
        <>
          {/* Coins */}
          <div
            className="resize-handle resize-nw"
            style={{
              position: 'absolute',
              top: -4,
              left: -4,
              width: 8,
              height: 8,
              backgroundColor: '#007bff',
              border: '1px solid white',
              borderRadius: '50%',
              cursor: 'nw-resize',
              zIndex: 1001,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          />
          <div
            className="resize-handle resize-ne"
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 8,
              height: 8,
              backgroundColor: '#007bff',
              border: '1px solid white',
              borderRadius: '50%',
              cursor: 'ne-resize',
              zIndex: 1001,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div
            className="resize-handle resize-sw"
            style={{
              position: 'absolute',
              bottom: -4,
              left: -4,
              width: 8,
              height: 8,
              backgroundColor: '#007bff',
              border: '1px solid white',
              borderRadius: '50%',
              cursor: 'sw-resize',
              zIndex: 1001,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div
            className="resize-handle resize-se"
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 8,
              height: 8,
              backgroundColor: '#007bff',
              border: '1px solid white',
              borderRadius: '50%',
              cursor: 'se-resize',
              zIndex: 1001,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          />
        </>
      )}

      {/* Barre d'outils contextuelle */}
      {isSelected && (
        <div
          className="element-toolbar"
          style={{
            position: 'absolute',
            top: -40,
            left: 0,
            display: 'flex',
            gap: '4px',
            backgroundColor: '#333',
            borderRadius: '4px',
            padding: '4px',
            zIndex: 1002,
          }}
        >
          <button
            onClick={handleDuplicate}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Dupliquer"
          >
            📋
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff4757',
              padding: '4px 8px',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

// Styles CSS pour les éléments draggables
export const draggableElementStyles = `
  .draggable-element {
    transition: transform 0.1s ease;
  }

  .draggable-element:hover {
    transform: translateZ(0);
  }

  .draggable-element.selected {
    z-index: 1000 !important;
  }

  .resize-handle {
    transition: all 0.2s ease;
  }

  .resize-handle:hover {
    transform: scale(1.2);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .element-toolbar {
    animation: fadeInUp 0.2s ease;
  }

  .element-toolbar button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .resize-handle {
      width: 12px;
      height: 12px;
    }
    
    .element-toolbar {
      top: -50px;
    }
    
    .element-toolbar button {
      padding: 8px 12px;
      font-size: 14px;
    }
  }
`;
