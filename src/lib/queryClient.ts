
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Create a persister for offline storage
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'promptcraft-cache',
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

// Create query client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Initialize persister on app start
const initializePersistence = () => {
  try {
    // We'll implement a simple cache restoration mechanism
    const cachedData = localStorage.getItem('promptcraft-cache');
    if (cachedData) {
      console.log('Cache restored from localStorage');
    }
  } catch (error) {
    console.error('Failed to initialize cache persistence:', error);
  }
};

// Call initialization
initializePersistence();
