import { Sun, Moon, Check, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme, LightTheme, DarkTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  preview: string[];
}

const lightThemeOptions: (ThemeOption & { id: LightTheme })[] = [
  {
    id: 'pure-white',
    name: 'Pure White',
    description: 'أبيض نقي كلاسيكي',
    preview: ['bg-white', 'bg-gray-100', 'bg-gray-200'],
  },
  {
    id: 'blue-white',
    name: 'Blue White',
    description: 'أبيض مزرق منعش',
    preview: ['bg-blue-50', 'bg-blue-100', 'bg-blue-200'],
  },
  {
    id: 'warm-white',
    name: 'Warm White',
    description: 'أبيض دافئ مريح للعين',
    preview: ['bg-amber-50', 'bg-orange-100', 'bg-amber-200'],
  },
  {
    id: 'cool-gray',
    name: 'Cool Gray',
    description: 'رمادي بارد احترافي',
    preview: ['bg-slate-50', 'bg-slate-100', 'bg-slate-200'],
  },
];

const darkThemeOptions: (ThemeOption & { id: DarkTheme })[] = [
  {
    id: 'amoled-black',
    name: 'AMOLED Black',
    description: 'أسود قاتم يوفر البطارية',
    preview: ['bg-black', 'bg-zinc-950', 'bg-zinc-900'],
  },
  {
    id: 'blue-dark',
    name: 'Blue Dark',
    description: 'أسود يميل للأزرق',
    preview: ['bg-slate-950', 'bg-slate-900', 'bg-slate-800'],
  },
  {
    id: 'gray-dark',
    name: 'Gray Dark',
    description: 'رمادي داكن متوازن',
    preview: ['bg-gray-900', 'bg-gray-800', 'bg-gray-700'],
  },
  {
    id: 'deep-purple',
    name: 'Deep Purple',
    description: 'بنفسجي عميق ساحر',
    preview: ['bg-purple-950', 'bg-purple-900', 'bg-purple-800'],
  },
  {
    id: 'navy-dark',
    name: 'Navy Dark',
    description: 'أزرق داكن (Telegram)',
    preview: ['bg-[#0E1621]', 'bg-[#17212B]', 'bg-[#1C2733]'],
  },
];

export function ThemeSettings() {
  const { theme, setMode, setLightTheme, setDarkTheme, toggleMode, colors } = useTheme();

  return (
    <div className={`min-h-screen ${colors.bgSecondary} ${colors.textPrimary} pb-20`}>
      {/* Header */}
      <header className={`${colors.bgPrimary} px-4 py-4 border-b ${colors.border} sticky top-0 z-10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-bold">Theme Settings</h1>
          </div>
          <Button
            onClick={toggleMode}
            variant="ghost"
            size="icon"
            className={`${colors.bgHover} rounded-full`}
          >
            {theme.mode === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${colors.cardBg} rounded-2xl p-6 border ${colors.border} shadow-sm`}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-500" />
            وضع العرض
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('light')}
              className={`p-6 rounded-xl border-2 transition-all ${
                theme.mode === 'light'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : `border-transparent ${colors.bgSecondary}`
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`p-4 rounded-full ${theme.mode === 'light' ? 'bg-blue-500' : colors.bgTertiary}`}>
                  <Sun className={`h-8 w-8 ${theme.mode === 'light' ? 'text-white' : colors.textSecondary}`} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Light Mode</h3>
                  <p className={`text-sm ${colors.textSecondary}`}>وضع النهار المضيء</p>
                </div>
                {theme.mode === 'light' && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => setMode('dark')}
              className={`p-6 rounded-xl border-2 transition-all ${
                theme.mode === 'dark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : `border-transparent ${colors.bgSecondary}`
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`p-4 rounded-full ${theme.mode === 'dark' ? 'bg-blue-500' : colors.bgTertiary}`}>
                  <Moon className={`h-8 w-8 ${theme.mode === 'dark' ? 'text-white' : colors.textSecondary}`} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Dark Mode</h3>
                  <p className={`text-sm ${colors.textSecondary}`}>وضع الليل المريح</p>
                </div>
                {theme.mode === 'dark' && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </button>
          </div>
        </motion.div>

        {/* Light Themes */}
        {theme.mode === 'light' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${colors.cardBg} rounded-2xl p-6 border ${colors.border} shadow-sm`}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              ثيمات الوضع المضيء
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lightThemeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setLightTheme(option.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    theme.lightTheme === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : `border-transparent ${colors.bgSecondary} ${colors.bgHover}`
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{option.name}</h3>
                      <p className={`text-sm ${colors.textSecondary} mt-1`}>{option.description}</p>
                    </div>
                    {theme.lightTheme === option.id && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {option.preview.map((color, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-12 rounded-lg ${color} border border-gray-300`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Dark Themes */}
        {theme.mode === 'dark' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${colors.cardBg} rounded-2xl p-6 border ${colors.border} shadow-sm`}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Moon className="h-5 w-5 text-blue-400" />
              ثيمات الوضع المظلم
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {darkThemeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDarkTheme(option.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    theme.darkTheme === option.id
                      ? 'border-blue-500 bg-blue-950'
                      : `border-transparent ${colors.bgSecondary} ${colors.bgHover}`
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{option.name}</h3>
                      <p className={`text-sm ${colors.textSecondary} mt-1`}>{option.description}</p>
                    </div>
                    {theme.darkTheme === option.id && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {option.preview.map((color, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-12 rounded-lg ${color} border border-gray-700`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${colors.cardBg} rounded-2xl p-6 border ${colors.border} shadow-sm`}
        >
          <h2 className="text-lg font-semibold mb-4">معاينة الثيم</h2>
          <div className={`${colors.bgSecondary} rounded-xl p-4 space-y-3`}>
            <div className={`${colors.cardBg} rounded-lg p-4 border ${colors.border}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full" />
                <div>
                  <h3 className="font-semibold">اسم المستخدم</h3>
                  <p className={`text-sm ${colors.textSecondary}`}>هذا مثال على بطاقة</p>
                </div>
              </div>
              <p className={colors.textSecondary}>هذا نص تجريبي لمعاينة الألوان والثيم المختار.</p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                زر أساسي
              </Button>
              <Button variant="outline" className="flex-1">
                زر ثانوي
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ThemeSettings;
