import { useState } from 'react';
import { Eye, EyeOff, GraduationCap, Shield, AlertCircle, Loader2, ChevronDown, ChevronLeft, Mail, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { University } from '../data/universities';

interface LoginProps {
  onLogin: (user: { name: string; role: string; email: string; department: string; univId?: string }) => void;
  universities: University[];
}

export const DEMO_ACCOUNTS = [
  { identifier: 'ali.student@student.nahrainuniv.edu.iq', password: '123456', name: 'علي محمد', role: 'student', department: 'هندسة الحاسوب', univId: 'nahrain' },
  { identifier: 'prof.ahmed@nahrain.edu.iq', password: '123456', name: 'أ.د. أحمد حسين', role: 'professor', department: 'هندسة الحاسوب', univId: 'nahrain' },
  { identifier: 'asstprof.sara@nahrain.edu.iq', password: '123456', name: 'أ.م. سارة علي', role: 'asstprofessor', department: 'العلوم', univId: 'nahrain' },
  { identifier: 'dean.omar@nahrain.edu.iq', password: '123456', name: 'عميد د. عمر خالد', role: 'dean', department: 'كلية الهندسة', univId: 'nahrain' },
  { identifier: 'head.layla@nahrain.edu.iq', password: '123456', name: 'رئيس القسم د. ليلى', role: 'depthead', department: 'قسم الحاسوب', univId: 'nahrain' },
  { identifier: 'council.hassan@nahrain.edu.iq', password: '123456', name: 'عضو مجلس د. حسن', role: 'council', department: 'رئاسة الجامعة', univId: 'nahrain' },
  { identifier: 'secretary.hana@nahrain.edu.iq', password: '123456', name: 'هناء كاظم', role: 'secretary', department: 'قسم الحاسوب', univId: 'nahrain' },
  { identifier: 'coord.kareem@nahrain.edu.iq', password: '123456', name: 'م. كريم ناصر', role: 'coordinator', department: 'هندسة الحاسوب', univId: 'nahrain' },
  { identifier: 'demo.zaid@nahrain.edu.iq', password: '123456', name: 'م.م. زيد علي', role: 'demonstrator', department: 'هندسة الحاسوب', univId: 'nahrain' },
  { identifier: '07740080310', password: 'sofydono3?', name: 'مدير النظام', role: 'admin', department: 'الإدارة', univId: 'nahrain' },
];

export const ROLE_LABELS: Record<string, string> = {
  student: 'طالب',
  professor: 'أستاذ دكتور',
  asstprofessor: 'أستاذ مساعد',
  dean: 'عميد',
  depthead: 'رئيس قسم',
  council: 'عضو مجلس',
  secretary: 'سكرتارية',
  coordinator: 'مقرر قسم',
  demonstrator: 'معيد',
  admin: 'مدير النظام',
};

const ROLE_DOT: Record<string, string> = {
  student: 'bg-orange-400',
  professor: 'bg-purple-500',
  asstprofessor: 'bg-blue-500',
  dean: 'bg-red-500',
  depthead: 'bg-green-500',
  council: 'bg-slate-600',
  secretary: 'bg-pink-500',
  coordinator: 'bg-indigo-500',
  demonstrator: 'bg-cyan-500',
  admin: 'bg-yellow-500',
};

const isPhone = (v: string) => /^07\d{9}$/.test(v.replace(/\s/g, ''));

/** Renders university logo: image if available, otherwise gradient + initials */
function UnivLogo({ univ, size = 'md' }: { univ: University; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'w-16 h-16 text-2xl' : size === 'md' ? 'w-11 h-11 text-base' : 'w-8 h-8 text-xs';
  const initials = univ.nameAr.split('').filter(c => /[؀-ۿ]/.test(c)).slice(0, 2).join('');

  if (univ.logoUrl) {
    return (
      <div className={`${dims} rounded-xl overflow-hidden flex-shrink-0 bg-white`}>
        <img src={univ.logoUrl} alt={univ.nameAr} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className={`${dims} bg-gradient-to-br ${univ.color} rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white`}>
      {initials}
    </div>
  );
}

export function Login({ onLogin, universities }: LoginProps) {
  const [step, setStep] = useState<'university' | 'credentials' | 'admin'>('university');
  const [selectedUniv, setSelectedUniv] = useState<University | null>(null);
  const [searchUniv, setSearchUniv] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { colors } = useTheme();
  const { t } = useLanguage();

  const filteredUnivs = universities.filter(u =>
    u.nameAr.includes(searchUniv) ||
    u.nameEn.toLowerCase().includes(searchUniv.toLowerCase()) ||
    u.city.includes(searchUniv)
  );

  const handleSelectUniv = (univ: University) => {
    setSelectedUniv(univ);
    setStep('credentials');
    setError('');
    setIdentifier('');
    setPassword('');
    setShowDemo(false);
  };

  const isValidEmail = (v: string) =>
    selectedUniv ? selectedUniv.domains.some(d => v.toLowerCase().endsWith(d)) : false;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const id = identifier.trim();

    if (!isPhone(id) && !isValidEmail(id)) {
      setError(`${t('email_address')}: ${selectedUniv?.nameAr}`);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    const user = DEMO_ACCOUNTS.find(
      a => a.identifier.toLowerCase() === id.toLowerCase() && a.password === password
    );

    if (user) {
      onLogin({ name: user.name, role: user.role, email: user.identifier, department: user.department, univId: user.univId });
    } else {
      setError(t('invalid_credentials'));
    }
    setLoading(false);
  };

  const handleDemoLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setIdentifier(acc.identifier);
    setPassword(acc.password);
    setShowDemo(false);
  };

  const univDemos = selectedUniv
    ? DEMO_ACCOUNTS.filter(a => a.univId === selectedUniv.id && a.role !== 'admin')
    : [];

  return (
    <div className={`min-h-screen ${colors.bgSecondary} flex flex-col items-center justify-center p-5`}>
      <AnimatePresence mode="wait">
        {step === 'university' ? (
          <motion.div
            key="university"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className={`text-2xl font-bold ${colors.textPrimary} mb-1`}>{t('select_university')}</h1>
              <p className={`text-sm ${colors.textSecondary}`}>{t('select_university_sub')}</p>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchUniv}
                onChange={e => setSearchUniv(e.target.value)}
                placeholder={t('search_universities')}
                className={`w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm transition-colors ${colors.bgPrimary} ${colors.textPrimary} placeholder-gray-400`}
                dir="rtl"
              />
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-0.5">
              {filteredUnivs.map(univ => (
                <motion.button
                  key={univ.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectUniv(univ)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 ${colors.border} ${colors.cardBg} hover:border-blue-400 transition-all text-right`}
                >
                  <UnivLogo univ={univ} size="md" />
                  <div className="flex-1 min-w-0 text-right">
                    <p className={`text-sm font-bold ${colors.textPrimary} truncate`}>{univ.nameAr}</p>
                    <p className={`text-xs ${colors.textTertiary}`}>{univ.nameEn} • {univ.city}</p>
                  </div>
                  <ChevronLeft className={`h-4 w-4 ${colors.textTertiary} flex-shrink-0`} />
                </motion.button>
              ))}

              {filteredUnivs.length === 0 && (
                <p className={`text-center text-sm py-6 ${colors.textTertiary}`}>{t('no_data')}</p>
              )}
            </div>

            {/* Admin login link */}
            <div className="mt-5 text-center">
              <button
                onClick={() => { setStep('admin'); setIdentifier(''); setPassword(''); setError(''); }}
                className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors"
              >
                <Shield className="w-3 h-3" />
                دخول كمدير النظام
              </button>
            </div>
            <p className={`text-center ${colors.textTertiary} text-xs mt-3`}>© 2025 منصة الجامعات العراقية</p>
          </motion.div>

        ) : step === 'admin' ? (
          /* ── Admin login step ── */
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm"
          >
            <button
              onClick={() => { setStep('university'); setError(''); }}
              className={`flex items-center gap-1.5 text-xs ${colors.textSecondary} mb-5`}
            >
              <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
              {t('back_to_universities')}
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-3 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className={`text-xl font-bold ${colors.textPrimary}`}>لوحة الإدارة</h2>
              <p className={`text-xs ${colors.textSecondary} mt-1`}>مخصص لمديري النظام فقط</p>
            </div>

            <div className={`${colors.cardBg} rounded-2xl p-5 border ${colors.border} shadow-sm`}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError('');
                  setLoading(true);
                  await new Promise(r => setTimeout(r, 700));
                  const adminAcc = DEMO_ACCOUNTS.find(
                    a => a.role === 'admin' && a.identifier === identifier.trim() && a.password === password
                  );
                  if (adminAcc) {
                    onLogin({ name: adminAcc.name, role: adminAcc.role, email: adminAcc.identifier, department: adminAcc.department, univId: adminAcc.univId });
                  } else {
                    setError(t('invalid_credentials'));
                  }
                  setLoading(false);
                }}
                className="space-y-4"
                dir="rtl"
              >
                <div>
                  <label className={`text-xs font-medium ${colors.textSecondary} mb-1.5 block`}>رقم الهاتف</label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => { setIdentifier(e.target.value); setError(''); }}
                    placeholder="07xxxxxxxxx"
                    dir="ltr"
                    className={`w-full px-4 py-3 rounded-xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-sm transition-colors ${colors.bgPrimary} ${colors.textPrimary} placeholder-gray-400`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium ${colors.textSecondary} mb-1.5 block`}>{t('password')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 rounded-xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-sm transition-colors ${colors.bgPrimary} ${colors.textPrimary} pr-11`}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className={`absolute left-3 top-1/2 -translate-y-1/2 ${colors.textTertiary}`}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl px-3 py-2.5">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  type="submit"
                  disabled={loading || !identifier || !password}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('logging_in')}</span></>
                    : <><Shield className="w-4 h-4" /><span>دخول الإدارة</span></>
                  }
                </button>
              </form>
            </div>
          </motion.div>

        ) : (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm"
          >
            {selectedUniv && (
              <>
                <button
                  onClick={() => { setStep('university'); setError(''); setSearchUniv(''); }}
                  className={`flex items-center gap-1.5 text-xs ${colors.textSecondary} mb-4`}
                >
                  <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                  {t('back_to_universities')}
                </button>

                {/* University banner */}
                <div className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${selectedUniv.color} text-white mb-6`}>
                  <UnivLogo univ={selectedUniv} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-tight">{selectedUniv.nameAr}</p>
                    <p className="text-white/70 text-xs mt-0.5">{selectedUniv.nameEn}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-white/80 flex-shrink-0" />
                </div>

                {/* Login card */}
                <div className={`${colors.cardBg} rounded-2xl p-6 border ${colors.border} shadow-sm`}>
                  <h2 className={`text-base font-semibold ${colors.textPrimary} mb-5 text-center`}>{t('sign_in')}</h2>

                  <form onSubmit={handleLogin} className="space-y-4" dir="rtl">
                    <div>
                      <label className={`text-xs font-medium ${colors.textSecondary} mb-1.5 block`}>
                        {t('email_address')}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={identifier}
                          onChange={e => { setIdentifier(e.target.value); setError(''); }}
                          placeholder={`example${selectedUniv.domains[0]}`}
                          className={`w-full px-4 py-3 pl-10 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm transition-colors ${colors.bgPrimary} ${colors.textPrimary} placeholder-gray-400`}
                          dir="ltr"
                          autoComplete="username"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className={`text-xs font-medium ${colors.textSecondary} mb-1.5 block`}>{t('password')}</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setError(''); }}
                          placeholder="••••••••"
                          className={`w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-sm transition-colors ${colors.bgPrimary} ${colors.textPrimary} placeholder-gray-400 pr-11`}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className={`absolute left-3 top-1/2 -translate-y-1/2 ${colors.textTertiary} transition-colors`}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-start gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5"
                        >
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={loading || !identifier || !password}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm active:scale-[0.98]"
                    >
                      {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('logging_in')}</span></>
                        : <span>{t('login_button')}</span>
                      }
                    </button>
                  </form>

                  <div className={`mt-4 flex items-center gap-2 ${colors.bgSecondary} rounded-xl px-3 py-2.5`}>
                    <Shield className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <p className={`text-xs ${colors.textTertiary}`} dir="rtl">
                      مخصص لمنتسبي {selectedUniv.nameAr} فقط
                    </p>
                  </div>
                </div>

                {univDemos.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowDemo(v => !v)}
                      className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs ${colors.textSecondary}`}
                    >
                      <span>{t('demo_accounts')}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemo ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showDemo && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`overflow-hidden ${colors.cardBg} rounded-2xl border ${colors.border} shadow-sm`}
                        >
                          <div className="p-3 space-y-0.5">
                            {univDemos.map(acc => (
                              <button
                                key={acc.identifier}
                                onClick={() => handleDemoLogin(acc)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:${colors.bgSecondary} transition-colors text-right`}
                              >
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ROLE_DOT[acc.role] ?? 'bg-gray-400'}`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-medium ${colors.textPrimary} truncate`}>{acc.name}</p>
                                  <p className={`text-[10px] ${colors.textTertiary}`}>{ROLE_LABELS[acc.role]} • {acc.department}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <p className={`text-center ${colors.textTertiary} text-xs mt-6`}>© 2025 {selectedUniv.nameAr}</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
