import { ImageIcon, Video, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

export function CreatePostButton() {
  const [postContent, setPostContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handlePost = () => {
    if (postContent.trim()) {
      // Handle post creation
      console.log('Creating post:', postContent);
      setPostContent('');
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-200">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-200 transition-colors">
              What's on your mind?
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4" aria-describedby="create-post-description">
            <span id="create-post-description" className="sr-only">
              Create a new post to share with the Al-Nahrain Campus community
            </span>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">You</p>
                <p className="text-xs text-gray-500">Public</p>
              </div>
            </div>
            <Textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-[120px] resize-none border-none focus-visible:ring-0 text-base"
            />
            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
              <span className="text-sm">Add to your post</span>
              <div className="flex-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ImageIcon className="h-4 w-4 text-green-500" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="h-4 w-4 text-red-500" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="h-4 w-4 text-yellow-500" />
              </Button>
            </div>
            <Button
              onClick={handlePost}
              disabled={!postContent.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}