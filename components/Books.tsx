import { Search, Download, BookOpen, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useState, useRef } from 'react';
import BookReader from './BookReader';
import { useTheme } from '../contexts/ThemeContext';

interface Book {
  id: number;
  title: string;
  author: string;
  authorTitle?: string;
  course: string;
  coverImage: string;
  category: string;
  pages: number;
  readProgress?: number;
  rating: number;
  downloads: number;
  size: string;
  format: string;
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

export function Books() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const { colors } = useTheme();

  const categories = [
    {
      name: 'Computer Science',
      books: [
        {
          id: 1,
          title: 'Advanced Data Structures',
          author: 'Prof. Richard Coleman',
          authorTitle: 'Prof.',
          course: 'CS301',
          coverImage: 'https://images.unsplash.com/photo-1666281269793-da06484657e8?w=400',
          category: 'Programming',
          pages: 456,
          readProgress: 65,
          rating: 4.8,
          downloads: 234,
          size: '15.2 MB',
          format: 'PDF',
        },
        {
          id: 2,
          title: 'Machine Learning Fundamentals',
          author: 'Letr. Ahmed Hadi',
          authorTitle: 'Letr.',
          course: 'CS401',
          coverImage: 'https://images.unsplash.com/photo-1762330918491-f4288a62adb8?w=400',
          category: 'AI/ML',
          pages: 380,
          readProgress: 32,
          rating: 4.6,
          downloads: 189,
          size: '12.8 MB',
          format: 'PDF',
        },
        {
          id: 3,
          title: 'Operating Systems Concepts',
          author: 'Prof. Sarah Johnson',
          authorTitle: 'Prof.',
          course: 'CS303',
          coverImage: 'https://images.unsplash.com/photo-1706528010331-0f12582db334?w=400',
          category: 'Systems',
          pages: 520,
          readProgress: 85,
          rating: 4.9,
          downloads: 312,
          size: '18.5 MB',
          format: 'PDF',
        },
        {
          id: 4,
          title: 'Database Management Systems',
          author: 'T.A Doha Ahmed',
          authorTitle: 'T.A',
          course: 'CS302',
          coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
          category: 'Databases',
          pages: 420,
          rating: 4.7,
          downloads: 298,
          size: '14.3 MB',
          format: 'PDF',
        },
      ],
    },
    {
      name: 'Mathematics',
      books: [
        {
          id: 5,
          title: 'Linear Algebra and Applications',
          author: 'Asstprof. Maryam Hussein',
          authorTitle: 'Asstprof.',
          course: 'MATH201',
          coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
          category: 'Mathematics',
          pages: 380,
          readProgress: 45,
          rating: 4.5,
          downloads: 187,
          size: '11.5 MB',
          format: 'PDF',
        },
        {
          id: 6,
          title: 'Calculus: Early Transcendentals',
          author: 'Prof. Omar Ali',
          authorTitle: 'Prof.',
          course: 'MATH101',
          coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
          category: 'Mathematics',
          pages: 650,
          rating: 4.8,
          downloads: 423,
          size: '22.1 MB',
          format: 'PDF',
        },
        {
          id: 7,
          title: 'Discrete Mathematics',
          author: 'Letr. Hassan Ali',
          authorTitle: 'Letr.',
          course: 'MATH202',
          coverImage: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400',
          category: 'Mathematics',
          pages: 410,
          readProgress: 20,
          rating: 4.6,
          downloads: 256,
          size: '13.7 MB',
          format: 'PDF',
        },
      ],
    },
    {
      name: 'Engineering',
      books: [
        {
          id: 8,
          title: 'Digital Logic Design',
          author: 'Prof. Ahmed Khalid',
          authorTitle: 'Prof.',
          course: 'ENG201',
          coverImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
          category: 'Engineering',
          pages: 340,
          rating: 4.4,
          downloads: 145,
          size: '10.2 MB',
          format: 'PDF',
        },
        {
          id: 9,
          title: 'Circuit Analysis',
          author: 'Asstprof. Fatima Noor',
          authorTitle: 'Asstprof.',
          course: 'ENG102',
          coverImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400',
          category: 'Engineering',
          pages: 290,
          readProgress: 55,
          rating: 4.3,
          downloads: 178,
          size: '9.8 MB',
          format: 'PDF',
        },
        {
          id: 10,
          title: 'Microprocessors and Interfacing',
          author: 'Letr. Ali Mohammed',
          authorTitle: 'Letr.',
          course: 'ENG301',
          coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
          category: 'Engineering',
          pages: 385,
          rating: 4.7,
          downloads: 203,
          size: '12.4 MB',
          format: 'PDF',
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

  // If book reader is open, show it
  if (selectedBookId !== null) {
    return <BookReader bookId={selectedBookId} onClose={() => setSelectedBookId(null)} />;
  }

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20`}>
      {/* Header with Search */}
      <div className={`${colors.bgPrimary} px-4 py-4 border-b ${colors.border}`}>
        <h1 className={`text-xl font-semibold mb-4 ${colors.textPrimary}`}>Library</h1>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${colors.textSecondary}`} />
          <input
            type="text"
            placeholder="Search books, authors, courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${colors.border} ${colors.bgSecondary} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${colors.textPrimary}`}
          />
        </div>
      </div>

      {/* Categories with Horizontal Scrollable Books */}
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

            {/* Horizontal Scrollable Books */}
            <ScrollContainer id={category.name}>
              {category.books.map((book) => (
                <div
                  key={book.id}
                  className={`flex-shrink-0 w-[280px] ${colors.bgPrimary} rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer border ${colors.border}`}
                  onClick={() => setSelectedBookId(book.id)}
                >
                  {/* Book Cover */}
                  <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/60 text-white backdrop-blur-sm">
                        {book.course}
                      </Badge>
                    </div>
                    {book.readProgress !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="flex items-center justify-between text-white text-xs mb-1">
                          <span>Progress</span>
                          <span>{book.readProgress}%</span>
                        </div>
                        <Progress value={book.readProgress} className="h-1.5 bg-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-4">
                    <h3 className={`text-sm font-semibold mb-1 line-clamp-2 ${colors.textPrimary}`}>{book.title}</h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      {book.authorTitle && (
                        <span className={`text-xs ${getTitleColor(book.authorTitle)}`}>
                          {book.authorTitle}
                        </span>
                      )}
                      <span className={`text-xs ${colors.textSecondary}`}>{book.author}</span>
                    </div>

                    {/* Stats */}
                    <div className={`flex items-center gap-3 mb-3 text-xs ${colors.textSecondary}`}>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {book.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {book.downloads}
                      </span>
                      <span>{book.pages}p</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white flex-1 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBookId(book.id);
                        }}
                      >
                        <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                        {book.readProgress ? 'Continue' : 'Read'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={`${colors.bgSecondary} px-4 py-2 border-t ${colors.border} flex items-center justify-between text-xs ${colors.textSecondary}`}>
                    <span>{book.format} • {book.size}</span>
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

export default Books;