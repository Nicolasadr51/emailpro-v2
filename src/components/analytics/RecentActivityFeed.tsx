import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TrackingEvent, TrackedEvent } from '../../types/analytics';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecentActivityFeedProps {
  title: string;
  events: TrackingEvent[];
  maxEvents?: number;
}

const getEventBadgeVariant = (event: TrackedEvent) => {
  switch (event) {
    case TrackedEvent.OPEN:
      return 'success';
    case TrackedEvent.CLICK:
      return 'default';
    case TrackedEvent.BOUNCE:
      return 'destructive';
    case TrackedEvent.UNSUBSCRIBE:
      return 'secondary';
    default:
      return 'outline';
  }
};

const getEventLabel = (event: TrackedEvent) => {
  switch (event) {
    case TrackedEvent.SENT:
      return 'Envoyé';
    case TrackedEvent.DELIVERED:
      return 'Livré';
    case TrackedEvent.OPEN:
      return 'Ouvert';
    case TrackedEvent.CLICK:
      return 'Cliqué';
    case TrackedEvent.BOUNCE:
      return 'Rebond';
    case TrackedEvent.UNSUBSCRIBE:
      return 'Désabonné';
    default:
      return event;
  }
};

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  title,
  events,
  maxEvents = 10,
}) => {
  const recentEvents = events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, maxEvents);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {recentEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune activité récente</p>
        ) : (
          recentEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant={getEventBadgeVariant(event.event)}>
                  {getEventLabel(event.event)}
                </Badge>
                <div>
                  <p className="text-sm font-medium">Contact {event.contactId}</p>
                  {event.url && (
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {event.url}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.timestamp), 'dd MMM HH:mm', { locale: fr })}
                </p>
                {event.ipAddress && (
                  <p className="text-xs text-muted-foreground">
                    {event.ipAddress}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
