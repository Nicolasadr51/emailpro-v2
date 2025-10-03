// Panneau des propriétés pour l'éditeur d'emails
// Architecture définie par Claude 4.5 Sonnet

import React from 'react';
import { EmailTemplate, EditorBlock } from '../types/editor.types';

import { SettingsIcon, PaletteIcon, LayoutIcon } from 'lucide-react';

interface PropertiesPanelProps {
  selectedBlockId: string | null;
  onUpdate: (blockId: string, updates: Partial<EditorBlock>) => void;
  template: EmailTemplate | null;
  className?: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlockId,
  onUpdate,
  template,
  className = 
}) => {
  const selectedBlock = template?.blocks.find(block => block.id === selectedBlockId);

  const handleStyleChange = (property: string, value: string) => {
    if (!selectedBlock) return;
    onUpdate(selectedBlock.id, {
      styles: {
        ...selectedBlock.styles,
        [property]: value,
      },
    });
  };

  const handlePositionChange = (property: 'x' | 'y', value: number) => {
    if (!selectedBlock) return;
    onUpdate(selectedBlock.id, {
      position: {
        ...selectedBlock.position,
        [property]: value,
      },
    });
  };



  return (
    <div className={`properties-panel ${className}`} style={{
      width: '280px',
      backgroundColor: 'white',
      borderLeft: '1px solid #e0e0e0',
      height: '100%',
      overflow: 'auto',
      flexShrink: 0,
    }}>
      {/* En-tête */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <SettingsIcon size={16} />
          Propriétés
        </h3>
      </div>

      {selectedBlock ? (
        <div>
          {/* Informations de l'élément */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              textTransform: 'capitalize',
            }}>
              Élément {selectedBlock.type}
            </h4>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ID: {selectedBlock.id.slice(-8)}
            </div>
          </div>

          {/* Position */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <LayoutIcon size={14} />
              Position
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#555',
                }}>
                  X (px)
                </label>
                <input
                  type="number"
                  value={selectedBlock.position.x}
                  onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#555',
                }}>
                  Y (px)
                </label>
                <input
                  type="number"
                  value={selectedBlock.position.y}
                  onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Styles */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <PaletteIcon size={14} />
              Apparence
            </h4>

            {/* Couleurs */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#555',
                  }}>
                    Couleur du texte
                  </label>
                  <input
                    type="color"
                    value={selectedBlock.styles.color || '#333333'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    style={{
                      width: '100%',
                      height: '32px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#555',
                  }}>
                    Arrière-plan
                  </label>
                  <input
                    type="color"
                    value={selectedBlock.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    style={{
                      width: '100%',
                      height: '32px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Typographie */}
            {selectedBlock.type === 'TEXT' && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#555',
                  }}>
                    Taille de police
                  </label>
                  <input
                    type="text"
                    value={selectedBlock.styles.fontSize || '16px'}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="16px"
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#555',
                  }}>
                    Alignement
                  </label>
                  <select
                    value={selectedBlock.styles.textAlign || 'left'}
                    onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    <option value="left">Gauche</option>
                    <option value="center">Centre</option>
                    <option value="right">Droite</option>
                  </select>
                </div>
              </div>
            )}

            {/* Espacement */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#555',
                  }}>
                    Padding
                  </label>
                  <input
                    type="text"
                    value={selectedBlock.styles.padding || '10px'}
                    onChange={(e) => handleStyleChange('padding', e.target.value)}
                    placeholder="10px"
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#555',
                  }}>
                    Margin
                  </label>
                  <input
                    type="text"
                    value={selectedBlock.styles.margin || '5px'}
                    onChange={(e) => handleStyleChange('margin', e.target.value)}
                    placeholder="5px"
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#666',
        }}>
          <SettingsIcon size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
          <p style={{ margin: 0, fontSize: '14px' }}>
            Sélectionnez un élément pour voir ses propriétés
          </p>
        </div>
      )}

      {/* Propriétés du template */}
      {template && (
        <div style={{ padding: '16px', borderTop: '1px solid #e0e0e0' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
          }}>
            Template
          </h4>
          <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
            <div>Largeur: {template.layout.width}px</div>
            <div>Hauteur: {template.layout.height}px</div>
            <div>Éléments: {template.elements.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};
