
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Copy } from 'lucide-react';
import { CustomTemplate } from '@/types/builder';
import { LibraryTemplate } from '@/types/templates';

interface TemplateListItemProps {
  template: LibraryTemplate | CustomTemplate;
  onDelete?: (id: string) => void;
  onPreview: (template: LibraryTemplate | CustomTemplate) => void;
  onUse: (template: LibraryTemplate | CustomTemplate) => void;
}

const TemplateListItem: React.FC<TemplateListItemProps> = ({ template, onDelete, onPreview, onUse }) => {
  const isCustom = 'name' in template;
  const title = isCustom ? template.name : template.title;
  const createdDate = isCustom ? new Date(template.createdAt).toLocaleDateString() : null;

  return (
    <div className="flex items-center justify-between p-4 glass rounded-lg hover:bg-white/5 transition-colors w-full">
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-white">{title}</p>
        {isCustom && createdDate && (
          <p className="text-sm text-white/60">
            Created on {createdDate}
          </p>
        )}
        {!isCustom && 'category' in template && (
           <p className="text-sm text-white/60">{template.category}</p>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
        {isCustom && onDelete && (
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(template.id)}
            className="bg-red-900/50 hover:bg-red-900/80 border-red-500/30"
            title="Delete Template"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
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
    </div>
  );
};

export default TemplateListItem;
