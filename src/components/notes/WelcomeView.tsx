import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { Plus, FileText, Menu, Sparkles } from 'lucide-react';

interface WelcomeViewProps {
  user: User;
  onCreateNote: () => void;
  onToggleSidebar: () => void;
  notesCount: number;
}

export function WelcomeView({ user, onCreateNote, onToggleSidebar, notesCount }: WelcomeViewProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getDisplayName = () => {
    // Extract name from email (part before @)
    return user.email?.split('@')[0] || 'there';
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card lg:hidden">
        <h1 className="text-xl font-bold">QuillQuiver</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Welcome content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Greeting */}
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-variant rounded-full flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground">
              {getGreeting()}, {getDisplayName()}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome to your personal note-taking space
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{notesCount}</p>
              <p className="text-sm text-muted-foreground">
                {notesCount === 1 ? 'Note' : 'Notes'} Created
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">∞</p>
              <p className="text-sm text-muted-foreground">Possibilities</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-warning" />
              </div>
              <p className="text-2xl font-bold text-foreground">Ready</p>
              <p className="text-sm text-muted-foreground">To Create</p>
            </div>
          </div>

          {/* Call to action */}
          <div className="space-y-4">
            {notesCount === 0 ? (
              <>
                <p className="text-lg text-muted-foreground">
                  Ready to capture your first thought?
                </p>
                <Button 
                  onClick={onCreateNote}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-variant text-primary-foreground hover:from-primary/90 hover:to-primary-variant/90 px-8 py-3"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Note
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg text-muted-foreground">
                  Ready to add another brilliant idea?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={onCreateNote}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary-variant text-primary-foreground hover:from-primary/90 hover:to-primary-variant/90"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Note
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={onToggleSidebar}
                    className="lg:hidden"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Browse Notes
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Tips */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">💡 Pro Tips</h3>
            <div className="text-sm text-muted-foreground space-y-2 text-left">
              <p>• Notes auto-save as you type - never lose your thoughts</p>
              <p>• Use the search bar to quickly find any note</p>
              <p>• Your notes are private and secure</p>
              <p>• Access your notes from any device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}