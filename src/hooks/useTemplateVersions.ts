
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TemplateVersion } from '@/types/shared';
import { PromptBlock } from '@/types/builder';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useTemplateVersions = (templateId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch template versions
  const {
    data: versions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['template-versions', templateId],
    queryFn: async () => {
      if (!templateId) return [];

      const { data, error } = await supabase
        .from('template_versions')
        .select('*')
        .eq('template_id', templateId)
        .order('version_number', { ascending: false });

      if (error) throw error;

      return data?.map(version => ({
        ...version,
        blocks: version.blocks as PromptBlock[],
      })) as TemplateVersion[];
    },
    enabled: !!templateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create new version mutation
  const createVersionMutation = useMutation({
    mutationFn: async (params: {
      templateId: string;
      blocks: PromptBlock[];
      changeDescription?: string;
    }) => {
      if (!user) throw new Error('Must be authenticated');

      // Get the latest version number
      const { data: latestVersion } = await supabase
        .from('template_versions')
        .select('version_number')
        .eq('template_id', params.templateId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      const nextVersionNumber = (latestVersion?.version_number || 0) + 1;

      const { data, error } = await supabase
        .from('template_versions')
        .insert({
          template_id: params.templateId,
          version_number: nextVersionNumber,
          blocks: params.blocks as any,
          change_description: params.changeDescription,
        })
        .select()
        .single();

      if (error) throw error;

      // Also update the main template with the latest blocks
      await supabase
        .from('shared_templates')
        .update({
          blocks: params.blocks as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.templateId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-versions'] });
      queryClient.invalidateQueries({ queryKey: ['shared-templates'] });
      toast({
        title: "Nueva Versión Creada",
        description: "Se ha guardado una nueva versión de la plantilla.",
      });
      logger.info('Template version created successfully', 'useTemplateVersions');
    },
    onError: (error) => {
      logger.error('Error creating template version', 'useTemplateVersions', error);
      toast({
        title: "Error",
        description: "No se pudo crear la nueva versión.",
        variant: "destructive",
      });
    },
  });

  const createVersion = async (params: {
    templateId: string;
    blocks: PromptBlock[];
    changeDescription?: string;
  }) => {
    return await createVersionMutation.mutateAsync(params);
  };

  return {
    versions,
    isLoading,
    error,
    createVersion,
    isCreatingVersion: createVersionMutation.isPending,
  };
};
