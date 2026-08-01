import { Copy, Facebook, MessageCircle, Mail, Link } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  isLive?: boolean;
  liveTitle?: string;
}

export function ShareDialog({ isOpen, onClose, postId, isLive, liveTitle }: ShareDialogProps) {
  const shareUrl = `https://alnnahrain.campus/posts/${postId}`;
  const liveUrl = `https://alnnahrain.campus/live/${postId}`;

  // Fallback copy function for when clipboard API is blocked
  const copyToClipboard = async (text: string) => {
    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for when clipboard API is blocked
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (fallbackErr) {
        console.error('Failed to copy:', fallbackErr);
        return false;
      }
    }
  };

  const handleCopyLink = async () => {
    const urlToCopy = isLive ? liveUrl : shareUrl;
    const message = isLive 
      ? `🔴 Join me live: ${liveTitle || 'Live Stream'}\n${urlToCopy}` 
      : shareUrl;
    
    const success = await copyToClipboard(message);
    if (success) {
      toast.success(isLive ? 'Live stream link copied!' : 'Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link. Please try again.');
    }
    onClose();
  };

  const handleShareToChat = async () => {
    const message = isLive 
      ? `🔴 LIVE NOW: ${liveTitle || 'Live Stream'} - Join here: ${liveUrl}`
      : `Check out this post: ${shareUrl}`;
    
    const success = await copyToClipboard(message);
    if (success) {
      toast.success(isLive ? 'Live stream link ready to share!' : 'Ready to share to chat!');
    } else {
      toast.error('Failed to copy link. Please try again.');
    }
    onClose();
  };

  const handleShareToFacebook = () => {
    const urlToShare = isLive ? liveUrl : shareUrl;
    const text = isLive ? `🔴 LIVE: ${liveTitle || 'Live Stream'}` : '';
    
    // Open Facebook share dialog (would work in real implementation)
    toast.success(isLive ? 'Opening Facebook to share live stream...' : 'Opening Facebook...');
    onClose();
  };

  const handleShareEmail = () => {
    const urlToShare = isLive ? liveUrl : shareUrl;
    const subject = isLive ? `🔴 Live Now: ${liveTitle || 'Live Stream'}` : 'Check out this post';
    const body = isLive 
      ? `Join me for this live session:\n\n${liveTitle || 'Live Stream'}\n\n${urlToShare}`
      : `Check out this post:\n\n${urlToShare}`;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    onClose();
  };

  const shareOptions = [
    { icon: MessageCircle, label: 'Share to Chat', color: 'text-blue-500', action: handleShareToChat },
    { icon: Facebook, label: 'Share to Facebook', color: 'text-blue-600', action: handleShareToFacebook },
    { icon: Mail, label: 'Share via Email', color: 'text-red-500', action: handleShareEmail },
    { icon: Copy, label: 'Copy Link', color: 'text-gray-600', action: handleCopyLink },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1 text-red-600 text-sm">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                LIVE
              </span>
            )}
            <span>{isLive ? 'Share Live Stream' : 'Share Post'}</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Choose how you'd like to share this {isLive ? 'live stream' : 'post'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {isLive && liveTitle && (
            <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-lg mb-2">
              <p className="text-sm font-semibold text-gray-900">{liveTitle}</p>
              <p className="text-xs text-gray-600 mt-0.5">Share this live stream with others</p>
            </div>
          )}
          {shareOptions.map((option, idx) => (
            <Button
              key={idx}
              variant="ghost"
              className="justify-start h-auto py-3"
              onClick={option.action}
            >
              <option.icon className={`h-5 w-5 mr-3 ${option.color}`} />
              <span>{option.label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}