
import React from 'react';
import { PromptBlock } from '@/types/builder';

interface TemplatePromptDisplayProps {
  blocks: PromptBlock[];
  className?: string;
}

const TemplatePromptDisplay: React.FC<TemplatePromptDisplayProps> = ({
  blocks,
  className = '',
}) => {
  const assemblePrompt = (blocks: PromptBlock[]) => {
    return blocks
      .filter(block => block.content.trim())
      .map(block => block.content)
      .join('\n\n');
  };

  const assembledPrompt = assemblePrompt(blocks);

  return (
    <div className={`p-4 bg-zinc-900/50 border border-zinc-700/50 rounded-lg ${className}`}>
      <pre className="text-white/90 text-sm whitespace-pre-wrap font-mono leading-relaxed">
        {assembledPrompt || 'No hay contenido en los bloques...'}
      </pre>
    </div>
  );
};

export default TemplatePromptDisplay;
