import { create } from 'zustand';

const mockStore = create(() => ({
  addNotification: jest.fn(),
  notifications: [],
  removeNotification: jest.fn(),
  clearNotifications: jest.fn(),
}));

export const mockZustand = {
  store: mockStore,
  reset: () => {
    const state = mockStore.getState();
    Object.keys(state).forEach(key => {
      if (typeof state[key] === 'function') {
        (state[key] as jest.Mock).mockClear();
      }
    });
  },
};

// Mock du store useAppStore
jest.mock('../store/useAppStore', () => ({
  useAppStore: (selector: any) => selector ? selector(mockZustand.store.getState()) : mockZustand.store.getState(),
}));
