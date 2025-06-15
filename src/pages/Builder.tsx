
import React, { useState, useEffect } from 'react';
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
    content: 'Write a tweet announcing our new "{{feature_name}}" feature. Mention it helps users build prompts {{speed_improvement}}x faster. Include the hashtag #{{hashtag}}.',
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
  const [variables, setVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [renderedPrompt, setRenderedPrompt] = useState('');

  // State for AI Preview
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [aiPreview, setAiPreview] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('promptcraft-openai-apikey');
    if (savedKey) {
      setOpenaiApiKey(savedKey);
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setOpenaiApiKey(key);
    localStorage.setItem('promptcraft-openai-apikey', key);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved in local storage.",
    });
  };

  const generatePreview = async () => {
    if (!openaiApiKey) {
      setPreviewError("Please provide your OpenAI API key to generate a preview.");
      toast({
        title: "OpenAI API Key Required",
        description: "An API key is needed to generate previews.",
        variant: "destructive",
      });
      return;
    }
    if (!renderedPrompt) return;

    setIsPreviewLoading(true);
    setAiPreview('');
    setPreviewError('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: renderedPrompt }],
          max_tokens: 250,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch AI preview.');
      }

      const data = await response.json();
      setAiPreview(data.choices[0].message.content);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setPreviewError(errorMessage);
      toast({
        title: "Error Generating Preview",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
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

  const handleVariableChange = (variable: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [variable]: value }));
  };

  const copyPrompt = () => {
    if (!renderedPrompt) return;
    navigator.clipboard.writeText(renderedPrompt);
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
    // Note: We save the template with placeholders, not the rendered version.
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

  // Effect to assemble prompt from blocks and extract variables
  useEffect(() => {
    const prompt = blocks
      .filter(block => block.content.trim())
      .map(block => block.content.trim())
      .join('\n\n');
    setAssembledPrompt(prompt);
    localStorage.setItem('promptcraft-draft', JSON.stringify(blocks));

    // Extract variables using regex
    const foundVariables = prompt.match(/\{\{([^}]+)\}\}/g) || [];
    const uniqueVariables = [...new Set(foundVariables.map(v => v.replace(/[{}]/g, '')))];
    setVariables(uniqueVariables);
    
    // Preserve existing values, remove old ones
    setVariableValues(currentValues => {
      const newValues: Record<string, string> = {};
      uniqueVariables.forEach(v => {
        newValues[v] = currentValues[v] || '';
      });
      return newValues;
    });

  }, [blocks]);

  // Effect to render the final prompt when variables change
  useEffect(() => {
    const finalPrompt = variables.reduce((prompt, variable) => {
      const value = variableValues[variable] || `{{${variable}}}`;
      return prompt.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), value);
    }, assembledPrompt);
    setRenderedPrompt(finalPrompt);
  }, [assembledPrompt, variables, variableValues]);

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
            assembledPrompt={renderedPrompt}
            copyPrompt={copyPrompt}
            savePrompt={savePrompt}
            variables={variables}
            variableValues={variableValues}
            onVariableChange={handleVariableChange}
            aiPreview={aiPreview}
            isPreviewLoading={isPreviewLoading}
            previewError={previewError}
            generatePreview={generatePreview}
            openaiApiKey={openaiApiKey}
            onApiKeyChange={handleApiKeyChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Builder;
