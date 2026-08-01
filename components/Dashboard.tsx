import { Search, BookOpen, GraduationCap, ClipboardList, Calendar, Clock, Bell, Filter, Users, Library, FlaskConical, Briefcase, Target, Heart, Zap, Book, Award, Coffee, Home, Lightbulb, FileText, TrendingUp, CheckCircle2, AlertCircle, ChevronRight, Star, Flame, Trophy, BarChart3, Sparkles } from 'lucide-react';
import { ChallengesHub } from './ChallengesHub';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { FilterDialog } from './FilterDialog';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { detectTaskService, loadServicePrices, type ServicePrice, type ServiceType } from '../data/services';

function formatIQD(n: number) {
  return n.toLocaleString('ar-IQ') + ' د.ع';
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  report: 'إعداد تقرير',
  presentation: 'إعداد عرض تقديمي',
  homework: 'حل الواجب',
  research: 'كتابة بحث تخرج',
};

const SERVICE_COLORS: Record<ServiceType, string> = {
  report: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300',
  presentation: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300',
  homework: 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-700 dark:text-teal-300',
  research: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300',
};

interface AiServiceChipProps {
  serviceType: ServiceType;
  prices: ServicePrice[];
  onNavigate: () => void;
}

function AiServiceChip({ serviceType, prices, onNavigate }: AiServiceChipProps) {
  const svc = prices.find(p => p.type === serviceType);
  if (!svc) return null;

  const label = SERVICE_LABELS[serviceType];
  const priceText = svc.isCustom
    ? 'بسعر مخصص'
    : svc.min === svc.max
      ? `مقابل ${formatIQD(svc.min)}`
      : `مقابل ${formatIQD(svc.min)} – ${formatIQD(svc.max)}`;

  return (
    <motion.button
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      onClick={onNavigate}
      className={`w-full mt-1.5 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-start ${SERVICE_COLORS[serviceType]} transition-all active:scale-[0.98]`}
    >
      <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold">{label} </span>
        <span className="text-xs opacity-80">{priceText}</span>
      </div>
      <span className="text-[10px] opacity-70 flex-shrink-0">اطلب الآن ←</span>
    </motion.button>
  );
}

const TODAY_SCHEDULE = [
  { time: '9:00', subject: 'Data Structures', room: 'Lab 3', instructor: 'د. أحمد', type: 'lecture', duration: '2h' },
  { time: '11:00', subject: 'English Club', room: 'Hall A', instructor: 'T.A Israa', type: 'club', duration: '1h' },
  { time: '1:00', subject: 'Physics Lab', room: 'Lab 7', instructor: 'T.A Layla', type: 'lab', duration: '2h' },
  { time: '4:00', subject: 'Group Project', room: 'Library', instructor: 'Team', type: 'study', duration: '1.5h' },
];

const ACHIEVEMENTS = [
  { icon: '🏆', label: 'Dean\'s List', color: 'from-yellow-400 to-orange-400' },
  { icon: '🎯', label: 'Perfect Attendance', color: 'from-green-400 to-teal-400' },
  { icon: '⭐', label: 'Top Performer', color: 'from-blue-400 to-indigo-400' },
];

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [activeView, setActiveView] = useState<'tasks' | 'schedule' | 'stats' | 'challenges'>('tasks');
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const { colors } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    setServicePrices(loadServicePrices());
  }, []);

  const filters = [
    { id: 'all', label: t('filter_all'), count: 18, icon: ClipboardList },
    { id: 'academic', label: t('filter_academic'), count: 5, icon: GraduationCap },
    { id: 'club', label: t('filter_clubs'), count: 3, icon: Users },
    { id: 'personal', label: t('filter_personal'), count: 4, icon: Heart },
    { id: 'library', label: t('filter_library'), count: 2, icon: Library },
    { id: 'shared', label: t('filter_shared'), count: 4, icon: Users },
  ];

  const allTasks = [
    { id: 1, title: 'مقدمة الى برنامج Matlab', subtitle: 'تسليم HomeWork محاضرة', date: '2025/11/27', time: '12:30 مساءا', instructor: 'Letr. Ahmed Hadi', avatar: 'https://images.unsplash.com/photo-1654027879796-b9dee8caabb6?w=400', color: 'blue' as const, icons: ['alert', 'calendar', 'pin'], category: 'academic', categoryIcon: GraduationCap, categoryColor: 'bg-blue-500', priority: 'high', isReminderActive: true, isDateEditable: false },
    { id: 2, title: 'Data Structures Project', subtitle: 'Implement Binary Search Tree', date: '2025/11/28', time: '11:00 AM', instructor: 'Prof. Sarah Ahmed', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', color: 'purple' as const, icons: ['alert', 'calendar', 'check'], category: 'academic', categoryIcon: FileText, categoryColor: 'bg-purple-500', priority: 'high', isReminderActive: false, isDateEditable: true },
    { id: 3, title: 'Physics Lab Report', subtitle: 'Submit experiment results', date: '2025/11/29', time: '3:00 PM', instructor: 'T.A Layla Hassan', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', color: 'green' as const, icons: ['calendar'], category: 'academic', categoryIcon: FlaskConical, categoryColor: 'bg-green-500', priority: 'medium', isReminderActive: false, isDateEditable: false },
    { id: 4, title: 'Database Management Quiz', subtitle: 'Chapter 4-6 Review', date: '2025/11/30', time: '9:00 AM', instructor: 'Prof. Omar Ali', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', color: 'red' as const, icons: ['alert', 'calendar'], category: 'academic', categoryIcon: Book, categoryColor: 'bg-red-500', priority: 'high', isReminderActive: true, isDateEditable: false },
    { id: 5, title: 'الميكانيك و خواص المواد', subtitle: 'محاضرة', date: '2025/11/28', time: 'بعد بكره الصبح', instructor: 'Asstprof. Ali Mohammed', avatar: 'https://images.unsplash.com/photo-1544168190-79c17527004f?w=400', color: 'yellow' as const, icons: ['calendar', 'pin'], category: 'academic', categoryIcon: Target, categoryColor: 'bg-yellow-500', priority: 'medium', isReminderActive: false, isDateEditable: false },
    { id: 6, title: 'English Language Club', subtitle: 'محاضرة استماع', date: '2025/11/27', time: '12:30 مساءا', instructor: 'T.A Israa Nimaa', avatar: 'https://images.unsplash.com/photo-1570730866446-0569a02dd356?w=400', color: 'blue' as const, icons: ['alert', 'calendar', 'check', 'pin'], category: 'club', categoryIcon: Users, categoryColor: 'bg-indigo-500', priority: 'medium', isReminderActive: true, isDateEditable: true },
    { id: 7, title: 'Robotics Club Meeting', subtitle: 'New project planning', date: '2025/11/29', time: '4:00 PM', instructor: 'Club President', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', color: 'purple' as const, icons: ['calendar', 'check', 'pin'], category: 'club', categoryIcon: Zap, categoryColor: 'bg-purple-600', priority: 'low', isReminderActive: false, isDateEditable: true },
    { id: 8, title: 'Photography Club Exhibition', subtitle: 'Submit your best shots', date: '2025/12/01', time: '6:00 PM', instructor: 'Sara Hassan', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', color: 'pink' as const, icons: ['calendar', 'check'], category: 'club', categoryIcon: Award, categoryColor: 'bg-pink-500', priority: 'low', isReminderActive: false, isDateEditable: true },
    { id: 9, title: 'ورشة حول تاثير المخدرات', subtitle: 'متابعة تاثير المخدرات على الجسم', date: '2025/11/28', time: 'بعد بكره الصبح', instructor: 'T.A Doha Ahmed', avatar: 'https://images.unsplash.com/photo-1633381182794-01b10764b431?w=400', color: 'green' as const, icons: ['alert', 'calendar', 'check', 'pin'], category: 'personal', categoryIcon: Heart, categoryColor: 'bg-green-600', priority: 'medium', isReminderActive: true, isDateEditable: true },
    { id: 10, title: 'Gym Workout', subtitle: 'Leg day routine', date: '2025/11/27', time: '7:00 PM', instructor: 'Personal', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', color: 'orange' as const, icons: ['calendar', 'check'], category: 'personal', categoryIcon: Zap, categoryColor: 'bg-orange-500', priority: 'low', isReminderActive: false, isDateEditable: true },
    { id: 11, title: 'Doctor Appointment', subtitle: 'Annual checkup', date: '2025/11/30', time: '10:00 AM', instructor: 'Dr. Ahmed', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', color: 'red' as const, icons: ['alert', 'calendar', 'check', 'pin'], category: 'personal', categoryIcon: Heart, categoryColor: 'bg-red-600', priority: 'high', isReminderActive: true, isDateEditable: false },
    { id: 12, title: "Buy Birthday Gift", subtitle: "Friend's birthday next week", date: '2025/12/02', time: 'Anytime', instructor: 'Personal', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', color: 'pink' as const, icons: ['calendar', 'check'], category: 'personal', categoryIcon: Coffee, categoryColor: 'bg-pink-600', priority: 'low', isReminderActive: false, isDateEditable: true },
    { id: 13, title: 'Return Borrowed Books', subtitle: '3 books due tomorrow', date: '2025/11/28', time: '5:00 PM', instructor: 'Library', avatar: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', color: 'brown' as const, icons: ['alert', 'calendar', 'check', 'pin'], category: 'library', categoryIcon: Library, categoryColor: 'bg-amber-700', priority: 'high', isReminderActive: true, isDateEditable: false },
    { id: 14, title: 'Reserve Study Room', subtitle: 'For group project meeting', date: '2025/11/29', time: '2:00 PM', instructor: 'Library', avatar: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', color: 'yellow' as const, icons: ['calendar', 'check'], category: 'library', categoryIcon: Home, categoryColor: 'bg-yellow-600', priority: 'medium', isReminderActive: false, isDateEditable: true },
    { id: 15, title: 'سفرة ترفيهية الى المتنبئ', subtitle: 'اخبر السفرة مع اصدقائك', date: '2025/11/29', time: '8:00 صباحا', instructor: 'Travel Committee', avatar: 'https://images.unsplash.com/photo-1654027879796-b9dee8caabb6?w=400', color: 'yellow' as const, icons: ['alert', 'calendar', 'check', 'pin'], category: 'shared', categoryIcon: Users, categoryColor: 'bg-teal-500', priority: 'medium', isReminderActive: true, isDateEditable: true },
    { id: 16, title: 'Group Project Presentation', subtitle: 'Software Engineering - Team of 4', date: '2025/12/01', time: '1:00 PM', instructor: 'Prof. Hassan Ali', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', color: 'blue' as const, icons: ['alert', 'calendar', 'pin'], category: 'shared', categoryIcon: Lightbulb, categoryColor: 'bg-blue-600', priority: 'high', isReminderActive: true, isDateEditable: false },
    { id: 17, title: 'Charity Event Volunteering', subtitle: 'Help organize student fundraiser', date: '2025/12/03', time: '10:00 AM', instructor: 'Student Union', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', color: 'green' as const, icons: ['calendar', 'check'], category: 'shared', categoryIcon: Heart, categoryColor: 'bg-green-700', priority: 'low', isReminderActive: false, isDateEditable: true },
    { id: 18, title: 'Research Paper Collaboration', subtitle: 'Working with 3 other students', date: '2025/12/05', time: '3:00 PM', instructor: 'Prof. Fatima Noor', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400', color: 'purple' as const, icons: ['calendar', 'check', 'pin'], category: 'shared', categoryIcon: FileText, categoryColor: 'bg-purple-700', priority: 'medium', isReminderActive: false, isDateEditable: true },
  ];

  const filteredTasks = allTasks.filter(task => {
    const matchesFilter = activeFilter === 'all' || task.category === activeFilter;
    const matchesSearch = searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aPinned = a.icons.includes('pin') ? 0 : 1;
    const bPinned = b.icons.includes('pin') ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const totalTasks = allTasks.length;
  const highPriorityTasks = allTasks.filter(t => t.priority === 'high').length;
  const todayTasks = 3;
  const completionRate = 62;

  const typeColors: Record<string, string> = {
    lecture: 'bg-blue-500',
    club: 'bg-purple-500',
    lab: 'bg-green-500',
    study: 'bg-orange-500',
  };

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Greeting Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-5 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-200 text-xs mb-0.5">مرحباً بعودتك 👋</p>
            <h2 className="text-white font-bold text-xl">Ahmed Ali</h2>
            <p className="text-blue-200 text-xs">هندسة الحاسوب • الفصل الثالث</p>
          </div>
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white/40">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
              <AvatarFallback className="bg-white/20 text-white font-bold">أح</AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <Flame className="h-3 w-3 text-orange-700" />
            </div>
          </div>
        </div>

        {/* GPA + streak */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
            <p className="text-white font-bold text-lg">3.72</p>
            <p className="text-blue-200 text-[10px]">معدل تراكمي</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Flame className="h-3.5 w-3.5 text-orange-300" />
              <p className="text-white font-bold text-lg">14</p>
            </div>
            <p className="text-blue-200 text-[10px]">يوم متتالي</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
            <p className="text-white font-bold text-lg">{completionRate}%</p>
            <p className="text-blue-200 text-[10px]">الإنجاز</p>
          </div>
        </div>
      </div>

      {/* View Switcher */}
      <div className={`${colors.bgPrimary} border-b ${colors.border} sticky top-0 z-10`}>
        <div className="flex">
          {[
            { id: 'tasks', label: t('tab_tasks'), icon: ClipboardList },
            { id: 'schedule', label: t('tab_schedule'), icon: Calendar },
            { id: 'stats', label: t('tab_stats'), icon: BarChart3 },
            { id: 'challenges', label: t('tab_challenges'), icon: Trophy },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeView === view.id
                  ? 'border-indigo-500 text-indigo-600'
                  : `border-transparent ${colors.textSecondary}`
              }`}
            >
              <view.icon className="h-3.5 w-3.5" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {activeView === 'tasks' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 ${colors.textSecondary}`} />
              <input
                type="text"
                placeholder="ابحث عن مهمة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border ${colors.border} ${colors.bgPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${colors.textPrimary}`}
              />
              <Button
                variant="ghost"
                size="icon"
                className={`absolute right-1 top-1/2 -translate-y-1/2 ${colors.bgHover} rounded-lg`}
                onClick={() => setShowFilterDialog(true)}
              >
                <Filter className={`h-4 w-4 ${colors.textSecondary}`} />
              </Button>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'الكل', value: totalTasks, color: 'from-blue-500 to-blue-600', id: 'all' },
                { label: 'أكاديمي', value: 5, color: 'from-purple-500 to-purple-600', id: 'academic' },
                { label: 'اليوم', value: todayTasks, color: 'from-teal-500 to-teal-600', id: 'all' },
                { label: 'عاجل', value: highPriorityTasks, color: 'from-red-500 to-red-600', id: 'all' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gradient-to-br ${stat.color} rounded-xl p-2.5 text-center cursor-pointer`}
                  onClick={() => setActiveFilter(stat.id)}
                >
                  <p className="text-white font-bold text-xl">{stat.value}</p>
                  <p className="text-white/80 text-[10px]">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    activeFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900'
                      : `${colors.bgTertiary} ${colors.textSecondary}`
                  }`}
                >
                  <f.icon className="h-3 w-3" />
                  {f.label}
                  <span className={`text-[10px] px-1 rounded-full ${
                    activeFilter === f.id ? 'bg-white/20' : 'bg-gray-300/50 dark:bg-gray-600'
                  }`}>{f.count}</span>
                </button>
              ))}
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task) => {
                  const svcType = detectTaskService(task.title, task.subtitle);
                  return (
                    <div key={task.id}>
                      <TaskCard task={task} />
                      {svcType && servicePrices.length > 0 && (
                        <AiServiceChip
                          serviceType={svcType}
                          prices={servicePrices}
                          onNavigate={() => onNavigate?.('services')}
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16">
                  <BookOpen className={`h-16 w-16 ${colors.textSecondary} mx-auto mb-4 opacity-50`} />
                  <h3 className={`text-base font-semibold ${colors.textPrimary} mb-2`}>لا توجد مهام</h3>
                  <p className={`${colors.textSecondary} text-sm`}>
                    {searchQuery ? 'جرب تعديل البحث أو الفلتر' : 'لا توجد مهام في هذا القسم'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeView === 'schedule' && (
          <>
            {/* Date strip */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {['اليوم', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((day, i) => (
                <button key={i} className={`flex flex-col items-center px-3 py-2 rounded-xl text-xs flex-shrink-0 transition-all ${
                  i === 0
                    ? 'bg-indigo-600 text-white shadow-md'
                    : `${colors.bgPrimary} ${colors.textSecondary} border ${colors.border}`
                }`}>
                  <span className="font-medium">{day}</span>
                  {i === 0 && <span className="text-[9px] text-indigo-200">اليوم</span>}
                </button>
              ))}
            </div>

            {/* Today's Classes */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>محاضرات اليوم</h3>
              <div className="relative">
                <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${colors.border}`} />
                {TODAY_SCHEDULE.map((item, i) => (
                  <div key={i} className="flex gap-4 mb-4 last:mb-0 relative">
                    <div className="w-12 flex-shrink-0 text-right">
                      <span className={`text-xs font-mono font-bold ${colors.textPrimary}`}>{item.time}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${typeColors[item.type]} mt-0.5 flex-shrink-0 relative z-10 border-2 border-white dark:border-gray-800`} />
                    <div className={`flex-1 p-3 rounded-xl border-l-4 ${
                      item.type === 'lecture' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' :
                      item.type === 'club' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' :
                      item.type === 'lab' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
                      'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                    }`}>
                      <p className={`text-sm font-semibold ${colors.textPrimary}`}>{item.subject}</p>
                      <p className={`text-xs ${colors.textSecondary}`}>{item.instructor}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`text-[10px] ${colors.textTertiary}`}>🏫 {item.room}</span>
                        <span className={`text-[10px] ${colors.textTertiary}`}>⏱ {item.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-sm ${colors.textPrimary}`}>مواعيد التسليم القادمة</h3>
                <ChevronRight className={`h-4 w-4 ${colors.textTertiary}`} />
              </div>
              {allTasks.filter(t => t.priority === 'high').slice(0, 4).map((task, i) => (
                <div key={i} className={`flex items-center gap-3 py-2.5 border-b ${colors.border} last:border-0`}>
                  <div className="w-1.5 h-8 bg-red-500 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${colors.textPrimary} truncate`}>{task.title}</p>
                    <p className={`text-[10px] ${colors.textTertiary}`}>{task.date} • {task.instructor}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-600 text-[10px] flex-shrink-0">عاجل</Badge>
                </div>
              ))}
            </div>
          </>
        )}

        {activeView === 'stats' && (
          <>
            {/* Progress Ring Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-xs mb-1">إجمالي إنجازك هذا الفصل</p>
                  <p className="text-4xl font-bold mb-1">{completionRate}%</p>
                  <p className="text-indigo-200 text-xs">11 من أصل 18 مهمة مكتملة</p>
                </div>
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                    <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - completionRate / 100)}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="h-7 w-7 text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-4`}>توزيع المهام</h3>
              {[
                { label: 'أكاديمية', count: 5, total: 5, color: 'bg-blue-500', emoji: '📚' },
                { label: 'نوادي', count: 2, total: 3, color: 'bg-purple-500', emoji: '🎯' },
                { label: 'شخصية', count: 2, total: 4, color: 'bg-teal-500', emoji: '💪' },
                { label: 'مكتبة', count: 1, total: 2, color: 'bg-amber-500', emoji: '📖' },
                { label: 'مشتركة', count: 2, total: 4, color: 'bg-rose-500', emoji: '🤝' },
              ].map((cat, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.emoji}</span>
                      <span className={`text-xs font-medium ${colors.textPrimary}`}>{cat.label}</span>
                    </div>
                    <span className={`text-xs ${colors.textSecondary}`}>{cat.count}/{cat.total}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.count / cat.total) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                      className={`h-full ${cat.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>الإنجازات المكتسبة</h3>
              <div className="flex gap-3">
                {ACHIEVEMENTS.map((ach, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${ach.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md`}>
                      <span className="text-2xl">{ach.icon}</span>
                    </div>
                    <p className={`text-[10px] font-medium ${colors.textSecondary} leading-tight`}>{ach.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* This Week Summary */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>ملخص هذا الأسبوع</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'الحضور', value: '5/5 محاضرات', icon: CheckCircle2, color: 'text-green-500' },
                  { label: 'التسليمات', value: '3/4 مكتملة', icon: FileText, color: 'text-blue-500' },
                  { label: 'وقت الدراسة', value: '18 ساعة', icon: Clock, color: 'text-purple-500' },
                  { label: 'تفاعلات اجتماعية', value: '24 منشور', icon: Star, color: 'text-yellow-500' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl ${colors.bgSecondary}`}>
                    <div className="flex items-center gap-2.5">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span className={`text-xs ${colors.textSecondary}`}>{item.label}</span>
                    </div>
                    <span className={`text-xs font-bold ${colors.textPrimary}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeView === 'challenges' && (
          <ChallengesHub />
        )}
      </div>

      <FilterDialog
        isOpen={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        onApply={(f) => console.log('filters:', f)}
      />
    </div>
  );
}

export default Dashboard;
