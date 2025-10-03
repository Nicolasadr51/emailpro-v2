import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from '../useCampaigns';
import { campaignService } from '../../services/campaignService';

// Mock du module complet
jest.mock('../../services/campaignService', () => ({
  __esModule: true,
  campaignService: {
    getCampaigns: jest.fn(),
    createCampaign: jest.fn(),
    updateCampaign: jest.fn(),
    deleteCampaign: jest.fn(),
    getCampaign: jest.fn(),
    duplicateCampaign: jest.fn(),
    sendCampaign: jest.fn(),
    scheduleCampaign: jest.fn(),
    getCampaignStats: jest.fn(),
    testCampaign: jest.fn(),
    previewCampaign: jest.fn(),
  },
}));

// Cast du service mocké
const mockedCampaignService = campaignService as jest.Mocked<typeof campaignService>;

// Mock du store
jest.mock('../../store/useAppStore', () => ({
  useNotifications: () => ({
    addNotification: jest.fn(),
  }),
}));

// Helper pour créer un wrapper avec QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Données de test
const mockCampaign = {
  id: '1',
  name: 'Test Campaign',
  subject: 'Test Subject',
  type: 'newsletter' as const,
  status: 'draft' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  listIds: ['list1'],
  stats: {
    sent: 100,
    opens: 25,
    clicks: 5,
    bounces: 2,
    unsubscribes: 1,
    openRate: 25,
    clickRate: 5,
    bounceRate: 2,
    unsubscribeRate: 1,
  },
};

const mockCampaignsResponse = {
  campaigns: [mockCampaign],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('useCampaigns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch campaigns successfully', async () => {
    mockedCampaignService.getCampaigns.mockResolvedValue(mockCampaignsResponse);

    const { result } = renderHook(() => useCampaigns(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCampaignsResponse);
    expect(mockedCampaignService.getCampaigns).toHaveBeenCalledWith(undefined, 1, 10);
  });

  it('should handle fetch error', async () => {
    const error = new Error('Network error');
    mockedCampaignService.getCampaigns.mockRejectedValue(error);

    const { result } = renderHook(() => useCampaigns(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useCreateCampaign', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create campaign successfully', async () => {
    const newCampaign = { 
      name: 'New Campaign', 
      subject: 'New Subject', 
      type: 'newsletter' as const, 
      listIds: ['list1'] 
    };
    mockedCampaignService.createCampaign.mockResolvedValue(mockCampaign);

    const { result } = renderHook(() => useCreateCampaign(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newCampaign);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCampaign);
    expect(mockedCampaignService.createCampaign).toHaveBeenCalledWith(newCampaign);
  });
});

describe('useUpdateCampaign', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update campaign successfully', async () => {
    const updates = { name: 'Updated Campaign' };
    const updatedCampaign = { ...mockCampaign, ...updates };
    mockedCampaignService.updateCampaign.mockResolvedValue(updatedCampaign);

    const { result } = renderHook(() => useUpdateCampaign(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: '1', data: updates });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(updatedCampaign);
    expect(mockedCampaignService.updateCampaign).toHaveBeenCalledWith('1', updates);
  });
});

describe('useDeleteCampaign', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete campaign successfully', async () => {
    mockedCampaignService.deleteCampaign.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteCampaign(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('1');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedCampaignService.deleteCampaign).toHaveBeenCalledWith('1');
  });
});
