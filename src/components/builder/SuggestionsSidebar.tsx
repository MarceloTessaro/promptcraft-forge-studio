
import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb, Zap, Copy, CheckCircle } from 'lucide-react';

const suggestions = [
    {
      title: 'Be Specific',
      description: 'Include exact output format requirements',
      icon: <Zap className="w-4 h-4 text-amber-400" />
    },
    {
      title: 'Add Context',
      description: 'Provide relevant background information',
      icon: <Lightbulb className="w-4 h-4 text-blue-400" />
    },
    {
      title: 'Use Examples',
      description: 'Show desired input/output patterns',
      icon: <Copy className="w-4 h-4 text-emerald-400" />
    },
    {
      title: 'Set Constraints',
      description: 'Define clear boundaries and limitations',
      icon: <CheckCircle className="w-4 h-4 text-violet-400" />
    }
  ];

const SuggestionsSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="card-elevated p-6 animate-fadeIn animate-delay-200">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Smart Suggestions</h3>
        </div>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="glass-subtle p-4 rounded-xl hover:glass transition-all duration-200 group">
              <div className="flex items-start gap-3">
                {suggestion.icon}
                <div>
                  <h4 className="font-medium text-white mb-1 group-hover:gradient-text transition-all duration-200">
                    {suggestion.title}
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">{suggestion.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SuggestionsSidebar;
