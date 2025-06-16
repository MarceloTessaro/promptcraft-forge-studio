
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Save,
  Share2,
  Download,
  Upload,
  Settings,
  MoreVertical,
  History,
  Globe,
} from 'lucide-react';
import { PromptBlock } from '@/types/builder';
import SaveTemplateDialog from './SaveTemplateDialog';
import PublishTemplateDialog from '@/components/shared/PublishTemplateDialog';
import { useSharedTemplates } from '@/hooks/useSharedTemplates';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface HeaderProps {
  blocks: PromptBlock[];
  onSaveTemplate: (name: string) => void;
  onLoadTemplate: () => void;
  onExport: () => void;
  onClear: () => void;
  hasUnsavedChanges?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  blocks,
  onSaveTemplate,
  onLoadTemplate,
  onExport,
  onClear,
  hasUnsavedChanges = false,
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { user } = useAuth();
  const { publishTemplate, isPublishing } = useSharedTemplates();

  const handlePublish = async (params: {
    title: string;
    description?: string;
    tags: string[];
    isPublic: boolean;
  }) => {
    try {
      await publishTemplate({
        ...params,
        blocks,
      });
      setShowPublishDialog(false);
      toast({
        title: "¡Plantilla Publicada!",
        description: "Tu plantilla está ahora disponible en la comunidad.",
      });
    } catch (error) {
      console.error('Error publishing template:', error);
    }
  };

  const canPublish = blocks.length > 0 && blocks.some(block => block.content.trim());

  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900/50 border-b border-zinc-800">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold gradient-text">Prompt Builder</h1>
        {hasUnsavedChanges && (
          <Badge variant="secondary" className="bg-orange-900/50 text-orange-300 border-orange-700/50">
            Cambios sin guardar
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => setShowSaveDialog(true)}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
          disabled={blocks.length === 0}
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar
        </Button>

        {user && (
          <Button
            onClick={() => setShowPublishDialog(true)}
            variant="default"
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!canPublish || isPublishing}
          >
            <Globe className="w-4 h-4 mr-2" />
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
            <DropdownMenuItem
              onClick={onLoadTemplate}
              className="text-white hover:bg-zinc-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Cargar Plantilla
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onExport}
              className="text-white hover:bg-zinc-700"
              disabled={blocks.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem
              onClick={onClear}
              className="text-white hover:bg-zinc-700"
              disabled={blocks.length === 0}
            >
              <Settings className="w-4 h-4 mr-2" />
              Limpiar Todo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SaveTemplateDialog
        isOpen={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={onSaveTemplate}
      />

      <PublishTemplateDialog
        isOpen={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />
    </div>
  );
};

export default Header;
