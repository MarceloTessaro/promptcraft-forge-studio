
import React from 'react';
import { CustomTemplate } from '@/types/builder';
import CustomTemplateCard from './CustomTemplateCard';

interface TemplateGridItemProps {
  template: CustomTemplate;
  onDelete: (id: string) => void;
  onPreview: (template: CustomTemplate) => void;
  onUse: (template: CustomTemplate) => void;
}

const TemplateGridItem: React.FC<TemplateGridItemProps> = ({ template, onDelete, onPreview, onUse }) => {
  return (
    <CustomTemplateCard
      template={template}
      onDelete={onDelete}
      onPreview={onPreview}
      onUse={onUse}
    />
  );
};

export default TemplateGridItem;
