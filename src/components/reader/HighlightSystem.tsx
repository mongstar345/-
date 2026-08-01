import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Highlighter, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

export interface Highlight {
  id: string;
  bookId: string;
  page: number;
  startOffset: number;
  endOffset: number;
  text: string;
  color: string;
  note?: string;
  createdAt: string;
}

interface HighlightSystemProps {
  bookId: string;
  currentPage: number;
  onCreateNote?: (highlight: Highlight) => void;
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#fef08a', rgb: '254, 240, 138' },
  { name: 'Green', value: '#bbf7d0', rgb: '187, 247, 208' },
  { name: 'Blue', value: '#bfdbfe', rgb: '191, 219, 254' },
  { name: 'Pink', value: '#fbcfe8', rgb: '251, 207, 232' },
  { name: 'Purple', value: '#e9d5ff', rgb: '233, 213, 255' },
];

export function HighlightSystem({
  bookId,
  currentPage,
  onCreateNote,
}: HighlightSystemProps) {
  const [selectedText, setSelectedText] = useState('');
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [selectedColor, setSelectedColor] = useState(HIGHLIGHT_COLORS[0]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [hoveredHighlight, setHoveredHighlight] = useState<string | null>(null);

  // Handle text selection
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      setSelectedText(text);
      
      // Get selection position
      const range = selection?.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        setSelectionRect(rect);
        setShowToolbar(true);
      }
    } else {
      setShowToolbar(false);
      setSelectedText('');
      setSelectionRect(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, [handleSelection]);

  // Create highlight
  const handleCreateHighlight = useCallback(() => {
    if (!selectedText) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      bookId,
      page: currentPage,
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      text: selectedText,
      color: selectedColor.value,
      createdAt: new Date().toISOString(),
    };

    setHighlights([...highlights, newHighlight]);
    
    // Apply visual highlight
    applyHighlight(range, selectedColor, newHighlight.id);
    
    // Clear selection
    selection.removeAllRanges();
    setShowToolbar(false);
    setSelectedText('');

    // TODO: Save to backend
    // await saveHighlight(newHighlight);
  }, [selectedText, selectedColor, bookId, currentPage, highlights]);

  // Apply visual highlight to text
  const applyHighlight = (range: Range, color: typeof HIGHLIGHT_COLORS[0], id: string) => {
    const span = document.createElement('span');
    span.className = 'reader-highlight';
    span.dataset.highlightId = id;
    span.style.backgroundColor = color.value;
    span.style.cursor = 'pointer';
    span.style.transition = 'background-color 0.2s';
    
    // Add hover effect
    span.addEventListener('mouseenter', () => {
      setHoveredHighlight(id);
      span.style.backgroundColor = `rgba(${color.rgb}, 0.6)`;
    });
    
    span.addEventListener('mouseleave', () => {
      setHoveredHighlight(null);
      span.style.backgroundColor = color.value;
    });

    try {
      range.surroundContents(span);
    } catch (error) {
      // If surroundContents fails (e.g., across elements), use extractContents
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    }
  };

  // Delete highlight
  const handleDeleteHighlight = useCallback((highlightId: string) => {
    setHighlights(highlights.filter(h => h.id !== highlightId));
    
    // Remove visual highlight
    const element = document.querySelector(`[data-highlight-id="${highlightId}"]`);
    if (element) {
      const parent = element.parentNode;
      while (element.firstChild) {
        parent?.insertBefore(element.firstChild, element);
      }
      parent?.removeChild(element);
    }

    // TODO: Delete from backend
    // await deleteHighlight(highlightId);
  }, [highlights]);

  // Create note from highlight
  const handleCreateNoteFromHighlight = useCallback((highlight: Highlight) => {
    if (onCreateNote) {
      onCreateNote(highlight);
    }
    setHoveredHighlight(null);
  }, [onCreateNote]);

  return (
    <>
      {/* Selection Toolbar */}
      <AnimatePresence>
        {showToolbar && selectionRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 p-2"
            style={{
              left: `${selectionRect.left + selectionRect.width / 2}px`,
              top: `${selectionRect.top - 70}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-800">
              <Highlighter className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Highlight
              </span>
            </div>

            {/* Color picker */}
            <div className="flex gap-2 mb-2">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${
                    selectedColor.value === color.value
                      ? 'ring-2 ring-offset-1 ring-purple-600'
                      : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateHighlight}
                className="w-full"
              >
                Highlight
              </Button>
            </div>

            {/* Arrow pointer */}
            <div
              className="absolute w-3 h-3 bg-white dark:bg-gray-900 border-r border-b border-gray-200 dark:border-gray-800 transform rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Highlight hover tooltip */}
      <AnimatePresence>
        {hoveredHighlight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-40 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl p-2"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const highlight = highlights.find(h => h.id === hoveredHighlight);
                  if (highlight) handleCreateNoteFromHighlight(highlight);
                }}
                className="text-white hover:bg-gray-700"
              >
                Add Note
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteHighlight(hoveredHighlight)}
                className="text-red-400 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global styles for highlights */}
      <style>{`
        .reader-highlight {
          padding: 2px 0;
          border-radius: 2px;
          position: relative;
        }
        
        .reader-highlight::selection {
          background: rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </>
  );
}

// Hook to use highlights
export function useHighlights(bookId: string, page: number) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch highlights from backend
    // const fetchHighlights = async () => {
    //   const data = await getHighlights(bookId, page);
    //   setHighlights(data);
    //   setIsLoading(false);
    // };
    // fetchHighlights();
    
    setIsLoading(false);
  }, [bookId, page]);

  return { highlights, isLoading };
}
