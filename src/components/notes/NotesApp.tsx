import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { Navigate } from 'react-router-dom';
import { NoteSidebar } from './NoteSidebar';
import { NoteEditor } from './NoteEditor';
import { WelcomeView } from './WelcomeView';
import { Note } from '@/hooks/useNotes';

export function NotesApp() {
  const { user, loading } = useAuth();
  const { notes, loading: notesLoading, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleCreateNote = async () => {
    const note = await createNote('Untitled Note', '');
    if (note) {
      setSelectedNote(note);
      setSidebarOpen(false); // Close sidebar on mobile after creating note
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setSidebarOpen(false); // Close sidebar on mobile after selecting note
  };

  const handleUpdateNote = async (updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    if (selectedNote) {
      const updatedNote = await updateNote(selectedNote.id, updates);
      if (updatedNote) {
        setSelectedNote(updatedNote);
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <NoteSidebar
        notes={notes}
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        loading={notesLoading}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onUpdate={handleUpdateNote}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        ) : (
          <WelcomeView
            user={user}
            onCreateNote={handleCreateNote}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            notesCount={notes.length}
          />
        )}
      </div>
    </div>
  );
}