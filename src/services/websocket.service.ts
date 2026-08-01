import { API_CONFIG } from '../config/api.config';
import { useChatStore } from '../stores/chat.store';
import { Message } from '../types';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private token: string | null = null;

  connect(token: string) {
    this.token = token;
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const wsUrl = `${API_CONFIG.WS_URL}?token=${token}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      useChatStore.getState().setConnected(true);
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      useChatStore.getState().setConnected(false);
      this.stopHeartbeat();
      this.attemptReconnect();
    };
  }

  private handleMessage(data: any) {
    const { type, payload } = data;

    switch (type) {
      case 'new_message':
        this.handleNewMessage(payload);
        break;

      case 'message_read':
        this.handleMessageRead(payload);
        break;

      case 'message_deleted':
        this.handleMessageDeleted(payload);
        break;

      case 'typing':
        this.handleTyping(payload);
        break;

      case 'stop_typing':
        this.handleStopTyping(payload);
        break;

      case 'conversation_update':
        this.handleConversationUpdate(payload);
        break;

      case 'pong':
        // Heartbeat response
        break;

      default:
        console.warn('Unknown WebSocket message type:', type);
    }
  }

  private handleNewMessage(message: Message) {
    const store = useChatStore.getState();
    store.addMessage(message);

    // Update conversation last message
    store.updateConversation(message.conversationId, {
      lastMessageAt: message.createdAt,
      lastMessage: message,
    });

    // Play notification sound if not active conversation
    if (store.activeConversation?.id !== message.conversationId) {
      this.playNotificationSound();
    }
  }

  private handleMessageRead(payload: { messageId: string; conversationId: string }) {
    const store = useChatStore.getState();
    store.updateMessage(payload.messageId, {
      isRead: true,
      readAt: new Date().toISOString(),
    });
  }

  private handleMessageDeleted(payload: { messageId: string }) {
    useChatStore.getState().deleteMessage(payload.messageId);
  }

  private handleTyping(payload: { conversationId: string; userId: string }) {
    useChatStore.getState().setTyping(payload.conversationId, payload.userId, true);

    // Auto-remove typing indicator after 3 seconds
    setTimeout(() => {
      useChatStore.getState().setTyping(payload.conversationId, payload.userId, false);
    }, 3000);
  }

  private handleStopTyping(payload: { conversationId: string; userId: string }) {
    useChatStore.getState().setTyping(payload.conversationId, payload.userId, false);
  }

  private handleConversationUpdate(payload: any) {
    const store = useChatStore.getState();
    store.updateConversation(payload.id, payload.updates);
  }

  sendMessage(conversationId: string, content: string, replyToId?: string) {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return;
    }

    this.send({
      type: 'send_message',
      payload: {
        conversationId,
        content,
        replyToId,
      },
    });
  }

  sendTyping(conversationId: string) {
    if (!this.isConnected()) return;

    this.send({
      type: 'typing',
      payload: { conversationId },
    });
  }

  sendStopTyping(conversationId: string) {
    if (!this.isConnected()) return;

    this.send({
      type: 'stop_typing',
      payload: { conversationId },
    });
  }

  markAsRead(messageId: string, conversationId: string) {
    if (!this.isConnected()) return;

    this.send({
      type: 'mark_read',
      payload: { messageId, conversationId },
    });
  }

  deleteMessage(messageId: string) {
    if (!this.isConnected()) return;

    this.send({
      type: 'delete_message',
      payload: { messageId },
    });
  }

  private send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping' });
      }
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, delay);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    useChatStore.getState().setConnected(false);
  }

  private playNotificationSound() {
    // Play a subtle notification sound
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore autoplay errors
    });
  }
}

export const wsService = new WebSocketService();
