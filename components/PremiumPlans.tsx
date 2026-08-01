import { useState } from 'react';
import {
  Crown, Zap, BookOpen, Brain, Check, X, Star,
  Shield, Download, Trophy, Palette, Headphones,
  Lock, Unlock, Gift, BookMarked, ArrowLeft, Users, Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

interface PremiumPlansProps {
  onNavigate?: (view: string) => void;
}

type PlanId = 'free' | 'plus' | 'pro' | 'team' | 'bundle';
type Billing = 'monthly' | 'yearly';

const PLANS = [
  {
    id: 'free' as PlanId,
    nameAr: 'مجاني',
    nameEn: 'Free',
    price: { monthly: 0, yearly: 0 },
    gradient: 'from-slate-400 to-slate-500',
    icon: Star,
    badge: null as string | null,
    features: [
      { text: '3 منشورات يومياً', ok: true, hi: false },
      { text: 'قصة واحدة يومياً', ok: true, hi: false },
      { text: 'مساعد ذكاء اصطناعي (5 أسئلة/يوم)', ok: true, hi: false },
      { text: 'الكتب المجانية فقط', ok: true, hi: false },
      { text: 'المشاركة في تحديات الإدارة', ok: true, hi: false },
      { text: 'الدردشة مع الزملاء', ok: true, hi: false },
      { text: 'تحميل أوفلاين', ok: false, hi: false },
      { text: 'فتح الكتب المقفولة', ok: false, hi: false },
      { text: 'ذكاء اصطناعي متقدم', ok: false, hi: false },
      { text: 'شارة مميزة على الملف', ok: false, hi: false },
      { text: 'إزالة الإعلانات', ok: false, hi: false },
    ],
  },
  {
    id: 'plus' as PlanId,
    nameAr: 'طالب بلس',
    nameEn: 'Student Plus',
    price: { monthly: 5, yearly: 45 },
    gradient: 'from-blue-500 to-indigo-600',
    icon: Zap,
    badge: 'شائع',
    features: [
      { text: '15 منشوراً يومياً', ok: true, hi: true },
      { text: '5 قصص يومياً', ok: true, hi: true },
      { text: 'مساعد ذكاء اصطناعي (50 سؤال/يوم)', ok: true, hi: true },
      { text: 'الكتب المجانية', ok: true, hi: false },
      { text: 'المشاركة في تحديات الإدارة', ok: true, hi: false },
      { text: 'الدردشة مع الزملاء', ok: true, hi: false },
      { text: 'تحميل 10 ملفات/شهر أوفلاين', ok: true, hi: true },
      { text: 'فتح 5 كتب مقفولة/شهر', ok: true, hi: true },
      { text: 'ذكاء اصطناعي متقدم', ok: false, hi: false },
      { text: 'شارة بلس على الملف', ok: true, hi: true },
      { text: 'تقليل الإعلانات 50%', ok: true, hi: false },
    ],
  },
  {
    id: 'pro' as PlanId,
    nameAr: 'كامبس برو',
    nameEn: 'Campus Pro',
    price: { monthly: 10, yearly: 90 },
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    icon: Crown,
    badge: 'الأفضل',
    features: [
      { text: 'منشورات وقصص غير محدودة', ok: true, hi: true },
      { text: 'ذكاء اصطناعي غير محدود + متقدم', ok: true, hi: true },
      { text: 'جميع الكتب مفتوحة دون استثناء', ok: true, hi: true },
      { text: 'الكتب المجانية', ok: true, hi: false },
      { text: 'أولوية وجوائز إضافية في التحديات', ok: true, hi: true },
      { text: 'الدردشة مع الزملاء', ok: true, hi: false },
      { text: 'تحميل غير محدود أوفلاين', ok: true, hi: true },
      { text: 'جميع الكتب المقفولة', ok: true, hi: true },
      { text: 'ذكاء اصطناعي متقدم (GPT-4 class)', ok: true, hi: true },
      { text: 'شارة ذهبية + تخصيص الملف كاملاً', ok: true, hi: true },
      { text: 'بدون إعلانات تماماً', ok: true, hi: true },
    ],
  },
  {
    id: 'team' as PlanId,
    nameAr: 'فريق احترافي',
    nameEn: 'Pro Team',
    price: { monthly: 30, yearly: 270 },
    gradient: 'from-indigo-600 to-violet-700',
    icon: Users,
    badge: 'الأكثر طلباً',
    features: [
      { text: 'كل مزايا Campus Pro', ok: true, hi: false },
      { text: 'إعداد جميع تقاريرك طوال الشهر', ok: true, hi: true },
      { text: 'فريق متخصص يعمل في الوقت الفعلي', ok: true, hi: true },
      { text: 'تسليم فوري بأعلى جودة أكاديمية', ok: true, hi: true },
      { text: 'مراجعات لا نهائية حتى رضاك التام', ok: true, hi: true },
      { text: 'تواصل مباشر مع فريق الدعم', ok: true, hi: true },
      { text: 'خدمات العروض التقديمية', ok: false, hi: false },
      { text: 'حل الواجبات البرمجية والدوائر', ok: false, hi: false },
    ],
  },
  {
    id: 'bundle' as PlanId,
    nameAr: 'الحزمة الكاملة',
    nameEn: 'Full Bundle',
    price: { monthly: 40, yearly: 360 },
    gradient: 'from-rose-600 to-pink-700',
    icon: Briefcase,
    badge: 'الأشمل',
    features: [
      { text: 'كل مزايا خطة فريق احترافي', ok: true, hi: false },
      { text: 'عروض تقديمية احترافية غير محدودة', ok: true, hi: true },
      { text: 'واجبات برمجية بجميع اللغات', ok: true, hi: true },
      { text: 'دوائر كهربائية ومسائل هندسية', ok: true, hi: true },
      { text: 'أولوية دعم فائقة 24/7', ok: true, hi: true },
      { text: 'كتابة بحوث التخرج (بسعر مخصص)', ok: true, hi: true },
      { text: 'مراجعات لا نهائية حتى رضاك التام', ok: true, hi: true },
      { text: 'تسليم خلال 12 ساعة للطلبات العاجلة', ok: true, hi: true },
    ],
  },
];

const BOOK_PACKS = [
  { id: 'single', nameAr: 'كتاب واحد', price: 2, gradient: 'from-teal-500 to-cyan-600', icon: BookOpen, desc: 'افتح كتاباً بعينه بشكل دائم', badge: null as string | null },
  { id: 'pack5', nameAr: 'حزمة 5 كتب', price: 8, gradient: 'from-purple-500 to-violet-600', icon: BookMarked, desc: 'وفّر 20% — مثالي لمادة دراسية كاملة', badge: 'وفر 20%' },
  { id: 'all', nameAr: 'كل الكتب / شهر', price: 10, gradient: 'from-amber-500 to-orange-600', icon: Unlock, desc: 'اشتراك شهري يفتح مكتبة الجامعة كاملاً', badge: 'الأشمل' },
];

const PRO_HIGHLIGHTS = [
  { icon: Brain, title: 'ذكاء اصطناعي متقدم', desc: 'مساعد دراسي يفهم مناهجك ويشرح المفاهيم', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { icon: BookOpen, title: 'مكتبة مفتوحة', desc: 'جميع الكتب والمراجع الأكاديمية بلا قيود', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { icon: Download, title: 'أوفلاين غير محدود', desc: 'احفظ المحاضرات والكتب للقراءة بدون إنترنت', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { icon: Trophy, title: 'أولوية التحديات', desc: 'مكافآت إضافية عند الفوز بتحديات الإدارة', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { icon: Palette, title: 'ملف شخصي مميز', desc: 'إطار ذهبي، شارة برو، وألوان حصرية', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  { icon: Headphones, title: 'دعم أولوي 24/7', desc: 'تواصل مباشر مع فريق الدعم في أي وقت', color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
];

const SAMPLE_LOCKED_BOOKS = [
  { title: 'هياكل البيانات المتقدمة', author: 'د. أحمد العلي', field: 'علوم الحاسوب', g: 'from-blue-500 to-indigo-600' },
  { title: 'تحليل الدوائر الكهربائية', author: 'د. سارة محمود', field: 'هندسة كهربائية', g: 'from-purple-500 to-violet-600' },
  { title: 'قواعد البيانات التطبيقية', author: 'م.م. كريم ناصر', field: 'هندسة البرمجيات', g: 'from-teal-500 to-cyan-600' },
  { title: 'الرياضيات الهندسية', author: 'أ.م.د. ليلى حسن', field: 'الرياضيات', g: 'from-rose-500 to-pink-600' },
  { title: 'فيزياء الجسم الصلب', author: 'أ.د. عمر خالد', field: 'فيزياء', g: 'from-amber-500 to-orange-600' },
  { title: 'مبادئ التسويق الرقمي', author: 'م. زينب علي', field: 'إدارة الأعمال', g: 'from-green-500 to-emerald-600' },
];

export function PremiumPlans({ onNavigate }: PremiumPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [billing, setBilling] = useState<Billing>('monthly');
  const [tab, setTab] = useState<'plans' | 'books'>('plans');
  const { colors } = useTheme();

  const yearSavePct = (p: typeof PLANS[0]) =>
    p.price.monthly > 0
      ? Math.round((1 - p.price.yearly / (p.price.monthly * 12)) * 100)
      : 0;

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-24 max-w-md mx-auto`} dir="rtl">

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 px-5 pt-5 pb-10">
        {/* decorative dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{ left: `${(i * 17) % 97}%`, top: `${(i * 23) % 90}%` }} />
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => onNavigate?.('Home')}
            className="flex items-center gap-1.5 text-white/70 text-xs mb-4 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            رجوع
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Campus Premium</h1>
              <p className="text-white/70 text-xs">ارتقِ بتجربتك الجامعية</p>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            ميزات حصرية تساعدك على التفوق الدراسي، التواصل الأفضل، والوصول لكل المحتوى — دون قفل أي ميزة تعليمية أساسية.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="relative mt-5 bg-white/15 rounded-2xl p-1 flex gap-1">
          {(['plans', 'books'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === t ? 'bg-white text-orange-600 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              {t === 'plans' ? '🌟 خطط الاشتراك' : '📚 الكتب المكتبة'}
            </button>
          ))}
        </div>

        {/* Quick link to services */}
        <button
          onClick={() => onNavigate?.('services')}
          className="mt-3 w-full py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 rounded-2xl text-white/90 text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          <span>✨</span>
          الخدمات الأكاديمية — تقارير، عروض، واجبات
          <span className="text-white/60">←</span>
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════ PLANS TAB ══════════ */}
        {tab === 'plans' && (
          <motion.div key="plans" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 py-5 space-y-4">

            {/* Billing toggle */}
            <div className={`flex items-center gap-3 ${colors.cardBg} rounded-2xl p-3 border ${colors.border}`}>
              <div className="flex-1 flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
                {(['monthly', 'yearly'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setBilling(c)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      billing === c
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    {c === 'monthly' ? 'شهري' : 'سنوي'}
                  </button>
                ))}
              </div>
              {billing === 'yearly' && (
                <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full whitespace-nowrap">
                  وفر حتى 25%
                </span>
              )}
            </div>

            {/* Plan cards */}
            {PLANS.map(plan => {
              const Icon = plan.icon;
              const price = billing === 'monthly' ? plan.price.monthly : plan.price.yearly;
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`rounded-2xl border-2 cursor-pointer overflow-hidden transition-all ${
                    isSelected
                      ? 'border-orange-500 shadow-lg shadow-orange-100 dark:shadow-orange-900/20'
                      : `${colors.border} ${colors.cardBg}`
                  }`}
                >
                  {/* card header */}
                  <div className={`bg-gradient-to-r ${plan.gradient} px-4 py-3 flex items-center gap-3`}>
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold text-sm">{plan.nameAr}</p>
                        {plan.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/25 text-white rounded-full">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 text-[10px]">{plan.nameEn}</p>
                    </div>
                    <div className="text-start">
                      {price === 0 ? (
                        <p className="text-white font-bold text-lg">مجاني</p>
                      ) : (
                        <>
                          <p className="text-white font-bold text-xl leading-none">${price}</p>
                          <p className="text-white/70 text-[10px]">/{billing === 'monthly' ? 'شهر' : 'سنة'}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* feature list */}
                  <div className={`px-4 py-3 ${isSelected ? 'bg-orange-50 dark:bg-orange-900/10' : colors.bgPrimary}`}>
                    <div className="space-y-1.5">
                      {plan.features.slice(0, isSelected ? plan.features.length : 4).map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {f.ok ? (
                            <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                              f.hi ? `bg-gradient-to-br ${plan.gradient}` : 'bg-green-100 dark:bg-green-900/30'
                            }`}>
                              <Check className={`h-2.5 w-2.5 ${f.hi ? 'text-white' : 'text-green-600'}`} />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center">
                              <X className="h-2.5 w-2.5 text-gray-400" />
                            </div>
                          )}
                          <span className={`text-xs ${
                            f.hi && f.ok
                              ? `font-semibold ${colors.textPrimary}`
                              : f.ok
                                ? colors.textSecondary
                                : 'text-gray-400 line-through'
                          }`}>
                            {f.text}
                          </span>
                        </div>
                      ))}
                      {!isSelected && (
                        <p className={`text-[10px] ${colors.textTertiary} pt-0.5`}>+ {plan.features.length - 4} ميزة أخرى…</p>
                      )}
                    </div>

                    {/* CTA */}
                    {isSelected && plan.id !== 'free' && (
                      <motion.button
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 w-full py-3 bg-gradient-to-r ${plan.gradient} text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2`}
                      >
                        <Crown className="h-4 w-4" />
                        اشترك بـ {plan.nameAr}
                        {billing === 'yearly' && yearSavePct(plan) > 0 && (
                          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                            وفر {yearSavePct(plan)}%
                          </span>
                        )}
                      </motion.button>
                    )}
                    {isSelected && plan.id === 'free' && (
                      <p className={`mt-3 text-center text-xs ${colors.textTertiary}`}>أنت على الخطة المجانية حالياً</p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Pro spotlight grid */}
            <div className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden`}>
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3">
                <p className="text-white font-bold text-sm">✨ ما يميز Campus Pro</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {PRO_HIGHLIGHTS.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${h.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className={`text-xs font-bold ${colors.textPrimary}`}>{h.title}</p>
                      <p className={`text-[10px] ${colors.textTertiary} leading-relaxed`}>{h.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-day trial */}
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl px-4 py-3 border border-blue-200 dark:border-blue-800">
              <Gift className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">3 أيام مجانية مع Campus Pro</p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-0.5">
                  جرّبها بدون بطاقة بنكية. إذا لم تعجبك، ألغِ في أي وقت.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className={`${colors.cardBg} rounded-2xl border ${colors.border} p-4 space-y-3`}>
              <h3 className={`text-sm font-bold ${colors.textPrimary}`}>أسئلة شائعة</h3>
              {[
                { q: 'هل يمكنني الإلغاء في أي وقت؟', a: 'نعم، بضغطة واحدة. تستمر في الوصول حتى نهاية الفترة المدفوعة.' },
                { q: 'هل الميزات التعليمية الأساسية مجانية دائماً؟', a: 'نعم بالتأكيد. الاشتراك يُضيف مزايا إضافية فقط ولا يقفل أي شيء أساسي.' },
                { q: 'كيف أوفّر بالاشتراك السنوي؟', a: 'تدفع مبلغاً واحداً سنوياً بتوفير يصل إلى 25% مقارنةً بالشهري.' },
              ].map((item, i) => (
                <div key={i} className={`${i > 0 ? `border-t ${colors.border} pt-3` : ''}`}>
                  <p className={`text-xs font-semibold ${colors.textPrimary} mb-1`}>{item.q}</p>
                  <p className={`text-xs ${colors.textTertiary} leading-relaxed`}>{item.a}</p>
                </div>
              ))}
            </div>

          </motion.div>
        )}

        {/* ══════════ BOOKS TAB ══════════ */}
        {tab === 'books' && (
          <motion.div key="books" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 py-5 space-y-4">

            {/* Explainer */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-sm font-bold ${colors.textPrimary}`}>كيف تعمل الكتب المقفولة؟</p>
                  <p className={`text-xs ${colors.textTertiary} mt-1 leading-relaxed`}>
                    تتحكم إدارة الجامعة بالكتب المجانية والمدفوعة. الكتب الأساسية لكل مادة مجانية دائماً. يمكنك فتح كتاب بـ$2، أو اختيار حزمة، أو الاشتراك الشهري لفتح الكل.
                  </p>
                </div>
              </div>
            </div>

            {/* Book packs */}
            <h3 className={`text-sm font-bold ${colors.textPrimary}`}>حزم الكتب</h3>
            {BOOK_PACKS.map(pack => {
              const Icon = pack.icon;
              return (
                <motion.div key={pack.id} whileTap={{ scale: 0.98 }} className={`rounded-2xl overflow-hidden border ${colors.border} ${colors.cardBg}`}>
                  <div className={`bg-gradient-to-r ${pack.gradient} px-4 py-3 flex items-center gap-3`}>
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-sm">{pack.nameAr}</p>
                        {pack.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/25 text-white rounded-full">{pack.badge}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-white font-bold text-xl">${pack.price}</p>
                  </div>
                  <div className="px-4 py-3 flex items-center gap-3">
                    <p className={`text-xs ${colors.textSecondary} flex-1`}>{pack.desc}</p>
                    <button className={`px-4 py-2 bg-gradient-to-r ${pack.gradient} text-white text-xs font-bold rounded-xl flex-shrink-0 shadow-sm`}>
                      شراء
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Sample locked books grid */}
            <h3 className={`text-sm font-bold ${colors.textPrimary} pt-1`}>نماذج كتب مقفولة</h3>
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_LOCKED_BOOKS.map((book, i) => (
                <div key={i} className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden`}>
                  <div className={`bg-gradient-to-br ${book.g} h-[72px] flex items-center justify-center relative`}>
                    <BookOpen className="h-7 w-7 text-white/40" />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                        <Lock className="h-3 w-3 text-white" />
                        <span className="text-white text-[9px] font-bold">$2</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className={`text-[10px] font-bold ${colors.textPrimary} leading-snug mb-0.5`}>{book.title}</p>
                    <p className={`text-[9px] ${colors.textTertiary}`}>{book.author}</p>
                    <span className="text-[8px] mt-1 inline-block px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {book.field}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-center">
              <Crown className="h-8 w-8 text-white mx-auto mb-2" />
              <p className="text-white font-bold text-base mb-1">افتح جميع الكتب</p>
              <p className="text-white/80 text-xs mb-4">
                اشترك بـ Campus Pro بـ $10/شهر وستجد أمامك كل مكتبة الجامعة
              </p>
              <button className="bg-white text-orange-600 font-bold text-sm px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                اشترك الآن — $10/شهر
              </button>
            </div>

            {/* Admin control note */}
            <div className={`flex items-start gap-3 ${colors.cardBg} rounded-2xl p-4 border ${colors.border}`}>
              <Shield className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className={`text-xs ${colors.textTertiary} leading-relaxed`}>
                تتحكم إدارة الجامعة بتحديد الكتب المجانية والمقيّدة من لوحة تحكم المدير. الكتب الأساسية لكل مادة ستبقى مجانية دائماً.
              </p>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
