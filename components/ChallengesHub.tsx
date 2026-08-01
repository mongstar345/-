import { useState, useRef } from 'react';
import { Trophy, Lightbulb, ThumbsUp, MessageSquare, Send, Paperclip, Mic, Video, FileText, Image, X, ChevronRight, ChevronLeft, Clock, Star, Gift, Zap, CheckCircle, AlertCircle, Play, Volume2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

type AttachType = 'file' | 'image' | 'video' | 'voice';

interface Attachment {
  id: string;
  type: AttachType;
  name: string;
  size?: string;
  duration?: string;
}

interface Comment {
  id: number;
  author: string;
  role: string;
  avatar?: string;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
}

interface Solution {
  id: number;
  author: string;
  role: string;
  avatar?: string;
  text: string;
  time: string;
  votes: number;
  voted: boolean;
  attachments: Attachment[];
  comments: Comment[];
  isWinner?: boolean;
  premiumCredits?: number;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  prize: number;
  currency: string;
  participantCredits: number;
  deadline: string;
  status: 'open' | 'closed' | 'judging';
  category: string;
  postedBy: string;
  solutions: Solution[];
  views: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'تحسين نظام التسجيل الإلكتروني للمواد الدراسية',
    description: 'يعاني النظام الحالي لتسجيل المواد من بطء شديد عند اندفاع الطلاب في بداية كل فصل، مما يسبب فوضى وضياع فرص التسجيل. نبحث عن حل تقني أو إجرائي فعلي يضمن عدالة التوزيع وسرعة الاستجابة. يمكن تقديم خوارزميات، آليات طابور ذكي، أو إعادة هيكلة للعملية بالكامل.\n\nالمعايير:\n• قابلية التطبيق الفعلي في البيئة الجامعية\n• تحسين تجربة المستخدم\n• عدالة التوزيع على الطلاب\n• التكلفة والموارد المطلوبة',
    prize: 250000,
    currency: 'IQD',
    participantCredits: 50,
    deadline: 'الأحد 8 ديسمبر 2024',
    status: 'open',
    category: 'تقنية المعلومات',
    postedBy: 'إدارة الجامعة',
    views: 342,
    solutions: [
      {
        id: 1,
        author: 'أ.د. أحمد حسين',
        role: 'أستاذ دكتور',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        text: 'أقترح استخدام نظام الطابور الذكي المبني على أولوية المعدل التراكمي مع إضافة نافذة زمنية لكل مستوى دراسي. الطلاب في السنة الرابعة يحصلون على 48 ساعة قبل، ثم الثالثة، ثم الثانية، ثم الأولى. هذا يقلل الضغط بنسبة 75% ويضمن عدالة التوزيع. التطبيق التقني بسيط ويمكن دمجه مع النظام الحالي خلال أسبوعين.',
        time: 'منذ 3 ساعات',
        votes: 28,
        voted: false,
        attachments: [
          { id: 'a1', type: 'file', name: 'خوارزمية_الطابور_الذكي.pdf', size: '1.2 MB' },
          { id: 'a2', type: 'image', name: 'مخطط_النظام.png', size: '380 KB' },
        ],
        comments: [
          { id: 1, author: 'علي محمد', role: 'طالب', time: 'منذ ساعتين', text: 'فكرة ممتازة! هذا بالضبط ما نحتاجه. السنة الماضية فاتني التسجيل بسبب البطء.', likes: 8, liked: false },
          { id: 2, author: 'م.م. نور أحمد', role: 'مدرس مساعد', time: 'منذ ساعة', text: 'هل يمكن إضافة خيار للطلاب الذين لديهم تعارضات جدول؟', likes: 3, liked: false },
        ],
        isWinner: false,
      },
      {
        id: 2,
        author: 'أ.م. سارة علي',
        role: 'أستاذ مساعد',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        text: 'الحل الأمثل هو تطبيق نظام الحجز المسبق بنافذة 72 ساعة قبل بدء الفصل. يستخدم الطالب التطبيق لتحديد أولوياته (1-5 لكل مادة)، والنظام يوزع تلقائياً بناءً على المعدل والأولوية. هذا يلغي الاندفاع تماماً.\n\nالتطبيق:\n1. واجهة تفاعلية بسيطة\n2. خوارزمية Hungarian Algorithm للتوزيع الأمثل\n3. نظام انتظار تلقائي للمواد الممتلئة\n4. إشعارات فورية عند الإلغاء والانضمام',
        time: 'منذ 5 ساعات',
        votes: 41,
        voted: false,
        attachments: [
          { id: 'b1', type: 'video', name: 'شرح_النظام_المقترح.mp4', duration: '4:32' },
          { id: 'b2', type: 'file', name: 'خطة_التطبيق.docx', size: '850 KB' },
          { id: 'b3', type: 'voice', name: 'ملاحظات_إضافية.m4a', duration: '1:15' },
        ],
        comments: [
          { id: 3, author: 'م. كريم ناصر', role: 'مقرر قسم', time: 'منذ 4 ساعات', text: 'Hungarian Algorithm ممتاز للمسألة ثنائية التخصيص! هل جربت تعقيد الخوارزمية على بيانات فعلية؟', likes: 12, liked: false },
        ],
        isWinner: false,
      },
    ],
  },
  {
    id: 2,
    title: 'تطوير منصة تبادل الملاحظات الدراسية بين الطلاب',
    description: 'كثير من الطلاب يعانون من نقص في الملاحظات الدراسية الجيدة. نحتاج فكرة عملية لإنشاء نظام تبادل ملاحظات يحفز الطلاب على المشاركة ويضمن جودة المحتوى المرفوع. يجب أن يتضمن الحل آلية تحفيز ونظام تقييم للملاحظات.',
    prize: 150000,
    currency: 'IQD',
    participantCredits: 30,
    deadline: 'الأربعاء 11 ديسمبر 2024',
    status: 'open',
    category: 'تطوير تعليمي',
    postedBy: 'إدارة الجامعة',
    views: 218,
    solutions: [
      {
        id: 3,
        author: 'م.م. زيد علي',
        role: 'معيد',
        text: 'نظام نقاط مقابل الرفع: كل ملاحظة ترفعها = 10 نقاط، كل تقييم إيجابي تحصل عليه = 5 نقاط. النقاط تُستخدم لتحميل ملاحظات الآخرين. هذا يخلق اقتصاداً داخلياً يحفز الجميع.',
        time: 'منذ يوم',
        votes: 19,
        voted: false,
        attachments: [
          { id: 'c1', type: 'image', name: 'wireframe_التطبيق.jpg', size: '520 KB' },
        ],
        comments: [],
        isWinner: false,
      },
    ],
  },
  {
    id: 3,
    title: 'حل مشكلة ازدحام مواقف السيارات داخل الحرم الجامعي',
    description: 'يتسبب ازدحام مواقف السيارات في تأخر الطلاب والأساتذة يومياً. نحتاج حلاً إبداعياً يمزج بين الحلول التقنية والإجرائية للحد من هذه المشكلة المزمنة.',
    prize: 100000,
    currency: 'IQD',
    participantCredits: 20,
    deadline: 'منتهي',
    status: 'closed',
    category: 'البنية التحتية',
    postedBy: 'إدارة الجامعة',
    views: 156,
    solutions: [
      {
        id: 4,
        author: 'علي محمد',
        role: 'طالب',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        text: 'تطبيق حجز موقف مسبق يعمل قبل ساعة من الوصول مع رسوم رمزية للحجز المضمون وقائمة انتظار مجانية.',
        time: 'منذ أسبوع',
        votes: 34,
        voted: false,
        attachments: [],
        comments: [{ id: 4, author: 'م.م. نور أحمد', role: 'مدرس مساعد', time: 'منذ 6 أيام', text: 'هذه الفكرة اختُيرت! مبروك', likes: 15, liked: false }],
        isWinner: true,
        premiumCredits: 150,
      },
    ],
  },
];

const ROLE_COLORS: Record<string, string> = {
  'أستاذ دكتور': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'أستاذ مساعد': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'معيد': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'طالب': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'مقرر قسم': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'مدرس مساعد': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

const STATUS_MAP = {
  open: { label: 'مفتوح', color: 'bg-green-100 text-green-700 dark:bg-green-900/30' },
  judging: { label: 'قيد التحكيم', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' },
  closed: { label: 'مغلق', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800' },
};

function AttachIcon({ type }: { type: AttachType }) {
  if (type === 'video') return <Video className="h-4 w-4 text-blue-500" />;
  if (type === 'voice') return <Volume2 className="h-4 w-4 text-green-500" />;
  if (type === 'image') return <Image className="h-4 w-4 text-purple-500" />;
  return <FileText className="h-4 w-4 text-orange-500" />;
}

export function ChallengesHub() {
  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);
  const [newSolutionText, setNewSolutionText] = useState('');
  const [newSolutionAttachments, setNewSolutionAttachments] = useState<Attachment[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const { colors } = useTheme();

  const formatPrize = (amount: number) => amount.toLocaleString('ar-IQ') + ' د.ع';

  const handleVote = (challengeId: number, solutionId: number) => {
    setChallenges(prev => prev.map(c => c.id !== challengeId ? c : {
      ...c,
      solutions: c.solutions.map(s => s.id !== solutionId ? s : {
        ...s,
        votes: s.voted ? s.votes - 1 : s.votes + 1,
        voted: !s.voted,
      }),
    }));
    if (selectedChallenge?.id === challengeId) {
      setSelectedChallenge(prev => prev ? {
        ...prev,
        solutions: prev.solutions.map(s => s.id !== solutionId ? s : {
          ...s,
          votes: s.voted ? s.votes - 1 : s.votes + 1,
          voted: !s.voted,
        }),
      } : prev);
    }
  };

  const handleCommentLike = (challengeId: number, solutionId: number, commentId: number) => {
    const update = (c: Challenge) => ({
      ...c,
      solutions: c.solutions.map(s => s.id !== solutionId ? s : {
        ...s,
        comments: s.comments.map(cm => cm.id !== commentId ? cm : {
          ...cm,
          likes: cm.liked ? cm.likes - 1 : cm.likes + 1,
          liked: !cm.liked,
        }),
      }),
    });
    setChallenges(prev => prev.map(c => c.id === challengeId ? update(c) : c));
    if (selectedChallenge?.id === challengeId) setSelectedChallenge(prev => prev ? update(prev) : prev);
  };

  const handleAddComment = (challengeId: number, solutionId: number) => {
    const text = commentInputs[solutionId]?.trim();
    if (!text) return;
    const newComment: Comment = {
      id: Date.now(),
      author: 'أنت',
      role: 'طالب',
      text,
      time: 'الآن',
      likes: 0,
      liked: false,
    };
    const update = (c: Challenge) => ({
      ...c,
      solutions: c.solutions.map(s => s.id !== solutionId ? s : {
        ...s,
        comments: [...s.comments, newComment],
      }),
    });
    setChallenges(prev => prev.map(c => c.id === challengeId ? update(c) : c));
    if (selectedChallenge?.id === challengeId) setSelectedChallenge(prev => prev ? update(prev) : prev);
    setCommentInputs(prev => ({ ...prev, [solutionId]: '' }));
  };

  const addSimulatedAttachment = (type: AttachType) => {
    const names: Record<AttachType, string> = {
      file: 'مستند_الحل.pdf',
      image: 'مخطط_الفكرة.png',
      video: 'شرح_الحل.mp4',
      voice: 'تسجيل_صوتي.m4a',
    };
    setNewSolutionAttachments(prev => [...prev, {
      id: Date.now().toString(),
      type,
      name: names[type],
      size: type !== 'video' && type !== 'voice' ? '1.1 MB' : undefined,
      duration: type === 'video' ? '2:30' : type === 'voice' ? '0:45' : undefined,
    }]);
  };

  const submitSolution = (challenge: Challenge) => {
    if (!newSolutionText.trim()) return;
    const newSol: Solution = {
      id: Date.now(),
      author: 'أنت',
      role: 'طالب',
      text: newSolutionText,
      time: 'الآن',
      votes: 0,
      voted: false,
      attachments: newSolutionAttachments,
      comments: [],
    };
    const update = (c: Challenge) => c.id !== challenge.id ? c : { ...c, solutions: [newSol, ...c.solutions] };
    setChallenges(prev => prev.map(update));
    setSelectedChallenge(prev => prev ? update(prev) : prev);
    setNewSolutionText('');
    setNewSolutionAttachments([]);
    setShowSubmitForm(false);
  };

  // Challenge list view
  if (!selectedChallenge) {
    return (
      <div className="space-y-4">
        {/* Section header */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-base">تحديات الإدارة</h3>
            <Badge className="bg-white/20 text-white border-0 text-xs mr-auto">
              {challenges.filter(c => c.status === 'open').length} مفتوح
            </Badge>
          </div>
          <p className="text-amber-100 text-xs leading-relaxed">
            الإدارة تنشر مشاكل حقيقية وتطلب حلولاً من الجميع. الفكرة الفائزة تكسب جائزة مالية، والمشاركون يحصلون على خدمات مميزة مجانية.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5 text-amber-200" />
              <span className="text-xs text-amber-100">جوائز مالية للفائز</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-200" />
              <span className="text-xs text-amber-100">كريدت مميز للمشاركين</span>
            </div>
          </div>
        </div>

        {challenges.map(challenge => (
          <motion.div
            key={challenge.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedChallenge(challenge)}
            className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden cursor-pointer`}
          >
            {challenge.status === 'open' && (
              <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500" />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className={`text-sm font-bold ${colors.textPrimary} flex-1 leading-snug`}>{challenge.title}</p>
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              </div>

              <p className={`text-xs ${colors.textSecondary} leading-relaxed mb-3 line-clamp-2`}>
                {challenge.description.split('\n')[0]}
              </p>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_MAP[challenge.status].color}`}>
                  {STATUS_MAP[challenge.status].label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 ${colors.textSecondary}`}>
                  {challenge.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-bold text-amber-600">{formatPrize(challenge.prize)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Lightbulb className="h-3.5 w-3.5 text-gray-400" />
                    <span className={`text-xs ${colors.textTertiary}`}>{challenge.solutions.length} حل</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className={`text-xs ${colors.textTertiary}`}>{challenge.deadline}</span>
                  </div>
                </div>
              </div>

              {challenge.solutions.some(s => s.isWinner) && (
                <div className="mt-3 flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-3 py-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400">تم اختيار الحل الفائز</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Challenge detail view
  const challenge = selectedChallenge;
  const sortedSolutions = [...challenge.solutions].sort((a, b) => {
    if (a.isWinner) return -1;
    if (b.isWinner) return 1;
    return b.votes - a.votes;
  });

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={() => { setSelectedChallenge(null); setShowSubmitForm(false); }}
        className={`flex items-center gap-2 text-sm font-semibold ${colors.textSecondary} hover:${colors.textPrimary} transition-colors`}
      >
        <ChevronLeft className="h-4 w-4" />
        العودة للتحديات
      </button>

      {/* Challenge detail card */}
      <div className={`${colors.cardBg} rounded-2xl border ${colors.border} overflow-hidden`}>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-4 py-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-white font-bold text-base leading-snug flex-1">{challenge.title}</p>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
              challenge.status === 'open' ? 'bg-green-400/30 text-white' :
              challenge.status === 'judging' ? 'bg-yellow-400/30 text-white' :
              'bg-white/20 text-white/80'
            }`}>
              {STATUS_MAP[challenge.status].label}
            </span>
          </div>
          <p className="text-amber-200 text-xs">{challenge.category} • {challenge.postedBy}</p>
        </div>

        <div className="p-4">
          <p className={`text-xs ${colors.textSecondary} leading-relaxed whitespace-pre-line mb-4`}>{challenge.description}</p>

          <div className="grid grid-cols-3 gap-2">
            <div className={`${colors.bgSecondary} rounded-xl p-3 text-center`}>
              <Trophy className="h-4 w-4 text-amber-500 mx-auto mb-1" />
              <p className="text-amber-600 font-bold text-sm">{formatPrize(challenge.prize)}</p>
              <p className={`text-[9px] ${colors.textTertiary}`}>جائزة الفائز</p>
            </div>
            <div className={`${colors.bgSecondary} rounded-xl p-3 text-center`}>
              <Zap className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <p className={`font-bold text-sm ${colors.textPrimary}`}>{challenge.participantCredits}</p>
              <p className={`text-[9px] ${colors.textTertiary}`}>كريدت للمشارك</p>
            </div>
            <div className={`${colors.bgSecondary} rounded-xl p-3 text-center`}>
              <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className={`font-bold text-xs ${colors.textPrimary}`}>{challenge.deadline}</p>
              <p className={`text-[9px] ${colors.textTertiary}`}>الموعد النهائي</p>
            </div>
          </div>

          {challenge.status === 'open' && (
            <button
              onClick={() => setShowSubmitForm(v => !v)}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Lightbulb className="h-4 w-4" />
              {showSubmitForm ? 'إخفاء نموذج الحل' : 'قدِّم حلك واربح الجائزة'}
            </button>
          )}
        </div>
      </div>

      {/* Submit solution form */}
      <AnimatePresence>
        {showSubmitForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden ${colors.cardBg} rounded-2xl border-2 border-amber-400 dark:border-amber-700`}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h4 className={`font-bold text-sm ${colors.textPrimary}`}>حلك للمشكلة</h4>
                <span className={`text-[10px] ${colors.textTertiary} mr-auto`}>لا حد للطول — اشرح بالتفصيل</span>
              </div>

              <textarea
                value={newSolutionText}
                onChange={e => setNewSolutionText(e.target.value)}
                placeholder="اكتب حلك المقترح بالتفصيل... كلما كان الشرح أوضح وأكثر تفصيلاً كانت فرصك أكبر في الفوز. يمكنك ذكر خطوات التطبيق، الموارد المطلوبة، والنتائج المتوقعة."
                className={`w-full min-h-32 px-4 py-3 rounded-xl border ${colors.border} ${colors.bgPrimary} ${colors.textPrimary} text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400`}
                dir="rtl"
              />

              {/* Attachment buttons */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className={`text-xs ${colors.textTertiary}`}>إرفاق:</span>
                {([
                  { type: 'file' as AttachType, icon: Paperclip, label: 'ملف', color: 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20' },
                  { type: 'image' as AttachType, icon: Image, label: 'صورة', color: 'text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20' },
                  { type: 'video' as AttachType, icon: Video, label: 'فيديو', color: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' },
                  { type: 'voice' as AttachType, icon: Mic, label: 'صوت', color: 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' },
                ]).map(btn => (
                  <button
                    key={btn.type}
                    onClick={() => addSimulatedAttachment(btn.type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${btn.color}`}
                  >
                    <btn.icon className="h-3.5 w-3.5" />
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Attachment previews */}
              {newSolutionAttachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {newSolutionAttachments.map(att => (
                    <div key={att.id} className={`flex items-center gap-2 p-2.5 rounded-xl ${colors.bgSecondary}`}>
                      <AttachIcon type={att.type} />
                      <span className={`text-xs flex-1 truncate ${colors.textPrimary}`}>{att.name}</span>
                      <span className={`text-[10px] ${colors.textTertiary}`}>{att.size ?? att.duration}</span>
                      <button onClick={() => setNewSolutionAttachments(p => p.filter(a => a.id !== att.id))}>
                        <X className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => submitSolution(challenge)}
                  disabled={!newSolutionText.trim()}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  نشر الحل
                </button>
                <button
                  onClick={() => { setShowSubmitForm(false); setNewSolutionText(''); setNewSolutionAttachments([]); }}
                  className={`px-4 py-3 rounded-xl ${colors.bgSecondary} ${colors.textSecondary} text-sm`}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solutions list */}
      <div className="flex items-center justify-between">
        <h4 className={`font-bold text-sm ${colors.textPrimary}`}>
          الحلول المقدمة ({challenge.solutions.length})
        </h4>
        <span className={`text-xs ${colors.textTertiary}`}>مرتبة حسب الأعلى تصويتاً</span>
      </div>

      {sortedSolutions.length === 0 ? (
        <div className={`${colors.cardBg} rounded-2xl p-8 border ${colors.border} text-center`}>
          <Lightbulb className="h-10 w-10 text-amber-300 mx-auto mb-3" />
          <p className={`text-sm font-medium ${colors.textPrimary}`}>لا توجد حلول بعد</p>
          <p className={`text-xs ${colors.textTertiary} mt-1`}>كن أول من يقدم حلاً ويحصل على الجائزة</p>
        </div>
      ) : (
        sortedSolutions.map((solution, idx) => (
          <motion.div
            key={solution.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`${colors.cardBg} rounded-2xl border ${solution.isWinner ? 'border-yellow-400 dark:border-yellow-600' : colors.border} overflow-hidden`}
          >
            {/* Winner banner */}
            {solution.isWinner && (
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-white fill-white" />
                <p className="text-white text-xs font-bold">الحل الفائز — تم اختياره من الإدارة</p>
                {solution.premiumCredits && (
                  <span className="mr-auto bg-white/30 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    +{solution.premiumCredits} كريدت
                  </span>
                )}
              </div>
            )}

            <div className="p-4">
              {/* Author */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-9 w-9">
                  {solution.avatar && <img src={solution.avatar} className="w-full h-full object-cover rounded-full" />}
                  <AvatarFallback className="text-sm font-bold">{solution.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-bold ${colors.textPrimary}`}>{solution.author}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${ROLE_COLORS[solution.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {solution.role}
                    </span>
                  </div>
                  <p className={`text-[10px] ${colors.textTertiary}`}>{solution.time}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleVote(challenge.id, solution.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      solution.voted
                        ? 'bg-amber-500 text-white'
                        : `${colors.bgSecondary} ${colors.textSecondary} hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600`
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {solution.votes}
                  </button>
                </div>
              </div>

              {/* Solution text — expandable */}
              <div
                className={`text-sm ${colors.textPrimary} leading-relaxed whitespace-pre-line mb-3 ${
                  expandedSolution !== solution.id && solution.text.length > 300 ? 'line-clamp-4' : ''
                }`}
              >
                {solution.text}
              </div>
              {solution.text.length > 300 && (
                <button
                  onClick={() => setExpandedSolution(expandedSolution === solution.id ? null : solution.id)}
                  className="text-xs text-amber-600 font-semibold mb-3"
                >
                  {expandedSolution === solution.id ? 'عرض أقل ↑' : 'اقرأ المزيد ↓'}
                </button>
              )}

              {/* Attachments */}
              {solution.attachments.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {solution.attachments.map(att => (
                    <div key={att.id} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${colors.bgSecondary} cursor-pointer hover:opacity-80 transition-opacity`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        att.type === 'video' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        att.type === 'voice' ? 'bg-green-100 dark:bg-green-900/30' :
                        att.type === 'image' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        'bg-orange-100 dark:bg-orange-900/30'
                      }`}>
                        {att.type === 'video' || att.type === 'voice'
                          ? <Play className={`h-4 w-4 ${att.type === 'video' ? 'text-blue-500' : 'text-green-500'}`} />
                          : <AttachIcon type={att.type} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${colors.textPrimary} truncate`}>{att.name}</p>
                        <p className={`text-[10px] ${colors.textTertiary}`}>{att.size ?? att.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comments section */}
              <div className={`border-t ${colors.border} pt-3`}>
                <button
                  onClick={() => setExpandedSolution(expandedSolution === solution.id ? null : solution.id)}
                  className={`flex items-center gap-1.5 text-xs ${colors.textSecondary} mb-3`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {solution.comments.length} تعليق
                  {solution.comments.length > 0 && (
                    <span className="text-[10px]">{expandedSolution === solution.id ? '▲' : '▼'}</span>
                  )}
                </button>

                <AnimatePresence>
                  {expandedSolution === solution.id && solution.comments.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-3 mb-3"
                    >
                      {solution.comments.map(comment => (
                        <div key={comment.id} className={`flex gap-2.5 p-3 rounded-xl ${colors.bgSecondary}`}>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {comment.author[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`text-xs font-bold ${colors.textPrimary}`}>{comment.author}</p>
                              <span className={`text-[9px] ${colors.textTertiary}`}>{comment.time}</span>
                            </div>
                            <p className={`text-xs ${colors.textSecondary} leading-relaxed`}>{comment.text}</p>
                            <button
                              onClick={() => handleCommentLike(challenge.id, solution.id, comment.id)}
                              className={`flex items-center gap-1 mt-1.5 text-[10px] font-medium transition-colors ${
                                comment.liked ? 'text-amber-500' : colors.textTertiary
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" /> {comment.likes}
                            </button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Add comment */}
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${colors.border} ${colors.bgSecondary}`}>
                  <input
                    type="text"
                    value={commentInputs[solution.id] ?? ''}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [solution.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleAddComment(challenge.id, solution.id)}
                    placeholder="علِّق على هذا الحل..."
                    className={`flex-1 text-xs ${colors.bgSecondary} ${colors.textPrimary} focus:outline-none`}
                    dir="rtl"
                  />
                  <button
                    onClick={() => handleAddComment(challenge.id, solution.id)}
                    disabled={!commentInputs[solution.id]?.trim()}
                    className="w-7 h-7 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Send className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

export default ChallengesHub;
