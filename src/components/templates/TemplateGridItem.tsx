
```tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Eye, Copy } from 'lucide-react';
import { LibraryTemplate } from '@/types/templates';

interface TemplateGridItemProps {
  template: LibraryTemplate;
  onPreview: (template: LibraryTemplate) => void;
  onUse: (template: LibraryTemplate) => void;
}

const TemplateGridItem: React.FC<TemplateGridItemProps> = ({ template, onPreview, onUse }) => {
  return (
    <Card className="glass p-6 hover:glow transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
            <p className="text-white/70 text-sm mb-3">{template.description}</p>
          </div>
          <div className="flex items-center text-yellow-400 flex-shrink-0 ml-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm ml-1">{template.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="secondary" className="text-xs">{template.category}</Badge>
          <Badge variant="outline" className="text-xs border-white/20 text-white/80">{template.aiModel}</Badge>
          <Badge 
            className={`text-xs ${
              template.difficulty === 'Beginner' ? 'bg-green-600' :
              template.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'
            }`}
          >
            {template.difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.map((tag, index) => (
            <span key={index} className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4">
        <span className="text-sm text-white/60">{template.uses.toLocaleString()} uses</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreview(template)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
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
      </div>
    </Card>
  );
};

export default TemplateGridItem;
```
