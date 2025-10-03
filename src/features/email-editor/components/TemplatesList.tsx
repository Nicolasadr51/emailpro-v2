// Liste des templates disponibles pour l'éditeur
// Architecture définie par Claude 4.5 Sonnet

import React, { useState, useEffect } from 'react';
import { EmailTemplate } from '../../../types/emailEditor';

import { Button } from '../../../components/ui/Button';
import {
  PlusIcon,
  ArrowLeftIcon,
  SearchIcon,
  FilterIcon,
  LayoutTemplateIcon,
  StarIcon,
  ClockIcon,
} from 'lucide-react';

interface TemplatesListProps {
  onTemplateSelect: (template: EmailTemplate) => void;
  onCreateNew: () => void;
  onBack: () => void;
  className?: string;
}

export const TemplatesList: React.FC<TemplatesListProps> = ({
  onTemplateSelect,
  onCreateNew,
  onBack,
  className = '',
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [systemTemplates, setSystemTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'my' | 'system'>('system');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Pour l'instant, utiliser des templates par défaut
      // TODO: Implémenter la récupération depuis l'API
      setTemplates([]); // Templates utilisateur vides pour l'instant
      
      // Templates système par défaut
      setSystemTemplates([
        {
          id: 'newsletter-basic',
          name: 'Newsletter Simple',
          description: 'Template de newsletter basique avec en-tête et contenu',
          elements: [],
          layout: { width: 600, height: 800, background: '#ffffff' },
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublic: true,
          category: 'Newsletter',
        },
        {
          id: 'promo-sale',
          name: 'Promotion Vente',
          description: 'Template pour les promotions et ventes',
          elements: [],
          layout: { width: 600, height: 600, background: '#f8f9fa' },
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublic: true,
          category: 'Promotion',
        },
        {
          id: 'welcome-email',
          name: 'Email de Bienvenue',
          description: 'Template pour accueillir les nouveaux utilisateurs',
          elements: [],
          layout: { width: 600, height: 700, background: '#ffffff' },
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublic: true,
          category: 'Transactionnel',
        },
        {
          id: 'event-invitation',
          name: 'Invitation Événement',
          description: 'Template pour inviter à un événement',
          elements: [],
          layout: { width: 600, height: 800, background: '#f0f8ff' },
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublic: true,
          category: 'Événement',
        },
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = (templateList: EmailTemplate[]) => {
    return templateList.filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const categories = ['all', 'Newsletter', 'Promotion', 'Transactionnel', 'Événement'];

  const TemplateCard: React.FC<{ template: EmailTemplate; isSystem?: boolean }> = ({ 
    template, 
    isSystem = false 
  }) => (
    <div
      onClick={() => onTemplateSelect(template)}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: 'white',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#007bff';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e0e0e0';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Aperçu du template */}
      <div style={{
        width: '100%',
        height: '120px',
        backgroundColor: template.layout.background || '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <LayoutTemplateIcon size={32} color="#999" />
        {isSystem && (
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: '500',
          }}>
            Système
          </div>
        )}
      </div>

      {/* Informations du template */}
      <div>
        <h3 style={{
          margin: '0 0 4px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#333',
        }}>
          {template.name}
        </h3>
        {template.description && (
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.3',
          }}>
            {template.description}
          </p>
        )}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#999',
        }}>
          <span>{template.category || 'Général'}</span>
          <span>{template.elements.length} éléments</span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`templates-list ${className}`} style={{ padding: '40px', textAlign: 'center' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des templates...</p>
      </div>
    );
  }

  return (
    <div className={`templates-list ${className}`} style={{ height: '100%', overflow: 'hidden' }}>
      {/* En-tête */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon size={16} />
              Retour
            </Button>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              Choisir un template
            </h1>
          </div>
          <Button
            onClick={onCreateNew}
            className="flex items-center gap-2"
          >
            <PlusIcon size={16} />
            Template vierge
          </Button>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('system')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: activeTab === 'system' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'system' ? 'white' : '#666',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <StarIcon size={14} />
            Templates système ({systemTemplates.length})
          </button>
          <button
            onClick={() => setActiveTab('my')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: activeTab === 'my' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'my' ? 'white' : '#666',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ClockIcon size={14} />
            Mes templates ({templates.length})
          </button>
        </div>

        {/* Filtres et recherche */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <SearchIcon size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999',
            }} />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 40px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'Toutes les catégories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des templates */}
      <div style={{
        padding: '20px',
        height: 'calc(100% - 200px)',
        overflow: 'auto',
      }}>
        {activeTab === 'system' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
          }}>
            {filteredTemplates(systemTemplates).map((template) => (
              <TemplateCard key={template.id} template={template} isSystem />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
          }}>
            {filteredTemplates(templates).map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
            {templates.length === 0 && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#666',
              }}>
                <LayoutTemplateIcon size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                  Aucun template personnel
                </h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>
                  Créez votre premier template ou utilisez un template système
                </p>
                <Button onClick={onCreateNew} className="flex items-center gap-2">
                  <PlusIcon size={16} />
                  Créer un template
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Message si aucun résultat */}
        {((activeTab === 'system' && filteredTemplates(systemTemplates).length === 0) ||
          (activeTab === 'my' && filteredTemplates(templates).length === 0 && templates.length > 0)) && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
          }}>
            <FilterIcon size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
              Aucun template trouvé
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
