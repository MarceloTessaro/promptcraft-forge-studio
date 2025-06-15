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
  Check 
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: 'Visual Prompt Builder',
      description: 'Drag-and-drop interface with smart building blocks for creating perfect prompts.'
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Template Library',
      description: 'Access hundreds of proven templates for every AI model and use case.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Prompt Optimizer',
      description: 'AI-powered analysis to improve clarity, specificity, and effectiveness.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Hub',
      description: 'Share, discover, and collaborate on prompts with other AI professionals.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Prompts Created' },
    { number: '500+', label: 'Templates' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Craft Perfect</span>
            <br />
            <span className="text-white">AI Prompts</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Build, optimize, and share AI prompts with our professional-grade platform. 
            Turn your ideas into powerful prompts that get results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/builder">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 glow">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Professional tools for creating, optimizing, and managing AI prompts at scale.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="glass p-6 hover:glow transition-all duration-300">
              <div className="text-purple-400 mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Three simple steps to create professional AI prompts
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Choose Your Template',
              description: 'Start with a proven template or build from scratch using our visual editor.'
            },
            {
              step: '02',
              title: 'Customize & Optimize',
              description: 'Add your specific requirements and let our AI optimizer suggest improvements.'
            },
            {
              step: '03',
              title: 'Test & Deploy',
              description: 'Preview your prompt, test with different models, and deploy to production.'
            }
          ].map((step, index) => (
            <div key={index} className="text-center animate-fadeIn" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg glow">
                {step.step}
              </div>
              <h3 className="text-white font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="glass p-12 text-center glow">
          <h2 className="text-4xl font-bold gradient-text mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of AI professionals who trust PromptCraft for their prompt engineering needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/builder">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
              View Pricing
            </Button>
          </div>
          <div className="flex items-center justify-center mt-6 space-x-4 text-sm text-white/60">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-1" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-1" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-1" />
              Cancel anytime
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Home;
