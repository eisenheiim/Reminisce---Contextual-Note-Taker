import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { Note, ContextType } from './types';
import { CONTEXTS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Search, StickyNote, Menu } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeContext, setActiveContext] = useState<ContextType>('meeting');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(n => n.context === activeContext)
      .filter(n => 
        (n.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        (n.content?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, activeContext, searchQuery]);

  const selectedNote = useMemo(() => 
    notes.find(n => n.id === selectedNoteId) || null
  , [notes, selectedNoteId]);

  const activeContextConfig = useMemo(() => 
    CONTEXTS.find(c => c.id === activeContext)!
  , [activeContext]);

  const handleAddNote = async () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      context: activeContext,
      fontFamily: 'sans',
      colorTheme: 'default',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleSaveNote = async (updatedNote: Note) => {
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      });
      setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        setNotes(notes.filter(n => n.id !== id));
        setSelectedNoteId(null);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-warm-50 overflow-hidden relative">
      <Sidebar 
        activeContext={activeContext} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onContextChange={(ctx) => {
          setActiveContext(ctx);
          setSelectedNoteId(null);
        }} 
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header / Search */}
        <header className="h-20 border-b border-warm-200 flex items-center px-4 md:px-8 justify-between bg-white/50 backdrop-blur-sm gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-warm-600 hover:bg-warm-200 rounded-xl md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="relative flex-1 max-w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-300" size={18} />
              <input
                type="text"
                placeholder="Search your memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-warm-100/50 border border-warm-200 rounded-2xl text-sm focus:ring-2 focus:ring-warm-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-warm-600 uppercase tracking-widest">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </span>
                <span className="text-sm font-serif italic text-warm-400">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
             </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-800"></div>
            </div>
          ) : (
            <>
              <div className={cn(
                "flex-1 flex overflow-hidden",
                selectedNoteId ? "hidden md:flex" : "flex"
              )}>
                <NoteList 
                  notes={filteredNotes}
                  selectedNoteId={selectedNoteId}
                  onSelectNote={(note) => setSelectedNoteId(note.id)}
                  onAddNote={handleAddNote}
                  contextId={activeContext}
                />
              </div>

              <div className={cn(
                "flex-1 bg-warm-100/30 overflow-hidden",
                selectedNoteId ? "block" : "hidden md:block"
              )}>
                <AnimatePresence mode="wait">
                  {selectedNote ? (
                    <motion.div
                      key={selectedNote.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full p-4 md:p-8"
                    >
                      <NoteEditor 
                        note={selectedNote}
                        onSave={handleSaveNote}
                        onDelete={handleDeleteNote}
                        onClose={() => setSelectedNoteId(null)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center p-12"
                    >
                      <div className="w-24 h-24 bg-warm-200 rounded-full flex items-center justify-center mb-6 text-warm-400">
                        <StickyNote size={48} />
                      </div>
                      <h3 className="font-serif text-3xl font-semibold text-warm-800 mb-2">Select a note to view</h3>
                      <p className="text-warm-500 max-w-xs mx-auto">
                        Choose a note from the list or create a new one to capture your thoughts for <span className="font-bold text-warm-700">{activeContextConfig.label}</span>.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
