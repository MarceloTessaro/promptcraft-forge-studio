
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  showRetry?: boolean;
  onRetry?: () => void;
  showHome?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  action,
  showRetry = true,
  onRetry,
  showHome = false
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-white/70 mb-6">{message}</p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {showRetry && (
          <Button 
            onClick={handleRetry}
            variant="default"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        
        {action && (
          <Button 
            onClick={action.onClick}
            variant="outline"
          >
            {action.label}
          </Button>
        )}
        
        {showHome && (
          <Button 
            onClick={handleGoHome}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ErrorDisplay;
