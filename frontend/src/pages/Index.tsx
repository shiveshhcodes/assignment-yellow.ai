import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles, Shield, Zap } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: MessageSquare,
      title: "Smart Conversations",
      description: "Create intelligent chatbots with advanced AI capabilities and natural language processing."
    },
    {
      icon: Sparkles,
      title: "Custom Prompts",
      description: "Design unique personalities and response patterns with powerful prompt engineering tools."
    },
    {
      icon: Shield,
      title: "Project Management",
      description: "Organize your chatbots into projects with secure authentication and user management."
    },
    {
      icon: Zap,
      title: "Real-time Chat",
      description: "Experience smooth, real-time conversations with streaming responses and modern UI."
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-primary rounded-3xl shadow-glow">
              <MessageSquare className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
            Build Powerful{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Chatbots
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create, manage, and deploy intelligent chatbots with our modern platform. 
            Design custom personalities, manage conversations, and deliver exceptional user experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              className="bg-gradient-primary hover:bg-primary/90 shadow-lg hover:shadow-glow transition-spring text-lg px-8 py-6"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              size="lg"
              className="hover:bg-accent/50 transition-smooth text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
      {}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything you need to build amazing chatbots
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to create, customize, and deploy intelligent AI chatbots.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-spring group"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-3 bg-gradient-primary rounded-xl shadow-sm group-hover:shadow-glow transition-spring mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <h3 className="text-3xl font-bold mb-4">
              Ready to start building?
            </h3>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of developers and businesses creating intelligent chatbots with our platform.
            </p>
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90 shadow-lg hover:shadow-xl transition-spring text-lg px-8 py-6"
            >
              Create Your First Chatbot
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Index;
