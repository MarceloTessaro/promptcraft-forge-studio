
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Copy, Save, Zap, Settings2, BrainCircuit } from 'lucide-react';
import SaveTemplateDialog from './SaveTemplateDialog';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

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

  return (
    <div className="space-y-6 lg:col-span-2">
      {hasVariables && (
        <ErrorBoundary>
          <Card className="card-elevated p-6 animate-fadeIn animate-delay-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-amber-400" />
                Variables
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {variables.map(variable => (
                <div key={variable} className="grid w-full items-center gap-1.5">
                  <Label htmlFor={variable} className="text-white/80 capitalize">{variable.replace(/_/g, ' ')}</Label>
                  <Input
                    id={variable}
                    type="text"
                    placeholder={`Enter value for ${variable}...`}
                    value={variableValues[variable] || ''}
                    onChange={(e) => onVariableChange(variable, e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              ))}
            </div>
          </Card>
        </ErrorBoundary>
      )}
      
      <div className="sticky top-8">
        <ErrorBoundary>
          <Card className="card-elevated p-6 animate-fadeIn animate-delay-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-violet-400" />
                Prompt & AI Preview
              </h3>
              <div className="flex gap-2">
                <Button size="icon" onClick={copyPrompt} variant="secondary" disabled={promptIsEmpty}>
                  <Copy className="w-5 h-5" />
                </Button>
                <Button size="icon" onClick={onSaveClick} variant="default" disabled={promptIsEmpty}>
                  <Save className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <Button 
                onClick={generatePreview} 
                disabled={promptIsEmpty || isPreviewLoading} 
                className="bg-gradient-to-r from-violet-500 to-blue-500 text-white"
              >
                {isPreviewLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Zap className="w-5 h-5" />
                )}
                Generate Preview
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 glass-dark p-6 rounded-xl min-h-[300px] border border-white/10">
              <div>
                <h4 className="text-base font-bold text-white/90 flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-violet-400" />
                  Final Prompt
                </h4>
                <div className="h-full">
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
              </div>
              
              <div className="border-t border-white/10 md:border-t-0 md:border-l md:pl-6">
                <h4 className="text-base font-bold text-white/90 flex items-center gap-2 mb-3">
                  <BrainCircuit className="w-5 h-5 text-amber-400" />
                  AI Preview
                </h4>
                <div className="h-full">
                  {isPreviewLoading && (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner size="lg" text="Generating preview..." />
                    </div>
                  )}
                  {previewError && !isPreviewLoading && (
                    <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-md">
                      <p className="font-semibold">Error:</p>
                      <p>{previewError}</p>
                    </div>
                  )}
                  {!isPreviewLoading && !previewError && aiPreview && (
                    <pre className="text-white/90 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                      {aiPreview}
                    </pre>
                  )}
                  {!isPreviewLoading && !previewError && !aiPreview && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mb-3">
                        <BrainCircuit className="w-6 h-6 text-amber-400" />
                      </div>
                      <p className="text-white/60 text-sm">Click "Generate Preview" to see the AI's response.</p>
                    </div>
                  )}
                </div>
              </div>
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
