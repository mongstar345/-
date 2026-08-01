import { Search, TrendingUp, MapPin, Users, Calendar, BookOpen, Award, Heart } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { PostCard } from './PostCard';
import { Stories } from './Stories';
import { ReelCard } from './ReelCard';
import { ReelsViewer } from './ReelsViewer';
import { useTheme } from '../contexts/ThemeContext';

export function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showReelsViewer, setShowReelsViewer] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);
  const { colors } = useTheme();

  // Posts data with different types
  const posts = [
    // Text-only post
    {
      id: 1,
      author: {
        name: 'Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        title: 'Prof.',
      },
      content: 'مرحباً بكم في الفصل الدراسي الجديد! سنبدأ بمقدمة عن علوم البيانات والذكاء الاصطناعي. سيكون هذا الفصل مليئاً بالتحديات والإنجازات، وأتطلع للعمل معكم جميعاً. لا تترددوا في طرح أي أسئلة خلال المحاضرات أو عبر البريد الإلكتروني.',
      timestamp: '2 hours ago',
      likes: 234,
      commentsCount: 12,
      initialComments: [
        {
          id: 1,
          author: {
            name: 'Sara Ali',
            avatar: 'https://i.pravatar.cc/150?img=5',
            title: 'St.'
          },
          content: 'متحمس جداً لهذا الكورس! 🎉',
          timestamp: '1 hour ago',
          likes: 12,
          replies: []
        }
      ]
    },
    // Live stream post
    {
      id: 2,
      author: {
        name: 'Sara Ali',
        avatar: 'https://i.pravatar.cc/150?img=5',
        title: 'T.A',
        isLive: true,
      },
      content: 'بث مباشر الآن: مناقشة حول مشاريع التخرج',
      timestamp: 'Live now',
      image: 'https://images.unsplash.com/photo-1640416639872-93aabd8d91d3?w=600',
      imageTitle: 'Graduation Projects Discussion',
      memberCount: 156,
      hasLiveChat: true,
      likes: 456,
      commentsCount: 89,
    },
    // Single image post
    {
      id: 3,
      author: {
        name: 'Fatima Noor',
        avatar: 'https://i.pravatar.cc/150?img=9',
        title: 'St.',
      },
      content: 'يوم رائع في المكتبة! تحضير لامتحان الكيمياء العضوية 📚',
      timestamp: '8 hours ago',
      image: 'https://images.unsplash.com/photo-1631599143419-ea8539ed4fbd?w=600',
      likes: 321,
      commentsCount: 18,
    },
    // Reel post (type: reel)
    {
      id: 4,
      type: 'reel',
      author: {
        name: 'Omar Khalid',
        avatar: 'https://i.pravatar.cc/150?img=3',
        title: 'Letr.',
      },
      caption: 'تجربة علمية مذهلة في مختبر الكيمياء! 🧪✨',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600',
      views: '12.5K',
      likes: 892,
      comments: 45,
    },
    // Carousel post
    {
      id: 5,
      author: {
        name: 'Youssef Ahmed',
        avatar: 'https://i.pravatar.cc/150?img=12',
        title: 'Asstprof.',
      },
      content: 'ورشة عمل غداً عن تطبيقات التعلم الآلي في الطب. الجميع مدعو للحضور!',
      timestamp: '12 hours ago',
      images: [
        'https://images.unsplash.com/photo-1595315342809-fa10945ed07c?w=600',
        'https://images.unsplash.com/photo-1660485345088-c398363c1f45?w=600',
        'https://images.unsplash.com/photo-1668511237388-404cc7e56e9d?w=600',
      ],
      likes: 654,
      commentsCount: 38,
    },
    // Long video post
    {
      id: 6,
      type: 'video',
      author: {
        name: 'Layla Mohammed',
        avatar: 'https://i.pravatar.cc/150?img=23',
        title: 'Prof.',
      },
      content: 'محاضرة كاملة عن الذكاء الاصطناعي والتعلم العميق 🎓',
      timestamp: '1 day ago',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
      likes: 1234,
      commentsCount: 78,
      videoDuration: '45:30',
    },
    // Text-only post
    {
      id: 7,
      author: {
        name: 'Hussein Ali',
        avatar: 'https://i.pravatar.cc/150?img=15',
        title: 'St.',
      },
      content: 'تم قبول ورقتي البحثية في المؤتمر الدولي للذكاء الاصطناعي! 🎉🎊 شكراً لكل من ساعدني ودعمني في هذه الرحلة. هذا إنجاز كبير بالنسبة لي وأتطلع لمشاركة نتائج بحثي مع المجتمع العلمي.',
      timestamp: '2 days ago',
      likes: 567,
      commentsCount: 34,
    },
    // Reel post
    {
      id: 8,
      type: 'reel',
      author: {
        name: 'Noor Ahmed',
        avatar: 'https://i.pravatar.cc/150?img=47',
        title: 'St.',
      },
      caption: 'رحلة ميدانية إلى متحف العلوم 🏛️',
      thumbnail: 'https://images.unsplash.com/photo-1581093458791-9d58f8c5c8b0?w=600',
      views: '8.2K',
      likes: 456,
      comments: 23,
    },
    // Carousel post with results
    {
      id: 9,
      author: {
        name: 'Dr. Khalid',
        avatar: 'https://i.pravatar.cc/150?img=33',
        title: 'Prof.',
      },
      content: 'نتائج الامتحان النهائي متاحة الآن على البوابة الإلكترونية. تهانينا للجميع! 🎊',
      timestamp: '5 hours ago',
      images: [
        'https://images.unsplash.com/photo-1707944746620-fc0371b91906?w=600',
        'https://images.unsplash.com/photo-1758270704025-0e1a1793e1ca?w=600',
        'https://images.unsplash.com/photo-1706528010331-0f12582db334?w=600',
      ],
      likes: 789,
      commentsCount: 145,
    },
  ];

  // Reels data for viewer
  const reels = posts
    .filter(post => post.type === 'reel')
    .map(post => ({
      id: post.id,
      author: post.author,
      caption: post.caption,
      thumbnail: post.thumbnail,
      views: post.views,
      likes: post.likes,
      comments: post.comments,
    }));

  const handleReelClick = (reelId: number) => {
    const reelIndex = reels.findIndex(r => r.id === reelId);
    if (reelIndex !== -1) {
      setSelectedReelIndex(reelIndex);
      setShowReelsViewer(true);
    }
  };

  return (
    <div className={`${colors.bgSecondary} pb-20 min-h-screen max-w-md mx-auto`}>
      {/* Stories Section */}
      <Stories />

      {/* Posts Feed */}
      <div className="space-y-0">
        {posts.map((post: any) => {
          if (post.isReel) {
            return (
              <ReelCard 
                key={post.id} 
                reel={post as any}
                onReelClick={() => {
                  const reelIndex = posts.filter((p: any) => p.isReel).findIndex((r: any) => r.id === post.id);
                  setSelectedReelIndex(reelIndex);
                  setShowReelsViewer(true);
                }}
              />
            );
          }
          return <PostCard key={post.id} post={post} />;
        })}
      </div>

      {/* Reels Viewer */}
      {showReelsViewer && (
        <ReelsViewer
          reels={reels as any}
          initialIndex={selectedReelIndex}
          onClose={() => setShowReelsViewer(false)}
        />
      )}
    </div>
  );
}

export default Explore;