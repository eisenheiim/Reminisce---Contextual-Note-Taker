import React, { useState, useEffect } from 'react';
import { Note, ContextType, FontOption, ColorOption } from '../types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';
import { Save, Trash2, Eye, Edit3, List, ListOrdered, Type, Palette, Check } from 'lucide-react';
import { FONTS, COLORS } from '../constants';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [fontFamily, setFontFamily] = useState<FontOption>(note.fontFamily || 'sans');
  const [colorTheme, setColorTheme] = useState<ColorOption>(note.colorTheme || 'default');
  const [isPreview, setIsPreview] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setFontFamily(note.fontFamily || 'sans');
    setColorTheme(note.colorTheme || 'default');
  }, [note]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    onSave({
      ...note,
      title,
      content,
      fontFamily,
      colorTheme,
      updatedAt: Date.now(),
    });
    setTimeout(() => setIsSaving(false), 2000);
  };

  const handleBulletList = () => {
    const textarea = document.getElementById('note-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;
    const beforeCursor = text.substring(0, start);
    const lines = beforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];

    let nextInsert = '';
    if (currentLine.trim().startsWith('- ')) {
      nextInsert = '\n- ';
    } else if (currentLine.trim() === '') {
      nextInsert = '- ';
    } else {
      nextInsert = '\n- ';
    }

    const afterCursor = text.substring(start);
    setContent(beforeCursor + nextInsert + afterCursor);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + nextInsert.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleNumberedList = () => {
    const textarea = document.getElementById('note-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;
    const beforeCursor = text.substring(0, start);
    const lines = beforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];

    const match = currentLine.match(/^(\d+)\.\s/);
    let nextInsert = '';

    if (match) {
      const nextNumber = parseInt(match[1]) + 1;
      nextInsert = `\n${nextNumber}. `;
    } else if (currentLine.trim() === '') {
      nextInsert = '1. ';
    } else {
      nextInsert = '\n1. ';
    }

    const afterCursor = text.substring(start);
    setContent(beforeCursor + nextInsert + afterCursor);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + nextInsert.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('note-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const beforeText = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);

    const newContent = beforeText + before + selectedText + after + afterText;
    setContent(newContent);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const activeFont = FONTS.find(f => f.id === fontFamily) || FONTS[0];
  const activeColor = COLORS.find(c => c.id === colorTheme) || COLORS[0];

  return (
    <div className={cn(
      "flex flex-col h-full rounded-3xl shadow-xl border border-warm-200 bg-white overflow-hidden transition-colors duration-500"
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-warm-100 bg-warm-50/50 gap-2 flex-wrap relative z-20">
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={cn(
              "flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all",
              isPreview ? "bg-warm-400 text-white" : "bg-warm-200 text-warm-700 hover:bg-warm-300"
            )}
          >
            {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline">{isPreview ? 'Edit' : 'Preview'}</span>
          </button>

          {!isPreview && (
            <div className="flex items-center gap-0.5 md:gap-1 ml-1 md:ml-4 px-1 md:px-2 border-l border-warm-200">
              <button 
                onClick={handleBulletList}
                className="p-1.5 md:p-2 hover:bg-warm-200 rounded-lg text-warm-600" title="Bullet List"
              >
                <List size={18} />
              </button>
              <button 
                onClick={handleNumberedList}
                className="p-1.5 md:p-2 hover:bg-warm-200 rounded-lg text-warm-600" title="Numbered List"
              >
                <ListOrdered size={18} />
              </button>
              
              <div className="relative ml-2">
                <button 
                  onClick={() => { setShowFontMenu(!showFontMenu); setShowColorMenu(false); }}
                  className={cn("p-2 hover:bg-warm-200 rounded-lg text-warm-600", showFontMenu && "bg-warm-200")} title="Change Font"
                >
                  <Type size={18} />
                </button>
                {showFontMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-warm-200 p-2 animate-in fade-in slide-in-from-top-2">
                    {FONTS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => { setFontFamily(f.id); setShowFontMenu(false); }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-warm-50 transition-colors",
                          f.class,
                          fontFamily === f.id ? "text-warm-900 bg-warm-50" : "text-warm-500"
                        )}
                      >
                        <span className="text-sm">{f.label}</span>
                        {fontFamily === f.id && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => { setShowColorMenu(!showColorMenu); setShowFontMenu(false); }}
                  className={cn("p-2 hover:bg-warm-200 rounded-lg text-warm-600", showColorMenu && "bg-warm-200")} title="Change Color"
                >
                  <Palette size={18} />
                </button>
                {showColorMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-warm-200 p-2 animate-in fade-in slide-in-from-top-2">
                    {COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setColorTheme(c.id); setShowColorMenu(false); }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-warm-50 transition-colors",
                          colorTheme === c.id ? "bg-warm-50" : ""
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-4 h-4 rounded-full border border-warm-200", c.preview)} />
                          <span className="text-sm text-warm-700">{c.label}</span>
                        </div>
                        {colorTheme === c.id && <Check size={14} className="text-warm-900" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all",
              isSaving ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 text-white hover:bg-emerald-700"
            )}
          >
            {isSaving ? <Check size={16} /> : <Save size={16} />}
            <span className="hidden sm:inline">{isSaving ? 'Saved' : 'Save'}</span>
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 md:p-2 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className={cn("flex-1 flex flex-col p-8 overflow-y-auto", activeColor.text, activeFont.class)}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          className={cn(
            "font-serif text-4xl font-semibold placeholder:text-warm-200 border-none focus:ring-0 mb-6 w-full outline-none bg-transparent",
            activeColor.text
          )}
        />

        {isPreview ? (
          <div className={cn("markdown-body flex-1", activeColor.text)}>
            <Markdown remarkPlugins={[remarkGfm]}>{content || '*No content yet...*'}</Markdown>
          </div>
        ) : (
          <textarea
            id="note-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your notes here... (Markdown supported)"
            className={cn(
              "flex-1 w-full resize-none border-none focus:ring-0 text-lg placeholder:text-warm-200 outline-none leading-relaxed bg-transparent",
              activeColor.text
            )}
          />
        )}
      </div>
      
      <div className="p-4 bg-white/20 border-t border-warm-100 flex flex-wrap justify-between items-center text-[10px] text-warm-400 uppercase tracking-widest font-bold gap-2">
        <div className="flex items-center gap-4">
          <span>Markdown Supported</span>
          <span className="flex items-center gap-1 text-emerald-600/70">
            <Check size={10} /> Local Storage Secure
          </span>
        </div>
        <span>Last updated: {new Date(note.updatedAt).toLocaleString()}</span>
      </div>
    </div>
  );
};
