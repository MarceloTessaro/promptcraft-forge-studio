
export interface PromptAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  metrics: {
    clarity: number;
    specificity: number;
    structure: number;
    completeness: number;
  };
}

export interface OptimizationSuggestion {
  type: 'improvement' | 'addition' | 'removal' | 'restructure';
  category: 'clarity' | 'specificity' | 'structure' | 'examples' | 'constraints';
  description: string;
  before?: string;
  after?: string;
  impact: 'low' | 'medium' | 'high';
}

export interface DetailedAnalysis extends PromptAnalysis {
  suggestions: OptimizationSuggestion[];
  wordCount: number;
  readabilityScore: number;
  improvementAreas: string[];
}
