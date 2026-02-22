import React from 'react';
import { Note } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { FileText, Plus } from 'lucide-react';
import { CONTEXTS, FONTS, COLORS } from '../constants';
import * as Icons from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onAddNote: () => void;
  contextId: string;
}

export const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  selectedNoteId, 
  onSelectNote, 
  onAddNote,
  contextId
}) => {
  const context = CONTEXTS.find(c => c.id === contextId);
  const IconComponent = context ? (Icons as any)[context.icon] : FileText;

  return (
    <div className="w-full md:w-80 h-full border-r border-warm-200 flex flex-col bg-warm-50/30">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl text-white shadow-sm", context?.color || 'bg-warm-400')}>
            <IconComponent size={18} />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-warm-800">{context?.label}</h2>
        </div>
        <button
          onClick={onAddNote}
          className="p-2 bg-warm-800 text-white rounded-full hover:bg-warm-900 transition-all shadow-md hover:scale-110"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-3">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <FileText size={48} className="mb-4 text-warm-300" />
            <p className="text-sm font-medium text-warm-500">No notes yet</p>
            <p className="text-xs text-warm-400">Click the + to start</p>
          </div>
        ) : (
          notes.map((note) => {
            const noteFont = FONTS.find(f => f.id === note.fontFamily)?.class || 'font-sans';
            const noteColor = COLORS.find(c => c.id === note.colorTheme)?.text || 'text-warm-700';
            
            return (
              <button
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={cn(
                  "p-4 rounded-2xl text-left transition-all duration-200 border",
                  selectedNoteId === note.id
                    ? "bg-white border-warm-300 shadow-sm scale-[1.02]"
                    : "bg-transparent border-transparent hover:bg-warm-100/50",
                  noteFont
                )}
              >
                <h3 className={cn(
                  "font-medium text-sm mb-1 truncate",
                  selectedNoteId === note.id ? "text-warm-900" : noteColor
                )}>
                  {note.title || 'Untitled Note'}
                </h3>
                <p className={cn(
                  "text-xs line-clamp-2 mb-2 opacity-60",
                  selectedNoteId === note.id ? "text-warm-400" : noteColor
                )}>
                  {note.content || 'No additional text'}
                </p>
                <span className="text-[10px] text-warm-400 font-medium">
                  {format(note.updatedAt, 'MMM d, h:mm a')}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
