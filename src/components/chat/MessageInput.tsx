import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Send, Paperclip, Smile, Mic } from 'lucide-react';
import { Button } from '../ui/button';
import { useDebounce } from '../../hooks/performance';
import { useChatStore } from '../../stores/chat.store';
import { useOnlineStatus } from '../../hooks/performance';

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({
  conversationId,
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { emitTyping } = useChatStore();
  const isOnline = useOnlineStatus();

  // Debounce typing indicator
  const debouncedMessage = useDebounce(message, 500);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);

  // Emit typing indicator
  useEffect(() => {
    if (message && message !== debouncedMessage) {
      if (!isTyping) {
        setIsTyping(true);
        emitTyping(conversationId, true);
      }
    } else if (isTyping) {
      setIsTyping(false);
      emitTyping(conversationId, false);
    }
  }, [message, debouncedMessage, conversationId, isTyping, emitTyping]);

  // Stop typing when unmounting
  useEffect(() => {
    return () => {
      if (isTyping) {
        emitTyping(conversationId, false);
      }
    };
  }, [conversationId, isTyping, emitTyping]);

  const handleSend = () => {
    if (!message.trim() || disabled || !isOnline) return;

    // Optimistic send
    onSendMessage(message.trim());
    setMessage('');
    
    // Stop typing indicator
    if (isTyping) {
      emitTyping(conversationId, false);
      setIsTyping(false);
    }

    // Focus back to input
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      {/* Offline indicator */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-sm text-orange-700 dark:text-orange-400"
        >
          You're offline. Messages will be sent when you're back online.
        </motion.div>
      )}

      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={disabled || !isOnline}
          className="flex-shrink-0 mb-1"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !isOnline
                ? 'You are offline...'
                : 'Type a message... (Enter to send, Shift+Enter for new line)'
            }
            disabled={disabled || !isOnline}
            className="w-full resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              minHeight: '44px',
              maxHeight: '200px',
            }}
          />

          {/* Emoji button (positioned inside textarea) */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={disabled || !isOnline}
            className="absolute right-2 bottom-2 h-8 w-8"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send button or Voice button */}
        {message.trim() ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Button
              onClick={handleSend}
              size="icon"
              disabled={disabled || !isOnline}
              className="flex-shrink-0 mb-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="h-5 w-5" />
            </Button>
          </motion.div>
        ) : (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={disabled || !isOnline}
            className="flex-shrink-0 mb-1"
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono">
          Enter
        </kbd>{' '}
        to send,{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono">
          Shift+Enter
        </kbd>{' '}
        for new line
      </p>
    </div>
  );
}
