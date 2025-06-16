
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, Eye, Calendar, User } from 'lucide-react';
import { SharedTemplate } from '@/types/shared';
import { useAuth } from '@/contexts/AuthContext';

interface SharedTemplateCardProps {
  template: SharedTemplate;
  onLike: (templateId: string, isLiked: boolean) => void;
  onDownload: (template: SharedTemplate) => void;
  onPreview: (template: SharedTemplate) => void;
  isToggling?: boolean;
}

const SharedTemplateCard: React.FC<SharedTemplateCardProps> = ({
  template,
  onLike,
  onDownload,
  onPreview,
  isToggling = false,
}) => {
  const { user } = useAuth();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(template.id, template.is_liked || false);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(template);
  };

  const handlePreview = () => {
    onPreview(template);
  };

  return (
    <Card className="glass hover:glass-hover transition-all duration-200 cursor-pointer group">
      <CardHeader onClick={handlePreview}>
        <div className="flex justify-between items-start">
          <CardTitle className="gradient-text text-lg line-clamp-2">
            {template.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-white/60">
            <Heart className="w-4 h-4" />
            {template.likes_count}
          </div>
        </div>
        {template.description && (
          <p className="text-white/70 text-sm line-clamp-2">
            {template.description}
          </p>
        )}
      </CardHeader>

      <CardContent onClick={handlePreview}>
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-purple-900/30 text-purple-300 border-purple-700/50"
            >
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs bg-white/10 text-white/60"
            >
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {template.author_name || 'Anónimo'}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(template.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4">
        <div className="flex items-center gap-1 text-sm text-white/60">
          <Download className="w-4 h-4" />
          {template.downloads_count}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Eye className="w-4 h-4 mr-1" />
            Vista
          </Button>
          
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
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Download className="w-4 h-4 mr-1" />
            Usar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SharedTemplateCard;
