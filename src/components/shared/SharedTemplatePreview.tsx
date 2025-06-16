
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Download, Calendar, User, Eye } from 'lucide-react';
import { SharedTemplate } from '@/types/shared';
import { useAuth } from '@/contexts/AuthContext';
import PromptDisplay from '@/components/builder/PromptDisplay';

interface SharedTemplatePreviewProps {
  template: SharedTemplate | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLike: (templateId: string, isLiked: boolean) => void;
  onDownload: (template: SharedTemplate) => void;
  isToggling?: boolean;
}

const SharedTemplatePreview: React.FC<SharedTemplatePreviewProps> = ({
  template,
  isOpen,
  onOpenChange,
  onLike,
  onDownload,
  isToggling = false,
}) => {
  const { user } = useAuth();

  if (!template) return null;

  const handleLike = () => {
    onLike(template.id, template.is_liked || false);
  };

  const handleDownload = () => {
    onDownload(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <DialogTitle className="gradient-text text-2xl mb-2">
                {template.title}
              </DialogTitle>
              
              <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {template.author_name || 'Anónimo'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(template.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {template.likes_count}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {template.downloads_count}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Vista previa
                </div>
              </div>

              {template.description && (
                <p className="text-white/80 mb-4">{template.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {template.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-purple-900/30 text-purple-300 border-purple-700/50"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              {user && (
                <Button
                  variant={template.is_liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  disabled={isToggling}
                  className={
                    template.is_liked
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  <Heart className={`w-4 h-4 mr-1 ${template.is_liked ? 'fill-current' : ''}`} />
                  {template.is_liked ? 'Liked' : 'Like'}
                </Button>
              )}

              <Button
                onClick={handleDownload}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="w-4 h-4 mr-1" />
                Usar Plantilla
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Vista Previa del Prompt</h3>
            <PromptDisplay
              blocks={template.blocks}
              variableValues={{}}
              className="bg-zinc-800/50 border-zinc-700"
            />
            
            <div className="mt-6">
              <h4 className="text-md font-semibold text-white mb-3">Bloques del Prompt</h4>
              <div className="space-y-3">
                {template.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="text-xs border-white/20 text-white/80"
                      >
                        {block.type}
                      </Badge>
                      <span className="text-xs text-white/50">Bloque {index + 1}</span>
                    </div>
                    <p className="text-white/90 text-sm whitespace-pre-wrap">
                      {block.content || block.placeholder}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SharedTemplatePreview;
