
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SharedTemplate, TemplateVersion } from '@/types/shared';
import { PromptBlock } from '@/types/builder';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useSharedTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'likes' | 'downloads' | 'created_at'>('likes');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch public shared templates
  const {
    data: sharedTemplates = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['shared-templates', searchTerm, selectedTags, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('shared_templates')
        .select(`
          *,
          template_likes!left(user_id)
        `)
        .eq('is_public', true);

      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply tags filter
      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags);
      }

      // Apply sorting
      if (sortBy === 'likes') {
        query = query.order('likes_count', { ascending: false });
      } else if (sortBy === 'downloads') {
        query = query.order('downloads_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(template => ({
        ...template,
        blocks: template.blocks as PromptBlock[],
        is_liked: user ? template.template_likes.some((like: any) => like.user_id === user.id) : false,
      })) as SharedTemplate[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Publish template mutation
  const publishTemplateMutation = useMutation({
    mutationFn: async (params: {
      title: string;
      description?: string;
      blocks: PromptBlock[];
      tags: string[];
      isPublic: boolean;
    }) => {
      if (!user) throw new Error('Must be authenticated');

      const { data, error } = await supabase
        .from('shared_templates')
        .insert({
          user_id: user.id,
          title: params.title,
          description: params.description,
          blocks: params.blocks as any,
          tags: params.tags,
          is_public: params.isPublic,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-templates'] });
      toast({
        title: "Plantilla Publicada",
        description: "Tu plantilla ha sido compartida con la comunidad.",
      });
      logger.info('Template published successfully', 'useSharedTemplates');
    },
    onError: (error) => {
      logger.error('Error publishing template', 'useSharedTemplates', error);
      toast({
        title: "Error",
        description: "No se pudo publicar la plantilla.",
        variant: "destructive",
      });
    },
  });

  // Like template mutation  
  const likeTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      if (!user) throw new Error('Must be authenticated');

      const { error } = await supabase
        .from('template_likes')
        .insert({
          user_id: user.id,
          template_id: templateId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-templates'] });
    },
  });

  // Unlike template mutation
  const unlikeTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      if (!user) throw new Error('Must be authenticated');

      const { error } = await supabase
        .from('template_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('template_id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-templates'] });
    },
  });

  // Download template mutation
  const downloadTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from('template_downloads')
        .insert({
          user_id: user?.id,
          template_id: templateId,
          user_agent: navigator.userAgent,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-templates'] });
    },
  });

  const toggleLike = async (templateId: string, isLiked: boolean) => {
    if (!user) {
      toast({
        title: "Autenticación Requerida",
        description: "Debes iniciar sesión para dar like a las plantillas.",
        variant: "destructive",
      });
      return;
    }

    if (isLiked) {
      await unlikeTemplateMutation.mutateAsync(templateId);
    } else {
      await likeTemplateMutation.mutateAsync(templateId);
    }
  };

  const downloadTemplate = async (template: SharedTemplate) => {
    await downloadTemplateMutation.mutateAsync(template.id);
    
    // Return the template blocks for use in the builder
    return template.blocks;
  };

  const publishTemplate = async (params: {
    title: string;
    description?: string;
    blocks: PromptBlock[];
    tags: string[];
    isPublic: boolean;
  }) => {
    return await publishTemplateMutation.mutateAsync(params);
  };

  return {
    sharedTemplates,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    sortBy,
    setSortBy,
    toggleLike,
    downloadTemplate,
    publishTemplate,
    isPublishing: publishTemplateMutation.isPending,
    isToggling: likeTemplateMutation.isPending || unlikeTemplateMutation.isPending,
  };
};
