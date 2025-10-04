import React, { useMemo, useState, useCallback } from 'react';
import { useEmailEditorStore } from '../../../contexts/EmailEditorContext';
import { useDragDrop } from '../hooks/useDragDrop';
import { DraggableElement } from './DraggableElement';
import { EmailBlock } from '../../../types/emailEditor';
import { designTokens } from '../../../design-system/tokens';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Eye,
  Code,
  Settings
} from 'lucide-react';

interface EditorCanvasProps {
  className?: string;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onViewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

export const ImprovedEditorCanvas: React.FC<EditorCanvasProps> = ({ 
  className = '', 
  viewMode = 'desktop',
  onViewModeChange
}) => {
  const { state, selectedBlock } = useEmailEditorStore(); const elements = state.template.blocks; const template = state.template;
  const { dropRef, dropHandlers, isDragOver, draggedItem } = useDragDrop();
  const [showGrid, setShowGrid] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Adapter la largeur selon le mode d'affichage
  const getCanvasWidth = useCallback(() => {
    switch (viewMode) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      case 'desktop': 
      default: return template?.layout.width || 600;
    }
  }, [viewMode, template?.layout.width]);

  const canvasWidth = getCanvasWidth();
  const canvasHeight = template?.layout.height || 800;

  const canvasStyle = useMemo(() => ({
    width: canvasWidth,
    minHeight: canvasHeight,
    backgroundColor: template?.layout.backgroundColor || '#ffffff',
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    position: 'relative' as const,
    margin: '20px auto',
    boxShadow: isDragOver 
      ? `0 8px 32px ${designTokens.colors.states.dropzoneActive}40, 0 0 0 2px ${designTokens.colors.states.dropzoneActive}`
      : '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    overflow: 'hidden',
    border: isDragOver ? `2px dashed ${designTokens.colors.states.dropzoneActive}` : 'none',
    transition: designTokens.transitions.base,
  }), [canvasWidth, canvasHeight, template?.layout.background, zoom, isDragOver]);

  const containerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '20px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column' as const,
  }), []);

  const toolbarStyle = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    backgroundColor: designTokens.colors.semantic.background,
    borderBottom: `1px solid ${designTokens.colors.semantic.border}`,
    borderRadius: `${designTokens.borderRadius.lg} ${designTokens.borderRadius.lg} 0 0`,
    marginBottom: designTokens.spacing.lg,
    boxShadow: designTokens.shadows.sm,
  }), []);

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.3));
  const handleResetZoom = () => setZoom(1);

  const renderViewModeButtons = () => (
    <div style={{ display: 'flex', gap: designTokens.spacing.xs }}>
      {[
        { mode: 'desktop' as const, icon: Monitor, label: 'Bureau' },
        { mode: 'tablet' as const, icon: Tablet, label: 'Tablette' },
        { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
      ].map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onViewModeChange?.(mode)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: designTokens.spacing.xs,
            padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
            border: `1px solid ${viewMode === mode ? designTokens.colors.states.focus : designTokens.colors.semantic.border}`,
            borderRadius: designTokens.borderRadius.md,
            backgroundColor: viewMode === mode ? `${designTokens.colors.states.focus}10` : 'transparent',
            color: viewMode === mode ? designTokens.colors.states.focus : designTokens.colors.semantic.text.secondary,
            fontSize: designTokens.typography.sizes.sm,
            cursor: 'pointer',
            transition: designTokens.transitions.base,
          }}
          title={label}
        >
          <Icon size={16} />
          <span className="hidden md:inline">{label}</span>
        </button>
      ))}
    </div>
  );

  const renderZoomControls = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.xs }}>
      <button
        onClick={handleZoomOut}
        style={{
          padding: designTokens.spacing.sm,
          border: `1px solid ${designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Zoom arrière"
      >
        <ZoomOut size={16} />
      </button>
      
      <button
        onClick={handleResetZoom}
        style={{
          padding: `${designTokens.spacing.xs} ${designTokens.spacing.sm}`,
          border: `1px solid ${designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: 'transparent',
          cursor: 'pointer',
          fontSize: designTokens.typography.sizes.sm,
          minWidth: '60px',
        }}
        title="Réinitialiser le zoom"
      >
        {Math.round(zoom * 100)}%
      </button>
      
      <button
        onClick={handleZoomIn}
        style={{
          padding: designTokens.spacing.sm,
          border: `1px solid ${designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Zoom avant"
      >
        <ZoomIn size={16} />
      </button>
    </div>
  );

  const renderActionButtons = () => (
    <div style={{ display: 'flex', gap: designTokens.spacing.xs }}>
      <button
        onClick={() => setShowGrid(!showGrid)}
        style={{
          padding: designTokens.spacing.sm,
          border: `1px solid ${showGrid ? designTokens.colors.states.focus : designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: showGrid ? `${designTokens.colors.states.focus}10` : 'transparent',
          color: showGrid ? designTokens.colors.states.focus : designTokens.colors.semantic.text.secondary,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Afficher/masquer la grille"
      >
        <Settings size={16} />
      </button>
      
      <button
        onClick={() => setPreviewMode(!previewMode)}
        style={{
          padding: designTokens.spacing.sm,
          border: `1px solid ${previewMode ? designTokens.colors.states.focus : designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: previewMode ? `${designTokens.colors.states.focus}10` : 'transparent',
          color: previewMode ? designTokens.colors.states.focus : designTokens.colors.semantic.text.secondary,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Mode aperçu"
      >
        {previewMode ? <Code size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );

  const renderDropZoneIndicator = () => {
    if (!isDragOver || !draggedItem) return null;

    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `${designTokens.colors.states.dropzone}20`,
        border: `2px dashed ${designTokens.colors.states.dropzone}`,
        borderRadius: designTokens.borderRadius.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        pointerEvents: 'none',
      }}>
        <div style={{
          padding: `${designTokens.spacing.lg} ${designTokens.spacing.xl}`,
          backgroundColor: designTokens.colors.semantic.background,
          borderRadius: designTokens.borderRadius.lg,
          boxShadow: designTokens.shadows.lg,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: designTokens.spacing.md,
          }}>
            📧
          </div>
          <div style={{
            fontSize: designTokens.typography.sizes.lg,
            fontWeight: designTokens.typography.weights.semibold,
            color: designTokens.colors.semantic.text.primary,
            marginBottom: designTokens.spacing.xs,
          }}>
            Déposez votre {draggedItem.type.toLowerCase()} ici
          </div>
          <div style={{
            fontSize: designTokens.typography.sizes.sm,
            color: designTokens.colors.semantic.text.secondary,
          }}>
            Il sera ajouté à votre email
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`editor-canvas-container ${className}`} style={containerStyle}>
      {/* Toolbar */}
      <div style={toolbarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.lg }}>
          {renderViewModeButtons()}
          {renderZoomControls()}
        </div>
        
        <div style={{
          fontSize: designTokens.typography.sizes.sm,
          color: designTokens.colors.semantic.text.secondary,
        }}>
          {canvasWidth} × {canvasHeight}px
        </div>
        
        {renderActionButtons()}
      </div>

      {/* Canvas Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'auto',
        position: 'relative',
      }}>
        <div
          ref={dropRef}
          className="editor-canvas"
          style={canvasStyle}
          {...dropHandlers}
        >
          {/* Grid for alignment */}
          {showGrid && !previewMode && (
            <div 
              className="canvas-grid"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                opacity: 0.3,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}

          {/* Template elements */}
          {elements.map((element: EmailBlock) => (
            <DraggableElement
              key={element.id}
              element={element}
              isSelected={selectedBlock?.id === element.id && !previewMode}
              previewMode={previewMode}
            />
          ))}

          {/* Drop zone indicator */}
          {renderDropZoneIndicator()}

          {/* Helper message if no elements */}
          {elements.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: designTokens.colors.semantic.text.secondary,
              zIndex: 2,
            }}>
              <div style={{
                marginBottom: designTokens.spacing.md,
                fontSize: '48px',
                opacity: 0.3,
              }}>
                📧
              </div>
              <div style={{
                fontSize: designTokens.typography.sizes.lg,
                fontWeight: designTokens.typography.weights.medium,
                marginBottom: designTokens.spacing.sm,
              }}>
                Glissez-déposez des éléments ici
              </div>
              <div style={{
                fontSize: designTokens.typography.sizes.sm,
                opacity: 0.7,
              }}>
                Commencez par ajouter du texte, des images ou des boutons
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
        backgroundColor: designTokens.colors.semantic.background,
        borderTop: `1px solid ${designTokens.colors.semantic.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: designTokens.typography.sizes.xs,
        color: designTokens.colors.semantic.text.secondary,
      }}>
        <div>
          {elements.length} élément{elements.length !== 1 ? 's' : ''} • 
          {selectedBlock ? ` Sélectionné: ${selectedBlock.type}` : ' Aucune sélection'}
        </div>
        <div>
          Mode: {viewMode} • Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
};
