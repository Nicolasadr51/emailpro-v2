import React, { useState } from 'react';
import { PageWrapper } from '../components/layout';
import { StatCard, TimeSeriesChart, GeoChart, RecentActivityFeed } from '../components/analytics';
import { useCampaignStats, useTimeSeriesData, useGeoData } from '../hooks/useAnalytics';
import { Select } from '../components/ui/Select';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { mockAnalyticsData } from '../mocks/mockAnalyticsData';
import { 
  MailIcon, 
  EyeIcon, 
  MousePointerClickIcon, 
  XCircleIcon,
  TrendingUpIcon,
  TrendingDownIcon 
} from 'lucide-react';

export const StatisticsPage: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState('campaign-1');

  // Utilisation des hooks pour récupérer les données
  const { data: campaignStats, isLoading: statsLoading } = useCampaignStats(selectedCampaign);
  const { data: opensData, isLoading: opensLoading } = useTimeSeriesData(selectedCampaign, 'opens');
  const { data: clicksData, isLoading: clicksLoading } = useTimeSeriesData(selectedCampaign, 'clicks');
  const { data: geoData, isLoading: geoLoading } = useGeoData(selectedCampaign);

  // Données d'événements récents (utilisation directe des mocks pour la démo)
  const recentEvents = mockAnalyticsData.trackingEvents.filter(
    event => event.campaignId === selectedCampaign
  );

  const isLoading = statsLoading || opensLoading || clicksLoading || geoLoading;

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <PageWrapper
      title="Statistiques et Analytics"
      breadcrumbs={[{ label: 'Statistiques' }]}
    >
      {/* Sélecteur de campagne */}
      <div className="mb-6">
        <Select
          value={selectedCampaign}
          onValueChange={setSelectedCampaign}
          placeholder="Sélectionner une campagne"
        >
          <option value="campaign-1">Campagne Newsletter Octobre</option>
          <option value="campaign-2">Campagne Promotion Black Friday</option>
        </Select>
      </div>

      {/* Métriques principales */}
      {campaignStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Emails envoyés"
            value={campaignStats.totalSent.toLocaleString()}
            icon={<MailIcon className="h-6 w-6" />}
          />
          <StatCard
            title="Taux d'ouverture"
            value={`${campaignStats.openRate.toFixed(1)}%`}
            subtitle={`${campaignStats.totalOpened} ouvertures`}
            trend={{ value: 2.5, isPositive: true }}
            icon={<EyeIcon className="h-6 w-6" />}
          />
          <StatCard
            title="Taux de clic"
            value={`${campaignStats.clickRate.toFixed(1)}%`}
            subtitle={`${campaignStats.totalClicked} clics`}
            trend={{ value: 1.2, isPositive: true }}
            icon={<MousePointerClickIcon className="h-6 w-6" />}
          />
          <StatCard
            title="Taux de rebond"
            value={`${campaignStats.bounceRate.toFixed(1)}%`}
            subtitle={`${campaignStats.totalBounced} rebonds`}
            trend={{ value: 0.8, isPositive: false }}
            icon={<XCircleIcon className="h-6 w-6" />}
          />
        </div>
      )}

      {/* Graphiques temporels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {opensData && (
          <TimeSeriesChart
            title="Évolution des ouvertures"
            data={opensData}
            color="#10b981"
          />
        )}
        {clicksData && (
          <TimeSeriesChart
            title="Évolution des clics"
            data={clicksData}
            color="#3b82f6"
          />
        )}
      </div>

      {/* Géolocalisation et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {geoData && (
          <GeoChart
            title="Répartition géographique des ouvertures"
            data={geoData}
          />
        )}
        <RecentActivityFeed
          title="Activité récente"
          events={recentEvents}
          maxEvents={8}
        />
      </div>

      {/* Métriques supplémentaires */}
      {campaignStats && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Emails livrés"
            value={campaignStats.totalDelivered.toLocaleString()}
            subtitle={`${((campaignStats.totalDelivered / campaignStats.totalSent) * 100).toFixed(1)}% de livraison`}
            icon={<TrendingUpIcon className="h-6 w-6" />}
          />
          <StatCard
            title="Désabonnements"
            value={campaignStats.totalUnsubscribed}
            subtitle={`${campaignStats.unsubscribeRate.toFixed(2)}% du total`}
            icon={<TrendingDownIcon className="h-6 w-6" />}
          />
          <StatCard
            title="Engagement total"
            value={`${((campaignStats.totalOpened + campaignStats.totalClicked) / campaignStats.totalDelivered * 100).toFixed(1)}%`}
            subtitle="Ouvertures + Clics"
            trend={{ value: 3.2, isPositive: true }}
            icon={<TrendingUpIcon className="h-6 w-6" />}
          />
        </div>
      )}
    </PageWrapper>
  );
};
