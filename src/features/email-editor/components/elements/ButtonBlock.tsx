// Composant pour les éléments de bouton dans l'éditeur
// Architecture définie par Claude 4.5 Sonnet

import React, { useState } from 'react';
import { EditorElement, ButtonElementContent } from '../../types/editor.types';
import { useEmailEditor } from '../../hooks/useEmailEditor';
import { MousePointerClickIcon, ExternalLinkIcon } from 'lucide-react';

interface ButtonBlockProps {
  element: EditorElement;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [buttonData, setButtonData] = useState<ButtonElementContent>(() => {
    try {
      return JSON.parse(element.content);
    } catch {
      return { text: 'Cliquez ici', link: '#', target: '_self' };
    }
  });
  const { updateElement, selectedElement } = useEmailEditor();
  const isSelected = selectedElement?.id === element.id;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTextChange = (text: string) => {
    const newButtonData = { ...buttonData, text };
    setButtonData(newButtonData);
    updateElement(element.id, { content: JSON.stringify(newButtonData) });
  };

  const handleLinkChange = (link: string) => {
    const newButtonData = { ...buttonData, link };
    setButtonData(newButtonData);
    updateElement(element.id, { content: JSON.stringify(newButtonData) });
  };

  const handleTargetChange = (target: '_self' | '_blank') => {
    const newButtonData = { ...buttonData, target };
    setButtonData(newButtonData);
    updateElement(element.id, { content: JSON.stringify(newButtonData) });
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  };

  const buttonStyle = {
    display: 'inline-block',
    padding: element.styles.padding || '12px 24px',
    margin: element.styles.margin || '0',
    backgroundColor: element.styles.backgroundColor || '#007bff',
    color: element.styles.color || '#ffffff',
    border: element.styles.border || 'none',
    borderRadius: element.styles.borderRadius || '4px',
    fontSize: element.styles.fontSize || '16px',
    fontWeight: element.styles.fontWeight || '500',
    textAlign: element.styles.textAlign || 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '100px',
    lineHeight: '1.2',
  };

  // Mode édition
  if (isEditing) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            border: '2px dashed #007bff',
            borderRadius: '8px',
            minWidth: '250px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>
            Configuration du bouton
          </h4>

          {/* Texte du bouton */}
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
              Texte du bouton
            </label>
            <input
              type="text"
              value={buttonData.text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Texte du bouton"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </div>

          {/* Lien */}
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
              Lien de destination
            </label>
            <input
              type="url"
              value={buttonData.link}
              onChange={(e) => handleLinkChange(e.target.value)}
              placeholder="https://exemple.com"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </div>

          {/* Cible du lien */}
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
              Ouverture du lien
            </label>
            <select
              value={buttonData.target}
              onChange={(e) => handleTargetChange(e.target.value as '_self' | '_blank')}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              <option value="_self">Même onglet</option>
              <option value="_blank">Nouvel onglet</option>
            </select>
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
      <a
        href={buttonData.link}
        target={buttonData.target}
        rel={buttonData.target === '_blank' ? 'noopener noreferrer' : undefined}
        style={buttonStyle}
        onClick={(e) => {
          // Empêcher la navigation en mode édition
          if (isSelected) {
            e.preventDefault();
          }
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {buttonData.text || 'Bouton'}
      </a>

      {/* Indicateurs */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: 0,
            display: 'flex',
            gap: '4px',
          }}
        >
          {buttonData.target === '_blank' && (
            <div
              style={{
                fontSize: '10px',
                color: '#007bff',
                backgroundColor: 'white',
                padding: '2px 6px',
                borderRadius: '2px',
                border: '1px solid #007bff',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <ExternalLinkIcon size={8} />
              Nouvel onglet
            </div>
          )}
          <div
            style={{
              fontSize: '10px',
              color: '#007bff',
              backgroundColor: 'white',
              padding: '2px 6px',
              borderRadius: '2px',
              border: '1px solid #007bff',
            }}
          >
            Double-clic pour éditer
          </div>
        </div>
      )}

      {/* Aperçu du lien */}
      {isSelected && buttonData.link && buttonData.link !== '#' && (
        <div
          style={{
            position: 'absolute',
            bottom: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: '#666',
            backgroundColor: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            whiteSpace: 'nowrap',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          🔗 {buttonData.link}
        </div>
      )}
    </div>
  );
};
