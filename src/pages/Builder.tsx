
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { PromptBlock } from '@/types/builder';
import PromptBlocks from '@/components/builder/PromptBlocks';
import PreviewPanel from '@/components/builder/PreviewPanel';
import Header from '@/components/builder/Header';
import { useTemplates } from '@/hooks/use-templates';
import { SuggestionEngine, Suggestion } from '@/utils/suggestionEngine';
import SmartSuggestions from '@/components/builder/SmartSuggestions';

const Builder = () => {
  const [blocks, setBlocks] = useState<PromptBlock[]>([
    {
      id: uuidv4(),
      type: 'context',
      content: '',
      placeholder: 'Provide background information to the AI...',
    },
    {
      id: uuidv4(),
      type: 'task',
      content: '',
      placeholder: 'Clearly define the task you want the AI to perform...',
    },
  ]);
  const [assembledPrompt, setAssembledPrompt] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [aiPreview, setAiPreview] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState(() => {
    // Get stored key from local storage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openaiApiKey') || '';
    }
    return '';
  });
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { templates, saveTemplate, loadTemplate } = useTemplates();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    // Store key in local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('openaiApiKey', openaiApiKey);
    }
  }, [openaiApiKey]);

  const addBlock = (type: PromptBlock['type']) => {
    setBlocks(prevBlocks => [...prevBlocks, {
      id: uuidv4(),
      type: type,
      content: '',
      placeholder: `Enter your ${type} here...`,
    }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id ? { ...block, content: content } : block
      )
    );
  };

  const clearDraft = () => {
    setBlocks([
      {
        id: uuidv4(),
        type: 'context',
        content: '',
        placeholder: 'Provide background information to the AI...',
      },
      {
        id: uuidv4(),
        type: 'task',
        content: '',
        placeholder: 'Clearly define the task you want the AI to perform...',
      },
    ]);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(assembledPrompt);
    toast({
      title: "Prompt Copied",
      description: "The assembled prompt has been copied to your clipboard.",
    });
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariableValues(prevValues => ({ ...prevValues, [variable]: value }));
  };

  const generatePreview = async () => {
    if (!openaiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to generate a preview.",
        variant: "destructive",
      });
      return;
    }

    setIsPreviewLoading(true);
    setPreviewError('');
    setAiPreview('');

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: assembledPrompt, apiKey: openaiApiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate preview');
      }

      const data = await response.json();
      setAiPreview(data.content);
    } catch (error: any) {
      console.error("OpenAI Error:", error);
      setPreviewError(error.message);
      toast({
        title: "Preview Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSaveTemplate = async (name: string) => {
    await saveTemplate(name, blocks);
  };

  const assemblePrompt = useCallback(() => {
    let prompt = '';
    let vars: string[] = [];

    blocks.forEach(block => {
      const content = block.content;
      const matches = content.matchAll(/{{(.*?)}}/g);

      let blockContent = content;
      if (matches) {
        for (const match of matches) {
          const variable = match[1].trim();
          vars.push(variable);
        }
        blockContent = content.replace(/{{(.*?)}}/g, (match, variable) => {
          const varName = variable.trim();
          return variableValues[varName] || `{{${varName}}}`;
        });
      }
      prompt += blockContent + '\n\n';
    });

    setAssembledPrompt(prompt.trim());
    setVariables([...new Set(vars)]);
    
    // Generate suggestions after assembling prompt
    const newSuggestions = SuggestionEngine.generateSuggestions(blocks);
    setSuggestions(newSuggestions);
  }, [blocks, variableValues]);

  useEffect(() => {
    assemblePrompt();
  }, [blocks, variableValues, assemblePrompt]);

  const handleApplySuggestion = (suggestion: Suggestion) => {
    // Handle different types of suggestions
    switch (suggestion.type) {
      case 'addition':
        if (suggestion.category === 'structure') {
          if (suggestion.id === 'missing-context') {
            addBlock('context');
          } else if (suggestion.id === 'missing-task') {
            addBlock('task');
          } else if (suggestion.id === 'missing-format') {
            addBlock('format');
          }
        } else if (suggestion.category === 'examples') {
          addBlock('examples');
        } else if (suggestion.category === 'constraints') {
          addBlock('constraints');
        }
        break;
      case 'improvement':
        // For improvements, we can highlight the relevant block
        if (suggestion.blockId) {
          // This could trigger a scroll to the block or highlight it
          console.log(`Focus on block: ${suggestion.blockId}`);
        }
        break;
    }
    
    toast({
      title: "Sugestão Aplicada",
      description: suggestion.action || "Sugestão implementada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Header 
          saveTemplate={saveTemplate} 
          loadTemplate={loadTemplate}
          templates={templates}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
          <PromptBlocks
            blocks={blocks}
            removeBlock={removeBlock}
            updateBlockContent={updateBlockContent}
            addBlock={addBlock}
            clearDraft={clearDraft}
          />
          
          {/* Smart Suggestions */}
          <div className="space-y-6">
            <SmartSuggestions 
              suggestions={suggestions}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>
          
          <PreviewPanel
            assembledPrompt={assembledPrompt}
            copyPrompt={copyPrompt}
            onSaveClick={() => setIsSaveDialogOpen(true)}
            variables={variables}
            variableValues={variableValues}
            onVariableChange={handleVariableChange}
            aiPreview={aiPreview}
            isPreviewLoading={isPreviewLoading}
            previewError={previewError}
            generatePreview={generatePreview}
            openaiApiKey={openaiApiKey}
            onApiKeyChange={setOpenaiApiKey}
            isSaveDialogOpen={isSaveDialogOpen}
            onOpenSaveDialogChange={setIsSaveDialogOpen}
            onSaveTemplate={handleSaveTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default Builder;
