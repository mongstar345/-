import { X, Settings, ChevronDown, ChevronRight, Camera, Image, Zap, Type, Smile, Music, Download, RotateCcw, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface AddStoryDialogProps {
  onClose: () => void;
  userStoryCount: number;
  handleAddStory: () => void;
  handleViewOwnStory: () => void;
}

export function AddStoryDialog({ onClose, userStoryCount, handleAddStory, handleViewOwnStory }: AddStoryDialogProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [recentsOpen, setRecentsOpen] = useState(true);
  const [frontCamera, setFrontCamera] = useState(true);
  const [cameraToolSide, setCameraToolSide] = useState<'left' | 'right'>('left');
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recentPhotos, setRecentPhotos] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock recent images - in real app, these would come from device gallery
  const recentImages = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=600&fit=crop',
  ];

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: frontCamera ? 'user' : 'environment' },
        audio: false
      });
      
      setStream(mediaStream);
      setCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      toast.error('Camera access denied. Please allow camera permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  // Switch camera
  const switchCamera = async () => {
    stopCamera();
    setFrontCamera(!frontCamera);
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  // Open gallery
  const openGallery = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        // Add to recent photos
        setRecentPhotos(prev => [result, ...prev].slice(0, 8));
      };
      reader.readAsDataURL(file);
    }
  };

  // Post story
  const postStory = () => {
    handleAddStory();
    toast.success('Story posted successfully!');
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // If image captured or selected, show editor
  if (capturedImage || selectedImage) {
    return (
      <div className="fixed inset-0 z-[100] bg-black max-w-[768px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => {
              setCapturedImage(null);
              setSelectedImage(null);
            }}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex gap-2">
            <button className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
              <Download className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Image Preview */}
        <div className="relative h-[calc(100vh-180px)] flex items-center justify-center">
          <img 
            src={capturedImage || selectedImage || ''} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Tools Bar */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-6">
          <button className="text-white p-3 hover:bg-white/10 rounded-full transition-colors">
            <Type className="h-6 w-6" />
          </button>
          <button className="text-white p-3 hover:bg-white/10 rounded-full transition-colors">
            <Smile className="h-6 w-6" />
          </button>
          <button className="text-white p-3 hover:bg-white/10 rounded-full transition-colors">
            <Music className="h-6 w-6" />
          </button>
          <button className="text-white p-3 hover:bg-white/10 rounded-full transition-colors">
            <Zap className="h-6 w-6" />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Add a caption..."
              className="flex-1 bg-transparent border-b border-white/30 py-2 text-white placeholder-white/50 outline-none focus:border-white transition-colors"
            />
            <button
              onClick={postStory}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              Share
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If camera is active, show camera view
  if (cameraActive) {
    return (
      <div className="fixed inset-0 z-[100] bg-black max-w-[768px] mx-auto">
        {/* Camera Preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <button 
            onClick={() => {
              stopCamera();
            }}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>

        {/* Tools Bar - Left or Right based on settings */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${cameraToolSide === 'left' ? 'left-4' : 'right-4'} flex flex-col gap-6`}>
          <button className="text-white p-3 hover:bg-white/10 rounded-full transition-colors">
            <Zap className="h-6 w-6" />
          </button>
          <button className="text-white p-3 hover:bg-white/10 rounded-full transition-colors">
            <Music className="h-6 w-6" />
          </button>
          <button className="text-white p-3 hover:bg-white/10 rounded-full transition-colors">
            <Type className="h-6 w-6" />
          </button>
          <button className="text-white p-3 hover:bg-white/10 rounded-full transition-colors">
            <Smile className="h-6 w-6" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8">
          {/* Gallery button */}
          <button 
            onClick={openGallery}
            className="w-12 h-12 rounded-lg border-2 border-white/50 overflow-hidden"
          >
            {recentPhotos.length > 0 ? (
              <img src={recentPhotos[0]} alt="Recent" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="h-6 w-6 text-white" />
              </div>
            )}
          </button>

          {/* Capture button */}
          <button
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full border-4 border-white bg-transparent hover:bg-white/20 transition-colors relative"
          >
            <div className="absolute inset-2 rounded-full bg-white"></div>
          </button>

          {/* Switch camera */}
          <button
            onClick={switchCamera}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <RotateCcw className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Camera Settings from camera view */}
        {showSettings && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[101] bg-black/50 max-w-[768px] mx-auto"
              onClick={() => setShowSettings(false)}
            />
            
            {/* Settings Panel */}
            <div className="fixed inset-y-0 right-0 z-[102] w-full max-w-[768px] mx-auto bg-[#0a0a0a] animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-white text-xl font-medium">Camera settings</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-blue-500 font-medium"
                >
                  Done
                </button>
              </div>

              <div className="overflow-y-auto">
                {/* Story/Reels/Live Options */}
                <div className="border-b border-white/10">
                  <button className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                        <path d="M12 8V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="text-white">Story</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/50" />
                  </button>

                  <button className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2"/>
                        <path d="M10 9L15 12L10 15V9Z" fill="white"/>
                      </svg>
                      <span className="text-white">Reels</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/50" />
                  </button>

                  <button className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3" fill="white"/>
                        <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1" strokeDasharray="2 2"/>
                      </svg>
                      <span className="text-white">Live</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/50" />
                  </button>
                </div>

                {/* Controls Section */}
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white/60 text-sm font-medium mb-4">Controls</h3>
                  <button 
                    onClick={() => setFrontCamera(!frontCamera)}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-white">Always start on front camera</span>
                    <div 
                      className={`w-12 h-7 rounded-full transition-colors ${
                        frontCamera ? 'bg-blue-500' : 'bg-white/30'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 rounded-full bg-white mt-1 transition-transform ${
                          frontCamera ? 'translate-x-6 ml-1' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </button>
                </div>

                {/* Camera Tools Section */}
                <div className="p-4">
                  <h3 className="text-white/60 text-sm font-medium mb-2">Camera tools</h3>
                  <p className="text-white/40 text-sm mb-6">
                    Choose which side of the screen you want your camera toolbar to be on.
                  </p>

                  {/* Left side option */}
                  <button 
                    onClick={() => setCameraToolSide('left')}
                    className="flex items-center justify-between w-full mb-4"
                  >
                    <span className="text-white">Left side</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      cameraToolSide === 'left' ? 'border-blue-500' : 'border-white/50'
                    }`}>
                      {cameraToolSide === 'left' && (
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </button>

                  {/* Right side option */}
                  <button 
                    onClick={() => setCameraToolSide('right')}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-white">Right side</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      cameraToolSide === 'right' ? 'border-blue-500' : 'border-white/50'
                    }`}>
                      {cameraToolSide === 'right' && (
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Main Add Story Screen
  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black max-w-[768px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button 
            onClick={onClose}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <h1 className="text-white text-lg font-medium">Add to story</h1>
          <button 
            onClick={() => setShowSettings(true)}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>

        {/* Creative Tools */}
        <div className="flex gap-4 p-4">
          {/* Templates */}
          <button className="flex-1 flex flex-col items-center gap-2 bg-[#1a1a1a] rounded-2xl p-4 hover:bg-[#252525] transition-colors">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="white"/>
                <rect x="3" y="14" width="7" height="7" rx="1" fill="white"/>
                <rect x="14" y="3" width="7" height="7" rx="1" fill="white"/>
                <rect x="14" y="14" width="7" height="7" rx="1" fill="white"/>
              </svg>
            </div>
            <span className="text-white text-sm">Templates</span>
          </button>

          {/* Music */}
          <button className="flex-1 flex flex-col items-center gap-2 bg-[#1a1a1a] rounded-2xl p-4 hover:bg-[#252525] transition-colors">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18V5L21 3V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2"/>
                <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-white text-sm">Music</span>
          </button>

          {/* Collage */}
          <button className="flex-1 flex flex-col items-center gap-2 bg-[#1a1a1a] rounded-2xl p-4 hover:bg-[#252525] transition-colors">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="8" height="8" rx="1" stroke="white" strokeWidth="2"/>
                <rect x="13" y="3" width="8" height="8" rx="1" stroke="white" strokeWidth="2"/>
                <rect x="3" y="13" width="8" height="8" rx="1" stroke="white" strokeWidth="2"/>
                <rect x="13" y="13" width="8" height="8" rx="1" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-white text-sm">Collage</span>
          </button>
        </div>

        {/* Recents Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setRecentsOpen(!recentsOpen)}
              className="flex items-center gap-2 text-white"
            >
              <span className="text-lg font-medium">Recents</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${recentsOpen ? '' : '-rotate-90'}`} />
            </button>
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <div className="w-5 h-5 rounded border-2 border-white"></div>
              <span className="text-sm">Select</span>
            </button>
          </div>

          {recentsOpen && (
            <div className="grid grid-cols-3 gap-1">
              {/* Camera button */}
              <button 
                onClick={startCamera}
                className="aspect-[3/4] bg-[#1a1a1a] rounded-lg flex items-center justify-center hover:bg-[#252525] transition-colors"
              >
                <Camera className="h-12 w-12 text-white" />
              </button>

              {/* Recent images */}
              {recentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="aspect-[3/4] rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <img 
                    src={img} 
                    alt={`Recent ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Camera Settings Slide-in */}
      {showSettings && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[101] bg-black/50 max-w-[768px] mx-auto"
            onClick={() => setShowSettings(false)}
          />
          
          {/* Settings Panel */}
          <div className="fixed inset-y-0 right-0 z-[102] w-full max-w-[768px] mx-auto bg-[#0a0a0a] animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-white text-xl font-medium">Camera settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-blue-500 font-medium"
              >
                Done
              </button>
            </div>

            <div className="overflow-y-auto">
              {/* Story/Reels/Live Options */}
              <div className="border-b border-white/10">
                <button className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                      <path d="M12 8V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="text-white">Story</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/50" />
                </button>

                <button className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2"/>
                      <path d="M10 9L15 12L10 15V9Z" fill="white"/>
                    </svg>
                    <span className="text-white">Reels</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/50" />
                </button>

                <button className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" fill="white"/>
                      <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1" strokeDasharray="2 2"/>
                    </svg>
                    <span className="text-white">Live</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/50" />
                </button>
              </div>

              {/* Controls Section */}
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white/60 text-sm font-medium mb-4">Controls</h3>
                <button 
                  onClick={() => setFrontCamera(!frontCamera)}
                  className="flex items-center justify-between w-full"
                >
                  <span className="text-white">Always start on front camera</span>
                  <div 
                    className={`w-12 h-7 rounded-full transition-colors ${
                      frontCamera ? 'bg-blue-500' : 'bg-white/30'
                    }`}
                  >
                    <div 
                      className={`w-5 h-5 rounded-full bg-white mt-1 transition-transform ${
                        frontCamera ? 'translate-x-6 ml-1' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Camera Tools Section */}
              <div className="p-4">
                <h3 className="text-white/60 text-sm font-medium mb-2">Camera tools</h3>
                <p className="text-white/40 text-sm mb-6">
                  Choose which side of the screen you want your camera toolbar to be on.
                </p>

                {/* Left side option */}
                <button 
                  onClick={() => setCameraToolSide('left')}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <span className="text-white">Left side</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    cameraToolSide === 'left' ? 'border-blue-500' : 'border-white/50'
                  }`}>
                    {cameraToolSide === 'left' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </div>
                </button>

                {/* Right side option */}
                <button 
                  onClick={() => setCameraToolSide('right')}
                  className="flex items-center justify-between w-full"
                >
                  <span className="text-white">Right side</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    cameraToolSide === 'right' ? 'border-blue-500' : 'border-white/50'
                  }`}>
                    {cameraToolSide === 'right' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}