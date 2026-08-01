import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap pointer-events-none"
          >
            {content}
            <div className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
