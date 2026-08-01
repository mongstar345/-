import { 
  Search, Plus, Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic, ArrowLeft, 
  Bot, Pin, Check, CheckCheck, Reply, Edit2, Trash2, Forward, Archive, VolumeX,
  Download, Image as ImageIcon, File, X, ChevronDown, ChevronRight, Camera, Clock,
  MapPin, Music, FileText, Contact, CheckSquare, Folder
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  title?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  isTyping?: boolean;
  isPinned?: boolean;
  isAI?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  category?: string;
  messageRead?: boolean;
}

interface Message {
  id: number;
  sender: 'me' | 'other';
  content?: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  replyTo?: {
    id: number;
    sender: string;
    content: string;
  };
  isEdited?: boolean;
  reactions?: { emoji: string; count: number }[];
  type?: 'text' | 'image' | 'file' | 'voice' | 'music' | 'location' | 'contact';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  duration?: string;
}

interface PinnedMessage {
  content: string;
  sender: string;
  timestamp: string;
}

interface EmojiReaction {
  emoji: string;
  label: string;
}

interface Tab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface ChatsProps {
  onChatOpen?: (isOpen: boolean) => void;
}

function getTitleColor(title?: string): string {
  if (!title) return 'text-gray-600';
  if (title.startsWith('Prof.')) return 'text-purple-600';
  if (title.startsWith('Asstprof')) return 'text-blue-600';
  if (title.startsWith('Letr')) return 'text-teal-600';
  if (title.startsWith('T.A')) return 'text-green-600';
  if (title.startsWith('St.')) return 'text-orange-600';
  return 'text-gray-600';
}

const quickReactions: EmojiReaction[] = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🔥', label: 'Fire' },
];

const tabs: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'messages', label: '❤️👍😊رسايلي' },
  { id: 'university', label: '💪😈جامعة' },
  { id: 'work', label: 'شغلنا', count: 7 },
];

export function Chats({ onChatOpen }: ChatsProps) {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<{ messageId: number; x: number; y: number } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPinnedMessage, setShowPinnedMessage] = useState(true);
  const [showAICall, setShowAICall] = useState<'voice' | 'video' | null>(null);
  const [aiCallDuration, setAICallDuration] = useState(0);
  const [aiCallActive, setAICallActive] = useState(false);
  const { colors, theme } = useTheme();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Notify parent when chat is opened/closed
  useEffect(() => {
    onChatOpen?.(selectedChat !== null);
  }, [selectedChat, onChatOpen]);

  const chats: Chat[] = [
    {
      id: 0,
      name: 'المنقذ الجامعي',
      avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
      lastMessage: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      timestamp: 'Active',
      unread: 0,
      isOnline: true,
      isPinned: true,
      isAI: true,
      category: 'university',
      messageRead: true,
    },
    {
      id: 1,
      name: 'مكتبة || CVLAB4',
      avatar: 'https://images.unsplash.com/photo-1601655781320-205e34c94eb1?w=400',
      lastMessage: 'Bimaxilla "عنوان التقرير" #تقرير 🔗',
      timestamp: 'Fri',
      unread: 0,
      isOnline: false,
      isPinned: true,
      category: 'university',
      messageRead: true,
    },
    {
      id: 2,
      name: 'Mostafa Ayman',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      lastMessage: 'ان شاءالله تاخذ تجارب و يلفتكم ع الكروب',
      timestamp: 'Feb 11',
      unread: 0,
      isOnline: false,
      category: 'university',
      messageRead: true,
    },
    {
      id: 3,
      name: 'المنقذ الجامعي',
      title: 'DIRECT',
      avatar: 'https://images.unsplash.com/photo-1633381182794-01b10764b431?w=400',
      lastMessage: '⚡NOOR⚡⚡ 💜💜تبدلي كل الملا بيج',
      timestamp: 'Jan 05',
      unread: 0,
      isOnline: true,
      category: 'university',
      messageRead: true,
    },
    {
      id: 4,
      name: 'كروب المنقذ الجامعي',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
      lastMessage: 'Sti... :والدالزهراء موسى حميد الموسوى we',
      timestamp: 'Feb 11',
      unread: 0,
      isOnline: false,
      category: 'university',
      messageRead: false,
    },
    {
      id: 5,
      name: 'English Language Club',
      avatar: 'https://images.unsplash.com/photo-1570730866446-0569a02dd356?w=400',
      lastMessage: 'Maya: 🙈 Photo',
      timestamp: 'Feb 19',
      unread: 0,
      isOnline: false,
      category: 'university',
      messageRead: false,
    },
    {
      id: 6,
      name: 'Group University of Karb...',
      avatar: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400',
      lastMessage: 'حاتم: السلام عليكم ورحمة الله وبركاته',
      timestamp: '5:30 PM',
      unread: 852,
      isOnline: false,
      category: 'work',
      messageRead: false,
    },
  ];

  const pinnedMessage: PinnedMessage = {
    content: 'بلا اليوم 28/2 يوم 3/28 مفروض ايران ساقطة خن...',
    sender: 'Admin',
    timestamp: '10:30 AM'
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'other',
      content: 'ان شاءالله تاخذ تجارب و يلفتكم ع الكروب كل مجموعة اسم تجربتها',
      timestamp: '6:59',
      type: 'text',
    },
    {
      id: 2,
      sender: 'other',
      content: 'طبعا اذا باجر اكو طريق واذا اكو دوام',
      timestamp: '6:59',
      type: 'text',
    },
    {
      id: 3,
      sender: 'me',
      content: 'السلام عليكم دكتورة',
      timestamp: '5:28',
      status: 'read',
      type: 'text',
    },
    {
      id: 4,
      sender: 'me',
      content: 'تاخذ تجارب باجر',
      timestamp: '5:28',
      status: 'read',
      type: 'text',
    },
  ]);

  // Handle file attachments
  const handleFileAttachment = useCallback((type: string) => {
    setShowAttachMenu(false);
    
    let newMessage: Message;
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).slice(0, 5);
    
    switch(type) {
      case 'gallery':
        newMessage = {
          id: Date.now(),
          sender: 'me',
          type: 'image',
          fileUrl: 'https://images.unsplash.com/photo-1666281269793-da06484657e8?w=600',
          content: 'Photo',
          timestamp: currentTime,
          status: 'sent',
        };
        break;
      case 'file':
        newMessage = {
          id: Date.now(),
          sender: 'me',
          type: 'file',
          fileName: 'Document.pdf',
          fileSize: '2.4 MB',
          timestamp: currentTime,
          status: 'sent',
        };
        break;
      case 'music':
        newMessage = {
          id: Date.now(),
          sender: 'me',
          type: 'music',
          fileName: 'Song.mp3',
          duration: '3:45',
          timestamp: currentTime,
          status: 'sent',
        };
        break;
      case 'location':
        newMessage = {
          id: Date.now(),
          sender: 'me',
          type: 'location',
          content: 'Al-Nahrain University',
          timestamp: currentTime,
          status: 'sent',
        };
        break;
      case 'contact':
        newMessage = {
          id: Date.now(),
          sender: 'me',
          type: 'contact',
          content: 'Ahmed Hassan',
          timestamp: currentTime,
          status: 'sent',
        };
        break;
      default:
        return;
    }
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 500);
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 1500);
  }, []);

  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchive = showArchived ? chat.isArchived : !chat.isArchived;
      const matchesTab = activeTab === 'all' || chat.category === activeTab;
      return matchesSearch && matchesArchive && matchesTab;
    });
  }, [chats, searchQuery, showArchived, activeTab]);

  const pinnedChats = useMemo(() => filteredChats.filter(c => c.isPinned), [filteredChats]);
  const regularChats = useMemo(() => filteredChats.filter(c => !c.isPinned), [filteredChats]);

  const currentChat = useMemo(() => 
    selectedChat !== null ? chats.find(c => c.id === selectedChat) : null,
    [selectedChat]
  );

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSendMessage = useCallback(() => {
    if (messageInput.trim()) {
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).slice(0, 5);
      
      if (editingMessage) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === editingMessage.id
              ? { ...msg, content: messageInput, isEdited: true }
              : msg
          )
        );
        setEditingMessage(null);
      } else {
        const newMessage: Message = {
          id: Date.now(),
          sender: 'me',
          content: messageInput,
          timestamp: currentTime,
          status: 'sent',
          type: 'text',
          ...(replyingTo && {
            replyTo: {
              id: replyingTo.id,
              sender: replyingTo.sender === 'me' ? 'You' : currentChat?.name || 'User',
              content: replyingTo.content || 'File',
            },
          }),
        };
        setMessages(prev => [...prev, newMessage]);
        
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          ));
        }, 500);
        
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          ));
        }, 1500);
      }
      setMessageInput('');
      setReplyingTo(null);
    }
  }, [messageInput, editingMessage, replyingTo, currentChat]);

  const handleDeleteMessage = useCallback((messageId: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setShowContextMenu(null);
  }, []);

  const handleReplyMessage = useCallback((message: Message) => {
    setReplyingTo(message);
    setShowContextMenu(null);
  }, []);

  const handleEditMessage = useCallback((message: Message) => {
    setEditingMessage(message);
    setMessageInput(message.content || '');
    setShowContextMenu(null);
  }, []);

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingDuration(0);
  }, []);

  const handleStopRecording = useCallback(() => {
    setIsRecording(false);
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).slice(0, 5);
    const newMessage: Message = {
      id: Date.now(),
      sender: 'me',
      type: 'voice',
      duration: `${Math.floor(recordingDuration / 60)}:${String(recordingDuration % 60).padStart(2, '0')}`,
      timestamp: currentTime,
      status: 'sent',
    };
    setMessages(prev => [...prev, newMessage]);
    setRecordingDuration(0);
  }, [recordingDuration]);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }, []);

  const MessageBubble = useCallback(({ message, showAvatar }: { message: Message; showAvatar: boolean }) => {
    const isMe = message.sender === 'me';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`flex gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}
      >
        {!isMe && showAvatar && (
          <Avatar className="h-8 w-8 mt-auto flex-shrink-0">
            <AvatarImage src={currentChat?.avatar} />
            <AvatarFallback className="bg-gray-700 text-sm">{currentChat?.name[0]}</AvatarFallback>
          </Avatar>
        )}
        {!isMe && !showAvatar && <div className="w-8 flex-shrink-0" />}

        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
          {message.replyTo && (
            <div className={`text-xs px-3 py-1.5 rounded-t-lg border-l-2 w-full ${
                isMe ? 'bg-[#4A9EFF] border-blue-300' : 'bg-[#2B3942] border-gray-500'
              }`}>
              <p className={`font-medium ${isMe ? 'text-blue-100' : 'text-blue-400'}`}>
                {message.replyTo.sender}
              </p>
              <p className={`truncate ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                {message.replyTo.content}
              </p>
            </div>
          )}

          <div className={`rounded-xl px-3 py-2 relative shadow-sm ${
              message.replyTo ? 'rounded-tl-none' : ''
            } ${isMe ? 'bg-[#5288C1] text-white rounded-br-none' : 'bg-[#202B34] text-white rounded-bl-none'
            }`}>
            {message.type === 'text' && (
              <p className="text-[15px] break-words leading-relaxed">{message.content}</p>
            )}

            {message.type === 'voice' && (
              <div className="flex items-center gap-3 min-w-[200px]">
                <Button variant="ghost" size="icon" className={`rounded-full flex-shrink-0 h-9 w-9 ${isMe ? 'hover:bg-blue-600' : 'hover:bg-gray-700'}`}>
                  <Mic className="h-4 w-4" />
                </Button>
                <div className="flex-1 h-8 bg-white/20 rounded-full" />
                <span className="text-xs flex-shrink-0">{message.duration}</span>
              </div>
            )}

            {message.type === 'file' && (
              <div className="flex items-center gap-3 min-w-[220px]">
                <div className={`p-2.5 rounded-lg ${isMe ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <File className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{message.fileName}</p>
                  <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>{message.fileSize}</p>
                </div>
                <Button variant="ghost" size="icon" className={`flex-shrink-0 h-8 w-8 ${isMe ? 'hover:bg-blue-600' : 'hover:bg-gray-700'}`}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}

            {message.type === 'music' && (
              <div className="flex items-center gap-3 min-w-[220px]">
                <div className={`p-2.5 rounded-lg ${isMe ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <Music className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{message.fileName}</p>
                  <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>{message.duration}</p>
                </div>
                <Button variant="ghost" size="icon" className={`flex-shrink-0 h-8 w-8 ${isMe ? 'hover:bg-blue-600' : 'hover:bg-gray-700'}`}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}

            {message.type === 'image' && (
              <div>
                <div className="rounded-lg overflow-hidden cursor-pointer mb-1" onClick={() => setShowImagePreview(message.fileUrl || '')}>
                  <img src={message.fileUrl} alt="Shared" className="max-w-full h-auto" />
                </div>
                {message.content && <p className="text-sm mt-2">{message.content}</p>}
              </div>
            )}

            {message.type === 'location' && (
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className={`p-2.5 rounded-lg ${isMe ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.content || 'Location'}</p>
                  <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>Shared location</p>
                </div>
              </div>
            )}

            {message.type === 'contact' && (
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className={`p-2.5 rounded-lg ${isMe ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <Contact className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.content || 'Contact'}</p>
                  <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>Shared contact</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-1.5 mt-1">
              {message.isEdited && (
                <span className={`text-[11px] ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>edited</span>
              )}
              <span className={`text-[11px] ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>{message.timestamp}</span>
              {isMe && message.status && (
                <span className={message.status === 'read' ? 'text-blue-300' : 'text-blue-200'}>
                  {message.status === 'read' && <CheckCheck className="h-4 w-4" strokeWidth={2.5} />}
                  {message.status === 'delivered' && <CheckCheck className="h-4 w-4 opacity-70" strokeWidth={2.5} />}
                  {message.status === 'sent' && <Check className="h-4 w-4 opacity-70" strokeWidth={2.5} />}
                </span>
              )}
            </div>

            {message.reactions && message.reactions.length > 0 && (
              <div className="absolute -bottom-2 right-2 flex gap-1">
                {message.reactions.map((reaction, idx) => (
                  <div key={idx} className="bg-[#202B34] rounded-full px-1.5 py-0.5 shadow-md border border-gray-700 text-xs flex items-center gap-0.5">
                    <span>{reaction.emoji}</span>
                    <span className="text-gray-300">{reaction.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }, [currentChat]);

  // AI call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aiCallActive) {
      interval = setInterval(() => setAICallDuration(p => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [aiCallActive]);

  const formatCallTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#0E1621] text-white">
      {showEmojiPicker && <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(null)} />}
      {showAttachMenu && <div className="fixed inset-0 z-40" onClick={() => setShowAttachMenu(false)} />}

      {/* AI Call Overlay */}
      <AnimatePresence>
        {showAICall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col"
          >
            {showAICall === 'video' ? (
              /* Video Call with AI Avatar */
              <div className="flex-1 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
                {/* AI 3D Avatar Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Animated background circles */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`absolute rounded-full border border-blue-500/20 animate-ping`}
                        style={{ width: `${i * 120}px`, height: `${i * 120}px`, animationDelay: `${i * 0.3}s`, animationDuration: '3s' }} />
                    ))}
                  </div>

                  {/* AI Avatar - 3D style */}
                  <div className="relative">
                    <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-blue-400/60 shadow-2xl shadow-blue-500/40">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-1">🤖</div>
                          {/* Animated speaking indicator */}
                          {aiCallActive && (
                            <div className="flex gap-1 justify-center">
                              {[1,2,3,4,5].map(b => (
                                <div key={b} className="w-1 bg-white rounded-full animate-pulse"
                                  style={{ height: `${8 + Math.random() * 16}px`, animationDelay: `${b * 0.1}s` }} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Status ring */}
                    {aiCallActive && (
                      <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse opacity-60" />
                    )}
                  </div>

                  <div className="mt-6 text-center">
                    <h2 className="text-white text-xl font-bold mb-1">المنقذ الجامعي AI</h2>
                    <p className="text-blue-300 text-sm">
                      {!aiCallActive ? 'جاري الاتصال...' : `${formatCallTime(aiCallDuration)} • متصل`}
                    </p>
                    {!aiCallActive && (
                      <p className="text-blue-400/60 text-xs mt-1">يتم تحضير الذكاء الاصطناعي...</p>
                    )}
                  </div>

                  {/* Note about 3D */}
                  {!aiCallActive && (
                    <div className="mt-4 mx-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-4 py-3">
                      <p className="text-blue-300 text-xs text-center">
                        📋 ملاحظة: الشخصية ثلاثية الأبعاد تتطلب Three.js — الملفات جاهزة للتكامل مع نظام المحادثة
                      </p>
                    </div>
                  )}
                </div>

                {/* Self preview */}
                <div className="absolute top-16 right-4 w-20 h-28 bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-600 shadow-xl">
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <span className="text-2xl">🧑‍💻</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="px-6 pb-10 pt-4 bg-black/40 backdrop-blur-xl">
                  <div className="flex items-center justify-center gap-6">
                    <button className="w-14 h-14 bg-gray-700/80 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-all">
                      <Mic className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => { if (!aiCallActive) { setAICallActive(true); } else { setShowAICall(null); setAICallActive(false); setAICallDuration(0); } }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${
                        aiCallActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {aiCallActive ? <Phone className="h-7 w-7 rotate-[135deg]" /> : <Phone className="h-7 w-7" />}
                    </button>
                    <button className="w-14 h-14 bg-gray-700/80 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-all">
                      <Camera className="h-6 w-6" />
                    </button>
                  </div>
                  {aiCallActive && (
                    <p className="text-center text-blue-300 text-xs mt-3">اسأل أي سؤال أكاديمي — الذكاء الاصطناعي يشرح لك</p>
                  )}
                </div>
              </div>
            ) : (
              /* Voice Call */
              <div className="flex-1 bg-gradient-to-br from-slate-800 via-slate-900 to-black flex flex-col items-center justify-center">
                {/* Sound waves */}
                <div className="relative flex items-center justify-center mb-8">
                  {aiCallActive && [1,2,3].map(i => (
                    <div key={i} className="absolute rounded-full border-2 border-blue-400/30 animate-ping"
                      style={{ width: `${i * 100 + 80}px`, height: `${i * 100 + 80}px`, animationDelay: `${i * 0.4}s`, animationDuration: '2.5s' }} />
                  ))}
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 z-10">
                    <span className="text-5xl">🤖</span>
                  </div>
                </div>

                <h2 className="text-white text-2xl font-bold mb-2">المنقذ الجامعي AI</h2>
                <p className="text-slate-400 text-sm mb-1">
                  {!aiCallActive ? 'جاري الاتصال...' : `${formatCallTime(aiCallDuration)} • مكالمة صوتية`}
                </p>

                {/* Animated voice bars when active */}
                {aiCallActive && (
                  <div className="flex gap-1 items-end h-8 mt-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-1.5 bg-blue-400 rounded-full animate-pulse"
                        style={{ height: `${Math.random() * 28 + 4}px`, animationDelay: `${i * 0.08}s` }} />
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-8 mt-12">
                  <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-white">
                    <Mic className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => { if (!aiCallActive) { setAICallActive(true); } else { setShowAICall(null); setAICallActive(false); setAICallDuration(0); } }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg ${
                      aiCallActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    } transition-all`}
                  >
                    <Phone className={`h-7 w-7 ${aiCallActive ? 'rotate-[135deg]' : ''}`} />
                  </button>
                  <button onClick={() => { setShowAICall('video'); }}
                    className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <Video className="h-6 w-6" />
                  </button>
                </div>

                <button onClick={() => { setShowAICall(null); setAICallActive(false); setAICallDuration(0); }}
                  className="mt-6 text-slate-500 hover:text-slate-400 text-sm transition-colors">
                  إلغاء
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImagePreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowImagePreview(null)}>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setShowImagePreview(null)}>
              <X className="h-6 w-6" />
            </Button>
            <img src={showImagePreview} alt="Preview" className="max-w-full max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {selectedChat === null ? (
        <>
          <header className="bg-[#17212B] px-4 py-3 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-semibold">Chats</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-gray-300"
                  onClick={() => setShowArchived(!showArchived)}>
                  <Archive className={`h-5 w-5 ${showArchived ? 'text-blue-400' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-gray-300">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input type="text" placeholder="Search conversations..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-[#0E1621] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-[#242F3D] text-gray-300 hover:bg-gray-700'
                  }`}>
                  {tab.label}
                  {tab.count && <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">{tab.count}</span>}
                </button>
              ))}
            </div>
          </header>

          <ScrollArea className="h-[calc(100vh-200px)]">
            {pinnedChats.length > 0 && !showArchived && (
              <div className="divide-y divide-gray-800">
                {pinnedChats.map((chat) => (
                  <ChatListItem key={chat.id} chat={chat} onClick={() => setSelectedChat(chat.id)} />
                ))}
              </div>
            )}

            {regularChats.length > 0 && (
              <div className="divide-y divide-gray-800">
                {regularChats.map((chat) => (
                  <ChatListItem key={chat.id} chat={chat} onClick={() => setSelectedChat(chat.id)} />
                ))}
              </div>
            )}

            {filteredChats.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No conversations found</p>
              </div>
            )}
          </ScrollArea>
        </>
      ) : (
        <div className="flex flex-col h-screen fixed inset-0 bg-[#0E1621]">
          <header className="bg-[#17212B] px-4 py-3 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-white flex-shrink-0"
                  onClick={() => { setSelectedChat(null); setReplyingTo(null); setEditingMessage(null); setMessageInput(''); }}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentChat?.avatar} />
                    <AvatarFallback className="bg-gray-700">{currentChat?.name[0]}</AvatarFallback>
                  </Avatar>
                  {currentChat?.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-[#17212B] rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium truncate text-white">{currentChat?.name}</h2>
                  <p className="text-xs text-gray-400">
                    {currentChat?.isTyping ? (
                      <span className="flex items-center gap-1">
                        <span>typing</span>
                        <span className="flex gap-0.5">
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce delay-100" />
                          <span className="w-1 h-1 bg-current rounded-full animate-bounce delay-200" />
                        </span>
                      </span>
                    ) : currentChat?.isOnline ? 'last seen recently' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {currentChat?.isAI ? (
                  <>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-blue-400" onClick={() => setShowAICall('voice')}>
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-blue-400" onClick={() => setShowAICall('video')}>
                      <Video className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-white"><Phone className="h-5 w-5" /></Button>
                )}
                <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-white"><MoreVertical className="h-5 w-5" /></Button>
              </div>
            </div>
          </header>

          <AnimatePresence>
            {showPinnedMessage && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="bg-[#1C2733] border-b border-gray-800 px-4 py-2.5 flex items-start gap-3 flex-shrink-0">
                <Pin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-blue-400 font-medium mb-0.5">Pinned Message</p>
                  <p className="text-sm text-gray-300 line-clamp-2">{pinnedMessage.content}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-700 flex-shrink-0"
                  onClick={() => setShowPinnedMessage(false)}><X className="h-3 w-3" /></Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesContainerRef} className="flex-1 bg-[#0E1621] px-4 py-3 overflow-y-auto"
            style={{ scrollBehavior: 'smooth', overscrollBehavior: 'contain' }}>
            <div className="flex items-center justify-center my-3">
              <div className="bg-[#17212B] px-3 py-1 rounded-full shadow-sm">
                <span className="text-xs text-gray-400">Today</span>
              </div>
            </div>

            {messages.map((message, idx) => {
              const prevMessage = messages[idx - 1];
              const showAvatar = !prevMessage || prevMessage.sender !== message.sender;
              return <MessageBubble key={message.id} message={message} showAvatar={showAvatar} />;
            })}
            <div ref={messagesEndRef} />
          </div>

          <AnimatePresence>
            {replyingTo && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }} className="bg-[#1C2733] border-t border-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Reply className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-400">
                      Replying to {replyingTo.sender === 'me' ? 'yourself' : currentChat?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{replyingTo.content || 'File'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 hover:bg-gray-700"
                  onClick={() => setReplyingTo(null)}><X className="h-4 w-4" /></Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-[#17212B] border-t border-gray-800 px-3 py-2.5 flex-shrink-0 safe-area-inset-bottom">
            {isRecording ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 flex-shrink-0"
                  onClick={() => { setIsRecording(false); setRecordingDuration(0); }}><X className="h-5 w-5" /></Button>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                  <span className="text-sm font-medium flex-shrink-0">{formatDuration(recordingDuration)}</span>
                  <div className="flex-1 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 min-w-0" />
                </div>
                <Button onClick={handleStopRecording} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full flex-shrink-0">
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-[#242F3D] rounded-full px-3 py-2.5 min-w-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-700 flex-shrink-0"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}><Plus className="h-5 w-5 text-gray-400" /></Button>
                  <input type="text" placeholder="Message" value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-transparent text-[15px] outline-none text-white placeholder-gray-500 min-w-0" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-700 flex-shrink-0">
                    <Smile className="h-5 w-5 text-gray-400" />
                  </Button>
                </div>
                
                {messageInput.trim() ? (
                  <Button onClick={handleSendMessage} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full flex-shrink-0 w-10 h-10">
                    <Send className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="hover:bg-gray-700 flex-shrink-0 text-gray-400 w-10 h-10 rounded-full"
                    onClick={handleStartRecording}><Mic className="h-4 w-4" /></Button>
                )}
              </div>
            )}

            <AnimatePresence>
              {showAttachMenu && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute bottom-20 left-4 right-4 bg-[#242F3D] rounded-2xl p-4 shadow-2xl z-50 border border-gray-700">
                  <div className="grid grid-cols-5 gap-3">
                    <button onClick={() => handleFileAttachment('gallery')}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-all active:scale-95">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <ImageIcon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium">Gallery</span>
                    </button>
                    
                    <button onClick={() => handleFileAttachment('file')}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-all active:scale-95">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium">File</span>
                    </button>
                    
                    <button onClick={() => handleFileAttachment('location')}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-all active:scale-95">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium">Location</span>
                    </button>
                    
                    <button onClick={() => handleFileAttachment('music')}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-all active:scale-95">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                        <Music className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium">Music</span>
                    </button>
                    
                    <button onClick={() => handleFileAttachment('contact')}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-all active:scale-95">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                        <Contact className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium">Contact</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatListItem({ chat, onClick }: { chat: Chat; onClick: () => void }) {
  return (
    <motion.div whileTap={{ scale: 0.98 }} onClick={onClick}
      className="px-4 py-3 cursor-pointer transition-colors hover:bg-[#17212B] active:bg-[#1C2733]">
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="h-14 w-14">
            <AvatarImage src={chat.avatar} />
            <AvatarFallback className="bg-gray-700">{chat.name[0]}</AvatarFallback>
          </Avatar>
          {chat.isPinned && (
            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
              <Pin className="h-3 w-3 text-white" />
            </div>
          )}
          {chat.isOnline && <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-[#0E1621] rounded-full" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate text-white">{chat.name}</h3>
              {chat.isMuted && <VolumeX className="h-3 w-3 text-gray-500 flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {chat.messageRead && <CheckCheck className="h-4 w-4 text-blue-400" strokeWidth={2.5} />}
              <span className="text-xs text-gray-500">{chat.timestamp}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm truncate text-gray-400">
              {chat.isTyping ? (
                <span className="text-blue-400 italic flex items-center gap-1">
                  <span>typing</span>
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-current rounded-full animate-bounce delay-100" />
                    <span className="w-1 h-1 bg-current rounded-full animate-bounce delay-200" />
                  </span>
                </span>
              ) : chat.lastMessage}
            </p>
            {chat.unread > 0 && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white h-5 px-2 ml-2 flex-shrink-0 text-xs font-semibold">
                {chat.unread > 999 ? '999+' : chat.unread}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Chats;