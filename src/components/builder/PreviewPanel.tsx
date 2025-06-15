
import React from 'react';
import { toast } from '@/hooks/use-toast';
import SaveTemplateDialog from './SaveTemplateDialog';
import VariablesSection from './VariablesSection';
import PromptDisplay from './PromptDisplay';
import ErrorBoundary from '@/components/common/ErrorBoundary';
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

  return (
    <div className="space-y-6 lg:col-span-2">
      <VariablesSection 
        variables={variables}
        variableValues={variableValues}
        onVariableChange={onVariableChange}
      />
      
      <div className="sticky top-8">
        <ErrorBoundary>
          <PromptDisplay
            assembledPrompt={assembledPrompt}
            aiPreview={aiPreview}
            isPreviewLoading={isPreviewLoading}
            previewError={previewError}
            promptIsEmpty={promptIsEmpty}
            onCopyPrompt={handleCopyPrompt}
            onSaveClick={onSaveClick}
            onGeneratePreview={handleGeneratePreview}
          />
        </ErrorBoundary>
      </div>
      
      <SaveTemplateDialog 
        isOpen={isSaveDialogOpen}
        onOpenChange={onOpenSaveDialogChange}
        onSave={onSaveTemplate}
      />
    </div>
  );
};

export default PreviewPanel;
