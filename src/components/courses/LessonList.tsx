import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, ChevronRight, Play, CheckCircle2, Lock, 
  Clock, FileText, Video 
} from 'lucide-react';
import { CourseLesson } from '../../types';

interface Module {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

interface LessonListProps {
  modules: Module[];
  currentLessonId?: string;
  onSelectLesson: (lesson: CourseLesson) => void;
  completedLessons?: string[];
}

export function LessonList({ 
  modules, 
  currentLessonId, 
  onSelectLesson,
  completedLessons = []
}: LessonListProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  const isLessonAccessible = (lesson: CourseLesson) => {
    // All preview lessons are accessible
    if (lesson.isPreview) return true;
    
    // Check if user has access (enrolled)
    // TODO: Check user enrollment status
    return true;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter(l => isLessonCompleted(l.id)).length;
    const total = module.lessons.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  return (
    <div className="space-y-2">
      {modules.map((module, moduleIndex) => {
        const isExpanded = expandedModules.includes(module.id);
        const progress = getModuleProgress(module);

        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIndex * 0.05 }}
            className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
          >
            {/* Module header */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full px-4 py-3 flex items-center gap-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </div>

              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{module.lessons.length} lessons</span>
                  <span>•</span>
                  <span>{progress.completed}/{progress.total} completed</span>
                </div>
              </div>

              {/* Progress circle */}
              <div className="flex-shrink-0">
                <svg className="w-10 h-10 transform -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress.percentage / 100)}`}
                    className="text-blue-600 transition-all duration-500"
                  />
                </svg>
              </div>
            </button>

            {/* Lessons list */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-50 dark:bg-gray-950">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = isLessonCompleted(lesson.id);
                      const isCurrent = currentLessonId === lesson.id;
                      const isAccessible = isLessonAccessible(lesson);

                      return (
                        <motion.button
                          key={lesson.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: lessonIndex * 0.03 }}
                          onClick={() => isAccessible && onSelectLesson(lesson)}
                          disabled={!isAccessible}
                          className={`w-full px-6 py-3 flex items-center gap-3 text-left transition-colors border-l-4 ${
                            isCurrent
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600'
                              : isCompleted
                              ? 'bg-green-50/50 dark:bg-green-900/10 border-green-500'
                              : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-900'
                          } ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {/* Status icon */}
                          <div className="flex-shrink-0">
                            {!isAccessible ? (
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <Lock className="h-4 w-4 text-gray-500" />
                              </div>
                            ) : isCompleted ? (
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              </div>
                            ) : isCurrent ? (
                              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <Play className="h-4 w-4 text-white" fill="white" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <Play className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                          </div>

                          {/* Lesson info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                Lesson {lessonIndex + 1}
                              </span>
                              {lesson.isPreview && (
                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">
                                  PREVIEW
                                </span>
                              )}
                            </div>
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                Video
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(lesson.duration)}
                              </span>
                              {lesson.resources && lesson.resources.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {lesson.resources.length} resources
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Play icon on hover */}
                          {isAccessible && !isCurrent && (
                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
