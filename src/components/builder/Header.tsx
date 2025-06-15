
import React from 'react';
import { Zap } from 'lucide-react';
import { CustomTemplate, PromptBlock } from '@/types/builder';

interface HeaderProps {
  saveTemplate: (name: string, blocks: PromptBlock[]) => Promise<CustomTemplate>;
  loadTemplate: (template: CustomTemplate) => PromptBlock[];
  templates: CustomTemplate[];
}

const Header: React.FC<HeaderProps> = ({ saveTemplate, loadTemplate, templates }) => {
  return (
    <div className="mb-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center glow">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Visual Prompt Builder</h1>
          <p className="text-white/70 text-lg">Build effective prompts with smart building blocks</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
