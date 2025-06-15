
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-center relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-transparent to-cyan-600/20 blur-3xl -z-10" />
      <div className="max-w-5xl mx-auto animate-fadeIn">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-float">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white/80">New: AI-Powered Optimization</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <span className="gradient-text">Craft Perfect</span>
          <br />
          <span className="text-white">AI Prompts</span>
        </h1>
        
        <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
          Build, optimize, and share AI prompts with our professional-grade platform. 
          Turn your ideas into powerful prompts that get results every time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/builder">
            <Button className="group" variant="default" size="lg">
              Start Building
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/templates">
            <Button variant="secondary" size="lg">
              Explore Templates
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center justify-center mt-8 space-x-6 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-400" />
            No credit card required
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-400" />
            14-day free trial
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-400" />
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
