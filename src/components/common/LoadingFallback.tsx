
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface LoadingFallbackProps {
  type?: 'page' | 'component' | 'list';
  className?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  type = 'component', 
  className = '' 
}) => {
  if (type === 'page') {
    return (
      <div className={`min-h-screen py-8 bg-background ${className}`}>
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <Card className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </Card>
            </div>
            <div className="lg:col-span-7">
              <Card className="p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-64 w-full" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </Card>
  );
};

export default LoadingFallback;
