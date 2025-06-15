
import { PromptAnalysis, OptimizationSuggestion } from '@/types/optimizer';

export class PromptAnalyzer {
  static analyzePrompt(prompt: string): PromptAnalysis {
    const metrics = this.calculateMetrics(prompt);
    const score = this.calculateOverallScore(metrics);
    const analysis = this.generateAnalysis(prompt, metrics);

    return {
      score,
      ...analysis,
      metrics
    };
  }

  private static calculateMetrics(prompt: string) {
    return {
      clarity: this.assessClarity(prompt),
      specificity: this.assessSpecificity(prompt),
      structure: this.assessStructure(prompt),
      completeness: this.assessCompleteness(prompt)
    };
  }

  private static assessClarity(prompt: string): number {
    let score = 70; // Base score
    
    // Check for clear instructions
    if (/\b(please|kindly|specifically|exactly|precisely)\b/i.test(prompt)) score += 10;
    
    // Check for ambiguous words
    if (/\b(maybe|perhaps|might|could|some|few|many)\b/i.test(prompt)) score -= 15;
    
    // Check sentence length (penalize very long sentences)
    const avgSentenceLength = prompt.split(/[.!?]+/).reduce((acc, sentence) => 
      acc + sentence.trim().split(' ').length, 0) / prompt.split(/[.!?]+/).length;
    if (avgSentenceLength > 25) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private static assessSpecificity(prompt: string): number {
    let score = 60; // Base score
    
    // Check for specific requirements
    if (/\b(format|style|tone|length|structure)\b/i.test(prompt)) score += 15;
    
    // Check for examples
    if (/\b(example|for instance|such as|like)\b/i.test(prompt)) score += 10;
    
    // Check for constraints
    if (/\b(don't|avoid|exclude|must not|should not)\b/i.test(prompt)) score += 10;
    
    // Check for measurements/quantities
    if (/\b(\d+\s*(words?|characters?|sentences?|paragraphs?|pages?))\b/i.test(prompt)) score += 15;
    
    return Math.max(0, Math.min(100, score));
  }

  private static assessStructure(prompt: string): number {
    let score = 50; // Base score
    
    // Check for numbered/bulleted lists
    if (/^\s*[\d\-\*]\s+/m.test(prompt)) score += 20;
    
    // Check for clear sections
    if (/\b(context|task|format|example|constraint)\b/i.test(prompt)) score += 15;
    
    // Check for role definition
    if (/\b(you are|act as|as a|role of)\b/i.test(prompt)) score += 15;
    
    return Math.max(0, Math.min(100, score));
  }

  private static assessCompleteness(prompt: string): number {
    let score = 40; // Base score
    
    const hasContext = /\b(context|background|situation|scenario)\b/i.test(prompt);
    const hasTask = /\b(task|goal|objective|create|generate|write)\b/i.test(prompt);
    const hasFormat = /\b(format|structure|output|response)\b/i.test(prompt);
    const hasConstraints = /\b(constraint|limit|rule|requirement)\b/i.test(prompt);
    
    if (hasContext) score += 15;
    if (hasTask) score += 20;
    if (hasFormat) score += 15;
    if (hasConstraints) score += 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateOverallScore(metrics: any): number {
    return Math.round(
      (metrics.clarity * 0.3 + 
       metrics.specificity * 0.25 + 
       metrics.structure * 0.25 + 
       metrics.completeness * 0.2)
    );
  }

  private static generateAnalysis(prompt: string, metrics: any) {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    // Analyze strengths
    if (metrics.clarity >= 80) strengths.push("Clear and unambiguous instructions");
    if (metrics.specificity >= 80) strengths.push("Well-defined requirements and constraints");
    if (metrics.structure >= 80) strengths.push("Well-organized and structured content");
    if (metrics.completeness >= 80) strengths.push("Comprehensive coverage of all aspects");

    // Analyze weaknesses and generate suggestions
    if (metrics.clarity < 70) {
      weaknesses.push("Instructions could be clearer");
      suggestions.push("Use more specific action words and avoid ambiguous terms");
    }
    
    if (metrics.specificity < 70) {
      weaknesses.push("Lacks specific requirements");
      suggestions.push("Add specific format requirements, word counts, or style guidelines");
    }
    
    if (metrics.structure < 70) {
      weaknesses.push("Could benefit from better organization");
      suggestions.push("Organize your prompt with clear sections: Context, Task, Format, Examples");
    }
    
    if (metrics.completeness < 70) {
      weaknesses.push("Missing key components");
      suggestions.push("Include context, clear objectives, and desired output format");
    }

    // Additional suggestions based on content analysis
    if (!/\b(example|for instance)\b/i.test(prompt)) {
      suggestions.push("Consider adding examples to clarify your expectations");
    }
    
    if (!/\b(tone|style)\b/i.test(prompt)) {
      suggestions.push("Specify the desired tone or writing style");
    }

    return { strengths, weaknesses, suggestions };
  }
}
