import { useState, useEffect } from 'react';
import {
  ArrowLeft, FileText, Monitor, Code2, GraduationCap, Sparkles, ShieldCheck,
  Crown, CheckCircle, MessageCircle, Clock, Star, AlertTriangle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { loadServicePrices, type ServicePrice, type ServiceType } from '../data/services';

interface AcademicServicesProps {
  onNavigate?: (view: string) => void;
  initialService?: ServiceType | null;
}

const SERVICE_ICONS: Record<ServiceType, typeof FileText> = {
  report: FileText,
  presentation: Monitor,
  homework: Code2,
  research: GraduationCap,
};

const SERVICE_GRADIENTS: Record<ServiceType, string> = {
  report: 'from-blue-500 to-indigo-600',
  presentation: 'from-purple-500 to-violet-600',
  homework: 'from-teal-500 to-cyan-600',
  research: 'from-amber-500 to-orange-600',
};

const SERVICE_BG: Record<ServiceType, string> = {
  report: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  presentation: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  homework: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',
  research: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
};

const SERVICE_DESCRIPTIONS: Record<ServiceType, { short: string; bullets: string[] }> = {
  report: {
    short: 'يقوم فريقنا المتخصص بإعداد تقريرك الأكاديمي وفق المواصفات المطلوبة',
    bullets: [
      'مصادر أكاديمية موثوقة ومحدّثة',
      'مراجعة إملائية ولغوية كاملة',
      'تنسيق احترافي وفق معايير الجامعة',
      'تسليم خلال 24–48 ساعة',
    ],
  },
  presentation: {
    short: 'عروض تقديمية احترافية مصممة بصرياً ومقنعة',
    bullets: [
      'تصميم احترافي متناسق مع موضوعك',
      'محتوى مركّز وسهل التقديم',
      'رسوم بيانية وإحصاءات مدعومة',
      'ملاحظات المتحدث مشمولة',
    ],
  },
  homework: {
    short: 'حل الواجبات البرمجية ومسائل الدوائر الكهربائية بدقة عالية',
    bullets: [
      'حلول برمجية بلغات متعددة (Python، C++، Java، MATLAB)',
      'دوائر كهربائية وحلول نظرية',
      'شرح خطوة بخطوة مرفق',
      'تسليم سريع مع ضمان الجودة',
    ],
  },
  research: {
    short: 'فريق متخصص لمساعدتك في إعداد بحث التخرج بكامل مراحله',
    bullets: [
      'خطة بحث ومنهجية علمية متكاملة',
      'جمع البيانات والمصادر والمراجع',
      'تحليل النتائج والاستنتاجات',
      'سعر يُحدَّد حسب حجم البحث ومدته',
    ],
  },
};

function formatIQD(n: number) {
  return n.toLocaleString('ar-IQ') + ' د.ع';
}

function PriceTag({ svc }: { svc: ServicePrice }) {
  if (svc.isCustom) return <span className="text-amber-600 font-bold text-sm">سعر مخصص</span>;
  return (
    <span className="font-bold text-sm">
      {formatIQD(svc.min)}
      {svc.max > svc.min && <> – {formatIQD(svc.max)}</>}
    </span>
  );
}

const HOW_IT_WORKS = [
  { n: '1', title: 'اختر الخدمة وادفع', desc: 'اضغط على الخدمة المطلوبة، تحقق من السعر، ثم أتمّ الدفع مسبقاً.' },
  { n: '2', title: 'تواصل فريق الدعم معك', desc: 'يتواصل معك أحد أفراد الفريق عبر الدردشة لمعرفة تفاصيل المطلوب.' },
  { n: '3', title: 'استلم عملك', desc: 'تستلم العمل المكتمل وفق المواصفات خلال المدة المتفق عليها.' },
];

const SUBSCRIPTION_TIERS = [
  {
    id: 'team',
    nameAr: 'فريق احترافي',
    price: 30,
    gradient: 'from-indigo-600 to-violet-700',
    badge: 'الأكثر طلباً',
    perks: [
      'إعداد جميع تقاريرك طوال الشهر بلا حدود',
      'تسليم فوري بأعلى جودة أكاديمية',
      'فريق متخصص يعمل في الوقت الفعلي',
      'مراجعات لا نهائية حتى رضاك التام',
    ],
  },
  {
    id: 'bundle',
    nameAr: 'الحزمة الكاملة',
    price: 40,
    gradient: 'from-rose-600 to-pink-700',
    badge: 'الأشمل',
    perks: [
      'كل مزايا خطة فريق احترافي',
      'عروض تقديمية احترافية غير محدودة',
      'واجبات برمجية ودوائر كهربائية',
      'أولوية دعم فائقة على مدار الساعة',
    ],
  },
];

export function AcademicServices({ onNavigate, initialService }: AcademicServicesProps) {
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(initialService ?? null);
  const [expandedHow, setExpandedHow] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    setPrices(loadServicePrices());
  }, []);

  const getPrice = (type: ServiceType) => prices.find(p => p.type === type);

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-24 max-w-md mx-auto`} dir="rtl">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-5 pt-5 pb-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{ left: `${(i * 19) % 97}%`, top: `${(i * 29) % 93}%` }} />
          ))}
        </div>

        <div className="relative">
          <button onClick={() => onNavigate?.('Dashboard')}
            className="flex items-center gap-1.5 text-white/70 text-xs mb-4 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            رجوع
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">الخدمات الأكاديمية</h1>
              <p className="text-white/70 text-xs">فريق متخصص يُعِد عملك باحترافية</p>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            خدمات قابلة للشراء بشكل منفرد أو ضمن اشتراك شهري — يتولى فريق الدعم التواصل معك مباشرةً بعد الطلب.
          </p>
        </div>

        {/* Stars row */}
        <div className="flex items-center gap-1.5 mt-4">
          {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />)}
          <span className="text-white/70 text-xs mr-1">4.9 من 5 • 1,200+ طلب مكتمل</span>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl px-4 py-3 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>تنبيه مهم:</strong> يتحمل الطالب مسؤولية دراسة وفهم المحتوى قبل تقديمه. الخدمة للمساعدة الأكاديمية فقط.
          </p>
        </div>

        {/* Subscription tiers */}
        <div>
          <p className={`text-xs font-bold ${colors.textTertiary} mb-3 uppercase tracking-wider`}>اشتراكات شهرية</p>
          <div className="space-y-3">
            {SUBSCRIPTION_TIERS.map(tier => (
              <motion.div key={tier.id} whileTap={{ scale: 0.985 }}
                className={`rounded-2xl overflow-hidden bg-gradient-to-br ${tier.gradient} shadow-lg`}>
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-white" />
                      <p className="text-white font-bold text-base">{tier.nameAr}</p>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-white/25 text-white rounded-full">{tier.badge}</span>
                    </div>
                    <div className="text-end">
                      <p className="text-white font-bold text-2xl leading-none">${tier.price}</p>
                      <p className="text-white/70 text-[10px]">/شهر</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {tier.perks.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-white/80 flex-shrink-0 mt-0.5" />
                        <span className="text-white/90 text-xs">{p}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-sm rounded-xl transition-all backdrop-blur-sm">
                    اشترك الآن — ${tier.price}/شهر
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className={`flex-1 h-px ${colors.border} bg-current opacity-30`} />
          <span className={`text-xs ${colors.textTertiary} font-medium`}>أو اشترِ خدمة منفردة</span>
          <div className={`flex-1 h-px ${colors.border} bg-current opacity-30`} />
        </div>

        {/* À la carte service cards */}
        <div className="space-y-3">
          {prices.map(svc => {
            const Icon = SERVICE_ICONS[svc.type];
            const desc = SERVICE_DESCRIPTIONS[svc.type];
            const isOpen = selectedService === svc.type;

            return (
              <motion.div
                key={svc.type}
                layout
                className={`rounded-2xl border overflow-hidden transition-all ${isOpen ? SERVICE_BG[svc.type] : `${colors.cardBg} ${colors.border}`}`}
              >
                <button
                  className="w-full px-4 py-4 flex items-center gap-3 text-start"
                  onClick={() => setSelectedService(isOpen ? null : svc.type)}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${SERVICE_GRADIENTS[svc.type]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${colors.textPrimary}`}>{svc.nameAr}</p>
                    <p className={`text-xs ${colors.textSecondary} mt-0.5`}>{desc.short}</p>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <PriceTag svc={svc} />
                    {isOpen
                      ? <ChevronUp className={`h-4 w-4 ${colors.textTertiary} mr-auto mt-1`} />
                      : <ChevronDown className={`h-4 w-4 ${colors.textTertiary} mr-auto mt-1`} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <div className="space-y-1.5">
                          {desc.bullets.map((b, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${
                                svc.type === 'report' ? 'text-blue-500' :
                                svc.type === 'presentation' ? 'text-purple-500' :
                                svc.type === 'homework' ? 'text-teal-500' : 'text-amber-500'
                              }`} />
                              <span className={`text-xs ${colors.textSecondary}`}>{b}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className={`h-3.5 w-3.5 ${colors.textTertiary}`} />
                          <span className={`text-xs ${colors.textTertiary}`}>
                            {svc.type === 'research' ? 'يُحدَّد بحسب حجم البحث' : 'تسليم خلال 24–48 ساعة'}
                          </span>
                        </div>

                        <button className={`w-full py-3 bg-gradient-to-r ${SERVICE_GRADIENTS[svc.type]} text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2`}>
                          <MessageCircle className="h-4 w-4" />
                          {svc.isCustom ? 'تواصل للحصول على سعر' : `اطلب الآن — ${formatIQD(svc.min)}`}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* How it works */}
        <div className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden`}>
          <button
            className="w-full px-4 py-3.5 flex items-center justify-between"
            onClick={() => setExpandedHow(v => !v)}
          >
            <p className={`text-sm font-bold ${colors.textPrimary}`}>كيف تعمل الخدمة؟</p>
            {expandedHow
              ? <ChevronUp className={`h-4 w-4 ${colors.textTertiary}`} />
              : <ChevronDown className={`h-4 w-4 ${colors.textTertiary}`} />}
          </button>
          <AnimatePresence>
            {expandedHow && (
              <motion.div
                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3 border-t border-current border-opacity-10">
                  {HOW_IT_WORKS.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 pt-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-bold text-xs">{step.n}</span>
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${colors.textPrimary}`}>{step.title}</p>
                        <p className={`text-xs ${colors.textTertiary} mt-0.5 leading-relaxed`}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust signals */}
        <div className={`flex items-start gap-3 ${colors.cardBg} rounded-2xl px-4 py-3 border ${colors.border}`}>
          <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className={`text-xs ${colors.textTertiary} leading-relaxed`}>
            جميع الخدمات تُقدَّم بواسطة فريق دعم داخلي موثوق يتواصل معك عبر الدردشة المباشرة بعد إتمام الدفع.
          </p>
        </div>

      </div>
    </div>
  );
}

export default AcademicServices;
