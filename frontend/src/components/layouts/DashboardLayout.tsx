import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Menu } from 'lucide-react';
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/10 to-primary/5">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {}
          <header className="flex items-center h-14 px-4 border-b border-border/50 bg-card/30 backdrop-blur-sm lg:hidden">
            <SidebarTrigger className="mr-2">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <h1 className="font-semibold text-foreground">Dashboard</h1>
          </header>
          {}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}