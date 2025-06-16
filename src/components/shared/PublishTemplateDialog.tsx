
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface PublishTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPublish: (params: {
    title: string;
    description?: string;
    tags: string[];
    isPublic: boolean;
  }) => void;
  isPublishing?: boolean;
}

const PublishTemplateDialog: React.FC<PublishTemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  onPublish,
  isPublishing = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePublish = () => {
    if (!title.trim()) return;

    onPublish({
      title: title.trim(),
      description: description.trim() || undefined,
      tags,
      isPublic,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTags([]);
    setTagInput('');
    setIsPublic(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Publicar Plantilla</DialogTitle>
          <DialogDescription className="text-white/70">
            Comparte tu plantilla con la comunidad de PromptCraft
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-white/80">
              Título *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Mi Plantilla Increíble"
              maxLength={100}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-white/80">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]"
              placeholder="Describe qué hace tu plantilla y cómo usarla..."
              maxLength={500}
            />
            <p className="text-xs text-white/50">
              {description.length}/500 caracteres
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags" className="text-white/80">
              Etiquetas ({tags.length}/10)
            </Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Escribe una etiqueta y presiona Enter"
              disabled={tags.length >= 10}
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-purple-900/50 text-purple-300 border-purple-700/50 pr-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-purple-800/50 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="grid gap-1">
              <Label className="text-white/80">Visibilidad</Label>
              <p className="text-sm text-white/60">
                {isPublic ? 'Visible para todos' : 'Solo para ti'}
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePublish}
            disabled={!title.trim() || isPublishing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishTemplateDialog;
