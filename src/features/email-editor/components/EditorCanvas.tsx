import React, { useMemo } from 'react';
import { useEmailEditor } from '../hooks/useEmailEditor';
import { useDragDrop } from '../hooks/useDragDrop';
import { DraggableElement } from './DraggableElement';
import { EditorElement } from '../types/editor.types';

interface EditorCanvasProps {
  className?: string;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ className = '' }) => {
  const { elements, selectedElement, template, zoom } = useEmailEditor();
  const { dropRef, dropHandlers } = useDragDrop();

  const canvasWidth = template?.layout.width || 600;
  const canvasHeight = template?.layout.height || 800;

  const canvasStyle = useMemo(() => ({
    width: canvasWidth,
    minHeight: canvasHeight,
    backgroundColor: template?.layout.backgroundColor || '#ffffff',
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    position: 'relative' as const,
    margin: '20px auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    overflow: 'hidden',
  }), [canvasWidth, canvasHeight, template?.layout.backgroundColor, zoom]);

  const containerStyle = useMemo(() => ({
    width: `${canvasWidth * zoom + 40}px`,
    height: `${canvasHeight * zoom + 40}px`,
    overflow: 'auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
  }), [canvasWidth, canvasHeight, zoom]);

  return (
    <div className={`editor-canvas-container ${className}`} style={containerStyle}>
      <div
        ref={dropRef}
        className="editor-canvas"
        style={canvasStyle}
        {...dropHandlers}
      >
        {/* Grid for alignment */}
        <div className="canvas-grid" />

        {/* Template elements */}
        {elements.map((element: EditorElement) => (
          <DraggableElement
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
          />
        ))}

        {/* Drop zone indicator */}
        <div className="drop-indicator" />

        {/* Helper message if no elements */}
        {elements.length === 0 && (
          <div className="empty-canvas-message">
            <div className="empty-icon">📧</div>
            <div>Glissez-déposez des éléments ici</div>
            <div className="empty-text">
              Commencez par ajouter du texte, des images ou des boutons
            </div>
          </div>
        )}
      </div>

      {/* Debug information in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="canvas-debug-info">
          <div>Éléments: {elements.length}</div>
          <div>Zoom: {Math.round(zoom * 100)}%</div>
          <div>Sélectionné: {selectedElement?.id || 'Aucun'}</div>
        </div>
      )}
    </div>
  );
};

export const editorCanvasStyles = `
  .canvas-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.3s ease;
  }
  .editor-canvas:hover .canvas-grid {
    opacity: 0.5;
  }
  .empty-canvas-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #666;
    font-size: 18px;
    font-weight: 500;
    z-index: 2;
  }
  .empty-icon {
    margin-bottom: 12px;
    font-size: 48px;
    opacity: 0.3;
  }
  .empty-text {
    font-size: 14px;
    margin-top: 8px;
    opacity: 0.7;
  }
  @media (max-width: 768px) {
    .canvas-debug-info {
      display: none;
    }
  }
`;

