import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Move,
  MoreHorizontal,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Settings
} from 'lucide-react';
import { designTokens, getTransition } from '../../../design-system/tokens';
import { EmailBlock } from '../../../types/emailEditor';
import { useImprovedDragDrop } from '../hooks/useImprovedDragDrop';
import { useEmailEditorStore } from '../../../contexts/EmailEditorContext';

interface ImprovedDraggableElementProps {
  element: EmailBlock;
  isSelected?: boolean;
  previewMode?: boolean;
  onSelect?: (element: EmailBlock) => void;
  onUpdate?: (elementId: string, updates: Partial<EmailBlock>) => void;
  onDelete?: (elementId: string) => void;
  onDuplicate?: (elementId: string) => void;
}

export const ImprovedDraggableElement: React.FC<ImprovedDraggableElementProps> = ({
  element,
  isSelected = false,
  previewMode = false,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [isLocked, setIsLocked] = useState(element.locked || false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const { startElementDrag, registerDropZone } = useImprovedDragDrop();
  const { actions: { selectBlock } } = useEmailEditorStore();

  // Enregistrer cet élément comme zone de drop
  useEffect(() => {
    if (elementRef.current && !previewMode) {
      return registerDropZone(
        element.id,
        elementRef.current,
        ['*'] // Accepte tous les types d'éléments
      );
    }
  }, [element.id, registerDropZone, previewMode]);

  // Gérer le clic pour sélectionner
  const handleClick = useCallback((event: React.MouseEvent) => {
    if (previewMode || isLocked) return;
    
    event.stopPropagation();
    onSelect?.(element);    selectBlock(element.id);
  }, [element, onSelect, selectBlock, previewMode, isLocked]);

  // Gérer le début du drag
  const handleDragStart = useCallback((event: React.MouseEvent) => {
    if (previewMode || isLocked) return;
    
    event.stopPropagation();
    startElementDrag(element, event);
  }, [element, startElementDrag, previewMode, isLocked]);

  // Gérer le menu contextuel
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    if (previewMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowContextMenu(true);
  }, [previewMode]);

  // Fermer le menu contextuel
  const closeContextMenu = useCallback(() => {
    setShowContextMenu(false);
  }, []);

  // Actions du menu contextuel
  const handleDuplicate = useCallback(() => {
    onDuplicate?.(element.id);
    closeContextMenu();
  }, [element.id, onDuplicate, closeContextMenu]);

  const handleDelete = useCallback(() => {
    onDelete?.(element.id);
    closeContextMenu();
  }, [element.id, onDelete, closeContextMenu]);

  const handleToggleVisibility = useCallback(() => {
    onUpdate?.(element.id, { visible: !element.visible });
    closeContextMenu();
  }, [element.id, element.visible, onUpdate, closeContextMenu]);

  const handleToggleLock = useCallback(() => {
    const newLocked = !isLocked;
    setIsLocked(newLocked);
    onUpdate?.(element.id, { locked: newLocked });
    closeContextMenu();
  }, [element.id, isLocked, onUpdate, closeContextMenu]);

  // Fermer le menu contextuel en cliquant ailleurs
  useEffect(() => {
    if (showContextMenu) {
      const handleClickOutside = () => closeContextMenu();
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu, closeContextMenu]);

  // Styles de l'élément
  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.size?.width,
    height: element.size?.height,
    cursor: previewMode ? 'default' : (isLocked ? 'not-allowed' : 'pointer'),
    opacity: element.visible === false ? 0.5 : 1,
    transition: previewMode ? 'none' : getTransition('all', 'base'),
    transform: isSelected && !previewMode ? 'scale(1.02)' : 'scale(1)',
    zIndex: isSelected ? 10 : 1,
    // Extraire et convertir les propriétés de bordure et de rayon de bordure si elles sont des objets
    border: element.styles?.border ? `${element.styles.border.width}px ${element.styles.border.style} ${element.styles.border.color}` : undefined,
    borderRadius: element.styles?.borderRadius ? `${element.styles.borderRadius}px` : (element.styles?.border?.radius ? `${element.styles.border.radius}px` : undefined),
    margin: element.styles?.margin ? `${element.styles.margin.top}px ${element.styles.margin.right}px ${element.styles.margin.bottom}px ${element.styles.margin.left}px` : undefined,
    padding: element.styles?.padding ? `${element.styles.padding.top}px ${element.styles.padding.right}px ${element.styles.padding.bottom}px ${element.styles.padding.left}px` : undefined,
    // Appliquer les autres styles
    ...(() => {
      const { border, borderRadius, margin, padding, ...restStyles } = element.styles || {};
      return restStyles;
    })(),
  };

  // Styles du conteneur avec bordures de sélection
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    border: !previewMode && (isSelected || isHovered)
      ? `2px solid ${isSelected ? designTokens.colors.states.focus : designTokens.colors.states.dropzone}`
      : '2px solid transparent',
    borderRadius: designTokens.borderRadius.sm,
    outline: isLocked && !previewMode ? `2px dashed ${designTokens.colors.semantic.text.muted}` : 'none',
    backgroundColor: !previewMode && isHovered && !isSelected
      ? `${designTokens.colors.states.hover}50`
      : 'transparent',
  };

  // Rendu du contenu selon le type d'élément
  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div style={{
            padding: '8px',
            fontSize: element.styles?.fontSize || '14px',
            color: element.styles?.color || '#000000',
            textAlign: element.styles?.textAlign as any || 'left',
            fontWeight: element.styles?.fontWeight || 'normal',
            fontStyle: element.styles?.fontStyle || 'normal',
            lineHeight: 1.4,
            wordWrap: 'break-word',
            overflow: 'hidden',
          }}>
            {element.content?.text || 'Texte par défaut'}
          </div>
        );

      case 'heading':
        const HeadingTag = `h${element.content?.level || 2}` as keyof React.JSX.IntrinsicElements;
        return (
          <HeadingTag style={{
            margin: 0,
            padding: '8px',
            fontSize: element.styles?.fontSize || '24px',
            color: element.styles?.color || '#000000',
            textAlign: element.styles?.textAlign as any || 'left',
            fontWeight: element.styles?.fontWeight || 'bold',
            lineHeight: 1.2,
            wordWrap: 'break-word',
            overflow: 'hidden',
          }}>
            {element.content?.text || 'Titre par défaut'}
          </HeadingTag>
        );

      case 'button':
        return (
          <button style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: designTokens.borderRadius.md,
            backgroundColor: element.styles?.backgroundColor || designTokens.colors.blocks.button,
            color: element.styles?.color || '#ffffff',
            fontSize: element.styles?.fontSize || '16px',
            fontWeight: element.styles?.fontWeight || '500',
            cursor: previewMode ? 'pointer' : 'inherit',
            transition: getTransition("all", "base"),
          }}>
            {element.content?.text || 'Bouton'}
          </button>
        );

      case 'image':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: designTokens.borderRadius.sm,
            overflow: 'hidden',
          }}>
            {element.content?.src ? (
              <img
                src={element.content.src}
                alt={element.content.alt || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div style={{
                color: designTokens.colors.semantic.text.secondary,
                fontSize: '12px',
                textAlign: 'center',
              }}>
                📷<br />Image
              </div>
            )}
          </div>
        );

      case 'divider':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '100%',
              height: '2px',
              backgroundColor: element.styles?.backgroundColor || designTokens.colors.semantic.border,
              borderRadius: '1px',
            }} />
          </div>
        );

      default:
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: designTokens.colors.semantic.text.secondary,
            fontSize: '12px',
            borderRadius: designTokens.borderRadius.sm,
          }}>
            {element.type}
          </div>
        );
    }
  };

  // Barre d'outils flottante
  const renderToolbar = () => {
    if (previewMode || (!isSelected && !isHovered)) return null;

    return (
      <div style={{
        position: 'absolute',
        top: '-40px',
        left: '0',
        display: 'flex',
        gap: '4px',
        backgroundColor: designTokens.colors.semantic.background,
        border: `1px solid ${designTokens.colors.semantic.border}`,
        borderRadius: designTokens.borderRadius.md,
        padding: '4px',
        boxShadow: designTokens.shadows.lg,
        zIndex: 1000,
      }}>
        <button
          onMouseDown={handleDragStart}
          style={{
            padding: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'grab',
            borderRadius: designTokens.borderRadius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Déplacer"
        >
          <Move size={14} />
        </button>

        <button
          onClick={handleDuplicate}
          style={{
            padding: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderRadius: designTokens.borderRadius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Dupliquer"
        >
          <Copy size={14} />
        </button>

        <button
          onClick={handleToggleVisibility}
          style={{
            padding: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderRadius: designTokens.borderRadius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: element.visible === false ? designTokens.colors.semantic.text.muted : 'inherit',
          }}
          title={element.visible === false ? 'Afficher' : 'Masquer'}
        >
          {element.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>

        <button
          onClick={handleToggleLock}
          style={{
            padding: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderRadius: designTokens.borderRadius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isLocked ? designTokens.colors.blocks.button : 'inherit',
          }}
          title={isLocked ? 'Déverrouiller' : 'Verrouiller'}
        >
          {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>

        <button
          onClick={handleDelete}
          style={{
            padding: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderRadius: designTokens.borderRadius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
          }}
          title="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  };

  // Menu contextuel
  const renderContextMenu = () => {
    if (!showContextMenu) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: contextMenuPosition.y,
          left: contextMenuPosition.x,
          backgroundColor: designTokens.colors.semantic.background,
          border: `1px solid ${designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.lg,
          boxShadow: designTokens.shadows.lg,
          padding: designTokens.spacing.sm,
          zIndex: 10000,
          minWidth: '180px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <button
            onClick={handleDuplicate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: designTokens.spacing.sm,
              padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: designTokens.borderRadius.sm,
              fontSize: designTokens.typography.sizes.sm,
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Copy size={14} />
            Dupliquer
          </button>

          <button
            onClick={handleToggleVisibility}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: designTokens.spacing.sm,
              padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: designTokens.borderRadius.sm,
              fontSize: designTokens.typography.sizes.sm,
              textAlign: 'left',
              width: '100%',
            }}
          >
            {element.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
            {element.visible === false ? 'Afficher' : 'Masquer'}
          </button>

          <button
            onClick={handleToggleLock}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: designTokens.spacing.sm,
              padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: designTokens.borderRadius.sm,
              fontSize: designTokens.typography.sizes.sm,
              textAlign: 'left',
              width: '100%',
            }}
          >
            {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
            {isLocked ? 'Déverrouiller' : 'Verrouiller'}
          </button>

          <div style={{
            height: '1px',
            backgroundColor: designTokens.colors.semantic.border,
            margin: `${designTokens.spacing.xs} 0`,
          }} />

          <button
            onClick={handleDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: designTokens.spacing.sm,
              padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: designTokens.borderRadius.sm,
              fontSize: designTokens.typography.sizes.sm,
              textAlign: 'left',
              width: '100%',
              color: '#ef4444',
            }}
          >
            <Trash2 size={14} />
            Supprimer
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={elementRef}
      style={elementStyle}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={containerStyle}>
        {renderToolbar()}
        {renderContent()}
        {renderContextMenu()}
      </div>
    </div>
  );
};
