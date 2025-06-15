import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Save, 
  Settings, 
  Plus,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PromptBlock {
  id: string;
  type: 'context' | 'task' | 'format' | 'constraints' | 'examples';
  content: string;
  placeholder: string;
}

const Builder: React.FC = () => {
  const [blocks, setBlocks] = useState<PromptBlock[]>([
    {
      id: '1',
      type: 'context',
      content: '',
      placeholder: 'Provide context about the task or domain...'
    },
    {
      id: '2',
      type: 'task',
      content: '',
      placeholder: 'Clearly define what you want the AI to do...'
    }
  ]);

  const [assembledPrompt, setAssembledPrompt] = useState('');

  const blockTypes = [
    { type: 'context', label: 'Context', color: 'bg-blue-500', description: 'Background information' },
    { type: 'task', label: 'Task', color: 'bg-purple-500', description: 'Main objective' },
    { type: 'format', label: 'Format', color: 'bg-green-500', description: 'Output structure' },
    { type: 'constraints', label: 'Constraints', color: 'bg-orange-500', description: 'Limitations & rules' },
    { type: 'examples', label: 'Examples', color: 'bg-pink-500', description: 'Sample inputs/outputs' }
  ];

  const suggestions = [
    'Be specific about your desired output format',
    'Include relevant context for better results',
    'Use examples to clarify complex requirements',
    'Set clear constraints to avoid unwanted outputs'
  ];

  const addBlock = (type: PromptBlock['type']) => {
    const newBlock: PromptBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      placeholder: getPlaceholder(type)
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const getPlaceholder = (type: PromptBlock['type']): string => {
    const placeholders = {
      context: 'Provide context about the task or domain...',
      task: 'Clearly define what you want the AI to do...',
      format: 'Specify the desired output format...',
      constraints: 'Add any limitations or rules...',
      examples: 'Provide example inputs and outputs...'
    };
    return placeholders[type];
  };

  const assemblePrompt = () => {
    const prompt = blocks
      .filter(block => block.content.trim())
      .map(block => block.content.trim())
      .join('\n\n');
    setAssembledPrompt(prompt);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(assembledPrompt);
    toast({
      title: "Copied to clipboard",
      description: "Your prompt has been copied successfully.",
    });
  };

  const savePrompt = () => {
    toast({
      title: "Prompt saved",
      description: "Your prompt has been saved to your drafts.",
    });
  };

  React.useEffect(() => {
    assemblePrompt();
  }, [blocks]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Visual Prompt Builder</h1>
          <p className="text-white/80">Build effective prompts with drag-and-drop blocks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Builder Blocks */}
          <div className="lg:col-span-2">
            <Card className="glass p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Prompt Blocks</h2>
                <Button size="sm" variant="outline" className="border-white/20 text-white">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {blocks.map((block) => {
                  const blockType = blockTypes.find(t => t.type === block.type);
                  return (
                    <div key={block.id} className="relative group">
                      <div className="flex items-center mb-2">
                        <Badge 
                          className={`${blockType?.color} text-white mr-2`}
                        >
                          {blockType?.label}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeBlock(block.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={block.content}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        placeholder={block.placeholder}
                        className="glass border-white/20 text-white placeholder-white/50 min-h-[100px]"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Add Block</h3>
                <div className="flex flex-wrap gap-2">
                  {blockTypes.map((type) => (
                    <Button
                      key={type.type}
                      size="sm"
                      variant="outline"
                      onClick={() => addBlock(type.type as PromptBlock['type'])}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Smart Suggestions</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 glass-dark rounded-lg">
                    <p className="text-white/80 text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                <div className="flex gap-2">
                  <Button size="sm" onClick={copyPrompt} className="bg-blue-600 hover:bg-blue-700">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={savePrompt} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="glass-dark p-4 rounded-lg min-h-[200px]">
                <pre className="text-white/80 text-sm whitespace-pre-wrap font-mono">
                  {assembledPrompt || 'Your assembled prompt will appear here...'}
                </pre>
              </div>
              <div className="mt-4 flex items-center text-sm text-white/60">
                <span>Characters: {assembledPrompt.length}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
