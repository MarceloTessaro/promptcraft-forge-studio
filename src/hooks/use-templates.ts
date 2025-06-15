
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CustomTemplate, PromptBlock } from '@/types/builder';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useTemplates = () => {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { session } = useAuth();

  // Load custom templates from Supabase and localStorage
  const loadCustomTemplates = async () => {
    setIsLoading(true);
    try {
      let templates: CustomTemplate[] = [];
      
      if (session?.user) {
        // Load from Supabase for authenticated users
        const { data, error } = await supabase
          .from('custom_templates')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        templates = data?.map(template => ({
          id: template.id,
          name: template.name,
          blocks: (template.prompt as unknown as PromptBlock[]) || [],
          createdAt: template.created_at,
        })) || [];
      } else {
        // Load from localStorage for non-authenticated users
        const savedTemplates = localStorage.getItem('customTemplates');
        if (savedTemplates) {
          templates = JSON.parse(savedTemplates);
        }
      }
      
      setCustomTemplates(templates);
    } catch (error) {
      logger.error('Error loading custom templates', 'useTemplates', { error });
      toast({
        title: "Error",
        description: "Could not load your custom templates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save template
  const saveTemplate = async (template: Omit<CustomTemplate, 'id' | 'createdAt'>) => {
    setIsSaving(true);
    try {
      const newTemplate: CustomTemplate = {
        ...template,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      if (session?.user) {
        // Save to Supabase for authenticated users
        const { error } = await supabase
          .from('custom_templates')
          .insert({
            id: newTemplate.id,
            name: newTemplate.name,
            prompt: newTemplate.blocks as any,
            user_id: session.user.id,
          });

        if (error) throw error;
      } else {
        // Save to localStorage for non-authenticated users
        const updatedTemplates = [...customTemplates, newTemplate];
        localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates));
        setCustomTemplates(updatedTemplates);
      }

      toast({
        title: "Template Saved",
        description: `"${template.name}" has been saved to your templates.`,
      });

      // Reload templates to get the latest data
      if (session?.user) {
        await loadCustomTemplates();
      }

      logger.info('Template saved successfully', 'useTemplates', { templateName: template.name });
    } catch (error) {
      logger.error('Error saving template', 'useTemplates', { error });
      toast({
        title: "Error",
        description: "Could not save template.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete template
  const deleteTemplate = async (templateId: string) => {
    try {
      if (session?.user) {
        // Delete from Supabase
        const { error } = await supabase
          .from('custom_templates')
          .delete()
          .eq('id', templateId)
          .eq('user_id', session.user.id);

        if (error) throw error;
      } else {
        // Delete from localStorage
        const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
        localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates));
        setCustomTemplates(updatedTemplates);
      }

      toast({
        title: "Template Deleted",
        description: "Template has been removed from your collection.",
      });

      // Reload templates to get the latest data
      if (session?.user) {
        await loadCustomTemplates();
      }

      logger.info('Template deleted successfully', 'useTemplates', { templateId });
    } catch (error) {
      logger.error('Error deleting template', 'useTemplates', { error });
      toast({
        title: "Error",
        description: "Could not delete template.",
        variant: "destructive",
      });
    }
  };

  // Load templates when component mounts or session changes
  useEffect(() => {
    loadCustomTemplates();
  }, [session?.user?.id]);

  return {
    customTemplates,
    isLoading,
    isSaving,
    loadCustomTemplates,
    saveTemplate,
    deleteTemplate,
  };
};
