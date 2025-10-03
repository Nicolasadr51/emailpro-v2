import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Send, 
  Pause, 
  Play,
  Calendar,
  Eye,
  TrendingUp
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge,
  Modal,
  Avatar
} from '../components/ui';
import { useCampaigns, useDeleteCampaign, useDuplicateCampaign, useSendCampaign } from '../hooks/useCampaigns';
import { Campaign, CampaignStatus, CampaignType, CampaignFilters } from '../types/campaign';
import { cn } from '../lib/utils';

// Mapping des statuts avec couleurs
const statusConfig: Record<CampaignStatus, { label: string; variant: any; color: string }> = {
  draft: { label: 'Brouillon', variant: 'secondary', color: 'text-gray-600' },
  scheduled: { label: 'Programmée', variant: 'default', color: 'text-blue-600' },
  sending: { label: 'En cours', variant: 'default', color: 'text-orange-600' },
  sent: { label: 'Envoyée', variant: 'default', color: 'text-green-600' },
  paused: { label: 'En pause', variant: 'outline', color: 'text-yellow-600' },
  cancelled: { label: 'Annulée', variant: 'destructive', color: 'text-red-600' },
  failed: { label: 'Échec', variant: 'destructive', color: 'text-red-600' }
};

// Mapping des types
const typeConfig: Record<CampaignType, { label: string; icon: React.ReactNode }> = {
  regular: { label: 'Classique', icon: <Send className="h-4 w-4" /> },
  automation: { label: 'Automatisation', icon: <Play className="h-4 w-4" /> },
  ab_test: { label: 'Test A/B', icon: <TrendingUp className="h-4 w-4" /> },
  rss: { label: 'RSS', icon: <Calendar className="h-4 w-4" /> }
};

export const CampaignsPage: React.FC = () => {
  // États locaux
  const [filters, setFilters] = useState<CampaignFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');

  // Hooks
  const { data: campaignsData, isLoading, error } = useCampaigns(filters);
  const deleteCampaignMutation = useDeleteCampaign();
  const duplicateCampaignMutation = useDuplicateCampaign();
  const sendCampaignMutation = useSendCampaign();

  // Filtres appliqués
  const appliedFilters = useMemo(() => {
    const newFilters: CampaignFilters = {};
    
    if (searchQuery.trim()) {
      newFilters.search = searchQuery.trim();
    }
    
    return newFilters;
  }, [searchQuery]);

  // Mettre à jour les filtres avec debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(appliedFilters);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [appliedFilters]);

  // Gestionnaires d'événements
  const handleDeleteCampaign = async () => {
    if (!selectedCampaign) return;
    
    try {
      await deleteCampaignMutation.mutateAsync(selectedCampaign.id);
      setShowDeleteModal(false);
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleDuplicateCampaign = async () => {
    if (!selectedCampaign) return;
    
    try {
      await duplicateCampaignMutation.mutateAsync({
        id: selectedCampaign.id,
        name: duplicateName || `${selectedCampaign.name} (Copie)`
      });
      setShowDuplicateModal(false);
      setSelectedCampaign(null);
      setDuplicateName('');
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
    }
  };

  const handleSendCampaign = async (campaign: Campaign) => {
    try {
      await sendCampaignMutation.mutateAsync(campaign.id);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  if (error) {
    return (
      <PageWrapper title="Campagnes" description="Erreur lors du chargement">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">
            Erreur lors du chargement des campagnes
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Campagnes"
      description="Gérez vos campagnes d'email marketing"
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
            Filtres
          </Button>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Nouvelle campagne
          </Button>
        </div>
      }
    >
      {/* Barre de recherche et filtres */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher une campagne..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        
        <div className="flex gap-2">
          <Select placeholder="Statut">
            <option value="">Tous les statuts</option>
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label}
              </option>
            ))}
          </Select>
          
          <Select placeholder="Type">
            <option value="">Tous les types</option>
            {Object.entries(typeConfig).map(([type, config]) => (
              <option key={type} value={type}>
                {config.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaignsData?.total || 0}
                </p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Brouillons</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaignsData?.campaigns.filter(c => c.status === 'draft').length || 0}
                </p>
              </div>
              <Edit className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Programmées</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaignsData?.campaigns.filter(c => c.status === 'scheduled').length || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Envoyées</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaignsData?.campaigns.filter(c => c.status === 'sent').length || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des campagnes */}
      <Card>
        <CardHeader>
          <CardTitle>Campagnes ({campaignsData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : campaignsData?.campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune campagne
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Commencez par créer votre première campagne d'email marketing.
              </p>
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Créer une campagne
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaignsData?.campaigns.map((campaign) => {
                const statusInfo = statusConfig[campaign.status];
                const typeInfo = typeConfig[campaign.type];
                
                return (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Avatar/Icône */}
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                        {typeInfo.icon}
                      </div>
                      
                      {/* Informations principales */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {campaign.name}
                          </h3>
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline">
                            {typeInfo.label}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                          {campaign.subject}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            Créée le {formatDate(campaign.createdAt)}
                          </span>
                          {campaign.sentAt && (
                            <span>
                              Envoyée le {formatDate(campaign.sentAt)}
                            </span>
                          )}
                          {campaign.scheduledAt && (
                            <span>
                              Programmée pour le {formatDate(campaign.scheduledAt)}
                            </span>
                          )}
                          <span>
                            {formatNumber(campaign.recipients.totalCount)} destinataires
                          </span>
                        </div>
                      </div>
                      
                      {/* Statistiques */}
                      {campaign.stats && (
                        <div className="hidden md:flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {campaign.stats.openRate.toFixed(1)}%
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">Ouvertures</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {campaign.stats.clickRate.toFixed(1)}%
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">Clics</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => handleSendCampaign(campaign)}
                          loading={sendCampaignMutation.isPending}
                        >
                          Envoyer
                        </Button>
                      )}
                      
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // TODO: Implémenter le menu contextuel
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        
                        {/* Menu contextuel (à implémenter) */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer la campagne"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir supprimer la campagne "{selectedCampaign?.name}" ?
            Cette action est irréversible.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCampaign}
              loading={deleteCampaignMutation.isPending}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de duplication */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        title="Dupliquer la campagne"
      >
        <div className="space-y-4">
          <Input
            label="Nom de la nouvelle campagne"
            value={duplicateName}
            onChange={(e) => setDuplicateName(e.target.value)}
            placeholder={selectedCampaign ? `${selectedCampaign.name} (Copie)` : ''}
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDuplicateModal(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDuplicateCampaign}
              loading={duplicateCampaignMutation.isPending}
            >
              Dupliquer
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
};
