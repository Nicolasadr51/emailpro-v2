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
  ChevronRight
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
}

const sections: SidebarSection[] = [
  {
    id: 'content-blocks',
    title: 'Blocs de contenu',
    icon: <Box size={18} />,
    description: 'Faites glisser pour ajouter du contenu',
    defaultExpanded: true,
  },
  {
    id: 'layouts',
    title: 'Mises en page',
    icon: <Layout size={18} />,
    description: 'Structures de colonnes',
    defaultExpanded: false,
  },
  {
    id: 'templates',
    title: 'Templates prédéfinis',
    icon: <FileText size={18} />,
    description: 'Modèles complets prêts à l\'emploi',
    defaultExpanded: false,
  },
];

const contentBlocks = [
  {
    type: 'image' as const,
    icon: <BlockIcon icon={Image} color="IMAGE" />,
    title: 'Image',
    description: 'Ajoutez une image ou un logo',
  },
  {
    type: 'heading' as const,
    icon: <BlockIcon icon={Type} color="HEADING" />,
    title: 'Titre',
    description: 'Titre principal ou sous-titre',
  },
  {
    type: 'text' as const,
    icon: <BlockIcon icon={AlignLeft} color="TEXT" />,
    title: 'Paragraphe',
    description: 'Bloc de texte formaté',
  },
  {
    type: 'button' as const,
    icon: <BlockIcon icon={MousePointer} color="BUTTON" />,
    title: 'Bouton',
    description: 'Call-to-action cliquable',
  },
  {
    type: 'divider' as const,
    icon: <BlockIcon icon={Minus} color="DIVIDER" />,
    title: 'Séparateur',
    description: 'Ligne de séparation',
  },
  {
    type: 'social' as const,
    icon: <BlockIcon icon={Share2} color="SOCIAL" />,
    title: 'Réseaux sociaux',
    description: 'Icônes de réseaux sociaux',
  },
  {
    type: 'spacer' as const,
    icon: <BlockIcon icon={Box} color="SPACER" />,
    title: 'Espacement',
    description: 'Espace vertical ajustable',
  },
];

const layoutBlocks = [
  {
    type: 'layout' as const,
    columns: 1 as const,
    icon: <LayoutPreview columns={1} />,
    title: '1 colonne',
    description: 'Largeur pleine',
  },
  {
    type: 'layout' as const,
    columns: 2 as const,
    icon: <LayoutPreview columns={2} />,
    title: '2 colonnes',
    description: 'Répartition 50/50',
  },
  {
    type: 'layout' as const,
    columns: 3 as const,
    icon: <LayoutPreview columns={3} />,
    title: '3 colonnes',
    description: 'Répartition égale',
  },
  {
    type: 'layout' as const,
    columns: 2 as const,
    ratio: '2:1' as const,
    icon: <LayoutPreview columns={2} ratio="2:1" />,
    title: '2 colonnes (2:1)',
    description: 'Colonne large à gauche',
  },
  {
    type: 'layout' as const,
    columns: 2 as const,
    ratio: '1:2' as const,
    icon: <LayoutPreview columns={2} ratio="1:2" />,
    title: '2 colonnes (1:2)',
    description: 'Colonne large à droite',
  },
];

const templateBlocks = [
  {
    type: 'template' as const,
    id: 'hero-cta',
    icon: <div style={{ 
      width: 40, 
      height: 40, 
      backgroundColor: `${designTokens.colors.blocks.button}15`,
      borderRadius: designTokens.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    }}>🎯</div>,
    title: 'Hero avec CTA',
    description: 'Image, titre et bouton d\'action',
  },
  {
    type: 'template' as const,
    id: 'newsletter',
    icon: <div style={{ 
      width: 40, 
      height: 40, 
      backgroundColor: `${designTokens.colors.blocks.text}15`,
      borderRadius: designTokens.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    }}>📰</div>,
    title: 'Newsletter',
    description: 'En-tête, articles et pied de page',
  },
  {
    type: 'template' as const,
    id: 'product',
    icon: <div style={{ 
      width: 40, 
      height: 40, 
      backgroundColor: `${designTokens.colors.blocks.image}15`,
      borderRadius: designTokens.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    }}>🛒</div>,
    title: 'Vitrine produit',
    description: 'Présentation avec prix et achat',
  },
];

interface NewSidebarProps {
  onElementAdd?: (element: any) => void;
  className?: string;
}

export const NewSidebar: React.FC<NewSidebarProps> = ({ 
  onElementAdd,
  className = '' 
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultExpanded).map(s => s.id))
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

  const handleElementClick = (element: any) => {
    onElementAdd?.(element);
  };

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
            padding: `${designTokens.spacing.sm} 0`,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: designTokens.typography.sizes.base,
            fontWeight: designTokens.typography.weights.semibold,
            color: designTokens.colors.semantic.text.primary,
          }}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {section.icon}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div>{section.title}</div>
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
            marginTop: designTokens.spacing.md,
            display: 'flex',
            flexDirection: 'column',
            gap: designTokens.spacing.sm,
          }}>
            {section.id === 'content-blocks' && contentBlocks.map((block, index) => (
              <DraggableCard
                key={index}
                icon={block.icon}
                title={block.title}
                description={block.description}
                blockData={{ type: block.type, id: `${block.type}-${index}` }}
                onClick={() => handleElementClick(block)}
              />
            ))}
            
            {section.id === 'layouts' && layoutBlocks.map((layout, index) => (
              <DraggableCard
                key={index}
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
            ))}
            
            {section.id === 'templates' && templateBlocks.map((template, index) => (
              <DraggableCard
                key={index}
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
        width: 280,
        height: '100%',
        backgroundColor: designTokens.colors.semantic.background,
        borderRight: `1px solid ${designTokens.colors.semantic.border}`,
        padding: designTokens.spacing.lg,
        overflowY: 'auto',
      }}
    >
      {sections.map(renderSection)}
    </div>
  );
};
