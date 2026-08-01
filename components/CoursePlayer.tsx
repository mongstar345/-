import {
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Settings,
  ChevronDown, ChevronRight, CheckCircle2, Lock, Download, FileText,
  MessageSquare, Clock, Award, Share2, BookOpen, Menu, X
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CoursePlayerProps {
  courseId: number;
  onClose: () => void;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
  isExpanded?: boolean;
}

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'quiz' | 'reading' | 'assignment';
  duration: string;
  completed: boolean;
  locked: boolean;
  videoUrl?: string;
}

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Discussion {
  id: number;
  user: string;
  avatar: string;
  comment: string;
  timestamp: string;
  replies: number;
  likes: number;
}

export function CoursePlayer({ courseId, onClose }: CoursePlayerProps) {
  // UI State
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'content' | 'notes' | 'discussion'>('content');
  const [currentLessonId, setCurrentLessonId] = useState(1);
  
  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1200); // 20 minutes in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [quality, setQuality] = useState('1080p');
  
  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  // Discussion State
  const [newComment, setNewComment] = useState('');
  
  // Notes State
  const [notes, setNotes] = useState<{ time: number; content: string }[]>([
    { time: 145, content: 'Important concept: Dynamic Programming optimization' },
    { time: 320, content: 'Review memoization vs tabulation' },
  ]);
  const [noteInput, setNoteInput] = useState('');
  
  const videoRef = useRef<HTMLDivElement>(null);

  // Course Data
  const modules: Module[] = [
    {
      id: 1,
      title: 'Introduction to Advanced Algorithms',
      isExpanded: true,
      lessons: [
        { id: 1, title: 'Course Overview', type: 'video', duration: '10:30', completed: true, locked: false },
        { id: 2, title: 'Prerequisites Check', type: 'reading', duration: '5 min', completed: true, locked: false },
        { id: 3, title: 'Setup Your Environment', type: 'video', duration: '8:15', completed: false, locked: false },
      ],
    },
    {
      id: 2,
      title: 'Dynamic Programming Fundamentals',
      isExpanded: true,
      lessons: [
        { id: 4, title: 'What is Dynamic Programming?', type: 'video', duration: '15:20', completed: false, locked: false },
        { id: 5, title: 'Memoization Technique', type: 'video', duration: '20:45', completed: false, locked: false },
        { id: 6, title: 'Quiz: DP Basics', type: 'quiz', duration: '10 min', completed: false, locked: false },
        { id: 7, title: 'Fibonacci Implementation', type: 'assignment', duration: '30 min', completed: false, locked: false },
      ],
    },
    {
      id: 3,
      title: 'Advanced Graph Algorithms',
      isExpanded: false,
      lessons: [
        { id: 8, title: 'Graph Representation', type: 'video', duration: '18:30', completed: false, locked: true },
        { id: 9, title: 'Dijkstra\'s Algorithm', type: 'video', duration: '25:15', completed: false, locked: true },
        { id: 10, title: 'A* Search Algorithm', type: 'video', duration: '22:40', completed: false, locked: true },
      ],
    },
  ];

  const [moduleStates, setModuleStates] = useState(modules);

  const quizQuestions: Quiz[] = [
    {
      id: 1,
      question: 'What is the main principle behind dynamic programming?',
      options: [
        'Breaking down problems into smaller subproblems',
        'Using recursion exclusively',
        'Always using iteration instead of recursion',
        'Avoiding optimization'
      ],
      correctAnswer: 0,
      explanation: 'Dynamic programming breaks down complex problems into simpler overlapping subproblems and stores their solutions to avoid redundant calculations.'
    },
    {
      id: 2,
      question: 'Which approach is typically faster in dynamic programming?',
      options: [
        'Top-down with memoization',
        'Bottom-up with tabulation',
        'Both are equally fast',
        'Neither is efficient'
      ],
      correctAnswer: 1,
      explanation: 'Bottom-up tabulation is typically faster because it avoids the overhead of recursive function calls and builds solutions iteratively.'
    },
  ];

  const discussions: Discussion[] = [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      comment: 'Great explanation of memoization! The Fibonacci example really helped me understand the concept.',
      timestamp: '2 hours ago',
      replies: 3,
      likes: 12,
    },
    {
      id: 2,
      user: 'Ahmed Hassan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      comment: 'Can someone explain the difference between greedy algorithms and dynamic programming?',
      timestamp: '5 hours ago',
      replies: 5,
      likes: 8,
    },
  ];

  const currentLesson = moduleStates
    .flatMap(m => m.lessons)
    .find(l => l.id === currentLessonId);

  // Auto-save progress
  useEffect(() => {
    const saveProgress = () => {
      console.log('Saving progress:', { courseId, currentLessonId, currentTime });
      // API call to save progress
    };

    const interval = setInterval(saveProgress, 30000);
    return () => clearInterval(interval);
  }, [courseId, currentLessonId, currentTime]);

  // Simulate video time update
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const toggleModule = (moduleId: number) => {
    setModuleStates(prev =>
      prev.map(m =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
      )
    );
  };

  const selectLesson = (lessonId: number) => {
    const lesson = moduleStates.flatMap(m => m.lessons).find(l => l.id === lessonId);
    if (lesson && !lesson.locked) {
      setCurrentLessonId(lessonId);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const markLessonComplete = () => {
    setModuleStates(prev =>
      prev.map(m => ({
        ...m,
        lessons: m.lessons.map(l =>
          l.id === currentLessonId ? { ...l, completed: true } : l
        ),
      }))
    );
    
    // Unlock next lesson
    const allLessons = moduleStates.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setModuleStates(prev =>
        prev.map(m => ({
          ...m,
          lessons: m.lessons.map(l =>
            l.id === nextLesson.id ? { ...l, locked: false } : l
          ),
        }))
      );
    }
  };

  const goToNextLesson = () => {
    const allLessons = moduleStates.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      if (!nextLesson.locked) {
        selectLesson(nextLesson.id);
      }
    }
  };

  const addNote = () => {
    if (noteInput.trim()) {
      setNotes(prev => [...prev, { time: currentTime, content: noteInput }]);
      setNoteInput('');
    }
  };

  const submitQuizAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuizIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      markLessonComplete();
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'quiz':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'reading':
        return <BookOpen className="h-4 w-4" />;
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-sm font-semibold">Advanced Algorithms Course</h1>
            <p className="text-xs text-gray-500">{currentLesson?.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player / Quiz Area */}
          <div className="bg-black relative">
            {currentLesson?.type === 'video' ? (
              <>
                {/* Video Placeholder */}
                <div
                  ref={videoRef}
                  className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative"
                >
                  {/* Video Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>

                  {/* Play/Pause Overlay */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center hover:bg-black/20 transition-colors"
                  >
                    {!isPlaying && (
                      <div className="bg-blue-500 rounded-full p-6 hover:bg-blue-600 transition-colors">
                        <Play className="h-12 w-12 text-white fill-white" />
                      </div>
                    )}
                  </button>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <Slider
                        value={[currentTime]}
                        onValueChange={([value]) => setCurrentTime(value)}
                        max={duration}
                        step={1}
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-white hover:bg-white/20"
                          >
                            {isMuted ? (
                              <VolumeX className="h-5 w-5" />
                            ) : (
                              <Volume2 className="h-5 w-5" />
                            )}
                          </Button>
                          <Slider
                            value={[volume]}
                            onValueChange={([value]) => setVolume(value)}
                            max={100}
                            className="w-20"
                          />
                        </div>

                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                            className="text-white hover:bg-white/20"
                          >
                            {playbackSpeed}x
                          </Button>
                          {showSpeedMenu && (
                            <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-1 min-w-[100px]">
                              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                                <button
                                  key={speed}
                                  onClick={() => {
                                    setPlaybackSpeed(speed);
                                    setShowSpeedMenu(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${
                                    playbackSpeed === speed ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowQualityMenu(!showQualityMenu)}
                            className="text-white hover:bg-white/20"
                          >
                            {quality}
                          </Button>
                          {showQualityMenu && (
                            <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-1 min-w-[100px]">
                              {['360p', '480p', '720p', '1080p'].map(q => (
                                <button
                                  key={q}
                                  onClick={() => {
                                    setQuality(q);
                                    setShowQualityMenu(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${
                                    quality === q ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''
                                  }`}
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Maximize className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : currentLesson?.type === 'quiz' ? (
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
                <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Quiz Time!</h2>
                    <Badge variant="outline">
                      Question {currentQuizIndex + 1} of {quizQuestions.length}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <Progress 
                      value={((currentQuizIndex + (showExplanation ? 1 : 0)) / quizQuestions.length) * 100} 
                      className="h-2"
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-4">
                    {quizQuestions[currentQuizIndex].question}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {quizQuestions[currentQuizIndex].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => !showExplanation && setSelectedAnswer(index)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showExplanation
                            ? index === quizQuestions[currentQuizIndex].correctAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : index === selectedAnswer
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-200 dark:border-gray-700 opacity-50'
                            : selectedAnswer === index
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              showExplanation
                                ? index === quizQuestions[currentQuizIndex].correctAnswer
                                  ? 'border-green-500 bg-green-500'
                                  : index === selectedAnswer
                                  ? 'border-red-500 bg-red-500'
                                  : 'border-gray-300'
                                : selectedAnswer === index
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {showExplanation && index === quizQuestions[currentQuizIndex].correctAnswer && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                            {showExplanation && index === selectedAnswer && index !== quizQuestions[currentQuizIndex].correctAnswer && (
                              <X className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
                    >
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Explanation:
                      </h4>
                      <p className="text-blue-800 dark:text-blue-200">
                        {quizQuestions[currentQuizIndex].explanation}
                      </p>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    {!showExplanation ? (
                      <Button
                        onClick={submitQuizAnswer}
                        disabled={selectedAnswer === null}
                        className="flex-1"
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button onClick={nextQuizQuestion} className="flex-1">
                        {currentQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen className="h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Reading Material</h2>
                  <p className="text-white/80">Content will be displayed here</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Info & Actions */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{currentLesson?.title}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {currentLesson?.duration}
                  </span>
                  {currentLesson?.completed && (
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {!currentLesson?.completed && (
                  <Button onClick={markLessonComplete} variant="outline">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                )}
                <Button onClick={goToNextLesson}>
                  Next Lesson
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setSidebarTab('content')}
                  className={`py-3 px-2 border-b-2 transition-colors ${
                    sidebarTab === 'content'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSidebarTab('notes')}
                  className={`py-3 px-2 border-b-2 transition-colors ${
                    sidebarTab === 'notes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setSidebarTab('discussion')}
                  className={`py-3 px-2 border-b-2 transition-colors ${
                    sidebarTab === 'discussion'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Discussion
                </button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {sidebarTab === 'content' && (
                <div className="max-w-3xl">
                  <h3 className="text-lg font-semibold mb-4">About This Lesson</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Learn the fundamental concepts of dynamic programming and how to apply
                    memoization techniques to optimize recursive algorithms. This lesson covers
                    practical examples and implementation strategies.
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Resources
                    </h4>
                    <div className="space-y-2">
                      <a href="#" className="flex items-center justify-between p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        <span className="text-sm">Lecture Slides.pdf</span>
                        <Download className="h-4 w-4" />
                      </a>
                      <a href="#" className="flex items-center justify-between p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        <span className="text-sm">Code Examples.zip</span>
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {sidebarTab === 'notes' && (
                <div className="max-w-3xl">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">My Notes</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Add a note at current time..."
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addNote()}
                      />
                      <Button onClick={addNote} disabled={!noteInput.trim()}>
                        Add Note
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {notes.map((note, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {formatTime(note.time)}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sidebarTab === 'discussion' && (
                <div className="max-w-3xl">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Discussion</h3>
                    <div className="flex gap-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ask a question or share your thoughts..."
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button disabled={!newComment.trim()}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <div
                        key={discussion.id}
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex gap-3">
                          <img
                            src={discussion.avatar}
                            alt={discussion.user}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{discussion.user}</span>
                              <span className="text-xs text-gray-500">{discussion.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              {discussion.comment}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <button className="hover:text-blue-600">
                                👍 {discussion.likes}
                              </button>
                              <button className="hover:text-blue-600">
                                💬 {discussion.replies} replies
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold">Course Content</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(false)}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2">
                  {moduleStates.map((module) => (
                    <div key={module.id} className="mb-2">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="font-medium text-sm">{module.title}</span>
                        {module.isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      <AnimatePresence>
                        {module.isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {module.lessons.map((lesson) => (
                              <button
                                key={lesson.id}
                                onClick={() => selectLesson(lesson.id)}
                                disabled={lesson.locked}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                  lesson.id === currentLessonId
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                    : lesson.locked
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    lesson.completed
                                      ? 'bg-green-100 text-green-600'
                                      : lesson.locked
                                      ? 'bg-gray-100 text-gray-400'
                                      : 'bg-blue-100 text-blue-600'
                                  }`}
                                >
                                  {lesson.completed ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : lesson.locked ? (
                                    <Lock className="h-4 w-4" />
                                  ) : (
                                    getLessonIcon(lesson.type)
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="text-sm font-medium">{lesson.title}</p>
                                  <p className="text-xs text-gray-500">{lesson.duration}</p>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CoursePlayer;
