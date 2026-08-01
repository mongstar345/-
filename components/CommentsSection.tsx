import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MoreVertical } from 'lucide-react';

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

interface CommentsSectionProps {
  postId: number;
  initialComments: Comment[];
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

export function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        },
        content: newComment,
        timestamp: 'Just now',
        likes: 0,
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      return comment;
    }));
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="border-t border-gray-100">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="px-4 py-3 space-y-3">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    {comment.author.title && (
                      <span className={`text-xs ${getTitleColor(comment.author.title)}`}>
                        {comment.author.title}
                      </span>
                    )}
                    <span className="text-sm">{comment.author.name}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 px-2">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`text-xs ${comment.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                  >
                    Like
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    Reply
                  </button>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  {comment.likes > 0 && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Heart className={`h-3 w-3 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      {comment.likes}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ))}

          {comments.length > 3 && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-sm text-gray-500 hover:text-gray-700 pl-11"
            >
              View all {comments.length} comments
            </button>
          )}
        </div>
      )}

      {/* Add Comment */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
            <AvatarFallback>Me</AvatarFallback>
          </Avatar>
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {newComment.trim() && (
            <Button
              onClick={handleAddComment}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            >
              Post
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}