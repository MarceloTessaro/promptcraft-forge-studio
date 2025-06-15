
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Check } from 'lucide-react';

const CtaSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="card-elevated p-12 text-center glow-pulse animate-fadeIn relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-cyan-600/10" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of AI professionals who trust PromptCraft for their prompt engineering needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/builder">
              <Button className="group" variant="default" size="lg">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              View Pricing
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
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
      </Card>
    </section>
  );
};

export default CtaSection;
