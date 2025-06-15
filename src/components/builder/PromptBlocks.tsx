import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Plus,
  Trash2,
  Lightbulb,
  Zap,
  CheckCircle,
  Copy,
  X,
  Variable,
  GitBranch,
  RotateCcw,
  Link
} from 'lucide-react';
import { PromptBlock } from '@/types/builder';

interface PromptBlocksProps {
  blocks: PromptBlock[];
  removeBlock: (id: string) => void;
  updateBlockContent: (id: string, content: string) => void;
  updateBlockProperty?: (id: string, property: keyof PromptBlock, value: any) => void;
  addBlock: (type: PromptBlock['type']) => void;
  clearDraft: () => void;
}

const blockTypes = [
  { 
    type: 'context', 
    label: 'Context', 
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500', 
    description: 'Background info',
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
    description: 'Rules & limits',
    icon: <CheckCircle className="w-4 h-4" />
  },
  { 
    type: 'examples', 
    label: 'Examples', 
    color: 'bg-gradient-to-r from-pink-500 to-rose-500', 
    description: 'Sample I/O',
    icon: <Copy className="w-4 h-4" />
  },
  { 
    type: 'variable', 
    label: 'Variable', 
    color: 'bg-gradient-to-r from-indigo-500 to-blue-500', 
    description: 'Dynamic values',
    icon: <Variable className="w-4 h-4" />
  },
  { 
    type: 'conditional', 
    label: 'Conditional', 
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500', 
    description: 'If/then logic',
    icon: <GitBranch className="w-4 h-4" />
  },
  { 
    type: 'loop', 
    label: 'Loop', 
    color: 'bg-gradient-to-r from-green-500 to-emerald-500', 
    description: 'Repeat content',
    icon: <RotateCcw className="w-4 h-4" />
  },
  { 
    type: 'reference', 
    label: 'Reference', 
    color: 'bg-gradient-to-r from-gray-500 to-slate-500', 
    description: 'Link to block',
    icon: <Link className="w-4 h-4" />
  }
];

const PromptBlocks: React.FC<PromptBlocksProps> = ({
  blocks,
  removeBlock,
  updateBlockContent,
  updateBlockProperty,
  addBlock,
  clearDraft,
}) => {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const toggleBlockExpansion = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  const handlePropertyUpdate = (blockId: string, property: keyof PromptBlock, value: any) => {
    if (updateBlockProperty) {
      updateBlockProperty(blockId, property, value);
    }
  };

  const renderBlockControls = (block: PromptBlock) => {
    const isExpanded = expandedBlocks.has(block.id);

    switch (block.type) {
      case 'variable':
        return isExpanded ? (
          <div className="mt-3 space-y-3 p-3 bg-white/5 rounded-lg">
            <div>
              <Label className="text-white/80 text-xs">Variable Name</Label>
              <Input
                value={block.variableName || ''}
                onChange={(e) => handlePropertyUpdate(block.id, 'variableName', e.target.value)}
                placeholder="e.g., user_name, topic, style"
                className="glass border-white/20 text-white placeholder-white/50 mt-1"
              />
            </div>
          </div>
        ) : null;

      case 'conditional':
        return isExpanded ? (
          <div className="mt-3 space-y-3 p-3 bg-white/5 rounded-lg">
            <div>
              <Label className="text-white/80 text-xs">Condition</Label>
              <Input
                value={block.condition || ''}
                onChange={(e) => handlePropertyUpdate(block.id, 'condition', e.target.value)}
                placeholder="e.g., {{user_type}} == 'advanced'"
                className="glass border-white/20 text-white placeholder-white/50 mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={block.isActive || false}
                onCheckedChange={(checked) => handlePropertyUpdate(block.id, 'isActive', checked)}
              />
              <Label className="text-white/80 text-xs">Currently Active</Label>
            </div>
          </div>
        ) : null;

      case 'loop':
        return isExpanded ? (
          <div className="mt-3 space-y-3 p-3 bg-white/5 rounded-lg">
            <div>
              <Label className="text-white/80 text-xs">Loop Variable</Label>
              <Input
                value={block.loopVariable || ''}
                onChange={(e) => handlePropertyUpdate(block.id, 'loopVariable', e.target.value)}
                placeholder="e.g., item, step, example"
                className="glass border-white/20 text-white placeholder-white/50 mt-1"
              />
            </div>
            <div>
              <Label className="text-white/80 text-xs">Loop Count</Label>
              <Input
                type="number"
                value={block.loopCount || 1}
                onChange={(e) => handlePropertyUpdate(block.id, 'loopCount', parseInt(e.target.value))}
                min="1"
                max="10"
                className="glass border-white/20 text-white placeholder-white/50 mt-1"
              />
            </div>
          </div>
        ) : null;

      case 'reference':
        return isExpanded ? (
          <div className="mt-3 space-y-3 p-3 bg-white/5 rounded-lg">
            <div>
              <Label className="text-white/80 text-xs">Reference Block</Label>
              <Select
                value={block.referenceId || ''}
                onValueChange={(value) => handlePropertyUpdate(block.id, 'referenceId', value)}
              >
                <SelectTrigger className="glass border-white/20 text-white">
                  <SelectValue placeholder="Select a block to reference" />
                </SelectTrigger>
                <SelectContent>
                  {blocks
                    .filter(b => b.id !== block.id && b.type !== 'reference')
                    .map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        {blockTypes.find(bt => bt.type === b.type)?.label} - {b.content.substring(0, 30)}...
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const getBlockPlaceholder = (block: PromptBlock) => {
    switch (block.type) {
      case 'variable':
        return 'Define a reusable variable: {{variable_name}} = value';
      case 'conditional':
        return 'Content that shows only when condition is met...';
      case 'loop':
        return 'Content to repeat: {{loop_variable}} will be replaced each iteration...';
      case 'reference':
        return 'This will include content from the referenced block...';
      default:
        return block.placeholder;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="card-elevated p-4 sm:p-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">Prompt Blocks</h2>
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs">
              {blocks.length} blocks
            </Badge>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button size="sm" variant="ghost" onClick={clearDraft} className="text-white/70 hover:text-white p-2">
              <X className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white/70 hover:text-white p-2">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {blocks.map((block, index) => {
            const blockType = blockTypes.find(t => t.type === block.type);
            const isExpanded = expandedBlocks.has(block.id);
            const hasAdvancedControls = ['variable', 'conditional', 'loop', 'reference'].includes(block.type);
            
            return (
              <div key={block.id} className="relative group animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg text-white text-xs sm:text-sm font-medium ${blockType?.color}`}>
                      {blockType?.icon}
                      <span className="hidden xs:inline">{blockType?.label}</span>
                    </div>
                    <span className="text-xs text-white/50 hidden sm:inline">{blockType?.description}</span>
                    {hasAdvancedControls && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlockExpansion(block.id)}
                        className="text-white/50 hover:text-white p-1"
                      >
                        <Settings className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </Button>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBlock(block.id)}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 self-end sm:self-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {renderBlockControls(block)}
                
                <Textarea
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  placeholder={getBlockPlaceholder(block)}
                  className="glass border-white/20 text-white placeholder-white/50 min-h-[100px] sm:min-h-[120px] focus-ring resize-none text-sm"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
          <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Plus className="w-4 h-4" />
            Add Block
          </h3>
          
          {/* Basic Blocks */}
          <div className="mb-4">
            <h4 className="text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">Basic Blocks</h4>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {blockTypes.slice(0, 5).map((type) => (
                <Button
                  key={type.type}
                  onClick={() => addBlock(type.type as PromptBlock['type'])}
                  className="btn-ghost justify-start p-3 h-auto flex flex-col items-start gap-1 hover:scale-105 transition-transform duration-200 text-left"
                >
                  <div className="flex items-center gap-2 w-full">
                    {type.icon}
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                  <span className="text-xs text-white/60 hidden sm:block">{type.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Blocks */}
          <div>
            <h4 className="text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">Advanced Blocks</h4>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {blockTypes.slice(5).map((type) => (
                <Button
                  key={type.type}
                  onClick={() => addBlock(type.type as PromptBlock['type'])}
                  className="btn-ghost justify-start p-3 h-auto flex flex-col items-start gap-1 hover:scale-105 transition-transform duration-200 text-left border border-amber-500/20"
                >
                  <div className="flex items-center gap-2 w-full">
                    {type.icon}
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                  <span className="text-xs text-white/60 hidden sm:block">{type.description}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PromptBlocks;
