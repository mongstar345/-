import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Edit2, Trash2, Save, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  currentPage: number;
  onGoToPage: (page: number) => void;
}

interface Note {
  id: string;
  page: number;
  content: string;
  highlightedText?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

const NOTE_COLORS = [
  { name: 'Yellow', value: '#fef08a', border: '#facc15' },
  { name: 'Green', value: '#bbf7d0', border: '#4ade80' },
  { name: 'Blue', value: '#bfdbfe', border: '#3b82f6' },
  { name: 'Pink', value: '#fbcfe8', border: '#ec4899' },
  { name: 'Purple', value: '#e9d5ff', border: '#a855f7' },
];

export function NotesPanel({
  isOpen,
  onClose,
  bookId,
  currentPage,
  onGoToPage,
}: NotesPanelProps) {
  // Mock data - replace with API call
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      page: 45,
      content: 'Important concept about React hooks and their lifecycle',
      highlightedText: 'React hooks provide a way to use state...',
      color: NOTE_COLORS[0].value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      page: 89,
      content: 'Performance optimization techniques',
      color: NOTE_COLORS[2].value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0].value);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      page: currentPage,
      content: newNoteContent,
      color: selectedColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setIsAddingNote(false);

    // TODO: Save to backend
    // await createNote(bookId, newNote);
  };

  const handleEditNote = async (id: string) => {
    if (!editContent.trim()) return;

    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, content: editContent, updatedAt: new Date().toISOString() }
          : note
      )
    );

    setEditingNoteId(null);
    setEditContent('');

    // TODO: Update backend
    // await updateNote(id, { content: editContent });
  };

  const handleDeleteNote = async (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));

    // TODO: Delete from backend
    // await deleteNote(id);
  };

  const handleGoToNote = (page: number) => {
    onGoToPage(page);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-purple-600" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                My Notes
              </h2>
              <span className="text-sm text-gray-500">({notes.length})</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Add note section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            {isAddingNote ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add note for page {currentPage}
                  </p>
                  <textarea
                    placeholder="Write your note..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    autoFocus
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Color picker */}
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Highlight color:
                  </p>
                  <div className="flex gap-2">
                    {NOTE_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                          selectedColor === color.value
                            ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100'
                            : ''
                        }`}
                        style={{
                          backgroundColor: color.value,
                          borderWidth: '2px',
                          borderColor: color.border,
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNoteContent('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddNote}>
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save Note
                  </Button>
                </div>
              </div>
            ) : (
              <Button className="w-full" onClick={() => setIsAddingNote(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Note on Page {currentPage}
              </Button>
            )}
          </div>

          {/* Notes list */}
          <ScrollArea className="flex-1">
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Edit2 className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Add notes to remember key points
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-lg p-3 transition-all cursor-pointer hover:shadow-md"
                    style={{
                      backgroundColor: note.color,
                      borderLeft: `4px solid ${
                        NOTE_COLORS.find((c) => c.value === note.color)?.border ||
                        '#facc15'
                      }`,
                    }}
                    onClick={() => handleGoToNote(note.page)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">
                          Page {note.page}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingNoteId(note.id);
                            setEditContent(note.content);
                          }}
                        >
                          <Edit2 className="h-3 w-3 text-gray-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>

                    {/* Highlighted text */}
                    {note.highlightedText && (
                      <p className="text-xs text-gray-600 italic mb-2 line-clamp-2 border-l-2 border-gray-400 pl-2">
                        "{note.highlightedText}"
                      </p>
                    )}

                    {/* Note content */}
                    {editingNoteId === note.id ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full px-2 py-1 text-sm border border-gray-400 rounded bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingNoteId(null);
                              setEditContent('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditNote(note.id);
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {note.content}
                      </p>
                    )}

                    <span className="text-xs text-gray-500 mt-2 block">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
