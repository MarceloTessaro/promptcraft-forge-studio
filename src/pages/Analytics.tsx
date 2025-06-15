
import React from 'react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Analytics</h1>
          <p className="text-white/80">Track your prompt building activity and insights</p>
        </div>
        
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default Analytics;
