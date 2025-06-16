import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp: string;
}

const ANALYTICS_STORAGE_KEY = 'promptcraft-analytics';
const BATCH_SIZE = 50;
const FLUSH_INTERVAL = 60000; // 1 minute

export const useAnalytics = () => {
  const { session } = useAuth();

  const track = useCallback((event: string, properties?: Record<string, any>) => {
    try {
      const analyticsEvent: AnalyticsEvent = {
        event,
        properties,
        userId: session?.user?.id,
        timestamp: new Date().toISOString(),
      };

      // Store locally for batching
      const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
      events.push(analyticsEvent);

      // Keep only last 1000 events to prevent storage bloat
      const recentEvents = events.slice(-1000);
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(recentEvents));

      logger.info(`Analytics event tracked: ${event}`, 'useAnalytics', properties);

      // Auto-flush if batch size reached
      if (recentEvents.length >= BATCH_SIZE) {
        flushEvents();
      }
    } catch (error) {
      logger.error('Failed to track analytics event', 'useAnalytics', error);
    }
  }, [session]);

  const flushEvents = useCallback(async () => {
    try {
      const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (!stored) return;

      const events: AnalyticsEvent[] = JSON.parse(stored);
      if (events.length === 0) return;

      // In a real app, send to analytics service
      // await sendToAnalyticsService(events);
      
      // For now, just log the summary
      const eventSummary = events.reduce((acc, event) => {
        acc[event.event] = (acc[event.event] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      logger.info('Analytics batch flushed', 'useAnalytics', { 
        eventCount: events.length, 
        summary: eventSummary 
      });

      // Clear stored events after successful flush
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      logger.error('Failed to flush analytics events', 'useAnalytics', error);
    }
  }, []);

  const getAnalytics = useCallback(() => {
    try {
      const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
      
      // Calculate basic metrics
      const totalEvents = events.length;
      const uniqueEvents = new Set(events.map(e => e.event)).size;
      const sessionsToday = events.filter(e => {
        const eventDate = new Date(e.timestamp);
        const today = new Date();
        return eventDate.toDateString() === today.toDateString();
      });

      const eventCounts = events.reduce((acc, event) => {
        acc[event.event] = (acc[event.event] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalEvents,
        uniqueEvents,
        sessionsToday: sessionsToday.length,
        eventCounts,
        recentEvents: events.slice(-10), // Last 10 events
      };
    } catch (error) {
      logger.error('Failed to get analytics', 'useAnalytics', error);
      return null;
    }
  }, []);

  // Auto-flush events periodically
  useEffect(() => {
    const interval = setInterval(flushEvents, FLUSH_INTERVAL);
    return () => clearInterval(interval);
  }, [flushEvents]);

  // Flush events on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushEvents();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [flushEvents]);

  return {
    track,
    flushEvents,
    getAnalytics,
  };
};
