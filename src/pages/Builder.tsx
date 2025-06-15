import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { PromptBlock } from '@/types/builder';
import Header from '@/components/builder/Header';
import PromptBlocks from '@/components/builder/PromptBlocks';
import SuggestionsSidebar from '@/components/builder/SuggestionsSidebar';
import PreviewPanel from '@/components/builder/PreviewPanel';
import { ToastAction } from '@/components/ui/toast';

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

  const copyPrompt = () => {
    if (!assembledPrompt) return;
    navigator.clipboard.writeText(assembledPrompt);
    toast({
      title: "Copiado para a área de transferência!",
      description: "Seu prompt está pronto para ser colado em sua ferramenta de IA favorita.",
      action: (
        <ToastAction
          altText="Test on ChatGPT"
          onClick={() => window.open("https://chat.openai.com", "_blank")}
        >
          Testar no ChatGPT
        </ToastAction>
      ),
    });
  };

  const savePrompt = () => {
    if (!assembledPrompt) return;
    toast({
      title: "Prompt salvo!",
      description: "Seu rascunho foi salvo no armazenamento local do seu navegador.",
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
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <PromptBlocks
            blocks={blocks}
            removeBlock={removeBlock}
            updateBlockContent={updateBlockContent}
            addBlock={addBlock}
            clearDraft={clearDraft}
          />
          <SuggestionsSidebar />
          <PreviewPanel
            assembledPrompt={assembledPrompt}
            copyPrompt={copyPrompt}
            savePrompt={savePrompt}
          />
        </div>
      </div>
    </div>
  );
};

export default Builder;
