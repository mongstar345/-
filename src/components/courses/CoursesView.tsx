import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, TrendingUp, Clock, Star, ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CourseCard } from './CourseCard';
import { Course } from '../../types';
import { useDebounce } from '../../hooks/performance';

// Mock courses data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    description: 'Master advanced React patterns including hooks, context, and performance optimization',
    thumbnailUrl: null,
    instructor: 'Dr. Sarah Johnson',
    instructorAvatar: null,
    duration: 480, // 8 hours
    level: 'advanced',
    category: 'Programming',
    rating: 4.8,
    studentsCount: 1234,
    lessonsCount: 42,
    price: 49.99,
    isPaid: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning and AI with Python',
    thumbnailUrl: null,
    instructor: 'Prof. Ahmed Ali',
    instructorAvatar: null,
    duration: 600, // 10 hours
    level: 'beginner',
    category: 'Data Science',
    rating: 4.9,
    studentsCount: 2341,
    lessonsCount: 56,
    price: 0,
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    description: 'Complete guide to modern user interface and experience design',
    thumbnailUrl: null,
    instructor: 'Mohammed Hassan',
    instructorAvatar: null,
    duration: 720, // 12 hours
    level: 'intermediate',
    category: 'Design',
    rating: 4.7,
    studentsCount: 987,
    lessonsCount: 38,
    price: 39.99,
    isPaid: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categories = ['All', 'Programming', 'Data Science', 'Design', 'Business', 'Marketing'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

export default function CoursesView() {
  const [courses] = useState<Course[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter and sort courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      course.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    
    const matchesLevel = selectedLevel === 'All Levels' || 
      course.level.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
            <p className="text-lg text-blue-100 mb-8">
              Discover world-class courses from expert instructors
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-white dark:bg-gray-900"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Filter toggle button (mobile) */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="h-4 w-4" />
                {filteredCourses.length} courses found
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Levels */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedLevel === level
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Courses grid */}
        {filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load more button */}
        {filteredCourses.length > 0 && (
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline">
              Load More Courses
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
