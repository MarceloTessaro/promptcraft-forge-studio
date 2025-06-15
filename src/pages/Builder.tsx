
import React, { useState, useCallback } from 'react';
import { SuggestionEngine, Suggestion } from '@/utils/suggestionEngine';
import PromptBlocks from '@/components/builder/PromptBlocks';
import PreviewPanel from '@/components/builder/PreviewPanel';
import Header from '@/components/builder/Header';
import SmartSuggestions from '@/components/builder/SmartSuggestions';
import OnboardingGuide from '@/components/builder/OnboardingGuide';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useTemplates } from '@/hooks/use-templates';
import { usePromptBuilder } from '@/hooks/usePromptBuilder';
import { useAIPreview } from '@/hooks/useAIPreview';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { logger } from '@/utils/logger';
import { sanitizeInput } from '@/utils/validation';
import { toast } from '@/hooks/use-toast';
import { CustomTemplate, PromptBlock } from '@/types/builder';

const Builder = () => {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user has seen onboarding before
    return !localStorage.getItem('promptcraft_onboarding_completed');
  });
  
  const { customTemplates, saveTemplate } = useTemplates();
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

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('promptcraft_onboarding_completed', 'true');
  };

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

  // Create wrapper functions to match Header component expectations
  const handleSaveTemplate = useCallback(async (name: string, blocks: PromptBlock[]): Promise<CustomTemplate> => {
    try {
      const sanitizedName = sanitizeInput(name, 100);
      if (!sanitizedName) {
        throw new Error('Template name is required');
      }
      
      await saveTemplate({ name: sanitizedName, blocks });
      logger.info('Template saved successfully', 'Builder', { name: sanitizedName });
      
      // Return a mock CustomTemplate since saveTemplate doesn't return one
      return {
        id: crypto.randomUUID(),
        name: sanitizedName,
        blocks,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      handleError(error, 'Saving template');
      throw error;
    }
  }, [saveTemplate, handleError]);

  const handleLoadTemplate = useCallback((template: CustomTemplate): PromptBlock[] => {
    try {
      setBlocks(template.blocks);
      toast({
        title: "Template Loaded",
        description: `"${template.name}" has been loaded.`,
      });
      logger.info('Template loaded successfully', 'Builder', { name: template.name });
      return template.blocks;
    } catch (error) {
      handleError(error, 'Loading template');
      return [];
    }
  }, [setBlocks, handleError]);

  const handleSaveTemplateDialog = useCallback(async (name: string) => {
    try {
      const sanitizedName = sanitizeInput(name, 100);
      if (!sanitizedName) {
        throw new Error('Template name is required');
      }
      
      await saveTemplate({ name: sanitizedName, blocks });
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
      <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-background">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <Header 
            saveTemplate={handleSaveTemplate} 
            loadTemplate={handleLoadTemplate}
            templates={customTemplates}
          />
          
          {/* Mobile-First Responsive Grid */}
          <div className="mt-6 sm:mt-8 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
            {/* Prompt Blocks - Full width on mobile, 5 cols on desktop */}
            <div className="lg:col-span-5">
              <ErrorBoundary>
                <PromptBlocks
                  blocks={blocks}
                  removeBlock={removeBlock}
                  updateBlockContent={updateBlockContent}
                  addBlock={addBlock}
                  clearDraft={clearDraft}
                />
              </ErrorBoundary>
            </div>
            
            {/* Smart Suggestions - Full width on mobile, 2 cols on desktop */}
            <div className="lg:col-span-2">
              <ErrorBoundary>
                <div className="sticky top-24">
                  <SmartSuggestions 
                    suggestions={suggestions}
                    onApplySuggestion={handleApplySuggestion}
                  />
                </div>
              </ErrorBoundary>
            </div>
            
            {/* Preview Panel - Full width on mobile, 5 cols on desktop */}
            <div className="lg:col-span-5">
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
                  openaiApiKey=""
                  onApiKeyChange={() => {}}
                  isSaveDialogOpen={isSaveDialogOpen}
                  onOpenSaveDialogChange={setIsSaveDialogOpen}
                  onSaveTemplate={handleSaveTemplateDialog}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Onboarding Guide */}
        <OnboardingGuide 
          isOpen={showOnboarding} 
          onClose={handleOnboardingClose} 
        />
      </div>
    </ErrorBoundary>
  );
};

export default Builder;
