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
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
});
type ProjectFormData = z.infer<typeof projectSchema>;
interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}
export function CreateProjectModal({ open, onOpenChange, onSubmit }: CreateProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });
  const handleFormSubmit = async (data: ProjectFormData) => {
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
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to organize your chatbot prompts and conversations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              className="transition-smooth focus:shadow-glow"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              rows={3}
              className="transition-smooth focus:shadow-glow resize-none"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
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
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}