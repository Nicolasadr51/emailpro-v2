// Composant pour les éléments de séparation dans l'éditeur
// Architecture définie par Claude 4.5 Sonnet

import React, { useState } from 'react';
import { EmailBlock, DividerBlockContent } from '../../../../types/emailEditor';
import { useEmailEditorStore } from '../../../../contexts/EmailEditorContext';
import { MinusIcon } from 'lucide-react';

interface DividerBlockProps {
  element: EmailBlock;
}

export const DividerBlock: React.FC<DividerBlockProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dividerData, setDividerData] = useState<DividerBlockContent>(() => {
    if (element.type === 'divider') {
      return element.content;
    }
    return { height: 1, color: '#cccccc', style: 'solid' };
  });
  const { actions, selectedBlock } = useEmailEditorStore(); const { updateBlock } = actions;
  const isSelected = selectedBlock?.id === element.id;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleThicknessChange = (thickness: number) => {
    const newDividerData = { ...dividerData, thickness };
    setDividerData(newDividerData);
    updateBlock(element.id, { content: JSON.stringify(newDividerData) });
  };

  const handleStyleChange = (style: 'solid' | 'dashed' | 'dotted') => {
    const newDividerData = { ...dividerData, style };
    setDividerData(newDividerData);
    updateBlock(element.id, { content: JSON.stringify(newDividerData) });
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    padding: element.styles.padding || '20px 0',
    margin: element.styles.margin || '0',
  };

  const dividerStyle = {
    width: element.styles.width || '100%',
    height: `${dividerData.thickness}px`,
    border: 'none',
    borderStyle: dividerData.style,
    borderWidth: dividerData.style !== 'solid' ? `${dividerData.thickness}px` : '0',
    borderColor: element.styles.backgroundColor || '#e0e0e0',
    backgroundColor: dividerData.style === 'solid' ? (element.styles.backgroundColor || '#e0e0e0') : 'transparent',
  };

  // Mode édition
  if (isEditing) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            padding: '16px',
            background: '#f8f9fa',
            border: '2px dashed #007bff',
            borderRadius: '8px',
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>
            Configuration du séparateur
          </h4>

          {/* Épaisseur */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#555',
              }}
            >
              Épaisseur: {dividerData.thickness}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={dividerData.thickness}
              onChange={(e) => handleThicknessChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '8px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666' }}>
              <span>1px</span>
              <span>10px</span>
            </div>
          </div>

          {/* Style */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#555',
              }}
            >
              Style de ligne
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => handleStyleChange(style)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: `2px solid ${dividerData.style === style ? '#007bff' : '#ddd'}`,
                    borderRadius: '4px',
                    backgroundColor: dividerData.style === style ? '#e3f2fd' : 'white',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '30px',
                      height: '2px',
                      borderStyle: style,
                      borderWidth: style !== 'solid' ? '1px' : '0',
                      borderColor: '#333',
                      backgroundColor: style === 'solid' ? '#333' : 'transparent',
                    }}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{style}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aperçu */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#555',
              }}
            >
              Aperçu
            </label>
            <div
              style={{
                padding: '16px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: `${dividerData.thickness}px`,
                  backgroundColor: dividerData.style === 'solid' ? '#e0e0e0' : 'transparent',
                  borderStyle: dividerData.style,
                  borderWidth: dividerData.style !== 'solid' ? `${dividerData.thickness}px` : '0',
                  borderColor: '#e0e0e0',
                }}
              />
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Valider
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Affichage normal
  return (
    <div style={containerStyle} onDoubleClick={handleDoubleClick}>
      <div style={dividerStyle} />

      {/* Indicateur de sélection */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: 0,
            fontSize: '10px',
            color: '#007bff',
            backgroundColor: 'white',
            padding: '2px 6px',
            borderRadius: '2px',
            border: '1px solid #007bff',
            whiteSpace: 'nowrap',
          }}
        >
          Double-clic pour éditer
        </div>
      )}

      {/* Placeholder quand pas de contenu visible */}
      {!isSelected && dividerData.thickness < 1 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#999',
            fontSize: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px dashed #ccc',
          }}
        >
          <MinusIcon size={12} />
          Séparateur
        </div>
      )}
    </div>
  );
};
