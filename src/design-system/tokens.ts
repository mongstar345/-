// Design System Tokens - Enterprise Grade

export const tokens = {
  // Colors - Semantic palette
  colors: {
    // Primary
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    // Secondary
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },
    // Success
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    // Warning
    warning: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },
    // Error
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    // Neutral (for text & backgrounds)
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
  },

  // Spacing scale (consistent 8px grid)
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',
  },

  // Typography scale
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],        // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],       // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1' }],           // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
  },

  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Motion tokens (for consistent animations)
  motion: {
    // Duration
    duration: {
      instant: '0ms',
      fast: '150ms',
      base: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    // Easing
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    // Spring configs (for Framer Motion)
    spring: {
      gentle: { type: 'spring', stiffness: 120, damping: 14 },
      wobbly: { type: 'spring', stiffness: 180, damping: 12 },
      stiff: { type: 'spring', stiffness: 300, damping: 20 },
      slow: { type: 'spring', stiffness: 80, damping: 10 },
    },
  },

  // Transitions (common patterns)
  transitions: {
    all: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color, background-color, border-color, text-decoration-color, fill, stroke 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Semantic color mapping for light/dark themes
export const semanticColors = {
  light: {
    background: {
      primary: tokens.colors.neutral[50],
      secondary: tokens.colors.neutral[100],
      tertiary: tokens.colors.neutral[200],
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: tokens.colors.neutral[900],
      secondary: tokens.colors.neutral[600],
      tertiary: tokens.colors.neutral[400],
      inverse: '#ffffff',
      link: tokens.colors.primary[600],
      success: tokens.colors.success[700],
      warning: tokens.colors.warning[700],
      error: tokens.colors.error[700],
    },
    border: {
      primary: tokens.colors.neutral[200],
      secondary: tokens.colors.neutral[300],
      focus: tokens.colors.primary[500],
      error: tokens.colors.error[500],
    },
    interactive: {
      primary: tokens.colors.primary[500],
      primaryHover: tokens.colors.primary[600],
      primaryActive: tokens.colors.primary[700],
      secondary: tokens.colors.neutral[200],
      secondaryHover: tokens.colors.neutral[300],
      ghost: 'transparent',
      ghostHover: tokens.colors.neutral[100],
    },
  },
  dark: {
    background: {
      primary: tokens.colors.neutral[950],
      secondary: tokens.colors.neutral[900],
      tertiary: tokens.colors.neutral[800],
      elevated: tokens.colors.neutral[900],
      overlay: 'rgba(0, 0, 0, 0.75)',
    },
    text: {
      primary: tokens.colors.neutral[50],
      secondary: tokens.colors.neutral[400],
      tertiary: tokens.colors.neutral[600],
      inverse: tokens.colors.neutral[950],
      link: tokens.colors.primary[400],
      success: tokens.colors.success[400],
      warning: tokens.colors.warning[400],
      error: tokens.colors.error[400],
    },
    border: {
      primary: tokens.colors.neutral[800],
      secondary: tokens.colors.neutral[700],
      focus: tokens.colors.primary[500],
      error: tokens.colors.error[500],
    },
    interactive: {
      primary: tokens.colors.primary[500],
      primaryHover: tokens.colors.primary[400],
      primaryActive: tokens.colors.primary[600],
      secondary: tokens.colors.neutral[800],
      secondaryHover: tokens.colors.neutral[700],
      ghost: 'transparent',
      ghostHover: tokens.colors.neutral[800],
    },
  },
} as const;

// Type exports
export type Theme = 'light' | 'dark';
export type ColorToken = keyof typeof tokens.colors;
export type SpacingToken = keyof typeof tokens.spacing;
export type RadiusToken = keyof typeof tokens.radius;
