import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RefreshCwIcon, PlayIcon, PauseIcon } from 'lucide-react';

interface RealTimeMetric {
  label: string;
  value: number;
  change: number;
  isPositive: boolean;
}

interface RealTimeMetricsProps {
  campaignId: string;
  refreshInterval?: number; // en millisecondes
}

export const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({
  campaignId,
  refreshInterval = 30000, // 30 secondes par défaut
}) => {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([
    { label: 'Ouvertures', value: 0, change: 0, isPositive: true },
    { label: 'Clics', value: 0, change: 0, isPositive: true },
    { label: 'Rebonds', value: 0, change: 0, isPositive: false },
    { label: 'Désabonnements', value: 0, change: 0, isPositive: false },
  ]);

  // Simulation de données temps réel
  const generateRandomMetrics = (): RealTimeMetric[] => {
    return [
      {
        label: 'Ouvertures',
        value: Math.floor(Math.random() * 50) + 100,
        change: Math.floor(Math.random() * 10) - 5,
        isPositive: true,
      },
      {
        label: 'Clics',
        value: Math.floor(Math.random() * 20) + 25,
        change: Math.floor(Math.random() * 5) - 2,
        isPositive: true,
      },
      {
        label: 'Rebonds',
        value: Math.floor(Math.random() * 5) + 2,
        change: Math.floor(Math.random() * 3) - 1,
        isPositive: false,
      },
      {
        label: 'Désabonnements',
        value: Math.floor(Math.random() * 3) + 1,
        change: Math.floor(Math.random() * 2) - 1,
        isPositive: false,
      },
    ];
  };

  const refreshMetrics = useCallback(() => {
    setMetrics(generateRandomMetrics());
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      refreshMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval, refreshMetrics]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Métriques Temps Réel</h3>
          {isLive && (
            <Badge variant="success" className="animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Dernière mise à jour: {formatTime(lastUpdate)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMetrics}
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="bg-gray-50 p-4 rounded-lg text-center"
          >
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {metric.label}
            </p>
            <p className="text-2xl font-bold mb-2">{metric.value}</p>
            {metric.change !== 0 && (
              <div className="flex items-center justify-center">
                <span
                  className={`text-sm font-medium ${
                    (metric.isPositive && metric.change > 0) ||
                    (!metric.isPositive && metric.change < 0)
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {metric.change > 0 ? '+' : ''}{metric.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  dernière min
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        Les données sont mises à jour toutes les {refreshInterval / 1000} secondes
      </div>
    </Card>
  );
};
