import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { Pin, Check, CheckCheck, Archive } from 'lucide-react';
import { Conversation } from '../../types';
import { useAuthStore } from '../../stores/auth.store';
import { useChatStore } from '../../stores/chat.store';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  // Sort: pinned first, then by last message time
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      const aTime = new Date(a.lastMessage?.createdAt || 0).getTime();
      const bTime = new Date(b.lastMessage?.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [conversations]);

  // Virtual scrolling for 1000+ conversations
  const virtualizer = useVirtualizer({
    count: sortedConversations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  if (sortedConversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
            No conversations yet
          </h3>
          <p className="text-sm text-gray-500">
            Start a conversation to begin messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 transparent',
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="popLayout">
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const conversation = sortedConversations[virtualRow.index];
            const isActive = conversation.id === activeConversationId;
            
            // Get other participant
            const otherParticipant = conversation.participants?.find(
              (p) => p.userId !== user?.id
            );
            
            const lastMessage = conversation.lastMessage;
            const isOwnMessage = lastMessage?.senderId === user?.id;
            const hasUnread = conversation.unreadCount > 0;

            return (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  duration: 0.2,
                  delay: virtualRow.index * 0.02,
                }}
                onClick={() => onSelectConversation(conversation)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
                    : ''
                }`}
              >
                {/* Avatar with online indicator */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg ${
                      hasUnread ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                  >
                    {otherParticipant?.user?.fullName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  
                  {/* Online status */}
                  {otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    {/* Name & Pin */}
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-semibold truncate ${
                          hasUnread
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {conversation.name ||
                          otherParticipant?.user?.fullName ||
                          'Unknown User'}
                      </h3>
                      
                      {conversation.isPinned && (
                        <Pin className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
                      )}
                    </div>

                    {/* Time */}
                    {lastMessage && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {formatDistanceToNow(new Date(lastMessage.createdAt), {
                          addSuffix: false,
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Last message preview */}
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {/* Read status (for own messages) */}
                      {isOwnMessage && lastMessage && (
                        <div className="flex-shrink-0">
                          {lastMessage.isRead ? (
                            <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
                          ) : (
                            <Check className="h-3.5 w-3.5 text-gray-400" />
                          )}
                        </div>
                      )}

                      <p
                        className={`text-sm truncate ${
                          hasUnread
                            ? 'text-gray-900 dark:text-white font-medium'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {hasUnread && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 min-w-[20px] h-5 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center px-1.5 ml-2"
                      >
                        {conversation.unreadCount > 99
                          ? '99+'
                          : conversation.unreadCount}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
