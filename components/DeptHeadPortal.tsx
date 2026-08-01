import { useState } from 'react';
import { Users, BookOpen, Calendar, Clock, FileText, Bell, ChevronRight, BarChart2, CheckSquare, Award, TrendingUp, Star, GraduationCap, Briefcase, ClipboardList, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { UserInfo } from '../App';

interface DeptHeadPortalProps {
  user: UserInfo;
}

const FACULTY_MEMBERS = [
  { id: 1, name: 'أ.د. أحمد الخزرجي', title: 'Professor', courses: 2, students: 80, rating: 4.8, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 2, name: 'أ.م.د. سارة القريشي', title: 'Assoc. Professor', courses: 2, students: 75, rating: 4.6, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
  { id: 3, name: 'م.د. علي الموسوي', title: 'Lecturer', courses: 3, students: 110, rating: 4.5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
  { id: 4, name: 'م.م. نور حسين', title: 'Teaching Asst.', courses: 4, students: 120, rating: 4.3, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
];

const DEPT_COURSES = [
  { code: 'CS201', name: 'برمجة الحاسوب', instructor: 'أ.د. الخزرجي', students: 42, status: 'active' },
  { code: 'CS301', name: 'هياكل البيانات', instructor: 'أ.م. القريشي', students: 38, status: 'active' },
  { code: 'CS401', name: 'نظم التشغيل', instructor: 'م.د. الموسوي', students: 35, status: 'active' },
  { code: 'CS450', name: 'شبكات الحاسوب', instructor: 'م.م. حسين', students: 40, status: 'active' },
];

const SEMESTER_STATS = {
  totalStudents: 320,
  passRate: 87,
  avgGPA: 3.2,
  activeCourses: 14,
  facultyCount: 12,
  pendingRequests: 5,
};

export function DeptHeadPortal({ user }: DeptHeadPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'faculty' | 'courses' | 'reports'>('overview');
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-teal-600 to-emerald-700 px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-14 w-14 border-2 border-white/30">
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white/70 text-xs mb-0.5">بوابة رئيس القسم</p>
            <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-green-200 text-xs">{user.department}</p>
          </div>
          <div className="ml-auto relative">
            <button className="bg-white/15 hover:bg-white/25 text-white rounded-xl p-2 transition-all">
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[9px] font-bold text-slate-900 flex items-center justify-center">
              {SEMESTER_STATS.pendingRequests}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'الطلاب', value: SEMESTER_STATS.totalStudents, icon: Users },
            { label: 'أعضاء الهيئة', value: SEMESTER_STATS.facultyCount, icon: Briefcase },
            { label: 'المقررات', value: SEMESTER_STATS.activeCourses, icon: BookOpen },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <stat.icon className="h-4 w-4 text-white/70 mx-auto mb-1" />
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-white/60 text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className={`${colors.bgPrimary} border-b ${colors.border} sticky top-0 z-10`}>
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: t('tab_overview'), icon: BarChart2 },
            { id: 'faculty', label: t('tab_staff'), icon: Users },
            { id: 'courses', label: t('tab_courses'), icon: BookOpen },
            { id: 'reports', label: 'التقارير', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id ? 'border-green-500 text-green-600' : `border-transparent ${colors.textSecondary}`
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Semester Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'نسبة النجاح', value: `${SEMESTER_STATS.passRate}%`, icon: TrendingUp, color: 'from-green-500 to-teal-500' },
                { label: 'المعدل التراكمي', value: SEMESTER_STATS.avgGPA, icon: Star, color: 'from-blue-500 to-indigo-500' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white`}>
                  <stat.icon className="h-5 w-5 opacity-80 mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Requests */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-sm ${colors.textPrimary}`}>الطلبات المعلقة</h3>
                <Badge className="bg-orange-100 text-orange-600 text-xs">{SEMESTER_STATS.pendingRequests}</Badge>
              </div>
              {[
                { type: 'تغيير جدول المحاضرة', from: 'م.م. نور حسين', time: 'اليوم', color: 'bg-orange-500' },
                { type: 'إجازة مرضية', from: 'م.د. الموسوي', time: 'أمس', color: 'bg-red-500' },
                { type: 'طلب مستلزمات مختبر', from: 'أ.م. القريشي', time: 'منذ يومين', color: 'bg-blue-500' },
              ].map((req, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl mb-2 last:mb-0 ${colors.bgSecondary}`}>
                  <div className={`w-2 h-2 rounded-full ${req.color}`} />
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${colors.textPrimary}`}>{req.type}</p>
                    <p className={`text-[10px] ${colors.textTertiary}`}>{req.from} • {req.time}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-md">قبول</button>
                    <button className="bg-red-100 dark:bg-red-900/20 text-red-500 text-[10px] px-2 py-0.5 rounded-md">رفض</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Course Performance */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>أداء المقررات</h3>
              {DEPT_COURSES.slice(0, 3).map(course => (
                <div key={course.code} className={`flex items-center justify-between py-2.5 border-b ${colors.border} last:border-0`}>
                  <div>
                    <p className={`text-xs font-semibold ${colors.textPrimary}`}>{course.code} — {course.name}</p>
                    <p className={`text-[10px] ${colors.textTertiary}`}>{course.instructor}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className={`text-xs ${colors.textSecondary}`}>{course.students}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'faculty' && (
          <div className="space-y-3">
            {FACULTY_MEMBERS.map(member => (
              <motion.div
                key={member.id}
                whileTap={{ scale: 0.98 }}
                className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border} flex items-center gap-3`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${colors.textPrimary} truncate`}>{member.name}</p>
                  <p className={`text-xs ${colors.textSecondary}`}>{member.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] ${colors.textTertiary}`}>{member.courses} مقررات</span>
                    <span className={`text-[10px] ${colors.textTertiary}`}>{member.students} طالب</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className={`text-xs font-bold ${colors.textPrimary}`}>{member.rating}</span>
                  </div>
                  <button className={`mt-1 text-[10px] text-green-500 font-medium`}>ملف</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-3">
            {DEPT_COURSES.map(course => (
              <div key={course.code} className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`text-sm font-bold ${colors.textPrimary}`}>{course.name}</p>
                    <p className={`text-xs ${colors.textSecondary}`}>{course.code} • {course.instructor}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-xs">نشط</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    <span className={`text-xs ${colors.textSecondary}`}>{course.students} طالب</span>
                  </div>
                  <button className={`ml-auto text-xs text-green-500 font-medium flex items-center gap-1`}>
                    عرض التفاصيل <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
            <button className="w-full py-3.5 border-2 border-dashed border-green-300 rounded-2xl flex items-center justify-center gap-2 text-green-500 text-sm font-medium">
              <Plus className="h-4 w-4" />
              إضافة مقرر
            </button>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-3">
            {[
              { title: 'تقرير الحضور الشهري', date: 'نوفمبر 2024', icon: ClipboardList, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
              { title: 'نتائج الامتحانات النصفية', date: 'الفصل الأول 2024', icon: Award, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
              { title: 'تقييم أداء الأساتذة', date: 'سنوي 2024', icon: Star, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
              { title: 'إحصائيات القسم', date: 'الفصل الأول 2024', icon: BarChart2, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
            ].map((report, i) => (
              <div key={i} className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border} flex items-center gap-3`}>
                <div className={`w-10 h-10 ${report.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <report.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${colors.textPrimary}`}>{report.title}</p>
                  <p className={`text-xs ${colors.textTertiary}`}>{report.date}</p>
                </div>
                <button className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium">تنزيل</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeptHeadPortal;
