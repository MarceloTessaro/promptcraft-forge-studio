
import { PromptBlock } from './builder';

export type TemplateDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LibraryTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  aiModel: string;
  difficulty: TemplateDifficulty;
  rating: number;
  uses: number;
  tags: string[];
  blocks: PromptBlock[];
}
