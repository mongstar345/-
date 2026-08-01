import { Heart, MessageCircle, Send, Bookmark, Volume2, VolumeX, MoreVertical, Music, Play, Pause } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { ShareDialog } from './ShareDialog';
import { CommentsModal } from './CommentsModal';

interface Author {
  name: string;
  avatar: string;
  title?: string;
}

interface Reel {
  id: number;
  author: Author;
  caption: string;
  thumbnail: string;
  views: string;
  likes: number;
  comments: number;
  initialComments?: any[];
}

interface ReelsViewerProps {
  isOpen: boolean;
  onClose: () => void;
  reels: Reel[];
  initialReelIndex: number;
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

export function ReelsViewer({ isOpen, onClose, reels, initialReelIndex }: ReelsViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialReelIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<{ [key: number]: boolean }>({});
  const [bookmarkedReels, setBookmarkedReels] = useState<{ [key: number]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsList, setCommentsList] = useState<{ [key: number]: any[] }>({});
  const [expandedCaptions, setExpandedCaptions] = useState<{ [key: number]: boolean }>({});
  const [pausedReels, setPausedReels] = useState<{ [key: number]: boolean }>({});
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [likeAnimationPosition, setLikeAnimationPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    if (!isOpen) return;
    
    // Initialize likes count for all reels
    const initialLikeCounts: { [key: number]: number } = {};
    const initialComments: { [key: number]: any[] } = {};
    reels.forEach(reel => {
      initialLikeCounts[reel.id] = reel.likes;
      initialComments[reel.id] = reel.initialComments || [];
    });
    setLikeCounts(initialLikeCounts);
    setCommentsList(initialComments);
  }, [isOpen, reels]);

  // Scroll to initial reel on open
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const scrollContainer = containerRef.current;
      scrollContainer.scrollTop = initialReelIndex * window.innerHeight;
    }
  }, [isOpen, initialReelIndex]);

  // Track which reel is currently in view
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / window.innerHeight);
    if (index !== currentIndex && index >= 0 && index < reels.length) {
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, reels.length]);

  const handleAddComment = (content: string, replyToId?: number) => {
    const newComment = {
      id: Date.now(),
      author: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        title: 'St.'
      },
      content: content,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      replies: []
    };

    const reelId = currentReel.id;
    const currentComments = commentsList[reelId] || [];

    if (replyToId) {
      const updatedComments = currentComments.map(c => {
        if (c.id === replyToId) {
          return { ...c, replies: [...(c.replies || []), newComment] };
        }
        if (c.replies) {
          const hasReply = c.replies.some((r: any) => r.id === replyToId);
          if (hasReply) {
            return { ...c, replies: [...c.replies, newComment] };
          }
        }
        return c;
      });
      setCommentsList({ ...commentsList, [reelId]: updatedComments });
    } else {
      setCommentsList({ ...commentsList, [reelId]: [...currentComments, newComment] });
    }
  };

  const handleReelClick = (reelId: number, e: React.MouseEvent) => {
    // Check if click is on a button or interactive element
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return; // Don't toggle pause if clicking on buttons
    }

    const isPaused = pausedReels[reelId] || false;
    setPausedReels({ ...pausedReels, [reelId]: !isPaused });
    
    // Show pause/play icon briefly
    setShowPauseIcon(true);
    setTimeout(() => {
      setShowPauseIcon(false);
    }, 500);
  };

  const handleLikeAnimation = (reelId: number, e: React.MouseEvent) => {
    const currentRef = e.currentTarget.getBoundingClientRect();
    const x = currentRef.left + currentRef.width / 2;
    const y = currentRef.top + currentRef.height / 2;
    setLikeAnimationPosition({ x, y });
    setShowLikeAnimation(true);
    setTimeout(() => {
      setShowLikeAnimation(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-[100] overflow-y-scroll overflow-x-hidden snap-y snap-mandatory hide-scrollbar"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Render all reels */}
      {reels.map((reel, index) => (
        <div 
          key={reel.id} 
          className="relative w-full h-screen snap-start snap-always flex items-center justify-center"
          onClick={(e) => handleReelClick(reel.id, e)}
        >
          {/* Video/Image */}
          <img
            src={reel.thumbnail}
            alt="Reel"
            className="w-full h-full object-cover"
          />

          {/* Pause/Play Icon - Center */}
          {index === currentIndex && showPauseIcon && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="bg-black/40 rounded-full p-4 animate-in fade-in zoom-in duration-200">
                {pausedReels[reel.id] ? (
                  <Play className="h-16 w-16 text-white fill-white" />
                ) : (
                  <Pause className="h-16 w-16 text-white fill-white" />
                )}
              </div>
            </div>
          )}

          {/* Paused Overlay - Subtle darkening when paused */}
          {pausedReels[reel.id] && index === currentIndex && (
            <div className="absolute inset-0 bg-black/10 pointer-events-none z-5"></div>
          )}

          {/* Header - Top */}
          <div className="absolute top-0 left-0 right-0 px-4 pt-3 pb-8 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-10">
            <div className="flex items-center justify-between max-w-[768px] mx-auto">
              <div className="text-white text-xl font-bold">Reels</div>
            </div>
          </div>

          {/* Bottom Info Overlay - Instagram Style */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none">
            <div className="max-w-[768px] mx-auto pointer-events-auto">
              <div className="flex items-end gap-3">
                {/* Left Side - Info */}
                <div className="flex-1 min-w-0 pb-1">
                  {/* Author Info */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <Avatar className="h-8 w-8 ring-2 ring-white/20">
                      <AvatarImage src={reel.author.avatar} />
                      <AvatarFallback>{reel.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      {reel.author.title && (
                        <span className={`text-xs font-bold ${getTitleColor(reel.author.title)} bg-white/90 px-1.5 py-0.5 rounded`}>
                          {reel.author.title}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-white">
                        {reel.author.name}
                      </span>
                      <button className="ml-1 text-white text-sm font-semibold">
                        • Follow
                      </button>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="mb-2.5">
                    {expandedCaptions[reel.id] ? (
                      <p className="text-white text-sm leading-relaxed">
                        {reel.caption}{' '}
                        <button 
                          onClick={() => setExpandedCaptions({ ...expandedCaptions, [reel.id]: false })}
                          className="text-gray-300 font-normal"
                        >
                          less
                        </button>
                      </p>
                    ) : (
                      <button 
                        onClick={() => setExpandedCaptions({ ...expandedCaptions, [reel.id]: true })}
                        className="text-white text-sm leading-relaxed text-left"
                      >
                        <span className="text-gray-300 font-normal">more</span>
                      </button>
                    )}
                  </div>

                  {/* Music/Audio */}
                  <div className="flex items-center gap-2">
                    <Music className="h-3.5 w-3.5 text-white" />
                    <p className="text-white text-xs font-normal">
                      Original Audio • {reel.author.name}
                    </p>
                  </div>
                </div>

                {/* Right Side - Actions - Instagram Style */}
                <div className="flex flex-col gap-5 pb-1">
                  {/* Like Button */}
                  <button 
                    onClick={(e) => {
                      const reelId = reel.id;
                      const isCurrentlyLiked = likedReels[reelId] || false;
                      setLikedReels({ ...likedReels, [reelId]: !isCurrentlyLiked });
                      setLikeCounts({
                        ...likeCounts,
                        [reelId]: isCurrentlyLiked ? likeCounts[reelId] - 1 : likeCounts[reelId] + 1
                      });
                      handleLikeAnimation(reelId, e);
                    }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <Heart
                      className={`h-7 w-7 ${
                        likedReels[reel.id]
                          ? 'fill-red-500 text-red-500'
                          : 'text-white fill-none'
                      } drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}
                    />
                    <span className="text-white text-xs font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {likeCounts[reel.id]?.toLocaleString() || 0}
                    </span>
                  </button>

                  {/* Comment Button */}
                  <button 
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowCommentsModal(true);
                    }} 
                    className="flex flex-col items-center gap-0.5"
                  >
                    <MessageCircle className="h-7 w-7 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
                    <span className="text-white text-xs font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {reel.comments}
                    </span>
                  </button>

                  {/* Share Button */}
                  <button 
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowShareDialog(true);
                    }} 
                    className="flex flex-col items-center gap-0.5"
                  >
                    <Send className="h-6 w-6 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
                  </button>

                  {/* Sound/Mute Button */}
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="flex flex-col items-center gap-0.5"
                  >
                    {isMuted ? (
                      <VolumeX className="h-6 w-6 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
                    ) : (
                      <Volume2 className="h-6 w-6 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
                    )}
                  </button>

                  {/* More Options */}
                  <button className="flex flex-col items-center gap-0.5">
                    <MoreVertical className="h-6 w-6 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
                  </button>

                  {/* Profile Picture Thumbnail - Instagram Style */}
                  <div className="mt-2 relative">
                    <div className="w-7 h-7 rounded-md border-2 border-white overflow-hidden">
                      <img 
                        src={reel.thumbnail} 
                        alt="Reel thumb" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        postId={reels[currentIndex]?.id || 0}
        isLive={false}
      />

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        postAuthor={reels[currentIndex]?.author}
        postContent={reels[currentIndex]?.caption || ''}
        comments={commentsList[reels[currentIndex]?.id] || []}
        onAddComment={handleAddComment}
      />

      {/* Like Animation */}
      {showLikeAnimation && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: likeAnimationPosition.x,
            top: likeAnimationPosition.y,
            transform: 'translate(-50%, calc(-50% - 20px))'
          }}
        >
          <Heart className="h-10 w-10 text-red-500 animate-in fade-in zoom-in duration-200" />
        </div>
      )}
    </div>
  );
}