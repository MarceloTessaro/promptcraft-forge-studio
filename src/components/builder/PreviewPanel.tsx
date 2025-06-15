
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Copy, Save, Zap } from 'lucide-react';

interface PreviewPanelProps {
  assembledPrompt: string;
  copyPrompt: () => void;
  savePrompt: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ assembledPrompt, copyPrompt, savePrompt }) => {
  return (
    <div className="space-y-6">
      <Card className="card-elevated p-6 animate-fadeIn animate-delay-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-violet-400" />
            Preview
          </h3>
          <div className="flex gap-2">
            <Button size="icon" onClick={copyPrompt} variant="secondary">
              <Copy className="w-5 h-5" />
            </Button>
            <Button size="icon" onClick={savePrompt} variant="default">
              <Save className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="glass-dark p-6 rounded-xl min-h-[300px] border border-white/10">
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
    </div>
  );
};

export default PreviewPanel;
