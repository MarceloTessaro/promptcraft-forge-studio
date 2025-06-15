
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronRight, ChevronLeft, Lightbulb, Zap, Target, CheckCircle } from 'lucide-react';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to PromptCraft! 🎉",
      description: "Let's get you started with building amazing AI prompts in just a few steps.",
      icon: <Lightbulb className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            PromptCraft helps you create, optimize, and manage AI prompts with ease. 
            You'll learn to build effective prompts using our structured approach.
          </p>
          <div className="bg-gradient-to-r from-violet-500/20 to-blue-500/20 p-4 rounded-lg border border-violet-500/30">
            <p className="text-sm text-violet-200">
              💡 <strong>Pro Tip:</strong> Great prompts have clear context, specific tasks, and defined formats.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Understanding Prompt Blocks",
      description: "Learn about the building blocks that make effective prompts.",
      icon: <Target className="w-8 h-8 text-blue-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/80 mb-4">Each prompt is built using these essential blocks:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Context</h4>
                <p className="text-sm text-white/70">Background information for the AI</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Task</h4>
                <p className="text-sm text-white/70">What you want the AI to do</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Format</h4>
                <p className="text-sm text-white/70">How you want the output structured</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Using Variables",
      description: "Make your prompts dynamic with variables.",
      icon: <Zap className="w-8 h-8 text-violet-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Variables let you create reusable prompts that adapt to different inputs.
          </p>
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <p className="text-sm text-zinc-300 mb-2">Example:</p>
            <code className="text-green-400 text-sm">
              {"Write a {{type}} about {{topic}} in {{style}} style."}
            </code>
          </div>
          <p className="text-white/70 text-sm">
            Variables are enclosed in double curly braces. When you use variables, 
            you'll see input fields to fill them in before generating your prompt.
          </p>
        </div>
      )
    },
    {
      title: "AI Preview & Smart Suggestions",
      description: "Get instant feedback and optimization tips.",
      icon: <CheckCircle className="w-8 h-8 text-green-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Use our AI-powered features to improve your prompts:
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-white/5 rounded-lg">
              <h4 className="font-semibold text-white mb-1">🧠 AI Preview</h4>
              <p className="text-sm text-white/70">
                See how the AI responds to your prompt before using it elsewhere.
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <h4 className="font-semibold text-white mb-1">💡 Smart Suggestions</h4>
              <p className="text-sm text-white/70">
                Get personalized tips to improve your prompt's effectiveness.
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <h4 className="font-semibold text-white mb-1">📊 Analytics</h4>
              <p className="text-sm text-white/70">
                Track character count, word count, and complexity metrics.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 animate-scaleIn">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {steps[currentStep].icon}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {steps[currentStep].title}
                </h2>
                <p className="text-white/70 text-sm sm:text-base">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-8">
            {steps[currentStep].content}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-violet-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-violet-500/20 text-violet-300">
                {currentStep + 1} of {steps.length}
              </Badge>
              
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={onClose}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Get Started
                    <CheckCircle className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingGuide;
