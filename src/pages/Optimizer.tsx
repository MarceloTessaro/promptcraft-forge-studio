
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
  FileText
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PromptAnalysis } from '@/types/optimizer';
import { PromptAnalyzer } from '@/utils/promptAnalyzer';
import PromptAnalysisCard from '@/components/optimizer/PromptAnalysisCard';

const Optimizer = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');

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
      generateOptimizedPrompt(promptAnalysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const generateOptimizedPrompt = (analysis: PromptAnalysis) => {
    let optimized = inputPrompt;
    
    // Apply basic optimizations based on analysis
    if (analysis.metrics.structure < 70) {
      optimized = `## Context\n${optimized}\n\n## Task\n[Define your specific task here]\n\n## Format\n[Specify desired output format]`;
    }
    
    if (analysis.metrics.specificity < 70) {
      optimized += '\n\nPlease be specific in your response and provide concrete examples.';
    }
    
    if (analysis.metrics.clarity < 70) {
      optimized = optimized.replace(/maybe|perhaps|might|could/gi, (match) => {
        const replacements: Record<string, string> = {
          'maybe': 'specifically',
          'perhaps': 'exactly',
          'might': 'should',
          'could': 'will'
        };
        return replacements[match.toLowerCase()] || match;
      });
    }
    
    setOptimizedPrompt(optimized);
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
  };

  const examplePrompts = [
    {
      title: "Exemplo: Escrita Criativa",
      prompt: "Escreva uma história sobre um robô que descobre emoções."
    },
    {
      title: "Exemplo: Análise de Dados",
      prompt: "Analise estes dados de vendas e me dê insights."
    },
    {
      title: "Exemplo: Código Python",
      prompt: "Crie uma função Python para ordenar uma lista."
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
            Receba feedback detalhado e sugestões de melhoria.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
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
                <div className="text-sm text-white/60">
                  Caracteres: {inputPrompt.length} | Palavras: {inputPrompt.split(/\s+/).filter(word => word.length > 0).length}
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

          {/* Analysis Section */}
          <div className="space-y-6">
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

            {/* Examples */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white text-lg">Exemplos para Testar</CardTitle>
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
                    <p className="text-white/70 text-sm">{example.prompt}</p>
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
              <Sparkles className="w-5 h-5 text-amber-400" />
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
                <p className="text-white/70 text-sm">Use detalhes concretos em vez de termos vagos</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Estruture Bem</h4>
                <p className="text-white/70 text-sm">Organize em seções claras: contexto, tarefa, formato</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Copy className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Use Exemplos</h4>
                <p className="text-white/70 text-sm">Inclua exemplos do que você deseja como resultado</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Defina Restrições</h4>
                <p className="text-white/70 text-sm">Estabeleça limites claros e requisitos específicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Optimizer;
