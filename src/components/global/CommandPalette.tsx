import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Home,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Input } from '../ui/input';
import { useTheme } from '../../design-system/ThemeProvider';
import { useAuthStore } from '../../stores/auth.store';

interface Command {
  id: string;
  label: string;
  icon: any;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'settings';
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuthStore();

  // Commands list
  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      icon: Home,
      shortcut: '⌘D',
      action: () => navigate('/dashboard'),
      category: 'navigation',
    },
    {
      id: 'nav-chat',
      label: 'Open Messages',
      icon: MessageSquare,
      shortcut: '⌘M',
      action: () => navigate('/chat'),
      category: 'navigation',
    },
    {
      id: 'nav-books',
      label: 'Browse Books',
      icon: BookOpen,
      shortcut: '⌘B',
      action: () => navigate('/books'),
      category: 'navigation',
    },
    {
      id: 'nav-courses',
      label: 'View Courses',
      icon: GraduationCap,
      shortcut: '⌘C',
      action: () => navigate('/courses'),
      category: 'navigation',
    },
    {
      id: 'nav-profile',
      label: 'My Profile',
      icon: User,
      action: () => navigate('/profile'),
      category: 'navigation',
    },

    // Actions
    {
      id: 'action-theme',
      label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: isDark ? Sun : Moon,
      shortcut: '⌘T',
      action: toggleTheme,
      category: 'actions',
    },
    {
      id: 'action-logout',
      label: 'Logout',
      icon: LogOut,
      action: () => {
        logout();
        navigate('/login');
      },
      category: 'actions',
    },

    // Settings
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      shortcut: '⌘,',
      action: () => navigate('/settings'),
      category: 'settings',
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(search.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open/close with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      // Navigation shortcuts
      if ((e.ctrlKey || e.metaKey) && !isOpen) {
        const shortcutMap: Record<string, string> = {
          d: 'nav-dashboard',
          m: 'nav-chat',
          b: 'nav-books',
          c: 'nav-courses',
          t: 'action-theme',
          ',': 'settings',
        };

        const commandId = shortcutMap[e.key.toLowerCase()];
        if (commandId) {
          e.preventDefault();
          const command = commands.find((cmd) => cmd.id === commandId);
          if (command) {
            command.action();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commands]);

  const handleCommandClick = useCallback((command: Command) => {
    command.action();
    setIsOpen(false);
    setSearch('');
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1090]"
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[1100]"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  autoFocus
                />
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-[400px] overflow-y-auto">
                {Object.entries(groupedCommands).map(([category, cmds]) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-800/50">
                      {category}
                    </div>
                    {cmds.map((command) => {
                      const Icon = command.icon;
                      return (
                        <motion.button
                          key={command.id}
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          onClick={() => handleCommandClick(command)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {command.label}
                            </span>
                          </div>
                          {command.shortcut && (
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded">
                              {command.shortcut}
                            </kbd>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}

                {filteredCommands.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No commands found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Try a different search term
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <kbd className="px-2 py-1 font-semibold bg-white dark:bg-gray-700 rounded">
                    ⌘K
                  </kbd>
                  <span>to open</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 font-semibold bg-white dark:bg-gray-700 rounded">
                      ↑↓
                    </kbd>
                    <span>to navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 font-semibold bg-white dark:bg-gray-700 rounded">
                      ↵
                    </kbd>
                    <span>to select</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
