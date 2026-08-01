import { useState } from 'react';
import { FileText, Bell, CheckSquare, Clock, AlertCircle, ChevronRight, BarChart2, Inbox, Send, User, Calendar, X, CheckCircle, ClipboardList } from 'lucide-react';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { UserInfo } from '../App';

interface SecretaryPortalProps {
  user: UserInfo;
}

type DocStatus = 'new' | 'awaiting_inspection' | 'inspection_received' | 'forwarded' | 'rejected';

interface IncomingDoc {
  id: number;
  title: string;
  from: string;
  fromRole: string;
  date: string;
  type: 'leave' | 'other';
  status: DocStatus;
  notes?: string;
  inspectionRequested?: boolean;
  inspectionReceived?: boolean;
}

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'جديد', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  awaiting_inspection: { label: 'بانتظار ورقة الفحص', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  inspection_received: { label: 'استُلمت ورقة الفحص', color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/30' },
  forwarded: { label: 'أُحيل لرئيس القسم', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  rejected: { label: 'مرفوض', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
};

const INITIAL_DOCS: IncomingDoc[] = [
  { id: 1, title: 'إجازة مرضية', from: 'م.د. علي الموسوي', fromRole: 'محاضر', date: 'اليوم', type: 'leave', status: 'new' },
  { id: 2, title: 'إجازة اعتيادية — 3 أيام', from: 'م.م. نور حسين', fromRole: 'مدرس مساعد', date: 'أمس', type: 'leave', status: 'awaiting_inspection', inspectionRequested: true },
  { id: 3, title: 'إجازة مرضية', from: 'أ.م. القريشي', fromRole: 'أستاذ مساعد', date: 'منذ يومين', type: 'leave', status: 'inspection_received', inspectionRequested: true, inspectionReceived: true },
  { id: 4, title: 'طلب استئذان', from: 'م.م. سامر ياسين', fromRole: 'مدرس مساعد', date: 'منذ 3 أيام', type: 'leave', status: 'forwarded' },
];

export function SecretaryPortal({ user }: SecretaryPortalProps) {
  const [activeTab, setActiveTab] = useState<'queue' | 'process' | 'done'>('queue');
  const [docs, setDocs] = useState<IncomingDoc[]>(INITIAL_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<IncomingDoc | null>(null);
  const [actionNote, setActionNote] = useState('');
  const { colors } = useTheme();
  const { t } = useLanguage();

  const queueDocs = docs.filter(d => d.status === 'new' || d.status === 'awaiting_inspection' || d.status === 'inspection_received');
  const doneDocs = docs.filter(d => d.status === 'forwarded' || d.status === 'rejected');

  const requestInspection = (id: number) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'awaiting_inspection', inspectionRequested: true } : d));
    setSelectedDoc(null);
  };

  const markInspectionReceived = (id: number) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'inspection_received', inspectionReceived: true } : d));
    setSelectedDoc(null);
  };

  const forwardToDeptHead = (id: number) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'forwarded', notes: actionNote } : d));
    setActionNote('');
    setSelectedDoc(null);
  };

  const rejectDoc = (id: number) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected', notes: actionNote } : d));
    setActionNote('');
    setSelectedDoc(null);
  };

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30">
            <ClipboardList className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs mb-0.5">بوابة السكرتارية</p>
            <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-pink-200 text-xs">{user.department}</p>
          </div>
          <div className="ml-auto relative">
            <button className="bg-white/15 hover:bg-white/25 text-white rounded-xl p-2 transition-all">
              <Bell className="h-5 w-5" />
            </button>
            {queueDocs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[9px] font-bold text-slate-900 flex items-center justify-center">
                {queueDocs.length}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'قيد التدقيق', value: queueDocs.length, icon: Inbox },
            { label: 'بانتظار الفحص', value: docs.filter(d => d.status === 'awaiting_inspection').length, icon: Clock },
            { label: 'تمت المعالجة', value: doneDocs.length, icon: CheckSquare },
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
        <div className="flex">
          {[
            { id: 'queue', label: t('tab_requests'), icon: Inbox, count: queueDocs.length },
            { id: 'process', label: 'المعالجة', icon: BarChart2 },
            { id: 'done', label: 'المنجزة', icon: CheckCircle, count: doneDocs.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id ? 'border-pink-500 text-pink-600' : `border-transparent ${colors.textSecondary}`
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.count ? (
                <span className="w-4 h-4 bg-pink-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {tab.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {activeTab === 'queue' && (
          <>
            {queueDocs.length === 0 ? (
              <div className={`${colors.cardBg} rounded-2xl p-8 border ${colors.border} text-center`}>
                <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
                <p className={`text-sm font-medium ${colors.textPrimary}`}>لا توجد طلبات معلقة</p>
                <p className={`text-xs ${colors.textTertiary} mt-1`}>تمت معالجة جميع الطلبات</p>
              </div>
            ) : (
              queueDocs.map(doc => (
                <motion.div
                  key={doc.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDoc(doc)}
                  className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border} cursor-pointer active:opacity-80`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[doc.status].bg} ${STATUS_CONFIG[doc.status].color}`}>
                          {STATUS_CONFIG[doc.status].label}
                        </span>
                        {doc.status === 'new' && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">طلب إجازة</span>
                        )}
                      </div>
                      <p className={`text-sm font-bold ${colors.textPrimary}`}>{doc.title}</p>
                      <p className={`text-xs ${colors.textSecondary} mt-0.5`}>{doc.from} — {doc.fromRole}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-[10px] ${colors.textTertiary}`}>{doc.date}</p>
                    {doc.status === 'awaiting_inspection' && (
                      <span className="flex items-center gap-1 text-[10px] text-orange-500">
                        <Clock className="h-3 w-3" /> بانتظار ورقة الفحص
                      </span>
                    )}
                    {doc.status === 'inspection_received' && (
                      <span className="flex items-center gap-1 text-[10px] text-teal-500">
                        <CheckCircle className="h-3 w-3" /> الفحص مستلم — جاهز للإحالة
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </>
        )}

        {activeTab === 'process' && (
          <div className={`${colors.cardBg} rounded-2xl p-5 border ${colors.border}`}>
            <h3 className={`font-bold text-sm ${colors.textPrimary} mb-4`}>آلية معالجة طلبات الإجازة</h3>
            <div className="space-y-4">
              {[
                { step: 1, title: 'استلام الطلب', desc: 'يرفع الموظف طلب الإجازة عبر التطبيق', icon: Inbox, color: 'bg-blue-500' },
                { step: 2, title: 'طلب ورقة الفحص', desc: 'تطلب السكرتارية ورقة الفحص الطبي للإجازة المرضية', icon: FileText, color: 'bg-orange-500' },
                { step: 3, title: 'استلام الفحص', desc: 'يُسلَّم الفحص الطبي ويُوثَّق في النظام', icon: CheckCircle, color: 'bg-teal-500' },
                { step: 4, title: 'إحالة لرئيس القسم', desc: 'يُرفع الطلب مع المستندات لرئيس القسم للموافقة الإلكترونية', icon: Send, color: 'bg-green-500' },
              ].map((s, i, arr) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <s.icon className="h-4 w-4 text-white" />
                    </div>
                    {i < arr.length - 1 && <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 mt-1" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className={`text-xs font-bold ${colors.textPrimary}`}>{s.step}. {s.title}</p>
                    <p className={`text-[11px] ${colors.textTertiary} mt-0.5 leading-relaxed`}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-4 p-3 ${colors.bgSecondary} rounded-xl`}>
              <p className={`text-xs font-semibold text-orange-600 mb-1`}>ملاحظة مهمة</p>
              <p className={`text-[11px] ${colors.textTertiary} leading-relaxed`}>
                الإجازات المرضية تستلزم تقديم تقرير طبي من مؤسسة صحية معتمدة قبل الإحالة لرئيس القسم. الإجازات الاعتيادية لا تحتاج فحصاً.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'done' && (
          <>
            {doneDocs.length === 0 ? (
              <div className={`${colors.cardBg} rounded-2xl p-8 border ${colors.border} text-center`}>
                <p className={`text-sm ${colors.textTertiary}`}>لا توجد طلبات منجزة بعد</p>
              </div>
            ) : (
              doneDocs.map(doc => (
                <div key={doc.id} className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[doc.status].bg} ${STATUS_CONFIG[doc.status].color}`}>
                          {STATUS_CONFIG[doc.status].label}
                        </span>
                      </div>
                      <p className={`text-sm font-bold ${colors.textPrimary}`}>{doc.title}</p>
                      <p className={`text-xs ${colors.textSecondary}`}>{doc.from}</p>
                      <p className={`text-[10px] ${colors.textTertiary} mt-1`}>{doc.date}</p>
                    </div>
                    {doc.status === 'forwarded' ? (
                      <Send className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                  {doc.notes && (
                    <p className={`mt-2 text-[11px] ${colors.textTertiary} border-t ${colors.border} pt-2`}>{doc.notes}</p>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Bottom Sheet Modal — Doc Review */}
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
              className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md ${colors.cardBg} rounded-t-3xl p-5 z-50 shadow-2xl`}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

              {/* Doc info */}
              <div className={`${colors.bgSecondary} rounded-2xl p-4 mb-4`}>
                <p className={`text-base font-bold ${colors.textPrimary} mb-1`}>{selectedDoc.title}</p>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <p className={`text-xs ${colors.textSecondary}`}>{selectedDoc.from} — {selectedDoc.fromRole}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <p className={`text-xs ${colors.textTertiary}`}>{selectedDoc.date}</p>
                </div>
              </div>

              {/* Status info */}
              <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl ${STATUS_CONFIG[selectedDoc.status].bg}`}>
                <AlertCircle className={`h-4 w-4 flex-shrink-0 ${STATUS_CONFIG[selectedDoc.status].color}`} />
                <p className={`text-xs font-semibold ${STATUS_CONFIG[selectedDoc.status].color}`}>
                  الحالة: {STATUS_CONFIG[selectedDoc.status].label}
                </p>
              </div>

              {/* Note field */}
              <textarea
                value={actionNote}
                onChange={e => setActionNote(e.target.value)}
                placeholder="ملاحظة (اختياري)..."
                rows={2}
                className={`w-full px-3 py-2.5 rounded-xl border ${colors.border} ${colors.bgPrimary} ${colors.textPrimary} text-xs resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 mb-3`}
                dir="rtl"
              />

              {/* Actions based on status */}
              <div className="space-y-2">
                {selectedDoc.status === 'new' && (
                  <button
                    onClick={() => requestInspection(selectedDoc.id)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    طلب ورقة الفحص الطبي
                  </button>
                )}

                {selectedDoc.status === 'awaiting_inspection' && (
                  <button
                    onClick={() => markInspectionReceived(selectedDoc.id)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    تأكيد استلام ورقة الفحص
                  </button>
                )}

                {(selectedDoc.status === 'inspection_received' || selectedDoc.status === 'new') && (
                  <button
                    onClick={() => forwardToDeptHead(selectedDoc.id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    إحالة لرئيس القسم
                  </button>
                )}

                <button
                  onClick={() => rejectDoc(selectedDoc.id)}
                  className="w-full bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-semibold py-3 rounded-xl transition-colors"
                >
                  رفض الطلب
                </button>
              </div>

              <button
                onClick={() => { setSelectedDoc(null); setActionNote(''); }}
                className={`w-full mt-2 py-2.5 text-sm ${colors.textSecondary} font-medium`}
              >
                إغلاق
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SecretaryPortal;
