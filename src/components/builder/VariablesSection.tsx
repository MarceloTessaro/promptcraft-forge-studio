
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface VariablesSectionProps {
  variables: string[];
  variableValues: Record<string, string>;
  onVariableChange: (variable: string, value: string) => void;
}

const VariablesSection: React.FC<VariablesSectionProps> = ({
  variables,
  variableValues,
  onVariableChange,
}) => {
  if (variables.length === 0) return null;

  return (
    <ErrorBoundary>
      <Card className="card-elevated p-6 animate-fadeIn animate-delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-amber-400" />
            Variables
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {variables.map(variable => (
            <div key={variable} className="grid w-full items-center gap-1.5">
              <Label htmlFor={variable} className="text-white/80 capitalize">
                {variable.replace(/_/g, ' ')}
              </Label>
              <Input
                id={variable}
                type="text"
                placeholder={`Enter value for ${variable}...`}
                value={variableValues[variable] || ''}
                onChange={(e) => onVariableChange(variable, e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          ))}
        </div>
      </Card>
    </ErrorBoundary>
  );
};

export default VariablesSection;
