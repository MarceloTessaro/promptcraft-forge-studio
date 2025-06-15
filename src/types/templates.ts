
import { PromptBlock } from './builder';

export interface LibraryTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  aiModel: string;
  difficulty: string;
  rating: number;
  uses: number;
  tags: string[];
  blocks: PromptBlock[];
}
