import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CustomTemplate, PromptBlock } from '@/types/builder';
import { LibraryTemplate, TemplateDifficulty } from '@/types/templates';
import TemplatePreviewDialog from '@/components/templates/TemplatePreviewDialog';
import CustomTemplateCard from '@/components/templates/CustomTemplateCard';
import TemplateGridItem from '@/components/templates/TemplateGridItem';
import TemplateListItem from '@/components/templates/TemplateListItem';
import TemplateCard from '@/components/templates/TemplateCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Templates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | TemplateDifficulty>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'uses' | 'title'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [previewingTemplate, setPreviewingTemplate] = useState<LibraryTemplate | CustomTemplate | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCustomTemplates = async () => {
      if (!user) {
        setCustomTemplates([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('custom_templates')
          .select('id, name, prompt, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedTemplates: CustomTemplate[] = data.map(t => ({
            id: t.id,
            name: t.name,
            blocks: t.prompt as PromptBlock[], // Cast Json to PromptBlock[]
            createdAt: t.created_at,
          }));
          setCustomTemplates(formattedTemplates);
        }
      } catch (error) {
        console.error("Failed to load custom templates", error);
        toast({
          title: "Error",
          description: "Could not load your saved templates.",
          variant: "destructive",
        });
      }
    };

    fetchCustomTemplates();
  }, [user]);

  const templates: LibraryTemplate[] = [
    {
      id: '1',
      title: 'Creative Writing Assistant',
      description: 'Generate creative stories, poems, and narrative content with specific tone and style.',
      category: 'Creative Writing',
      aiModel: 'ChatGPT',
      difficulty: 'Beginner' as TemplateDifficulty,
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
      difficulty: 'Advanced' as TemplateDifficulty,
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
      difficulty: 'Intermediate' as TemplateDifficulty,
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
      difficulty: 'Beginner' as TemplateDifficulty,
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
      difficulty: 'Advanced' as TemplateDifficulty,
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
      difficulty: 'Intermediate' as TemplateDifficulty,
      rating: 4.5,
      uses: 3421,
      tags: ['midjourney', 'dalle', 'stable diffusion'],
      blocks: [
        { id: 'lib-6-1', type: 'task', content: 'Create a detailed image of {{subject}} in {{style}} style, {{lighting}} lighting, {{composition}}, {{color_palette}}, high quality, detailed, professional photography, {{additional_details}} --ar {{aspect_ratio}} --v 6', placeholder: 'Define the task...' }
      ]
    }
  ];

  const categories = ['all', 'Creative Writing', 'Coding', 'Analysis', 'Education', 'Business', 'Image Generation'];
  const difficulties: ('all' | TemplateDifficulty)[] = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredAndSortedTemplates = useMemo(() => {
    return templates
      .filter(template => {
        const matchesSearch =
          template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'uses':
            return b.uses - a.uses;
          case 'title':
            return a.title.localeCompare(b.title);
          case 'rating':
          default:
            return b.rating - a.rating;
        }
      });
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, templates]);

  const filteredCustomTemplates = customTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const useTemplate = (template: LibraryTemplate | CustomTemplate) => {
    navigate('/builder', { state: { template } });
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase.from('custom_templates').delete().eq('id', id);

      if (error) {
        throw error;
      }

      setCustomTemplates(prevTemplates => prevTemplates.filter(t => t.id !== id));
      
      toast({
        title: "Template Deleted",
        description: "The template has been removed.",
      });
    } catch (error) {
      console.error("Failed to delete template", error);
      const errorMessage = error instanceof Error ? error.message : "Could not delete template.";
      toast({
        title: "Error Deleting Template",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const previewTemplate = (template: LibraryTemplate | CustomTemplate) => {
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
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-grow min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass border-white/20 text-white placeholder-white/50"
              />
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 glass border border-white/20 rounded-lg text-white bg-transparent focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as 'all' | TemplateDifficulty)}
                className="px-4 py-2 glass border border-white/20 rounded-lg text-white bg-transparent focus:ring-purple-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="bg-slate-800">
                    {difficulty === 'all' ? 'All Difficulties' : difficulty}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'uses' | 'title')}
                className="px-4 py-2 glass border border-white/20 rounded-lg text-white bg-transparent focus:ring-purple-500"
              >
                <option value="rating" className="bg-slate-800">Sort by Rating</option>
                <option value="uses" className="bg-slate-800">Sort by Uses</option>
                <option value="title" className="bg-slate-800">Sort by Title</option>
              </select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="border-white/20 text-white"
                title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
              >
                {viewMode === 'grid' ? <LayoutList className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* My Templates Section */}
        {customTemplates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-6">My Saved Templates</h2>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredCustomTemplates.map((template) =>
                viewMode === 'grid' ? (
                  <CustomTemplateCard
                    key={template.id}
                    template={template}
                    onDelete={deleteTemplate}
                    onPreview={previewTemplate}
                    onUse={useTemplate}
                  />
                ) : (
                  <TemplateListItem
                    key={template.id}
                    template={template}
                    onDelete={deleteTemplate}
                    onPreview={previewTemplate}
                    onUse={useTemplate}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Library Templates Section */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold gradient-text">Template Library</h2>
        </div>

        {/* Templates Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredAndSortedTemplates.map((template) =>
            viewMode === 'grid' ? (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={previewTemplate}
                onUse={useTemplate}
              />
            ) : (
              <TemplateListItem
                key={template.id}
                template={template}
                onPreview={previewTemplate}
                onUse={useTemplate}
              />
            )
          )}
        </div>

        {filteredAndSortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No templates found matching your criteria.</p>
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
