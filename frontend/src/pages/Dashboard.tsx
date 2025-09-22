import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, FolderOpen, MessageSquare, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/auth';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  promptCount?: number;
}
export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsCreateModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);
  const fetchProjects = async () => {
    try {
      const response = await apiRequest('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects || data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  const handleCreateProject = async (projectData: { name: string; description: string }) => {
    try {
      const response = await apiRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error('Failed to create project');
      const data = await response.json();
      const newProject = data.project || data;
      setProjects([newProject, ...projects]);
      setIsCreateModalOpen(false);
      toast({
        title: 'Project created!',
        description: `"${newProject.name}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    }
  };
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your projects...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
            <p className="text-muted-foreground">
              Manage your chatbot projects and prompts
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-primary hover:bg-primary/90 shadow-md hover:shadow-glow transition-spring"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
        {}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 transition-smooth focus:shadow-glow"
          />
        </div>
        {}
        {filteredProjects.length === 0 ? (
          <Card className="border-dashed border-2 bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-muted-foreground text-center mb-4 max-w-sm">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Create your first project to start building chatbots'
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-primary hover:bg-primary/90 shadow-md hover:shadow-glow transition-spring"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer hover:shadow-lg transition-spring bg-card/80 backdrop-blur-sm border-0 shadow-md hover:shadow-glow"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-primary rounded-lg shadow-sm group-hover:shadow-glow transition-spring">
                        <MessageSquare className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate group-hover:text-primary transition-smooth">
                          {project.name}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 text-sm">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                    {project.promptCount !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        {project.promptCount} prompts
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateProject}
      />
    </DashboardLayout>
  );
}