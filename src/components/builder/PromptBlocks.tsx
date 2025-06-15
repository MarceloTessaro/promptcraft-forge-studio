
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Plus,
  Trash2,
  Lightbulb,
  Zap,
  CheckCircle,
  Copy,
  X
} from 'lucide-react';
import { PromptBlock } from '@/types/builder';

interface PromptBlocksProps {
  blocks: PromptBlock[];
  removeBlock: (id: string) => void;
  updateBlockContent: (id: string, content: string) => void;
  addBlock: (type: PromptBlock['type']) => void;
  clearDraft: () => void;
}

const blockTypes = [
    { 
      type: 'context', 
      label: 'Context', 
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500', 
      description: 'Background information',
      icon: <Lightbulb className="w-4 h-4" />
    },
    { 
      type: 'task', 
      label: 'Task', 
      color: 'bg-gradient-to-r from-violet-500 to-purple-500', 
      description: 'Main objective',
      icon: <Zap className="w-4 h-4" />
    },
    { 
      type: 'format', 
      label: 'Format', 
      color: 'bg-gradient-to-r from-emerald-500 to-teal-500', 
      description: 'Output structure',
      icon: <Settings className="w-4 h-4" />
    },
    { 
      type: 'constraints', 
      label: 'Constraints', 
      color: 'bg-gradient-to-r from-orange-500 to-red-500', 
      description: 'Limitations & rules',
      icon: <CheckCircle className="w-4 h-4" />
    },
    { 
      type: 'examples', 
      label: 'Examples', 
      color: 'bg-gradient-to-r from-pink-500 to-rose-500', 
      description: 'Sample inputs/outputs',
      icon: <Copy className="w-4 h-4" />
    }
  ];

const PromptBlocks: React.FC<PromptBlocksProps> = ({
  blocks,
  removeBlock,
  updateBlockContent,
  addBlock,
  clearDraft,
}) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <Card className="card-elevated p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Prompt Blocks</h2>
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-violet-500/30">
              {blocks.length} blocks
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={clearDraft} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white/70 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {blocks.map((block, index) => {
            const blockType = blockTypes.find(t => t.type === block.type);
            return (
              <div key={block.id} className="relative group animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-white text-sm font-medium ${blockType?.color}`}>
                      {blockType?.icon}
                      {blockType?.label}
                    </div>
                    <span className="text-xs text-white/50">{blockType?.description}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeBlock(block.id)}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                <Textarea
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  placeholder={block.placeholder}
                  className="glass border-white/20 text-white placeholder-white/50 min-h-[120px] focus-ring resize-none"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Block
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {blockTypes.map((type) => (
              <Button
                key={type.type}
                onClick={() => addBlock(type.type as PromptBlock['type'])}
                className="btn-ghost justify-start p-3 h-auto flex flex-col items-start gap-1 hover:scale-105 transition-transform duration-200"
              >
                <div className="flex items-center gap-2 w-full">
                  {type.icon}
                  <span className="font-medium">{type.label}</span>
                </div>
                <span className="text-xs text-white/60">{type.description}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PromptBlocks;
