// Composant pour les éléments d'image dans l'éditeur
// Architecture définie par Claude 4.5 Sonnet

import React, { useState } from 'react';
import { EditorElement, ImageElementContent } from '../../types/editor.types';
import { useEmailEditorStore } from '../hooks/useEmailEditor';
import { ImageIcon, LinkIcon, UploadIcon } from 'lucide-react';

interface ImageBlockProps {
  element: EditorElement;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageData, setImageData] = useState<ImageElementContent>(() => {
    try {
      return JSON.parse(element.content);
    } catch {
      return { src: '', alt: '' };
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updateElement, selectedElement } = useEmailEditorStore();
  const isSelected = selectedElement?.id === element.id;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Simuler l'upload d'image (à remplacer par un vrai service)
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImageData = {
          ...imageData,
          src: event.target?.result as string,
          alt: file.name,
        };
        setImageData(newImageData);
        updateElement(element.id, { content: JSON.stringify(newImageData) });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setIsLoading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    const newImageData = { ...imageData, src: url };
    setImageData(newImageData);
    updateElement(element.id, { content: JSON.stringify(newImageData) });
  };

  const handleAltChange = (alt: string) => {
    const newImageData = { ...imageData, alt };
    setImageData(newImageData);
    updateElement(element.id, { content: JSON.stringify(newImageData) });
  };

  const handleLinkChange = (link: string) => {
    const newImageData = { ...imageData, link };
    setImageData(newImageData);
    updateElement(element.id, { content: JSON.stringify(newImageData) });
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '100px',
    position: 'relative' as const,
    backgroundColor: element.styles.backgroundColor || 'transparent',
    borderRadius: element.styles.borderRadius || '0',
    border: element.styles.border || 'none',
    padding: element.styles.padding || '0',
    margin: element.styles.margin || '0',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
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
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>
            Configuration de l'image
          </h4>

          {/* Upload de fichier */}
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
              Télécharger une image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </div>

          {/* URL de l'image */}
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
              Ou URL de l'image
            </label>
            <input
              type="url"
              value={imageData.src}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://exemple.com/image.jpg"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </div>

          {/* Texte alternatif */}
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
              Texte alternatif
            </label>
            <input
              type="text"
              value={imageData.alt}
              onChange={(e) => handleAltChange(e.target.value)}
              placeholder="Description de l'image"
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
              Lien (optionnel)
            </label>
            <input
              type="url"
              value={imageData.link || ''}
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

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
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
  const content = imageData.src ? (
    <img
      src={imageData.src}
      alt={imageData.alt}
      style={imageStyle}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  ) : (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        border: '2px dashed #dee2e6',
        borderRadius: '8px',
        color: '#6c757d',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <ImageIcon size={32} style={{ marginBottom: '8px' }} />
      <div style={{ fontSize: '14px', fontWeight: '500' }}>Image</div>
      <div style={{ fontSize: '12px', marginTop: '4px' }}>
        Double-cliquez pour configurer
      </div>
    </div>
  );

  return (
    <div style={containerStyle} onDoubleClick={handleDoubleClick}>
      {imageData.link ? (
        <a href={imageData.link} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        content
      )}

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
          {imageData.link && (
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
              <LinkIcon size={8} />
              Lien
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

      {/* Indicateur de chargement */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <UploadIcon size={24} className="animate-spin" />
          <div style={{ fontSize: '12px', color: '#666' }}>Chargement...</div>
        </div>
      )}
    </div>
  );
};
