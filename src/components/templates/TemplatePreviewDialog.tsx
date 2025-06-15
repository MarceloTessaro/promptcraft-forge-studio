import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Star } from 'lucide-react';
import { CustomTemplate, PromptBlock } from '@/types/builder';
import { LibraryTemplate } from '@/types/templates';

// This is the local interface from Templates.tsx
interface LibraryTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  aiModel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  uses: number;
  blocks: PromptBlock[];
  tags: string[];
}

type Template = LibraryTemplate | CustomTemplate;

interface TemplatePreviewDialogProps {
  template: Template | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUseTemplate: (template: Template) => void;
}

const getBlockTypeLabel = (type: PromptBlock['type']) => {
  const labels = {
    context: 'Context',
    task: 'Task',
    format: 'Format',
    constraints: 'Constraints',
    examples: 'Examples'
  };
  return labels[type] || 'Block';
};

const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({ template, isOpen, onOpenChange, onUseTemplate }) => {
  if (!template) return null;

  const isLibraryTemplate = 'title' in template;

  const handleUseTemplate = () => {
    onUseTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">{isLibraryTemplate ? template.title : template.name}</DialogTitle>
          {isLibraryTemplate && <DialogDescription className="text-white/70">{template.description}</DialogDescription>}
        </DialogHeader>
        
        {isLibraryTemplate && (
          <div className="flex flex-wrap items-center gap-2 my-4">
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
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 fill-current ml-2" />
              <span className="text-sm ml-1">{template.rating}</span>
            </div>
            <span className="text-sm text-white/60 ml-2">{template.uses.toLocaleString()} uses</span>
          </div>
        )}

        {!isLibraryTemplate && template.createdAt && (
            <p className="text-sm text-white/60 mb-4">
                Created on {new Date(template.createdAt).toLocaleDateString()}
            </p>
        )}

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
          <h4 className="text-lg font-semibold text-white mt-2">Prompt Blocks</h4>
          {template.blocks.map((block, index) => (
            <div key={block.id || index} className="glass-subtle p-4 rounded-lg border border-white/10">
              <p className="text-sm font-semibold text-violet-400 mb-2">{getBlockTypeLabel(block.type)}</p>
              <p className="text-white/90 whitespace-pre-wrap font-mono text-sm">{block.content || <span className="text-white/50">{block.placeholder}</span>}</p>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handleUseTemplate} className="bg-purple-600 hover:bg-purple-700">
            <Copy className="w-4 h-4 mr-2" />
            Use Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
