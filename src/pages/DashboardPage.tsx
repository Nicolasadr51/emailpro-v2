import { Campaign } from '../types/campaign';
import React from 'react';
import { 
  Mail, 
  Users, 
  TrendingUp, 
  Calendar,
  Send,
  Eye,
  MousePointer,
  UserMinus,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge
} from '../components/ui';
import { mockCampaignData } from '../mocks/mockCampaignData';

export const DashboardPage: React.FC = () => {
  // Utiliser les données factices
  const campaigns = mockCampaignData.campaigns;
  
  // Calculer les statistiques
  const recentCampaigns = campaigns.slice(0, 3);
  const totalSent = campaigns.reduce((sum: number, c: Campaign) => sum + (c.stats?.sent || 0), 0);
  const totalOpens = campaigns.reduce((sum: number, c: Campaign) => sum + (c.stats?.opens || 0), 0);
  const totalClicks = campaigns.reduce((sum: number, c: Campaign) => sum + (c.stats?.clicks || 0), 0);
  const avgOpenRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;
  const avgClickRate = totalSent > 0 ? (totalClicks / totalSent) * 100 : 0;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <PageWrapper
      title="Dashboard"
      description="Vue d'ensemble de vos campagnes d'email marketing"
      actions={
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Nouvelle campagne
        </Button>
      }
    >
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Campagnes
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {campaigns.length}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +2 ce mois
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Emails Envoyés
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(totalSent)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +12% ce mois
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taux d'Ouverture
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {avgOpenRate.toFixed(1)}%
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +2.1% ce mois
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taux de Clic
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {avgClickRate.toFixed(1)}%
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  -0.5% ce mois
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campagnes récentes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campagnes Récentes</CardTitle>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {campaign.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {campaign.subject}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(campaign.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant={campaign.status === 'sent' ? 'default' : 
                                campaign.status === 'draft' ? 'secondary' : 'outline'}
                      >
                        {campaign.status === 'sent' ? 'Envoyée' :
                         campaign.status === 'draft' ? 'Brouillon' :
                         campaign.status === 'scheduled' ? 'Programmée' : campaign.status}
                      </Badge>
                      
                      {campaign.stats && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {campaign.stats.openRate.toFixed(1)}% ouvertures
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatNumber(campaign.stats.sent)} envoyés
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques détaillées */}
        <div className="space-y-6">
          {/* Performance ce mois */}
          <Card>
            <CardHeader>
              <CardTitle>Performance ce Mois</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ouvertures</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatNumber(totalOpens)}
                  </p>
                  <p className="text-xs text-green-600">+8.2%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MousePointer className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Clics</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatNumber(totalClicks)}
                  </p>
                  <p className="text-xs text-red-600">-2.1%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserMinus className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Désabonnements</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {campaigns.reduce((sum: number, c: Campaign) => sum + (c.stats?.unsubscribes || 0), 0)}
                  </p>
                  <p className="text-xs text-green-600">-12%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Créer une campagne
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Gérer les contacts
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Voir les statistiques
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Programmer un envoi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};
