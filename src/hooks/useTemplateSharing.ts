
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CustomTemplate } from '@/types/builder';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useTemplateSharing = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [isLoadingShared, setIsLoadingShared] = useState(false);

  const shareTemplate = async (template: CustomTemplate, makePublic: boolean = false) => {
    setIsSharing(true);
    try {
      const shareUrl = `${window.location.origin}/templates/shared/${template.id}`;
      
      // For now, just copy the URL to clipboard
      // In the future, we can add a public sharing feature when the database schema supports it
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Template Shared",
        description: "Share URL copied to clipboard",
      });

      logger.info('Template shared', 'useTemplateSharing', { 
        templateId: template.id, 
        makePublic 
      });

      return shareUrl;
    } catch (error) {
      logger.error('Error sharing template', 'useTemplateSharing', { error });
      toast({
        title: "Error",
        description: "Could not share template.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  const loadSharedTemplate = async (templateId: string) => {
    setIsLoadingShared(true);
    try {
      // Try to load the template (for now, we'll load any template by ID)
      const { data, error } = await supabase
        .from('custom_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Template not found');
      }

      const sharedTemplate: CustomTemplate & { authorName?: string } = {
        id: data.id,
        name: data.name,
        blocks: data.prompt as any,
        createdAt: data.created_at,
        authorName: 'Anonymous', // We'll add author info when profiles are available
      };

      return sharedTemplate;
    } catch (error) {
      logger.error('Error loading shared template', 'useTemplateSharing', { error });
      toast({
        title: "Error",
        description: "Could not load shared template.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoadingShared(false);
    }
  };

  return {
    shareTemplate,
    loadSharedTemplate,
    isSharing,
    isLoadingShared,
  };
};
