
-- Create shared templates table
CREATE TABLE public.shared_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  blocks JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create template versions table for version control
CREATE TABLE public.template_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.shared_templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  blocks JSONB NOT NULL,
  change_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(template_id, version_number)
);

-- Create template likes table
CREATE TABLE public.template_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id UUID REFERENCES public.shared_templates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, template_id)
);

-- Create template downloads table for analytics
CREATE TABLE public.template_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  template_id UUID REFERENCES public.shared_templates(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.shared_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_downloads ENABLE ROW LEVEL SECURITY;

-- Policies for shared_templates
CREATE POLICY "Public templates are viewable by everyone" 
  ON public.shared_templates 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own templates" 
  ON public.shared_templates 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
  ON public.shared_templates 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" 
  ON public.shared_templates 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policies for template_versions
CREATE POLICY "Template versions are viewable by template viewers" 
  ON public.template_versions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.shared_templates 
      WHERE id = template_versions.template_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create versions for their templates" 
  ON public.template_versions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shared_templates 
      WHERE id = template_versions.template_id 
      AND user_id = auth.uid()
    )
  );

-- Policies for template_likes
CREATE POLICY "Template likes are viewable by everyone" 
  ON public.template_likes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can like templates" 
  ON public.template_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes" 
  ON public.template_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policies for template_downloads
CREATE POLICY "Users can view their own downloads" 
  ON public.template_downloads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can record downloads" 
  ON public.template_downloads 
  FOR INSERT 
  WITH CHECK (true);

-- Create trigger to update likes_count automatically
CREATE OR REPLACE FUNCTION update_template_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.shared_templates 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.template_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.shared_templates 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.template_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER template_likes_count_trigger
  AFTER INSERT OR DELETE ON public.template_likes
  FOR EACH ROW EXECUTE FUNCTION update_template_likes_count();

-- Create trigger to update downloads_count automatically
CREATE OR REPLACE FUNCTION update_template_downloads_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.shared_templates 
  SET downloads_count = downloads_count + 1 
  WHERE id = NEW.template_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER template_downloads_count_trigger
  AFTER INSERT ON public.template_downloads
  FOR EACH ROW EXECUTE FUNCTION update_template_downloads_count();

-- Create indexes for better performance
CREATE INDEX idx_shared_templates_public ON public.shared_templates(is_public) WHERE is_public = true;
CREATE INDEX idx_shared_templates_user ON public.shared_templates(user_id);
CREATE INDEX idx_shared_templates_tags ON public.shared_templates USING gin(tags);
CREATE INDEX idx_template_versions_template ON public.template_versions(template_id);
CREATE INDEX idx_template_likes_template ON public.template_likes(template_id);
CREATE INDEX idx_template_likes_user ON public.template_likes(user_id);
