/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_URL: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ENABLE_CHAT: string;
  readonly VITE_ENABLE_COURSES: string;
  readonly VITE_ENABLE_READER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Declare module for figma:asset imports
declare module 'figma:asset/*' {
  const content: string;
  export default content;
}

// Declare module for sonner with version
declare module 'sonner@2.0.3' {
  export * from 'sonner';
}

// Declare module for react-hook-form with version
declare module 'react-hook-form@7.55.0' {
  export * from 'react-hook-form';
}

// Declare module for motion (Framer Motion's new package)
declare module 'motion/react' {
  export * from 'framer-motion';
}