import { Heart, MessageCircle, Send, Bookmark, Play, Volume2, VolumeX, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState } from 'react';
import { CommentsModal } from './CommentsModal';
import { useTheme } from '../contexts/ThemeContext';

interface Reel {
  id: number;
  author: {
    name: string;
    avatar: string;
    title?: string;
  };
  caption: string;
  thumbnail: string;
  views: string;
  likes: number;
  comments: number;
  initialComments?: any[];
}

interface ReelCardProps {
  reel: Reel;
  onReelClick?: () => void;
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

export function ReelCard({ reel, onReelClick }: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [comment, setComment] = useState('');
  const [likesCount, setLikesCount] = useState(reel.likes);
  const [commentsList, setCommentsList] = useState(reel.initialComments || []);

  const handleAddComment = (content: string, replyToId?: number) => {
    // Add new comment to local state
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

    if (replyToId) {
      // Add as reply
      setCommentsList(commentsList.map(c => {
        if (c.id === replyToId) {
          return {
            ...c,
            replies: [...(c.replies || []), newComment]
          };
        }
        // Check if replying to a nested reply
        if (c.replies) {
          const hasReply = c.replies.some((r: any) => r.id === replyToId);
          if (hasReply) {
            return {
              ...c,
              replies: [...c.replies, newComment]
            };
          }
        }
        return c;
      }));
    } else {
      // Add as new comment
      setCommentsList([...commentsList, newComment]);
    }
  };

  const { colors } = useTheme();

  return (
    <div className={`${colors.bgPrimary} mb-0 overflow-hidden border-t ${colors.border}`}>
      {/* Post Header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-green-400 via-cyan-400 to-blue-400">
            <div className={`${colors.bgPrimary} p-[2px] rounded-full`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={reel.author.avatar} />
                <AvatarFallback>{reel.author.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              {reel.author.title && (
                <span className={`text-xs font-semibold ${getTitleColor(reel.author.title)}`}>
                  {reel.author.title}
                </span>
              )}
              <span className={`text-sm font-semibold ${colors.textPrimary}`}>{reel.author.name}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className={`h-8 w-8 ${colors.bgHover}`}>
          <MoreVertical className={`h-5 w-5 ${colors.textPrimary}`} />
        </Button>
      </div>

      {/* Reel Video/Thumbnail - Full Width */}
      <div 
        className="relative w-full aspect-[9/16] max-h-[600px] bg-black cursor-pointer"
        onClick={onReelClick}
      >
        <img
          src={reel.thumbnail}
          alt="Reel"
          className="w-full h-full object-cover"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 hover:bg-white rounded-full p-4 transition-all">
            <Play className="h-8 w-8 text-gray-900" />
          </div>
        </div>

        {/* Sound Icon - Instagram Style (Bottom Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute bottom-4 right-4 transition-transform hover:scale-105"
        >
          <div className="relative">
            {/* Animated sound bars */}
            <div className="flex items-end gap-[3px] h-7">
              <div className={`w-[4px] rounded-full bg-white transition-all duration-300 ${isMuted ? 'h-3' : 'h-4 animate-pulse'}`}></div>
              <div className={`w-[4px] rounded-full bg-white transition-all duration-300 delay-75 ${isMuted ? 'h-3' : 'h-7 animate-pulse'}`}></div>
              <div className={`w-[4px] rounded-full bg-white transition-all duration-300 delay-150 ${isMuted ? 'h-3' : 'h-5 animate-pulse'}`}></div>
            </div>
            {/* Muted slash */}
            {isMuted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-[2.5px] bg-white rotate-45"></div>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 hover:bg-transparent hover:scale-110 transition-transform ${isLiked ? 'text-red-500' : colors.textPrimary}`}
            onClick={() => {
              setIsLiked(!isLiked);
              setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
            }}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 hover:bg-transparent hover:scale-110 transition-transform ${colors.textPrimary}`}
            onClick={() => setShowCommentsModal(true)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>

          <Button variant="ghost" size="icon" className={`h-8 w-8 hover:bg-transparent hover:scale-110 transition-transform ${colors.textPrimary}`}>
            <Send className="h-6 w-6" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 hover:bg-transparent hover:scale-110 transition-transform ${isBookmarked ? 'text-blue-500' : colors.textPrimary}`}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Likes Count */}
      {likesCount > 0 && (
        <div className="px-3 pb-2">
          <span className={`text-sm font-semibold ${colors.textPrimary}`}>
            {likesCount.toLocaleString()} likes
          </span>
        </div>
      )}

      {/* Caption */}
      <div className="px-3 pb-2">
        <p className={`text-sm ${colors.textPrimary}`}>
          <span className="font-semibold">
            {reel.author.title && (
              <span className={getTitleColor(reel.author.title)}>
                {reel.author.title}{' '}
              </span>
            )}
            {reel.author.name}
          </span>{' '}
          {reel.caption}
        </p>
      </div>

      {/* View Comments */}
      {reel.comments > 0 && !showComments && (
        <button 
          className={`px-3 pb-2 text-sm ${colors.textSecondary}`}
          onClick={() => setShowComments(true)}
        >
          View all {reel.comments} comments
        </button>
      )}

      {/* Views */}
      <div className="px-3 pb-2">
        <span className={`text-xs ${colors.textSecondary}`}>{reel.views} views</span>
      </div>

      {/* Add Comment - Instagram Style */}
      {showComments && (
        <div className={`border-t ${colors.border} px-3 py-2 flex items-center gap-3`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`flex-1 text-sm outline-none ${colors.bgPrimary} ${colors.textPrimary}`}
          />
          {comment && (
            <button 
              className="text-sm font-semibold text-blue-500"
              onClick={() => {
                handleAddComment(comment);
                setComment('');
              }}
            >
              Post
            </button>
          )}
        </div>
      )}

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        postAuthor={reel.author}
        postContent={reel.caption}
        comments={commentsList}
        onAddComment={handleAddComment}
      />
    </div>
  );
}