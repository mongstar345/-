import { useState } from 'react';
import { Search, Calendar, Clock, MapPin, Users, MessageSquare, Heart, Share2, Bell, BellOff, ChevronRight, Filter, Video, Mic, ThumbsUp, Send, BookOpen, Award, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  role: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
}

interface Seminar {
  id: number;
  title: string;
  titleEn?: string;
  speaker: string;
  speakerTitle: string;
  speakerAvatar: string;
  department: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  type: 'online' | 'onsite' | 'hybrid';
  category: string;
  tags: string[];
  description: string;
  attendees: number;
  maxAttendees: number;
  isRegistered: boolean;
  hasReminder: boolean;
  coverImage: string;
  status: 'upcoming' | 'ongoing' | 'past';
  comments: Comment[];
}

const CATEGORIES = ['الكل', 'علمي', 'تقني', 'صحي', 'ثقافي', 'مهني', 'بحثي'];

export function Seminars() {
  const { colors, theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [seminars, setSeminars] = useState<Seminar[]>([
    {
      id: 1,
      title: 'الذكاء الاصطناعي وتطبيقاته في الطب',
      titleEn: 'AI Applications in Medicine',
      speaker: 'أ.د. أحمد محمد الحسيني',
      speakerTitle: 'Prof.',
      speakerAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      department: 'كلية الهندسة / قسم الحاسوب',
      date: '2025/12/05',
      time: '10:00 صباحاً',
      duration: '2 ساعة',
      location: 'قاعة المؤتمرات الكبرى',
      type: 'hybrid',
      category: 'علمي',
      tags: ['AI', 'طب', 'تقنية'],
      description: 'ندوة علمية متخصصة تتناول أحدث تطبيقات الذكاء الاصطناعي في المجال الطبي، من التشخيص الطبي إلى تصميم الأدوية وتحليل الصور الطبية بالذكاء الاصطناعي.',
      attendees: 142,
      maxAttendees: 200,
      isRegistered: true,
      hasReminder: true,
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      status: 'upcoming',
      comments: [
        { id: 1, author: 'علي حسين', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', role: 'طالب', content: 'موضوع رائع جداً، هل ستكون هناك تسجيلات متاحة بعد الندوة؟', time: '3 ساعات', likes: 12, liked: false },
        { id: 2, author: 'م.م. نور خالد', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', role: 'مدرس مساعد', content: 'أتمنى تغطية موضوع التشخيص بالصور الطبية بشكل مفصل', time: '5 ساعات', likes: 8, liked: true },
      ],
    },
    {
      id: 2,
      title: 'مستقبل البرمجة في عصر الذكاء الاصطناعي',
      speaker: 'م.د. سارة عبد الله',
      speakerTitle: 'Asstprof.',
      speakerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      department: 'قسم هندسة الحاسوب',
      date: '2025/12/08',
      time: '2:00 مساءً',
      duration: '90 دقيقة',
      location: 'Zoom / رابط سيُرسل لاحقاً',
      type: 'online',
      category: 'تقني',
      tags: ['برمجة', 'مستقبل', 'AI'],
      description: 'كيف سيغير الذكاء الاصطناعي مستقبل مهنة المبرمج؟ ندوة تفاعلية تتناول أدوات AI الحديثة مثل GitHub Copilot وChatGPT وتأثيرها على سوق العمل التقني.',
      attendees: 89,
      maxAttendees: 150,
      isRegistered: false,
      hasReminder: false,
      coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
      status: 'upcoming',
      comments: [
        { id: 1, author: 'زينب محمد', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400', role: 'طالبة', content: 'هل ستتطرقوا إلى سوق العمل في العراق تحديداً؟', time: '1 يوم', likes: 6, liked: false },
      ],
    },
    {
      id: 3,
      title: 'الصحة النفسية لطلاب الجامعة',
      speaker: 'د. ليلى حسن الموسوي',
      speakerTitle: 'Dr.',
      speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      department: 'وحدة الإرشاد النفسي',
      date: '2025/11/28',
      time: '11:00 صباحاً',
      duration: '2 ساعة',
      location: 'قاعة 204 - مبنى العمادة',
      type: 'onsite',
      category: 'صحي',
      tags: ['صحة نفسية', 'طلاب', 'ضغط الدراسة'],
      description: 'ندوة توعوية حول الصحة النفسية وكيفية التعامل مع ضغوط الدراسة الجامعية، وأساليب إدارة الوقت والتوازن بين الدراسة والحياة الشخصية.',
      attendees: 67,
      maxAttendees: 80,
      isRegistered: true,
      hasReminder: false,
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      status: 'past',
      comments: [
        { id: 1, author: 'محمد علي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', role: 'طالب', content: 'كانت ندوة مفيدة جداً، شكراً للدكتورة ليلى على المعلومات القيّمة', time: '2 أيام', likes: 24, liked: true },
        { id: 2, author: 'أ.م. رضا كريم', avatar: 'https://images.unsplash.com/photo-1544168190-79c17527004f?w=400', role: 'أستاذ مساعد', content: 'نتمنى تكرار مثل هذه الفعاليات بشكل منتظم', time: '2 أيام', likes: 15, liked: false },
      ],
    },
    {
      id: 4,
      title: 'تقنيات الحوسبة السحابية والأمن السيبراني',
      speaker: 'أ.م.د. عمر فاضل',
      speakerTitle: 'Prof.',
      speakerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      department: 'قسم الشبكات والأمن المعلوماتي',
      date: '2025/12/10',
      time: '9:00 صباحاً',
      duration: '3 ساعات',
      location: 'مختبر الحوسبة المتقدمة',
      type: 'onsite',
      category: 'بحثي',
      tags: ['سحابة', 'أمن', 'شبكات'],
      description: 'ورشة عمل متخصصة تتناول مفاهيم الحوسبة السحابية الحديثة وأبرز التحديات الأمنية، مع تطبيقات عملية على AWS وAzure.',
      attendees: 35,
      maxAttendees: 50,
      isRegistered: false,
      hasReminder: true,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      status: 'upcoming',
      comments: [],
    },
  ]);

  const toggleRegistration = (id: number) => {
    setSeminars(prev => prev.map(s =>
      s.id === id ? { ...s, isRegistered: !s.isRegistered, attendees: s.isRegistered ? s.attendees - 1 : s.attendees + 1 } : s
    ));
    if (selectedSeminar?.id === id) {
      setSelectedSeminar(prev => prev ? { ...prev, isRegistered: !prev.isRegistered, attendees: prev.isRegistered ? prev.attendees - 1 : prev.attendees + 1 } : null);
    }
  };

  const toggleReminder = (id: number) => {
    setSeminars(prev => prev.map(s =>
      s.id === id ? { ...s, hasReminder: !s.hasReminder } : s
    ));
    if (selectedSeminar?.id === id) {
      setSelectedSeminar(prev => prev ? { ...prev, hasReminder: !prev.hasReminder } : null);
    }
  };

  const toggleCommentLike = (seminarId: number, commentId: number) => {
    const updateComments = (s: Seminar) => s.id === seminarId
      ? { ...s, comments: s.comments.map(c => c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c) }
      : s;
    setSeminars(prev => prev.map(updateComments));
    setSelectedSeminar(prev => prev && prev.id === seminarId ? updateComments(prev) : prev);
  };

  const addComment = (seminarId: number) => {
    if (!commentInput.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: 'أنت',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      role: 'طالب',
      content: commentInput,
      time: 'الآن',
      likes: 0,
      liked: false,
    };
    const updateSeminar = (s: Seminar) => s.id === seminarId ? { ...s, comments: [...s.comments, newComment] } : s;
    setSeminars(prev => prev.map(updateSeminar));
    setSelectedSeminar(prev => prev && prev.id === seminarId ? updateSeminar(prev) : prev);
    setCommentInput('');
  };

  const filtered = seminars.filter(s => {
    const matchCat = activeCategory === 'الكل' || s.category === activeCategory;
    const matchSearch = !searchQuery || s.title.includes(searchQuery) || s.speaker.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const typeIcon = (type: string) => {
    if (type === 'online') return <Video className="w-3.5 h-3.5" />;
    if (type === 'hybrid') return <Mic className="w-3.5 h-3.5" />;
    return <MapPin className="w-3.5 h-3.5" />;
  };

  const typeLabel = (type: string) => ({ online: 'عبر الإنترنت', onsite: 'حضوري', hybrid: 'هجين' }[type] || type);
  const typeColor = (type: string) => ({ online: 'bg-green-500/20 text-green-400', onsite: 'bg-blue-500/20 text-blue-400', hybrid: 'bg-purple-500/20 text-purple-400' }[type] || '');
  const statusColor = (status: string) => ({ upcoming: 'bg-amber-500/20 text-amber-400', ongoing: 'bg-green-500/20 text-green-400', past: 'bg-gray-500/20 text-gray-400' }[status] || '');
  const statusLabel = (status: string) => ({ upcoming: 'قادم', ongoing: 'جارٍ الآن', past: 'انتهى' }[status] || status);

  const getSpeakerTitleColor = (title: string) => {
    if (title.startsWith('Prof.') || title.startsWith('أ.د.')) return 'text-purple-500';
    if (title.startsWith('Asstprof.') || title.startsWith('أ.م.')) return 'text-blue-500';
    if (title.startsWith('Dr.') || title.startsWith('د.')) return 'text-teal-500';
    return 'text-green-500';
  };

  if (selectedSeminar) {
    return (
      <div className={`min-h-screen ${colors.bgSecondary} max-w-md mx-auto pb-20`}>
        {/* Cover Image */}
        <div className="relative h-52">
          <img src={selectedSeminar.coverImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button
            onClick={() => setSelectedSeminar(null)}
            className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white p-2 rounded-full"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="absolute bottom-4 right-4 left-4">
            <div className="flex gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor(selectedSeminar.type)} flex items-center gap-1`}>
                {typeIcon(selectedSeminar.type)} {typeLabel(selectedSeminar.type)}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(selectedSeminar.status)}`}>
                {statusLabel(selectedSeminar.status)}
              </span>
            </div>
            <h2 className="text-white text-lg font-bold leading-snug" dir="rtl">{selectedSeminar.title}</h2>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-4" dir="rtl">
          {/* Speaker */}
          <div className={`${colors.cardBg} rounded-2xl p-4 flex items-center gap-3 border ${colors.border}`}>
            <Avatar className="h-14 w-14">
              <AvatarImage src={selectedSeminar.speakerAvatar} />
              <AvatarFallback>{selectedSeminar.speaker[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className={`font-semibold ${colors.textPrimary}`}>{selectedSeminar.speaker}</p>
              <p className={`text-sm ${getSpeakerTitleColor(selectedSeminar.speakerTitle)}`}>{selectedSeminar.department}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border} grid grid-cols-2 gap-3`}>
            {[
              { icon: Calendar, label: 'التاريخ', value: selectedSeminar.date },
              { icon: Clock, label: 'الوقت', value: selectedSeminar.time },
              { icon: MapPin, label: 'المكان', value: selectedSeminar.location },
              { icon: Users, label: 'المسجلون', value: `${selectedSeminar.attendees} / ${selectedSeminar.maxAttendees}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className={`text-xs ${colors.textTertiary}`}>{label}</p>
                  <p className={`text-sm font-medium ${colors.textPrimary} leading-tight`}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
            <div className="flex justify-between text-sm mb-2">
              <span className={colors.textSecondary}>نسبة الامتلاء</span>
              <span className={`font-semibold ${colors.textPrimary}`}>{Math.round((selectedSeminar.attendees / selectedSeminar.maxAttendees) * 100)}%</span>
            </div>
            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                style={{ width: `${(selectedSeminar.attendees / selectedSeminar.maxAttendees) * 100}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
            <h3 className={`font-semibold ${colors.textPrimary} mb-2`}>عن الندوة</h3>
            <p className={`text-sm ${colors.textSecondary} leading-relaxed`}>{selectedSeminar.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {selectedSeminar.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {selectedSeminar.status !== 'past' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleRegistration(selectedSeminar.id)}
                className={`py-3 rounded-xl font-semibold text-sm transition-all ${selectedSeminar.isRegistered ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'}`}
              >
                {selectedSeminar.isRegistered ? 'إلغاء التسجيل' : 'تسجيل الحضور'}
              </button>
              <button
                onClick={() => toggleReminder(selectedSeminar.id)}
                className={`py-3 rounded-xl font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${selectedSeminar.hasReminder ? `${colors.bgTertiary} ${colors.textPrimary} ${colors.border}` : `${colors.bgTertiary} text-amber-500 border-amber-500/30`}`}
              >
                {selectedSeminar.hasReminder ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                {selectedSeminar.hasReminder ? 'إلغاء التذكير' : 'تذكيري'}
              </button>
            </div>
          )}

          {/* Comments */}
          <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
            <h3 className={`font-semibold ${colors.textPrimary} mb-3 flex items-center gap-2`}>
              <MessageSquare className="w-5 h-5 text-blue-500" />
              التعليقات ({selectedSeminar.comments.length})
            </h3>

            <div className="space-y-3 mb-4">
              {selectedSeminar.comments.length === 0 && (
                <p className={`text-sm ${colors.textTertiary} text-center py-4`}>لا توجد تعليقات بعد، كن أول من يعلّق!</p>
              )}
              {selectedSeminar.comments.map(comment => (
                <div key={comment.id} className={`flex gap-3 p-3 rounded-xl ${colors.bgSecondary}`}>
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className={`text-sm font-medium ${colors.textPrimary}`}>{comment.author}</span>
                        <span className={`text-xs ${colors.textTertiary} mr-2`}>{comment.role}</span>
                      </div>
                      <span className={`text-xs ${colors.textTertiary}`}>{comment.time}</span>
                    </div>
                    <p className={`text-sm ${colors.textSecondary} leading-relaxed`}>{comment.content}</p>
                    <button
                      onClick={() => toggleCommentLike(selectedSeminar.id, comment.id)}
                      className={`flex items-center gap-1 mt-1.5 text-xs ${comment.liked ? 'text-blue-500' : colors.textTertiary} hover:text-blue-500 transition-colors`}
                    >
                      <ThumbsUp className="w-3 h-3" /> {comment.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={`flex gap-2 p-2 rounded-xl border ${colors.border} ${colors.bgSecondary}`}>
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment(selectedSeminar.id)}
                placeholder="اكتب تعليقاً..."
                className={`flex-1 bg-transparent text-sm ${colors.textPrimary} placeholder:${colors.textTertiary} focus:outline-none px-2`}
                dir="rtl"
              />
              <button
                onClick={() => addComment(selectedSeminar.id)}
                disabled={!commentInput.trim()}
                className="p-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white rounded-lg transition-all"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.bgSecondary} max-w-md mx-auto pb-20`}>
      {/* Header */}
      <div className={`${colors.bgPrimary} px-4 py-4 border-b ${colors.border} sticky top-0 z-10`}>
        <div className="flex items-center justify-between mb-3" dir="rtl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h1 className={`text-xl font-bold ${colors.textPrimary}`}>الندوات</h1>
          </div>
          <button className={`${colors.bgTertiary} ${colors.textSecondary} p-2 rounded-xl`}>
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${colors.textTertiary}`} />
          <input
            type="text"
            placeholder="ابحث عن ندوة..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pr-10 pl-4 py-2.5 rounded-xl border ${colors.border} ${colors.bgSecondary} text-sm ${colors.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            dir="rtl"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide" dir="rtl">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${activeCategory === cat ? 'bg-blue-500 text-white' : `${colors.bgTertiary} ${colors.textSecondary}`}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 px-4 py-3" dir="rtl">
        {[
          { label: 'الكل', value: seminars.length, color: 'from-blue-500 to-indigo-600' },
          { label: 'قادمة', value: seminars.filter(s => s.status === 'upcoming').length, color: 'from-amber-500 to-orange-500' },
          { label: 'مسجّل', value: seminars.filter(s => s.isRegistered).length, color: 'from-green-500 to-teal-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-3 text-white text-center`}>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs opacity-80">{label}</div>
          </div>
        ))}
      </div>

      {/* Seminar Cards */}
      <div className="px-4 space-y-4 pb-4">
        {filtered.map(seminar => (
          <motion.div
            key={seminar.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${colors.cardBg} rounded-2xl overflow-hidden border ${colors.border} shadow-sm cursor-pointer`}
            onClick={() => setSelectedSeminar(seminar)}
          >
            {/* Cover */}
            <div className="relative h-36">
              <img src={seminar.coverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-3 right-3 flex gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full backdrop-blur-sm ${typeColor(seminar.type)} flex items-center gap-1`}>
                  {typeIcon(seminar.type)} {typeLabel(seminar.type)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full backdrop-blur-sm ${statusColor(seminar.status)}`}>
                  {statusLabel(seminar.status)}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1">
                <Tag className="w-3 h-3 text-white/70" />
                <span className="text-white/70 text-xs">{seminar.category}</span>
              </div>
            </div>

            <div className="p-4" dir="rtl">
              <h3 className={`font-bold ${colors.textPrimary} mb-2 leading-snug`}>{seminar.title}</h3>

              {/* Speaker */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={seminar.speakerAvatar} />
                  <AvatarFallback className="text-xs">{seminar.speaker[0]}</AvatarFallback>
                </Avatar>
                <span className={`text-sm ${colors.textSecondary}`}>{seminar.speaker}</span>
              </div>

              {/* Info Row */}
              <div className={`flex gap-4 text-xs ${colors.textTertiary} mb-3`}>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {seminar.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {seminar.time}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-xs ${colors.textTertiary}`}>
                    <Users className="w-3.5 h-3.5" /> {seminar.attendees}/{seminar.maxAttendees}
                  </span>
                  <span className={`flex items-center gap-1 text-xs ${colors.textTertiary}`}>
                    <MessageSquare className="w-3.5 h-3.5" /> {seminar.comments.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {seminar.hasReminder && <Bell className="w-4 h-4 text-amber-500" />}
                  {seminar.isRegistered && (
                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full">مسجّل</span>
                  )}
                  <ChevronRight className={`w-4 h-4 ${colors.textTertiary} rotate-180`} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className={`w-16 h-16 ${colors.textTertiary} mx-auto mb-3 opacity-50`} />
            <p className={`${colors.textSecondary}`}>لا توجد ندوات مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
}
