import { motion } from 'motion/react';

export function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
        >
          Loading...
        </motion.h2>

        {/* Progress Bar */}
        <div className="w-64 h-2 mx-auto bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

// Inline loader for components
export function InlineLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        className={`${sizes[size]} border-2 border-gray-300 border-t-blue-500 rounded-full`}
      />
    </div>
  );
}

// Skeleton loader
export function SkeletonLoader() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
