import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/auth';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}
interface Project {
  id: string;
  name: string;
  description: string;
}
export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
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
    } finally {
      setIsProjectLoading(false);
    }
  };
  useEffect(() => {
    fetchProject();
  }, [id]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !id) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    try {
      const response = await apiRequest(`/api/projects/${id}/chat`, {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });
      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      const assistantMessage: Message = {
        id: data.messageId || (Date.now() + 1).toString(),
        content: cleanAIResponse(data.message || 'I apologize, but I encountered an error processing your request.'),
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from chatbot',
        variant: 'destructive',
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const formatTime = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };
  const cleanAIResponse = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/^\* /gm, '• ')
      .replace(/\*/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };
  if (isProjectLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading chat...</p>
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
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
        {}
        <div className="flex items-center gap-4 pb-4 border-b border-border/50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/projects/${id}`)}
            className="hover:bg-accent/50 transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-sm">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{project.name}</h1>
              <p className="text-sm text-muted-foreground">Chat Interface</p>
            </div>
          </div>
        </div>
        {}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bot className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
              <p className="text-muted-foreground">
                Send a message to begin chatting with your AI assistant.
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-3 max-w-[70%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-gradient-primary shadow-sm'
                      : 'bg-muted border border-border/50'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <Card
                  className={`p-3 shadow-sm border-0 ${
                    message.role === 'user'
                      ? 'bg-chat-user text-primary-foreground shadow-glow'
                      : 'bg-chat-bot'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </Card>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[70%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border/50 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <Card className="p-3 bg-chat-bot shadow-sm border-0">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {}
        <div className="border-t border-border/50 pt-4">
          <form onSubmit={sendMessage} className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 transition-smooth focus:shadow-glow"
              autoFocus
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-primary hover:bg-primary/90 shadow-md hover:shadow-glow transition-spring"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}