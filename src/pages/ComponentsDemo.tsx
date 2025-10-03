import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge,
  Avatar,
  Select,
  Textarea,
  Checkbox,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '../components/ui';
import { Mail, User, Plus } from 'lucide-react';
import { useNotifications } from '../store/useAppStore';

export const ComponentsDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const { addNotification } = useNotifications();

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
    { value: 'option4', label: 'Option 4' }
  ];

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    addNotification({
      type,
      title: `Notification ${type}`,
      message: `Ceci est un exemple de notification ${type}.`,
      duration: 3000
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Système de Design EmailPro v2
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Démonstration des composants UI de base
          </p>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Boutons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Avec icône gauche
              </Button>
              <Button rightIcon={<Mail className="h-4 w-4" />}>
                Avec icône droite
              </Button>
              <Button loading>
                Chargement...
              </Button>
              <Button disabled>
                Désactivé
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Éléments de formulaire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                leftIcon={<Mail className="h-4 w-4" />}
              />
              
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                error="Le mot de passe doit contenir au moins 8 caractères"
              />
              
              <Select
                label="Sélection"
                options={selectOptions}
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                placeholder="Choisir une option"
              />
              
              <div>
                <Checkbox
                  label="J'accepte les conditions"
                  description="En cochant cette case, vous acceptez nos conditions d'utilisation."
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.target.checked)}
                />
              </div>
            </div>
            
            <Textarea
              label="Message"
              placeholder="Votre message..."
              maxLength={500}
              showCharCount
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Badges and Avatars */}
        <Card>
          <CardHeader>
            <CardTitle>Badges et Avatars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge icon={<User className="h-3 w-3" />}>Avec icône</Badge>
                <Badge removable onRemove={() => console.log('Badge supprimé')}>
                  Supprimable
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Avatars</h3>
              <div className="flex items-center gap-4">
                <Avatar 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                  alt="John Doe"
                  size="sm"
                />
                <Avatar 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                  alt="Jane Smith"
                  size="default"
                />
                <Avatar 
                  name="Alice Johnson"
                  size="lg"
                />
                <Avatar 
                  name="Bob Wilson"
                  size="xl"
                />
                <Avatar 
                  fallback="?"
                  size="2xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Éléments interactifs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setIsModalOpen(true)}>
                Ouvrir Modal
              </Button>
              
              <Button onClick={() => showNotification('success')}>
                Notification Success
              </Button>
              
              <Button onClick={() => showNotification('error')}>
                Notification Error
              </Button>
              
              <Button onClick={() => showNotification('warning')}>
                Notification Warning
              </Button>
              
              <Button onClick={() => showNotification('info')}>
                Notification Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards Variants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Card Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Carte avec style par défaut.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Card Elevated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Carte avec ombre élevée.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Card Outlined</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Carte avec bordure accentuée.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Exemple de Modal"
          description="Ceci est une démonstration du composant Modal."
          size="md"
        >
          <ModalHeader>
            <h3 className="text-lg font-medium">Contenu de la modal</h3>
          </ModalHeader>
          
          <ModalBody>
            <p className="text-gray-600 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            
            <div className="mt-4">
              <Input
                label="Nom"
                placeholder="Votre nom"
              />
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirmer
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};
