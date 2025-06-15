
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Star } from 'lucide-react';
import { LibraryTemplate } from '@/types/templates';

interface TemplateCardProps {
  template: LibraryTemplate;
  onPreview: (template: LibraryTemplate) => void;
  onUse: (template: LibraryTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPreview, onUse }) => {
  return (
    <Card className="glass flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="gradient-text">{template.title}</CardTitle>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4" fill="currentColor" />
            <span className="text-sm font-bold text-white">{template.rating}</span>
          </div>
        </div>
        <CardDescription className="text-white/60">{template.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-white/80 line-clamp-3">
          {template.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-white/50">{template.uses.toLocaleString()} uses</div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onPreview(template)}
            className="border-white/20 text-white hover:bg-white/10"
            title="Preview Template"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => onUse(template)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Copy className="w-4 h-4 mr-1" />
            Use
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
