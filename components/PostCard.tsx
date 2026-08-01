import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { ShareDialog } from './ShareDialog';
import { CommentsModal } from './CommentsModal';
import { LiveStreamViewer } from './LiveStreamViewer';
import { useTheme } from '../contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Post {
  id: number;
  type?: 'video' | 'reel';
  author: {
    name: string;
    avatar: string;
    title?: string;
    isLive?: boolean;
  };
  content: string;
  timestamp?: string;
  image?: string;
  images?: string[]; // Multiple images for carousel
  imageTitle?: string;
  imageSubtitle?: string;
  imageFooter?: string;
  memberCount?: number;
  hasLiveChat?: boolean;
  streamStatus?: string;
  likes?: number;
  commentsCount?: number;
  initialComments?: any[];
  videoDuration?: string;
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

export function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.initialComments || []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { colors } = useTheme();

  // Get images array - use images if available, otherwise single image
  const postImages = post.images || (post.image ? [post.image] : []);
  const hasMultipleImages = postImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % postImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + postImages.length) % postImages.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < postImages.length - 1) {
      nextImage();
    }
    if (isRightSwipe && currentImageIndex > 0) {
      prevImage();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

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
      setComments(comments.map(c => {
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
      setComments([...comments, newComment]);
    }
  };

  return (
    <div className={`${colors.bgPrimary} mb-0 overflow-hidden`}>
      {/* Post Header */}
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex items-center gap-2">
          {/* Avatar with conditional ring color - Red for live, Green-Cyan for regular */}
          <div 
            className={`p-[1.5px] rounded-full ${post.author.isLive ? 'bg-gradient-to-tr from-red-500 via-red-400 to-pink-500 cursor-pointer' : 'bg-gradient-to-tr from-green-400 via-cyan-400 to-blue-400'}`}
            onClick={() => {
              if (post.author.isLive) {
                setShowLiveStream(true);
              }
            }}
          >
            <div className={`${colors.bgPrimary} p-[1.5px] rounded-full`}>
              <Avatar className="h-7 w-7">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              {post.author.title && (
                <span className={`text-xs font-semibold ${getTitleColor(post.author.title)}`}>
                  {post.author.title}
                </span>
              )}
              <h3 className={`text-xs font-semibold ${colors.textPrimary}`}>{post.author.name}</h3>
              {/* Live Badge */}
              {post.author.isLive && (
                <Badge 
                  variant="destructive" 
                  className="text-[10px] px-1.5 py-0 h-4 bg-red-500 cursor-pointer"
                  onClick={() => setShowLiveStream(true)}
                >
                  LIVE
                </Badge>
              )}
            </div>
            {post.timestamp && (
              <span className={`text-[10px] ${colors.textSecondary}`}>{post.timestamp}</span>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={`h-7 w-7 ${colors.bgHover}`}>
              <MoreVertical className={`h-4 w-4 ${colors.textPrimary}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Save Post</DropdownMenuItem>
            <DropdownMenuItem>Hide Post</DropdownMenuItem>
            <DropdownMenuItem>Report Post</DropdownMenuItem>
            <DropdownMenuItem>Copy Link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Caption - Show before image for text-only posts */}
      {!post.image && !post.images && (
        <div className="px-3 pb-3">
          <p className={`text-sm text-right leading-relaxed ${colors.textPrimary}`}>
            {post.content}
          </p>
        </div>
      )}

      {/* Post Images Carousel - Instagram Style */}
      {postImages.length > 0 && (
        <div className="relative w-full bg-black">
          {/* Image Container with Smooth Transition */}
          <div 
            className={`relative w-full ${post.type === 'video' ? 'aspect-video' : 'aspect-square'} overflow-hidden ${post.author.isLive ? 'cursor-pointer' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
              // Only open live stream if it's a live post and user didn't swipe
              if (post.author.isLive && touchStart === 0) {
                setShowLiveStream(true);
              }
            }}
          >
            {/* Images Container - Slide Animation */}
            <div 
              className="flex transition-transform duration-500 ease-out h-full"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {postImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-full object-cover flex-shrink-0"
                />
              ))}
            </div>

            {/* Video Duration Badge - Top Right for video posts */}
            {post.type === 'video' && post.videoDuration && (
              <div className="absolute top-3 right-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded-md font-medium">
                {post.videoDuration}
              </div>
            )}

            {/* Play Button Overlay for video posts */}
            {post.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 hover:bg-white rounded-full p-4 transition-all cursor-pointer">
                  <svg 
                    className="h-12 w-12 text-gray-900" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Only show if multiple images */}
            {hasMultipleImages && (
              <>
                {/* Previous Button */}
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg z-10 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-800" />
                  </button>
                )}

                {/* Next Button */}
                {currentImageIndex < postImages.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg z-10 transition-all"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-800" />
                  </button>
                )}

                {/* Image Counter - Top Right */}
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {currentImageIndex + 1}/{postImages.length}
                </div>

                {/* Dot Indicators - Bottom Center */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {postImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'w-2 h-2 bg-blue-500'
                          : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
                      } rounded-full`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Members and Join Button - For live stream posts */}
          {post.memberCount && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-white text-sm">
                <Users className="h-4 w-4 text-red-500" />
                <span>{post.memberCount} Members</span>
              </div>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white h-9 px-6"
                onClick={() => setShowLiveStream(true)}
              >
                Join
              </Button>
            </div>
          )}
        </div>
      )}

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
          {post.hasLiveChat ? (
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 hover:bg-transparent hover:scale-110 transition-transform ${colors.textPrimary}`}
              onClick={() => setShowCommentsModal(true)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 hover:bg-transparent hover:scale-110 transition-transform ${colors.textPrimary}`}
              onClick={() => setShowCommentsModal(true)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 hover:bg-transparent hover:scale-110 transition-transform ${colors.textPrimary}`}
            onClick={() => setShowShareDialog(true)}
          >
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

      {/* Caption for posts with images */}
      {postImages.length > 0 && (
        <div className="px-3 pb-2">
          <p className={`text-sm text-right leading-relaxed ${colors.textPrimary}`}>
            <span className="font-semibold">{post.author.title && (
              <span className={getTitleColor(post.author.title)}>
                {post.author.title}{' '}
              </span>
            )}
            {post.author.name}</span>{' '}
            {post.content}
          </p>
        </div>
      )}

      {/* View Comments */}
      {post.commentsCount && post.commentsCount > 0 && !showComments && (
        <button 
          className={`px-3 pb-2 text-sm ${colors.textSecondary}`}
          onClick={() => setShowCommentsModal(true)}
        >
          View all {post.commentsCount} comments
        </button>
      )}

      {/* Timestamp */}
      {post.timestamp && (
        <div className="px-3 pb-2">
          <span className={`text-xs ${colors.textSecondary} uppercase`}>{post.timestamp}</span>
        </div>
      )}

      {/* Live Chat Section */}
      {post.hasLiveChat && showChat && (
        <div className="border-t border-gray-100 px-3 py-3">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <input
              type="text"
              placeholder="Join live chat..."
              className="flex-1 text-sm text-gray-500 bg-transparent outline-none"
            />
          </div>
          {post.streamStatus && (
            <p className="text-xs text-gray-500 ml-11">{post.streamStatus}</p>
          )}
        </div>
      )}

      {/* Comments Section - Instagram Style */}
      {!post.hasLiveChat && showComments && post.initialComments && (
        <div className="border-t border-gray-100 px-3 py-2">
          {post.initialComments.map((commentData: any) => (
            <div key={commentData.id} className="flex gap-3 mb-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={commentData.author.avatar} />
                <AvatarFallback>{commentData.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">
                    {commentData.author.title && (
                      <span className={getTitleColor(commentData.author.title)}>
                        {commentData.author.title}{' '}
                      </span>
                    )}
                    {commentData.author.name}
                  </span>{' '}
                  {commentData.content}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">{commentData.timestamp}</span>
                  <button className="text-xs text-gray-500 font-semibold">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment - Instagram Style */}
      {showComments && !post.hasLiveChat && (
        <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
          {comment && (
            <button 
              className="text-sm font-semibold text-blue-500"
              onClick={() => setComment('')}
            >
              Post
            </button>
          )}
        </div>
      )}

      {/* Share Dialog */}
      <ShareDialog 
        isOpen={showShareDialog} 
        onClose={() => setShowShareDialog(false)} 
        postId={post.id}
        isLive={post.hasLiveChat || !!post.memberCount}
        liveTitle={post.imageTitle || post.content}
      />

      {/* Comments Modal */}
      <CommentsModal 
        isOpen={showCommentsModal} 
        onClose={() => setShowCommentsModal(false)} 
        postAuthor={post.author}
        postContent={post.content}
        postImage={post.image}
        comments={comments}
        onAddComment={handleAddComment}
      />

      {/* Live Stream Viewer */}
      <LiveStreamViewer 
        isOpen={showLiveStream} 
        onClose={() => setShowLiveStream(false)} 
        streamAuthor={post.author}
        streamTitle={post.imageTitle || 'Live Stream'}
        viewerCount={post.memberCount || 0}
        thumbnail={post.image || ''}
      />
    </div>
  );
}