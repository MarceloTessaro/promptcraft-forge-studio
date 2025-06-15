import { PromptAnalysis, OptimizationSuggestion, DetailedAnalysis } from '@/types/optimizer';

export class PromptAnalyzer {
  static analyzePrompt(prompt: string): DetailedAnalysis {
    const metrics = this.calculateMetrics(prompt);
    const score = this.calculateOverallScore(metrics);
    const analysis = this.generateAnalysis(prompt, metrics);
    const optimizationSuggestions = this.generateOptimizationSuggestions(prompt, metrics);

    return {
      score,
      ...analysis,
      metrics,
      optimizationSuggestions,
      wordCount: prompt.split(/\s+/).filter(word => word.length > 0).length,
      readabilityScore: this.calculateReadabilityScore(prompt),
      improvementAreas: this.getImprovementAreas(metrics)
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
    
    // Check for ambiguous words (penalty)
    const ambiguousWords = prompt.match(/\b(maybe|perhaps|might|could|some|few|many|possibly|probably)\b/gi);
    if (ambiguousWords) score -= Math.min(20, ambiguousWords.length * 3);
    
    // Check sentence complexity
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim());
    const avgWordsPerSentence = sentences.reduce((acc, sentence) => 
      acc + sentence.trim().split(' ').length, 0) / sentences.length;
    
    if (avgWordsPerSentence > 25) score -= 10;
    if (avgWordsPerSentence < 10) score -= 5;
    
    // Check for clear action verbs
    if (/\b(create|generate|write|analyze|explain|describe|list|compare|summarize)\b/i.test(prompt)) score += 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private static assessSpecificity(prompt: string): number {
    let score = 60; // Base score
    
    // Check for specific requirements
    const specificityIndicators = [
      /\b(format|style|tone|length|structure|bullet points|numbered list)\b/i,
      /\b(example|for instance|such as|like|including)\b/i,
      /\b(don't|avoid|exclude|must not|should not|never)\b/i,
      /\b(\d+\s*(words?|characters?|sentences?|paragraphs?|pages?|items?|points?))\b/i,
      /\b(professional|casual|formal|informal|technical|simple|detailed)\b/i
    ];
    
    specificityIndicators.forEach(regex => {
      if (regex.test(prompt)) score += 8;
    });
    
    // Check for measurement/quantity specificity
    const measurements = prompt.match(/\b\d+\s*(words?|characters?|minutes?|hours?|%|percent)\b/gi);
    if (measurements) score += Math.min(15, measurements.length * 5);
    
    // Check for role specification
    if (/\b(you are|act as|as a|role of|pretend to be)\b/i.test(prompt)) score += 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private static assessStructure(prompt: string): number {
    let score = 50; // Base score
    
    // Check for organized structure
    if (/^\s*[\d\-\*•]\s+/m.test(prompt)) score += 15;
    if (/^#+\s+/m.test(prompt)) score += 10; // Headers
    
    // Check for clear sections
    const structureKeywords = [
      'context', 'background', 'task', 'objective', 'goal',
      'format', 'output', 'style', 'example', 'constraint', 'requirement'
    ];
    
    const foundKeywords = structureKeywords.filter(keyword => 
      new RegExp(`\\b${keyword}\\b`, 'i').test(prompt)
    );
    score += Math.min(20, foundKeywords.length * 3);
    
    // Check for role definition
    if (/\b(you are|act as|as a|role of)\b/i.test(prompt)) score += 10;
    
    // Check for logical flow (simple heuristic)
    const hasContext = /\b(context|background|situation|scenario)\b/i.test(prompt);
    const hasTask = /\b(task|goal|objective|create|generate|write)\b/i.test(prompt);
    const hasFormat = /\b(format|structure|output|response)\b/i.test(prompt);
    
    if (hasContext && hasTask) score += 10;
    if (hasTask && hasFormat) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private static assessCompleteness(prompt: string): number {
    let score = 40; // Base score
    
    const completenessChecks = [
      { regex: /\b(context|background|situation|scenario)\b/i, points: 15, name: 'context' },
      { regex: /\b(task|goal|objective|create|generate|write|do|perform)\b/i, points: 25, name: 'task' },
      { regex: /\b(format|structure|output|response|style)\b/i, points: 15, name: 'format' },
      { regex: /\b(constraint|limit|rule|requirement|don't|avoid)\b/i, points: 10, name: 'constraints' },
      { regex: /\b(example|for instance|such as|like)\b/i, points: 10, name: 'examples' }
    ];
    
    completenessChecks.forEach(check => {
      if (check.regex.test(prompt)) score += check.points;
    });
    
    // Bonus for comprehensive prompts
    if (prompt.length > 200) score += 5;
    if (prompt.length > 500) score += 5;
    
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
      suggestions.push("Use more specific action words and avoid ambiguous terms like 'maybe', 'perhaps', 'some'");
    }
    
    if (metrics.specificity < 70) {
      weaknesses.push("Lacks specific requirements");
      suggestions.push("Add specific format requirements, word counts, style guidelines, or concrete examples");
    }
    
    if (metrics.structure < 70) {
      weaknesses.push("Could benefit from better organization");
      suggestions.push("Organize your prompt with clear sections using headers or bullet points: Context → Task → Format → Examples");
    }
    
    if (metrics.completeness < 70) {
      weaknesses.push("Missing key components");
      suggestions.push("Include background context, clear objectives, desired output format, and specific constraints");
    }

    // Content-specific suggestions
    if (!/\b(example|for instance)\b/i.test(prompt)) {
      suggestions.push("Consider adding concrete examples to clarify your expectations");
    }
    
    if (!/\b(tone|style|voice)\b/i.test(prompt)) {
      suggestions.push("Specify the desired tone, style, or voice for the response");
    }

    if (!/\b(\d+\s*words?|\d+\s*sentences?|\d+\s*paragraphs?)\b/i.test(prompt)) {
      suggestions.push("Define specific length requirements (word count, number of points, etc.)");
    }

    return { strengths, weaknesses, suggestions };
  }

  private static generateOptimizationSuggestions(prompt: string, metrics: any): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Structure improvements
    if (metrics.structure < 70) {
      suggestions.push({
        type: 'restructure',
        category: 'structure',
        description: 'Reorganize your prompt with clear sections for better readability and effectiveness',
        before: prompt.slice(0, 100) + "...",
        after: "## Context\n[Background information]\n\n## Task\n[Specific objective]\n\n## Format\n[Desired output structure]",
        impact: 'high'
      });
    }

    // Clarity improvements
    if (metrics.clarity < 70) {
      const ambiguousTerms = prompt.match(/\b(maybe|perhaps|might|could|some|few|many)\b/gi);
      if (ambiguousTerms) {
        suggestions.push({
          type: 'improvement',
          category: 'clarity',
          description: 'Replace ambiguous terms with specific language',
          before: ambiguousTerms[0],
          after: this.getSuggestedReplacement(ambiguousTerms[0]),
          impact: 'medium'
        });
      }
    }

    // Completeness additions
    if (metrics.completeness < 70) {
      if (!/\b(example|for instance)\b/i.test(prompt)) {
        suggestions.push({
          type: 'addition',
          category: 'examples',
          description: 'Add concrete examples to clarify expectations',
          after: "Examples:\n- [Provide 1-2 specific examples of desired output]",
          impact: 'high'
        });
      }

      if (!/\b(constraint|don't|avoid)\b/i.test(prompt)) {
        suggestions.push({
          type: 'addition',
          category: 'constraints',
          description: 'Define what should be avoided or excluded',
          after: "Constraints:\n- Don't include [specify what to avoid]\n- Keep response under [X] words",
          impact: 'medium'
        });
      }
    }

    // Specificity improvements
    if (metrics.specificity < 70) {
      if (!/\b(\d+\s*words?|\d+\s*sentences?)\b/i.test(prompt)) {
        suggestions.push({
          type: 'addition',
          category: 'specificity',
          description: 'Add specific length or quantity requirements',
          after: "Length: Approximately [X] words or [Y] bullet points",
          impact: 'medium'
        });
      }
    }

    return suggestions;
  }

  private static getSuggestedReplacement(ambiguousTerm: string): string {
    const replacements: Record<string, string> = {
      'maybe': 'specifically',
      'perhaps': 'exactly',
      'might': 'should',
      'could': 'will',
      'some': 'three to five',
      'few': 'two to three',
      'many': 'at least five'
    };
    return replacements[ambiguousTerm.toLowerCase()] || 'specifically';
  }

  private static calculateReadabilityScore(prompt: string): number {
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim());
    const words = prompt.split(/\s+/).filter(word => word.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Simple readability score based on sentence length
    if (avgWordsPerSentence <= 15) return 90;
    if (avgWordsPerSentence <= 20) return 75;
    if (avgWordsPerSentence <= 25) return 60;
    return 45;
  }

  private static getImprovementAreas(metrics: any): string[] {
    const areas: string[] = [];
    
    if (metrics.clarity < 70) areas.push('Clarity');
    if (metrics.specificity < 70) areas.push('Specificity');
    if (metrics.structure < 70) areas.push('Structure');
    if (metrics.completeness < 70) areas.push('Completeness');
    
    return areas;
  }

  static generateOptimizedPrompt(originalPrompt: string, analysis: DetailedAnalysis): string {
    let optimized = originalPrompt;
    
    // Apply structural improvements
    if (analysis.metrics.structure < 70) {
      const hasHeaders = /^#+\s+/m.test(optimized);
      if (!hasHeaders) {
        // Add basic structure if missing
        optimized = `## Context\n${optimized}\n\n## Task\n[Please define your specific task here]\n\n## Format\n[Specify desired output format]`;
      }
    }
    
    // Apply clarity improvements
    if (analysis.metrics.clarity < 70) {
      optimized = optimized.replace(/\b(maybe|perhaps|might|could)\b/gi, (match) => {
        const replacements: Record<string, string> = {
          'maybe': 'specifically',
          'perhaps': 'exactly',
          'might': 'should',
          'could': 'will'
        };
        return replacements[match.toLowerCase()] || match;
      });
    }
    
    // Add specificity improvements
    if (analysis.metrics.specificity < 70) {
      if (!/\b(\d+\s*words?|\d+\s*points?)\b/i.test(optimized)) {
        optimized += '\n\nPlease provide a response of approximately 200-300 words with specific examples.';
      }
    }
    
    // Add completeness improvements
    if (analysis.metrics.completeness < 70) {
      if (!/\b(constraint|don't|avoid)\b/i.test(optimized)) {
        optimized += '\n\nConstraints: Please be concise and avoid unnecessary jargon.';
      }
    }
    
    return optimized.trim();
  }
}
