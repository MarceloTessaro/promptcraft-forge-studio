
import React, { useState, useCallback } from 'react';
import { SuggestionEngine, Suggestion } from '@/utils/suggestionEngine';
import PromptBlocks from '@/components/builder/PromptBlocks';
import PreviewPanel from '@/components/builder/PreviewPanel';
import Header from '@/components/builder/Header';
import SmartSuggestions from '@/components/builder/SmartSuggestions';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useTemplates } from '@/hooks/use-templates';
import { usePromptBuilder } from '@/hooks/usePromptBuilder';
import { useAIPreview } from '@/hooks/useAIPreview';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { logger } from '@/utils/logger';
import { sanitizeInput } from '@/utils/validation';
import { toast } from '@/hooks/use-toast';

const Builder = () => {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  const { templates, saveTemplate, loadTemplate } = useTemplates();
  const { handleError } = useErrorHandler();
  
  const {
    blocks,
    assembledPrompt,
    variables,
    variableValues,
    addBlock,
    removeBlock,
    updateBlockContent,
    clearDraft,
    handleVariableChange,
    setBlocks,
  } = usePromptBuilder();

  const {
    aiPreview,
    isPreviewLoading,
    previewError,
    generatePreview,
  } = useAIPreview();

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(assembledPrompt);
      toast({
        title: "Prompt Copied",
        description: "The assembled prompt has been copied to your clipboard.",
      });
      logger.info('Prompt copied to clipboard', 'Builder');
    } catch (error) {
      handleError(error, 'Copying prompt');
    }
  }, [assembledPrompt, handleError]);

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

  // Generate suggestions when blocks change
  React.useEffect(() => {
    const newSuggestions = SuggestionEngine.generateSuggestions(blocks);
    setSuggestions(newSuggestions);
  }, [blocks]);

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

  const handleGeneratePreview = useCallback(() => {
    generatePreview(assembledPrompt);
  }, [generatePreview, assembledPrompt]);

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
                generatePreview={handleGeneratePreview}
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
