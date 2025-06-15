import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  BarChart3, 
  Copy, 
  RefreshCw,
  Sparkles,
  TrendingUp,
  FileText,
  Target,
  Lightbulb
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DetailedAnalysis, OptimizationSuggestion } from '@/types/optimizer';
import { PromptAnalyzer } from '@/utils/promptAnalyzer';
import PromptAnalysisCard from '@/components/optimizer/PromptAnalysisCard';
import OptimizationSuggestions from '@/components/optimizer/OptimizationSuggestions';

const Optimizer = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [analysis, setAnalysis] = useState<DetailedAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([]);

  const analyzePrompt = async () => {
    if (!inputPrompt.trim()) {
      toast({
        title: "Prompt Vazio",
        description: "Por favor, insira um prompt para analisar.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay for better UX
    setTimeout(() => {
      const promptAnalysis = PromptAnalyzer.analyzePrompt(inputPrompt);
      setAnalysis(promptAnalysis);
      
      // Set optimization suggestions from the analysis
      setOptimizationSuggestions(promptAnalysis.optimizationSuggestions);
      
      // Generate optimized prompt
      const optimized = PromptAnalyzer.generateOptimizedPrompt(inputPrompt, promptAnalysis);
      setOptimizedPrompt(optimized);
      
      setIsAnalyzing(false);
    }, 1500);
  };

  const applySuggestion = (suggestion: OptimizationSuggestion) => {
    let newPrompt = inputPrompt;
    
    switch (suggestion.type) {
      case 'improvement':
        if (suggestion.before && suggestion.after) {
          newPrompt = newPrompt.replace(suggestion.before, suggestion.after);
        }
        break;
      case 'addition':
        if (suggestion.after) {
          newPrompt += '\n\n' + suggestion.after;
        }
        break;
      case 'restructure':
        if (suggestion.after) {
          // For restructure, we'll provide the new structure as a template
          setOptimizedPrompt(suggestion.after);
        }
        break;
    }
    
    setInputPrompt(newPrompt);
    toast({
      title: "Sugerencia Aplicada",
      description: "La mejora se ha aplicado a tu prompt.",
    });
    
    // Re-analyze after applying suggestion
    setTimeout(() => analyzePrompt(), 500);
  };

  const applyAllSuggestions = () => {
    if (optimizedPrompt) {
      setInputPrompt(optimizedPrompt);
      toast({
        title: "Todas las Sugerencias Aplicadas",
        description: "Se han aplicado todas las mejoras sugeridas.",
      });
      
      // Re-analyze after applying all suggestions
      setTimeout(() => analyzePrompt(), 500);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para área de transferência.",
    });
  };

  const clearAll = () => {
    setInputPrompt('');
    setAnalysis(null);
    setOptimizedPrompt('');
    setOptimizationSuggestions([]);
  };

  const examplePrompts = [
    {
      title: "Ejemplo: Escrita Criativa",
      prompt: "Escreva uma história sobre um robô que descobre emoções."
    },
    {
      title: "Ejemplo: Análise de Dados",
      prompt: "Analise estes dados de vendas e me dê insights."
    },
    {
      title: "Ejemplo: Código Python",
      prompt: "Crie uma função Python para ordenar uma lista."
    },
    {
      title: "Ejemplo: Bem Estruturado",
      prompt: "## Context\nYou are a professional business consultant with 10+ years of experience.\n\n## Task\nAnalyze the provided quarterly sales data and create a comprehensive report.\n\n## Format\n- Executive summary (2-3 sentences)\n- Key findings (3-5 bullet points)\n- Recommendations (numbered list)\n- Charts or visual elements where helpful\n\n## Constraints\n- Keep response under 500 words\n- Focus on actionable insights\n- Avoid technical jargon"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-violet-400" />
            Otimizador de Prompts
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Analise e otimize seus prompts para obter melhores resultados com IA. 
            Receba feedback detalhado e sugerencias de melhoria personalizadas.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Seu Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Cole ou digite seu prompt aqui para análise..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  className="glass border-white/20 text-white placeholder-white/50 min-h-[200px] resize-none"
                />
                
                <div className="flex gap-3">
                  <Button 
                    onClick={analyzePrompt}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <BarChart3 className="w-4 h-4 mr-2" />
                    )}
                    {isAnalyzing ? 'Analisando...' : 'Analisar Prompt'}
                  </Button>
                  
                  <Button variant="outline" onClick={clearAll}>
                    Limpar
                  </Button>
                </div>

                {/* Character count */}
                <div className="flex justify-between text-sm text-white/60">
                  <span>Caracteres: {inputPrompt.length}</span>
                  <span>Palavras: {inputPrompt.split(/\s+/).filter(word => word.length > 0).length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Optimized Prompt */}
            {optimizedPrompt && (
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-400" />
                      Prompt Otimizado
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(optimizedPrompt)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="glass-subtle p-4 rounded-lg">
                    <pre className="text-white/90 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                      {optimizedPrompt}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Analysis and Suggestions Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Analysis Card */}
            {analysis ? (
              <PromptAnalysisCard analysis={analysis} />
            ) : (
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Análise do Prompt</h3>
                  <p className="text-white/60 text-sm">
                    Digite um prompt e clique em "Analisar" para receber feedback detalhado
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Optimization Suggestions */}
            {optimizationSuggestions.length > 0 && (
              <OptimizationSuggestions
                suggestions={optimizationSuggestions}
                onApplySuggestion={applySuggestion}
                onApplyAll={applyAllSuggestions}
              />
            )}

            {/* Examples */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  Exemplos para Testar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {examplePrompts.map((example, index) => (
                  <div key={index} className="glass-subtle p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {example.title}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setInputPrompt(example.prompt)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Usar
                      </Button>
                    </div>
                    <p className="text-white/70 text-sm line-clamp-2">{example.prompt}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <Card className="glass mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Dicas para Prompts Eficazes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Seja Específico</h4>
                <p className="text-white/70 text-sm">Use detalhes concretos em vez de termos vagos como "alguns" ou "talvez"</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Estruture Bem</h4>
                <p className="text-white/70 text-sm">Organize em seções claras: contexto → tarefa → formato → exemplos</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Copy className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Use Exemplos</h4>
                <p className="text-white/70 text-sm">Inclua exemplos concretos do que você deseja como resultado</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Defina Restrições</h4>
                <p className="text-white/70 text-sm">Estabeleça limites claros sobre comprimento, tom e conteúdo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Optimizer;
