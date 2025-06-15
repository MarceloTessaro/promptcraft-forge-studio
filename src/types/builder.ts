
export interface PromptBlock {
  id: string;
  type: 'context' | 'task' | 'format' | 'constraints' | 'examples';
  content: string;
  placeholder: string;
}

export interface Template {
  id: string;
  name: string;
  blocks: PromptBlock[];
  createdAt: string;
}
