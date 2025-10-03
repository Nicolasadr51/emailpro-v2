import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Send, 
  Calendar,
  Edit,
  TrendingUp
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge
} from '../components/ui';
import { mockCampaignData } from '../mocks/mockCampaignData';
import { CampaignStatus, CampaignType } from '../types/campaign';

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
  automation: { label: 'Automatisation', icon: <Calendar className="h-4 w-4" /> },
  ab_test: { label: 'Test A/B', icon: <TrendingUp className="h-4 w-4" /> },
  rss: { label: 'RSS', icon: <Calendar className="h-4 w-4" /> }
};

export const CampaignsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Utiliser les données factices
  const campaigns = mockCampaignData.campaigns;
  
  // Filtrer les campagnes selon la recherche
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Barre de recherche */}
      <div className="mb-6">
        <Input
          placeholder="Rechercher une campagne..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaigns.length}
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
                  {campaigns.filter(c => c.status === 'draft').length}
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
                  {campaigns.filter(c => c.status === 'scheduled').length}
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
                  {campaigns.filter(c => c.status === 'sent').length}
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
          <CardTitle>Campagnes ({filteredCampaigns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune campagne trouvée
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery ? 'Aucune campagne ne correspond à votre recherche.' : 'Commencez par créer votre première campagne d\'email marketing.'}
              </p>
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Créer une campagne
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => {
                const statusInfo = statusConfig[campaign.status];
                const typeInfo = typeConfig[campaign.type];
                
                return (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Icône */}
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
                        <Button size="sm">
                          Envoyer
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
};
