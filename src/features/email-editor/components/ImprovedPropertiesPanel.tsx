import React, { useState } from 'react';
import { 
  Type, 
  Palette, 
  Layout, 
  Spacing, 
  Link, 
  Image,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { designTokens } from '../../../design-system/tokens';
import { EditorElement } from '../types/editor.types';

interface PropertiesPanelProps {
  selectedElement?: EditorElement;
  onElementUpdate?: (elementId: string, updates: Partial<EditorElement>) => void;
  onElementDelete?: (elementId: string) => void;
  onElementDuplicate?: (elementId: string) => void;
  className?: string;
}

interface PropertySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  defaultExpanded: boolean;
}

const propertySections: PropertySection[] = [
  {
    id: 'content',
    title: 'Contenu',
    icon: <Type size={16} />,
    defaultExpanded: true,
  },
  {
    id: 'style',
    title: 'Style',
    icon: <Palette size={16} />,
    defaultExpanded: true,
  },
  {
    id: 'layout',
    title: 'Disposition',
    icon: <Layout size={16} />,
    defaultExpanded: false,
  },
  {
    id: 'spacing',
    title: 'Espacement',
    icon: <Spacing size={16} />,
    defaultExpanded: false,
  },
  {
    id: 'actions',
    title: 'Actions',
    icon: <Link size={16} />,
    defaultExpanded: false,
  },
];

export const ImprovedPropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onElementUpdate,
  onElementDelete,
  onElementDuplicate,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(propertySections.filter(s => s.defaultExpanded).map(s => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedElement && onElementUpdate) {
      onElementUpdate(selectedElement.id, { [property]: value });
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    type: 'TEXT' | 'number' | 'color' | 'url' = 'TEXT',
    placeholder?: string
  ) => (
    <div style={{ marginBottom: designTokens.spacing.md }}>
      <label style={{
        display: 'block',
        fontSize: designTokens.typography.sizes.sm,
        fontWeight: designTokens.typography.weights.medium,
        color: designTokens.colors.semantic.text.primary,
        marginBottom: designTokens.spacing.xs,
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
          border: `1px solid ${designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.md,
          fontSize: designTokens.typography.sizes.sm,
          backgroundColor: designTokens.colors.semantic.background,
          outline: 'none',
          transition: designTokens.transitions.base,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = designTokens.colors.states.focus;
          e.target.style.boxShadow = `0 0 0 3px ${designTokens.colors.states.focus}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = designTokens.colors.semantic.border;
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );

  const renderTextarea = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    placeholder?: string,
    rows: number = 3
  ) => (
    <div style={{ marginBottom: designTokens.spacing.md }}>
      <label style={{
        display: 'block',
        fontSize: designTokens.typography.sizes.sm,
        fontWeight: designTokens.typography.weights.medium,
        color: designTokens.colors.semantic.text.primary,
        marginBottom: designTokens.spacing.xs,
      }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
          border: `1px solid ${designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.md,
          fontSize: designTokens.typography.sizes.sm,
          backgroundColor: designTokens.colors.semantic.background,
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          transition: designTokens.transitions.base,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = designTokens.colors.states.focus;
          e.target.style.boxShadow = `0 0 0 3px ${designTokens.colors.states.focus}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = designTokens.colors.semantic.border;
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );

  const renderSelect = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: { value: string; label: string }[]
  ) => (
    <div style={{ marginBottom: designTokens.spacing.md }}>
      <label style={{
        display: 'block',
        fontSize: designTokens.typography.sizes.sm,
        fontWeight: designTokens.typography.weights.medium,
        color: designTokens.colors.semantic.text.primary,
        marginBottom: designTokens.spacing.xs,
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
          border: `1px solid ${designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.md,
          fontSize: designTokens.typography.sizes.sm,
          backgroundColor: designTokens.colors.semantic.background,
          outline: 'none',
          cursor: 'pointer',
          transition: designTokens.transitions.base,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = designTokens.colors.states.focus;
          e.target.style.boxShadow = `0 0 0 3px ${designTokens.colors.states.focus}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = designTokens.colors.semantic.border;
          e.target.style.boxShadow = 'none';
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderToggle = (
    label: string,
    value: boolean,
    onChange: (value: boolean) => void,
    description?: string
  ) => (
    <div style={{ 
      marginBottom: designTokens.spacing.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: designTokens.typography.sizes.sm,
          fontWeight: designTokens.typography.weights.medium,
          color: designTokens.colors.semantic.text.primary,
          marginBottom: description ? designTokens.spacing.xs : 0,
        }}>
          {label}
        </div>
        {description && (
          <div style={{
            fontSize: designTokens.typography.sizes.xs,
            color: designTokens.colors.semantic.text.secondary,
          }}>
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: value ? designTokens.colors.states.focus : designTokens.colors.semantic.border,
          position: 'relative',
          cursor: 'pointer',
          transition: designTokens.transitions.base,
          marginLeft: designTokens.spacing.md,
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'white',
          position: 'absolute',
          top: '2px',
          left: value ? '22px' : '2px',
          transition: designTokens.transitions.base,
          boxShadow: designTokens.shadows.sm,
        }} />
      </button>
    </div>
  );

  const renderContentSection = () => {
    if (!selectedElement) return null;

    switch (selectedElement.type) {
      case 'TEXT':
        return (
          <>
            {renderTextarea(
              'Contenu du texte',
              selectedElement.content?.text || '',
              (value) => handlePropertyChange('content', { ...selectedElement.content, text: value }),
              'Saisissez votre texte ici...'
            )}
          </>
        );
      
      case 'HEADING':
        return (
          <>
            {renderInput(
              'Titre',
              selectedElement.content?.text || '',
              (value) => handlePropertyChange('content', { ...selectedElement.content, text: value }),
              'text',
              'Votre titre ici...'
            )}
            {renderSelect(
              'Niveau de titre',
              selectedElement.content?.level || 'h2',
              (value) => handlePropertyChange('content', { ...selectedElement.content, level: value }),
              [
                { value: 'h1', label: 'Titre 1 (H1)' },
                { value: 'h2', label: 'Titre 2 (H2)' },
                { value: 'h3', label: 'Titre 3 (H3)' },
                { value: 'h4', label: 'Titre 4 (H4)' },
              ]
            )}
          </>
        );
      
      case 'BUTTON':
        return (
          <>
            {renderInput(
              'Texte du bouton',
              selectedElement.content?.text || '',
              (value) => handlePropertyChange('content', { ...selectedElement.content, text: value }),
              'text',
              'Cliquez ici'
            )}
            {renderInput(
              'Lien (URL)',
              selectedElement.content?.href || '',
              (value) => handlePropertyChange('content', { ...selectedElement.content, href: value }),
              'url',
              'https://example.com'
            )}
          </>
        );
      
      case 'IMAGE':
        return (
          <>
            {renderInput(
              'URL de l\'image',
              selectedElement.content?.src || '',
              (value) => handlePropertyChange('content', { ...selectedElement.content, src: value }),
              'url',
              'https://example.com/image.jpg'
            )}
            {renderInput(
              'Texte alternatif',
              selectedElement.content?.alt || '',
              (value) => handlePropertyChange('content', { ...selectedElement.content, alt: value }),
              'text',
              'Description de l\'image'
            )}
            {renderInput(
              'Lien (optionnel)',
              selectedElement.content?.href || '',
              (value) => handlePropertyChange('content', { ...selectedElement.content, href: value }),
              'url',
              'https://example.com'
            )}
          </>
        );
      
      default:
        return (
          <div style={{
            padding: designTokens.spacing.md,
            backgroundColor: designTokens.colors.states.hover,
            borderRadius: designTokens.borderRadius.md,
            textAlign: 'center',
            color: designTokens.colors.semantic.text.secondary,
            fontSize: designTokens.typography.sizes.sm,
          }}>
            Aucune propriété de contenu disponible pour ce type d'élément.
          </div>
        );
    }
  };

  const renderStyleSection = () => {
    if (!selectedElement) return null;

    return (
      <>
        {renderInput(
          'Couleur du texte',
          selectedElement.style?.color || '#000000',
          (value) => handlePropertyChange('style', { ...selectedElement.style, color: value }),
          'color'
        )}
        {renderInput(
          'Couleur de fond',
          selectedElement.style?.backgroundColor || '#ffffff',
          (value) => handlePropertyChange('style', { ...selectedElement.style, backgroundColor: value }),
          'color'
        )}
        {renderSelect(
          'Taille de police',
          selectedElement.style?.fontSize || '16px',
          (value) => handlePropertyChange('style', { ...selectedElement.style, fontSize: value }),
          [
            { value: '12px', label: 'Très petit (12px)' },
            { value: '14px', label: 'Petit (14px)' },
            { value: '16px', label: 'Normal (16px)' },
            { value: '18px', label: 'Grand (18px)' },
            { value: '24px', label: 'Très grand (24px)' },
            { value: '32px', label: 'Énorme (32px)' },
          ]
        )}
        {renderSelect(
          'Alignement du texte',
          selectedElement.style?.textAlign || 'left',
          (value) => handlePropertyChange('style', { ...selectedElement.style, textAlign: value }),
          [
            { value: 'left', label: 'Gauche' },
            { value: 'center', label: 'Centre' },
            { value: 'right', label: 'Droite' },
            { value: 'justify', label: 'Justifié' },
          ]
        )}
        {renderToggle(
          'Texte en gras',
          selectedElement.style?.fontWeight === 'bold',
          (value) => handlePropertyChange('style', { 
            ...selectedElement.style, 
            fontWeight: value ? 'bold' : 'normal' 
          })
        )}
        {renderToggle(
          'Texte en italique',
          selectedElement.style?.fontStyle === 'italic',
          (value) => handlePropertyChange('style', { 
            ...selectedElement.style, 
            fontStyle: value ? 'italic' : 'normal' 
          })
        )}
      </>
    );
  };

  const renderLayoutSection = () => {
    if (!selectedElement) return null;

    return (
      <>
        {renderInput(
          'Largeur',
          selectedElement.layout?.width || 'auto',
          (value) => handlePropertyChange('layout', { ...selectedElement.layout, width: value }),
          'text',
          'auto, 100%, 300px...'
        )}
        {renderInput(
          'Hauteur',
          selectedElement.layout?.height || 'auto',
          (value) => handlePropertyChange('layout', { ...selectedElement.layout, height: value }),
          'text',
          'auto, 200px...'
        )}
        {renderSelect(
          'Position',
          selectedElement.layout?.position || 'relative',
          (value) => handlePropertyChange('layout', { ...selectedElement.layout, position: value }),
          [
            { value: 'relative', label: 'Relative' },
            { value: 'absolute', label: 'Absolue' },
            { value: 'fixed', label: 'Fixe' },
          ]
        )}
      </>
    );
  };

  const renderSpacingSection = () => {
    if (!selectedElement) return null;

    return (
      <>
        {renderInput(
          'Marge extérieure (margin)',
          selectedElement.spacing?.margin || '0',
          (value) => handlePropertyChange('spacing', { ...selectedElement.spacing, margin: value }),
          'text',
          '10px, 10px 20px...'
        )}
        {renderInput(
          'Marge intérieure (padding)',
          selectedElement.spacing?.padding || '0',
          (value) => handlePropertyChange('spacing', { ...selectedElement.spacing, padding: value }),
          'text',
          '10px, 10px 20px...'
        )}
      </>
    );
  };

  const renderActionsSection = () => {
    if (!selectedElement) return null;

    return (
      <>
        {renderToggle(
          'Visible',
          selectedElement.visible !== false,
          (value) => handlePropertyChange('visible', value),
          'Afficher ou masquer cet élément'
        )}
        {renderInput(
          'ID personnalisé',
          selectedElement.customId || '',
          (value) => handlePropertyChange('customId', value),
          'text',
          'mon-element-unique'
        )}
        {renderInput(
          'Classes CSS',
          selectedElement.cssClasses || '',
          (value) => handlePropertyChange('cssClasses', value),
          'text',
          'ma-classe autre-classe'
        )}
      </>
    );
  };

  const renderSection = (section: PropertySection) => {
    const isExpanded = expandedSections.has(section.id);
    
    return (
      <div key={section.id} style={{ marginBottom: designTokens.spacing.md }}>
        <button
          onClick={() => toggleSection(section.id)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: designTokens.spacing.sm,
            padding: `${designTokens.spacing.sm} 0`,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: designTokens.typography.sizes.base,
            fontWeight: designTokens.typography.weights.semibold,
            color: designTokens.colors.semantic.text.primary,
            transition: designTokens.transitions.base,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = designTokens.colors.states.focus;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = designTokens.colors.semantic.text.primary;
          }}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {section.icon}
          {section.title}
        </button>

        {isExpanded && (
          <div style={{ 
            marginTop: designTokens.spacing.md,
            paddingLeft: designTokens.spacing.lg,
          }}>
            {section.id === 'content' && renderContentSection()}
            {section.id === 'style' && renderStyleSection()}
            {section.id === 'layout' && renderLayoutSection()}
            {section.id === 'spacing' && renderSpacingSection()}
            {section.id === 'actions' && renderActionsSection()}
          </div>
        )}
      </div>
    );
  };

  if (!selectedElement) {
    return (
      <div 
        className={className}
        style={{
          width: 320,
          height: '100%',
          backgroundColor: designTokens.colors.semantic.background,
          borderLeft: `1px solid ${designTokens.colors.semantic.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: designTokens.spacing.xl,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: designTokens.spacing.md,
            opacity: 0.3,
          }}>
            🎨
          </div>
          <div style={{
            fontSize: designTokens.typography.sizes.lg,
            fontWeight: designTokens.typography.weights.medium,
            color: designTokens.colors.semantic.text.primary,
            marginBottom: designTokens.spacing.sm,
          }}>
            Aucun élément sélectionné
          </div>
          <div style={{
            fontSize: designTokens.typography.sizes.sm,
            color: designTokens.colors.semantic.text.secondary,
            lineHeight: 1.5,
          }}>
            Cliquez sur un élément dans le canvas pour modifier ses propriétés
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={className}
      style={{
        width: 320,
        height: '100%',
        backgroundColor: designTokens.colors.semantic.background,
        borderLeft: `1px solid ${designTokens.colors.semantic.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: designTokens.spacing.lg,
        borderBottom: `1px solid ${designTokens.colors.semantic.border}`,
        backgroundColor: designTokens.colors.semantic.background,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: designTokens.spacing.sm,
        }}>
          <h3 style={{
            margin: 0,
            fontSize: designTokens.typography.sizes.lg,
            fontWeight: designTokens.typography.weights.semibold,
            color: designTokens.colors.semantic.text.primary,
          }}>
            Propriétés
          </h3>
          
          <div style={{ display: 'flex', gap: designTokens.spacing.xs }}>
            <button
              onClick={() => onElementDuplicate?.(selectedElement.id)}
              style={{
                padding: designTokens.spacing.xs,
                border: `1px solid ${designTokens.colors.semantic.border}`,
                borderRadius: designTokens.borderRadius.sm,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Dupliquer"
            >
              <Copy size={14} />
            </button>
            
            <button
              onClick={() => onElementDelete?.(selectedElement.id)}
              style={{
                padding: designTokens.spacing.xs,
                border: `1px solid ${designTokens.colors.semantic.border}`,
                borderRadius: designTokens.borderRadius.sm,
                backgroundColor: 'transparent',
                cursor: 'pointer',
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
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: designTokens.spacing.sm,
          padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
          backgroundColor: designTokens.colors.states.hover,
          borderRadius: designTokens.borderRadius.md,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: designTokens.colors.blocks[selectedElement.type as keyof typeof designTokens.colors.blocks] || designTokens.colors.semantic.text.secondary,
          }} />
          <span style={{
            fontSize: designTokens.typography.sizes.sm,
            fontWeight: designTokens.typography.weights.medium,
            color: designTokens.colors.semantic.text.primary,
          }}>
            {selectedElement.type}
          </span>
          <span style={{
            fontSize: designTokens.typography.sizes.xs,
            color: designTokens.colors.semantic.text.secondary,
          }}>
            #{selectedElement.id.slice(-6)}
          </span>
        </div>
      </div>

      {/* Properties */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: designTokens.spacing.lg,
      }}>
        {propertySections.map(renderSection)}
      </div>
    </div>
  );
};
