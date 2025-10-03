// Panneau des éléments disponibles pour l'éditeur
// Architecture définie par Claude 4.5 Sonnet

import React from 'react';
import { BlockType } from '../../../types/emailEditor';
import { usePaletteElement } from '../hooks/useDragDrop';
import { TypeIcon, ImageIcon, MousePointerClickIcon, MinusIcon } from 'lucide-react';

interface ElementsPanelProps {
  className?: string;
}

interface ElementItem {
  type: BlockType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const elementItems: ElementItem[] = [
  {
    type: 'text',
    name: 'Texte',
    description: 'Ajouter du texte formaté',
    icon: <TypeIcon size={20} />,
    color: '#4CAF50',
  },
  {
    type: 'image',
    name: 'Image',
    description: 'Insérer une image',
    icon: <ImageIcon size={20} />,
    color: '#2196F3',
  },
  {
    type: 'button',
    name: 'Bouton',
    description: 'Bouton d\'action cliquable',
    icon: <MousePointerClickIcon size={20} />,
    color: '#FF9800',
  },
  {
    type: 'divider',
    name: 'Séparateur',
    description: 'Ligne de séparation',
    icon: <MinusIcon size={20} />,
    color: '#9E9E9E',
  },
];

const ElementCard: React.FC<{ item: ElementItem }> = ({ item }) => {
  const draggableProps = usePaletteElement(item.type);

  return (
    <div
      className="element-card"
      style={{
        padding: '12px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        cursor: 'grab',
        transition: 'all 0.2s ease',
        backgroundColor: 'white',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        minHeight: '80px',
        justifyContent: 'center',
      }}
      {...draggableProps}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = item.color;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e0e0e0';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          color: item.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.icon}
      </div>
      <div
        style={{
          fontSize: '12px',
          fontWeight: '500',
          color: '#333',
          textAlign: 'center',
        }}
      >
        {item.name}
      </div>
    </div>
  );
};

export const ElementsPanel: React.FC<ElementsPanelProps> = ({ className = '' }) => {
  return (
    <div className={`elements-panel ${className}`}>
      {/* En-tête du panneau */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          Éléments
        </h3>
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#666',
          }}
        >
          Glissez-déposez pour ajouter
        </p>
      </div>

      {/* Grille des éléments */}
      <div
        style={{
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}
      >
        {elementItems.map((item) => (
          <ElementCard key={item.type} item={item} />
        ))}
      </div>

      {/* Section des blocs avancés */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <h4
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          Blocs avancés
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '8px',
          }}
        >
          {/* Placeholder pour futurs éléments avancés */}
          <div
            style={{
              padding: '12px',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#999',
              fontSize: '12px',
            }}
          >
            Bientôt disponible
          </div>
        </div>
      </div>

      {/* Instructions d'utilisation */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.4',
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: '500' }}>
            💡 Conseils :
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            <li>Glissez un élément sur le canvas</li>
            <li>Cliquez pour sélectionner</li>
            <li>Utilisez les poignées pour redimensionner</li>
            <li>Double-cliquez pour éditer</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Styles CSS pour le panneau des éléments
export const elementsPanelStyles = `
  .elements-panel {
    width: 250px;
    background: white;
    border-right: 1px solid #e0e0e0;
    height: 100%;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .element-card {
    position: relative;
  }

  .element-card:active {
    cursor: grabbing !important;
    transform: scale(0.95) !important;
  }

  .element-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 49%, rgba(0, 0, 0, 0.05) 50%, transparent 51%);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  .element-card:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    .elements-panel {
      width: 200px;
    }
    
    .elements-panel .element-card {
      min-height: 60px;
      padding: 8px;
    }
    
    .elements-panel h3 {
      font-size: 14px;
    }
    
    .elements-panel p {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    .elements-panel {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .elements-panel > div:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .elements-panel > div:nth-child(2) {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
  }
`;
