import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export type LightTheme = 'pure-white' | 'blue-white' | 'warm-white' | 'cool-gray';
export type DarkTheme = 'amoled-black' | 'blue-dark' | 'gray-dark' | 'deep-purple' | 'navy-dark';

export interface ThemeConfig {
  mode: ThemeMode;
  lightTheme: LightTheme;
  darkTheme: DarkTheme;
}

interface ThemeColors {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgHover: string;
  bgActive: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  
  // Borders
  border: string;
  borderLight: string;
  
  // Cards
  cardBg: string;
  cardHover: string;
  
  // Chat specific
  chatBg: string;
  chatHeader: string;
  chatBubbleMe: string;
  chatBubbleOther: string;
  chatInput: string;
}

interface ThemeContextType {
  theme: ThemeConfig;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  setLightTheme: (theme: LightTheme) => void;
  setDarkTheme: (theme: DarkTheme) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightThemes: Record<LightTheme, ThemeColors> = {
  'pure-white': {
    bgPrimary: 'bg-white',
    bgSecondary: 'bg-gray-50',
    bgTertiary: 'bg-gray-100',
    bgHover: 'hover:bg-gray-100',
    bgActive: 'bg-gray-200',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textTertiary: 'text-gray-500',
    border: 'border-gray-200',
    borderLight: 'border-gray-100',
    cardBg: 'bg-white',
    cardHover: 'hover:bg-gray-50',
    chatBg: 'bg-gray-50',
    chatHeader: 'bg-white',
    chatBubbleMe: 'bg-blue-500',
    chatBubbleOther: 'bg-white',
    chatInput: 'bg-gray-100',
  },
  'blue-white': {
    bgPrimary: 'bg-blue-50',
    bgSecondary: 'bg-blue-100/50',
    bgTertiary: 'bg-blue-100',
    bgHover: 'hover:bg-blue-100',
    bgActive: 'bg-blue-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textTertiary: 'text-slate-600',
    border: 'border-blue-200',
    borderLight: 'border-blue-100',
    cardBg: 'bg-white',
    cardHover: 'hover:bg-blue-50',
    chatBg: 'bg-blue-50/50',
    chatHeader: 'bg-white',
    chatBubbleMe: 'bg-blue-500',
    chatBubbleOther: 'bg-white',
    chatInput: 'bg-blue-100/50',
  },
  'warm-white': {
    bgPrimary: 'bg-amber-50',
    bgSecondary: 'bg-orange-50',
    bgTertiary: 'bg-amber-100',
    bgHover: 'hover:bg-amber-100',
    bgActive: 'bg-amber-200',
    textPrimary: 'text-amber-950',
    textSecondary: 'text-amber-900',
    textTertiary: 'text-amber-800',
    border: 'border-amber-200',
    borderLight: 'border-amber-100',
    cardBg: 'bg-white',
    cardHover: 'hover:bg-amber-50',
    chatBg: 'bg-amber-50/50',
    chatHeader: 'bg-white',
    chatBubbleMe: 'bg-orange-500',
    chatBubbleOther: 'bg-white',
    chatInput: 'bg-amber-100/50',
  },
  'cool-gray': {
    bgPrimary: 'bg-slate-50',
    bgSecondary: 'bg-slate-100',
    bgTertiary: 'bg-slate-200',
    bgHover: 'hover:bg-slate-100',
    bgActive: 'bg-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textTertiary: 'text-slate-600',
    border: 'border-slate-200',
    borderLight: 'border-slate-100',
    cardBg: 'bg-white',
    cardHover: 'hover:bg-slate-50',
    chatBg: 'bg-slate-50',
    chatHeader: 'bg-white',
    chatBubbleMe: 'bg-slate-600',
    chatBubbleOther: 'bg-white',
    chatInput: 'bg-slate-100',
  },
};

const darkThemes: Record<DarkTheme, ThemeColors> = {
  'amoled-black': {
    bgPrimary: 'bg-black',
    bgSecondary: 'bg-zinc-950',
    bgTertiary: 'bg-zinc-900',
    bgHover: 'hover:bg-zinc-900',
    bgActive: 'bg-zinc-800',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-400',
    border: 'border-zinc-800',
    borderLight: 'border-zinc-900',
    cardBg: 'bg-zinc-950',
    cardHover: 'hover:bg-zinc-900',
    chatBg: 'bg-black',
    chatHeader: 'bg-zinc-950',
    chatBubbleMe: 'bg-blue-600',
    chatBubbleOther: 'bg-zinc-900',
    chatInput: 'bg-zinc-900',
  },
  'blue-dark': {
    bgPrimary: 'bg-slate-950',
    bgSecondary: 'bg-slate-900',
    bgTertiary: 'bg-slate-800',
    bgHover: 'hover:bg-slate-800',
    bgActive: 'bg-slate-700',
    textPrimary: 'text-slate-50',
    textSecondary: 'text-slate-300',
    textTertiary: 'text-slate-400',
    border: 'border-slate-700',
    borderLight: 'border-slate-800',
    cardBg: 'bg-slate-900',
    cardHover: 'hover:bg-slate-800',
    chatBg: 'bg-slate-950',
    chatHeader: 'bg-slate-900',
    chatBubbleMe: 'bg-blue-600',
    chatBubbleOther: 'bg-slate-800',
    chatInput: 'bg-slate-800',
  },
  'gray-dark': {
    bgPrimary: 'bg-gray-900',
    bgSecondary: 'bg-gray-800',
    bgTertiary: 'bg-gray-700',
    bgHover: 'hover:bg-gray-700',
    bgActive: 'bg-gray-600',
    textPrimary: 'text-gray-100',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-400',
    border: 'border-gray-700',
    borderLight: 'border-gray-800',
    cardBg: 'bg-gray-800',
    cardHover: 'hover:bg-gray-700',
    chatBg: 'bg-gray-900',
    chatHeader: 'bg-gray-800',
    chatBubbleMe: 'bg-blue-600',
    chatBubbleOther: 'bg-gray-700',
    chatInput: 'bg-gray-700',
  },
  'deep-purple': {
    bgPrimary: 'bg-purple-950',
    bgSecondary: 'bg-purple-900',
    bgTertiary: 'bg-purple-800',
    bgHover: 'hover:bg-purple-800',
    bgActive: 'bg-purple-700',
    textPrimary: 'text-purple-50',
    textSecondary: 'text-purple-200',
    textTertiary: 'text-purple-300',
    border: 'border-purple-700',
    borderLight: 'border-purple-800',
    cardBg: 'bg-purple-900',
    cardHover: 'hover:bg-purple-800',
    chatBg: 'bg-purple-950',
    chatHeader: 'bg-purple-900',
    chatBubbleMe: 'bg-purple-600',
    chatBubbleOther: 'bg-purple-800',
    chatInput: 'bg-purple-800',
  },
  'navy-dark': {
    bgPrimary: 'bg-[#0E1621]',
    bgSecondary: 'bg-[#17212B]',
    bgTertiary: 'bg-[#1C2733]',
    bgHover: 'hover:bg-[#1C2733]',
    bgActive: 'bg-[#242F3D]',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-400',
    border: 'border-gray-700',
    borderLight: 'border-gray-800',
    cardBg: 'bg-[#17212B]',
    cardHover: 'hover:bg-[#1C2733]',
    chatBg: 'bg-[#0E1621]',
    chatHeader: 'bg-[#17212B]',
    chatBubbleMe: 'bg-[#5288C1]',
    chatBubbleOther: 'bg-[#202B34]',
    chatInput: 'bg-[#242F3D]',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('theme-config');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      mode: 'light',
      lightTheme: 'pure-white',
      darkTheme: 'navy-dark',
    };
  });

  useEffect(() => {
    localStorage.setItem('theme-config', JSON.stringify(theme));
  }, [theme]);

  const colors = theme.mode === 'light' 
    ? lightThemes[theme.lightTheme]
    : darkThemes[theme.darkTheme];

  const setMode = (mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }));
  };

  const setLightTheme = (lightTheme: LightTheme) => {
    setTheme(prev => ({ ...prev, lightTheme }));
  };

  const setDarkTheme = (darkTheme: DarkTheme) => {
    setTheme(prev => ({ ...prev, darkTheme }));
  };

  const toggleMode = () => {
    setTheme(prev => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setMode, setLightTheme, setDarkTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
