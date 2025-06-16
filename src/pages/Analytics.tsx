
import React from 'react';
import EnhancedAnalyticsDashboard from '@/components/analytics/EnhancedAnalyticsDashboard';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Advanced Analytics</h1>
          <p className="text-white/80">
            Track your prompt building activity, performance metrics, and user insights
          </p>
        </div>
        
        <EnhancedAnalyticsDashboard />
      </div>
    </div>
  );
};

export default Analytics;
