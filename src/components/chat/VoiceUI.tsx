import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Send, Pause, Play } from 'lucide-react';
import { Button } from '../ui/button';

interface VoiceUIProps {
  onSendVoice: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export function VoiceUI({ onSendVoice, onCancel }: VoiceUIProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  // Mock audio recording (replace with real MediaRecorder API)
  useEffect(() => {
    if (isRecording && !isPaused) {
      startTimeRef.current = Date.now() - duration * 1000;

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);

        // Generate mock waveform data
        setWaveformData((prev) => [
          ...prev.slice(-50), // Keep last 50 bars
          Math.random() * 100,
        ]);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused, duration]);

  // Start recording
  useEffect(() => {
    setIsRecording(true);
  }, []);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleCancel = () => {
    setIsRecording(false);
    onCancel();
  };

  const handleSend = () => {
    setIsRecording(false);
    
    // Mock audio blob (replace with real recording)
    const mockBlob = new Blob(['mock audio data'], { type: 'audio/webm' });
    onSendVoice(mockBlob);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-2xl"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: isRecording && !isPaused ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: isRecording && !isPaused ? Infinity : 0,
              }}
              className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center"
            >
              <Mic className="h-5 w-5 text-white" />
            </motion.div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {isPaused ? 'Recording Paused' : 'Recording Voice'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDuration(duration)}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Waveform visualization */}
        <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 flex items-center justify-center gap-1 px-4 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {waveformData.map((height, index) => (
              <motion.div
                key={`${index}-${Date.now()}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}%`, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="w-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full"
                style={{
                  minHeight: '4px',
                  maxHeight: '100%',
                }}
              />
            ))}
          </AnimatePresence>

          {waveformData.length === 0 && (
            <p className="text-sm text-gray-400">Start speaking...</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Cancel */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleCancel}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>

          {/* Pause/Resume */}
          <Button
            variant="outline"
            size="lg"
            onClick={handlePauseResume}
            className="gap-2"
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            )}
          </Button>

          {/* Send */}
          <Button
            size="lg"
            onClick={handleSend}
            disabled={duration < 1}
            className="gap-2 bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>

        {/* Hints */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {duration < 1 && 'Record at least 1 second to send'}
            {duration >= 60 && 'Maximum recording time: 5 minutes'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Hook to use voice recording
export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
