
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  AlertTriangle, 
  Plus, 
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Suggestion } from '@/utils/suggestionEngine';

interface SmartSuggestionsProps {
  suggestions: Suggestion[];
  onApplySuggestion?: (suggestion: Suggestion) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ 
  suggestions, 
  onApplySuggestion 
}) => {
  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp className="w-4 h-4" />;
      case 'addition':
        return <Plus className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'best-practice':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'improvement':
        return 'text-blue-400';
      case 'addition':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'best-practice':
        return 'text-purple-400';
      default:
        return 'text-white/80';
    }
  };

  const getPriorityBadge = (priority: Suggestion['priority']) => {
    const colors = {
      high: 'bg-red-600',
      medium: 'bg-yellow-600',
      low: 'bg-green-600'
    };
    
    return (
      <Badge className={`${colors[priority]} text-white text-xs`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const getCategoryIcon = (category: Suggestion['category']) => {
    switch (category) {
      case 'structure':
        return <Target className="w-3 h-3" />;
      case 'clarity':
        return <Lightbulb className="w-3 h-3" />;
      case 'specificity':
        return <TrendingUp className="w-3 h-3" />;
      case 'examples':
        return <CheckCircle className="w-3 h-3" />;
      case 'constraints':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Target className="w-3 h-3" />;
    }
  };

  if (suggestions.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Excelente!</h3>
          <p className="text-white/60 text-sm">
            Seu prompt está bem estruturado. Continue adicionando conteúdo para mais sugestões.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Sugestões Inteligentes
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            {suggestions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.slice(0, 5).map((suggestion) => (
          <div
            key={suggestion.id}
            className="glass-subtle p-4 rounded-lg border border-white/10 group hover:border-white/20 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`${getTypeColor(suggestion.type)}`}>
                  {getIcon(suggestion.type)}
                </div>
                <span className="text-white font-medium text-sm">
                  {suggestion.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityBadge(suggestion.priority)}
                <div className="flex items-center gap-1 text-white/50 text-xs">
                  {getCategoryIcon(suggestion.category)}
                  <span className="capitalize">{suggestion.category}</span>
                </div>
              </div>
            </div>
            
            <p className="text-white/80 text-sm mb-3 leading-relaxed">
              {suggestion.description}
            </p>
            
            {suggestion.action && (
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs italic">
                  💡 {suggestion.action}
                </p>
                {onApplySuggestion && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onApplySuggestion(suggestion)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    Aplicar
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
        
        {suggestions.length > 5 && (
          <div className="text-center pt-2">
            <p className="text-white/50 text-xs">
              +{suggestions.length - 5} sugestões adicionais disponíveis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;
