import { useState } from 'react';
import { BookOpen, Users, Calendar, Bell, MessageSquare, Send, AlertCircle, CheckCircle, Clock, Upload, FileText, BarChart2, Star, ChevronRight, Mic, Video, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { UserInfo } from '../App';

interface DemonstratorPortalProps {
  user: UserInfo;
}

interface ProfMessage {
  id: number;
  from: 'prof' | 'me';
  text: string;
  time: string;
}

const ASSIGNED_PROFESSOR = {
  name: 'أ.د. أحمد الخزرجي',
  title: 'أستاذ دكتور — علوم الحاسوب',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  courses: ['CS201 — برمجة الحاسوب', 'CS301 — هياكل البيانات'],
  officeHours: 'الأحد والثلاثاء 12:00–2:00',
  office: 'مكتب 214 — المبنى العلمي',
  online: true,
};

const INITIAL_MESSAGES: ProfMessage[] = [
  { id: 1, from: 'prof', text: 'زيد، يرجى تجهيز أسئلة الكويز للمختبر الثاني وإرسالها قبل الأحد', time: '10:30 ص' },
  { id: 2, from: 'me', text: 'حاضر أستاذ، سأرسلها قبل نهاية اليوم', time: '10:45 ص' },
  { id: 3, from: 'prof', text: 'ممتاز. وأيضاً راجع نتائج المهمة الثالثة من CS201 — هناك بعض الأوراق لم تصحَّح', time: '11:00 ص' },
  { id: 4, from: 'me', text: 'سأنهي التصحيح اليوم وأرفع النتائج', time: '11:05 ص' },
];

const LAB_SESSIONS = [
  { id: 1, course: 'CS201', name: 'مختبر البرمجة — الجلسة 6', date: 'الأحد 2:00–4:00', room: 'Lab 3', students: 22, prepared: true },
  { id: 2, course: 'CS301', name: 'مختبر هياكل البيانات — الجلسة 5', date: 'الإثنين 3:00–5:00', room: 'Lab 2', students: 19, prepared: false },
  { id: 3, course: 'CS201', name: 'مختبر البرمجة — الجلسة 7', date: 'الأحد التالي', room: 'Lab 3', students: 22, prepared: false },
];

const PENDING_TASKS = [
  { id: 1, task: 'تصحيح مهام CS201 — المجموعة A', due: 'اليوم', urgent: true, from: 'أ.د. الخزرجي' },
  { id: 2, task: 'إعداد أسئلة كويز المختبر 2', due: 'الأحد', urgent: true, from: 'أ.د. الخزرجي' },
  { id: 3, task: 'رفع ملاحظات الجلسة الماضية', due: 'الإثنين', urgent: false, from: 'أ.د. الخزرجي' },
  { id: 4, task: 'تسجيل غياب الطلاب — الجلسة 5', due: 'اليوم', urgent: true, from: 'أ.د. الخزرجي' },
];

const GRADING_DATA = [
  { course: 'CS201', assignment: 'مهمة #3', submitted: 35, total: 42, graded: 20, dueDate: 'غداً' },
  { course: 'CS301', assignment: 'تقرير مختبر #4', submitted: 19, total: 19, graded: 19, dueDate: 'مكتمل' },
];

export function DemonstratorPortal({ user }: DemonstratorPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'labs' | 'grades' | 'chat'>('overview');
  const [messages, setMessages] = useState<ProfMessage[]>(INITIAL_MESSAGES);
  const [newMsg, setNewMsg] = useState('');
  const [tasks, setTasks] = useState(PENDING_TASKS);
  const { colors } = useTheme();
  const { t } = useLanguage();

  const urgentTasks = tasks.filter(t => t.urgent).length;
  const pendingGrades = GRADING_DATA.filter(g => g.graded < g.submitted).length;

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      from: 'me',
      text: newMsg.trim(),
      time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewMsg('');
  };

  const completeTask = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-14 w-14 border-2 border-white/30">
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white/70 text-xs mb-0.5">بوابة المعيد</p>
            <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-cyan-200 text-xs">{user.department}</p>
          </div>
          <div className="ml-auto relative">
            <button className="bg-white/15 hover:bg-white/25 text-white rounded-xl p-2 transition-all">
              <Bell className="h-5 w-5" />
            </button>
            {urgentTasks > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[9px] font-bold text-slate-900 flex items-center justify-center">
                {urgentTasks}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'جلسات المختبر', value: LAB_SESSIONS.length, icon: BookOpen },
            { label: 'مهام عاجلة', value: urgentTasks, icon: AlertCircle },
            { label: 'بانتظار التصحيح', value: pendingGrades, icon: FileText },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <s.icon className="h-4 w-4 text-white/70 mx-auto mb-1" />
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-white/60 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROFESSOR CARD — always visible, mandatory connection */}
      <div className="px-4 -mt-4 relative z-10 mb-1">
        <div className={`${colors.cardBg} rounded-2xl p-4 border-2 border-cyan-400 dark:border-cyan-700 shadow-lg`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={ASSIGNED_PROFESSOR.avatar} />
                <AvatarFallback>{ASSIGNED_PROFESSOR.name[0]}</AvatarFallback>
              </Avatar>
              {ASSIGNED_PROFESSOR.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-bold text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 px-2 py-0.5 rounded-full">الأستاذ المشرف</span>
              </div>
              <p className={`text-sm font-bold ${colors.textPrimary} truncate`}>{ASSIGNED_PROFESSOR.name}</p>
              <p className={`text-[10px] ${colors.textTertiary}`}>{ASSIGNED_PROFESSOR.title}</p>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab('chat')}
                className="w-9 h-9 bg-cyan-500 hover:bg-cyan-600 rounded-xl flex items-center justify-center transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-white" />
              </button>
              <button className="w-9 h-9 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
                <Phone className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          <div className={`mt-3 pt-3 border-t ${colors.border} flex items-center gap-2`}>
            <Clock className="h-3.5 w-3.5 text-cyan-500 flex-shrink-0" />
            <p className={`text-[10px] ${colors.textSecondary}`}>ساعات الدوام: {ASSIGNED_PROFESSOR.officeHours}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`${colors.bgPrimary} border-b ${colors.border} sticky top-0 z-10 mt-4`}>
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: t('tab_overview'), icon: BarChart2 },
            { id: 'labs', label: t('tab_labs'), icon: BookOpen },
            { id: 'grades', label: t('tab_grades'), icon: FileText },
            { id: 'chat', label: t('tab_chat'), icon: MessageSquare },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-3.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id ? 'border-cyan-500 text-cyan-600' : `border-transparent ${colors.textSecondary}`
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
            {/* Mandatory tasks from professor */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border border-cyan-300 dark:border-cyan-800`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-sm ${colors.textPrimary}`}>مهام من الأستاذ المشرف</h3>
                {urgentTasks > 0 && <Badge className="bg-red-100 text-red-600 text-xs">{urgentTasks} عاجل</Badge>}
              </div>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl ${
                    task.urgent ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900' : colors.bgSecondary
                  }`}>
                    <button
                      onClick={() => completeTask(task.id)}
                      className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all hover:bg-green-100 ${
                        task.urgent ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${colors.textPrimary} leading-snug`}>{task.task}</p>
                      <p className={`text-[10px] mt-1 ${task.urgent ? 'text-red-500 font-bold' : colors.textTertiary}`}>
                        موعد التسليم: {task.due}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming labs */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>الجلسات القادمة</h3>
              {LAB_SESSIONS.slice(0, 2).map(session => (
                <div key={session.id} className={`flex items-center gap-3 p-3 rounded-xl mb-2 last:mb-0 ${colors.bgSecondary}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    session.prepared ? 'bg-green-100 dark:bg-green-900/20' : 'bg-orange-100 dark:bg-orange-900/20'
                  }`}>
                    {session.prepared
                      ? <CheckCircle className="h-5 w-5 text-green-500" />
                      : <AlertCircle className="h-5 w-5 text-orange-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${colors.textPrimary} truncate`}>{session.name}</p>
                    <p className={`text-[10px] ${colors.textSecondary}`}>{session.date} • {session.room}</p>
                  </div>
                  <span className={`text-[10px] flex-shrink-0 font-semibold ${session.prepared ? 'text-green-500' : 'text-orange-500'}`}>
                    {session.prepared ? 'جاهز' : 'لم يُجهَّز'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'labs' && (
          <div className="space-y-3">
            {LAB_SESSIONS.map(session => (
              <div key={session.id} className={`${colors.cardBg} rounded-2xl border ${session.prepared ? colors.border : 'border-orange-300 dark:border-orange-800'} overflow-hidden`}>
                <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-sm">{session.name}</p>
                    <p className="text-white/70 text-xs">{session.course}</p>
                  </div>
                  <Badge className={`${session.prepared ? 'bg-green-400/30' : 'bg-orange-400/30'} text-white border-0 text-xs`}>
                    {session.prepared ? 'جاهز ✓' : 'لم يُجهَّز'}
                  </Badge>
                </div>
                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-cyan-500" />
                    <span className={`text-xs ${colors.textSecondary}`}>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-cyan-500" />
                    <span className={`text-xs ${colors.textSecondary}`}>{session.students} طالب • {session.room}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1">
                      <Users className="h-3.5 w-3.5" /> سجل الحضور
                    </button>
                    <button className="flex-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1">
                      <Upload className="h-3.5 w-3.5" /> رفع ملاحظات
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="space-y-3">
            {GRADING_DATA.map((g, i) => (
              <div key={i} className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`text-sm font-bold ${colors.textPrimary}`}>{g.assignment}</p>
                    <p className={`text-xs ${colors.textSecondary}`}>{g.course} • الموعد: {g.dueDate}</p>
                  </div>
                  <Badge className={`text-xs ${g.graded === g.submitted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {g.graded === g.submitted ? 'مكتمل ✓' : `${g.submitted - g.graded} متبقية`}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'سُلِّمت', val: g.submitted, color: 'text-blue-600' },
                    { label: 'صُحِّحت', val: g.graded, color: 'text-green-600' },
                    { label: 'الكل', val: g.total, color: colors.textPrimary },
                  ].map((s, j) => (
                    <div key={j} className={`${colors.bgSecondary} rounded-xl p-2.5 text-center`}>
                      <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                      <p className={`text-[10px] ${colors.textTertiary}`}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full" style={{ width: `${(g.graded / g.total) * 100}%` }} />
                </div>
                {g.graded < g.submitted && (
                  <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" /> متابعة التصحيح
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CHAT TAB — mandatory professor communication */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[calc(100vh-320px)] min-h-64">
            {/* Prof header */}
            <div className={`${colors.cardBg} rounded-2xl p-3 border-2 border-cyan-400 dark:border-cyan-700 mb-3 flex items-center gap-3`}>
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={ASSIGNED_PROFESSOR.avatar} />
                  <AvatarFallback>{ASSIGNED_PROFESSOR.name[0]}</AvatarFallback>
                </Avatar>
                {ASSIGNED_PROFESSOR.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${colors.textPrimary} truncate`}>{ASSIGNED_PROFESSOR.name}</p>
                <p className="text-[10px] text-green-500 font-medium">متصل الآن</p>
              </div>
              <div className="flex gap-1.5">
                <button className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                  <Phone className="h-3.5 w-3.5 text-white" />
                </button>
                <button className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Video className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Note */}
            <div className="flex items-center gap-2 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl px-3 py-2 mb-3">
              <AlertCircle className="h-3.5 w-3.5 text-cyan-600 flex-shrink-0" />
              <p className="text-[10px] text-cyan-700 dark:text-cyan-400">التواصل مع الأستاذ المشرف إلزامي — يجب الرد على الرسائل خلال 24 ساعة</p>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto pb-2">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    msg.from === 'prof'
                      ? 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-br-sm'
                      : `${colors.cardBg} border ${colors.border} ${colors.textPrimary} rounded-bl-sm`
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[9px] mt-1 ${msg.from === 'prof' ? 'text-white/60' : colors.textTertiary}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className={`flex items-center gap-2 mt-3 p-3 ${colors.cardBg} rounded-2xl border ${colors.border}`}>
              <input
                type="text"
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="اكتب رسالة للأستاذ..."
                className={`flex-1 text-sm ${colors.bgPrimary} ${colors.textPrimary} focus:outline-none px-2 py-1 rounded-lg`}
                dir="rtl"
              />
              <button
                onClick={sendMessage}
                disabled={!newMsg.trim()}
                className="w-9 h-9 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DemonstratorPortal;
