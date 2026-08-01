import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { tokens, semanticColors, Theme } from './tokens';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  colors: typeof semanticColors.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'nahrain_theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove old theme class
    root.classList.remove('light', 'dark');

    // Add new theme class
    root.classList.add(theme);

    // Update data attribute for CSS
    root.setAttribute('data-theme', theme);

    // Persist to localStorage
    localStorage.setItem(storageKey, theme);

    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        theme === 'dark' ? tokens.colors.neutral[950] : tokens.colors.neutral[50]
      );
    }
  }, [theme, storageKey]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const storedTheme = localStorage.getItem(storageKey);
      if (!storedTheme) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';
  const colors = semanticColors[theme];

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark,
    colors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// CSS Variables injection (alternative approach)
export function injectCSSVariables() {
  const root = document.documentElement;

  // Inject color variables
  Object.entries(tokens.colors).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      root.style.setProperty(`--color-${colorName}-${shade}`, value);
    });
  });

  // Inject spacing variables
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Inject radius variables
  Object.entries(tokens.radius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });
}
