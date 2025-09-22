import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
const promptSchema = z.object({
  title: z.string().min(1, 'Prompt title is required').max(100, 'Title too long'),
  content: z.string().min(1, 'Prompt content is required').max(2000, 'Content too long'),
});
type PromptFormData = z.infer<typeof promptSchema>;
interface CreatePromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PromptFormData) => Promise<void>;
}
export function CreatePromptModal({ open, onOpenChange, onSubmit }: CreatePromptModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
  });
  const handleFormSubmit = async (data: PromptFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
    } finally {
      setIsLoading(false);
    }
  };
  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        reset();
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-sm border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Prompt</DialogTitle>
          <DialogDescription>
            Add a new prompt to guide your chatbot's responses and behavior.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Prompt Title</Label>
            <Input
              id="title"
              placeholder="Enter prompt title"
              className="transition-smooth focus:shadow-glow"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Prompt Content</Label>
            <Textarea
              id="content"
              placeholder="Write your prompt instructions here..."
              rows={6}
              className="transition-smooth focus:shadow-glow resize-none"
              {...register('content')}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This will guide how your chatbot responds to user messages.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary hover:bg-primary/90 shadow-md hover:shadow-glow transition-spring"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Prompt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}