// Barre d'outils de l'éditeur d'emails
// Architecture définie par Claude 4.5 Sonnet

import React from 'react';
import { EditorElement } from '../types/editor.types';
import { Button } from '../../../components/ui/Button';
import {
  UndoIcon,
  RedoIcon,
  ZoomInIcon,
  ZoomOutIcon,
  CopyIcon,
  TrashIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
} from 'lucide-react';

interface EditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  selectedElement: EditorElement | null;
  className?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoom,
  onZoomChange,
  selectedElement,
  className = '',
}) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(2, zoom + 0.1));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(0.25, zoom - 0.1));
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  return (
    <div className={`editor-toolbar ${className}`} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e0e0e0',
      gap: '16px',
    }}>
      {/* Actions d'historique */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Annuler (Ctrl+Z)"
          className="flex items-center gap-1"
        >
          <UndoIcon size={14} />
          Annuler
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Refaire (Ctrl+Shift+Z)"
          className="flex items-center gap-1"
        >
          <RedoIcon size={14} />
          Refaire
        </Button>
      </div>

      {/* Actions sur l'élément sélectionné */}
      {selectedElement && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginRight: '8px',
            textTransform: 'capitalize',
          }}>
            {selectedElement.type} sélectionné
          </div>
          
          {selectedElement.type === 'TEXT' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                title="Aligner à gauche"
                className="p-1"
              >
                <AlignLeftIcon size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                title="Centrer"
                className="p-1"
              >
                <AlignCenterIcon size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                title="Aligner à droite"
                className="p-1"
              >
                <AlignRightIcon size={14} />
              </Button>
              <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd', margin: '0 4px' }} />
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            title="Dupliquer"
            className="p-1"
          >
            <CopyIcon size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Supprimer"
            className="p-1 text-red-600 hover:text-red-700"
          >
            <TrashIcon size={14} />
          </Button>
        </div>
      )}

      {/* Contrôles de zoom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          title="Zoom arrière (Ctrl+-)"
          className="p-1"
        >
          <ZoomOutIcon size={14} />
        </Button>
        
        <button
          onClick={handleZoomReset}
          style={{
            padding: '4px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            minWidth: '60px',
            color: '#333',
          }}
          title="Réinitialiser le zoom (Ctrl+0)"
        >
          {Math.round(zoom * 100)}%
        </button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 2}
          title="Zoom avant (Ctrl++)"
          className="p-1"
        >
          <ZoomInIcon size={14} />
        </Button>
      </div>

      {/* Raccourcis clavier */}
      <div style={{
        fontSize: '11px',
        color: '#999',
        display: 'flex',
        gap: '12px',
      }}>
        <span>Ctrl+S: Sauvegarder</span>
        <span>Ctrl+Z: Annuler</span>
        <span>Suppr: Effacer</span>
      </div>
    </div>
  );
};

// Styles CSS pour la barre d'outils
export const editorToolbarStyles = `
  .editor-toolbar {
    user-select: none;
    flex-shrink: 0;
  }

  .editor-toolbar button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .editor-toolbar button:not(:disabled):hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    .editor-toolbar {
      padding: 6px 12px;
      gap: 8px;
    }
    
    .editor-toolbar > div:last-child {
      display: none;
    }
    
    .editor-toolbar button {
      padding: 6px !important;
    }
  }

  @media (max-width: 480px) {
    .editor-toolbar {
      flex-wrap: wrap;
      padding: 4px 8px;
    }
    
    .editor-toolbar > div {
      gap: 2px;
    }
  }
`;
