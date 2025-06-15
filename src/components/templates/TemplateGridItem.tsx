
import React from 'react';
import { LibraryTemplate } from '@/types/templates';
import { CustomTemplate } from '@/types/builder';
import TemplateCard from '@/components/templates/TemplateCard';

interface TemplateGridItemProps {
  template: LibraryTemplate | CustomTemplate;
  onPreview: (template: LibraryTemplate | CustomTemplate) => void;
  onUse: (template: LibraryTemplate | CustomTemplate) => void;
}

const TemplateGridItem: React.FC<TemplateGridItemProps> = ({ template, onPreview, onUse }) => {
  const isCustom = 'name' in template;
  
  if (isCustom) {
    // This assumes you have a CustomTemplateCard to handle custom templates.
    // If not, you might need to adapt TemplateCard or create a new component.
    return null; // Or a specific component for custom templates in grid view
  }

  return (
    <TemplateCard
      template={template}
      onPreview={onPreview}
      onUse={onUse}
    />
  );
};

export default TemplateGridItem;
