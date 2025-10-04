import React, { useState } from 'react';
import { 
  Type, 
  Palette, 
  Layout, 
  Link, 
  Image,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  MoreHorizontal,
  Ruler
} from 'lucide-react';
import { designTokens, getTransition } from '../../../design-system/tokens';
import { EmailBlock, ButtonBlockContent } from '../../../types/emailEditor';

interface PropertiesPanelProps {
  selectedBlock?: EmailBlock;
  onElementUpdate?: (elementId: string, updates: Partial<EmailBlock>) => void;
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
    icon: <Ruler size={16} />,
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
  selectedBlock,
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
    if (selectedBlock && onElementUpdate) {
      onElementUpdate(selectedBlock.id, { [property]: value });
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    type: 'text' | 'number' | 'color' | 'url' = 'text',
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
          transition: getTransition("all", "base"),
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
          transition: getTransition("all", "base"),
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
          transition: getTransition("all", "base"),
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
          transition: getTransition("all", "base"),
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
          transition: getTransition("all", "base"),
          boxShadow: designTokens.shadows.sm,
        }} />
      </button>
    </div>
  );

  const renderContentSection = () => {
    if (!selectedBlock) return null;

    switch (selectedBlock.type) {
      case 'text':
        return (
          <>
            {renderTextarea(
              'Contenu du texte',
              selectedBlock.content?.text || '',
              (value) => handlePropertyChange('content', { ...selectedBlock.content, text: value }),
              'Saisissez votre texte ici...'
            )}
          </>
        );
      
      case 'heading':
        return (
          <>
            {renderInput(
              'Titre',
              selectedBlock.content?.text || '',
              (value) => handlePropertyChange('content', { ...selectedBlock.content, text: value }),
              'text',
              'Votre titre ici...'
            )}
            {renderSelect(
              'Niveau de titre',
              String(selectedBlock.content?.level) || 'h2',
              (value) => handlePropertyChange('content', { ...selectedBlock.content, level: value }),
              [
                { value: 'h1', label: 'Titre 1 (H1)' },
                { value: 'h2', label: 'Titre 2 (H2)' },
                { value: 'h3', label: 'Titre 3 (H3)' },
                { value: 'h4', label: 'Titre 4 (H4)' },
              ]
            )}
          </>
        );
      
      case 'button':
        const buttonContent = selectedBlock.content as ButtonBlockContent | undefined;
        const [buttonData, setButtonData] = useState<ButtonBlockContent>(() => {
          const oldData = selectedBlock?.content as ButtonBlockContent;
          return {
            text: oldData?.text || 'Cliquez ici',
            link: oldData?.link || '#',
            href: oldData?.href || '#',
            linkTarget: oldData?.linkTarget || '_self',
            target: oldData?.target || '_self',
            backgroundColor: oldData?.backgroundColor || '#007bff',
            color: oldData?.color || '#ffffff',
            fontSize: oldData?.fontSize || 16,
            fontFamily: oldData?.fontFamily || 'Arial, sans-serif',
            fontWeight: oldData?.fontWeight || 'bold',
            paddingVertical: oldData?.paddingVertical || 12,
            paddingHorizontal: oldData?.paddingHorizontal || 24,
            borderRadius: oldData?.borderRadius || 4,
            borderWidth: oldData?.borderWidth || 0,
            borderColor: oldData?.borderColor || 'transparent',
          };
        });

        // Update buttonData when selectedBlock.content changes
        React.useEffect(() => {
          if (selectedBlock?.content) {
            setButtonData(selectedBlock.content as ButtonBlockContent);
          }
        }, [selectedBlock?.content]);

        // Handle changes to buttonData and propagate them up
        React.useEffect(() => {
          if (selectedBlock && onElementUpdate) {
            onElementUpdate(selectedBlock.id, { content: buttonData });
          }
        }, [buttonData]);

        return (
          <>
            {renderInput(
              'Texte du bouton',
              buttonData.text,
              (value) => setButtonData(prev => ({ ...prev, text: value })),
              'text',
              'Cliquez ici'
            )}
            {renderInput(
              'Lien (URL)',
              buttonData.href,
              (value) => setButtonData(prev => ({ ...prev, href: value })),
              'url',
              'https://example.com'
            )}
            {renderInput(
              'Cible du lien',
              buttonData.linkTarget,
              (value) => setButtonData(prev => ({ ...prev, linkTarget: value })),
              'text',
              '_self, _blank, _parent, _top'
            )}
            {renderInput(
              'Couleur de fond',
              buttonData.backgroundColor,
              (value) => setButtonData(prev => ({ ...prev, backgroundColor: value })),
              'color'
            )}
            {renderInput(
              'Couleur du texte',
              buttonData.color,
              (value) => setButtonData(prev => ({ ...prev, color: value })),
              'color'
            )}
            {renderInput(
              'Taille de police',
              String(buttonData.fontSize),
              (value) => setButtonData(prev => ({ ...prev, fontSize: Number(value) })),
              'number'
            )}
            {renderInput(
              'Famille de police',
              buttonData.fontFamily,
              (value) => setButtonData(prev => ({ ...prev, fontFamily: value })),
              'text'
            )}
            {renderSelect(
              'Poids de police',
              buttonData.fontWeight,
              (value) => setButtonData(prev => ({ ...prev, fontWeight: value })),
              [
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Gras' },
                { value: 'bolder', label: 'Plus gras' },
                { value: 'lighter', label: 'Plus léger' },
              ]
            )}
            {renderInput(
              'Padding vertical',
              String(buttonData.paddingVertical),
              (value) => setButtonData(prev => ({ ...prev, paddingVertical: Number(value) })),
              'number'
            )}
            {renderInput(
              'Padding horizontal',
              String(buttonData.paddingHorizontal),
              (value) => setButtonData(prev => ({ ...prev, paddingHorizontal: Number(value) })),
              'number'
            )}
            {renderInput(
              'Rayon de la bordure',
              String(buttonData.borderRadius),
              (value) => setButtonData(prev => ({ ...prev, borderRadius: Number(value) })),
              'number'
            )}
            {renderInput(
              'Largeur de la bordure',
              String(buttonData.borderWidth),
              (value) => setButtonData(prev => ({ ...prev, borderWidth: Number(value) })),
              'number'
            )}
            {renderInput(
              'Couleur de la bordure',
              buttonData.borderColor,
              (value) => setButtonData(prev => ({ ...prev, borderColor: value })),
              'color'
            )}
          </>
        );
      
      case 'image':
        return (
          <>
            {renderInput(
              'URL de l\'image',
              selectedBlock.content?.src || '',
              (value) => handlePropertyChange('content', { ...selectedBlock.content, src: value }),
              'url',
              'https://example.com/image.jpg'
            )}
            {renderInput(
              'Texte alternatif',
              selectedBlock.content?.alt || '',
              (value) => handlePropertyChange('content', { ...selectedBlock.content, alt: value }),
              'text',
              'Description de l\'image'
            )}
            {renderInput(
              'Lien (optionnel)',
              selectedBlock.content?.href || '',
              (value) => handlePropertyChange('content', { ...selectedBlock.content, href: value }),
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
    if (!selectedBlock) return null;

    return (
      <>
        {renderInput(
          'Couleur du texte',
          selectedBlock.style?.color || '#000000',
          (value) => handlePropertyChange('style', { ...selectedBlock.style, color: value }),
          'color'
        )}
        {renderInput(
          'Couleur de fond',
          selectedBlock.style?.backgroundColor || '#ffffff',
          (value) => handlePropertyChange('style', { ...selectedBlock.style, backgroundColor: value }),
          'color'
        )}
        {renderSelect(
          'Taille de police',
          selectedBlock.style?.fontSize || '16px',
          (value) => handlePropertyChange('style', { ...selectedBlock.style, fontSize: value }),
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
          selectedBlock.style?.textAlign || 'left',
          (value) => handlePropertyChange('style', { ...selectedBlock.style, textAlign: value }),
          [
            { value: 'left', label: 'Gauche' },
            { value: 'center', label: 'Centre' },
            { value: 'right', label: 'Droite' },
            { value: 'justify', label: 'Justifié' },
          ]
        )}
        {renderToggle(
          'Texte en gras',
          selectedBlock.style?.fontWeight === 'bold',
          (value) => handlePropertyChange('style', { 
            ...selectedBlock.style, 
            fontWeight: value ? 'bold' : 'normal' 
          })
        )}
        {renderToggle(
          'Texte en italique',
          selectedBlock.style?.fontStyle === 'italic',
          (value) => handlePropertyChange('style', { 
            ...selectedBlock.style, 
            fontStyle: value ? 'italic' : 'normal' 
          })
        )}
      </>
    );
  };

  const renderLayoutSection = () => {
    if (!selectedBlock) return null;

    return (
      <>
        {renderInput(
          'Largeur',
          selectedBlock.layout?.width || 'auto',
          (value) => handlePropertyChange('layout', { ...selectedBlock.layout, width: value }),
          'text',
          'auto, 100%, 300px...'
        )}
        {renderInput(
          'Hauteur',
          selectedBlock.layout?.height || 'auto',
          (value) => handlePropertyChange('layout', { ...selectedBlock.layout, height: value }),
          'text',
          'auto, 200px...'
        )}
        {renderSelect(
          'Position',
          selectedBlock.layout?.position || 'relative',
          (value) => handlePropertyChange('layout', { ...selectedBlock.layout, position: value }),
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
    if (!selectedBlock) return null;

    return (
      <>
        {renderInput(
          'Marge extérieure (margin)',
          selectedBlock.spacing?.margin || '0',
          (value) => handlePropertyChange('spacing', { ...selectedBlock.spacing, margin: value }),
          'text',
          '0, 10px, 10px 20px...'
        )}
        {renderInput(
          'Marge intérieure (padding)',
          selectedBlock.spacing?.padding || '0',
          (value) => handlePropertyChange('spacing', { ...selectedBlock.spacing, padding: value }),
          'text',
          '0, 10px, 10px 20px...'
        )}
      </>
    );
  };

  const renderActionsSection = () => {
    if (!selectedBlock) return null;

    return (
      <>
        {renderToggle(
          'Cacher sur mobile',
          selectedBlock.responsive?.hiddenOnMobile || false,
          (value) => handlePropertyChange('responsive', { ...selectedBlock.responsive, hiddenOnMobile: value }),
          'Cache cet élément sur les écrans de petite taille.'
        )}
        {renderToggle(
          'Cacher sur ordinateur',
          selectedBlock.responsive?.hiddenOnDesktop || false,
          (value) => handlePropertyChange('responsive', { ...selectedBlock.responsive, hiddenOnDesktop: value }),
          'Cache cet élément sur les écrans de grande taille.'
        )}
      </>
    );
  };

  if (!selectedBlock) {
    return (
      <div className={className} style={{
        padding: designTokens.spacing.lg,
        backgroundColor: designTokens.colors.semantic.background,
        borderLeft: `1px solid ${designTokens.colors.semantic.border}`,
        color: designTokens.colors.semantic.text.secondary,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
        Sélectionnez un élément pour voir ses propriétés.
      </div>
    );
  }

  return (
    <div className={className} style={{
      backgroundColor: designTokens.colors.semantic.background,
      borderLeft: `1px solid ${designTokens.colors.semantic.border}`,
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: designTokens.spacing.lg,
        borderBottom: `1px solid ${designTokens.colors.semantic.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontSize: designTokens.typography.sizes.md,
            fontWeight: designTokens.typography.weights.bold,
            color: designTokens.colors.semantic.text.primary,
          }}>
            {selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1)}
          </div>
          <div style={{
            fontSize: designTokens.typography.sizes.xs,
            color: designTokens.colors.semantic.text.secondary,
            fontFamily: designTokens.typography.fonts.mono,
          }}>
            ID: {selectedBlock.id}
          </div>
        </div>
        <div style={{ display: 'flex', gap: designTokens.spacing.sm }}>
          <button title="Dupliquer" onClick={() => onElementDuplicate && onElementDuplicate(selectedBlock.id)} style={{ all: 'unset', cursor: 'pointer' }}><Copy size={16} /></button>
          <button title="Supprimer" onClick={() => onElementDelete && onElementDelete(selectedBlock.id)} style={{ all: 'unset', cursor: 'pointer' }}><Trash2 size={16} /></button>
          <button title="Plus" style={{ all: 'unset', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {propertySections.map(section => (
          <div key={section.id} style={{ borderBottom: `1px solid ${designTokens.colors.semantic.border}` }}>
            <button 
              onClick={() => toggleSection(section.id)} 
              style={{
                all: 'unset',
                width: '100%',
                padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: designTokens.typography.weights.medium,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.md }}>
                {section.icon}
                {section.title}
              </div>
              {expandedSections.has(section.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedSections.has(section.id) && (
              <div style={{ padding: `0 ${designTokens.spacing.lg} ${designTokens.spacing.lg}` }}>
                {section.id === 'content' && renderContentSection()}
                {section.id === 'style' && renderStyleSection()}
                {section.id === 'layout' && renderLayoutSection()}
                {section.id === 'spacing' && renderSpacingSection()}
                {section.id === 'actions' && renderActionsSection()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
