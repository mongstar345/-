import { Menu, Bell, Plus, Languages, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { SideMenu } from './SideMenu';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, LANGUAGE_OPTIONS } from '../contexts/LanguageContext';
import type { University } from '../data/universities';

interface HeaderProps {
  onNavigate?: (view: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onCreatePost?: () => void;
  user?: { name: string; role: string; email: string; department: string; univId?: string } | null;
  onLogout?: () => void;
  universities?: University[];
}

/** Tiny university logo: image or gradient+initials */
function UnivLogoMini({ univ }: { univ: University }) {
  const initials = univ.nameAr.replace(/[^؀-ۿ]/g, '').slice(0, 2) || univ.nameAr[0];
  if (univ.logoUrl) {
    return (
      <div className="w-6 h-6 rounded-md overflow-hidden bg-white border border-gray-100 flex-shrink-0">
        <img src={univ.logoUrl} alt={univ.nameAr} className="w-full h-full object-contain" />
      </div>
    );
  }
  return (
    <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${univ.color} flex items-center justify-center flex-shrink-0`}>
      <span className="text-white text-[9px] font-bold leading-none">{initials}</span>
    </div>
  );
}

export function Header({
  onNavigate, activeTab, onTabChange, onCreatePost,
  user, onLogout, universities = [],
}: HeaderProps) {
  const [notificationCount] = useState(3);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { colors } = useTheme();
  const { t, lang, setLang } = useLanguage();

  // Resolve user's university: prefer univId, fall back to email domain match
  const userUniv = user
    ? (user.univId
        ? universities.find(u => u.id === user.univId)
        : universities.find(u => u.domains.some(d => user.email?.toLowerCase().endsWith(d))))
    : undefined;

  const headerTitle = userUniv ? userUniv.nameAr : t('app_name');

  return (
    <>
      <header className={`sticky top-0 z-40 ${colors.bgPrimary} border-b ${colors.border} px-4 py-1.5`}>
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">

          {/* Left: hamburger + university/app name */}
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className={`${colors.bgHover} h-8 w-8 flex-shrink-0`}
              onClick={() => setIsSideMenuOpen(true)}
            >
              <Menu className={`h-5 w-5 ${colors.textPrimary}`} />
            </Button>

            <button
              onClick={() => onNavigate?.('Home')}
              className="flex items-center gap-1.5 min-w-0"
            >
              {userUniv && <UnivLogoMini univ={userUniv} />}
              <h1 className={`text-base font-semibold ${colors.textPrimary} truncate max-w-[140px]`}>
                {headerTitle}
              </h1>
            </button>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-0.5">
            {/* Premium crown */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              onClick={() => onNavigate?.('premium')}
              title="Campus Pro"
            >
              <Crown className="h-4 w-4" />
            </Button>

            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`${colors.bgHover} h-8 w-8`}>
                  <Languages className={`h-4 w-4 ${colors.textPrimary}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs text-gray-400">{t('language')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {LANGUAGE_OPTIONS.map(opt => (
                  <DropdownMenuItem
                    key={opt.code}
                    onClick={() => setLang(opt.code)}
                    className={`flex items-center gap-2 ${lang === opt.code ? 'font-bold text-blue-600' : ''}`}
                  >
                    <span className="text-base">{opt.flag}</span>
                    <span className="flex-1">{opt.nativeLabel}</span>
                    {lang === opt.code && <span className="text-blue-500 text-xs">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Create content */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`${colors.bgHover} h-8 w-8`}>
                  <Plus className={`h-5 w-5 ${colors.textPrimary}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onCreatePost?.()}>
                  <span>{t('create_post')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>{t('create_reel')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>{t('add_story')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>{t('go_live')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className={`${colors.bgHover} relative h-8 w-8`}
              onClick={() => onNavigate?.('notifications')}
            >
              <Bell className={`h-5 w-5 ${colors.textPrimary}`} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Button>

            {/* Avatar */}
            <Avatar
              className="h-7 w-7 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all"
              onClick={() => onNavigate?.('profile')}
            >
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onNavigate={(view) => {
          onNavigate?.(view);
          setIsSideMenuOpen(false);
        }}
      />
    </>
  );
}
