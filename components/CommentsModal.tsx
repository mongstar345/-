import { Heart, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
    title?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postAuthor: {
    name: string;
    avatar: string;
    title?: string;
  };
  postContent: string;
  postImage?: string;
  comments: Comment[];
  onAddComment: (content: string, replyToId?: number) => void;
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

export function CommentsModal({ 
  isOpen, 
  onClose, 
  postAuthor, 
  postContent, 
  postImage, 
  comments,
  onAddComment 
}: CommentsModalProps) {
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyingToName, setReplyingToName] = useState<string>('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  // Sync local comments with props when modal opens, but not during active editing
  useEffect(() => {
    if (isOpen) {
      setLocalComments(comments);
      setDragOffset(0);
      // Prevent body scrolling and touch events on background
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      // Restore body scrolling
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Touch handlers for swipe down to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollableContent = document.getElementById('comments-scrollable');
    // Only allow drag if scrolled to top
    if (scrollableContent && scrollableContent.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsDragging(true);
      e.stopPropagation(); // Prevent touch from reaching posts below
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    // Only allow dragging down
    if (diff > 0) {
      setDragOffset(diff);
      // Add resistance at the top for smoother feel
      e.preventDefault();
      e.stopPropagation(); // Prevent touch from reaching posts below
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // If dragged more than 80px, close the modal (easier threshold)
    if (dragOffset > 80) {
      onClose();
    }
    
    // Reset
    setDragOffset(0);
    setIsDragging(false);
    setStartY(0);
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      onAddComment(comment, replyingTo || undefined);
      
      // Add comment to local state for immediate UI update
      const newComment = {
        id: Date.now(),
        author: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          title: 'St.'
        },
        content: comment,
        timestamp: 'Just now',
        likes: 0,
        isLiked: false
      };

      if (replyingTo) {
        // Add as reply - map through comments and find the parent
        setLocalComments(localComments.map(c => {
          if (c.id === replyingTo) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment]
            };
          }
          // Also check if replying to a nested reply
          if (c.replies) {
            const hasReply = c.replies.some(r => r.id === replyingTo);
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
        setLocalComments([...localComments, newComment]);
      }

      setComment('');
      setReplyingTo(null);
      setReplyingToName('');
    }
  };

  const handleLikeComment = (commentId: number, isReply: boolean = false, parentId?: number) => {
    if (isReply && parentId) {
      setLocalComments(localComments.map(c => {
        if (c.id === parentId && c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.id === commentId) {
                return {
                  ...r,
                  isLiked: !r.isLiked,
                  likes: r.isLiked ? r.likes - 1 : r.likes + 1
                };
              }
              return r;
            })
          };
        }
        return c;
      }));
    } else {
      setLocalComments(localComments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1
          };
        }
        return c;
      }));
    }
  };

  const handleReply = (commentId: number, authorName: string) => {
    setReplyingTo(commentId);
    setReplyingToName(authorName);
  };

  return (
    <>
      {/* Backdrop to prevent interaction with background */}
      <div 
        className="fixed inset-0 bg-black/50 z-[59]"
        onClick={onClose}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      />
      
      {/* Comments Modal */}
      <div 
        className="fixed inset-0 bg-white z-[60] flex flex-col"
        style={{ 
          transform: `translateY(${dragOffset}px)`, 
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b sticky top-0 bg-white z-10">
          <div className="w-10"></div>
          <h2 className="text-sm font-semibold">Comments</h2>
          <Send className="h-5 w-5" />
        </div>

        {/* Scrollable Comments */}
        <div className="flex-1 overflow-y-auto" id="comments-scrollable"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Original Post */}
          <div className="border-b px-4 py-3">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={postAuthor.avatar} />
                <AvatarFallback>{postAuthor.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-tight">
                      <span className="font-semibold">
                        {postAuthor.title && (
                          <span className={getTitleColor(postAuthor.title)}>
                            {postAuthor.title}{' '}
                          </span>
                        )}
                        {postAuthor.name}
                      </span>{' '}
                      <span className="font-normal">{postContent}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">2h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="px-4 py-2">
            {localComments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-900 font-semibold mb-1">No comments yet</p>
                <p className="text-sm text-gray-500">Start the conversation.</p>
              </div>
            ) : (
              localComments.map((commentData) => (
                <div key={commentData.id} className="py-3">
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarImage src={commentData.author.avatar} />
                      <AvatarFallback>{commentData.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-1">
                            <span className="font-semibold text-sm mr-2">
                              {commentData.author.name}
                            </span>
                            <span className="text-sm">{commentData.content}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{commentData.timestamp}</span>
                            {commentData.likes > 0 && (
                              <span className="font-semibold">
                                {commentData.likes} {commentData.likes === 1 ? 'like' : 'likes'}
                              </span>
                            )}
                            <button 
                              className="font-semibold hover:text-gray-700 transition-colors"
                              onClick={() => handleReply(commentData.id, commentData.author.name)}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                        <button 
                          className="p-1 -mt-1 hover:opacity-70 transition-opacity"
                          onClick={() => handleLikeComment(commentData.id)}
                        >
                          <Heart 
                            className={`h-3.5 w-3.5 transition-all ${ 
                              commentData.isLiked 
                                ? 'fill-red-500 text-red-500 scale-110' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`} 
                          />
                        </button>
                      </div>

                      {/* View Replies */}
                      {commentData.replies && commentData.replies.length > 0 && (
                        <div className="mt-3 ml-0 space-y-3">
                          {commentData.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={reply.author.avatar} />
                                <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="mb-1">
                                      <span className="font-semibold text-sm mr-2">
                                        {reply.author.name}
                                      </span>
                                      <span className="text-sm">{reply.content}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span>{reply.timestamp}</span>
                                      {reply.likes > 0 && (
                                        <span className="font-semibold">
                                          {reply.likes} {reply.likes === 1 ? 'like' : 'likes'}
                                        </span>
                                      )}
                                      <button 
                                        className="font-semibold hover:text-gray-700 transition-colors"
                                        onClick={() => handleReply(commentData.id, reply.author.name)}
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                  <button 
                                    className="p-1 -mt-1 hover:opacity-70 transition-opacity"
                                    onClick={() => handleLikeComment(reply.id, true, commentData.id)}
                                  >
                                    <Heart 
                                      className={`h-3.5 w-3.5 transition-all ${
                                        reply.isLiked 
                                          ? 'fill-red-500 text-red-500 scale-110' 
                                          : 'text-gray-400 hover:text-gray-600'
                                      }`} 
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Comment Input - Fixed at bottom */}
        <div className="border-t bg-white">
          {replyingTo && (
            <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Replying to <span className="font-semibold">{replyingToName}</span>
              </span>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyingToName('');
                }}
                className="text-sm text-blue-500 font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 px-4 py-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 text-sm outline-none bg-transparent"
              />
              {comment && (
                <button 
                  onClick={handleSubmit}
                  className="text-blue-500 font-semibold text-sm"
                >
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}