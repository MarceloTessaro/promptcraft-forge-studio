
```ts
import { PromptBlock } from './builder';

export interface LibraryTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  aiModel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  uses: number;
  blocks: PromptBlock[];
  tags: string[];
}
```
