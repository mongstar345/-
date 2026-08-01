import { useState } from 'react';
import { BookOpen, Users, Calendar, Clock, FileText, Bell, Star, ChevronRight, Plus, Edit3, Eye, TrendingUp, Award, MessageSquare, Video, CheckSquare, BarChart2, Download, Upload, AlertCircle, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { UserInfo } from '../App';

interface ProfessorPortalProps {
  user: UserInfo;
}

const COURSES = [
  { id: 1, name: 'Data Structures & Algorithms', code: 'CS301', students: 42, section: 'A', nextClass: 'Sun 9:00 AM', room: 'Lab 3', submitted: 35, color: 'from-blue-500 to-blue-600' },
  { id: 2, name: 'Operating Systems', code: 'CS401', students: 38, section: 'B', nextClass: 'Mon 11:00 AM', room: 'Hall 2', submitted: 28, color: 'from-purple-500 to-purple-600' },
  { id: 3, name: 'Computer Networks', code: 'CS450', students: 45, section: 'A', nextClass: 'Tue 1:00 PM', room: 'Lab 5', submitted: 40, color: 'from-teal-500 to-teal-600' },
];

const PENDING_SUBMISSIONS = [
  { id: 1, course: 'CS301', type: 'Homework #3', submitted: 35, total: 42, deadline: 'Tomorrow 11:59 PM', urgent: true },
  { id: 2, course: 'CS401', type: 'Midterm Grades', submitted: 38, total: 38, deadline: 'Today 5:00 PM', urgent: true },
  { id: 3, course: 'CS450', type: 'Lab Report #5', submitted: 30, total: 45, deadline: 'Nov 30', urgent: false },
];

const ANNOUNCEMENTS = [
  { id: 1, title: 'Final exam schedule posted', time: '2 hours ago', type: 'exam' },
  { id: 2, title: 'New textbook resources available', time: 'Yesterday', type: 'resource' },
  { id: 3, title: 'Office hours changed this week', time: '2 days ago', type: 'office' },
];

const SCHEDULE = [
  { time: '9:00', subject: 'Data Structures', room: 'Lab 3', type: 'lecture', duration: 2 },
  { time: '11:00', subject: 'Office Hours', room: 'Office 214', type: 'office', duration: 1 },
  { time: '1:00', subject: 'Operating Systems', room: 'Hall 2', type: 'lecture', duration: 2 },
  { time: '4:00', subject: 'Research Meeting', room: 'Online', type: 'meeting', duration: 1 },
];

export function ProfessorPortal({ user }: ProfessorPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'grades' | 'schedule'>('overview');
  const { colors } = useTheme();
  const { t } = useLanguage();

  const typeColors: Record<string, string> = {
    lecture: 'bg-blue-500',
    office: 'bg-green-500',
    meeting: 'bg-orange-500',
    lab: 'bg-purple-500',
  };

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-14 w-14 border-2 border-white/30">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" />
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white/70 text-xs mb-0.5">بوابة الأستاذ</p>
            <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-blue-200 text-xs">{user.department}</p>
          </div>
          <button className="ml-auto bg-white/15 hover:bg-white/25 text-white rounded-xl p-2 transition-all">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'المقررات', value: '3', icon: BookOpen },
            { label: 'الطلاب', value: '125', icon: Users },
            { label: 'المهام المعلقة', value: '7', icon: FileText },
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
            { id: 'courses', label: t('tab_courses'), icon: BookOpen },
            { id: 'grades', label: t('tab_grades'), icon: Award },
            { id: 'schedule', label: t('tab_schedule'), icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : `border-transparent ${colors.textSecondary}`
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
            {/* Today's Schedule Preview */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-sm ${colors.textPrimary}`}>جدول اليوم</h3>
                <button className="text-indigo-500 text-xs font-medium">عرض الكل</button>
              </div>
              <div className="space-y-2">
                {SCHEDULE.slice(0, 3).map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${colors.bgSecondary}`}>
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${typeColors[item.type]}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${colors.textPrimary}`}>{item.subject}</p>
                      <p className={`text-xs ${colors.textTertiary}`}>{item.room}</p>
                    </div>
                    <span className={`text-xs font-mono ${colors.textSecondary}`}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Submissions */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-sm ${colors.textPrimary}`}>المهام المعلقة للتصحيح</h3>
                <Badge className="bg-red-100 text-red-600 text-xs">{PENDING_SUBMISSIONS.filter(p => p.urgent).length} عاجل</Badge>
              </div>
              <div className="space-y-3">
                {PENDING_SUBMISSIONS.map(sub => (
                  <div key={sub.id} className={`p-3 rounded-xl border ${sub.urgent ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800' : `${colors.border} ${colors.bgSecondary}`}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className={`text-sm font-semibold ${colors.textPrimary}`}>{sub.type}</p>
                        <p className={`text-xs ${colors.textTertiary}`}>{sub.course}</p>
                      </div>
                      {sub.urgent && <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(sub.submitted / sub.total) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs ${colors.textSecondary}`}>{sub.submitted}/{sub.total}</span>
                    </div>
                    <p className={`text-xs mt-1.5 ${sub.urgent ? 'text-red-500' : colors.textTertiary}`}>
                      آخر موعد: {sub.deadline}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'رفع ملاحظة', icon: Upload, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
                { label: 'إنشاء اختبار', icon: Edit3, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
                { label: 'بث مباشر', icon: Video, color: 'bg-red-50 dark:bg-red-900/20 text-red-600' },
                { label: 'رسالة للطلاب', icon: MessageSquare, color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
              ].map((action, i) => (
                <button key={i} className={`${action.color} rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.97]`}>
                  <action.icon className="h-5 w-5" />
                  <span className="text-sm font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-3">
            {COURSES.map(course => (
              <motion.div
                key={course.id}
                whileTap={{ scale: 0.98 }}
                className={`${colors.cardBg} rounded-2xl overflow-hidden border ${colors.border} shadow-sm`}
              >
                <div className={`bg-gradient-to-r ${course.color} px-4 py-3 flex items-center justify-between`}>
                  <div>
                    <p className="text-white font-bold text-sm">{course.name}</p>
                    <p className="text-white/70 text-xs">{course.code} • Section {course.section}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg px-2.5 py-1">
                    <p className="text-white font-bold text-lg">{course.students}</p>
                    <p className="text-white/70 text-[9px] text-center">طالب</p>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-4 text-xs mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span className={colors.textSecondary}>{course.nextClass}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <span className={colors.textSecondary}>{course.room}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button className={`${colors.bgSecondary} rounded-xl py-2 text-xs font-medium ${colors.textSecondary} flex flex-col items-center gap-1`}>
                      <Eye className="h-3.5 w-3.5" />
                      عرض
                    </button>
                    <button className={`${colors.bgSecondary} rounded-xl py-2 text-xs font-medium ${colors.textSecondary} flex flex-col items-center gap-1`}>
                      <Upload className="h-3.5 w-3.5" />
                      رفع
                    </button>
                    <button className={`${colors.bgSecondary} rounded-xl py-2 text-xs font-medium ${colors.textSecondary} flex flex-col items-center gap-1`}>
                      <MessageSquare className="h-3.5 w-3.5" />
                      راسل
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            <button className="w-full py-3.5 border-2 border-dashed border-indigo-300 rounded-2xl flex items-center justify-center gap-2 text-indigo-500 text-sm font-medium hover:bg-indigo-50 transition-all">
              <Plus className="h-4 w-4" />
              إضافة مقرر جديد
            </button>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="space-y-4">
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-4`}>نسب الإنجاز في الدرجات</h3>
              {COURSES.map(course => (
                <div key={course.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-medium ${colors.textPrimary}`}>{course.code} — {course.name.split(' ')[0]}</span>
                    <span className={`text-xs ${colors.textSecondary}`}>{course.submitted}/{course.students}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${course.color} rounded-full`}
                      style={{ width: `${(course.submitted / course.students) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${colors.textTertiary}`}>{Math.round((course.submitted / course.students) * 100)}% مكتملة</p>
                </div>
              ))}
            </div>

            <div className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden`}>
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className={`font-bold text-sm ${colors.textPrimary}`}>إدخال الدرجات النهائية</h3>
              </div>
              {COURSES.map(course => (
                <div key={course.id} className={`flex items-center justify-between px-4 py-3 border-b ${colors.border} last:border-0`}>
                  <div>
                    <p className={`text-sm font-medium ${colors.textPrimary}`}>{course.code}</p>
                    <p className={`text-xs ${colors.textTertiary}`}>{course.students} طالب</p>
                  </div>
                  <button className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all">
                    إدخال
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-3">
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>جدول الأسبوع الحالي</h3>
              {SCHEDULE.map((item, i) => (
                <div key={i} className={`flex items-stretch gap-3 mb-3 last:mb-0`}>
                  <div className="flex flex-col items-center w-12">
                    <span className={`text-xs font-mono font-bold ${colors.textPrimary}`}>{item.time}</span>
                    <div className={`flex-1 w-0.5 ${typeColors[item.type]} opacity-30 my-1`} />
                  </div>
                  <div className={`flex-1 p-3 rounded-xl border-l-4 ${
                    item.type === 'lecture' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500' :
                    item.type === 'office' ? 'bg-green-50 dark:bg-green-900/10 border-green-500' :
                    'bg-orange-50 dark:bg-orange-900/10 border-orange-500'
                  }`}>
                    <p className={`text-sm font-semibold ${colors.textPrimary}`}>{item.subject}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${colors.textSecondary}`}>{item.room}</span>
                      <span className={`text-xs ${colors.textTertiary}`}>{item.duration}hr</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfessorPortal;
