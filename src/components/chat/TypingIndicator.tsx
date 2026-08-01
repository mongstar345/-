import { motion } from 'motion/react';
import { useChatStore } from '../../stores/chat.store';
import { useAuthStore } from '../../stores/auth.store';

interface TypingIndicatorProps {
  conversationId: string;
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const { typingUsers } = useChatStore();
  const { user } = useAuthStore();

  const typingUserIds = typingUsers[conversationId]?.filter(
    (userId) => userId !== user?.id
  ) || [];

  if (typingUserIds.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-end gap-2"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex-shrink-0" />

      <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 0.1,
            }}
            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 0.1,
              delay: 0.2,
            }}
            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 0.1,
              delay: 0.4,
            }}
            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
          />
        </div>
      </div>
    </motion.div>
  );
}
