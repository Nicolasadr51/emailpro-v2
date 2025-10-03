import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '../useContacts';
import { contactService } from '../../services/contactService';
import { createWrapper } from '../../test-utils';

// Mock du service
jest.mock('../../services/contactService', () => ({
  __esModule: true,
  contactService: {
    getContacts: jest.fn(),
    createContact: jest.fn(),
    updateContact: jest.fn(),
    deleteContact: jest.fn(),
  },
}));

const mockedContactService = contactService as jest.Mocked<typeof contactService>;

// Mock du store selon le pattern de useCampaigns
jest.mock('../../store/useAppStore', () => ({
  useNotifications: () => ({
    addNotification: jest.fn(),
  }),
}));

// Données de test
const mockContact = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  status: 'subscribed' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockContactsResponse = {
  contacts: [mockContact],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('useContacts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch contacts successfully', async () => {
    mockedContactService.getContacts.mockResolvedValue(mockContactsResponse);

    const { result } = renderHook(() => useContacts(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockContactsResponse);
    expect(mockedContactService.getContacts).toHaveBeenCalledWith({}, 1, 10);
  });
});

describe('useCreateContact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock explicite selon Claude 4.5
    mockedContactService.createContact.mockResolvedValue(mockContact);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a contact successfully', async () => {
    const newContact = { email: 'new@example.com', firstName: 'New', lastName: 'User' };
    
    const { result } = renderHook(() => useCreateContact(), {
      wrapper: createWrapper()
    });

    await act(async () => {
      result.current.mutate(newContact);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    }, { timeout: 3000 });

    expect(result.current.data).toEqual(mockContact);
    expect(mockedContactService.createContact).toHaveBeenCalledWith(newContact);
  });

  it('should handle creation error', async () => {
    const error = new Error('Creation failed');
    mockedContactService.createContact.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCreateContact(), {
      wrapper: createWrapper()
    });

    await act(async () => {
      result.current.mutate({ email: 'test@test.com', firstName: 'Test', lastName: 'User' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });
  });
});

describe('useUpdateContact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock explicite selon Claude 4.5
    mockedContactService.updateContact.mockResolvedValue(mockContact);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a contact successfully', async () => {
    const updates = { firstName: 'Updated' };
    
    const { result } = renderHook(() => useUpdateContact(), {
      wrapper: createWrapper()
    });

    await act(async () => {
      result.current.mutate({ id: '1', data: updates });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    }, { timeout: 3000 });

    expect(result.current.data).toEqual(mockContact);
    expect(mockedContactService.updateContact).toHaveBeenCalledWith('1', updates);
  });
});

describe('useDeleteContact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock explicite selon Claude 4.5
    mockedContactService.deleteContact.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a contact successfully', async () => {
    const { result } = renderHook(() => useDeleteContact(), {
      wrapper: createWrapper()
    });

    await act(async () => {
      result.current.mutate('1');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    }, { timeout: 3000 });

    expect(mockedContactService.deleteContact).toHaveBeenCalledWith('1');
  });
});
