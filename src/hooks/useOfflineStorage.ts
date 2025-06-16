
import { useCallback, useEffect, useState } from 'react';
import { PromptBlock } from '@/types/builder';
import { logger } from '@/utils/logger';

interface OfflineData {
  blocks: PromptBlock[];
  variableValues: Record<string, string>;
  lastSaved: string;
}

const STORAGE_KEY = 'promptcraft-draft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveDraft = useCallback((blocks: PromptBlock[], variableValues: Record<string, string>) => {
    try {
      const data: OfflineData = {
        blocks,
        variableValues,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date());
      logger.info('Draft saved to offline storage', 'useOfflineStorage');
    } catch (error) {
      logger.error('Failed to save draft', 'useOfflineStorage', error);
    }
  }, []);

  const loadDraft = useCallback((): OfflineData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as OfflineData;
        logger.info('Draft loaded from offline storage', 'useOfflineStorage');
        return data;
      }
    } catch (error) {
      logger.error('Failed to load draft', 'useOfflineStorage', error);
    }
    return null;
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLastSaved(null);
      logger.info('Draft cleared from offline storage', 'useOfflineStorage');
    } catch (error) {
      logger.error('Failed to clear draft', 'useOfflineStorage', error);
    }
  }, []);

  const hasDraft = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  return {
    isOnline,
    lastSaved,
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  };
};
