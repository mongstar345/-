import { motion } from 'motion/react';
import { Star, Clock, Users, BookOpen, Award, DollarSign } from 'lucide-react';
import { Course } from '../../types';
import { Button } from '../ui/button';

interface CourseCardProps {
  course: Course;
}

const levelColors = {
  beginner: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  intermediate: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  advanced: 'text-red-600 bg-red-50 dark:bg-red-900/20',
};

export function CourseCard({ course }: CourseCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const handleEnroll = () => {
    // Navigate to course detail page
    window.location.href = `/courses/${course.id}`;
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-800 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-white/50" />
          </div>
        )}

        {/* Badge overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          {!course.isPaid && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
              FREE
            </span>
          )}
          {course.rating >= 4.5 && (
            <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
              <Award className="h-3 w-3" />
              BESTSELLER
            </span>
          )}
        </div>

        {/* Level badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${levelColors[course.level]}`}
          >
            {course.level.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
          {course.category}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            {course.instructor[0]}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {course.instructor}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(course.duration)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessonsCount} lessons
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Users className="h-3.5 w-3.5" />
            {course.studentsCount.toLocaleString()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {course.rating}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({course.studentsCount})
            </span>
          </div>

          {/* Price */}
          {course.isPaid ? (
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
              <DollarSign className="h-4 w-4" />
              {course.price}
            </div>
          ) : (
            <span className="text-green-600 dark:text-green-400 font-bold">
              FREE
            </span>
          )}
        </div>

        {/* Enroll button */}
        <Button
          className="w-full mt-4"
          onClick={handleEnroll}
        >
          {course.isPaid ? 'Enroll Now' : 'Start Learning'}
        </Button>
      </div>
    </motion.div>
  );
}
