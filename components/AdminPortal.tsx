import { useState, useRef, useEffect } from 'react';
import { Shield, Bell, CheckSquare, X, Users, Plus, Copy, RefreshCw, BarChart2, FileText, Settings, Clock, CheckCircle, AlertCircle, ChevronRight, Key, UserPlus, Search, GraduationCap, Upload, Trash2, Edit3, Globe, ClipboardList, Sparkles, DollarSign, Save } from 'lucide-react';
import { loadServicePrices, saveServicePrices, DEFAULT_SERVICE_PRICES, type ServicePrice } from '../data/services';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { UserInfo } from '../App';
import { ROLE_LABELS } from './Login';
import type { University } from '../data/universities';
import { GRADIENT_PRESETS } from '../data/universities';

interface AdminPortalProps {
  user: UserInfo;
  universities: University[];
  onUniversitiesChange: (universities: University[]) => void;
}

type PostStatus = 'pending' | 'approved' | 'rejected';
type AccountRole = 'student' | 'professor' | 'asstprofessor' | 'dean' | 'depthead' | 'council' | 'secretary' | 'coordinator' | 'demonstrator' | 'ta';

interface PendingPost {
  id: number;
  author: string;
  role: string;
  content: string;
  type: 'announcement' | 'event' | 'resource' | 'discussion';
  time: string;
  status: PostStatus;
}

interface ManagedAccount {
  id: number;
  name: string;
  role: AccountRole;
  department: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  tempCode?: string;
}

const TYPE_LABELS: Record<string, string> = {
  announcement: 'إعلان',
  event: 'فعالية',
  resource: 'مورد تعليمي',
  discussion: 'نقاش',
};

const TYPE_COLORS: Record<string, string> = {
  announcement: 'bg-blue-100 text-blue-700',
  event: 'bg-green-100 text-green-700',
  resource: 'bg-purple-100 text-purple-700',
  discussion: 'bg-orange-100 text-orange-700',
};

const INITIAL_POSTS: PendingPost[] = [
  { id: 1, author: 'أ.د. أحمد حسين', role: 'professor', content: 'إعلان عن تأجيل محاضرة هياكل البيانات يوم الأحد القادم بسبب ظروف طارئة. سيتم تعويضها لاحقاً.', type: 'announcement', time: 'منذ 5 دقائق', status: 'pending' },
  { id: 2, author: 'نادي هندسة الحاسوب', role: 'student', content: 'ندعوكم لحضور ورشة عمل البرمجة التنافسية يوم الثلاثاء الساعة 4 مساءً في قاعة المحاضرات الكبرى.', type: 'event', time: 'منذ 20 دقيقة', status: 'pending' },
  { id: 3, author: 'م.م. زيد علي', role: 'demonstrator', content: 'ملاحظات درس الـ SQL الأسبوع الماضي — رفعت النسخة المحدثة في المكتبة الإلكترونية.', type: 'resource', time: 'منذ ساعة', status: 'pending' },
  { id: 4, author: 'هناء كاظم', role: 'secretary', content: 'تذكير: الموعد النهائي لتقديم طلبات الإجازة الاعتيادية هو نهاية هذا الأسبوع.', type: 'announcement', time: 'منذ 3 ساعات', status: 'pending' },
  { id: 5, author: 'أ.م. سارة علي', role: 'asstprofessor', content: 'شاركوا آراءكم: هل تفضلون الامتحانات الورقية أم الإلكترونية؟', type: 'discussion', time: 'منذ 5 ساعات', status: 'approved' },
];

const INITIAL_ACCOUNTS: ManagedAccount[] = [
  { id: 1, name: 'علي محمد', role: 'student', department: 'هندسة الحاسوب', email: 'ali.student@student.nahrainuniv.edu.iq', status: 'active', createdAt: '1 سبتمبر 2024' },
  { id: 2, name: 'أ.د. أحمد حسين', role: 'professor', department: 'هندسة الحاسوب', email: 'prof.ahmed@nahrain.edu.iq', status: 'active', createdAt: '15 أغسطس 2024' },
  { id: 3, name: 'هناء كاظم', role: 'secretary', department: 'قسم الحاسوب', email: 'secretary.hana@nahrain.edu.iq', status: 'active', createdAt: '20 أغسطس 2024' },
  { id: 4, name: 'م. كريم ناصر', role: 'coordinator', department: 'هندسة الحاسوب', email: 'coord.kareem@nahrain.edu.iq', status: 'active', createdAt: '5 سبتمبر 2024' },
  { id: 5, name: 'م.م. زيد علي', role: 'demonstrator', department: 'هندسة الحاسوب', email: 'demo.zaid@nahrain.edu.iq', status: 'pending', createdAt: 'اليوم', tempCode: 'TMP-8847' },
];

function generateTempCode() {
  return 'TMP-' + Math.floor(1000 + Math.random() * 9000);
}

const ROLE_GRADIENT: Record<string, string> = {
  student: 'from-orange-500 to-amber-500',
  professor: 'from-purple-600 to-indigo-600',
  asstprofessor: 'from-blue-500 to-cyan-500',
  dean: 'from-red-500 to-rose-600',
  depthead: 'from-green-500 to-teal-600',
  council: 'from-slate-600 to-slate-800',
  secretary: 'from-pink-500 to-rose-500',
  coordinator: 'from-indigo-500 to-violet-500',
  demonstrator: 'from-cyan-500 to-teal-500',
  ta: 'from-teal-500 to-green-500',
  admin: 'from-yellow-500 to-orange-500',
};

export function AdminPortal({ user, universities, onUniversitiesChange }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'moderation' | 'accounts' | 'universities' | 'stats' | 'settings' | 'tasks' | 'services'>('moderation');
  const [servicePrices, setServicePricesState] = useState<ServicePrice[]>([]);

  useEffect(() => {
    setServicePricesState(loadServicePrices());
  }, []);

  const handleSaveServicePrices = () => {
    saveServicePrices(servicePrices);
  };
  const [posts, setPosts] = useState<PendingPost[]>(INITIAL_POSTS);
  const [accounts, setAccounts] = useState<ManagedAccount[]>(INITIAL_ACCOUNTS);
  const [selectedPost, setSelectedPost] = useState<PendingPost | null>(null);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', role: 'student' as AccountRole, department: '', email: '' });
  const [createdCode, setCreatedCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  // University management state
  const [showUnivForm, setShowUnivForm] = useState(false);
  const [editingUniv, setEditingUniv] = useState<University | null>(null);
  const [univForm, setUnivForm] = useState({ nameAr: '', nameEn: '', city: '', domainsStr: '', color: 'from-blue-600 to-indigo-700', logoUrl: '' });
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { colors } = useTheme();
  const { t } = useLanguage();

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const approvedPosts = posts.filter(p => p.status === 'approved');

  const handlePostAction = (id: number, action: 'approved' | 'rejected') => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: action } : p));
    setSelectedPost(null);
  };

  const handleCreateAccount = () => {
    const code = generateTempCode();
    const acc: ManagedAccount = {
      id: Date.now(),
      name: newAccount.name || 'حساب جديد',
      role: newAccount.role,
      department: newAccount.department,
      email: newAccount.email,
      status: 'pending',
      createdAt: 'اليوم',
      tempCode: code,
    };
    setAccounts(prev => [acc, ...prev]);
    setCreatedCode(code);
    setNewAccount({ name: '', role: 'student', department: '', email: '' });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const regenerateCode = (id: number) => {
    const code = generateTempCode();
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, tempCode: code } : a));
  };

  const filteredAccounts = accounts.filter(a =>
    a.name.includes(searchQuery) || a.email.includes(searchQuery) || a.department.includes(searchQuery)
  );

  // University helpers
  const openAddUniv = () => {
    setEditingUniv(null);
    setUnivForm({ nameAr: '', nameEn: '', city: '', domainsStr: '', color: 'from-blue-600 to-indigo-700', logoUrl: '' });
    setShowUnivForm(true);
  };

  const openEditUniv = (u: University) => {
    setEditingUniv(u);
    setUnivForm({ nameAr: u.nameAr, nameEn: u.nameEn, city: u.city, domainsStr: u.domains.join(', '), color: u.color, logoUrl: u.logoUrl });
    setShowUnivForm(true);
  };

  const saveUniv = () => {
    const domains = univForm.domainsStr.split(',').map(s => s.trim()).filter(Boolean);
    if (!univForm.nameAr.trim()) return;
    if (editingUniv) {
      onUniversitiesChange(universities.map(u => u.id === editingUniv.id
        ? { ...u, nameAr: univForm.nameAr, nameEn: univForm.nameEn, city: univForm.city, domains, color: univForm.color, logoUrl: univForm.logoUrl }
        : u
      ));
    } else {
      const newU: University = {
        id: Date.now().toString(),
        nameAr: univForm.nameAr,
        nameEn: univForm.nameEn,
        city: univForm.city,
        domains,
        color: univForm.color,
        logoUrl: univForm.logoUrl,
      };
      onUniversitiesChange([...universities, newU]);
    }
    setShowUnivForm(false);
  };

  const deleteUniv = (id: string) => {
    onUniversitiesChange(universities.filter(u => u.id !== id));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUnivForm(f => ({ ...f, logoUrl: url }));
  };

  const SYSTEM_STATS = [
    { label: t('total_users'), value: accounts.length, icon: Users, color: 'from-blue-500 to-indigo-500' },
    { label: t('pending_review'), value: pendingPosts.length, icon: Clock, color: 'from-orange-500 to-amber-500' },
    { label: t('approved_posts'), value: approvedPosts.length, icon: CheckSquare, color: 'from-green-500 to-teal-500' },
    { label: t('pending_accounts'), value: accounts.filter(a => a.status === 'pending').length, icon: AlertCircle, color: 'from-red-500 to-rose-500' },
  ];

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-600 px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs mb-0.5">{t('admin_portal')}</p>
            <h2 className="text-white font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-amber-200 text-xs">{t('system_admin')}</p>
          </div>
          <div className="ml-auto relative">
            <button className="bg-white/15 hover:bg-white/25 text-white rounded-xl p-2 transition-all">
              <Bell className="h-5 w-5" />
            </button>
            {pendingPosts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {pendingPosts.length}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {SYSTEM_STATS.map((s, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <s.icon className="h-3.5 w-3.5 text-white/70 mx-auto mb-1" />
              <p className="text-white font-bold text-base">{s.value}</p>
              <p className="text-white/60 text-[9px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className={`${colors.bgPrimary} border-b ${colors.border} sticky top-0 z-10`}>
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { id: 'moderation', label: t('tab_moderation'), icon: FileText, count: pendingPosts.length },
            { id: 'accounts', label: t('tab_accounts'), icon: Users },
            { id: 'universities', label: t('tab_universities'), icon: GraduationCap },
            { id: 'tasks', label: 'مهام الطلاب', icon: ClipboardList },
            { id: 'services', label: 'أسعار الخدمات', icon: Sparkles },
            { id: 'stats', label: t('tab_admin_stats'), icon: BarChart2 },
            { id: 'settings', label: t('tab_admin_settings'), icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-3.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id ? 'border-orange-500 text-orange-600' : `border-transparent ${colors.textSecondary}`
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.count ? (
                <span className="w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">{tab.count}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* ---- MODERATION TAB ---- */}
        {activeTab === 'moderation' && (
          <>
            {pendingPosts.length === 0 && (
              <div className={`${colors.cardBg} rounded-2xl p-8 border ${colors.border} text-center`}>
                <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
                <p className={`text-sm font-medium ${colors.textPrimary}`}>{t('no_pending_posts')}</p>
                <p className={`text-xs ${colors.textTertiary} mt-1`}>{t('all_reviewed')}</p>
              </div>
            )}
            {posts.map(post => (
              <motion.div
                key={post.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => post.status === 'pending' && setSelectedPost(post)}
                className={`${colors.cardBg} rounded-2xl p-4 border ${
                  post.status === 'pending' ? `${colors.border} cursor-pointer` :
                  post.status === 'approved' ? 'border-green-300 dark:border-green-800' :
                  'border-red-200 dark:border-red-900'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[post.type]}`}>
                      {TYPE_LABELS[post.type]}
                    </span>
                    {post.status === 'pending' && (
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">بانتظار الموافقة</span>
                    )}
                    {post.status === 'approved' && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">✓ موافق</span>
                    )}
                    {post.status === 'rejected' && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">✗ مرفوض</span>
                    )}
                  </div>
                  {post.status === 'pending' && <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                </div>
                <p className={`text-sm font-medium ${colors.textPrimary} leading-relaxed mb-2`}>{post.content}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold ${colors.textSecondary}`}>{post.author}</span>
                    <span className={`text-xs ${colors.textTertiary}`}> • {ROLE_LABELS[post.role] ?? post.role}</span>
                  </div>
                  <span className={`text-[10px] ${colors.textTertiary}`}>{post.time}</span>
                </div>
                {post.status === 'pending' && (
                  <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handlePostAction(post.id, 'approved')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> {t('approve_publish')}
                    </button>
                    <button
                      onClick={() => handlePostAction(post.id, 'rejected')}
                      className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" /> {t('reject')}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </>
        )}

        {/* ---- ACCOUNTS TAB ---- */}
        {activeTab === 'accounts' && (
          <>
            {/* Create account button */}
            <button
              onClick={() => { setShowCreateAccount(true); setCreatedCode(''); }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              {t('create_new_account')}
            </button>

            {/* Search */}
            <div className="relative">
              <Search className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${colors.textTertiary}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="بحث عن حساب..."
                className={`w-full pr-10 pl-4 py-3 rounded-xl border ${colors.border} ${colors.bgPrimary} ${colors.textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-orange-400`}
                dir="rtl"
              />
            </div>

            {/* Account list */}
            {filteredAccounts.map(acc => (
              <div key={acc.id} className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden`}>
                <div className={`bg-gradient-to-r ${ROLE_GRADIENT[acc.role] ?? 'from-gray-500 to-gray-600'} px-4 py-3 flex items-center gap-3`}>
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
                    {acc.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{acc.name}</p>
                    <p className="text-white/70 text-xs">{ROLE_LABELS[acc.role]}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      acc.status === 'active' ? 'bg-green-400/30 text-white' :
                      acc.status === 'pending' ? 'bg-yellow-400/30 text-white' :
                      'bg-red-400/30 text-white'
                    }`}>
                      {acc.status === 'active' ? 'نشط' : acc.status === 'pending' ? 'معلق' : 'موقوف'}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className={`text-xs ${colors.textTertiary} mb-1 truncate`}>{acc.email}</p>
                  <p className={`text-xs ${colors.textSecondary}`}>{acc.department} • أُنشئ {acc.createdAt}</p>

                  {acc.tempCode && (
                    <div className={`mt-3 flex items-center gap-2 ${colors.bgSecondary} rounded-xl px-3 py-2`}>
                      <Key className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className={`text-xs font-mono font-bold ${colors.textPrimary} flex-1`}>{acc.tempCode}</span>
                      <button
                        onClick={() => copyCode(acc.tempCode!)}
                        className="text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        {copiedCode === acc.tempCode
                          ? <CheckCircle className="h-4 w-4 text-green-500" />
                          : <Copy className="h-4 w-4" />
                        }
                      </button>
                      <button
                        onClick={() => regenerateCode(acc.id)}
                        className={`${colors.textTertiary} hover:${colors.textSecondary} transition-colors`}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ---- UNIVERSITIES TAB ---- */}
        {activeTab === 'universities' && (
          <>
            <button
              onClick={openAddUniv}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <Plus className="h-5 w-5" />
              {t('add_new_university')}
            </button>

            {universities.map(u => {
              const initials = u.nameAr.replace(/[^؀-ۿ]/g, '').slice(0, 2);
              return (
                <div key={u.id} className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden`}>
                  <div className={`bg-gradient-to-r ${u.color} px-4 py-3 flex items-center gap-3`}>
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
                      {u.logoUrl ? (
                        <img src={u.logoUrl} alt={u.nameAr} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-white font-bold text-sm">{initials || u.nameAr[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">{u.nameAr}</p>
                      <p className="text-white/70 text-xs">{u.nameEn}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditUniv(u)}
                        className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-1.5 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteUniv(u.id)}
                        className="bg-white/20 hover:bg-red-500/60 text-white rounded-lg p-1.5 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Globe className="h-3 w-3 text-orange-500 flex-shrink-0" />
                      <p className={`text-xs ${colors.textSecondary}`}>{u.city}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {u.domains.map(d => (
                        <span key={d} className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${colors.bgSecondary} ${colors.textTertiary} border ${colors.border}`}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* University form bottom sheet */}
            <AnimatePresence>
              {showUnivForm && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowUnivForm(false)}
                  />
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    className={`fixed bottom-0 left-0 right-0 z-50 ${colors.bgPrimary} rounded-t-3xl max-h-[90vh] overflow-y-auto`}
                  >
                    <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-4" />
                    <div className="px-5 pb-8">
                      <h3 className={`font-bold text-base ${colors.textPrimary} mb-4`}>
                        {editingUniv ? t('edit_university') : t('add_new_university')}
                      </h3>

                      {/* Logo upload */}
                      <div className="flex items-center gap-4 mb-5">
                        <div
                          className={`w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${univForm.color} cursor-pointer`}
                          onClick={() => logoInputRef.current?.click()}
                        >
                          {univForm.logoUrl ? (
                            <img src={univForm.logoUrl} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <Upload className="h-6 w-6 text-white/80" />
                              <span className="text-white/70 text-[9px]">شعار</span>
                            </div>
                          )}
                        </div>
                        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        <div className="flex-1">
                          <p className={`text-xs font-medium ${colors.textSecondary} mb-1`}>{t('univ_logo')}</p>
                          <button
                            onClick={() => logoInputRef.current?.click()}
                            className="text-xs text-orange-500 font-semibold border border-orange-300 rounded-lg px-3 py-1.5 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                          >
                            {t('choose_image')}
                          </button>
                          {univForm.logoUrl && (
                            <button
                              onClick={() => setUnivForm(f => ({ ...f, logoUrl: '' }))}
                              className="mr-2 text-xs text-red-500 font-semibold border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className={`text-xs font-semibold ${colors.textSecondary} block mb-1`}>{t('univ_name_ar')} *</label>
                          <input
                            value={univForm.nameAr}
                            onChange={e => setUnivForm(f => ({ ...f, nameAr: e.target.value }))}
                            placeholder="مثال: جامعة بغداد"
                            dir="rtl"
                            className={`w-full px-3 py-2.5 rounded-xl border ${colors.border} ${colors.bgPrimary} ${colors.textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-orange-400`}
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-semibold ${colors.textSecondary} block mb-1`}>{t('univ_name_en')}</label>
                          <input
                            value={univForm.nameEn}
                            onChange={e => setUnivForm(f => ({ ...f, nameEn: e.target.value }))}
                            placeholder="University of Baghdad"
                            dir="ltr"
                            className={`w-full px-3 py-2.5 rounded-xl border ${colors.border} ${colors.bgPrimary} ${colors.textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-orange-400`}
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-semibold ${colors.textSecondary} block mb-1`}>{t('city')}</label>
                          <input
                            value={univForm.city}
                            onChange={e => setUnivForm(f => ({ ...f, city: e.target.value }))}
                            placeholder="بغداد"
                            dir="rtl"
                            className={`w-full px-3 py-2.5 rounded-xl border ${colors.border} ${colors.bgPrimary} ${colors.textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-orange-400`}
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-semibold ${colors.textSecondary} block mb-1`}>{t('email_domains')}</label>
                          <textarea
                            value={univForm.domainsStr}
                            onChange={e => setUnivForm(f => ({ ...f, domainsStr: e.target.value }))}
                            placeholder="@uobaghdad.edu.iq, @student.uobaghdad.edu.iq"
                            dir="ltr"
                            rows={2}
                            className={`w-full px-3 py-2.5 rounded-xl border ${colors.border} ${colors.bgPrimary} ${colors.textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none`}
                          />
                        </div>

                        {/* Color picker */}
                        <div>
                          <label className={`text-xs font-semibold ${colors.textSecondary} block mb-2`}>{t('univ_color')}</label>
                          <div className="grid grid-cols-5 gap-2">
                            {GRADIENT_PRESETS.map(p => (
                              <button
                                key={p.value}
                                onClick={() => setUnivForm(f => ({ ...f, color: p.value }))}
                                className={`h-10 rounded-xl bg-gradient-to-br ${p.value} transition-all ${
                                  univForm.color === p.value ? 'ring-2 ring-orange-500 ring-offset-2 scale-105' : 'opacity-80 hover:opacity-100'
                                }`}
                                title={p.label}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-5">
                        <button
                          onClick={() => setShowUnivForm(false)}
                          className={`flex-1 border ${colors.border} ${colors.textSecondary} font-semibold py-3 rounded-2xl text-sm transition-colors`}
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={saveUniv}
                          disabled={!univForm.nameAr.trim()}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl text-sm transition-colors"
                        >
                          {editingUniv ? t('save_changes') : t('add_university')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        )}

        {/* ---- STATS TAB ---- */}
        {activeTab === 'stats' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {SYSTEM_STATS.map((s, i) => (
                <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white`}>
                  <s.icon className="h-5 w-5 opacity-80 mb-2" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs opacity-80">{s.label}</p>
                </div>
              ))}
            </div>

            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>توزيع المستخدمين حسب الدور</h3>
              {Object.entries(
                accounts.reduce((acc, a) => ({ ...acc, [a.role]: (acc[a.role] ?? 0) + 1 }), {} as Record<string, number>)
              ).map(([role, count]) => (
                <div key={role} className="flex items-center gap-3 mb-2.5 last:mb-0">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br ${ROLE_GRADIENT[role] ?? 'from-gray-400 to-gray-500'}`} />
                  <span className={`text-xs flex-1 ${colors.textPrimary}`}>{ROLE_LABELS[role] ?? role}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${ROLE_GRADIENT[role] ?? 'from-gray-400 to-gray-500'} rounded-full`}
                        style={{ width: `${(count / accounts.length) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${colors.textPrimary} w-4 text-right`}>{count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <h3 className={`font-bold text-sm ${colors.textPrimary} mb-3`}>نشاط المنشورات</h3>
              {[
                { label: 'إجمالي المنشورات', value: posts.length },
                { label: 'معتمدة', value: posts.filter(p => p.status === 'approved').length },
                { label: 'مرفوضة', value: posts.filter(p => p.status === 'rejected').length },
                { label: 'بانتظار المراجعة', value: posts.filter(p => p.status === 'pending').length },
              ].map((s, i) => (
                <div key={i} className={`flex items-center justify-between py-2 border-b ${colors.border} last:border-0`}>
                  <span className={`text-xs ${colors.textSecondary}`}>{s.label}</span>
                  <span className={`text-sm font-bold ${colors.textPrimary}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---- SETTINGS TAB ---- */}
        {activeTab === 'settings' && (
          <div className="space-y-3">
            {[
              { title: 'الموافقة التلقائية على المنشورات', desc: 'السماح بنشر المحتوى تلقائياً دون مراجعة', enabled: false },
              { title: 'إشعارات المنشورات الجديدة', desc: 'إشعار عند وصول منشور جديد للمراجعة', enabled: true },
              { title: 'قبول التسجيلات الجديدة', desc: 'السماح بإنشاء حسابات جديدة', enabled: true },
              { title: 'وضع الصيانة', desc: 'إيقاف التطبيق مؤقتاً للصيانة', enabled: false },
            ].map((s, i) => (
              <div key={i} className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border} flex items-center gap-3`}>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${colors.textPrimary}`}>{s.title}</p>
                  <p className={`text-xs ${colors.textTertiary} mt-0.5`}>{s.desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors ${s.enabled ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'} relative cursor-pointer flex-shrink-0`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${s.enabled ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- STUDENT TASKS TAB ---- */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl px-4 py-3 border border-indigo-200 dark:border-indigo-800">
              <ClipboardList className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                جميع مهام الطلاب المسجلين في المنصة مرئية هنا لفريق الدعم. يمكن التواصل مع الطالب لتقديم خدمة عبر الدردشة.
              </p>
            </div>

            {[
              { student: 'أحمد علي', dept: 'هندسة الحاسوب', title: 'Physics Lab Report', subtitle: 'Submit experiment results', type: 'تقرير', typeColor: 'bg-blue-100 text-blue-700', date: '2025/11/29' },
              { student: 'أحمد علي', dept: 'هندسة الحاسوب', title: 'Data Structures Project', subtitle: 'Implement Binary Search Tree', type: 'واجب برمجي', typeColor: 'bg-teal-100 text-teal-700', date: '2025/11/28' },
              { student: 'أحمد علي', dept: 'هندسة الحاسوب', title: 'Group Project Presentation', subtitle: 'Software Engineering - Team of 4', type: 'عرض تقديمي', typeColor: 'bg-purple-100 text-purple-700', date: '2025/12/01' },
              { student: 'أحمد علي', dept: 'هندسة الحاسوب', title: 'Research Paper Collaboration', subtitle: 'Working with 3 other students', type: 'بحث', typeColor: 'bg-amber-100 text-amber-700', date: '2025/12/05' },
              { student: 'أحمد علي', dept: 'هندسة الحاسوب', title: 'مقدمة الى برنامج Matlab', subtitle: 'تسليم HomeWork محاضرة', type: 'واجب برمجي', typeColor: 'bg-teal-100 text-teal-700', date: '2025/11/27' },
            ].map((task, i) => (
              <div key={i} className={`${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${colors.textPrimary} truncate`}>{task.title}</p>
                    <p className={`text-xs ${colors.textSecondary} mt-0.5`}>{task.subtitle}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${task.typeColor}`}>{task.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] ${colors.textTertiary}`}>👤 {task.student} • {task.dept}</p>
                    <p className={`text-[10px] ${colors.textTertiary} mt-0.5`}>📅 {task.date}</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl">
                    <Sparkles className="h-3 w-3" />
                    عرض خدمة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- SERVICE PRICES TAB ---- */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-2xl px-4 py-3 border border-amber-200 dark:border-amber-800">
              <DollarSign className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                حدد نطاق أسعار الخدمات الأكاديمية بالدينار العراقي. تُعرض هذه الأسعار للطلاب على بطاقات مهامهم في الداشبورد.
              </p>
            </div>

            {servicePrices.map((svc, i) => (
              <div key={svc.type} className={`${colors.cardBg} rounded-2xl border ${colors.border} p-4 space-y-3`}>
                <p className={`text-sm font-bold ${colors.textPrimary}`}>{svc.nameAr}</p>

                {svc.isCustom ? (
                  <p className={`text-xs ${colors.textTertiary}`}>السعر مخصص — يتفق عليه مع العميل مباشرةً</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-[11px] font-medium ${colors.textSecondary} mb-1 block`}>الحد الأدنى (د.ع)</label>
                      <input
                        type="number"
                        value={svc.min}
                        onChange={e => setServicePricesState(prev => prev.map((p, idx) =>
                          idx === i ? { ...p, min: Number(e.target.value) } : p
                        ))}
                        className={`w-full px-3 py-2.5 rounded-xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-sm ${colors.bgPrimary} ${colors.textPrimary}`}
                      />
                    </div>
                    <div>
                      <label className={`text-[11px] font-medium ${colors.textSecondary} mb-1 block`}>الحد الأعلى (د.ع)</label>
                      <input
                        type="number"
                        value={svc.max}
                        onChange={e => setServicePricesState(prev => prev.map((p, idx) =>
                          idx === i ? { ...p, max: Number(e.target.value) } : p
                        ))}
                        className={`w-full px-3 py-2.5 rounded-xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-sm ${colors.bgPrimary} ${colors.textPrimary}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleSaveServicePrices}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              حفظ الأسعار
            </button>

            <p className={`text-xs text-center ${colors.textTertiary}`}>
              تُطبَّق الأسعار فور الحفظ على جميع بطاقات مهام الطلاب
            </p>
          </div>
        )}
      </div>

      {/* Create Account Modal */}
      <AnimatePresence>
        {showCreateAccount && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => { setShowCreateAccount(false); setCreatedCode(''); }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md ${colors.cardBg} rounded-t-3xl p-5 z-50 shadow-2xl max-h-[90vh] overflow-y-auto`}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className={`text-base font-bold ${colors.textPrimary} mb-4 text-center`}>إنشاء حساب جديد</h3>

              {createdCode ? (
                /* Success screen */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <p className={`text-sm font-bold ${colors.textPrimary} mb-1`}>تم إنشاء الحساب بنجاح</p>
                  <p className={`text-xs ${colors.textSecondary} mb-5`}>أرسل الرمز المؤقت للمستخدم لإتمام التسجيل</p>

                  <div className={`${colors.bgSecondary} rounded-2xl p-4 mb-4`}>
                    <p className={`text-xs ${colors.textTertiary} mb-2`}>الرمز المؤقت</p>
                    <p className="text-3xl font-mono font-bold text-orange-500 tracking-widest mb-3">{createdCode}</p>
                    <button
                      onClick={() => copyCode(createdCode)}
                      className="w-full bg-orange-500 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
                    >
                      {copiedCode === createdCode ? <><CheckCircle className="h-4 w-4" /> تم النسخ</> : <><Copy className="h-4 w-4" /> نسخ الرمز</>}
                    </button>
                  </div>
                  <p className={`text-xs ${colors.textTertiary} leading-relaxed`}>
                    سيستخدم المستخدم هذا الرمز لإكمال تسجيل بياناته (الاسم، الصورة، المعلومات الشخصية)
                  </p>
                  <button
                    onClick={() => { setShowCreateAccount(false); setCreatedCode(''); }}
                    className="w-full mt-4 py-3 bg-orange-500 text-white font-semibold rounded-xl text-sm"
                  >
                    إغلاق
                  </button>
                </div>
              ) : (
                /* Form */
                <div className="space-y-4" dir="rtl">
                  {/* Role selector */}
                  <div>
                    <label className={`text-xs font-medium ${colors.textSecondary} mb-2 block`}>نوع الحساب</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['student', 'professor', 'asstprofessor', 'dean', 'depthead', 'secretary', 'coordinator', 'demonstrator'] as AccountRole[]).map(role => (
                        <button
                          key={role}
                          onClick={() => setNewAccount(a => ({ ...a, role }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border-2 text-right ${
                            newAccount.role === role
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                              : `border-transparent ${colors.bgSecondary} ${colors.textSecondary}`
                          }`}
                        >
                          {ROLE_LABELS[role]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`text-xs font-medium ${colors.textSecondary} mb-1.5 block`}>الاسم الكامل</label>
                    <input
                      type="text"
                      value={newAccount.name}
                      onChange={e => setNewAccount(a => ({ ...a, name: e.target.value }))}
                      placeholder="أدخل الاسم الكامل"
                      className={`w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm ${colors.bgPrimary} ${colors.textPrimary}`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-medium ${colors.textSecondary} mb-1.5 block`}>القسم / الكلية</label>
                    <input
                      type="text"
                      value={newAccount.department}
                      onChange={e => setNewAccount(a => ({ ...a, department: e.target.value }))}
                      placeholder="مثلاً: هندسة الحاسوب"
                      className={`w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm ${colors.bgPrimary} ${colors.textPrimary}`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-medium ${colors.textSecondary} mb-1.5 block`}>البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={newAccount.email}
                      onChange={e => setNewAccount(a => ({ ...a, email: e.target.value }))}
                      placeholder="example@nahrain.edu.iq"
                      className={`w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm ${colors.bgPrimary} ${colors.textPrimary}`}
                      dir="ltr"
                    />
                  </div>

                  <button
                    onClick={handleCreateAccount}
                    disabled={!newAccount.name || !newAccount.department}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Key className="h-4 w-4" />
                    إنشاء الحساب وتوليد رمز مؤقت
                  </button>
                  <button
                    onClick={() => setShowCreateAccount(false)}
                    className={`w-full py-2.5 text-sm ${colors.textSecondary}`}
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Post detail modal */}
      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedPost(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md ${colors.cardBg} rounded-t-3xl p-5 z-50 shadow-2xl`}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[selectedPost.type]}`}>
                  {TYPE_LABELS[selectedPost.type]}
                </span>
                <span className={`text-xs ${colors.textTertiary}`}>{selectedPost.time}</span>
              </div>
              <p className={`text-sm leading-relaxed ${colors.textPrimary} mb-3`}>{selectedPost.content}</p>
              <div className={`flex items-center gap-2 p-3 ${colors.bgSecondary} rounded-xl mb-4`}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {selectedPost.author[0]}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${colors.textPrimary}`}>{selectedPost.author}</p>
                  <p className={`text-[10px] ${colors.textTertiary}`}>{ROLE_LABELS[selectedPost.role]}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePostAction(selectedPost.id, 'approved')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" /> موافق — نشر
                </button>
                <button
                  onClick={() => handlePostAction(selectedPost.id, 'rejected')}
                  className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-500 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" /> رفض
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminPortal;
