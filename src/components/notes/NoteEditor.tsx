import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Note } from '@/hooks/useNotes';
import { Menu, Save, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
  onToggleSidebar: () => void;
}

export function NoteEditor({ note, onUpdate, onToggleSidebar }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content || '');
    setHasUnsavedChanges(false);
  }, [note]);

  useEffect(() => {
    const titleChanged = title !== note.title;
    const contentChanged = content !== (note.content || '');
    setHasUnsavedChanges(titleChanged || contentChanged);
  }, [title, content, note]);

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {
      await onUpdate({ title, content });
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, hasUnsavedChanges]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Last modified: {formatDate(note.updated_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-muted-foreground">
              {isSaving ? 'Saving...' : 'Unsaved changes'}
            </span>
          )}
          
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={cn(
              "flex items-center gap-2",
              hasUnsavedChanges ? "bg-primary text-primary-foreground" : ""
            )}
            variant={hasUnsavedChanges ? "default" : "outline"}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="text-2xl font-bold border-none bg-transparent px-0 py-2 focus:ring-0 focus:border-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note..."
              className="min-h-[500px] border-none bg-transparent px-0 py-2 resize-none focus:ring-0 focus:border-none text-base leading-relaxed placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Word count footer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex justify-between items-center text-sm text-muted-foreground max-w-4xl mx-auto w-full">
          <span>
            {content.split(/\s+/).filter(word => word.length > 0).length} words, {content.length} characters
          </span>
          <span>
            Created {formatDate(note.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}