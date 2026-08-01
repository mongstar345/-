import { useState } from 'react';
import { BookOpen, Users, Calendar, Bell, ChevronRight, BarChart2, FileText, Clock, CheckSquare, TrendingUp, Star, Upload, MessageSquare, AlertCircle, Plus, CheckCircle, Download } from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { UserInfo } from '../App';

interface CourseCoordPortalProps {
  user: UserInfo;
}

const ASSIGNED_COURSES = [
  { id: 1, code: 'CS201', name: 'برمجة الحاسوب', professor: 'أ.د. أحمد الخزرجي', students: 42, section: 'A', nextClass: 'الأحد 9:00', room: 'Lab 3', status: 'active', completion: 68 },
  { id: 2, code: 'CS301', name: 'هياكل البيانات', professor: 'أ.م.د. سارة القريشي', students: 38, section: 'B', nextClass: 'الإثنين 11:00', room: 'Hall 2', status: 'active', completion: 55 },
  { id: 3, code: 'CS401', name: 'نظم التشغيل', professor: 'أ.د. علي الموسوي', students: 35, section: 'A', nextClass: 'الثلاثاء 1:00', room: 'Lab 5', status: 'active', completion: 40 },
];

const WEEKLY_SCHEDULE = [
  { day: 'الأحد', slots: [{ time: '9:00–11:00', course: 'CS201', room: 'Lab 3', type: 'lecture' }, { time: '2:00–4:00', course: 'CS301', room: 'Hall 2', type: 'lab' }] },
  { day: 'الإثنين', slots: [{ time: '11:00–1:00', course: 'CS301', room: 'Hall 2', type: 'lecture' }] },
  { day: 'الثلاثاء', slots: [{ time: '1:00–3:00', course: 'CS401', room: 'Lab 5', type: 'lecture' }, { time: '3:00–4:00', course: 'CS201', room: 'Office', type: 'review' }] },
  { day: 'الأربعاء', slots: [{ time: '10:00–12:00', course: 'CS401', room: 'Lab 5', type: 'lab' }] },
];

const PENDING_TASKS = [
  { id: 1, task: 'رفع ملاحظات محاضرة الأسبوع الماضي — CS201', course: 'CS201', due: 'اليوم', urgent: true },
  { id: 2, task: 'إعداد قائمة الحضور للاختبار النصفي', course: 'CS301', due: 'الأحد', urgent: true },
  { id: 3, task: 'توزيع المهام على مجموعات المختبر', course: 'CS401', due: 'الثلاثاء', urgent: false },
  { id: 4, task: 'مراسلة الطلاب المتأخرين في التسليم', course: 'CS201', due: 'هذا الأسبوع', urgent: false },
];

const PROF_MESSAGES = [
  { id: 1, from: 'أ.د. أحمد الخزرجي', course: 'CS201', message: 'يرجى تجهيز قائمة الطلاب الذين لم يسلموا المهمة الثالثة', time: 'منذ ساعة', read: false },
  { id: 2, from: 'أ.م.د. سارة القريشي', course: 'CS301', message: 'الاختبار النصفي سيكون يوم الأحد في القاعة الكبرى — أخبر الطلاب', time: 'أمس', read: false },
  { id: 3, from: 'أ.د. علي الموسوي', course: 'CS401', message: 'تم تأجيل محاضرة الثلاثاء بسبب مؤتمر. سيتم التعويض لاحقاً', time: 'منذ يومين', read: true },
];

const TYPE_COLORS: Record<string, string> = {
  lecture: 'bg-blue-500',
  lab: 'bg-purple-500',
  review: 'bg-green-500',
};

export function CourseCoordPortal({ user }: CourseCoordPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'schedule' | 'messages'>('overview');
  const [tasks, setTasks] = useState(PENDING_TASKS);
  const [messages, setMessages] = useState(PROF_MESSAGES);
  const { colors } = useTheme();
  const { t } = useLanguage();

  const unreadMessages = messages.filter(m => !m.read).length;
  const urgentTasks = tasks.filter(t => t.urgent).length;

  const markRead = (id: number) => setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  const completeTask = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs mb-0.5">بوابة مقرر القسم</p>
            <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-indigo-200 text-xs">{user.department}</p>
          </div>
          <div className="ml-auto relative">
            <button className="bg-white/15 hover:bg-white/25 text-white rounded-xl p-2 transition-all">
              <Bell className="h-5 w-5" />
            </button>
            {(unreadMessages + urgentTasks) > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[9px] font-bold text-slate-900 flex items-center justify-center">
                {unreadMessages + urgentTasks}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'المقررات', value: ASSIGNED_COURSES.length, icon: BookOpen },
            { label: 'المهام العاجلة', value: urgentTasks, icon: AlertCircle },
            { label: 'رسائل جديدة', value: unreadMessages, icon: MessageSquare },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <s.icon className="h-4 w-4 text-white/70 mx-auto mb-1" />
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-white/60 text-[10px]">{s.label}</p>
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
            { id: 'schedule', label: t('tab_schedule'), icon: Calendar },
            { id: 'messages', label: t('tab_messages'), icon: MessageSquare, count: unreadMessages },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-3.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : `border-transparent ${colors.textSecondary}`
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.count ? (
                <span className="w-4 h-4 bg-indigo-500 text-white rounded-full text-[9px] flex items-center justify-center">{tab.count}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Pending tasks */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-sm ${colors.textPrimary}`}>المهام المعلقة</h3>
                {urgentTasks > 0 && (
                  <Badge className="bg-red-100 text-red-600 text-xs">{urgentTasks} عاجل</Badge>
                )}
              </div>
              <div className="space-y-2">
                {tasks.slice(0, 4).map(task => (
                  <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl ${task.urgent ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900' : colors.bgSecondary}`}>
                    <button
                      onClick={() => completeTask(task.id)}
                      className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 transition-colors ${task.urgent ? 'border-red-400 hover:bg-red-100' : `border-gray-300 hover:border-indigo-400`}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${colors.textPrimary} leading-snug`}>{task.task}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">{task.course}</span>
                        <span className={`text-[10px] ${task.urgent ? 'text-red-500 font-bold' : colors.textTertiary}`}>{task.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's courses */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>مقررات اليوم</h3>
              {ASSIGNED_COURSES.map(c => (
                <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl mb-2 last:mb-0 ${colors.bgSecondary}`}>
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 text-xs font-bold">{c.code.slice(-3)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${colors.textPrimary} truncate`}>{c.name}</p>
                    <p className={`text-[10px] ${colors.textSecondary}`}>{c.professor} • {c.nextClass}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className={`text-xs font-bold ${colors.textPrimary}`}>{c.students}</p>
                    <p className={`text-[9px] ${colors.textTertiary}`}>طالب</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress overview */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>التقدم الدراسي</h3>
              {ASSIGNED_COURSES.map(c => (
                <div key={c.id} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs ${colors.textPrimary} font-medium`}>{c.code} — {c.name}</span>
                    <span className={`text-xs font-bold ${colors.textPrimary}`}>{c.completion}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${c.completion}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-3">
            {ASSIGNED_COURSES.map(c => (
              <motion.div
                key={c.id}
                whileTap={{ scale: 0.98 }}
                className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden`}
              >
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-sm">{c.name}</p>
                    <p className="text-white/70 text-xs">{c.code} • الشعبة {c.section}</p>
                  </div>
                  <Badge className="bg-white/20 text-white text-xs border-0">{c.students} طالب</Badge>
                </div>
                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-indigo-400" />
                    <span className={`text-xs ${colors.textSecondary}`}>{c.professor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                    <span className={`text-xs ${colors.textSecondary}`}>{c.nextClass} • {c.room}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${c.completion}%` }} />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1">
                      <Users className="h-3.5 w-3.5" /> الحضور
                    </button>
                    <button className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1">
                      <Upload className="h-3.5 w-3.5" /> رفع ملف
                    </button>
                    <button className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1">
                      <Download className="h-3.5 w-3.5" /> التقارير
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-3">
            {WEEKLY_SCHEDULE.map((day, i) => (
              <div key={i} className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden`}>
                <div className={`px-4 py-2.5 bg-indigo-600`}>
                  <p className="text-white font-bold text-sm">{day.day}</p>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {day.slots.map((slot, j) => (
                    <div key={j} className={`flex items-center gap-3 p-2.5 rounded-xl ${colors.bgSecondary}`}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${TYPE_COLORS[slot.type]}`} />
                      <div className="flex-1">
                        <p className={`text-xs font-bold ${colors.textPrimary}`}>{slot.course}</p>
                        <p className={`text-[10px] ${colors.textTertiary}`}>{slot.room}</p>
                      </div>
                      <span className={`text-xs font-mono ${colors.textSecondary}`}>{slot.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className={`${colors.cardBg} rounded-2xl p-8 border ${colors.border} text-center`}>
                <p className={`text-sm ${colors.textTertiary}`}>لا توجد رسائل</p>
              </div>
            )}
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => markRead(msg.id)}
                className={`${colors.cardBg} rounded-2xl p-4 border ${!msg.read ? 'border-indigo-300 dark:border-indigo-700' : colors.border} cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {msg.from[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-bold ${colors.textPrimary} truncate`}>{msg.from}</p>
                      {!msg.read && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />}
                    </div>
                    <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{msg.course}</span>
                    <p className={`text-xs ${colors.textSecondary} mt-2 leading-relaxed`}>{msg.message}</p>
                    <p className={`text-[10px] ${colors.textTertiary} mt-1.5`}>{msg.time}</p>
                  </div>
                </div>
                <button className={`w-full mt-3 py-2 text-xs font-semibold text-indigo-600 ${colors.bgSecondary} rounded-xl flex items-center justify-center gap-1`}>
                  <MessageSquare className="h-3.5 w-3.5" /> رد على الأستاذ
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCoordPortal;
