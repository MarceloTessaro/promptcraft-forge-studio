
import { useState, useEffect } from 'react';
import { PromptBlock, CustomTemplate } from '@/types/builder';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTemplates();
    } else {
      // Load from localStorage for non-authenticated users
      loadFromLocalStorage();
    }
  }, [user]);

  const loadFromLocalStorage = () => {
    try {
      const savedTemplates = localStorage.getItem('promptTemplates');
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      logger.error('Error loading templates from localStorage', 'useTemplates', { error });
    }
  };

  const fetchTemplates = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('custom_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedTemplates: CustomTemplate[] = data.map(t => ({
          id: t.id,
          name: t.name,
          blocks: t.prompt as PromptBlock[],
          createdAt: t.created_at,
        }));
        setTemplates(formattedTemplates);
      }
    } catch (error) {
      logger.error('Error fetching templates', 'useTemplates', { error });
      toast({
        title: "Error",
        description: "Could not load your templates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (name: string, blocks: PromptBlock[]) => {
    if (!user) {
      // Save to localStorage for non-authenticated users
      const newTemplate: CustomTemplate = {
        id: uuidv4(),
        name,
        blocks: [...blocks],
        createdAt: new Date().toISOString(),
      };
      const updatedTemplates = [...templates, newTemplate];
      setTemplates(updatedTemplates);
      localStorage.setItem('promptTemplates', JSON.stringify(updatedTemplates));
      
      toast({
        title: "Template Saved",
        description: "Template saved locally. Sign in to sync across devices.",
      });
      
      return newTemplate;
    }

    try {
      const { data, error } = await supabase
        .from('custom_templates')
        .insert({
          user_id: user.id,
          name,
          prompt: blocks,
        })
        .select()
        .single();

      if (error) throw error;

      const newTemplate: CustomTemplate = {
        id: data.id,
        name: data.name,
        blocks: data.prompt as PromptBlock[],
        createdAt: data.created_at,
      };

      setTemplates(prev => [newTemplate, ...prev]);
      
      toast({
        title: "Template Saved",
        description: "Template saved successfully.",
      });

      logger.info('Template saved', 'useTemplates', { templateId: data.id });
      return newTemplate;
    } catch (error) {
      logger.error('Error saving template', 'useTemplates', { error });
      toast({
        title: "Error",
        description: "Could not save template.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loadTemplate = (template: CustomTemplate) => {
    return template.blocks.map(block => ({
      ...block,
      id: uuidv4(),
    }));
  };

  const deleteTemplate = async (id: string) => {
    if (!user) {
      // Delete from localStorage
      const updatedTemplates = templates.filter(t => t.id !== id);
      setTemplates(updatedTemplates);
      localStorage.setItem('promptTemplates', JSON.stringify(updatedTemplates));
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Template Deleted",
        description: "Template deleted successfully.",
      });

      logger.info('Template deleted', 'useTemplates', { templateId: id });
    } catch (error) {
      logger.error('Error deleting template', 'useTemplates', { error });
      toast({
        title: "Error",
        description: "Could not delete template.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    isLoading,
    refetch: fetchTemplates,
  };
};
