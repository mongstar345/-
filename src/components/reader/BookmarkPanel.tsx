import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';

interface BookmarkPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  currentPage: number;
  onGoToPage: (page: number) => void;
}

interface BookmarkItem {
  id: string;
  page: number;
  note?: string;
  createdAt: string;
}

export function BookmarkPanel({
  isOpen,
  onClose,
  bookId,
  currentPage,
  onGoToPage,
}: BookmarkPanelProps) {
  // Mock data - replace with API call
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    {
      id: '1',
      page: 45,
      note: 'Important chapter about React hooks',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      page: 89,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      page: 156,
      note: 'Performance optimization techniques',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleAddBookmark = async () => {
    const newBookmark: BookmarkItem = {
      id: Date.now().toString(),
      page: currentPage,
      note: newNote || undefined,
      createdAt: new Date().toISOString(),
    };

    setBookmarks([newBookmark, ...bookmarks]);
    setNewNote('');
    setIsAddingBookmark(false);

    // TODO: Save to backend
    // await saveBookmark(bookId, newBookmark);
  };

  const handleDeleteBookmark = async (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));

    // TODO: Delete from backend
    // await deleteBookmark(id);
  };

  const handleGoToBookmark = (page: number) => {
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
              <Bookmark className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Bookmarks
              </h2>
              <span className="text-sm text-gray-500">({bookmarks.length})</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Add bookmark button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            {isAddingBookmark ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add bookmark for page {currentPage}
                </p>
                <Input
                  placeholder="Add a note (optional)"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingBookmark(false);
                      setNewNote('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddBookmark}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={() => setIsAddingBookmark(true)}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmark Current Page ({currentPage})
              </Button>
            )}
          </div>

          {/* Bookmarks list */}
          <ScrollArea className="flex-1">
            {bookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Bookmark className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No bookmarks yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Add bookmarks to save your place
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {bookmarks.map((bookmark, index) => (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-gray-50 dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleGoToBookmark(bookmark.page)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bookmark className="h-4 w-4 text-blue-600 fill-blue-600" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Page {bookmark.page}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBookmark(bookmark.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {bookmark.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {bookmark.note}
                      </p>
                    )}

                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                      {new Date(bookmark.createdAt).toLocaleDateString()}
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
