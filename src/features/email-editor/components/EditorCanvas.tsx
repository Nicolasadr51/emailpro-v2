// Composant principal du canvas de l'éditeur d'emails
// Architecture définie par Claude 4.5 Sonnet

import React from 'react';
import { useEmailEditor } from '../hooks/useEmailEditor';
import { useDragDrop } from '../hooks/useDragDrop';
import { DraggableElement } from './DraggableElement';

interface EditorCanvasProps {
  className?: string;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ className = '' }) => {
  const { elements, selectedElement, template, zoom } = useEmailEditor();
  const { dropRef, dropHandlers } = useDragDrop();

  const canvasStyle = {
    width: template?.layout.width || 600,
    minHeight: template?.layout.height || 800,
    backgroundColor: template?.layout.backgroundColor || '#ffffff',
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    position: 'relative' as const,
    margin: '20px auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const containerStyle = {
    width: `${(template?.layout.width || 600) * zoom + 40}px`,
    height: `${(template?.layout.height || 800) * zoom + 40}px`,
    overflow: 'auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
  };

  return (
    <div className={`editor-canvas-container ${className}`} style={containerStyle}>
      <div
        ref={dropRef}
        className="editor-canvas"
        style={canvasStyle}
        {...dropHandlers}
      >
        {/* Grille de fond pour l'alignement */}
        <div
          className="canvas-grid"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            opacity: 0.3,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Éléments du template */}
        {elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
          />
        ))}

        {/* Indicateur de zone de drop */}
        <div
          className="drop-indicator"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '2px dashed transparent',
            borderRadius: '8px',
            pointerEvents: 'none',
            transition: 'border-color 0.2s ease',
            zIndex: 1,
          }}
        />

        {/* Message d'aide si aucun élément */}
        {elements.length === 0 && (
          <div
            className="empty-canvas-message"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#666',
              fontSize: '18px',
              fontWeight: '500',
              zIndex: 2,
            }}
          >
            <div style={{ marginBottom: '12px', fontSize: '48px', opacity: 0.3 }}>
              📧
            </div>
            <div>Glissez-déposez des éléments ici</div>
            <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
              Commencez par ajouter du texte, des images ou des boutons
            </div>
          </div>
        )}
      </div>

      {/* Informations de debug en mode développement */}
      {process.env.NODE_ENV === 'development' && (
        <div
          className="canvas-debug-info"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          <div>Éléments: {elements.length}</div>
          <div>Zoom: {Math.round(zoom * 100)}%</div>
          <div>Sélectionné: {selectedElement?.id || 'Aucun'}</div>
        </div>
      )}
    </div>
  );
};

// Styles CSS à ajouter au fichier global ou en tant que module CSS
export const editorCanvasStyles = `
  .editor-canvas-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100%;
  }

  .editor-canvas {
    border: 1px solid #e0e0e0;
    cursor: default;
    user-select: none;
  }

  .editor-canvas:hover .drop-indicator {
    border-color: #007bff;
  }

  .editor-canvas.drag-over .drop-indicator {
    border-color: #28a745;
    background-color: rgba(40, 167, 69, 0.05);
  }

  .canvas-grid {
    transition: opacity 0.3s ease;
  }

  .editor-canvas:hover .canvas-grid {
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    .editor-canvas-container {
      padding: 10px;
    }
    
    .canvas-debug-info {
      display: none;
    }
  }
`;
