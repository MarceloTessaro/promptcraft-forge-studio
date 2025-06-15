
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, Code, Star, Users, ChevronDown } from 'lucide-react';

const features = [
  {
    icon: <Layout className="w-6 h-6" />,
    title: 'Visual Prompt Builder',
    description: 'Go from idea to production-ready prompt 5x faster with our intuitive drag-and-drop editor.',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Template Library',
    description: 'Save hours of work by starting with hundreds of proven templates for any task.',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Prompt Optimizer',
    description: 'Boost your prompt’s performance by up to 40% with AI-powered suggestions.',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community Hub',
    description: 'Leverage the collective intelligence of top prompt engineers to solve problems faster.',
    gradient: 'from-emerald-500 to-teal-600'
  }
];

const FeaturesSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedFeatures = showAll ? features : features.slice(0, 2);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything You Need</h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          Professional tools for creating, optimizing, and managing AI prompts at scale.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedFeatures.map((feature, index) => (
          <Card 
            key={index}
            className="card-elevated p-8 group hover:scale-[1.02] transition-all duration-300 animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <div className="text-white">{feature.icon}</div>
            </div>
            <h3 className="text-white font-bold text-xl mb-3 group-hover:gradient-text transition-all duration-300">
              {feature.title}
            </h3>
            <p className="text-white/70 leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </div>
      
      {!showAll && (
        <div className="text-center mt-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <Button variant="secondary" size="lg" onClick={() => setShowAll(true)}>
            Show All Features
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default FeaturesSection;
