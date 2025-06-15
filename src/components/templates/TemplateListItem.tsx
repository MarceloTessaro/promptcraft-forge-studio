
```tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Eye, Copy } from 'lucide-react';
import { LibraryTemplate } from '@/types/templates';

interface TemplateListItemProps {
  template: LibraryTemplate;
  onPreview: (template: LibraryTemplate) => void;
  onUse: (template: LibraryTemplate) => void;
}

const TemplateListItem: React.FC<TemplateListItemProps> = ({ template, onPreview, onUse }) => {
  return (
    <Card className="glass p-4 hover:glow transition-all duration-300 flex items-center justify-between w-full">
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="text-md font-semibold text-white truncate">{template.title}</h3>
        <p className="text-sm text-white/70 truncate">{template.description}</p>
      </div>
      
      <div className="hidden md:flex items-center gap-2 mx-4 flex-shrink-0">
        <Badge variant="secondary" className="text-xs">{template.category}</Badge>
        <Badge
          className={`text-xs ${
            template.difficulty === 'Beginner' ? 'bg-green-600' :
            template.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'
          }`}
        >
          {template.difficulty}
        </Badge>
        <div className="flex items-center text-yellow-400">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm ml-1">{template.rating}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm text-white/60 hidden lg:inline">{template.uses.toLocaleString()} uses</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPreview(template)}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Eye className="w-4 h-4 md:mr-1" />
          <span className="hidden md:inline">Preview</span>
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
    </Card>
  );
};

export default TemplateListItem;
```
