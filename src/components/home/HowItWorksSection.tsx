
import React from 'react';
import { Layout, Zap, Target } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Choose Your Template',
    description: 'Start with a proven template or build from scratch using our visual editor.',
    icon: <Layout className="w-6 h-6" />
  },
  {
    step: '02',
    title: 'Customize & Optimize',
    description: 'Add your specific requirements and let our AI optimizer suggest improvements.',
    icon: <Zap className="w-6 h-6" />
  },
  {
    step: '03',
    title: 'Test & Deploy',
    description: 'Preview your prompt, test with different models, and deploy to production.',
    icon: <Target className="w-6 h-6" />
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          Three simple steps to create professional AI prompts
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="text-center group animate-fadeIn" 
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto glow group-hover:animate-glow-pulse transition-all duration-300">
                <div className="text-white font-bold text-lg">{step.step}</div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {step.icon}
              </div>
            </div>
            <h3 className="text-white font-bold text-xl mb-3 group-hover:gradient-text transition-all duration-300">
              {step.title}
            </h3>
            <p className="text-white/70 leading-relaxed max-w-sm mx-auto">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
