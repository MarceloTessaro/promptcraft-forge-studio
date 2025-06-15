
export interface PromptBlock {
  id: string;
  type: 'context' | 'task' | 'format' | 'constraints' | 'examples';
  content: string;
  placeholder: string;
}
