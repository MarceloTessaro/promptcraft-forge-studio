
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Filter,
  TrendingUp,
  Heart,
  Download,
  Clock,
} from 'lucide-react';
import { useSharedTemplates } from '@/hooks/useSharedTemplates';
import SharedTemplateCard from '@/components/shared/SharedTemplateCard';
import SharedTemplatePreview from '@/components/shared/SharedTemplatePreview';
import { SharedTemplate } from '@/types/shared';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [previewingTemplate, setPreviewingTemplate] = useState<SharedTemplate | null>(null);
  
  const {
    sharedTemplates,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    sortBy,
    setSortBy,
    toggleLike,
    downloadTemplate,
    isToggling,
  } = useSharedTemplates();

  // Popular tags for quick filtering
  const popularTags = [
    'escritura-creativa',
    'codigo',
    'analisis',
    'educacion',
    'negocios',
    'marketing',
    'investigacion',
    'programacion'
  ];

  const handleDownload = async (template: SharedTemplate) => {
    try {
      const blocks = await downloadTemplate(template);
      navigate('/builder', { state: { template: { blocks, name: template.title } } });
      toast({
        title: "Plantilla Descargada",
        description: `"${template.title}" está lista para usar en el builder.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar la plantilla.",
        variant: "destructive",
      });
    }
  };

  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Comunidad</h1>
          <p className="text-white/80">
            Descubre plantillas increíbles creadas por la comunidad de PromptCraft
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="glass p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                placeholder="Buscar plantillas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass border-white/20 text-white placeholder-white/50"
              />
            </div>

            {/* Sort and Filter Options */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/80">Ordenar por:</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={sortBy === 'likes' ? 'default' : 'outline'}
                    onClick={() => setSortBy('likes')}
                    className={`text-xs ${
                      sortBy === 'likes' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    Likes
                  </Button>
                  <Button
                    size="sm"
                    variant={sortBy === 'downloads' ? 'default' : 'outline'}
                    onClick={() => setSortBy('downloads')}
                    className={`text-xs ${
                      sortBy === 'downloads' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Descargas
                  </Button>
                  <Button
                    size="sm"
                    variant={sortBy === 'created_at' ? 'default' : 'outline'}
                    onClick={() => setSortBy('created_at')}
                    className={`text-xs ${
                      sortBy === 'created_at' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Recientes
                  </Button>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="space-y-2">
              <p className="text-sm text-white/80 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Etiquetas populares:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/20'
                    }`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-white/60">Filtros activos:</span>
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="default"
                      className="bg-purple-600 text-white cursor-pointer"
                      onClick={() => toggleTagFilter(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedTags([])}
                    className="text-xs text-white/60 hover:text-white"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-white/10 rounded w-16"></div>
                  <div className="h-6 bg-white/10 rounded w-20"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : sharedTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedTemplates.map((template) => (
              <SharedTemplateCard
                key={template.id}
                template={template}
                onLike={toggleLike}
                onDownload={handleDownload}
                onPreview={setPreviewingTemplate}
                isToggling={isToggling}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg mb-4">
              No se encontraron plantillas que coincidan con tus criterios.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Limpiar filtros
            </Button>
          </div>
        )}

        {/* Template Preview Dialog */}
        <SharedTemplatePreview
          template={previewingTemplate}
          isOpen={!!previewingTemplate}
          onOpenChange={(isOpen) => !isOpen && setPreviewingTemplate(null)}
          onLike={toggleLike}
          onDownload={handleDownload}
          isToggling={isToggling}
        />
      </div>
    </div>
  );
};

export default Community;
