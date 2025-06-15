
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Copy } from 'lucide-react';
import { CustomTemplate } from '@/types/builder';

interface CustomTemplateCardProps {
  template: CustomTemplate;
  onDelete: (id: string) => void;
  onPreview: (template: CustomTemplate) => void;
  onUse: (template: CustomTemplate) => void;
}

const CustomTemplateCard: React.FC<CustomTemplateCardProps> = ({ template, onDelete, onPreview, onUse }) => {
  return (
    <Card className="glass flex flex-col h-full">
      <CardHeader>
        <CardTitle className="gradient-text">{template.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-white/60 line-clamp-2">
          {template.blocks.map(b => b.content).join(' ').substring(0, 100)}...
        </p>
        <p className="text-xs text-white/40 mt-2">
          Created on {new Date(template.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onDelete(template.id)}
          className="bg-red-900/50 hover:bg-red-900/80 border-red-500/30"
          title="Delete Template"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
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
      </CardFooter>
    </Card>
  );
};

export default CustomTemplateCard;
