
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
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { logger } from '@/utils/logger';
import { sanitizeInput, validatePromptBlock } from '@/utils/validation';
import { supabase } from '@/integrations/supabase/client';

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
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { templates, saveTemplate, loadTemplate } = useTemplates();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { handleError, handleAsyncError } = useErrorHandler();

  const addBlock = useCallback((type: PromptBlock['type']) => {
    try {
      const newBlock = {
        id: uuidv4(),
        type: type,
        content: '',
        placeholder: `Enter your ${type} here...`,
      };

      if (!validatePromptBlock(newBlock)) {
        throw new Error('Invalid block data');
      }

      setBlocks(prevBlocks => [...prevBlocks, newBlock]);
      logger.info('Block added successfully', 'Builder', { type });
    } catch (error) {
      handleError(error, 'Adding block');
    }
  }, [handleError]);

  const removeBlock = useCallback((id: string) => {
    try {
      setBlocks(prevBlocks => {
        const newBlocks = prevBlocks.filter(block => block.id !== id);
        if (newBlocks.length === prevBlocks.length) {
          throw new Error('Block not found');
        }
        return newBlocks;
      });
      logger.info('Block removed successfully', 'Builder', { id });
    } catch (error) {
      handleError(error, 'Removing block');
    }
  }, [handleError]);

  const updateBlockContent = useCallback((id: string, content: string) => {
    try {
      const sanitizedContent = sanitizeInput(content, 5000);
      
      setBlocks(prevBlocks =>
        prevBlocks.map(block =>
          block.id === id ? { ...block, content: sanitizedContent } : block
        )
      );
    } catch (error) {
      handleError(error, 'Updating block content');
    }
  }, [handleError]);

  const clearDraft = useCallback(() => {
    try {
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
      logger.info('Draft cleared', 'Builder');
    } catch (error) {
      handleError(error, 'Clearing draft');
    }
  }, [handleError]);

  const copyPrompt = useCallback(() => {
    handleAsyncError(async () => {
      await navigator.clipboard.writeText(assembledPrompt);
      toast({
        title: "Prompt Copied",
        description: "The assembled prompt has been copied to your clipboard.",
      });
      logger.info('Prompt copied to clipboard', 'Builder');
    }, 'Copying prompt');
  }, [assembledPrompt, handleAsyncError]);

  const handleVariableChange = useCallback((variable: string, value: string) => {
    try {
      const sanitizedValue = sanitizeInput(value, 1000);
      setVariableValues(prevValues => ({ ...prevValues, [variable]: sanitizedValue }));
    } catch (error) {
      handleError(error, 'Updating variable');
    }
  }, [handleError]);

  const generatePreview = useCallback(async () => {
    if (!assembledPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please add some content to your prompt blocks first.",
        variant: "destructive",
      });
      return;
    }

    setIsPreviewLoading(true);
    setPreviewError('');
    setAiPreview('');

    try {
      logger.info('Starting AI preview generation', 'Builder', { promptLength: assembledPrompt.length });

      const { data, error } = await supabase.functions.invoke('openai-preview', {
        body: { prompt: assembledPrompt }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate preview');
      }

      if (!data || !data.content) {
        throw new Error('No content received from AI');
      }

      setAiPreview(data.content);
      logger.info('AI preview generated successfully', 'Builder');
      
    } catch (error: any) {
      logger.error('AI preview generation failed', 'Builder', error);
      setPreviewError(error.message);
      toast({
        title: "Preview Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  }, [assembledPrompt]);

  const handleSaveTemplate = useCallback(async (name: string) => {
    try {
      const sanitizedName = sanitizeInput(name, 100);
      if (!sanitizedName) {
        throw new Error('Template name is required');
      }
      
      await saveTemplate(sanitizedName, blocks);
      logger.info('Template saved successfully', 'Builder', { name: sanitizedName });
    } catch (error) {
      handleError(error, 'Saving template');
    }
  }, [blocks, saveTemplate, handleError]);

  const assemblePrompt = useCallback(() => {
    try {
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
    } catch (error) {
      handleError(error, 'Assembling prompt');
    }
  }, [blocks, variableValues, handleError]);

  useEffect(() => {
    assemblePrompt();
  }, [blocks, variableValues, assemblePrompt]);

  const handleApplySuggestion = useCallback((suggestion: Suggestion) => {
    try {
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
            logger.debug('Focus on block', 'Builder', { blockId: suggestion.blockId });
          }
          break;
      }
      
      toast({
        title: "Suggestion Applied",
        description: suggestion.action || "Suggestion implemented successfully.",
      });

      logger.info('Suggestion applied', 'Builder', { suggestionId: suggestion.id });
    } catch (error) {
      handleError(error, 'Applying suggestion');
    }
  }, [addBlock, handleError]);

  return (
    <ErrorBoundary onError={(error, errorInfo) => logger.error('Builder component error', 'Builder', { error, errorInfo })}>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Header 
            saveTemplate={saveTemplate} 
            loadTemplate={loadTemplate}
            templates={templates}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
            <ErrorBoundary>
              <PromptBlocks
                blocks={blocks}
                removeBlock={removeBlock}
                updateBlockContent={updateBlockContent}
                addBlock={addBlock}
                clearDraft={clearDraft}
              />
            </ErrorBoundary>
            
            <ErrorBoundary>
              <div className="space-y-6">
                <SmartSuggestions 
                  suggestions={suggestions}
                  onApplySuggestion={handleApplySuggestion}
                />
              </div>
            </ErrorBoundary>
            
            <ErrorBoundary>
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
                openaiApiKey="" // No longer needed with Edge Function
                onApiKeyChange={() => {}} // No longer needed
                isSaveDialogOpen={isSaveDialogOpen}
                onOpenSaveDialogChange={setIsSaveDialogOpen}
                onSaveTemplate={handleSaveTemplate}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Builder;
