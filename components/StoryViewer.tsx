import { ChevronLeft, ChevronRight, Heart, Send, Share2, Smile, X, BarChart3, User, Trash2, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';

function getTitleColor(prefix?: string): string {
  switch (prefix) {
    case 'Prof.':
      return 'text-purple-600';
    case 'Asstprof':
    case 'Asstprof.':
      return 'text-blue-600';
    case 'Letr':
    case 'Letr.':
      return 'text-teal-600';
    case 'T.A':
    case 'T.A.':
      return 'text-green-600';
    case 'St.':
      return 'text-orange-600';
    default:
      return 'text-gray-900';
  }
}

interface Story {
  id: number;
  name: string;
  avatar: string;
  prefix?: string;
  image: string;
  timestamp: string;
}

interface StoryViewerProps {
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isOwnStory?: boolean;
}

export function StoryViewer({ stories, currentIndex, onClose, onNext, onPrev, isOwnStory = false }: StoryViewerProps) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [insightsTab, setInsightsTab] = useState<'views' | 'viewers'>('views');
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showShareToFriend, setShowShareToFriend] = useState(false);
  const story = stories[currentIndex];
  const progressRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const swipeStartYRef = useRef<number>(0);
  const isSwiping = useRef(false);

  // Quick emoji reactions (Instagram-style)
  const quickEmojis = ['❤️', '😂', '😮', '😢', '👏', '🔥', '🎉', '💯'];

  // Mock data for story insights
  const storyViews = 2345;
  const storyViewers = [
    { id: 1, name: 'Ahmed Ali', avatar: 'https://i.pravatar.cc/150?img=1', prefix: 'St.', timestamp: '2h ago' },
    { id: 2, name: 'Sara Hassan', avatar: 'https://i.pravatar.cc/150?img=5', prefix: 'T.A.', timestamp: '3h ago' },
    { id: 3, name: 'Omar Khalid', avatar: 'https://i.pravatar.cc/150?img=3', prefix: 'St.', timestamp: '4h ago' },
    { id: 4, name: 'Fatima Noor', avatar: 'https://i.pravatar.cc/150?img=9', prefix: 'St.', timestamp: '5h ago' },
    { id: 5, name: 'Youssef Ahmed', avatar: 'https://i.pravatar.cc/150?img=12', prefix: 'Letr.', timestamp: '6h ago' },
  ];

  // Mock friends list for sharing
  const friendsList = [
    { id: 1, name: 'Ahmed Ali', avatar: 'https://i.pravatar.cc/150?img=1', prefix: 'St.', username: 'ahmed_ali' },
    { id: 2, name: 'Sara Hassan', avatar: 'https://i.pravatar.cc/150?img=5', prefix: 'T.A.', username: 'sara_hassan' },
    { id: 3, name: 'Omar Khalid', avatar: 'https://i.pravatar.cc/150?img=3', prefix: 'St.', username: 'omar_khalid' },
    { id: 4, name: 'Fatima Noor', avatar: 'https://i.pravatar.cc/150?img=9', prefix: 'St.', username: 'fatima_noor' },
    { id: 5, name: 'Youssef Ahmed', avatar: 'https://i.pravatar.cc/150?img=12', prefix: 'Letr.', username: 'youssef_ahmed' },
    { id: 6, name: 'Layla Ibrahim', avatar: 'https://i.pravatar.cc/150?img=10', prefix: 'St.', username: 'layla_ibrahim' },
    { id: 7, name: 'Hassan Mohammed', avatar: 'https://i.pravatar.cc/150?img=8', prefix: 'Prof.', username: 'hassan_mohammed' },
    { id: 8, name: 'Zahra Ali', avatar: 'https://i.pravatar.cc/150?img=20', prefix: 'T.A.', username: 'zahra_ali' },
  ];

  const storyLikes = [
    { id: 1, name: 'Ahmed Ali', avatar: 'https://i.pravatar.cc/150?img=1', prefix: 'St.', reaction: '❤️' },
    { id: 2, name: 'Sara Hassan', avatar: 'https://i.pravatar.cc/150?img=5', prefix: 'T.A.', reaction: '😂' },
    { id: 3, name: 'Omar Khalid', avatar: 'https://i.pravatar.cc/150?img=3', prefix: 'St.', reaction: '🔥' },
  ];

  // Handle share actions
  const handleCopyLink = () => {
    const storyUrl = `https://alnahrain-campus.app/story/${story.id}`;
    navigator.clipboard.writeText(storyUrl);
    toast.success('Link copied to clipboard!');
    setShowShareSheet(false);
  };

  const handleShareToFriend = (friendId: number, friendName: string) => {
    toast.success(`Story shared to ${friendName}!`);
    setShowShareToFriend(false);
    setShowShareSheet(false);
  };

  const handleShareExternal = (platform: string) => {
    const storyUrl = `https://alnahrain-campus.app/story/${story.id}`;
    const text = `Check out this story from ${story.name}!`;
    
    let shareUrl = '';
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + storyUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(storyUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(storyUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      setShowShareSheet(false);
    }
  };

  useEffect(() => {
    setProgress(0);
    progressRef.current = 0;
    
    const startProgress = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        if (!isPaused && !isTyping && !showInsights && !showShareSheet && !showShareToFriend) {
          progressRef.current += 2;
          setProgress(progressRef.current);
          
          if (progressRef.current >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            
            setTimeout(() => {
              if (currentIndex < stories.length - 1) {
                onNext();
              } else {
                onClose();
              }
            }, 0);
          }
        }
      }, 100);
    };

    startProgress();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, stories.length, onNext, onClose, isPaused, isTyping, showInsights, showShareSheet, showShareToFriend]);

  // Handle tap to advance
  const handleTapAdvance = (e: React.MouseEvent | React.TouchEvent, side: 'left' | 'right') => {
    e.stopPropagation();
    if (side === 'left' && currentIndex > 0) {
      onPrev();
    } else if (side === 'right' && currentIndex < stories.length - 1) {
      onNext();
    } else if (side === 'right' && currentIndex === stories.length - 1) {
      onClose();
    }
  };

  // Handle hold to pause
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = Date.now();
    touchStartYRef.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartRef.current;
    setIsPaused(false);
    
    // If it was a quick tap (less than 200ms), don't do anything
    // The click handler will handle advancing
    if (touchDuration < 200) return;

    // If the swipe is vertical, don't handle it
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartYRef.current;
    if (Math.abs(deltaY) > 50) return;
  };

  const handleMouseDown = () => {
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsPaused(false);
  };

  const handleQuickEmoji = (emoji: string) => {
    // Show notification for story owner
    if (emoji === '❤️') {
      toast.success('Ali liked your story', {
        duration: 2000,
        position: 'top-center',
      });
    } else {
      toast.success(`Ali interacted with your story by ${emoji}`, {
        duration: 2000,
        position: 'top-center',
      });
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      // Show notification for story owner
      toast.success(`Ali replied to your story: "${replyText}"`, {
        duration: 3000,
        position: 'top-center',
      });
      setReplyText('');
      setIsTyping(false);
    }
  };

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black max-w-[768px] mx-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-40">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 pt-2 z-40">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={story.avatar} />
            <AvatarFallback>{story.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              {story.prefix && <span className="text-xs text-white">{story.prefix}</span>}
              <span className="text-sm text-white font-medium">{story.name}</span>
            </div>
            <span className="text-xs text-white/80">{story.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Story Image */}
      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
        <img
          src={story.image}
          alt={story.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300"
          key={story.id}
        />
      </div>

      {/* Tap zones for navigation with hold to pause and swipe up detection */}
      {isOwnStory ? (
        /* For own story - add swipe up detection */
        <div 
          className="absolute inset-0 flex z-30"
          onTouchStart={(e) => {
            swipeStartYRef.current = e.touches[0].clientY;
            isSwiping.current = false;
          }}
          onTouchMove={(e) => {
            const deltaY = swipeStartYRef.current - e.touches[0].clientY;
            if (deltaY > 30) {
              isSwiping.current = true;
            }
          }}
          onTouchEnd={(e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = swipeStartYRef.current - touchEndY;
            
            // If swiped up more than 80px, show insights
            if (deltaY > 80 && isSwiping.current) {
              setShowInsights(true);
              isSwiping.current = false;
              return;
            }
            
            isSwiping.current = false;
          }}
        >
          {/* Left side - Previous */}
          <div
            className="flex-1 cursor-pointer"
            onClick={(e) => handleTapAdvance(e, 'left')}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          {/* Right side - Next */}
          <div
            className="flex-1 cursor-pointer"
            onClick={(e) => handleTapAdvance(e, 'right')}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      ) : (
        /* For others' stories - regular tap zones */
        <div className="absolute inset-0 flex z-30">
          {/* Left side - Previous */}
          <div
            className="flex-1 cursor-pointer"
            onClick={(e) => handleTapAdvance(e, 'left')}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          {/* Right side - Next */}
          <div
            className="flex-1 cursor-pointer"
            onClick={(e) => handleTapAdvance(e, 'right')}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      )}

      {/* Bottom Actions or Swipe Up Indicator */}
      {!isOwnStory ? (
        <div className="absolute bottom-4 left-0 right-0 p-4 z-40 pointer-events-none">
          {/* Quick Emoji Reactions */}
          {showEmojiPicker && (
            <div className="mb-3 flex gap-2 justify-center bg-black/50 backdrop-blur-sm rounded-full px-4 py-3 animate-in slide-in-from-bottom duration-200 pointer-events-auto">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickEmoji(emoji);
                  }}
                  className="text-2xl hover:scale-125 transition-transform active:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Reply Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                onClick={(e) => e.stopPropagation()}
                placeholder={`Reply to ${story.name}...`}
                className="w-full bg-transparent border border-white/50 rounded-full pl-4 pr-20 py-2.5 text-white placeholder-white/70 outline-none focus:border-white transition-colors"
              />
              
              {/* Right side buttons inside input */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Emoji button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojiPicker(!showEmojiPicker);
                  }}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <Smile className="h-5 w-5" />
                </button>
                
                {/* Send button - only show when typing */}
                {replyText.trim() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendReply();
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickEmoji('❤️');
              }}
              className="bg-transparent border border-white/50 hover:bg-white/20 rounded-full p-2.5 transition-colors group"
            >
              <Heart className="h-5 w-5 text-white group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
            </button>

            {/* Share Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareSheet(true);
              }}
              className="bg-transparent border border-white/50 hover:bg-white/20 rounded-full p-2.5 transition-colors"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-auto cursor-pointer"
          onClick={() => setShowInsights(true)}
        >
          <div className="flex flex-col items-center gap-1 text-white/80">
            <div className="animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs">Swipe up</span>
          </div>
        </div>
      )}

      {/* Story Insights Bottom Sheet */}
      {isOwnStory && showInsights && (
        <div 
          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowInsights(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-white/30 rounded-full"></div>
            </div>

            {/* View count */}
            <div className="px-6 pb-4">
              <div className="text-white/60 text-sm">{storyViews.toLocaleString()} views</div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setInsightsTab('views')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
                  insightsTab === 'views' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-white/60'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setInsightsTab('viewers')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
                  insightsTab === 'viewers' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-white/60'
                }`}
              >
                <User className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this story?')) {
                    toast.success('Story deleted');
                    onClose();
                  }
                }}
                className="absolute top-4 right-4 text-white/60 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[50vh]">
              {insightsTab === 'viewers' ? (
                <div className="divide-y divide-white/10">
                  {storyViewers.map((viewer) => (
                    <div key={viewer.id} className="flex items-center gap-3 px-6 py-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={viewer.avatar} />
                        <AvatarFallback>{viewer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          {viewer.prefix && <span className="text-xs text-white/60">{viewer.prefix}</span>}
                          <span className="text-sm text-white">{viewer.name}</span>
                        </div>
                        <span className="text-xs text-white/50">{viewer.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Boost Story Option */}
                  <button 
                    onClick={() => toast.info('Boost story feature coming soon')}
                    className="flex items-center justify-between w-full px-6 py-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white">Boost this story</span>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Likes List */}
                  <div className="mt-4 px-6">
                    <div className="text-white/60 text-sm mb-3">Recent interactions</div>
                    <div className="divide-y divide-white/10">
                      {storyLikes.map((like) => (
                        <div key={like.id} className="flex items-center gap-3 py-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={like.avatar} />
                            <AvatarFallback>{like.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              {like.prefix && <span className="text-xs text-white/60">{like.prefix}</span>}
                              <span className="text-sm text-white">{like.name}</span>
                            </div>
                          </div>
                          <span className="text-2xl">{like.reaction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Sheet */}
      {showShareSheet && (
        <div 
          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowShareSheet(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-white/30 rounded-full"></div>
            </div>

            {/* Title */}
            <div className="px-6 pb-4">
              <h3 className="text-white text-xl font-semibold">Share story</h3>
            </div>

            {/* Share to friend */}
            <button
              onClick={() => {
                setShowShareToFriend(true);
                setShowShareSheet(false);
              }}
              className="w-full px-6 py-4 hover:bg-white/5 transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <div className="text-white font-medium">Send to friend</div>
                <div className="text-white/50 text-sm">Share with people on Al-Nahrain Campus</div>
              </div>
            </button>

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="w-full px-6 py-4 hover:bg-white/5 transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60707C11.7642 9.26331 11.0684 9.05888 10.3533 9.00768C9.63816 8.95648 8.92037 9.05965 8.24861 9.31023C7.57685 9.5608 6.96684 9.95303 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3961 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <div className="text-white font-medium">Copy link</div>
                <div className="text-white/50 text-sm">Copy story link to clipboard</div>
              </div>
            </button>

            {/* External sharing options */}
            <div className="px-6 py-4">
              <h4 className="text-white/60 text-sm font-medium mb-3">Share to other apps</h4>
              <div className="flex gap-4">
                <button
                  onClick={() => handleShareExternal('whatsapp')}
                  className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <span className="text-white text-xs">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShareExternal('telegram')}
                  className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-[#0088cc] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <span className="text-white text-xs">Telegram</span>
                </button>

                <button
                  onClick={() => handleShareExternal('facebook')}
                  className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-white text-xs">Facebook</span>
                </button>

                <button
                  onClick={() => handleShareExternal('twitter')}
                  className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                  <span className="text-white text-xs">Twitter</span>
                </button>
              </div>
            </div>

            {/* Cancel button */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => setShowShareSheet(false)}
                className="w-full py-3 text-white font-medium hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share to Friend Sheet */}
      {showShareToFriend && (
        <div 
          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowShareToFriend(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-white/30 rounded-full"></div>
            </div>

            {/* Title */}
            <div className="px-6 pb-4">
              <h3 className="text-white text-xl font-semibold">Send to</h3>
            </div>

            {/* Search */}
            <div className="px-6 pb-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl outline-none focus:bg-white/15 transition-colors"
              />
            </div>

            {/* Friends list */}
            <div className="overflow-y-auto max-h-[50vh]">
              {friendsList.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleShareToFriend(friend.id, friend.name)}
                  className="w-full px-6 py-3 hover:bg-white/5 transition-colors flex items-center gap-3"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-left flex-1">
                    <div className="text-white font-medium">
                      {friend.prefix && (
                        <span className={getTitleColor(friend.prefix)}>{friend.prefix} </span>
                      )}
                      {friend.name}
                    </div>
                    <div className="text-white/50 text-sm">@{friend.username}</div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white/50"></div>
                </button>
              ))}
            </div>

            {/* Cancel button */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => setShowShareToFriend(false)}
                className="w-full py-3 text-white font-medium hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Removed pause indicator - just pause silently */}
    </div>
  );
}