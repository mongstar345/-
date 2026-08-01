import { Search, Play, CheckCircle2, Clock, Users, Award, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useState, useRef } from 'react';
import CoursePlayer from './CoursePlayer';
import { useTheme } from '../contexts/ThemeContext';

interface Course {
  id: number;
  code: string;
  title: string;
  instructor: string;
  instructorTitle?: string;
  thumbnail: string;
  progress?: number;
  totalLectures: number;
  completedLectures?: number;
  rating: number;
  enrolled: number;
  price: string;
  category: string;
  duration: string;
  level: string;
  isEnrolled?: boolean;
}

function getTitleColor(title?: string): string {
  if (!title) return 'text-gray-600';
  if (title.startsWith('Prof.')) return 'text-purple-600';
  if (title.startsWith('Asstprof')) return 'text-blue-600';
  if (title.startsWith('Letr')) return 'text-teal-600';
  if (title.startsWith('T.A')) return 'text-green-600';
  if (title.startsWith('St.')) return 'text-orange-600';
  return 'text-gray-600';
}

export function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { colors } = useTheme();

  const categories = [
    {
      name: 'Programming & Development',
      courses: [
        {
          id: 1,
          code: 'CS301',
          title: 'Advanced Data Structures & Algorithms',
          instructor: 'Prof. Richard Coleman',
          instructorTitle: 'Prof.',
          thumbnail: 'https://images.unsplash.com/photo-1666281269793-da06484657e8?w=600',
          progress: 68,
          totalLectures: 24,
          completedLectures: 16,
          rating: 4.8,
          enrolled: 145,
          price: 'Free',
          category: 'Programming',
          duration: '12 weeks',
          level: 'Advanced',
          isEnrolled: true,
        },
        {
          id: 2,
          code: 'CS201',
          title: 'Python Programming for Beginners',
          instructor: 'Letr. Ahmed Hadi',
          instructorTitle: 'Letr.',
          thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600',
          totalLectures: 18,
          rating: 4.6,
          enrolled: 234,
          price: 'Free',
          category: 'Programming',
          duration: '8 weeks',
          level: 'Beginner',
          isEnrolled: false,
        },
        {
          id: 3,
          code: 'CS302',
          title: 'Web Development Bootcamp',
          instructor: 'T.A Doha Ahmed',
          instructorTitle: 'T.A',
          thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',
          progress: 45,
          totalLectures: 30,
          completedLectures: 14,
          rating: 4.7,
          enrolled: 198,
          price: 'Free',
          category: 'Web Dev',
          duration: '10 weeks',
          level: 'Intermediate',
          isEnrolled: true,
        },
        {
          id: 4,
          code: 'CS401',
          title: 'Mobile App Development with React Native',
          instructor: 'Asstprof. Maryam Hussein',
          instructorTitle: 'Asstprof.',
          thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
          totalLectures: 22,
          rating: 4.5,
          enrolled: 167,
          price: 'Free',
          category: 'Mobile Dev',
          duration: '9 weeks',
          level: 'Intermediate',
          isEnrolled: false,
        },
      ],
    },
    {
      name: 'Artificial Intelligence & Machine Learning',
      courses: [
        {
          id: 5,
          code: 'AI301',
          title: 'Machine Learning Fundamentals',
          instructor: 'Prof. Sarah Johnson',
          instructorTitle: 'Prof.',
          thumbnail: 'https://images.unsplash.com/photo-1762330918491-f4288a62adb8?w=600',
          progress: 32,
          totalLectures: 28,
          completedLectures: 9,
          rating: 4.9,
          enrolled: 312,
          price: 'Free',
          category: 'AI/ML',
          duration: '14 weeks',
          level: 'Advanced',
          isEnrolled: true,
        },
        {
          id: 6,
          code: 'AI401',
          title: 'Deep Learning with TensorFlow',
          instructor: 'Prof. Omar Ali',
          instructorTitle: 'Prof.',
          thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
          totalLectures: 32,
          rating: 4.8,
          enrolled: 289,
          price: 'Free',
          category: 'AI/ML',
          duration: '16 weeks',
          level: 'Advanced',
          isEnrolled: false,
        },
        {
          id: 7,
          code: 'AI201',
          title: 'Introduction to Neural Networks',
          instructor: 'Letr. Hassan Ali',
          instructorTitle: 'Letr.',
          thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
          totalLectures: 20,
          rating: 4.6,
          enrolled: 223,
          price: 'Free',
          category: 'AI/ML',
          duration: '10 weeks',
          level: 'Intermediate',
          isEnrolled: false,
        },
      ],
    },
    {
      name: 'Data Science & Analytics',
      courses: [
        {
          id: 8,
          code: 'DS301',
          title: 'Data Analysis with Python',
          instructor: 'Asstprof. Fatima Noor',
          instructorTitle: 'Asstprof.',
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
          progress: 55,
          totalLectures: 25,
          completedLectures: 14,
          rating: 4.7,
          enrolled: 267,
          price: 'Free',
          category: 'Data Science',
          duration: '11 weeks',
          level: 'Intermediate',
          isEnrolled: true,
        },
        {
          id: 9,
          code: 'DS201',
          title: 'Statistics for Data Science',
          instructor: 'Prof. Ahmed Khalid',
          instructorTitle: 'Prof.',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
          totalLectures: 18,
          rating: 4.5,
          enrolled: 198,
          price: 'Free',
          category: 'Data Science',
          duration: '8 weeks',
          level: 'Beginner',
          isEnrolled: false,
        },
        {
          id: 10,
          code: 'DS401',
          title: 'Big Data Processing with Spark',
          instructor: 'Letr. Ali Mohammed',
          instructorTitle: 'Letr.',
          thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600',
          totalLectures: 26,
          rating: 4.8,
          enrolled: 145,
          price: 'Free',
          category: 'Data Science',
          duration: '12 weeks',
          level: 'Advanced',
          isEnrolled: false,
        },
      ],
    },
    {
      name: 'Database Management',
      courses: [
        {
          id: 11,
          code: 'DB301',
          title: 'Database Systems & Design',
          instructor: 'Prof. Sarah Ahmed',
          instructorTitle: 'Prof.',
          thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
          progress: 92,
          totalLectures: 20,
          completedLectures: 18,
          rating: 4.9,
          enrolled: 189,
          price: 'Free',
          category: 'Databases',
          duration: '10 weeks',
          level: 'Intermediate',
          isEnrolled: true,
        },
        {
          id: 12,
          code: 'DB401',
          title: 'Advanced SQL & Query Optimization',
          instructor: 'Asstprof. Layla Hassan',
          instructorTitle: 'Asstprof.',
          thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600',
          totalLectures: 22,
          rating: 4.7,
          enrolled: 156,
          price: 'Free',
          category: 'Databases',
          duration: '9 weeks',
          level: 'Advanced',
          isEnrolled: false,
        },
      ],
    },
  ];

  const ScrollContainer = ({ children, id }: { children: React.ReactNode; id: string }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const scrollAmount = 300;
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });
      }
    };

    return (
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    );
  };

  // If course player is open, show it
  if (selectedCourseId !== null) {
    return <CoursePlayer courseId={selectedCourseId} onClose={() => setSelectedCourseId(null)} />;
  }

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20`}>
      {/* Header with Search */}
      <div className={`${colors.bgPrimary} px-4 py-4 border-b ${colors.border}`}>
        <h1 className={`text-xl font-semibold mb-4 ${colors.textPrimary}`}>Courses</h1>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${colors.textSecondary}`} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${colors.border} ${colors.bgSecondary} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${colors.textPrimary}`}
          />
        </div>
      </div>

      {/* Categories with Horizontal Scrollable Courses */}
      <div className="py-4 space-y-6">
        {categories.map((category) => (
          <div key={category.name}>
            {/* Category Header */}
            <div className="px-4 mb-3 flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${colors.textPrimary}`}>{category.name}</h2>
              <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                See All
              </Button>
            </div>

            {/* Horizontal Scrollable Courses */}
            <ScrollContainer id={category.name}>
              {category.courses.map((course) => (
                <div
                  key={course.id}
                  className={`flex-shrink-0 w-[300px] ${colors.bgPrimary} rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer border ${colors.border}`}
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  {/* Course Thumbnail */}
                  <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Course Code */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white text-blue-600 font-semibold">
                        {course.code}
                      </Badge>
                    </div>

                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/60 text-white backdrop-blur-sm">
                        {course.level}
                      </Badge>
                    </div>

                    {/* Play Icon for enrolled courses */}
                    {course.isEnrolled && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <Play className="h-8 w-8 text-white fill-white" />
                        </div>
                      </div>
                    )}

                    {/* Progress Bar for enrolled courses */}
                    {course.isEnrolled && course.progress !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="flex items-center justify-between text-white text-xs mb-1">
                          <span>{course.completedLectures}/{course.totalLectures} lectures</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5 bg-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="p-4">
                    <h3 className={`text-sm font-semibold mb-1 line-clamp-2 ${colors.textPrimary}`}>{course.title}</h3>
                    <div className="flex items-center gap-1.5 mb-3">
                      {course.instructorTitle && (
                        <span className={`text-xs ${getTitleColor(course.instructorTitle)}`}>
                          {course.instructorTitle}
                        </span>
                      )}
                      <span className={`text-xs ${colors.textSecondary}`}>{course.instructor}</span>
                    </div>

                    {/* Stats */}
                    <div className={`flex items-center gap-3 mb-3 text-xs ${colors.textSecondary}`}>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.enrolled}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                    </div>

                    {/* Action Button */}
                    {course.isEnrolled ? (
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white w-full h-9"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourseId(course.id);
                        }}
                      >
                        <Play className="h-3.5 w-3.5 mr-1.5" />
                        Continue Learning
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full h-9 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle enrollment
                        }}
                      >
                        Enroll Now • {course.price}
                      </Button>
                    )}
                  </div>

                  {/* Footer */}
                  <div className={`${colors.bgSecondary} px-4 py-2 border-t ${colors.border} flex items-center justify-between text-xs`}>
                    <span className={colors.textSecondary}>{course.totalLectures} lectures</span>
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </ScrollContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;