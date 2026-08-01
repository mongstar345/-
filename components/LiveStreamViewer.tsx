import { Heart, Send, Users, MoreVertical, Share2, Maximize, Minimize } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { ShareDialog } from './ShareDialog';
import { toast } from 'sonner';

interface Author {
  name: string;
  title?: string;
  avatar: string;
}

interface LiveStreamViewerProps {
  isOpen: boolean;
  onClose: () => void;
  streamAuthor: Author;
  streamTitle: string;
  viewerCount: number;
  thumbnail: string;
}

interface ChatMessage {
  id: number;
  author: Author;
  message: string;
  timestamp: string;
}

const getTitleColor = (title: string) => {
  switch (title) {
    case 'Prof.': return 'text-purple-600';
    case 'Asstprof.': return 'text-blue-600';
    case 'Letr.': return 'text-teal-600';
    case 'T.A.': return 'text-green-600';
    case 'St.': return 'text-orange-600';
    default: return 'text-gray-600';
  }
};

const mockMessages: ChatMessage[] = [
  {
    id: 1,
    author: { name: 'Ahmed Hassan', title: 'St.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    message: 'Great lecture! Thank you professor!',
    timestamp: '2m ago'
  },
  {
    id: 2,
    author: { name: 'Sara Ali', title: 'St.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    message: 'Can you explain the last part again?',
    timestamp: '1m ago'
  },
  {
    id: 3,
    author: { name: 'Mohammed Fadhil', title: 'T.A.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    message: 'I will share the slides after this session',
    timestamp: '1m ago'
  },
  {
    id: 4,
    author: { name: 'Layla Ibrahim', title: 'St.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    message: 'This is very helpful! 👍',
    timestamp: '30s ago'
  },
];

export function LiveStreamViewer({ 
  isOpen, 
  onClose, 
  streamAuthor, 
  streamTitle, 
  viewerCount,
  thumbnail 
}: LiveStreamViewerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [currentViewers, setCurrentViewers] = useState(viewerCount);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulate real-time messages
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const randomMessages = [
        'Excellent explanation!',
        'Can we have more examples?',
        'Thank you for this session',
        'Very interesting topic',
        'Looking forward to the next lecture',
        'Could you repeat that please?',
        'Great content as always! 🎓',
        'This helped me understand better',
      ];

      const names = [
        { name: 'Zainab Ali', title: 'St.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        { name: 'Omar Khalid', title: 'St.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
        { name: 'Fatima Ahmed', title: 'St.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
        { name: 'Ali Hassan', title: 'St.', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100' },
      ];

      const randomAuthor = names[Math.floor(Math.random() * names.length)];
      const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];

      const newMsg: ChatMessage = {
        id: Date.now(),
        author: randomAuthor,
        message: randomMsg,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, newMsg]);
      setCurrentViewers(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const msg: ChatMessage = {
        id: Date.now(),
        author: {
          name: 'You',
          title: 'St.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        },
        message: newMessage,
        timestamp: 'Just now'
      };
      setMessages([...messages, msg]);
      setNewMessage('');
    }
  };

  if (!isOpen) return null;

  // Default YouTube-style layout - Small video with visible chat
  return (
    <div className="fixed inset-0 bg-white z-[70] flex flex-col max-w-[768px] mx-auto">
      {/* Compact Header */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="w-8"></div>
          <span className="text-sm font-semibold">Live Stream</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content - Video and Chat visible together */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Small Video Player - Only 35% height */}
        {!isFullscreen ? (
          <>
            <div className="bg-black relative h-[35vh]">
              <img 
                src={thumbnail} 
                alt="Live stream" 
                className="w-full h-full object-cover"
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none">
                {/* Top Left - LIVE badge */}
                <div className="absolute top-2 left-2 pointer-events-auto">
                  <div className="bg-red-600 px-2 py-0.5 rounded text-white text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </div>
                </div>
                
                {/* Top Right - Viewers count */}
                <div className="absolute top-2 right-2 pointer-events-auto">
                  <div className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-white text-xs flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {currentViewers.toLocaleString()}
                  </div>
                </div>
                
                {/* Bottom Right - Fullscreen button */}
                <div className="absolute bottom-2 right-2 pointer-events-auto">
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="bg-black/70 backdrop-blur-sm rounded p-1.5 text-white hover:bg-black/90 transition-colors"
                  >
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Info Section - Compact */}
            <div className="bg-white px-3 py-2 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={streamAuthor.avatar} />
                    <AvatarFallback>{streamAuthor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      {streamAuthor.title && (
                        <span className={`text-xs font-semibold ${getTitleColor(streamAuthor.title)}`}>
                          {streamAuthor.title}
                        </span>
                      )}
                      <span className="text-xs font-semibold truncate">
                        {streamAuthor.name}
                      </span>
                    </div>
                    <h3 className="text-xs text-gray-600 truncate">{streamTitle}</h3>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button 
                    onClick={() => setShowShareDialog(true)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Fullscreen Mode - 16:9 video only, no comments */
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="w-full" style={{ aspectRatio: '16/9' }}>
              <img 
                src={thumbnail} 
                alt="Live stream" 
                className="w-full h-full object-cover"
              />
              
              {/* Fullscreen Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/50">
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsFullscreen(false)} 
                      className="bg-black/60 backdrop-blur-sm rounded p-1.5 text-white hover:bg-black/80"
                    >
                      <Minimize className="h-5 w-5" />
                    </button>
                    <div className="bg-red-600 px-2.5 py-1 rounded text-white text-xs font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </div>
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-white text-xs flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {currentViewers.toLocaleString()} watching
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white text-base font-semibold mb-2">{streamTitle}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-9 w-9 border-2 border-white">
                        <AvatarImage src={streamAuthor.avatar} />
                        <AvatarFallback>{streamAuthor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          {streamAuthor.title && (
                            <span className={`text-xs font-semibold ${getTitleColor(streamAuthor.title)}`}>
                              {streamAuthor.title}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-white">
                            {streamAuthor.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsLiked(!isLiked)}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white"
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                      <button 
                        onClick={() => setShowShareDialog(true)}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Chat Section - Only visible when NOT fullscreen */}
        {!isFullscreen && (
          <div className="flex-1 bg-white flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="px-3 py-2 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-semibold">Live Chat</span>
                  <span className="text-xs text-gray-500">({messages.length})</span>
                </div>
                <button className="text-xs text-blue-600 font-semibold">Top chat</button>
              </div>
            </div>

            {/* Messages List - Takes remaining 65% of screen */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5 bg-white">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2 text-sm hover:bg-gray-50 p-1.5 rounded transition-colors">
                  <Avatar className="h-6 w-6 flex-shrink-0 mt-0.5">
                    <AvatarImage src={msg.author.avatar} />
                    <AvatarFallback>{msg.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap mb-0.5">
                      {msg.author.title && (
                        <span className={`text-xs font-semibold ${getTitleColor(msg.author.title)}`}>
                          {msg.author.title}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-gray-900">
                        {msg.author.name}
                      </span>
                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-800 break-words leading-snug">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="border-t px-3 py-2.5 bg-white">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Say something..."
                  className="flex-1 text-sm outline-none bg-gray-100 rounded-full px-4 py-2 placeholder:text-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="text-blue-600 disabled:text-gray-400 p-1.5 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <ShareDialog 
        isOpen={showShareDialog} 
        onClose={() => setShowShareDialog(false)} 
        postId={999}
        isLive={true}
        liveTitle={streamTitle}
      />
    </div>
  );
}