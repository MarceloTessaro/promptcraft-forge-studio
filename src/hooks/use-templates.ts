
import { useState, useEffect } from 'react';
import { PromptBlock, CustomTemplate } from '@/types/builder';
import { v4 as uuidv4 } from 'uuid';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);

  useEffect(() => {
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem('promptTemplates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    }
  }, []);

  const saveTemplate = async (name: string, blocks: PromptBlock[]) => {
    const newTemplate: CustomTemplate = {
      id: uuidv4(),
      name,
      blocks: [...blocks],
      createdAt: new Date().toISOString(),
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('promptTemplates', JSON.stringify(updatedTemplates));

    return newTemplate;
  };

  const loadTemplate = (template: CustomTemplate) => {
    return template.blocks.map(block => ({
      ...block,
      id: uuidv4(), // Generate new IDs to avoid conflicts
    }));
  };

  const deleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    localStorage.setItem('promptTemplates', JSON.stringify(updatedTemplates));
  };

  return {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
  };
};
