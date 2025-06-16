
import React, { Suspense } from 'react';
import { toast } from '@/hooks/use-toast';
import SaveTemplateDialog from './SaveTemplateDialog';
import VariablesSection from './VariablesSection';
import PromptDisplay from './PromptDisplay';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingFallback from '@/components/common/LoadingFallback';
import { logger } from '@/utils/logger';

interface PreviewPanelProps {
  assembledPrompt: string;
  copyPrompt: () => void;
  onSaveClick: () => void;
  variables: string[];
  variableValues: Record<string, string>;
  onVariableChange: (variable: string, value: string) => void;
  aiPreview: string;
  isPreviewLoading: boolean;
  previewError: string;
  generatePreview: () => void;
  retryGeneration?: () => void;
  retryCount?: number;
  openaiApiKey: string; // Deprecated but keeping for compatibility
  onApiKeyChange: (key: string) => void; // Deprecated but keeping for compatibility
  isSaveDialogOpen: boolean;
  onOpenSaveDialogChange: (isOpen: boolean) => void;
  onSaveTemplate: (name: string) => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ 
  assembledPrompt, 
  copyPrompt, 
  onSaveClick,
  variables,
  variableValues,
  onVariableChange,
  aiPreview,
  isPreviewLoading,
  previewError,
  generatePreview,
  retryGeneration,
  retryCount = 0,
  isSaveDialogOpen,
  onOpenSaveDialogChange,
  onSaveTemplate
}) => {
  const hasVariables = variables.length > 0;
  const allVariablesFilled = variables.every(v => variableValues[v]?.trim());
  const promptIsEmpty = assembledPrompt.trim() === '' || (hasVariables && !allVariablesFilled);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(assembledPrompt);
      toast({
        title: "Prompt Copied",
        description: "The assembled prompt has been copied to your clipboard.",
      });
      logger.info('Prompt copied to clipboard', 'PreviewPanel');
    } catch (error) {
      logger.error('Failed to copy prompt', 'PreviewPanel', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePreview = () => {
    generatePreview();
  };

  const handleRetryGeneration = () => {
    if (retryGeneration) {
      retryGeneration();
    } else {
      generatePreview();
    }
  };

  return (
    <div className="space-y-6 lg:col-span-2">
      <Suspense fallback={<LoadingFallback type="component" />}>
        <VariablesSection 
          variables={variables}
          variableValues={variableValues}
          onVariableChange={onVariableChange}
        />
      </Suspense>
      
      <div className="sticky top-8">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback type="component" />}>
            <PromptDisplay
              assembledPrompt={assembledPrompt}
              aiPreview={aiPreview}
              isPreviewLoading={isPreviewLoading}
              previewError={previewError}
              promptIsEmpty={promptIsEmpty}
              retryCount={retryCount}
              onCopyPrompt={handleCopyPrompt}
              onSaveClick={onSaveClick}
              onGeneratePreview={handleGeneratePreview}
              onRetryGeneration={handleRetryGeneration}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      
      <Suspense fallback={null}>
        <SaveTemplateDialog 
          isOpen={isSaveDialogOpen}
          onOpenChange={onOpenSaveDialogChange}
          onSave={onSaveTemplate}
        />
      </Suspense>
    </div>
  );
};

export default PreviewPanel;
