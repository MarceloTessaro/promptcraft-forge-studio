
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Share2, Copy, Globe, Lock } from 'lucide-react';
import { useTemplateSharing } from '@/hooks/useTemplateSharing';
import { CustomTemplate } from '@/types/builder';
import { toast } from '@/hooks/use-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template: CustomTemplate | null;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onOpenChange, template }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const { shareTemplate, isSharing } = useTemplateSharing();

  const handleShare = async () => {
    if (!template) return;

    try {
      const url = await shareTemplate(template, isPublic);
      setShareUrl(url);
      
      toast({
        title: "Template Shared",
        description: "Share URL has been copied to your clipboard",
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied",
        description: "Share URL copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Template
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Share your template with others or make it public for everyone to discover.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Make Public</Label>
              <p className="text-xs text-white/60">
                Allow anyone to discover and use this template
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
                id="public-switch"
              />
              {isPublic ? (
                <Globe className="w-4 h-4 text-green-400" />
              ) : (
                <Lock className="w-4 h-4 text-orange-400" />
              )}
            </div>
          </div>

          {shareUrl && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Share URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="glass border-white/20 text-white"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={isSharing || !template}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSharing ? 'Sharing...' : 'Share Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
