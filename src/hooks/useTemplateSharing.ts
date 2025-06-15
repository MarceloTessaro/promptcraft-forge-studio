
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
      
      if (makePublic) {
        // Update template to be public
        const { error } = await supabase
          .from('custom_templates')
          .update({ is_public: true })
          .eq('id', template.id);

        if (error) throw error;
      }

      // Copy share URL to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Template Shared",
        description: `Share URL copied to clipboard${makePublic ? ' and template made public' : ''}`,
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
      const { data, error } = await supabase
        .from('custom_templates')
        .select(`
          id,
          name,
          prompt,
          created_at,
          profiles!custom_templates_user_id_fkey(full_name)
        `)
        .eq('id', templateId)
        .eq('is_public', true)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Template not found or not public');
      }

      const sharedTemplate: CustomTemplate & { authorName?: string } = {
        id: data.id,
        name: data.name,
        blocks: data.prompt as any,
        createdAt: data.created_at,
        authorName: data.profiles?.full_name || 'Anonymous',
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
