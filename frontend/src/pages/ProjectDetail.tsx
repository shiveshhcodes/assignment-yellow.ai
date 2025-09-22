import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  Upload,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/auth';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CreatePromptModal } from '@/components/modals/CreatePromptModal';
interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  projectId: string;
}
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePromptModalOpen, setIsCreatePromptModalOpen] = useState(false);
  const fetchProject = async () => {
    if (!id) return;
    try {
      const response = await apiRequest(`/api/projects/${id}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      const data = await response.json();
      setProject(data.project || data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch project details',
        variant: 'destructive',
      });
      navigate('/dashboard');
    }
  };
  const fetchPrompts = async () => {
    if (!id) return;
    try {
      const response = await apiRequest(`/api/projects/${id}/prompts`);
      if (!response.ok) throw new Error('Failed to fetch prompts');
      const data = await response.json();
      setPrompts(data.prompts || data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch prompts',
        variant: 'destructive',
      });
    }
  };
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProject(), fetchPrompts()]);
      setIsLoading(false);
    };
    loadData();
  }, [id]);
  const handleCreatePrompt = async (promptData: { title: string; content: string }) => {
    if (!id) return;
    try {
      const response = await apiRequest(`/api/projects/${id}/prompts`, {
        method: 'POST',
        body: JSON.stringify(promptData),
      });
      if (!response.ok) throw new Error('Failed to create prompt');
      const data = await response.json();
      const newPrompt = data.prompt || data;
      setPrompts([newPrompt, ...prompts]);
      setIsCreatePromptModalOpen(false);
      toast({
        title: 'Prompt created!',
        description: `"${newPrompt.title}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create prompt',
        variant: 'destructive',
      });
    }
  };
  const handleDeletePrompt = async (promptId: string) => {
    try {
      const response = await apiRequest(`/api/prompts/${promptId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete prompt');
      setPrompts(prompts.filter(p => p.id !== promptId));
      toast({
        title: 'Prompt deleted',
        description: 'The prompt has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete prompt',
        variant: 'destructive',
      });
    }
  };
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="hover:bg-accent/50 transition-smooth"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-primary rounded-lg shadow-sm">
                  <MessageSquare className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {project.name}
                </h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {project.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {formatDate(project.createdAt)}
                </div>
                <Badge variant="secondary">{prompts.length} prompts</Badge>
              </div>
            </div>
          </div>
          <Button
            onClick={() => navigate(`/projects/${id}/chat`)}
            className="bg-gradient-primary hover:bg-primary/90 shadow-md hover:shadow-glow transition-spring"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Open Chat
          </Button>
        </div>
        {}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsCreatePromptModalOpen(true)}
            variant="outline"
            className="hover:bg-accent/50 transition-smooth"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Prompt
          </Button>
          <Button
            variant="outline"
            className="hover:bg-accent/50 transition-smooth"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
        {}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Prompts</h2>
            <Badge variant="outline">{prompts.length} total</Badge>
          </div>
          {prompts.length === 0 ? (
            <Card className="border-dashed border-2 bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No prompts yet</h3>
                <p className="text-muted-foreground text-center mb-4 max-w-sm">
                  Create your first prompt to start building your chatbot's personality and responses.
                </p>
                <Button
                  onClick={() => setIsCreatePromptModalOpen(true)}
                  className="bg-gradient-primary hover:bg-primary/90 shadow-md hover:shadow-glow transition-spring"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Prompt
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {prompts.map((prompt) => (
                <Card
                  key={prompt.id}
                  className="bg-card/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-spring"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {prompt.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Created {formatDate(prompt.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-accent/50 transition-smooth"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-smooth"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {prompt.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <CreatePromptModal
        open={isCreatePromptModalOpen}
        onOpenChange={setIsCreatePromptModalOpen}
        onSubmit={handleCreatePrompt}
      />
    </DashboardLayout>
  );
}