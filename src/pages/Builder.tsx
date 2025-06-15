
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
  ArrowRight,
  Lightbulb,
  Zap,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PromptBlock {
  id: string;
  type: 'context' | 'task' | 'format' | 'constraints' | 'examples';
  content: string;
  placeholder: string;
}

const initialBlocks: PromptBlock[] = [
  {
    id: '1',
    type: 'context',
    content: 'You are a social media manager for a new AI startup called "PromptCraft". Your tone is witty, informative, and slightly futuristic.',
    placeholder: 'Provide context about the task or domain...'
  },
  {
    id: '2',
    type: 'task',
    content: 'Write a tweet announcing our new "Visual Prompt Builder" feature. Mention it helps users build prompts 5x faster. Include the hashtag #AITools.',
    placeholder: 'Clearly define what you want the AI to do...'
  },
  {
    id: '3',
    type: 'format',
    content: 'Format the output as a single tweet, under 280 characters.',
    placeholder: 'Specify the desired output format...'
  }
];

const Builder: React.FC = () => {
  const [blocks, setBlocks] = useState<PromptBlock[]>(() => {
    try {
      const savedDraft = localStorage.getItem('promptcraft-draft');
      if (savedDraft) {
        const parsedBlocks = JSON.parse(savedDraft);
        if (Array.isArray(parsedBlocks) && parsedBlocks.length > 0) {
          return parsedBlocks;
        }
      }
    } catch (error) {
      console.error("Failed to parse draft from localStorage", error);
    }
    return initialBlocks;
  });

  const [assembledPrompt, setAssembledPrompt] = useState('');

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

  const suggestions = [
    {
      title: 'Be Specific',
      description: 'Include exact output format requirements',
      icon: <Zap className="w-4 h-4 text-amber-400" />
    },
    {
      title: 'Add Context',
      description: 'Provide relevant background information',
      icon: <Lightbulb className="w-4 h-4 text-blue-400" />
    },
    {
      title: 'Use Examples',
      description: 'Show desired input/output patterns',
      icon: <Copy className="w-4 h-4 text-emerald-400" />
    },
    {
      title: 'Set Constraints',
      description: 'Define clear boundaries and limitations',
      icon: <CheckCircle className="w-4 h-4 text-violet-400" />
    }
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

  const copyPrompt = () => {
    if (!assembledPrompt) return;
    navigator.clipboard.writeText(assembledPrompt);
    toast({
      title: "Copied to clipboard",
      description: "Your prompt has been copied successfully.",
    });
  };

  const savePrompt = () => {
    if (!assembledPrompt) return;
    toast({
      title: "Prompt saved",
      description: "Your prompt has been saved to your drafts.",
    });
  };

  const clearDraft = () => {
    setBlocks(initialBlocks);
    toast({
      title: "Draft Cleared",
      description: "Your prompt has been reset to the default example.",
    });
  };

  React.useEffect(() => {
    const prompt = blocks
      .filter(block => block.content.trim())
      .map(block => block.content.trim())
      .join('\n\n');
    setAssembledPrompt(prompt);
    localStorage.setItem('promptcraft-draft', JSON.stringify(blocks));
  }, [blocks]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">Visual Prompt Builder</h1>
              <p className="text-white/70 text-lg">Build effective prompts with smart building blocks</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Builder Blocks */}
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

          {/* Enhanced Suggestions Sidebar */}
          <div className="space-y-6">
            <Card className="card-elevated p-6 animate-fadeIn animate-delay-200">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Smart Suggestions</h3>
              </div>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="glass-subtle p-4 rounded-xl hover:glass transition-all duration-200 group">
                    <div className="flex items-start gap-3">
                      {suggestion.icon}
                      <div>
                        <h4 className="font-medium text-white mb-1 group-hover:gradient-text transition-all duration-200">
                          {suggestion.title}
                        </h4>
                        <p className="text-white/70 text-sm leading-relaxed">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Enhanced Preview Panel */}
          <div className="space-y-6">
            <Card className="card-elevated p-6 animate-fadeIn animate-delay-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-violet-400" />
                  Preview
                </h3>
                <div className="flex gap-2">
                  <Button size="icon" onClick={copyPrompt} variant="secondary">
                    <Copy className="w-5 h-5" />
                  </Button>
                  <Button size="icon" onClick={savePrompt} variant="default">
                    <Save className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="glass-dark p-6 rounded-xl min-h-[300px] border border-white/10">
                {assembledPrompt ? (
                  <pre className="text-white/90 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {assembledPrompt}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-3">
                      <Zap className="w-6 h-6 text-violet-400" />
                    </div>
                    <p className="text-white/60 text-sm">Your assembled prompt will appear here...</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-white/60">
                  Characters: <span className="text-white font-medium">{assembledPrompt.length}</span>
                </span>
                <span className="text-white/60">
                  Words: <span className="text-white font-medium">
                    {assembledPrompt.split(/\s+/).filter(word => word.length > 0).length}
                  </span>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
