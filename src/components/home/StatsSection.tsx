
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Sparkles, Layout, Target } from 'lucide-react';

const stats = [
  { number: '10K+', label: 'Active Users', icon: <Users className="w-5 h-5" /> },
  { number: '50K+', label: 'Prompts Created', icon: <Sparkles className="w-5 h-5" /> },
  { number: '500+', label: 'Templates', icon: <Layout className="w-5 h-5" /> },
  { number: '98%', label: 'Satisfaction Rate', icon: <Target className="w-5 h-5" /> }
];

const StatsSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="card-elevated text-center p-6 animate-fadeIn hover:scale-105 transition-transform duration-300" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-center mb-3">
              <div className="text-violet-400">{stat.icon}</div>
            </div>
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
            <div className="text-white/70 text-sm font-medium">{stat.label}</div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
