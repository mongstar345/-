import { create } from 'zustand';
import { Conversation, Message } from '../types';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>; // conversationId -> userIds
  unreadCount: number;
  isConnected: boolean;
  
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
  markAsRead: (conversationId: string) => void;
  setUnreadCount: (count: number) => void;
  setConnected: (isConnected: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  typingUsers: {},
  unreadCount: 0,
  isConnected: false,

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  addConversation: (conversation) => set((state) => ({
    conversations: [conversation, ...state.conversations],
  })),

  updateConversation: (id, updates) => set((state) => ({
    conversations: state.conversations.map((conv) =>
      conv.id === id ? { ...conv, ...updates } : conv
    ),
  })),

  setMessages: (conversationId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: messages,
    },
  })),

  addMessage: (message) => set((state) => {
    const conversationMessages = state.messages[message.conversationId] || [];
    return {
      messages: {
        ...state.messages,
        [message.conversationId]: [...conversationMessages, message],
      },
    };
  }),

  updateMessage: (id, updates) => set((state) => {
    const newMessages = { ...state.messages };
    Object.keys(newMessages).forEach((conversationId) => {
      newMessages[conversationId] = newMessages[conversationId].map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      );
    });
    return { messages: newMessages };
  }),

  deleteMessage: (id) => set((state) => {
    const newMessages = { ...state.messages };
    Object.keys(newMessages).forEach((conversationId) => {
      newMessages[conversationId] = newMessages[conversationId].filter(
        (msg) => msg.id !== id
      );
    });
    return { messages: newMessages };
  }),

  setTyping: (conversationId, userId, isTyping) => set((state) => {
    const currentTyping = state.typingUsers[conversationId] || [];
    const newTyping = isTyping
      ? [...currentTyping.filter((id) => id !== userId), userId]
      : currentTyping.filter((id) => id !== userId);

    return {
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: newTyping,
      },
    };
  }),

  markAsRead: (conversationId) => set((state) => ({
    conversations: state.conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ),
  })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  setConnected: (isConnected) => set({ isConnected }),
}));
