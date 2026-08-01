import { 
  ArrowLeft, BookmarkPlus, Settings, ChevronLeft, ChevronRight, 
  Sun, Moon, Type, Palette, Bookmark, StickyNote, Highlighter,
  Menu, X, Search, MoreVertical, Minus, Plus, AlignLeft, Clock, BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { ScrollArea } from './ui/scroll-area';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BookReaderProps {
  bookId: number;
  onClose: () => void;
}

interface Bookmark {
  id: number;
  page: number;
  content: string;
  timestamp: string;
}

interface Note {
  id: number;
  page: number;
  content: string;
  note: string;
  timestamp: string;
}

interface Highlight {
  id: number;
  page: number;
  content: string;
  color: string;
  timestamp: string;
}

interface ReadingStats {
  timeRead: number; // minutes
  pagesRead: number;
  currentPage: number;
  totalPages: number;
  lastReadDate: string;
  progressPercent: number;
}

const themes = [
  { id: 'light', name: 'Light', bg: 'bg-white', text: 'text-gray-900' },
  { id: 'sepia', name: 'Sepia', bg: 'bg-amber-50', text: 'text-amber-900' },
  { id: 'dark', name: 'Dark', bg: 'bg-gray-900', text: 'text-gray-100' },
  { id: 'night', name: 'Night', bg: 'bg-slate-950', text: 'text-slate-100' },
];

const fonts = [
  { id: 'serif', name: 'Serif', class: 'font-serif' },
  { id: 'sans', name: 'Sans', class: 'font-sans' },
  { id: 'mono', name: 'Mono', class: 'font-mono' },
];

const highlightColors = [
  { id: 'yellow', color: 'bg-yellow-200', name: 'Yellow' },
  { id: 'green', color: 'bg-green-200', name: 'Green' },
  { id: 'blue', color: 'bg-blue-200', name: 'Blue' },
  { id: 'pink', color: 'bg-pink-200', name: 'Pink' },
];

export function BookReader({ bookId, onClose }: BookReaderProps) {
  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(450);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'bookmarks' | 'notes' | 'highlights' | 'stats'>('bookmarks');
  
  // Reading Settings
  const [theme, setTheme] = useState(themes[0]);
  const [font, setFont] = useState(fonts[0]);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [pageMode, setPageMode] = useState<'scroll' | 'page'>('page');
  
  // Content State
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: 1, page: 45, content: 'Chapter 5: Advanced Data Structures', timestamp: '2 days ago' },
    { id: 2, page: 120, content: 'Binary Search Trees Implementation', timestamp: '1 week ago' },
  ]);
  
  const [notes, setNotes] = useState<Note[]>([
    { 
      id: 1, 
      page: 67, 
      content: 'Time complexity of merge sort',
      note: 'O(n log n) in all cases - important for interviews!',
      timestamp: '3 days ago' 
    },
  ]);
  
  const [highlights, setHighlights] = useState<Highlight[]>([
    { 
      id: 1, 
      page: 34, 
      content: 'Dynamic programming is an optimization technique',
      color: 'bg-yellow-200',
      timestamp: '5 days ago' 
    },
  ]);

  const [stats, setStats] = useState<ReadingStats>({
    timeRead: 245, // total minutes
    pagesRead: 156,
    currentPage: 156,
    totalPages: 450,
    lastReadDate: 'Today, 10:30 AM',
    progressPercent: 35,
  });

  // Selection State
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [showNoteDialog, setShowNoteDialog] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const readingTimerRef = useRef<NodeJS.Timeout>();

  // Book content (mock data - would come from API)
  const bookContent = `
    <h1>Chapter 7: Advanced Algorithms</h1>
    
    <h2>7.1 Dynamic Programming</h2>
    
    <p>Dynamic programming is a powerful algorithmic technique for solving optimization problems by breaking them down into simpler subproblems. The key principle is to store the results of expensive function calls and reuse them when the same inputs occur again.</p>
    
    <p>This technique is particularly useful when:</p>
    <ul>
      <li>The problem can be broken down into overlapping subproblems</li>
      <li>The problem has an optimal substructure</li>
      <li>There are only a polynomial number of subproblems</li>
    </ul>
    
    <h3>7.1.1 Memoization vs Tabulation</h3>
    
    <p>There are two main approaches to dynamic programming: <strong>memoization</strong> (top-down) and <strong>tabulation</strong> (bottom-up).</p>
    
    <p><strong>Memoization</strong> starts with the original problem and recursively breaks it down, storing results in a cache. This approach is intuitive but may have overhead from recursive calls.</p>
    
    <p><strong>Tabulation</strong> builds solutions from the smallest subproblems up to the original problem. This iterative approach typically uses less memory and runs faster.</p>
    
    <h3>7.1.2 Classic Examples</h3>
    
    <p>The Fibonacci sequence is the "Hello World" of dynamic programming. The naive recursive solution has exponential time complexity O(2^n), but with memoization, we can reduce this to O(n).</p>
    
    <pre>
    function fibonacci(n, memo = {}) {
      if (n in memo) return memo[n];
      if (n <= 2) return 1;
      memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
      return memo[n];
    }
    </pre>
    
    <h2>7.2 Graph Algorithms</h2>
    
    <p>Graph algorithms are essential for solving problems involving networks, relationships, and connections. Common graph algorithms include:</p>
    
    <ul>
      <li><strong>Depth-First Search (DFS):</strong> Explores as far as possible along each branch before backtracking</li>
      <li><strong>Breadth-First Search (BFS):</strong> Explores all neighbors at the present depth before moving to nodes at the next depth level</li>
      <li><strong>Dijkstra's Algorithm:</strong> Finds the shortest path from a source vertex to all other vertices in a weighted graph</li>
      <li><strong>Bellman-Ford Algorithm:</strong> Computes shortest paths from a single source vertex to all other vertices, even with negative edge weights</li>
    </ul>
    
    <p>Understanding when to use each algorithm is crucial for efficient problem-solving. For example, use BFS for finding shortest paths in unweighted graphs, and Dijkstra's for weighted graphs with non-negative edges.</p>
  `;

  // Auto-save reading progress
  useEffect(() => {
    const saveProgress = () => {
      // API call to save progress
      console.log('Saving progress:', { bookId, currentPage, stats });
    };

    const interval = setInterval(saveProgress, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [bookId, currentPage, stats]);

  // Track reading time
  useEffect(() => {
    readingTimerRef.current = setInterval(() => {
      setStats(prev => ({
        ...prev,
        timeRead: prev.timeRead + 1,
      }));
    }, 60000); // Increment every minute

    return () => {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current);
      }
    };
  }, []);

  // Update progress when page changes
  useEffect(() => {
    const progressPercent = Math.round((currentPage / totalPages) * 100);
    setStats(prev => ({
      ...prev,
      currentPage,
      progressPercent,
      pagesRead: Math.max(prev.pagesRead, currentPage),
    }));
  }, [currentPage, totalPages]);

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setSelectedText(text);
        setSelectionPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
        setShowHighlightMenu(true);
      }
    } else {
      setShowHighlightMenu(false);
      setSelectedText('');
      setSelectionPosition(null);
    }
  };

  const addBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now(),
      page: currentPage,
      content: `Page ${currentPage}`,
      timestamp: 'Just now',
    };
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const addNote = () => {
    if (noteContent.trim() && selectedText) {
      const newNote: Note = {
        id: Date.now(),
        page: currentPage,
        content: selectedText,
        note: noteContent,
        timestamp: 'Just now',
      };
      setNotes(prev => [newNote, ...prev]);
      setNoteContent('');
      setShowNoteDialog(false);
      setShowHighlightMenu(false);
    }
  };

  const addHighlight = (color: string) => {
    if (selectedText) {
      const newHighlight: Highlight = {
        id: Date.now(),
        page: currentPage,
        content: selectedText,
        color,
        timestamp: 'Just now',
      };
      setHighlights(prev => [newHighlight, ...prev]);
      setShowHighlightMenu(false);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setShowSidebar(false);
  };

  return (
    <div className={`fixed inset-0 z-50 ${theme.bg} ${theme.text} flex flex-col`}>
      {/* Top Bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
          <Badge variant="outline" className="text-xs">
            {stats.progressPercent}%
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={addBookmark}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <BookmarkPlus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${stats.progressPercent}%` }}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col"
            >
              {/* Sidebar Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-800 p-2 flex gap-1">
                <Button
                  variant={sidebarTab === 'bookmarks' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSidebarTab('bookmarks')}
                  className="flex-1"
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  Bookmarks
                </Button>
                <Button
                  variant={sidebarTab === 'notes' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSidebarTab('notes')}
                  className="flex-1"
                >
                  <StickyNote className="h-4 w-4 mr-1" />
                  Notes
                </Button>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-800 p-2 flex gap-1">
                <Button
                  variant={sidebarTab === 'highlights' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSidebarTab('highlights')}
                  className="flex-1"
                >
                  <Highlighter className="h-4 w-4 mr-1" />
                  Highlights
                </Button>
                <Button
                  variant={sidebarTab === 'stats' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSidebarTab('stats')}
                  className="flex-1"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Stats
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4">
                {/* Bookmarks Tab */}
                {sidebarTab === 'bookmarks' && (
                  <div className="space-y-2">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        onClick={() => goToPage(bookmark.page)}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <Badge variant="outline" className="text-xs">
                            Page {bookmark.page}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm mb-1">{bookmark.content}</p>
                        <p className="text-xs text-gray-500">{bookmark.timestamp}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes Tab */}
                {sidebarTab === 'notes' && (
                  <div className="space-y-2">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => goToPage(note.page)}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            Page {note.page}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">
                          "{note.content}"
                        </p>
                        <p className="text-sm mb-1">{note.note}</p>
                        <p className="text-xs text-gray-500">{note.timestamp}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights Tab */}
                {sidebarTab === 'highlights' && (
                  <div className="space-y-2">
                    {highlights.map((highlight) => (
                      <div
                        key={highlight.id}
                        onClick={() => goToPage(highlight.page)}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            Page {highlight.page}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className={`text-sm p-1 rounded ${highlight.color} mb-1`}>
                          {highlight.content}
                        </p>
                        <p className="text-xs text-gray-500">{highlight.timestamp}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats Tab */}
                {sidebarTab === 'stats' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Reading Time</h3>
                      </div>
                      <p className="text-2xl font-bold">{Math.floor(stats.timeRead / 60)}h {stats.timeRead % 60}m</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total time spent reading</p>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">Progress</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pages read:</span>
                          <span className="font-medium">{stats.pagesRead} / {stats.totalPages}</span>
                        </div>
                        <Progress value={stats.progressPercent} className="h-2" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">{stats.progressPercent}% complete</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <h3 className="font-semibold mb-2">Activity</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Bookmarks:</span>
                          <span className="font-medium">{bookmarks.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Notes:</span>
                          <span className="font-medium">{notes.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Highlights:</span>
                          <span className="font-medium">{highlights.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reading Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-gray-200 dark:border-gray-800 p-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search in book..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto px-8 py-12">
              <div
                ref={contentRef}
                className={`prose prose-lg dark:prose-invert ${font.class}`}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                }}
                onMouseUp={handleTextSelection}
                dangerouslySetInnerHTML={{ __html: bookContent }}
              />
            </div>
          </ScrollArea>

          {/* Page Navigation */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 border-l border-gray-200 dark:border-gray-800 flex flex-col"
            >
              <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
                <h3 className="font-semibold">Reading Settings</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4 space-y-6">
                {/* Theme */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          theme.id === t.id
                            ? 'border-blue-500'
                            : 'border-gray-200 dark:border-gray-800'
                        } ${t.bg} ${t.text}`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {t.id === 'dark' || t.id === 'night' ? (
                            <Moon className="h-4 w-4" />
                          ) : (
                            <Sun className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">{t.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Font Family
                  </label>
                  <div className="space-y-2 mt-2">
                    {fonts.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFont(f)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          font.id === f.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-800'
                        } ${f.class}`}
                      >
                        <span className="text-sm font-medium">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlignLeft className="h-4 w-4" />
                      Font Size
                    </span>
                    <span className="text-xs text-gray-500">{fontSize}px</span>
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Slider
                      value={[fontSize]}
                      onValueChange={([value]) => setFontSize(value)}
                      min={12}
                      max={32}
                      step={2}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Line Height */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center justify-between">
                    <span>Line Height</span>
                    <span className="text-xs text-gray-500">{lineHeight}</span>
                  </label>
                  <Slider
                    value={[lineHeight]}
                    onValueChange={([value]) => setLineHeight(value)}
                    min={1.2}
                    max={2.5}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Selection Toolbar */}
      <AnimatePresence>
        {showHighlightMenu && selectionPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{
              position: 'fixed',
              left: selectionPosition.x,
              top: selectionPosition.y,
              transform: 'translateX(-50%) translateY(-100%)',
            }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 p-2 flex gap-1 z-50"
          >
            {highlightColors.map((color) => (
              <button
                key={color.id}
                onClick={() => addHighlight(color.color)}
                className={`w-8 h-8 rounded-md ${color.color} hover:opacity-80 transition-opacity`}
                title={`Highlight ${color.name}`}
              />
            ))}
            <div className="w-px bg-gray-200 dark:bg-gray-800 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNoteDialog(true)}
              title="Add Note"
            >
              <StickyNote className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note Dialog */}
      <AnimatePresence>
        {showNoteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNoteDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Add Note</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected text:</p>
                <p className="text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded italic">
                  "{selectedText}"
                </p>
              </div>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your note here..."
                className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={addNote}
                  className="flex-1"
                  disabled={!noteContent.trim()}
                >
                  Save Note
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNoteDialog(false);
                    setNoteContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BookReader;
