import { Home, ClipboardList, MessageCircle, BookOpen, GraduationCap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const navItems = [
    { id: 'Home', labelKey: 'nav_home' as const, icon: Home },
    { id: 'Dashboard', labelKey: 'nav_dashboard' as const, icon: ClipboardList },
    { id: 'Chats', labelKey: 'nav_chats' as const, icon: MessageCircle },
    { id: 'Books', labelKey: 'nav_books' as const, icon: BookOpen },
    { id: 'Courses', labelKey: 'nav_courses' as const, icon: GraduationCap },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${colors.bgPrimary} border-t ${colors.border} z-50 shadow-lg`}>
      <div className="flex items-center justify-around max-w-screen-xl mx-auto overflow-x-auto hide-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-2 px-2 transition-colors min-w-[60px]"
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-blue-500 text-white' : `${colors.textSecondary} ${colors.bgHover}`
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-medium ${
                  isActive ? 'text-blue-500' : colors.textSecondary
                }`}
              >
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
