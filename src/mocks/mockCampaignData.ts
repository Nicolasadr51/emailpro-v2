// Données factices pour les campagnes
import { Campaign, CampaignFilters, CampaignListResponse, CreateCampaignRequest } from '../types/campaign';

export const mockCampaignData = {
  campaigns: [
    {
      id: '1',
      name: 'Newsletter Janvier 2024',
      subject: '🎉 Nouveautés et tendances du mois',
      status: 'sent' as const,
      type: 'regular' as const,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      sentAt: '2024-01-15T14:30:00Z',
      content: {
        html: '<h1>Newsletter Janvier</h1><p>Découvrez nos nouveautés...</p>',
        text: 'Newsletter Janvier - Découvrez nos nouveautés...'
      },
      recipients: {
        listIds: ['list-1', 'list-2'],
        segmentIds: [],
        totalCount: 2847
      },
      settings: {
        fromName: 'EmailPro',
        fromEmail: 'hello@emailpro.com',
        replyTo: 'support@emailpro.com',
        trackOpens: true,
        trackClicks: true,
        enableAnalytics: true
      },
      stats: {
        sent: 2847,
        delivered: 2820,
        opens: 701,
        clicks: 142,
        bounces: 27,
        unsubscribes: 3,
        complaints: 1,
        deliveryRate: 99.1,
        openRate: 24.8,
        clickRate: 5.0,
        bounceRate: 0.9,
        unsubscribeRate: 0.1,
        complaintRate: 0.04
      }
    },
    {
      id: '2',
      name: 'Promotion Hiver',
      subject: '❄️ Soldes d\'hiver : -50% sur tout !',
      status: 'scheduled' as const,
      type: 'regular' as const,
      createdAt: '2024-01-12T09:00:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
      scheduledAt: '2024-01-20T08:00:00Z',
      content: {
        html: '<h1>Soldes d\'hiver</h1><p>Profitez de nos promotions exceptionnelles...</p>',
        text: 'Soldes d\'hiver - Profitez de nos promotions exceptionnelles...'
      },
      recipients: {
        listIds: ['list-1'],
        segmentIds: [],
        totalCount: 1523
      },
      settings: {
        fromName: 'EmailPro Promotions',
        fromEmail: 'promo@emailpro.com',
        replyTo: 'support@emailpro.com',
        trackOpens: true,
        trackClicks: true,
        enableAnalytics: true
      },
      stats: {
        delivered: 0,
        sent: 0,
        opens: 0,
        clicks: 0,
        bounces: 0,
        unsubscribes: 0,
        openRate: 0,
        deliveryRate: 0,
        complaintRate: 0,
        complaints: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0
      }
    },
    {
      id: '3',
      name: 'Bienvenue nouveaux clients',
      subject: 'Bienvenue chez EmailPro ! 🎉',
      status: 'draft' as const,
      type: 'automation' as const,
      createdAt: '2024-01-10T11:30:00Z',
      updatedAt: '2024-01-10T11:30:00Z',
      content: {
        html: '<h1>Bienvenue !</h1><p>Merci de nous avoir rejoint...</p>',
        text: 'Bienvenue ! Merci de nous avoir rejoint...'
      },
      recipients: {
        listIds: ['list-3'],
        segmentIds: [],
        totalCount: 150
      },
      settings: {
        fromName: 'Équipe EmailPro',
        fromEmail: 'welcome@emailpro.com',
        replyTo: 'support@emailpro.com',
        trackOpens: true,
        trackClicks: true,
        enableAnalytics: true
      },
      stats: {
        delivered: 0,
        sent: 0,
        opens: 0,
        clicks: 0,
        bounces: 0,
        unsubscribes: 0,
        openRate: 0,
        deliveryRate: 0,
        complaintRate: 0,
        complaints: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0
      }
    }
  ] as Campaign[],

  // Méthodes pour simuler les opérations
  getCampaigns(filters: CampaignFilters = {}): CampaignListResponse {
    let filteredCampaigns = [...this.campaigns];

    // Filtrage par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCampaigns = filteredCampaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.subject.toLowerCase().includes(searchLower)
      );
    }

    // Filtrage par statut
    if (filters.status && filters.status.length > 0) {
      filteredCampaigns = filteredCampaigns.filter(campaign =>
        filters.status!.includes(campaign.status)
      );
    }

    // Filtrage par type
    if (filters.type && filters.type.length > 0) {
      filteredCampaigns = filteredCampaigns.filter(campaign =>
        filters.type!.includes(campaign.type)
      );
    }

    // Filtrage par date
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filteredCampaigns = filteredCampaigns.filter(campaign => {
        const campaignDate = new Date(campaign.createdAt);
        return campaignDate >= startDate && campaignDate <= endDate;
      });
    }

    return {
      campaigns: filteredCampaigns,
      total: filteredCampaigns.length,
      page: 1,
      limit: 10,
      hasMore: false
    };
  },

  createCampaign(data: CreateCampaignRequest): Campaign {
    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: data.name,
      subject: data.subject,
      status: 'draft',
      type: data.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scheduledAt: data.scheduledAt,
      content: data.content,
      recipients: {
        ...data.recipients,
        totalCount: data.recipients.listIds.length * 100 // Simulation
      },
      settings: data.settings,
      stats: {
        delivered: 0,
        sent: 0,
        opens: 0,
        clicks: 0,
        bounces: 0,
        unsubscribes: 0,
        openRate: 0,
        deliveryRate: 0,
        complaintRate: 0,
        complaints: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0
      }
    };

    this.campaigns.push(newCampaign);
    return newCampaign;
  },

  updateCampaign(id: string, data: Partial<CreateCampaignRequest>): Campaign {
    const campaignIndex = this.campaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      throw new Error('Campagne non trouvée');
    }

    const existingCampaign = this.campaigns[campaignIndex];
    const updatedCampaign: Campaign = {
      ...existingCampaign,
      ...data,
      id: existingCampaign.id, // Préserver l'ID
      updatedAt: new Date().toISOString(),
      recipients: data.recipients ? {
        ...existingCampaign.recipients,
        ...data.recipients,
        totalCount: data.recipients.listIds ? data.recipients.listIds.length * 100 : existingCampaign.recipients.totalCount
      } : existingCampaign.recipients,
      content: data.content ? {
        ...existingCampaign.content,
        ...data.content
      } : existingCampaign.content,
      settings: data.settings ? {
        ...existingCampaign.settings,
        ...data.settings
      } : existingCampaign.settings
    };

    this.campaigns[campaignIndex] = updatedCampaign;
    return updatedCampaign;
  },

  deleteCampaign(id: string): void {
    const campaignIndex = this.campaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      throw new Error('Campagne non trouvée');
    }
    this.campaigns.splice(campaignIndex, 1);
  },

  getCampaign(id: string): Campaign {
    const campaign = this.campaigns.find(c => c.id === id);
    if (!campaign) {
      throw new Error('Campagne non trouvée');
    }
    return campaign;
  },

  duplicateCampaign(id: string, name: string): Campaign {
    const originalCampaign = this.getCampaign(id);
    const duplicatedCampaign: Campaign = {
      ...originalCampaign,
      id: `campaign-${Date.now()}`,
      name,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: undefined,
      scheduledAt: undefined,
      stats: {
        sent: 0,
        delivered: 0,
        opens: 0,
        clicks: 0,
        bounces: 0,
        unsubscribes: 0,
        complaints: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0,
        complaintRate: 0
      }
    };
    this.campaigns.push(duplicatedCampaign);
    return duplicatedCampaign;
  },

  sendCampaign(id: string): Campaign {
    const campaignIndex = this.campaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      throw new Error('Campagne non trouvée');
    }
    
    const campaign = this.campaigns[campaignIndex];
    const sentCampaign: Campaign = {
      ...campaign,
      status: 'sent',
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.campaigns[campaignIndex] = sentCampaign;
    return sentCampaign;
  }
};
