import { Image as ImageIcon, Video, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState } from 'react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (content: string, image?: string) => void;
}

export function CreatePostModal({ isOpen, onClose, onCreatePost }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (content.trim()) {
      onCreatePost(content, selectedImage || undefined);
      setContent('');
      setSelectedImage(null);
      onClose();
    }
  };

  const handleImageSelect = () => {
    // Simulate image selection - in real app would use file input
    const sampleImages = [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800'
    ];
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setSelectedImage(randomImage);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-[768px] max-h-[90vh] md:rounded-lg overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="w-8"></div>
          <h2 className="font-semibold">Create Post</h2>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white h-8 px-4 text-sm"
          >
            Share
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-orange-600">St.</span>
                <span className="text-sm font-semibold">Your Name</span>
              </div>
            </div>
          </div>

          {/* Text Input */}
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-sm outline-none resize-none min-h-[120px] text-right"
            autoFocus
          />

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="mt-4 relative">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full rounded-lg max-h-[300px] object-cover"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Add to your post</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleImageSelect}
                className="h-9 w-9 hover:bg-green-50"
              >
                <ImageIcon className="h-5 w-5 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-red-50"
              >
                <Video className="h-5 w-5 text-red-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-yellow-50"
              >
                <Smile className="h-5 w-5 text-yellow-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}