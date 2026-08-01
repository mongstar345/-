export type ServiceType = 'report' | 'presentation' | 'homework' | 'research';

export interface ServicePrice {
  type: ServiceType;
  nameAr: string;
  nameEn: string;
  min: number;
  max: number;
  isCustom?: boolean;
}

// Default prices in IQD — admin can override at runtime via localStorage
const STORAGE_KEY = 'campus_service_prices';

export const DEFAULT_SERVICE_PRICES: ServicePrice[] = [
  { type: 'report', nameAr: 'إعداد تقرير', nameEn: 'Report Preparation', min: 5000, max: 10000 },
  { type: 'presentation', nameAr: 'إعداد عرض تقديمي', nameEn: 'Presentation', min: 10000, max: 20000 },
  { type: 'homework', nameAr: 'حل الواجبات (برمجة / دوائر)', nameEn: 'Homework (Programming / Circuits)', min: 5000, max: 20000 },
  { type: 'research', nameAr: 'كتابة بحث التخرج', nameEn: 'Graduation Research', min: 0, max: 0, isCustom: true },
];

export function loadServicePrices(): ServicePrice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ServicePrice[];
  } catch {}
  return DEFAULT_SERVICE_PRICES;
}

export function saveServicePrices(prices: ServicePrice[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
}

/** Detect which service a task needs based on title + subtitle keywords */
export function detectTaskService(title: string, subtitle: string): ServiceType | null {
  const txt = (title + ' ' + subtitle).toLowerCase();

  const researchKw = ['graduation', 'research paper', 'بحث تخرج', 'research collaboration', 'thesis'];
  if (researchKw.some(k => txt.includes(k))) return 'research';

  const reportKw = ['report', 'lab report', 'تقرير', 'submit experiment', 'experiment results'];
  if (reportKw.some(k => txt.includes(k))) return 'report';

  const presentationKw = ['presentation', 'عرض تقديمي', 'present', 'slides'];
  if (presentationKw.some(k => txt.includes(k))) return 'presentation';

  const homeworkKw = ['homework', 'واجب', 'project', 'implement', 'programming', 'circuit', 'دائرة', 'كهربائي', 'برمج', 'matlab', 'binary search', 'bst', 'algorithm'];
  if (homeworkKw.some(k => txt.includes(k))) return 'homework';

  return null;
}
