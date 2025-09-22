import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  User, 
  LogOut, 
  MessageSquare,
  Settings,
  Plus
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
const navigationItems = [
  { title: 'Projects', url: '/dashboard', icon: FolderOpen },
  { title: 'Account', url: '/account', icon: User },
];
export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = authService.getUser();
  const isCollapsed = state === 'collapsed';
  const handleLogout = () => {
    authService.logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };
  const handleNewProject = () => {
    navigate('/dashboard?new=true');
  };
  return (
    <Sidebar className="border-r border-border/50 bg-card/30 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-sm">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-foreground">ChatBot Platform</h2>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
            {!isCollapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="w-full justify-start hover:bg-accent/50 transition-smooth"
                  >
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <Button
              onClick={handleNewProject}
              className="w-full justify-start bg-gradient-primary hover:bg-primary/90 shadow-sm hover:shadow-glow transition-spring"
              size={isCollapsed ? "icon" : "default"}
            >
              <Plus className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">New Project</span>}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="w-full justify-start hover:bg-destructive/10 hover:text-destructive transition-smooth"
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}