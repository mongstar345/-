import { useState } from 'react';
import { Users, FileText, Bell, ChevronRight, BarChart2, CheckSquare, Award, TrendingUp, Building, Calendar, Vote, MessageSquare, Shield, Megaphone, Send, X, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { UserInfo } from '../App';

interface CouncilPortalProps {
  user: UserInfo;
}

type DocStatus = 'pending_council' | 'in_vote' | 'approved_council' | 'forwarded_ministry' | 'rejected';

interface ForwardedDoc {
  id: number;
  title: string;
  from: string;
  fromLevel: string;
  docType: 'promotion' | 'curriculum' | 'budget' | 'regulation' | 'official';
  status: DocStatus;
  date: string;
  nextStep: string;
  urgent?: boolean;
  votes?: { yes: number; no: number; abstain: number };
}

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string }> = {
  pending_council: { label: 'قيد الدراسة', color: 'text-yellow-700', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  in_vote: { label: 'جاري التصويت', color: 'text-blue-700', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  approved_council: { label: 'معتمد من المجلس', color: 'text-teal-700', bg: 'bg-teal-100 dark:bg-teal-900/30' },
  forwarded_ministry: { label: 'أُحيل للوزارة', color: 'text-green-700', bg: 'bg-green-100 dark:bg-green-900/30' },
  rejected: { label: 'مرفوض', color: 'text-red-700', bg: 'bg-red-100 dark:bg-red-900/30' },
};

const INITIAL_DOCS: ForwardedDoc[] = [
  {
    id: 1,
    title: 'طلب ترقية إلى أستاذ — د. محمد الراشد',
    from: 'عمادة كلية الهندسة',
    fromLevel: 'العميد',
    docType: 'promotion',
    status: 'in_vote',
    date: 'اليوم',
    nextStep: 'وزارة التعليم العالي',
    urgent: true,
    votes: { yes: 3, no: 1, abstain: 0 },
  },
  {
    id: 2,
    title: 'اعتماد المنهج الدراسي الجديد — قسم الذكاء الاصطناعي',
    from: 'عمادة كلية العلوم',
    fromLevel: 'العميد',
    docType: 'curriculum',
    status: 'pending_council',
    date: 'أمس',
    nextStep: 'رئاسة الجامعة ← وزارة التعليم العالي',
    votes: { yes: 0, no: 0, abstain: 0 },
  },
  {
    id: 3,
    title: 'تعديل اللائحة الداخلية للدراسات العليا',
    from: 'عمادة كلية الآداب',
    fromLevel: 'مجلس الكلية',
    docType: 'regulation',
    status: 'approved_council',
    date: 'منذ يومين',
    nextStep: 'وزارة التعليم العالي',
    votes: { yes: 5, no: 0, abstain: 0 },
  },
  {
    id: 4,
    title: 'طلب ترقية إلى أستاذ مساعد — أ.م. سارة حسين',
    from: 'عمادة كلية الهندسة',
    fromLevel: 'العميد',
    docType: 'promotion',
    status: 'forwarded_ministry',
    date: 'منذ أسبوع',
    nextStep: 'تمت الإحالة للوزارة',
    votes: { yes: 4, no: 1, abstain: 0 },
  },
];

const COUNCIL_MEMBERS = [
  { name: 'أ.د. محمد الجبوري', role: 'رئيس الجامعة', dept: 'رئاسة الجامعة', color: 'from-slate-600 to-slate-800' },
  { name: 'أ.د. فاطمة نور', role: 'نائب الرئيس للشؤون العلمية', dept: 'الشؤون الأكاديمية', color: 'from-blue-600 to-indigo-700' },
  { name: 'أ.د. عمر الراشد', role: 'عميد كلية الهندسة', dept: 'كلية الهندسة', color: 'from-red-500 to-rose-700' },
  { name: 'أ.د. ليلى حسن', role: 'عميدة كلية العلوم', dept: 'كلية العلوم', color: 'from-purple-600 to-violet-700' },
  { name: 'أ.د. كريم العبيدي', role: 'عميد كلية الآداب', dept: 'كلية الآداب', color: 'from-teal-500 to-emerald-700' },
];

const AGENDA_ITEMS = [
  { id: 1, title: 'اعتماد الخطة الدراسية للعام 2025-2026', status: 'pending', votes: { yes: 4, no: 1, abstain: 0 } },
  { id: 2, title: 'مناقشة ميزانية البنية التحتية', status: 'in-progress', votes: { yes: 3, no: 2, abstain: 0 } },
  { id: 3, title: 'قرار منح ألقاب الأستاذية', status: 'approved', votes: { yes: 5, no: 0, abstain: 0 } },
];

const UNIVERSITY_STATS = [
  { label: 'إجمالي الطلاب', value: '8,420', trend: '+5.2%' },
  { label: 'أعضاء الهيئة', value: '342', trend: '+2.1%' },
  { label: 'المشاريع البحثية', value: '87', trend: '+12%' },
  { label: 'الشراكات الدولية', value: '23', trend: '+4' },
];

const DOC_TYPE_LABELS: Record<string, string> = {
  promotion: 'ترقية علمية',
  curriculum: 'منهج دراسي',
  budget: 'ميزانية',
  regulation: 'لوائح',
  official: 'كتاب رسمي',
};

const CHAIN_STEPS = [
  { label: 'الموظف / هيئة التدريس', done: true },
  { label: 'رئيس القسم', done: true },
  { label: 'العميد', done: true },
  { label: 'مجلس الجامعة', active: true },
  { label: 'رئاسة الجامعة', done: false },
  { label: 'وزارة التعليم العالي', done: false },
];

export function CouncilPortal({ user }: CouncilPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'agenda' | 'members'>('overview');
  const [docs, setDocs] = useState<ForwardedDoc[]>(INITIAL_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<ForwardedDoc | null>(null);
  const [actionNote, setActionNote] = useState('');
  const { colors } = useTheme();
  const { t } = useLanguage();

  const pendingDocs = docs.filter(d => d.status === 'pending_council' || d.status === 'in_vote');

  const handleVote = (id: number, type: 'yes' | 'no' | 'abstain') => {
    setDocs(prev => prev.map(d => {
      if (d.id !== id || !d.votes) return d;
      return { ...d, status: 'in_vote', votes: { ...d.votes, [type]: d.votes[type] + 1 } };
    }));
  };

  const approveAndForward = (id: number) => {
    setDocs(prev => prev.map(d => d.id === id
      ? { ...d, status: 'forwarded_ministry', nextStep: 'تمت الإحالة للوزارة' }
      : d
    ));
    setActionNote('');
    setSelectedDoc(null);
  };

  const approveOnly = (id: number) => {
    setDocs(prev => prev.map(d => d.id === id
      ? { ...d, status: 'approved_council' }
      : d
    ));
    setActionNote('');
    setSelectedDoc(null);
  };

  const rejectDoc = (id: number) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
    setActionNote('');
    setSelectedDoc(null);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
  };

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center border-2 border-white/20">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs mb-0.5">مجلس الجامعة</p>
            <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-slate-300 text-xs">Al-Nahrain University Council</p>
          </div>
          <div className="ml-auto relative">
            <button className="bg-white/15 hover:bg-white/25 text-white rounded-xl p-2 transition-all">
              <Bell className="h-5 w-5" />
            </button>
            {pendingDocs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                {pendingDocs.length}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'الأعضاء', value: COUNCIL_MEMBERS.length, icon: Users },
            { label: 'قيد الدراسة', value: pendingDocs.length, icon: Vote },
            { label: 'معتمد', value: docs.filter(d => d.status === 'approved_council' || d.status === 'forwarded_ministry').length, icon: CheckSquare },
            { label: 'للوزارة', value: docs.filter(d => d.status === 'forwarded_ministry').length, icon: Send },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <stat.icon className="h-3.5 w-3.5 text-white/70 mx-auto mb-1" />
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
            { id: 'docs', label: t('tab_docs'), icon: FileText, count: pendingDocs.length },
            { id: 'agenda', label: t('tab_agenda'), icon: Vote },
            { id: 'members', label: t('tab_members'), icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-3.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id ? 'border-slate-600 text-slate-700 dark:text-slate-300' : `border-transparent ${colors.textSecondary}`
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.count ? (
                <span className="w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">{tab.count}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Bureaucratic chain */}
            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-xs ${colors.textPrimary} mb-3`}>مسار المعاملات الرسمية</h3>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {CHAIN_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`flex flex-col items-center gap-1`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        step.active ? 'bg-slate-700 text-white ring-2 ring-slate-400' :
                        step.done ? 'bg-green-500 text-white' :
                        'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}>
                        {step.done && !step.active ? '✓' : i + 1}
                      </div>
                      <p className={`text-[9px] text-center max-w-[52px] leading-tight ${
                        step.active ? `font-bold ${colors.textPrimary}` : colors.textTertiary
                      }`}>{step.label}</p>
                    </div>
                    {i < CHAIN_STEPS.length - 1 && (
                      <div className={`w-4 h-0.5 mb-4 flex-shrink-0 ${step.done ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* University stats */}
            <div className="grid grid-cols-2 gap-3">
              {UNIVERSITY_STATS.map((stat, i) => (
                <div key={i} className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
                  <p className={`text-2xl font-bold ${colors.textPrimary}`}>{stat.value}</p>
                  <p className={`text-xs ${colors.textSecondary} mb-1`}>{stat.label}</p>
                  <span className="text-xs font-semibold text-green-500">↑ {stat.trend}</span>
                </div>
              ))}
            </div>

            {/* Next meeting */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-300" />
                <p className="text-xs text-slate-300 font-medium">الاجتماع القادم</p>
              </div>
              <p className="font-bold text-lg mb-0.5">جلسة مجلس الجامعة العادية</p>
              <p className="text-slate-300 text-sm">الأحد 2 ديسمبر 2024 • 10:00 صباحاً</p>
              <p className="text-slate-400 text-xs mt-1">قاعة الاجتماعات الرئيسية — المبنى الإداري</p>
              <div className="mt-3 flex gap-2">
                <button className="bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-1.5 rounded-lg transition-all">جدول الأعمال</button>
                <button className="bg-white text-slate-800 text-xs px-3 py-1.5 rounded-lg font-semibold">تأكيد الحضور</button>
              </div>
            </div>

            {/* Pending docs alert */}
            {pendingDocs.length > 0 && (
              <button
                onClick={() => setActiveTab('docs')}
                className="w-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-2xl p-4 flex items-center gap-3 text-right"
              >
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                    {pendingDocs.length} معاملة تنتظر قرار المجلس
                  </p>
                  <p className="text-[10px] text-yellow-600 dark:text-yellow-500 mt-0.5">اضغط للمراجعة والتصويت</p>
                </div>
                <ChevronRight className="h-4 w-4 text-yellow-600" />
              </button>
            )}
          </>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-3">
            {docs.map(doc => (
              <motion.div
                key={doc.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDoc(doc)}
                className={`${colors.cardBg} rounded-2xl p-4 border ${
                  doc.urgent && doc.status !== 'forwarded_ministry' ? 'border-red-300 dark:border-red-800' : colors.border
                } cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[doc.status].bg} ${STATUS_CONFIG[doc.status].color}`}>
                        {STATUS_CONFIG[doc.status].label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 ${colors.textSecondary}`}>
                        {DOC_TYPE_LABELS[doc.docType]}
                      </span>
                    </div>
                    <p className={`text-sm font-bold ${colors.textPrimary} leading-snug`}>{doc.title}</p>
                    <p className={`text-xs ${colors.textSecondary} mt-0.5`}>من: {doc.from}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                </div>

                {doc.votes && (doc.status === 'in_vote' || doc.status === 'approved_council' || doc.status === 'forwarded_ministry') && (
                  <div className="flex items-center gap-3 text-[11px] mt-2">
                    <span className="text-green-600 font-medium">✓ {doc.votes.yes} مؤيد</span>
                    <span className="text-red-500 font-medium">✗ {doc.votes.no} معارض</span>
                    {doc.votes.abstain > 0 && <span className={colors.textTertiary}>○ {doc.votes.abstain} ممتنع</span>}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <p className={`text-[10px] ${colors.textTertiary}`}>{doc.date}</p>
                  {doc.status !== 'forwarded_ministry' && doc.status !== 'rejected' && (
                    <p className={`text-[10px] text-slate-500`}>التالي: {doc.nextStep}</p>
                  )}
                  {doc.status === 'forwarded_ministry' && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600">
                      <ExternalLink className="h-3 w-3" /> أُحيل للوزارة
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="space-y-3">
            {AGENDA_ITEMS.map(item => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.98 }}
                className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className={`text-sm font-bold ${colors.textPrimary} flex-1 pr-2 leading-snug`}>{item.title}</p>
                  <Badge className={`${statusColors[item.status]} text-xs flex-shrink-0`}>
                    {item.status === 'pending' ? 'قيد الانتظار' : item.status === 'in-progress' ? 'جاري التصويت' : 'معتمد'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2 text-center">
                    <p className="text-green-600 font-bold text-lg">{item.votes.yes}</p>
                    <p className="text-green-500 text-[10px]">مؤيد</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-2 text-center">
                    <p className="text-red-500 font-bold text-lg">{item.votes.no}</p>
                    <p className="text-red-400 text-[10px]">معارض</p>
                  </div>
                  <div className={`${colors.bgSecondary} rounded-xl p-2 text-center`}>
                    <p className={`${colors.textPrimary} font-bold text-lg`}>{item.votes.abstain}</p>
                    <p className={`${colors.textTertiary} text-[10px]`}>ممتنع</p>
                  </div>
                </div>

                {item.status !== 'approved' && (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-500 text-white text-sm py-2 rounded-xl font-medium">أؤيد</button>
                    <button className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm py-2 rounded-xl font-medium">أعارض</button>
                    <button className={`flex-1 ${colors.bgSecondary} ${colors.textSecondary} text-sm py-2 rounded-xl font-medium`}>ممتنع</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-3">
            {COUNCIL_MEMBERS.map((member, i) => (
              <div key={i} className={`${colors.cardBg} rounded-2xl overflow-hidden border ${colors.border}`}>
                <div className={`bg-gradient-to-r ${member.color} px-4 py-3 flex items-center gap-3`}>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {member.name[3]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{member.name}</p>
                    <p className="text-white/70 text-xs">{member.role}</p>
                  </div>
                </div>
                <div className={`px-4 py-2.5 flex items-center justify-between`}>
                  <span className={`text-xs ${colors.textSecondary}`}>{member.dept}</span>
                  <button className={`text-xs ${colors.textSecondary} flex items-center gap-1`}>
                    <MessageSquare className="h-3 w-3" /> راسل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sheet — Doc Review */}
      <AnimatePresence>
        {selectedDoc && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => { setSelectedDoc(null); setActionNote(''); }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md ${colors.cardBg} rounded-t-3xl p-5 z-50 shadow-2xl max-h-[85vh] overflow-y-auto`}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[selectedDoc.status].bg} ${STATUS_CONFIG[selectedDoc.status].color}`}>
                      {STATUS_CONFIG[selectedDoc.status].label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 ${colors.textSecondary}`}>
                      {DOC_TYPE_LABELS[selectedDoc.docType]}
                    </span>
                  </div>
                  <p className={`text-base font-bold ${colors.textPrimary} leading-snug`}>{selectedDoc.title}</p>
                  <p className={`text-xs ${colors.textSecondary} mt-1`}>من: {selectedDoc.from} ({selectedDoc.fromLevel})</p>
                  <p className={`text-xs ${colors.textTertiary}`}>{selectedDoc.date}</p>
                </div>
                <button onClick={() => { setSelectedDoc(null); setActionNote(''); }}>
                  <X className={`h-5 w-5 ${colors.textTertiary}`} />
                </button>
              </div>

              {/* Next step */}
              <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800`}>
                <Send className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <p className={`text-xs ${colors.textSecondary}`}>
                  بعد الاعتماد: <span className="font-bold">{selectedDoc.nextStep}</span>
                </p>
              </div>

              {/* Votes display */}
              {selectedDoc.votes && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'مؤيد', val: selectedDoc.votes.yes, color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
                    { label: 'معارض', val: selectedDoc.votes.no, color: 'bg-red-50 dark:bg-red-900/20 text-red-500' },
                    { label: 'ممتنع', val: selectedDoc.votes.abstain, color: `${colors.bgSecondary} ${colors.textSecondary}` },
                  ].map((v, i) => (
                    <div key={i} className={`${v.color} rounded-xl p-2.5 text-center`}>
                      <p className="font-bold text-xl">{v.val}</p>
                      <p className="text-[10px]">{v.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Vote buttons if in-vote or pending */}
              {(selectedDoc.status === 'pending_council' || selectedDoc.status === 'in_vote') && (
                <div className="flex gap-2 mb-3">
                  <button onClick={() => handleVote(selectedDoc.id, 'yes')} className="flex-1 bg-green-500 text-white text-sm py-2.5 rounded-xl font-semibold">أؤيد</button>
                  <button onClick={() => handleVote(selectedDoc.id, 'no')} className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm py-2.5 rounded-xl font-semibold">أعارض</button>
                  <button onClick={() => handleVote(selectedDoc.id, 'abstain')} className={`flex-1 ${colors.bgSecondary} ${colors.textSecondary} text-sm py-2.5 rounded-xl font-semibold`}>ممتنع</button>
                </div>
              )}

              {/* Note */}
              <textarea
                value={actionNote}
                onChange={e => setActionNote(e.target.value)}
                placeholder="ملاحظة القرار (اختياري)..."
                rows={2}
                className={`w-full px-3 py-2.5 rounded-xl border ${colors.border} ${colors.bgPrimary} ${colors.textPrimary} text-xs resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 mb-3`}
                dir="rtl"
              />

              {/* Action buttons */}
              {selectedDoc.status !== 'forwarded_ministry' && selectedDoc.status !== 'rejected' && (
                <div className="space-y-2">
                  {(selectedDoc.docType === 'promotion' || selectedDoc.docType === 'curriculum' || selectedDoc.docType === 'regulation') && (
                    <button
                      onClick={() => approveAndForward(selectedDoc.id)}
                      className="w-full bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      اعتماد وإحالة لوزارة التعليم العالي
                    </button>
                  )}
                  <button
                    onClick={() => approveOnly(selectedDoc.id)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    اعتماد فقط
                  </button>
                  <button
                    onClick={() => rejectDoc(selectedDoc.id)}
                    className="w-full bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-semibold py-3 rounded-xl"
                  >
                    رفض
                  </button>
                </div>
              )}

              {(selectedDoc.status === 'forwarded_ministry' || selectedDoc.status === 'rejected') && (
                <div className={`p-3 rounded-xl ${selectedDoc.status === 'forwarded_ministry' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} text-center`}>
                  <p className={`text-sm font-bold ${selectedDoc.status === 'forwarded_ministry' ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedDoc.status === 'forwarded_ministry' ? 'تمت الإحالة لوزارة التعليم العالي ✓' : 'تم رفض المعاملة'}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CouncilPortal;
