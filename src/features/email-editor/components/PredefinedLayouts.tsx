import React from 'react';
import { Type, MousePointer, ShoppingCart } from 'lucide-react';
import { EditorElement } from '../types/editor.types';

interface PredefinedLayout {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  elements: Partial<EditorElement>[];
  category: 'marketing' | 'ecommerce' | 'newsletter' | 'event';
}

interface PredefinedLayoutsProps {
  onLayoutSelect: (layout: PredefinedLayout) => void;
  className?: string;
}

export const PredefinedLayouts: React.FC<PredefinedLayoutsProps> = ({
  onLayoutSelect,
  className = ''
}) => {
  const predefinedLayouts: PredefinedLayout[] = [
    {
      id: 'hero-cta',
      name: 'Hero avec CTA',
      description: 'Image hero, titre, texte et bouton d\'action',
      icon: MousePointer,
      category: 'marketing',
      elements: [
        {
          type: 'IMAGE',
          content: '',
          styles: { width: '100%', height: '300px' }
        },
        {
          type: 'TEXT',
          content: 'Titre principal accrocheur',
          styles: { fontSize: '32px', fontWeight: 'bold', textAlign: 'center', margin: '20px 0' }
        },
        {
          type: 'TEXT',
          content: 'Description engageante qui incite à l\'action et explique la valeur proposée.',
          styles: { fontSize: '16px', textAlign: 'center', margin: '0 0 30px 0', color: '#666' }
        },
        {
          type: 'BUTTON',
          content: 'Découvrir maintenant',
          styles: { 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '12px 30px',
            borderRadius: '6px',
            textAlign: 'center'
          }
        }
      ]
    },
    {
      id: 'newsletter-content',
      name: 'Newsletter classique',
      description: 'En-tête, articles et pied de page',
      icon: Type,
      category: 'newsletter',
      elements: [
        {
          type: 'IMAGE',
          content: '',
          styles: { width: '200px', height: 'auto', margin: '0 auto 30px auto' }
        },
        {
          type: 'TEXT',
          content: 'Newsletter - Janvier 2024',
          styles: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 30px 0' }
        },
        {
          type: 'TEXT',
          content: 'Article principal',
          styles: { fontSize: '20px', fontWeight: 'bold', margin: '30px 0 10px 0' }
        },
        {
          type: 'TEXT',
          content: 'Contenu de l\'article principal avec toutes les informations importantes...',
          styles: { fontSize: '16px', margin: '0 0 20px 0' }
        },
        {
          type: 'DIVIDER',
          content: '',
          styles: { margin: '30px 0', border: '1px solid #eee' }
        }
      ]
    },
    {
      id: 'product-showcase',
      name: 'Vitrine produit',
      description: 'Présentation produit avec prix et achat',
      icon: ShoppingCart,
      category: 'ecommerce',
      elements: [
        {
          type: 'TEXT',
          content: 'Nouveau produit',
          styles: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 20px 0' }
        },
        {
          type: 'IMAGE',
          content: '',
          styles: { width: '100%', maxWidth: '400px', height: 'auto', margin: '0 auto 20px auto' }
        },
        {
          type: 'TEXT',
          content: 'Nom du produit',
          styles: { fontSize: '22px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 10px 0' }
        },
        {
          type: 'TEXT',
          content: 'Description détaillée du produit avec ses caractéristiques principales.',
          styles: { fontSize: '16px', textAlign: 'center', margin: '0 0 20px 0', color: '#666' }
        },
        {
          type: 'TEXT',
          content: '99,99 €',
          styles: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 20px 0', color: '#e74c3c' }
        },
        {
          type: 'BUTTON',
          content: 'Acheter maintenant',
          styles: { 
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '15px 40px',
            borderRadius: '6px',
            textAlign: 'center'
          }
        }
      ]
    }
  ];

  const categories = [
    { id: 'marketing', name: 'Marketing', color: 'bg-blue-100 text-blue-800' },
    { id: 'newsletter', name: 'Newsletter', color: 'bg-green-100 text-green-800' },
    { id: 'ecommerce', name: 'E-commerce', color: 'bg-purple-100 text-purple-800' },
    { id: 'event', name: 'Événement', color: 'bg-orange-100 text-orange-800' }
  ];

  const handleLayoutClick = (layout: PredefinedLayout) => {
    onLayoutSelect(layout);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Mises en page prédéfinies
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Choisissez un template pour commencer rapidement
        </p>
      </div>

      {categories.map((category) => {
        const categoryLayouts = predefinedLayouts.filter(
          layout => layout.category === category.id
        );

        if (categoryLayouts.length === 0) return null;

        return (
          <div key={category.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                {category.name}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {categoryLayouts.map((layout) => {
                const Icon = layout.icon;
                
                return (
                  <button
                    key={layout.id}
                    onClick={() => handleLayoutClick(layout)}
                    className="
                      flex items-start gap-3 p-3 rounded-lg border border-gray-200
                      hover:border-blue-300 hover:bg-blue-50 
                      transition-all duration-200 ease-in-out
                      text-left group
                    "
                  >
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-md group-hover:bg-blue-100">
                      <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-900">
                        {layout.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {layout.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        {layout.elements.length} éléments
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PredefinedLayouts;
