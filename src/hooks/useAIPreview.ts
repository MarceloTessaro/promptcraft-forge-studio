
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

export const useAIPreview = () => {
  const [aiPreview, setAiPreview] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const { handleAsyncError } = useErrorHandler();

  const generatePreview = useCallback(async (assembledPrompt: string) => {
    if (!assembledPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please add some content to your prompt blocks first.",
        variant: "destructive",
      });
      return;
    }

    setIsPreviewLoading(true);
    setPreviewError('');
    setAiPreview('');

    try {
      logger.info('Starting AI preview generation', 'AIPreview', { promptLength: assembledPrompt.length });

      const { data, error } = await supabase.functions.invoke('openai-preview', {
        body: { prompt: assembledPrompt }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate preview');
      }

      if (!data || !data.content) {
        throw new Error('No content received from AI');
      }

      setAiPreview(data.content);
      logger.info('AI preview generated successfully', 'AIPreview');
      
    } catch (error: any) {
      logger.error('AI preview generation failed', 'AIPreview', error);
      setPreviewError(error.message);
      toast({
        title: "Preview Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  }, [handleAsyncError]);

  return {
    aiPreview,
    isPreviewLoading,
    previewError,
    generatePreview,
  };
};
