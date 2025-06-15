
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { PromptAnalysis } from '@/types/optimizer';

interface PromptAnalysisCardProps {
  analysis: PromptAnalysis;
}

const PromptAnalysisCard: React.FC<PromptAnalysisCardProps> = ({ analysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Análise do Prompt
          </CardTitle>
          <Badge className={`${getScoreBadgeColor(analysis.score)} text-white`}>
            Score: {analysis.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(analysis.score)} mb-2`}>
            {analysis.score}
          </div>
          <p className="text-white/70">Pontuação Geral</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Clareza</span>
              <span className="text-white">{analysis.metrics.clarity}%</span>
            </div>
            <Progress value={analysis.metrics.clarity} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Especificidade</span>
              <span className="text-white">{analysis.metrics.specificity}%</span>
            </div>
            <Progress value={analysis.metrics.specificity} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Estrutura</span>
              <span className="text-white">{analysis.metrics.structure}%</span>
            </div>
            <Progress value={analysis.metrics.structure} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Completude</span>
              <span className="text-white">{analysis.metrics.completeness}%</span>
            </div>
            <Progress value={analysis.metrics.completeness} className="h-2" />
          </div>
        </div>

        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Pontos Fortes
            </h4>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {analysis.weaknesses.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Pontos de Melhoria
            </h4>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              Sugestões
            </h4>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptAnalysisCard;
