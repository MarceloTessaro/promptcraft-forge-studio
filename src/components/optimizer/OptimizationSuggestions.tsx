
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  Lightbulb, 
  TrendingUp, 
  Plus, 
  RefreshCw,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { OptimizationSuggestion } from '@/types/optimizer';

interface OptimizationSuggestionsProps {
  suggestions: OptimizationSuggestion[];
  onApplySuggestion?: (suggestion: OptimizationSuggestion) => void;
  onApplyAll?: () => void;
}

const OptimizationSuggestions: React.FC<OptimizationSuggestionsProps> = ({
  suggestions,
  onApplySuggestion,
  onApplyAll
}) => {
  const getImpactColor = (impact: OptimizationSuggestion['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
    }
  };

  const getTypeIcon = (type: OptimizationSuggestion['type']) => {
    switch (type) {
      case 'improvement': return <TrendingUp className="w-4 h-4" />;
      case 'addition': return <Plus className="w-4 h-4" />;
      case 'removal': return <AlertTriangle className="w-4 h-4" />;
      case 'restructure': return <RefreshCw className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: OptimizationSuggestion['category']) => {
    switch (category) {
      case 'structure': return <Target className="w-3 h-3" />;
      case 'clarity': return <Lightbulb className="w-3 h-3" />;
      case 'specificity': return <TrendingUp className="w-3 h-3" />;
      case 'examples': return <CheckCircle className="w-3 h-3" />;
      case 'constraints': return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const highImpactSuggestions = suggestions.filter(s => s.impact === 'high');
  const mediumImpactSuggestions = suggestions.filter(s => s.impact === 'medium');
  const lowImpactSuggestions = suggestions.filter(s => s.impact === 'low');

  if (suggestions.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">¡Prompt Excelente!</h3>
          <p className="text-white/60 text-sm">
            Tu prompt está bien optimizado. No se encontraron sugerencias de mejora.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Sugerencias de Optimización
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
              {suggestions.length}
            </Badge>
          </CardTitle>
          {onApplyAll && suggestions.length > 1 && (
            <Button
              size="sm"
              onClick={onApplyAll}
              className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
            >
              Aplicar Todas
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* High Impact Suggestions */}
        {highImpactSuggestions.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-red-400" />
              Alto Impacto
            </h4>
            <div className="space-y-4">
              {highImpactSuggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={`high-${index}`}
                  suggestion={suggestion}
                  onApply={onApplySuggestion}
                />
              ))}
            </div>
          </div>
        )}

        {/* Medium Impact Suggestions */}
        {mediumImpactSuggestions.length > 0 && (
          <>
            {highImpactSuggestions.length > 0 && <Separator className="bg-white/10" />}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                Impacto Medio
              </h4>
              <div className="space-y-4">
                {mediumImpactSuggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={`medium-${index}`}
                    suggestion={suggestion}
                    onApply={onApplySuggestion}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Low Impact Suggestions */}
        {lowImpactSuggestions.length > 0 && (
          <>
            {(highImpactSuggestions.length > 0 || mediumImpactSuggestions.length > 0) && 
             <Separator className="bg-white/10" />}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Mejoras Menores
              </h4>
              <div className="space-y-4">
                {lowImpactSuggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={`low-${index}`}
                    suggestion={suggestion}
                    onApply={onApplySuggestion}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

interface SuggestionCardProps {
  suggestion: OptimizationSuggestion;
  onApply?: (suggestion: OptimizationSuggestion) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onApply }) => {
  const getImpactColor = (impact: OptimizationSuggestion['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
    }
  };

  const getTypeIcon = (type: OptimizationSuggestion['type']) => {
    switch (type) {
      case 'improvement': return <TrendingUp className="w-4 h-4" />;
      case 'addition': return <Plus className="w-4 h-4" />;
      case 'removal': return <AlertTriangle className="w-4 h-4" />;
      case 'restructure': return <RefreshCw className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: OptimizationSuggestion['category']) => {
    switch (category) {
      case 'structure': return <Target className="w-3 h-3" />;
      case 'clarity': return <Lightbulb className="w-3 h-3" />;
      case 'specificity': return <TrendingUp className="w-3 h-3" />;
      case 'examples': return <CheckCircle className="w-3 h-3" />;
      case 'constraints': return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <div className="glass-subtle p-4 rounded-lg border border-white/10 group hover:border-white/20 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-white/80">
            {getTypeIcon(suggestion.type)}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getImpactColor(suggestion.impact)} variant="secondary">
              {suggestion.impact.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1 text-white/50 text-xs">
              {getCategoryIcon(suggestion.category)}
              <span className="capitalize">{suggestion.category}</span>
            </div>
          </div>
        </div>
        {onApply && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onApply(suggestion)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          >
            Aplicar
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>
      
      <p className="text-white/90 text-sm mb-3 leading-relaxed">
        {suggestion.description}
      </p>
      
      {suggestion.before && (
        <div className="mb-3">
          <p className="text-white/60 text-xs mb-1">Antes:</p>
          <div className="bg-red-500/10 border border-red-500/20 rounded p-2">
            <code className="text-red-300 text-xs">{suggestion.before}</code>
          </div>
        </div>
      )}
      
      {suggestion.after && (
        <div>
          <p className="text-white/60 text-xs mb-1">Después:</p>
          <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
            <code className="text-green-300 text-xs">{suggestion.after}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationSuggestions;
