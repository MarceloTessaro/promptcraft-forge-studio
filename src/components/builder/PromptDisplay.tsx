
import React, { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Copy, Save, Zap, BrainCircuit, RefreshCw, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

interface PromptDisplayProps {
  assembledPrompt: string;
  aiPreview: string;
  isPreviewLoading: boolean;
  previewError: string;
  promptIsEmpty: boolean;
  retryCount?: number;
  onCopyPrompt: () => void;
  onSaveClick: () => void;
  onGeneratePreview: () => void;
  onRetryGeneration?: () => void;
}

const PromptDisplaySkeleton = () => (
  <Card className="card-elevated p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
    <div className="flex justify-end mb-4">
      <Skeleton className="h-10 w-36" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
      <div>
        <Skeleton className="h-6 w-32 mb-3" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div>
        <Skeleton className="h-6 w-32 mb-3" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  </Card>
);

const PromptDisplay: React.FC<PromptDisplayProps> = ({
  assembledPrompt,
  aiPreview,
  isPreviewLoading,
  previewError,
  promptIsEmpty,
  retryCount = 0,
  onCopyPrompt,
  onSaveClick,
  onGeneratePreview,
  onRetryGeneration,
}) => {
  const handleRetryPreview = () => {
    if (onRetryGeneration) {
      onRetryGeneration();
    } else {
      onGeneratePreview();
    }
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<PromptDisplaySkeleton />}>
        <Card className="card-elevated p-4 sm:p-6 animate-fadeIn animate-delay-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-violet-400" />
              Prompt & AI Preview
            </h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                size="sm" 
                onClick={onCopyPrompt} 
                variant="secondary" 
                disabled={promptIsEmpty}
                className="flex-1 sm:flex-none"
              >
                <Copy className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button 
                size="sm" 
                onClick={onSaveClick} 
                variant="default" 
                disabled={promptIsEmpty}
                className="flex-1 sm:flex-none"
              >
                <Save className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <div className="text-sm text-white/60">
              Characters: <span className="text-white font-medium">{assembledPrompt.length}</span>
              {" • "}
              Words: <span className="text-white font-medium">
                {assembledPrompt.split(/\s+/).filter(word => word.length > 0).length}
              </span>
            </div>
            <Button 
              onClick={onGeneratePreview} 
              disabled={promptIsEmpty || isPreviewLoading} 
              className="bg-gradient-to-r from-violet-500 to-blue-500 text-white w-full sm:w-auto"
              size="sm"
            >
              {isPreviewLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Zap className="w-4 h-4 sm:mr-2" />
              )}
              <span className="ml-2 sm:ml-0">Generate Preview</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 glass-dark p-4 sm:p-6 rounded-xl min-h-[300px] border border-white/10">
            {/* Final Prompt Section */}
            <div className="min-h-[250px]">
              <h4 className="text-base font-bold text-white/90 flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-violet-400" />
                Final Prompt
              </h4>
              <div className="h-full">
                {assembledPrompt ? (
                  <div className="max-h-64 overflow-y-auto">
                    <pre className="text-white/90 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {assembledPrompt}
                    </pre>
                  </div>
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
            
            {/* AI Preview Section */}
            <div className="border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-4 sm:lg:pl-6 pt-4 lg:pt-0 min-h-[250px]">
              <h4 className="text-base font-bold text-white/90 flex items-center gap-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-amber-400" />
                AI Preview
                {retryCount > 0 && (
                  <span className="text-xs text-white/50">
                    (Attempt {retryCount + 1})
                  </span>
                )}
              </h4>
              <div className="h-full">
                {isPreviewLoading && (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner size="lg" text="Generating preview..." />
                  </div>
                )}
                {previewError && !isPreviewLoading && (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{previewError}</span>
                    </div>
                    {retryCount < 3 && (
                      <Button
                        onClick={handleRetryPreview}
                        variant="outline"
                        size="sm"
                        className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry ({3 - retryCount} left)
                      </Button>
                    )}
                  </div>
                )}
                {!isPreviewLoading && !previewError && aiPreview && (
                  <div className="max-h-64 overflow-y-auto">
                    <pre className="text-white/90 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                      {aiPreview}
                    </pre>
                  </div>
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
        </Card>
      </Suspense>
    </ErrorBoundary>
  );
};

export default PromptDisplay;
