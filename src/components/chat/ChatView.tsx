import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, ArrowLeft, Send, Smile, Paperclip, Mic, MoreVertical } from 'lucide-react';
import { useChatStore } from '../../stores/chat.store';
import { useAuthStore } from '../../stores/auth.store';
import { wsService } from '../../services/websocket.service';
import { ConversationList } from './ConversationList';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function ChatView() {
  const { user } = useAuthStore();
  const { 
    conversations, 
    activeConversation, 
    messages, 
    isConnected,
    setActiveConversation 
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to WebSocket
  useEffect(() => {
    const token = localStorage.getItem('nahrain_access_token');
    if (token && !isConnected) {
      wsService.connect(token);
    }

    return () => {
      wsService.disconnect();
    };
  }, [isConnected]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;

    wsService.sendMessage(activeConversation.id, messageInput);
    setMessageInput('');
  };

  const handleTyping = () => {
    if (activeConversation) {
      wsService.sendTyping(activeConversation.id);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants?.find(p => p.userId !== user?.id);
    return otherUser?.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversations List */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`${
          activeConversation ? 'hidden md:block' : 'block'
        } w-full md:w-96 bg-white border-r flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            <Button size="icon" variant="ghost">
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 mt-3 text-xs">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-500">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Conversations */}
        <ConversationList
          conversations={filteredConversations}
          activeConversationId={activeConversation?.id || null}
          onSelectConversation={setActiveConversation}
        />
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="h-16 bg-white border-b flex items-center justify-between px-4"
            >
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="md:hidden"
                  onClick={() => setActiveConversation(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {activeConversation.name || 'User Name'}
                    </h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
              </div>

              <Button size="icon" variant="ghost">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <AnimatePresence mode="popLayout">
                {messages[activeConversation.id]?.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === user?.id}
                    showAvatar={
                      index === 0 ||
                      messages[activeConversation.id][index - 1].senderId !== message.senderId
                    }
                  />
                ))}
              </AnimatePresence>

              <TypingIndicator conversationId={activeConversation.id} />

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white border-t p-4"
            >
              <div className="flex items-end gap-2">
                <Button size="icon" variant="ghost">
                  <Plus className="h-5 w-5 text-gray-500" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Smile className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>

                {messageInput.trim() ? (
                  <Button onClick={handleSendMessage} size="icon" className="rounded-full">
                    <Send className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button size="icon" variant="ghost">
                    <Mic className="h-5 w-5 text-gray-500" />
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
              <p className="text-sm">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Default export for lazy loading
export default ChatView;