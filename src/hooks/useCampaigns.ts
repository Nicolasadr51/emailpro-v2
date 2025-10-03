import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services/campaignService';
import { mockCampaignData } from '../mocks/mockCampaignData';
import { 
  Campaign, 
  CreateCampaignRequest, 
  UpdateCampaignRequest, 
  CampaignFilters 
} from '../types/campaign';
import { useNotifications } from '../store/useAppStore';

// Clés de requête pour React Query
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters?: CampaignFilters) => [...campaignKeys.lists(), filters] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
  stats: (id: string) => [...campaignKeys.detail(id), 'stats'] as const,
};

// Hook pour récupérer la liste des campagnes
export const useCampaigns = (filters?: CampaignFilters, page = 1, limit = 10) => {
  return useQuery({
    queryKey: campaignKeys.list(filters),
    queryFn: async () => {
      // En mode développement, utiliser les données factices
      if (process.env.NODE_ENV === 'development') {
        const campaigns = mockCampaignData.campaigns;
        
        // Simuler le filtrage
        let filteredCampaigns = campaigns;
        
        if (filters?.status?.length) {
          filteredCampaigns = filteredCampaigns.filter(c => 
            filters.status!.includes(c.status)
          );
        }
        
        if (filters?.search) {
          const search = filters.search.toLowerCase();
          filteredCampaigns = filteredCampaigns.filter(c => 
            c.name.toLowerCase().includes(search) ||
            c.subject.toLowerCase().includes(search)
          );
        }
        
        // Simuler la pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedCampaigns = filteredCampaigns.slice(start, end);
        
        return {
          campaigns: paginatedCampaigns,
          total: filteredCampaigns.length,
          page,
          limit,
          hasMore: end < filteredCampaigns.length
        };
      }
      
      return campaignService.getCampaigns(filters, page, limit);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer une campagne spécifique
export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: async () => {
      // En mode développement, utiliser les données factices
      if (process.env.NODE_ENV === 'development') {
        const campaign = mockCampaignData.campaigns.find(c => c.id === id);
        if (!campaign) {
          throw new Error('Campagne non trouvée');
        }
        return campaign;
      }
      
      return campaignService.getCampaign(id);
    },
    enabled: !!id,
  });
};

// Hook pour récupérer les statistiques d'une campagne
export const useCampaignStats = (id: string) => {
  return useQuery({
    queryKey: campaignKeys.stats(id),
    queryFn: async () => {
      // En mode développement, utiliser les données factices
      if (process.env.NODE_ENV === 'development') {
        const campaign = mockCampaignData.campaigns.find(c => c.id === id);
        return campaign?.stats || null;
      }
      
      return campaignService.getCampaignStats(id);
    },
    enabled: !!id,
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });
};

// Hook pour créer une campagne
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => {
      // En mode développement, simuler la création
      if (process.env.NODE_ENV === 'development') {
        const newCampaign: Campaign = {
          id: Date.now().toString(),
          ...data,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          recipients: {
            ...data.recipients,
            totalCount: 0
          }
        };
        
        return Promise.resolve(newCampaign);
      }
      
      return campaignService.createCampaign(data);
    },
    onSuccess: (newCampaign) => {
      // Invalider et refetch les listes de campagnes
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      
      // Ajouter la nouvelle campagne au cache
      queryClient.setQueryData(
        campaignKeys.detail(newCampaign.id),
        newCampaign
      );
      
      addNotification({
        type: 'success',
        title: 'Campagne créée',
        message: `La campagne "${newCampaign.name}" a été créée avec succès.`
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Erreur de création',
        message: error.message
      });
    },
  });
};

// Hook pour mettre à jour une campagne
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignRequest }) => {
      // En mode développement, simuler la mise à jour
      if (process.env.NODE_ENV === 'development') {
        const existingCampaign = mockCampaignData.campaigns.find(c => c.id === id);
        if (!existingCampaign) {
          throw new Error('Campagne non trouvée');
        }
        
        const updatedCampaign: Campaign = {
          ...existingCampaign,
          ...data,
          updatedAt: new Date().toISOString(),
          recipients: {
            ...existingCampaign.recipients,
            ...data.recipients
          }
        };
        
        return Promise.resolve(updatedCampaign);
      }
      
      return campaignService.updateCampaign(id, data);
    },
    onSuccess: (updatedCampaign) => {
      // Mettre à jour le cache
      queryClient.setQueryData(
        campaignKeys.detail(updatedCampaign.id),
        updatedCampaign
      );
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      
      addNotification({
        type: 'success',
        title: 'Campagne mise à jour',
        message: `La campagne "${updatedCampaign.name}" a été mise à jour.`
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Erreur de mise à jour',
        message: error.message
      });
    },
  });
};

// Hook pour supprimer une campagne
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (id: string) => {
      // En mode développement, simuler la suppression
      if (process.env.NODE_ENV === 'development') {
        return Promise.resolve();
      }
      
      return campaignService.deleteCampaign(id);
    },
    onSuccess: (_, deletedId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: campaignKeys.detail(deletedId) });
      
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      
      addNotification({
        type: 'success',
        title: 'Campagne supprimée',
        message: 'La campagne a été supprimée avec succès.'
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Erreur de suppression',
        message: error.message
      });
    },
  });
};

// Hook pour dupliquer une campagne
export const useDuplicateCampaign = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) => {
      // En mode développement, simuler la duplication
      if (process.env.NODE_ENV === 'development') {
        const originalCampaign = mockCampaignData.campaigns.find(c => c.id === id);
        if (!originalCampaign) {
          throw new Error('Campagne non trouvée');
        }
        
        const duplicatedCampaign: Campaign = {
          ...originalCampaign,
          id: Date.now().toString(),
          name: name || `${originalCampaign.name} (Copie)`,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sentAt: undefined,
          scheduledAt: undefined,
          stats: undefined
        };
        
        return Promise.resolve(duplicatedCampaign);
      }
      
      return campaignService.duplicateCampaign(id, name);
    },
    onSuccess: (duplicatedCampaign) => {
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      
      // Ajouter au cache
      queryClient.setQueryData(
        campaignKeys.detail(duplicatedCampaign.id),
        duplicatedCampaign
      );
      
      addNotification({
        type: 'success',
        title: 'Campagne dupliquée',
        message: `La campagne "${duplicatedCampaign.name}" a été créée.`
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Erreur de duplication',
        message: error.message
      });
    },
  });
};

// Hook pour envoyer une campagne
export const useSendCampaign = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: (id: string) => {
      // En mode développement, simuler l'envoi
      if (process.env.NODE_ENV === 'development') {
        const campaign = mockCampaignData.campaigns.find(c => c.id === id);
        if (!campaign) {
          throw new Error('Campagne non trouvée');
        }
        
        const sentCampaign: Campaign = {
          ...campaign,
          status: 'sending',
          updatedAt: new Date().toISOString()
        };
        
        return Promise.resolve(sentCampaign);
      }
      
      return campaignService.sendCampaign(id);
    },
    onSuccess: (sentCampaign) => {
      // Mettre à jour le cache
      queryClient.setQueryData(
        campaignKeys.detail(sentCampaign.id),
        sentCampaign
      );
      
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      
      addNotification({
        type: 'success',
        title: 'Campagne en cours d\'envoi',
        message: `La campagne "${sentCampaign.name}" est en cours d'envoi.`
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Erreur d\'envoi',
        message: error.message
      });
    },
  });
};
