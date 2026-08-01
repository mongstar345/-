import { useState } from 'react';
import { TrendingUp, Users, BookOpen, Award, Bell, Calendar, ChevronRight, BarChart2, CheckSquare, AlertTriangle, FileText, Building, Star, Briefcase, ClipboardList } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { UserInfo } from '../App';

interface DeanPortalProps {
  user: UserInfo;
}

const DEPT_STATS = [
  { name: 'هندسة الحاسوب', students: 320, faculty: 18, courses: 42, gpa: 3.2, color: 'bg-blue-500' },
  { name: 'هندسة الميكانيك', students: 280, faculty: 15, courses: 38, gpa: 3.1, color: 'bg-purple-500' },
  { name: 'هندسة الكيمياء', students: 190, faculty: 12, courses: 30, gpa: 3.4, color: 'bg-teal-500' },
  { name: 'هندسة المدني', students: 240, faculty: 14, courses: 35, gpa: 3.0, color: 'bg-orange-500' },
];

const PENDING_APPROVALS = [
  { id: 1, type: 'طلب إجازة', from: 'د. أحمد حسين', dept: 'هندسة الحاسوب', date: 'اليوم', urgent: true },
  { id: 2, type: 'منهج جديد', from: 'أ.م. سارة علي', dept: 'هندسة الميكانيك', date: 'أمس', urgent: false },
  { id: 3, type: 'طلب ترقية', from: 'م.م. علي محمد', dept: 'هندسة الكيمياء', date: 'منذ يومين', urgent: false },
  { id: 4, type: 'تغيير جدول', from: 'أ.د. فاطمة نور', dept: 'هندسة المدني', date: 'منذ 3 أيام', urgent: false },
];

const UPCOMING_EVENTS = [
  { title: 'اجتماع مجلس الكلية', date: 'الأحد 2 ديسمبر', time: '10:00 صباحاً', type: 'council' },
  { title: 'مراجعة نتائج الفصل', date: 'الإثنين 3 ديسمبر', time: '9:00 صباحاً', type: 'academic' },
  { title: 'زيارة وفد جامعة بغداد', date: 'الأربعاء 5 ديسمبر', time: '11:00 صباحاً', type: 'visit' },
];

export function DeanPortal({ user }: DeanPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'approvals' | 'reports'>('overview');
  const { colors } = useTheme();
  const { t } = useLanguage();

  const totalStudents = DEPT_STATS.reduce((s, d) => s + d.students, 0);
  const totalFaculty = DEPT_STATS.reduce((s, d) => s + d.faculty, 0);

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 via-rose-600 to-pink-700 px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-14 w-14 border-2 border-white/30">
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white/70 text-xs mb-0.5">بوابة العميد</p>
            <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-red-200 text-xs">{user.department}</p>
          </div>
          <div className="ml-auto relative">
            <button className="bg-white/15 hover:bg-white/25 text-white rounded-xl p-2 transition-all">
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[9px] font-bold text-slate-900 flex items-center justify-center">
              {PENDING_APPROVALS.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'الأقسام', value: DEPT_STATS.length, icon: Building },
            { label: 'الطلاب', value: totalStudents, icon: Users },
            { label: 'الأساتذة', value: totalFaculty, icon: Briefcase },
            { label: 'الموافقات', value: PENDING_APPROVALS.length, icon: CheckSquare },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <stat.icon className="h-4 w-4 text-white/70 mx-auto mb-1" />
              <p className="text-white font-bold text-base">{stat.value}</p>
              <p className="text-white/60 text-[9px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className={`${colors.bgPrimary} border-b ${colors.border} sticky top-0 z-10`}>
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: t('tab_overview'), icon: BarChart2 },
            { id: 'departments', label: t('tab_departments'), icon: Building },
            { id: 'approvals', label: 'الموافقات', icon: CheckSquare },
            { id: 'reports', label: 'التقارير', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id ? 'border-red-500 text-red-600' : `border-transparent ${colors.textSecondary}`
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
            {/* Upcoming Events */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-sm ${colors.textPrimary}`}>الفعاليات القادمة</h3>
                <Calendar className="h-4 w-4 text-red-500" />
              </div>
              <div className="space-y-2">
                {UPCOMING_EVENTS.map((ev, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${colors.bgSecondary}`}>
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      ev.type === 'council' ? 'bg-red-500' :
                      ev.type === 'academic' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${colors.textPrimary}`}>{ev.title}</p>
                      <p className={`text-[10px] ${colors.textTertiary}`}>{ev.date} • {ev.time}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals Summary */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-sm ${colors.textPrimary}`}>طلبات تحتاج موافقة</h3>
                <Badge className="bg-red-100 text-red-600 text-xs">{PENDING_APPROVALS.filter(p => p.urgent).length} عاجل</Badge>
              </div>
              <div className="space-y-2">
                {PENDING_APPROVALS.slice(0, 3).map(ap => (
                  <div key={ap.id} className={`flex items-center justify-between p-2.5 rounded-xl ${colors.bgSecondary}`}>
                    <div>
                      <p className={`text-xs font-semibold ${colors.textPrimary}`}>{ap.type}</p>
                      <p className={`text-[10px] ${colors.textTertiary}`}>{ap.from} • {ap.dept}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-lg font-medium">قبول</button>
                      <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-lg font-medium">رفض</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* College GPA Overview */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>متوسط المعدلات التراكمية</h3>
              {DEPT_STATS.map(dept => (
                <div key={dept.name} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${colors.textPrimary}`}>{dept.name}</span>
                    <span className={`text-xs font-bold ${colors.textPrimary}`}>{dept.gpa}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${dept.color} rounded-full`} style={{ width: `${(dept.gpa / 4) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'departments' && (
          <div className="space-y-3">
            {DEPT_STATS.map(dept => (
              <div key={dept.name} className={`${colors.cardBg} rounded-2xl overflow-hidden border ${colors.border} shadow-sm`}>
                <div className={`${dept.color} px-4 py-3 flex items-center justify-between`}>
                  <p className="text-white font-bold text-sm">{dept.name}</p>
                  <Star className="h-4 w-4 text-white/50" />
                </div>
                <div className="px-4 py-3 grid grid-cols-3 gap-3">
                  {[
                    { label: 'الطلاب', value: dept.students },
                    { label: 'الأساتذة', value: dept.faculty },
                    { label: 'المقررات', value: dept.courses },
                  ].map((stat, i) => (
                    <div key={i} className={`${colors.bgSecondary} rounded-xl p-2.5 text-center`}>
                      <p className={`text-base font-bold ${colors.textPrimary}`}>{stat.value}</p>
                      <p className={`text-[10px] ${colors.textTertiary}`}>{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className={`px-4 pb-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                    <span className={`text-xs ${colors.textSecondary}`}>GPA: {dept.gpa}</span>
                  </div>
                  <button className="text-xs text-red-500 font-medium flex items-center gap-1">
                    تفاصيل <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-3">
            {PENDING_APPROVALS.map(ap => (
              <div key={ap.id} className={`${colors.cardBg} rounded-2xl p-4 border ${ap.urgent ? 'border-red-300 dark:border-red-800' : colors.border}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {ap.urgent && <Badge className="bg-red-100 text-red-600 text-[10px] py-0">عاجل</Badge>}
                      <p className={`text-sm font-bold ${colors.textPrimary}`}>{ap.type}</p>
                    </div>
                    <p className={`text-xs ${colors.textSecondary}`}>{ap.from}</p>
                    <p className={`text-xs ${colors.textTertiary}`}>{ap.dept} • {ap.date}</p>
                  </div>
                  <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${ap.urgent ? 'text-red-500' : 'text-gray-400'}`} />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-xl transition-all">
                    موافقة ✓
                  </button>
                  <button className={`flex-1 ${colors.bgSecondary} ${colors.textSecondary} text-sm font-semibold py-2 rounded-xl transition-all`}>
                    طلب توضيح
                  </button>
                  <button className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-semibold py-2 rounded-xl transition-all">
                    رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-3">
            {[
              { title: 'التقرير الفصلي الأكاديمي', date: 'الفصل الأول 2024-2025', type: 'academic', size: '2.4 MB' },
              { title: 'إحصائيات الطلاب', date: 'نوفمبر 2024', type: 'stats', size: '1.1 MB' },
              { title: 'تقرير الحضور والغياب', date: 'أكتوبر 2024', type: 'attendance', size: '800 KB' },
              { title: 'تقييم أداء أعضاء الهيئة', date: 'السنة الأكاديمية 2024', type: 'performance', size: '3.2 MB' },
            ].map((report, i) => (
              <div key={i} className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border} flex items-center gap-3`}>
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${colors.textPrimary}`}>{report.title}</p>
                  <p className={`text-xs ${colors.textTertiary}`}>{report.date} • {report.size}</p>
                </div>
                <button className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium">
                  تنزيل
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeanPortal;
