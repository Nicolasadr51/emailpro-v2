import React, { useMemo } from 'react';
import { useEmailEditorStore } from '../../../contexts/EmailEditorContext';
import { useDragDrop } from '../hooks/useDragDrop';
import { DraggableElement } from './DraggableElement';
import { EmailBlock } from '../../../types/emailEditor';
import { ViewMode } from './ViewModeToggle'; // Importer le type ViewMode

interface EditorCanvasProps {
  className?: string;
  viewMode?: ViewMode; // Ajouter viewMode en tant que propriété optionnelle de type ViewMode
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  className = '',
  viewMode = 'desktop'
}) => {
  console.log("EditorCanvas: Attempting to use useEmailEditorStore");
  const { state, selectedBlock, actions } = useEmailEditorStore();
  console.log("EditorCanvas: Successfully got context", { state });
  
  // Utiliser les données du contexte avec vérifications de sécurité
  const template = state.template;
  const elements = template?.blocks || [];
  const selectedBlockId = state.selectedBlockId;
  const zoom = 1; // Placeholder - le zoom n'est pas encore implémenté dans le contexte
  const { dropRef, dropHandlers, isDragOver, draggedItem } = useDragDrop();

  // Adapter la largeur selon le mode d'affichage
  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      case 'desktop': 
      default: return template?.layout.width || 600;
    }
  };

  const canvasWidth = template ? getCanvasWidth() : 600;
  const canvasHeight = template ? template.layout.height : 800;

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
        className={`editor-canvas ${isDragOver ? 'drag-over' : ''}`}
        style={canvasStyle}
        {...dropHandlers}
      >
        {/* Grid for alignment */}
        <div className="canvas-grid" />

        {/* Template elements */}
        {elements.map((element: EmailBlock) => (
          <DraggableElement
            key={element.id}
            element={element}
            isSelected={selectedBlockId === element.id}
            onSelect={actions.selectBlock}
          />
        ))}

        {/* Drop zone indicator */}
        {isDragOver && draggedItem && (
          <div className="drop-indicator">
            Glissez ici pour ajouter/déplacer {typeof draggedItem.id === 'string' ? draggedItem.id : 'un élément'}
          </div>
        )}

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
          <div>Sélectionné: {selectedBlock?.id || 'Aucun'}</div>
        </div>
      )}
    </div>
  );
};

export const editorCanvasStyles = `
  .editor-canvas.drag-over {
    border: 2px dashed #007bff;
    background-color: rgba(0, 123, 255, 0.1);
  }
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

