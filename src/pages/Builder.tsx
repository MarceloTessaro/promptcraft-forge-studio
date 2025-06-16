import React, { useState, useCallback, Suspense, useEffect } from 'react';
import { SuggestionEngine, Suggestion } from '@/utils/suggestionEngine';
import PromptBlocks from '@/components/builder/PromptBlocks';
import PreviewPanel from '@/components/builder/PreviewPanel';
import Header from '@/components/builder/Header';
import SmartSuggestions from '@/components/builder/SmartSuggestions';
import OnboardingGuide from '@/components/builder/OnboardingGuide';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingFallback from '@/components/common/LoadingFallback';
import { useTemplates } from '@/hooks/use-templates';
import { usePromptBuilder } from '@/hooks/usePromptBuilder';
import { useAIPreview } from '@/hooks/useAIPreview';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { logger } from '@/utils/logger';
import { sanitizeInput } from '@/utils/validation';
import { toast } from '@/hooks/use-toast';
import { CustomTemplate, PromptBlock } from '@/types/builder';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Save } from 'lucide-react';

const Builder = () => {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('promptcraft_onboarding_completed');
  });
  
  const { customTemplates, saveTemplate } = useTemplates();
  const { handleError } = useErrorHandler();
  const { track } = useAnalytics();
  const { isOnline, lastSaved, saveDraft, loadDraft, hasDraft, clearDraft: clearOfflineDraft } = useOfflineStorage();
  
  const {
    blocks,
    assembledPrompt,
    variables,
    variableValues,
    addBlock,
    removeBlock,
    updateBlockContent,
    updateBlockProperty,
    clearDraft,
    handleVariableChange,
    setBlocks,
  } = usePromptBuilder();

  const {
    aiPreview,
    isPreviewLoading,
    previewError,
    retryCount,
    generatePreview,
    retryGeneration,
  } = useAIPreview();

  // Load draft on mount
  useEffect(() => {
    if (hasDraft()) {
      const draft = loadDraft();
      if (draft && draft.blocks.length > 0) {
        setBlocks(draft.blocks);
        Object.entries(draft.variableValues).forEach(([variable, value]) => {
          handleVariableChange(variable, value);
        });
        track('draft_loaded', { blockCount: draft.blocks.length });
        toast({
          title: "Draft Restored",
          description: `Loaded saved draft from ${new Date(draft.lastSaved).toLocaleString()}`,
        });
      }
    }
  }, [hasDraft, loadDraft, setBlocks, handleVariableChange, track]);

  // Auto-save draft
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (blocks.length > 0) {
        saveDraft(blocks, variableValues);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [blocks, variableValues, saveDraft]);

  // Track user interactions
  useEffect(() => {
    track('page_viewed', { page: 'builder' });
  }, [track]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('promptcraft_onboarding_completed', 'true');
    track('onboarding_completed');
  };

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(assembledPrompt);
      toast({
        title: "Prompt Copied",
        description: "The assembled prompt has been copied to your clipboard.",
      });
      track('prompt_copied', { promptLength: assembledPrompt.length });
      logger.info('Prompt copied to clipboard', 'Builder');
    } catch (error) {
      handleError(error, 'Copying prompt');
    }
  }, [assembledPrompt, handleError, track]);

  const handleSaveTemplate = useCallback(async (name: string, blocks: PromptBlock[]): Promise<CustomTemplate> => {
    try {
      const sanitizedName = sanitizeInput(name, 100);
      if (!sanitizedName) {
        throw new Error('Template name is required');
      }
      
      await saveTemplate({ name: sanitizedName, blocks });
      track('template_saved', { 
        name: sanitizedName, 
        blockCount: blocks.length,
        isOnline 
      });
      logger.info('Template saved successfully', 'Builder', { name: sanitizedName });
      
      // Clear draft after successful save
      clearOfflineDraft();
      
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
  }, [saveTemplate, handleError, track, isOnline, clearOfflineDraft]);

  const handleLoadTemplate = useCallback((template: CustomTemplate): PromptBlock[] => {
    try {
      setBlocks(template.blocks);
      track('template_loaded', { 
        name: template.name, 
        blockCount: template.blocks.length 
      });
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
  }, [setBlocks, handleError, track]);

  const handleSaveTemplateDialog = useCallback(async (name: string) => {
    try {
      const sanitizedName = sanitizeInput(name, 100);
      if (!sanitizedName) {
        throw new Error('Template name is required');
      }
      
      await saveTemplate({ name: sanitizedName, blocks });
      track('template_saved_dialog', { 
        name: sanitizedName, 
        blockCount: blocks.length 
      });
      logger.info('Template saved successfully', 'Builder', { name: sanitizedName });
    } catch (error) {
      handleError(error, 'Saving template');
    }
  }, [blocks, saveTemplate, handleError, track]);

  // Generate suggestions when blocks change
  React.useEffect(() => {
    const newSuggestions = SuggestionEngine.generateSuggestions(blocks);
    setSuggestions(newSuggestions);
  }, [blocks]);

  const handleApplySuggestion = useCallback((suggestion: Suggestion) => {
    try {
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
          if (suggestion.blockId) {
            logger.debug('Focus on block', 'Builder', { blockId: suggestion.blockId });
          }
          break;
      }
      
      track('suggestion_applied', { 
        suggestionId: suggestion.id, 
        suggestionType: suggestion.type 
      });
      
      toast({
        title: "Suggestion Applied",
        description: suggestion.action || "Suggestion implemented successfully.",
      });

      logger.info('Suggestion applied', 'Builder', { suggestionId: suggestion.id });
    } catch (error) {
      handleError(error, 'Applying suggestion');
    }
  }, [addBlock, handleError, track]);

  const handleGeneratePreview = useCallback(() => {
    track('preview_generated', { 
      promptLength: assembledPrompt.length,
      blockCount: blocks.length 
    });
    generatePreview(assembledPrompt);
  }, [generatePreview, assembledPrompt, track, blocks.length]);

  const handleRetryPreview = useCallback(() => {
    track('preview_retried', { retryCount });
    retryGeneration(assembledPrompt);
  }, [retryGeneration, assembledPrompt, track, retryCount]);

  return (
    <ErrorBoundary onError={(error, errorInfo) => logger.error('Builder component error', 'Builder', { error, errorInfo })}>
      <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-background">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          {/* Connection Status */}
          {!isOnline && (
            <div className="mb-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-orange-300">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">You're offline. Changes are saved locally and will sync when reconnected.</span>
                {lastSaved && (
                  <Badge variant="outline" className="border-orange-500/30 text-orange-300 ml-auto">
                    <Save className="w-3 h-3 mr-1" />
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <Suspense fallback={<LoadingFallback type="component" />}>
            <Header 
              blocks={blocks}
              onSaveTemplate={handleSaveTemplateDialog}
              onLoadTemplate={() => {}}
              onExport={() => {}}
              onClear={clearDraft}
              hasUnsavedChanges={blocks.length > 0}
            />
          </Suspense>
          
          {/* Mobile-First Responsive Grid */}
          <div className="mt-6 sm:mt-8 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
            {/* Prompt Blocks - Full width on mobile, 5 cols on desktop */}
            <div className="lg:col-span-5">
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback type="component" />}>
                  <PromptBlocks
                    blocks={blocks}
                    removeBlock={removeBlock}
                    updateBlockContent={updateBlockContent}
                    updateBlockProperty={updateBlockProperty}
                    addBlock={addBlock}
                    clearDraft={clearDraft}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
            
            {/* Smart Suggestions - Full width on mobile, 2 cols on desktop */}
            <div className="lg:col-span-2">
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback type="component" />}>
                  <div className="sticky top-24">
                    <SmartSuggestions 
                      suggestions={suggestions}
                      onApplySuggestion={handleApplySuggestion}
                    />
                  </div>
                </Suspense>
              </ErrorBoundary>
            </div>
            
            {/* Preview Panel - Full width on mobile, 5 cols on desktop */}
            <div className="lg:col-span-5">
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback type="component" />}>
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
                    retryGeneration={handleRetryPreview}
                    retryCount={retryCount}
                    openaiApiKey=""
                    onApiKeyChange={() => {}}
                    isSaveDialogOpen={isSaveDialogOpen}
                    onOpenSaveDialogChange={setIsSaveDialogOpen}
                    onSaveTemplate={handleSaveTemplateDialog}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Onboarding Guide */}
        <Suspense fallback={null}>
          <OnboardingGuide 
            isOpen={showOnboarding} 
            onClose={handleOnboardingClose} 
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default Builder;
