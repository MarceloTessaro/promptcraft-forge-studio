
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { validatePromptContent } from '@/utils/validation';

export const useAIPreview = () => {
  const [aiPreview, setAiPreview] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
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

    // Validate prompt content for security
    const validation = validatePromptContent(assembledPrompt);
    if (!validation.isValid) {
      toast({
        title: "Invalid Content",
        description: validation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsPreviewLoading(true);
    setPreviewError('');
    setAiPreview('');

    try {
      logger.info('Starting AI preview generation', 'AIPreview', { 
        promptLength: assembledPrompt.length,
        retryCount 
      });

      const { data, error } = await supabase.functions.invoke('openai-preview', {
        body: { prompt: assembledPrompt }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate preview');
      }

      if (!data || !data.content) {
        throw new Error('No content received from AI service');
      }

      setAiPreview(data.content);
      setRetryCount(0); // Reset retry count on success
      logger.info('AI preview generated successfully', 'AIPreview');
      
      toast({
        title: "Preview Generated",
        description: "AI preview has been generated successfully.",
      });
      
    } catch (error: any) {
      logger.error('AI preview generation failed', 'AIPreview', error);
      
      // Enhanced error handling with user-friendly messages
      let userMessage = 'Failed to generate preview. Please try again.';
      
      if (error.message.includes('Rate limit')) {
        userMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.message.includes('timeout')) {
        userMessage = 'Request timed out. Please try again with a shorter prompt.';
      } else if (error.message.includes('authentication')) {
        userMessage = 'Service authentication error. Please contact support.';
      } else if (error.message.includes('Service is busy')) {
        userMessage = 'AI service is currently busy. Please try again in a few moments.';
      }
      
      setPreviewError(userMessage);
      setRetryCount(prev => prev + 1);
      
      toast({
        title: "Preview Generation Failed",
        description: userMessage,
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  }, [handleAsyncError, retryCount]);

  const retryGeneration = useCallback((assembledPrompt: string) => {
    if (retryCount < 3) {
      generatePreview(assembledPrompt);
    } else {
      toast({
        title: "Maximum Retries Reached",
        description: "Please check your prompt and try again later.",
        variant: "destructive",
      });
    }
  }, [generatePreview, retryCount]);

  return {
    aiPreview,
    isPreviewLoading,
    previewError,
    retryCount,
    generatePreview,
    retryGeneration,
  };
};
