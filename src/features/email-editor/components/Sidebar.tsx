import React, { useState } from 'react';
import { 
  Image, 
  Type, 
  AlignLeft, 
  MousePointer, 
  Minus,
  Share2,
  Box,
  Layout,
  FileText,
  ChevronDown,
  ChevronRight,
  Search,
  Star,
  Clock
} from 'lucide-react';
import { designTokens } from '../../../design-system/tokens';
import { BlockIcon } from '../../../design-system/components/BlockIcon';
import { DraggableCard } from '../../../design-system/components/DraggableCard';
import { LayoutPreview } from '../../../design-system/components/LayoutPreview';

interface SidebarSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  defaultExpanded: boolean;
  badge?: string;
}

const sections: SidebarSection[] = [
  {
    id: 'content-blocks',
    title: 'Blocs de contenu',
    icon: <Box size={18} />,
    description: 'Faites glisser pour ajouter du contenu',
    defaultExpanded: true,
    badge: '7',
  },
  {
    id: 'layouts',
    title: 'Mises en page',
    icon: <Layout size={18} />,
    description: 'Structures de colonnes prédéfinies',
    defaultExpanded: false,
    badge: '5',
  },
  {
    id: 'templates',
    title: 'Templates prédéfinis',
    icon: <FileText size={18} />,
    description: 'Modèles complets prêts à l\'emploi',
    defaultExpanded: false,
    badge: '12',
  },
];

const contentBlocks = [
  {
    type: 'image' as const,
    icon: <BlockIcon icon={Image} color="IMAGE" />,
    title: 'Image',
    description: 'Ajoutez une image ou un logo',
    popular: true,
  },
  {
    type: 'heading' as const,
    icon: <BlockIcon icon={Type} color="HEADING" />,
    title: 'Titre',
    description: 'Titre principal ou sous-titre',
    popular: true,
  },
  {
    type: 'text' as const,
    icon: <BlockIcon icon={AlignLeft} color="TEXT" />,
    title: 'Paragraphe',
    description: 'Bloc de texte formaté',
    popular: true,
  },
  {
    type: 'button' as const,
    icon: <BlockIcon icon={MousePointer} color="BUTTON" />,
    title: 'Bouton',
    description: 'Call-to-action cliquable',
    popular: true,
  },
  {
    type: 'divider' as const,
    icon: <BlockIcon icon={Minus} color="DIVIDER" />,
    title: 'Séparateur',
    description: 'Ligne de séparation',
    popular: false,
  },
  {
    type: 'social' as const,
    icon: <BlockIcon icon={Share2} color="SOCIAL" />,
    title: 'Réseaux sociaux',
    description: 'Icônes de réseaux sociaux',
    popular: false,
  },
  {
    type: 'spacer' as const,
    icon: <BlockIcon icon={Box} color="SPACER" />,
    title: 'Espacement',
    description: 'Espace vertical ajustable',
    popular: false,
  },
];

const layoutBlocks = [
  {
    type: 'layout' as const,
    columns: 1 as const,
    icon: <LayoutPreview columns={1} size="sm" />,
    title: '1 colonne',
    description: 'Largeur pleine',
    popular: true,
  },
  {
    type: 'layout' as const,
    columns: 2 as const,
    icon: <LayoutPreview columns={2} size="sm" />,
    title: '2 colonnes',
    description: 'Répartition 50/50',
    popular: true,
  },
  {
    type: 'layout' as const,
    columns: 3 as const,
    icon: <LayoutPreview columns={3} size="sm" />,
    title: '3 colonnes',
    description: 'Répartition égale',
    popular: false,
  },
  {
    type: 'layout' as const,
    columns: 2 as const,
    ratio: '2:1' as const,
    icon: <LayoutPreview columns={2} ratio="2:1" size="sm" />,
    title: '2 colonnes (2:1)',
    description: 'Colonne large à gauche',
    popular: false,
  },
  {
    type: 'layout' as const,
    columns: 2 as const,
    ratio: '1:2' as const,
    icon: <LayoutPreview columns={2} ratio="1:2" size="sm" />,
    title: '2 colonnes (1:2)',
    description: 'Colonne large à droite',
    popular: false,
  },
];

const templateBlocks = [
  {
    type: 'template' as const,
    id: 'hero-cta',
    icon: <div style={{ 
      width: 40, 
      height: 40, 
      backgroundColor: `${designTokens.colors.blocks.BUTTON}15`,
      borderRadius: designTokens.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    }}>🎯</div>,
    title: 'Hero avec CTA',
    description: 'Image, titre et bouton d\'action',
    popular: true,
    category: 'Marketing',
  },
  {
    type: 'template' as const,
    id: 'newsletter',
    icon: <div style={{ 
      width: 40, 
      height: 40, 
      backgroundColor: `${designTokens.colors.blocks.TEXT}15`,
      borderRadius: designTokens.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    }}>📰</div>,
    title: 'Newsletter',
    description: 'En-tête, articles et pied de page',
    popular: true,
    category: 'Communication',
  },
  {
    type: 'template' as const,
    id: 'product',
    icon: <div style={{ 
      width: 40, 
      height: 40, 
      backgroundColor: `${designTokens.colors.blocks.IMAGE}15`,
      borderRadius: designTokens.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    }}>🛒</div>,
    title: 'Vitrine produit',
    description: 'Présentation avec prix et achat',
    popular: false,
    category: 'E-commerce',
  },
];

interface SidebarProps {
  onElementAdd?: (element: any) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onElementAdd,
  className = '' 
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultExpanded).map(s => s.id))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);

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

  const handleElementClick = (element: any) => {
    onElementAdd?.(element);
  };

  const filterItems = (items: any[]) => {
    let filtered = items;
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (showOnlyPopular) {
      filtered = filtered.filter(item => item.popular);
    }
    
    return filtered;
  };

  const renderSearchBar = () => (
    <div style={{ 
      padding: `0 ${designTokens.spacing.lg}`,
      marginBottom: designTokens.spacing.lg 
    }}>
      <div style={{
        position: 'relative',
        marginBottom: designTokens.spacing.md,
      }}>
        <Search 
          size={16} 
          style={{
            position: 'absolute',
            left: designTokens.spacing.md,
            top: '50%',
            transform: 'translateY(-50%)',
            color: designTokens.colors.semantic.text.secondary,
          }}
        />
        <input
          type="text"
          placeholder="Rechercher des blocs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: `${designTokens.spacing.sm} ${designTokens.spacing.md} ${designTokens.spacing.sm} 36px`,
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
      
      <button
        onClick={() => setShowOnlyPopular(!showOnlyPopular)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: designTokens.spacing.xs,
          padding: `${designTokens.spacing.xs} ${designTokens.spacing.sm}`,
          border: `1px solid ${showOnlyPopular ? designTokens.colors.blocks.BUTTON : designTokens.colors.semantic.border}`,
          borderRadius: designTokens.borderRadius.sm,
          backgroundColor: showOnlyPopular ? `${designTokens.colors.blocks.BUTTON}10` : 'transparent',
          color: showOnlyPopular ? designTokens.colors.blocks.BUTTON : designTokens.colors.semantic.text.secondary,
          fontSize: designTokens.typography.sizes.xs,
          cursor: 'pointer',
          transition: designTokens.transitions.base,
        }}
      >
        <Star size={12} fill={showOnlyPopular ? 'currentColor' : 'none'} />
        Populaires uniquement
      </button>
    </div>
  );

  const renderSection = (section: SidebarSection) => {
    const isExpanded = expandedSections.has(section.id);
    
    return (
      <div key={section.id} style={{ marginBottom: designTokens.spacing.lg }}>
        {/* Section Header */}
        <button
          onClick={() => toggleSection(section.id)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: designTokens.spacing.sm,
            padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: designTokens.typography.sizes.base,
            fontWeight: designTokens.typography.weights.semibold,
            color: designTokens.colors.semantic.text.primary,
            transition: designTokens.transitions.base,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = designTokens.colors.states.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {section.icon}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.xs }}>
              {section.title}
              {section.badge && (
                <span style={{
                  backgroundColor: designTokens.colors.semantic.text.secondary,
                  color: 'white',
                  fontSize: designTokens.typography.sizes.xs,
                  padding: '2px 6px',
                  borderRadius: '10px',
                  lineHeight: 1,
                }}>
                  {section.badge}
                </span>
              )}
            </div>
            <div style={{
              fontSize: designTokens.typography.sizes.xs,
              fontWeight: designTokens.typography.weights.normal,
              color: designTokens.colors.semantic.text.secondary,
              marginTop: 2,
            }}>
              {section.description}
            </div>
          </div>
        </button>

        {/* Section Content */}
        {isExpanded && (
          <div style={{ 
            padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
            display: 'flex',
            flexDirection: 'column',
            gap: designTokens.spacing.sm,
          }}>
            {section.id === 'content-blocks' && filterItems(contentBlocks).map((block, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <DraggableCard
                  icon={block.icon}
                  title={block.title}
                  description={block.description}
                  blockData={{ type: block.type, id: `${block.type}-${index}` }}
                  onClick={() => handleElementClick(block)}
                />
                {block.popular && (
                  <Star 
                    size={12} 
                    fill={designTokens.colors.blocks.BUTTON}
                    color={designTokens.colors.blocks.BUTTON}
                    style={{
                      position: 'absolute',
                      top: designTokens.spacing.xs,
                      right: designTokens.spacing.xs,
                    }}
                  />
                )}
              </div>
            ))}
            
            {section.id === 'layouts' && filterItems(layoutBlocks).map((layout, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <DraggableCard
                  icon={layout.icon}
                  title={layout.title}
                  description={layout.description}
                  blockData={{ 
                    type: layout.type, 
                    id: `${layout.type}-${layout.columns}-${index}`,
                    columns: layout.columns,
                    ratio: layout.ratio
                  }}
                  onClick={() => handleElementClick(layout)}
                />
                {layout.popular && (
                  <Star 
                    size={12} 
                    fill={designTokens.colors.blocks.BUTTON}
                    color={designTokens.colors.blocks.BUTTON}
                    style={{
                      position: 'absolute',
                      top: designTokens.spacing.xs,
                      right: designTokens.spacing.xs,
                    }}
                  />
                )}
              </div>
            ))}
            
            {section.id === 'templates' && filterItems(templateBlocks).map((template, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <DraggableCard
                  icon={template.icon}
                  title={template.title}
                  description={template.description}
                  blockData={{ 
                    type: template.type, 
                    id: `${template.type}-${template.id}-${index}`,
                    templateId: template.id
                  }}
                  onClick={() => handleElementClick(template)}
                />
                {template.popular && (
                  <Star 
                    size={12} 
                    fill={designTokens.colors.blocks.BUTTON}
                    color={designTokens.colors.blocks.BUTTON}
                    style={{
                      position: 'absolute',
                      top: designTokens.spacing.xs,
                      right: designTokens.spacing.xs,
                    }}
                  />
                )}
                {template.category && (
                  <div style={{
                    position: 'absolute',
                    bottom: designTokens.spacing.xs,
                    right: designTokens.spacing.xs,
                    backgroundColor: designTokens.colors.semantic.text.muted,
                    color: 'white',
                    fontSize: designTokens.typography.sizes.xs,
                    padding: '2px 6px',
                    borderRadius: designTokens.borderRadius.sm,
                  }}>
                    {template.category}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={className}
      style={{
        width: 300,
        height: '100%',
        backgroundColor: designTokens.colors.semantic.background,
        borderRight: `1px solid ${designTokens.colors.semantic.border}`,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        padding: designTokens.spacing.lg,
        borderBottom: `1px solid ${designTokens.colors.semantic.border}`,
        backgroundColor: designTokens.colors.semantic.background,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <h2 style={{
          margin: 0,
          fontSize: designTokens.typography.sizes.lg,
          fontWeight: designTokens.typography.weights.semibold,
          color: designTokens.colors.semantic.text.primary,
          marginBottom: designTokens.spacing.xs,
        }}>
          Éléments
        </h2>
        <p style={{
          margin: 0,
          fontSize: designTokens.typography.sizes.sm,
          color: designTokens.colors.semantic.text.secondary,
        }}>
          Glissez-déposez pour construire votre email
        </p>
      </div>

      {/* Search Bar */}
      {renderSearchBar()}

      {/* Sections */}
      <div style={{ flex: 1 }}>
        {sections.map(renderSection)}
      </div>

      {/* Footer */}
      <div style={{
        padding: designTokens.spacing.lg,
        borderTop: `1px solid ${designTokens.colors.semantic.border}`,
        backgroundColor: designTokens.colors.states.hover,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: designTokens.spacing.xs,
          fontSize: designTokens.typography.sizes.xs,
          color: designTokens.colors.semantic.text.secondary,
        }}>
          <Clock size={12} />
          Dernière modification: il y a 2 min
        </div>
      </div>
    </div>
  );
};
