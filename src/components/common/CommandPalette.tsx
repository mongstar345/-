import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Search,
  Home,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  User,
  Bell,
  Moon,
  Sun,
  FileText,
  CheckSquare,
} from 'lucide-react';
import { useKeyboardShortcut } from '../../hooks/performance';
import { useTheme } from '../../design-system/ThemeProvider';
import { Input } from '../ui/input';

interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  keywords?: string[];
  section?: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Open command palette with Ctrl/Cmd + K
  useKeyboardShortcut(['ctrl', 'k'], () => {
    setIsOpen(true);
  });

  useKeyboardShortcut(['meta', 'k'], () => {
    setIsOpen(true);
  });

  // Close with Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Define commands
  const commands: Command[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-home',
        label: 'Go to Home',
        icon: Home,
        action: () => {
          navigate('/');
          setIsOpen(false);
        },
        keywords: ['home', 'dashboard', 'main'],
        section: 'Navigation',
      },
      {
        id: 'nav-chat',
        label: 'Go to Chat',
        icon: MessageCircle,
        action: () => {
          navigate('/chat');
          setIsOpen(false);
        },
        keywords: ['chat', 'messages', 'conversations'],
        section: 'Navigation',
      },
      {
        id: 'nav-books',
        label: 'Go to Books',
        icon: BookOpen,
        action: () => {
          navigate('/books');
          setIsOpen(false);
        },
        keywords: ['books', 'reader', 'library'],
        section: 'Navigation',
      },
      {
        id: 'nav-courses',
        label: 'Go to Courses',
        icon: GraduationCap,
        action: () => {
          navigate('/courses');
          setIsOpen(false);
        },
        keywords: ['courses', 'learn', 'lessons'],
        section: 'Navigation',
      },
      {
        id: 'nav-tasks',
        label: 'Go to Tasks',
        icon: CheckSquare,
        action: () => {
          navigate('/dashboard');
          setIsOpen(false);
        },
        keywords: ['tasks', 'todo', 'dashboard'],
        section: 'Navigation',
      },

      // Actions
      {
        id: 'action-theme',
        label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
        icon: theme === 'light' ? Moon : Sun,
        action: () => {
          toggleTheme();
          setIsOpen(false);
        },
        keywords: ['theme', 'dark', 'light', 'mode'],
        section: 'Actions',
      },
      {
        id: 'action-settings',
        label: 'Open Settings',
        icon: Settings,
        action: () => {
          navigate('/settings');
          setIsOpen(false);
        },
        keywords: ['settings', 'preferences', 'config'],
        section: 'Actions',
      },
      {
        id: 'action-profile',
        label: 'View Profile',
        icon: User,
        action: () => {
          navigate('/profile');
          setIsOpen(false);
        },
        keywords: ['profile', 'account', 'user'],
        section: 'Actions',
      },
      {
        id: 'action-notifications',
        label: 'View Notifications',
        icon: Bell,
        action: () => {
          navigate('/notifications');
          setIsOpen(false);
        },
        keywords: ['notifications', 'alerts', 'updates'],
        section: 'Actions',
      },
      {
        id: 'action-logout',
        label: 'Logout',
        icon: LogOut,
        action: () => {
          // Logout logic
          setIsOpen(false);
        },
        keywords: ['logout', 'signout', 'exit'],
        section: 'Actions',
      },
    ],
    [navigate, theme, toggleTheme]
  );

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search) return commands;

    const searchLower = search.toLowerCase();

    return commands.filter((cmd) => {
      const labelMatch = cmd.label.toLowerCase().includes(searchLower);
      const keywordsMatch = cmd.keywords?.some((kw) =>
        kw.toLowerCase().includes(searchLower)
      );
      return labelMatch || keywordsMatch;
    });
  }, [commands, search]);

  // Group commands by section
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};

    filteredCommands.forEach((cmd) => {
      const section = cmd.section || 'Other';
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(cmd);
    });

    return groups;
  }, [filteredCommands]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
          cmd.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[20vh]"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-none focus:ring-0"
              />
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↑↓</kbd>
              <span>Navigate</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd>
              <span>Select</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd>
              <span>Close</span>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {Object.entries(groupedCommands).map(([section, cmds]) => (
              <div key={section} className="mb-4 last:mb-0">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  {section}
                </div>
                {cmds.map((cmd, index) => {
                  const globalIndex = filteredCommands.indexOf(cmd);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <motion.button
                      key={cmd.id}
                      whileHover={{ x: 4 }}
                      onClick={cmd.action}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <cmd.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{cmd.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No commands found</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
