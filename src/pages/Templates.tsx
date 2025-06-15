import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star,
  Copy,
  Eye,
  LayoutList,
  Layout,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Template as CustomTemplate, PromptBlock } from '@/types/builder';
import TemplatePreviewDialog from '@/components/templates/TemplatePreviewDialog';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  aiModel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  uses: number;
  blocks: PromptBlock[];
  tags: string[];
}

const Templates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [previewingTemplate, setPreviewingTemplate] = useState<Template | CustomTemplate | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('promptcraft-templates');
      if (savedTemplates) {
        setCustomTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error("Failed to load custom templates", error);
      toast({
        title: "Error",
        description: "Could not load your saved templates.",
        variant: "destructive",
      });
    }
  }, []);

  const templates: Template[] = [
    {
      id: '1',
      title: 'Creative Writing Assistant',
      description: 'Generate creative stories, poems, and narrative content with specific tone and style.',
      category: 'Creative Writing',
      aiModel: 'ChatGPT',
      difficulty: 'Beginner',
      rating: 4.8,
      uses: 2340,
      tags: ['storytelling', 'creative', 'narrative'],
      blocks: [
        { id: 'lib-1-1', type: 'context', content: 'You are a creative writing assistant.', placeholder: 'Provide context...' },
        { id: 'lib-1-2', type: 'task', content: 'Help me write a {{type}} story about {{topic}} in a {{tone}} tone. The story should be approximately {{length}} words and include {{elements}}.', placeholder: 'Define the task...' }
      ]
    },
    {
      id: '2',
      title: 'Code Review & Optimization',
      description: 'Analyze code for bugs, performance issues, and suggest improvements.',
      category: 'Coding',
      aiModel: 'Claude',
      difficulty: 'Advanced',
      rating: 4.9,
      uses: 1890,
      tags: ['code review', 'optimization', 'debugging'],
      blocks: [
        { id: 'lib-2-1', type: 'context', content: 'As an expert code reviewer,', placeholder: 'Provide context...' },
        { id: 'lib-2-2', type: 'task', content: 'analyze the following {{language}} code for:\n1) Bugs and errors\n2) Performance optimizations\n3) Best practices\n4) Security vulnerabilities.', placeholder: 'Define the task...' },
        { id: 'lib-2-3', type: 'format', content: 'Provide specific suggestions with examples.', placeholder: 'Specify format...' }
      ]
    },
    {
      id: '3',
      title: 'Data Analysis Interpreter',
      description: 'Transform raw data into actionable insights and visualizations.',
      category: 'Analysis',
      aiModel: 'ChatGPT',
      difficulty: 'Intermediate',
      rating: 4.7,
      uses: 1567,
      tags: ['data analysis', 'insights', 'visualization'],
      blocks: [
        { id: 'lib-3-1', type: 'context', content: 'Act as a data analyst.', placeholder: 'Provide context...' },
        { id: 'lib-3-2', type: 'task', content: 'Analyze the following dataset and provide:\n1) Key trends and patterns\n2) Statistical insights\n3) Actionable recommendations\n4) Suggested visualizations.', placeholder: 'Define the task...' },
        { id: 'lib-3-3', type: 'format', content: 'Format your response clearly with headers and bullet points.', placeholder: 'Specify format...' }
      ]
    },
    {
      id: '4',
      title: 'Educational Content Creator',
      description: 'Create engaging educational materials and lesson plans.',
      category: 'Education',
      aiModel: 'Claude',
      difficulty: 'Beginner',
      rating: 4.6,
      uses: 987,
      tags: ['education', 'teaching', 'learning'],
      blocks: [
        { id: 'lib-4-1', type: 'context', content: 'You are an experienced educator.', placeholder: 'Provide context...' },
        { id: 'lib-4-2', type: 'task', content: 'Create a comprehensive lesson plan for {{subject}} targeting {{grade_level}} students. Include: learning objectives, activities, assessments, and resources.', placeholder: 'Define the task...' }
      ]
    },
    {
      id: '5',
      title: 'Business Strategy Advisor',
      description: 'Develop strategic business recommendations and market analysis.',
      category: 'Business',
      aiModel: 'ChatGPT',
      difficulty: 'Advanced',
      rating: 4.8,
      uses: 2103,
      tags: ['strategy', 'business', 'analysis'],
      blocks: [
        { id: 'lib-5-1', type: 'context', content: 'As a business strategy consultant,', placeholder: 'Provide context...' },
        { id: 'lib-5-2', type: 'task', content: 'analyze {{company_or_situation}} and provide:\n1) SWOT analysis\n2) Market opportunities\n3) Strategic recommendations\n4) Implementation roadmap with timelines and KPIs.', placeholder: 'Define the task...' }
      ]
    },
    {
      id: '6',
      title: 'Image Generation Prompt',
      description: 'Create detailed prompts for AI image generation tools.',
      category: 'Image Generation',
      aiModel: 'Midjourney',
      difficulty: 'Intermediate',
      rating: 4.5,
      uses: 3421,
      tags: ['midjourney', 'dalle', 'stable diffusion'],
      blocks: [
        { id: 'lib-6-1', type: 'task', content: 'Create a detailed image of {{subject}} in {{style}} style, {{lighting}} lighting, {{composition}}, {{color_palette}}, high quality, detailed, professional photography, {{additional_details}} --ar {{aspect_ratio}} --v 6', placeholder: 'Define the task...' }
      ]
    }
  ];

  const categories = ['all', 'Creative Writing', 'Coding', 'Analysis', 'Education', 'Business', 'Image Generation'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const useTemplate = (template: Template | CustomTemplate) => {
    navigate('/builder', { state: { blocks: template.blocks } });
  };

  const deleteTemplate = (id: string) => {
    const updatedTemplates = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updatedTemplates);
    localStorage.setItem('promptcraft-templates', JSON.stringify(updatedTemplates));
    toast({
      title: "Template Deleted",
      description: "The template has been removed.",
    });
  };

  const previewTemplate = (template: Template | CustomTemplate) => {
    setPreviewingTemplate(template);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Template Library</h1>
          <p className="text-white/80">Discover proven prompts for every use case</p>
        </div>

        {/* Search and Filters */}
        <Card className="glass p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass border-white/20 text-white placeholder-white/50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 glass border border-white/20 rounded-lg text-white bg-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="border-white/20 text-white"
              >
                {viewMode === 'grid' ? <LayoutList className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* My Templates Section */}
        {customTemplates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-6">My Saved Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customTemplates.map((template) => (
                <Card key={template.id} className="glass p-6 hover:glow transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                    <p className="text-sm text-white/60">
                      Created on {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteTemplate(template.id)}
                      className="bg-red-900/50 hover:bg-red-900/80 border-red-500/30"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => previewTemplate(template)}
                      className="border-white/20 text-white hover:bg-white/10"
                      title="Preview Template"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => useTemplate(template)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Use
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Library Templates Section */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold gradient-text">Template Library</h2>
        </div>

        {/* Templates Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="glass p-6 hover:glow transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{template.description}</p>
                </div>
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm ml-1">{template.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                <Badge variant="outline" className="text-xs border-white/20 text-white/80">{template.aiModel}</Badge>
                <Badge 
                  className={`text-xs ${
                    template.difficulty === 'Beginner' ? 'bg-green-600' :
                    template.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                >
                  {template.difficulty}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag, index) => (
                  <span key={index} className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">{template.uses.toLocaleString()} uses</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => previewTemplate(template)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => useTemplate(template)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No templates found matching your search criteria.</p>
          </div>
        )}
      </div>
      <TemplatePreviewDialog
        template={previewingTemplate}
        isOpen={!!previewingTemplate}
        onOpenChange={(isOpen) => !isOpen && setPreviewingTemplate(null)}
        onUseTemplate={useTemplate}
      />
    </div>
  );
};

export default Templates;
