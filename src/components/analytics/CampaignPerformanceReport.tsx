import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CampaignStats } from '../../types/analytics';
import { DownloadIcon, ShareIcon } from 'lucide-react';

interface CampaignPerformanceReportProps {
  campaignStats: CampaignStats;
  campaignName: string;
  onExport?: (format: 'pdf' | 'csv') => void;
  onShare?: () => void;
}

export const CampaignPerformanceReport: React.FC<CampaignPerformanceReportProps> = ({
  campaignStats,
  campaignName,
  onExport,
  onShare,
}) => {
  const getPerformanceLevel = (rate: number, type: 'open' | 'click' | 'bounce') => {
    if (type === 'open') {
      if (rate >= 25) return { level: 'Excellent', variant: 'success' as const };
      if (rate >= 20) return { level: 'Bon', variant: 'default' as const };
      if (rate >= 15) return { level: 'Moyen', variant: 'secondary' as const };
      return { level: 'Faible', variant: 'destructive' as const };
    }
    
    if (type === 'click') {
      if (rate >= 5) return { level: 'Excellent', variant: 'success' as const };
      if (rate >= 3) return { level: 'Bon', variant: 'default' as const };
      if (rate >= 2) return { level: 'Moyen', variant: 'secondary' as const };
      return { level: 'Faible', variant: 'destructive' as const };
    }
    
    // bounce
    if (rate <= 2) return { level: 'Excellent', variant: 'success' as const };
    if (rate <= 5) return { level: 'Bon', variant: 'default' as const };
    if (rate <= 10) return { level: 'Moyen', variant: 'secondary' as const };
    return { level: 'Élevé', variant: 'destructive' as const };
  };

  const openPerformance = getPerformanceLevel(campaignStats.openRate, 'open');
  const clickPerformance = getPerformanceLevel(campaignStats.clickRate, 'click');
  const bouncePerformance = getPerformanceLevel(campaignStats.bounceRate, 'bounce');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Rapport de Performance</h2>
          <p className="text-muted-foreground">{campaignName}</p>
        </div>
        <div className="flex space-x-2">
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <ShareIcon className="h-4 w-4 mr-2" />
              Partager
            </Button>
          )}
          {onExport && (
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Résumé exécutif */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Résumé Exécutif</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm">
            Cette campagne a été envoyée à <strong>{campaignStats.totalSent.toLocaleString()}</strong> contacts
            avec un taux de livraison de <strong>{((campaignStats.totalDelivered / campaignStats.totalSent) * 100).toFixed(1)}%</strong>.
            Le taux d'ouverture de <strong>{campaignStats.openRate.toFixed(1)}%</strong> est considéré comme{' '}
            <Badge variant={openPerformance.variant} className="mx-1">
              {openPerformance.level}
            </Badge>
            pour ce type de campagne.
          </p>
        </div>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium mb-3">Métriques d'Engagement</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Taux d'ouverture</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{campaignStats.openRate.toFixed(1)}%</span>
                <Badge variant={openPerformance.variant}>{openPerformance.level}</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Taux de clic</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{campaignStats.clickRate.toFixed(1)}%</span>
                <Badge variant={clickPerformance.variant}>{clickPerformance.level}</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Taux de rebond</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{campaignStats.bounceRate.toFixed(1)}%</span>
                <Badge variant={bouncePerformance.variant}>{bouncePerformance.level}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Volumes</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Emails envoyés</span>
              <span className="font-medium">{campaignStats.totalSent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Emails livrés</span>
              <span className="font-medium">{campaignStats.totalDelivered.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Ouvertures uniques</span>
              <span className="font-medium">{campaignStats.totalOpened.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Clics uniques</span>
              <span className="font-medium">{campaignStats.totalClicked.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div>
        <h4 className="font-medium mb-3">Recommandations</h4>
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="text-sm space-y-1">
            {campaignStats.openRate < 20 && (
              <li>• Améliorer l'objet de l'email pour augmenter le taux d'ouverture</li>
            )}
            {campaignStats.clickRate < 3 && (
              <li>• Optimiser le contenu et les appels à l'action pour améliorer l'engagement</li>
            )}
            {campaignStats.bounceRate > 5 && (
              <li>• Nettoyer la liste de contacts pour réduire le taux de rebond</li>
            )}
            {campaignStats.unsubscribeRate > 2 && (
              <li>• Revoir la fréquence d'envoi et la pertinence du contenu</li>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
};
