import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/auth';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
export default function Account() {
  const { toast } = useToast();
  const user = authService.getUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
  });
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.email.split('@')[0], // Placeholder name
        email: user.email,
      });
    }
  }, [user]);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Profile updated',
        description: 'Your account information has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Unable to load account</h2>
          <p className="text-muted-foreground">Please try logging in again.</p>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-full shadow-sm">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="transition-smooth focus:shadow-glow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="transition-smooth focus:shadow-glow"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-primary hover:bg-primary/90 shadow-md hover:shadow-glow transition-spring"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-full">
                <Shield className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Account Details</CardTitle>
                <CardDescription>
                  View your account information and security details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }).format(new Date())}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Actions in this section are irreversible. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="hover:bg-destructive/90 transition-smooth"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}