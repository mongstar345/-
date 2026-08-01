import { motion } from 'motion/react';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

export function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
      )}
      {showAvatar && isOwn && <div className="w-8" />}

      {/* Message Bubble */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`max-w-[70%] md:max-w-md ${!showAvatar && !isOwn ? 'ml-10' : ''} ${
          !showAvatar && isOwn ? 'mr-10' : ''
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
              : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
          }`}
        >
          {/* Reply To */}
          {message.replyTo && (
            <div
              className={`text-xs mb-2 pb-2 border-l-2 pl-2 ${
                isOwn ? 'border-white/30' : 'border-gray-300'
              }`}
            >
              <p className={`${isOwn ? 'text-white/70' : 'text-gray-500'} font-medium`}>
                {message.replyTo.sender?.fullName || 'User'}
              </p>
              <p className={`${isOwn ? 'text-white/90' : 'text-gray-700'} line-clamp-2`}>
                {message.replyTo.content}
              </p>
            </div>
          )}

          {/* Content */}
          {message.content && (
            <p className="text-sm md:text-base whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}

          {/* Media */}
          {message.mediaUrl && message.mediaType === 'image' && (
            <motion.img
              src={message.mediaUrl}
              alt="Message media"
              className="mt-2 rounded-lg max-w-full cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                // Open image preview modal
              }}
            />
          )}

          {/* Metadata */}
          <div className="flex items-center justify-end gap-1 mt-1">
            <span
              className={`text-[10px] ${
                isOwn ? 'text-white/70' : 'text-gray-500'
              }`}
            >
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>

            {/* Read Status (only for own messages) */}
            {isOwn && (
              <div>
                {message.isRead ? (
                  <CheckCheck className="h-3.5 w-3.5 text-blue-200" />
                ) : (
                  <Check className="h-3.5 w-3.5 text-white/70" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edited indicator */}
        {message.updatedAt !== message.createdAt && (
          <p className={`text-[10px] mt-1 ${isOwn ? 'text-right' : 'text-left'} text-gray-400`}>
            edited
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
