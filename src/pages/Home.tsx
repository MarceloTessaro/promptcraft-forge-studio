
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Code, 
  Layout, 
  Star, 
  Users, 
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: 'Visual Prompt Builder',
      description: 'Drag-and-drop interface with smart building blocks for creating perfect prompts.',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Template Library',
      description: 'Access hundreds of proven templates for every AI model and use case.',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Prompt Optimizer',
      description: 'AI-powered analysis to improve clarity, specificity, and effectiveness.',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Hub',
      description: 'Share, discover, and collaborate on prompts with other AI professionals.',
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', icon: <Users className="w-5 h-5" /> },
    { number: '50K+', label: 'Prompts Created', icon: <Sparkles className="w-5 h-5" /> },
    { number: '500+', label: 'Templates', icon: <Layout className="w-5 h-5" /> },
    { number: '98%', label: 'Satisfaction Rate', icon: <Target className="w-5 h-5" /> }
  ];

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
              <Button className="btn-primary group">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/templates">
              <Button className="btn-secondary">
                Browse Templates
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

      {/* Enhanced Stats Section */}
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

      {/* Enhanced Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything You Need</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Professional tools for creating, optimizing, and managing AI prompts at scale.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
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
      </section>

      {/* Enhanced How It Works Section */}
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

      {/* Enhanced CTA Section */}
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
                <Button className="btn-primary group">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button className="btn-secondary">
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
    </div>
  );
};

export default Home;
