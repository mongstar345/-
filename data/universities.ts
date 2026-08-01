export interface University {
  id: string;
  nameAr: string;
  nameEn: string;
  city: string;
  domains: string[];
  color: string;
  logoUrl: string; // empty string = show initials fallback
}

export const DEFAULT_UNIVERSITIES: University[] = [
  {
    id: 'nahrain',
    nameAr: 'جامعة النهرين',
    nameEn: 'Al-Nahrain University',
    city: 'بغداد',
    domains: ['@nahrain.edu.iq', '@student.nahrainuniv.edu.iq', '@staff.nahrainuniv.edu.iq'],
    color: 'from-blue-600 to-indigo-700',
    logoUrl: '',
  },
  {
    id: 'baghdad',
    nameAr: 'جامعة بغداد',
    nameEn: 'University of Baghdad',
    city: 'بغداد',
    domains: ['@uobaghdad.edu.iq', '@student.uobaghdad.edu.iq'],
    color: 'from-green-600 to-teal-700',
    logoUrl: '',
  },
  {
    id: 'mustansiriyah',
    nameAr: 'الجامعة المستنصرية',
    nameEn: 'Al-Mustansiriyah University',
    city: 'بغداد',
    domains: ['@uomustansiriyah.edu.iq', '@student.uomustansiriyah.edu.iq'],
    color: 'from-orange-600 to-amber-700',
    logoUrl: '',
  },
  {
    id: 'technology',
    nameAr: 'الجامعة التكنولوجية',
    nameEn: 'University of Technology',
    city: 'بغداد',
    domains: ['@uotechnology.edu.iq'],
    color: 'from-purple-600 to-violet-700',
    logoUrl: '',
  },
  {
    id: 'basrah',
    nameAr: 'جامعة البصرة',
    nameEn: 'University of Basrah',
    city: 'البصرة',
    domains: ['@uobasrah.edu.iq'],
    color: 'from-teal-600 to-cyan-700',
    logoUrl: '',
  },
  {
    id: 'mosul',
    nameAr: 'جامعة الموصل',
    nameEn: 'University of Mosul',
    city: 'الموصل',
    domains: ['@uomosul.edu.iq'],
    color: 'from-red-600 to-rose-700',
    logoUrl: '',
  },
  {
    id: 'kufa',
    nameAr: 'جامعة الكوفة',
    nameEn: 'University of Kufa',
    city: 'النجف',
    domains: ['@uokufa.edu.iq'],
    color: 'from-emerald-600 to-green-700',
    logoUrl: '',
  },
  {
    id: 'karbala',
    nameAr: 'جامعة كربلاء',
    nameEn: 'University of Karbala',
    city: 'كربلاء',
    domains: ['@uokerbala.edu.iq'],
    color: 'from-sky-600 to-blue-700',
    logoUrl: '',
  },
];

export const GRADIENT_PRESETS = [
  { label: 'أزرق', value: 'from-blue-600 to-indigo-700' },
  { label: 'أخضر', value: 'from-green-600 to-teal-700' },
  { label: 'برتقالي', value: 'from-orange-600 to-amber-700' },
  { label: 'بنفسجي', value: 'from-purple-600 to-violet-700' },
  { label: 'سماوي', value: 'from-teal-600 to-cyan-700' },
  { label: 'أحمر', value: 'from-red-600 to-rose-700' },
  { label: 'زمردي', value: 'from-emerald-600 to-green-700' },
  { label: 'سماوي فاتح', value: 'from-sky-600 to-blue-700' },
  { label: 'وردي', value: 'from-pink-600 to-rose-700' },
  { label: 'رمادي', value: 'from-slate-600 to-gray-700' },
];
