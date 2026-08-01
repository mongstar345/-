import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Bookmark,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Type,
  Minus,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { BookmarkPanel } from './BookmarkPanel';
import { NotesPanel } from './NotesPanel';
import { ReaderSettings } from './ReaderSettings';
import { useDebounce } from '../../hooks/useDebounce';

interface BookReaderProps {
  bookId: string;
  initialPage?: number;
}

// Reading settings
interface ReaderConfig {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: number;
  fontFamily: 'serif' | 'sans' | 'mono';
  lineHeight: number;
  mode: 'scroll' | 'page';
  width: 'narrow' | 'medium' | 'wide';
}

const defaultConfig: ReaderConfig = {
  theme: 'light',
  fontSize: 18,
  fontFamily: 'serif',
  lineHeight: 1.8,
  mode: 'page',
  width: 'medium',
};

export function BookReader({ bookId, initialPage = 1 }: BookReaderProps) {
  const [config, setConfig] = useState<ReaderConfig>(() => {
    // Load saved settings
    const saved = localStorage.getItem(`reader_config_${bookId}`);
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages] = useState(500); // From API
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selection, setSelection] = useState<string>('');

  const contentRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<NodeJS.Timeout>();

  // Debounce page update to save to backend
  const debouncedPage = useDebounce(currentPage, 2000);

  useEffect(() => {
    // Save progress to backend
    if (debouncedPage > 1) {
      saveProgress(bookId, debouncedPage);
    }
  }, [debouncedPage, bookId]);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem(`reader_config_${bookId}`, JSON.stringify(config));
  }, [config, bookId]);

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selected = window.getSelection()?.toString() || '';
      setSelection(selected);
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  // Auto-hide controls after 3 seconds
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [resetHideTimer]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage((p) => p + 1);
      } else if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsBookmarksOpen(false);
        setIsNotesOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const progressPercentage = ((currentPage / totalPages) * 100).toFixed(1);

  // Theme classes
  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-950 text-gray-100',
    sepia: 'bg-[#f4ecd8] text-[#5c4a2f]',
  };

  const widthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
  };

  const fontClasses = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono',
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        themeClasses[config.theme]
      }`}
      onMouseMove={resetHideTimer}
    >
      {/* Top Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${
              config.theme === 'dark'
                ? 'bg-gray-900/80 border-gray-800'
                : config.theme === 'sepia'
                ? 'bg-[#f4ecd8]/80 border-[#d4c4a8]'
                : 'bg-white/80 border-gray-200'
            }`}
          >
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.history.back()}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="font-semibold text-lg">Book Title</h1>
                  <p className="text-xs opacity-70">
                    Page {currentPage} of {totalPages} • {progressPercentage}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsBookmarksOpen(true)}
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNotesOpen(true)}
                >
                  <StickyNote className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        ref={contentRef}
        className={`container mx-auto px-4 py-20 ${widthClasses[config.width]}`}
      >
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: config.mode === 'page' ? 50 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`${fontClasses[config.fontFamily]} prose prose-lg max-w-none`}
          style={{
            fontSize: `${config.fontSize}px`,
            lineHeight: config.lineHeight,
          }}
        >
          {/* Mock content - Replace with actual book content */}
          <h2>Chapter {currentPage}</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {showControls && config.mode === 'page' && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t ${
              config.theme === 'dark'
                ? 'bg-gray-900/80 border-gray-800'
                : config.theme === 'sepia'
                ? 'bg-[#f4ecd8]/80 border-[#d4c4a8]'
                : 'bg-white/80 border-gray-200'
            }`}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex-1">
                  <Slider
                    value={[currentPage]}
                    min={1}
                    max={totalPages}
                    step={1}
                    onValueChange={([value]) => setCurrentPage(value)}
                    className="cursor-pointer"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Toolbar */}
      <AnimatePresence>
        {selection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed left-1/2 bottom-20 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-full px-4 py-2 shadow-xl flex items-center gap-2"
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => {
                // Add highlight
                console.log('Highlight:', selection);
              }}
            >
              Highlight
            </Button>
            <div className="w-px h-4 bg-white/30" />
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => {
                // Add note
                setIsNotesOpen(true);
              }}
            >
              Note
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebars */}
      <ReaderSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onConfigChange={setConfig}
      />

      <BookmarkPanel
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookId={bookId}
        currentPage={currentPage}
        onGoToPage={setCurrentPage}
      />

      <NotesPanel
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        bookId={bookId}
        currentPage={currentPage}
        selectedText={selection}
      />
    </div>
  );
}

// Save progress helper
async function saveProgress(bookId: string, page: number) {
  try {
    await fetch(`/api/books/${bookId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPage: page }),
    });
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}
