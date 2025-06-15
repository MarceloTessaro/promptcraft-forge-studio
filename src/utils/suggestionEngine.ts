
import { PromptBlock } from '@/types/builder';

export interface Suggestion {
  id: string;
  type: 'improvement' | 'addition' | 'warning' | 'best-practice';
  category: 'structure' | 'clarity' | 'specificity' | 'examples' | 'constraints';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
  blockId?: string;
}

export class SuggestionEngine {
  static generateSuggestions(blocks: PromptBlock[]): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    // Analyze overall structure
    suggestions.push(...this.analyzeStructure(blocks));
    
    // Analyze individual blocks
    blocks.forEach(block => {
      suggestions.push(...this.analyzeBlock(block, blocks));
    });
    
    // Analyze completeness
    suggestions.push(...this.analyzeCompleteness(blocks));
    
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private static analyzeStructure(blocks: PromptBlock[]): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const blockTypes = blocks.map(b => b.type);
    
    // Check for logical order
    const hasContext = blockTypes.includes('context');
    const hasTask = blockTypes.includes('task');
    const contextIndex = blockTypes.indexOf('context');
    const taskIndex = blockTypes.indexOf('task');
    
    if (hasContext && hasTask && contextIndex > taskIndex) {
      suggestions.push({
        id: 'structure-order',
        type: 'improvement',
        category: 'structure',
        title: 'Reorganize Block Order',
        description: 'Context should typically come before the main task for better clarity.',
        action: 'Move context block before task block',
        priority: 'medium'
      });
    }
    
    // Check for missing essential blocks
    if (!hasContext && blocks.length > 1) {
      suggestions.push({
        id: 'missing-context',
        type: 'addition',
        category: 'structure',
        title: 'Add Context Block',
        description: 'Adding context helps the AI understand the background and situation.',
        action: 'Add a context block to provide background information',
        priority: 'medium'
      });
    }
    
    if (!hasTask) {
      suggestions.push({
        id: 'missing-task',
        type: 'addition',
        category: 'structure',
        title: 'Add Task Block',
        description: 'A clear task definition is essential for good results.',
        action: 'Add a task block to define what you want the AI to do',
        priority: 'high'
      });
    }
    
    return suggestions;
  }

  private static analyzeBlock(block: PromptBlock, allBlocks: PromptBlock[]): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const content = block.content.trim();
    
    if (!content) return suggestions;
    
    // Analyze content length
    if (content.length < 20) {
      suggestions.push({
        id: `short-content-${block.id}`,
        type: 'improvement',
        category: 'clarity',
        title: `Expand ${block.type} Block`,
        description: `Your ${block.type} block is quite short. More detail usually leads to better results.`,
        action: 'Add more specific details and context',
        priority: 'low',
        blockId: block.id
      });
    }
    
    // Check for vague language
    const vagueTerms = ['some', 'few', 'many', 'good', 'better', 'nice', 'maybe', 'perhaps'];
    const hasVagueTerms = vagueTerms.some(term => 
      content.toLowerCase().includes(term.toLowerCase())
    );
    
    if (hasVagueTerms) {
      suggestions.push({
        id: `vague-language-${block.id}`,
        type: 'improvement',
        category: 'specificity',
        title: 'Be More Specific',
        description: 'Avoid vague terms like "some", "few", "good". Use specific numbers, criteria, or examples.',
        action: 'Replace vague terms with specific details',
        priority: 'medium',
        blockId: block.id
      });
    }
    
    // Check for missing examples in task blocks
    if (block.type === 'task' && !content.toLowerCase().includes('example')) {
      const hasExampleBlock = allBlocks.some(b => b.type === 'examples');
      if (!hasExampleBlock) {
        suggestions.push({
          id: `missing-examples-${block.id}`,
          type: 'addition',
          category: 'examples',
          title: 'Consider Adding Examples',
          description: 'Examples help clarify your expectations and improve output quality.',
          action: 'Add an examples block or include examples in your task description',
          priority: 'medium',
          blockId: block.id
        });
      }
    }
    
    // Check for constraints in task blocks
    if (block.type === 'task' && content.length > 100) {
      const hasConstraints = content.toLowerCase().includes('don\'t') || 
                           content.toLowerCase().includes('avoid') ||
                           content.toLowerCase().includes('must not');
      const hasConstraintBlock = allBlocks.some(b => b.type === 'constraints');
      
      if (!hasConstraints && !hasConstraintBlock) {
        suggestions.push({
          id: `missing-constraints-${block.id}`,
          type: 'addition',
          category: 'constraints',
          title: 'Define Constraints',
          description: 'Adding constraints helps prevent unwanted outputs and improves focus.',
          action: 'Add constraints block or specify what to avoid',
          priority: 'low',
          blockId: block.id
        });
      }
    }
    
    return suggestions;
  }

  private static analyzeCompleteness(blocks: PromptBlock[]): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const blockTypes = blocks.map(b => b.type);
    
    // Check for format specification
    if (!blockTypes.includes('format') && blocks.length > 2) {
      suggestions.push({
        id: 'missing-format',
        type: 'addition',
        category: 'structure',
        title: 'Specify Output Format',
        description: 'Defining the desired output format helps ensure you get results in the right structure.',
        action: 'Add a format block to specify how you want the output structured',
        priority: 'medium'
      });
    }
    
    // Check for balance
    const hasMultipleBlocks = blocks.length >= 3;
    const totalContent = blocks.reduce((sum, block) => sum + block.content.length, 0);
    
    if (hasMultipleBlocks && totalContent < 200) {
      suggestions.push({
        id: 'expand-content',
        type: 'improvement',
        category: 'clarity',
        title: 'Expand Your Prompt',
        description: 'Your prompt could benefit from more detailed descriptions in each section.',
        action: 'Add more specific details to make your requirements clearer',
        priority: 'low'
      });
    }
    
    return suggestions;
  }
}
