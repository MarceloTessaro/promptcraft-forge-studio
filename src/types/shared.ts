
import { PromptBlock } from './builder';

export interface SharedTemplate {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  blocks: PromptBlock[];
  tags: string[];
  is_public: boolean;
  likes_count: number;
  downloads_count: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
  is_liked?: boolean;
}

export interface TemplateVersion {
  id: string;
  template_id: string;
  version_number: number;
  blocks: PromptBlock[];
  change_description?: string;
  created_at: string;
}

export interface TemplateLike {
  id: string;
  user_id: string;
  template_id: string;
  created_at: string;
}

export interface TemplateDownload {
  id: string;
  user_id?: string;
  template_id: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
