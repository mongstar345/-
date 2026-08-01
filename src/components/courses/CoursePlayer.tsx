import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Settings, 
  SkipBack, SkipForward, ChevronLeft, CheckCircle2 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

interface CoursePlayerProps {
  courseId: string;
  lessonId: string;
  videoUrl: string;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function CoursePlayer({
  courseId,
  lessonId,
  videoUrl,
  onComplete,
  onNext,
  onPrevious,
}: CoursePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      const progressPercent = (videoRef.current.currentTime / duration) * 100;
      setProgress(progressPercent);

      // Auto-save progress
      saveProgress(videoRef.current.currentTime);

      // Mark as complete at 90%
      if (progressPercent >= 90 && onComplete) {
        onComplete();
      }
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Seek to time
  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const time = (value[0] / 100) * duration;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Handle volume
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Change playback speed
  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Save progress to backend
  const saveProgress = (time: number) => {
    // Debounce save
    // TODO: Save to backend
    // await saveVideoProgress(courseId, lessonId, time);
  };

  // Show controls on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  return (
    <div
      className="relative bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />

      {/* Overlay controls */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none"
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-4 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h3 className="text-white font-semibold">
              Lesson {lessonId}: Video Title
            </h3>
          </div>
        </div>

        {/* Center play button */}
        {!isPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-auto"
          >
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors shadow-2xl"
            >
              <Play className="h-10 w-10 text-white ml-1" fill="white" />
            </button>
          </motion.div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 pointer-events-auto">
          {/* Progress bar */}
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(-10)}
                disabled={!onPrevious}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(10)}
                disabled={!onNext}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <div className="w-20 hidden md:block">
                  <Slider
                    value={[volume * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Playback speed */}
              <select
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                className="px-2 py-1 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress indicator */}
      {progress >= 90 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg"
        >
          <CheckCircle2 className="h-6 w-6" />
        </motion.div>
      )}
    </div>
  );
}
