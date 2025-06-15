
-- Create a table for user-created templates
CREATE TABLE public.custom_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.custom_templates IS 'Stores custom prompt templates created by users.';
COMMENT ON COLUMN public.custom_templates.user_id IS 'The user who owns this template.';
COMMENT ON COLUMN public.custom_templates.prompt IS 'The JSON structure of the prompt blocks.';

-- Enable Row Level Security (RLS)
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to ensure users can only access their own templates
CREATE POLICY "Users can view their own templates"
  ON public.custom_templates
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
  ON public.custom_templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON public.custom_templates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON public.custom_templates
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to update the `updated_at` timestamp automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function before any update
CREATE TRIGGER update_custom_templates_updated_at
  BEFORE UPDATE ON public.custom_templates
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
