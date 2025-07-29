import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { Note } from '@/hooks/useNotes';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Trash2, 
  LogOut, 
  User,
  X,
  Menu,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteSidebarProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export function NoteSidebar({
  notes,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  loading,
  isOpen,
  onToggle,
}: NoteSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateContent = (content: string | null, maxLength: number = 60) => {
    if (!content) return 'No content';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-sidebar-bg text-sidebar-foreground flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">QuillQuiver</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden text-sidebar-foreground hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Button 
              onClick={onCreateNote}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-sidebar-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-4 text-center">
              {searchQuery ? (
                <div>
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notes found</p>
                  <p className="text-xs text-muted-foreground">Try a different search term</p>
                </div>
              ) : (
                <div>
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notes yet</p>
                  <p className="text-xs text-muted-foreground">Create your first note to get started</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "group relative p-3 rounded-lg cursor-pointer transition-colors mb-2",
                    selectedNote?.id === note.id
                      ? "bg-primary/20 border border-primary/30"
                      : "hover:bg-white/5 border border-transparent"
                  )}
                  onClick={() => onSelectNote(note)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-sidebar-foreground truncate">
                        {note.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {truncateContent(note.content)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(note.updated_at)}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User section */}
        <div className="p-4 border-t border-border/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-muted-foreground hover:text-sidebar-foreground hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}