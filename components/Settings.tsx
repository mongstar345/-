import { Settings as SettingsIcon, User, Bell, Lock, Globe, Palette, Shield, Database, HelpCircle, Info, ChevronRight, Moon, Sun, Volume2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, LANGUAGE_OPTIONS } from '../contexts/LanguageContext';

interface SettingsProps {
  onNavigateToTheme?: () => void;
}

export function Settings({ onNavigateToTheme }: SettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const { colors, theme, toggleMode } = useTheme();
  const { t, lang, setLang } = useLanguage();

  return (
    <div className={`min-h-screen ${colors.bgSecondary} pb-20 max-w-md mx-auto`}>
      <header className={`${colors.bgPrimary} px-4 py-3 border-b ${colors.border}`}>
        <h1 className={`text-lg flex items-center gap-2 ${colors.textPrimary}`}>
          <SettingsIcon className="h-5 w-5" />
          {t('settings_title')}
        </h1>
      </header>

      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="p-3 space-y-3">
          {/* Profile */}
          <Card className={`${colors.bgPrimary} ${colors.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm flex items-center gap-2 ${colors.textPrimary}`}>
                <User className={`h-4 w-4`} />
                {t('profile_settings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" />
                  <AvatarFallback>MU</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className={`text-sm ${colors.textPrimary}`}>Mustafa Ahmed</h3>
                  <p className={`text-xs ${colors.textSecondary}`}>mustafa.ahmed@alnahrain.edu.iq</p>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  {t('edit')}
                </Button>
              </div>
              <Separator className={colors.border} />
              {[
                { label: t('edit_profile') },
                { label: t('change_password') },
                { label: t('manage_account') },
              ].map(item => (
                <button key={item.label} className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                  <span className="text-sm">{item.label}</span>
                  <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className={`${colors.bgPrimary} ${colors.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm flex items-center gap-2 ${colors.textPrimary}`}>
                <Bell className="h-4 w-4" />
                {t('notif_title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {[
                { id: 'notif', label: t('enable_notifications'), sub: t('enable_notifications_sub'), state: notificationsEnabled, set: setNotificationsEnabled },
                { id: 'email', label: t('email_notifications'), sub: t('email_notifications_sub'), state: emailNotifications, set: setEmailNotifications },
                { id: 'push', label: t('push_notifications'), sub: t('push_notifications_sub'), state: pushNotifications, set: setPushNotifications },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={item.id} className={`text-sm ${colors.textPrimary}`}>{item.label}</Label>
                    <p className={`text-xs ${colors.textSecondary}`}>{item.sub}</p>
                  </div>
                  <Switch id={item.id} checked={item.state} onCheckedChange={item.set} />
                </div>
              ))}
              <Separator className={colors.border} />
              <button className={`w-full flex items-center justify-between py-2 ${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                <span className="text-sm">{t('notification_preferences')}</span>
                <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
              </button>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className={`${colors.bgPrimary} ${colors.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm flex items-center gap-2 ${colors.textPrimary}`}>
                <Shield className="h-4 w-4" />
                {t('privacy_security')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="online-status" className={`text-sm ${colors.textPrimary}`}>{t('show_online_status')}</Label>
                  <p className={`text-xs ${colors.textSecondary}`}>{t('show_online_status_sub')}</p>
                </div>
                <Switch id="online-status" checked={onlineStatus} onCheckedChange={setOnlineStatus} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="read-receipts" className={`text-sm ${colors.textPrimary}`}>{t('read_receipts')}</Label>
                  <p className={`text-xs ${colors.textSecondary}`}>{t('read_receipts_sub')}</p>
                </div>
                <Switch id="read-receipts" checked={readReceipts} onCheckedChange={setReadReceipts} />
              </div>
              <Separator className={colors.border} />
              {[t('privacy_settings'), t('blocked_users'), t('two_factor')].map(label => (
                <button key={label} className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                  <span className="text-sm">{label}</span>
                  <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className={`${colors.bgPrimary} ${colors.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm flex items-center gap-2 ${colors.textPrimary}`}>
                <Palette className="h-4 w-4" />
                {t('appearance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme.mode === 'dark' ? <Moon className={`h-5 w-5 ${colors.textSecondary}`} /> : <Sun className={`h-5 w-5 ${colors.textSecondary}`} />}
                  <div>
                    <Label htmlFor="dark-mode" className={`text-sm ${colors.textPrimary}`}>{t('dark_mode')}</Label>
                    <p className={`text-xs ${colors.textSecondary}`}>{t('dark_mode_sub')}</p>
                  </div>
                </div>
                <Switch id="dark-mode" checked={theme.mode === 'dark'} onCheckedChange={toggleMode} />
              </div>
              <Separator className={colors.border} />
              <button onClick={onNavigateToTheme} className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{t('theme_settings')}</span>
                </div>
                <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
              </button>
              <button className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                <span className="text-sm">{t('font_size')}</span>
                <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
              </button>
            </CardContent>
          </Card>

          {/* Sound */}
          <Card className={`${colors.bgPrimary} ${colors.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm flex items-center gap-2 ${colors.textPrimary}`}>
                <Volume2 className="h-4 w-4" />
                {t('sound_accessibility')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound" className={`text-sm ${colors.textPrimary}`}>{t('sound_effects')}</Label>
                  <p className={`text-xs ${colors.textSecondary}`}>{t('sound_effects_sub')}</p>
                </div>
                <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
              <Separator className={colors.border} />
              <button className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                <span className="text-sm">{t('accessibility_options')}</span>
                <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
              </button>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card className={`${colors.bgPrimary} ${colors.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm flex items-center gap-2 ${colors.textPrimary}`}>
                <Globe className="h-4 w-4" />
                {t('language_region')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {LANGUAGE_OPTIONS.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => setLang(opt.code)}
                  className={`w-full flex items-center gap-3 py-2.5 hover:${colors.bgHover} rounded-xl px-3 transition-all ${
                    lang === opt.code ? `${colors.bgSecondary} ring-1 ring-blue-400` : ''
                  }`}
                >
                  <span className="text-xl">{opt.flag}</span>
                  <div className="flex-1 text-start">
                    <p className={`text-sm font-medium ${colors.textPrimary}`}>{opt.nativeLabel}</p>
                    <p className={`text-xs ${colors.textSecondary}`}>{opt.label}</p>
                  </div>
                  {lang === opt.code && (
                    <span className="w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">✓</span>
                  )}
                </button>
              ))}
              <Separator className={`${colors.border} my-2`} />
              <button className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                <span className="text-sm">{t('time_zone')}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${colors.textSecondary}`}>GMT+3</span>
                  <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
                </div>
              </button>
            </CardContent>
          </Card>

          {/* Data & Storage */}
          <Card className={`${colors.bgPrimary} ${colors.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm flex items-center gap-2 ${colors.textPrimary}`}>
                <Database className="h-4 w-4" />
                {t('data_storage')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <button className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                <span className="text-sm">{t('storage_usage')}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${colors.textSecondary}`}>245 MB</span>
                  <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
                </div>
              </button>
              {[t('clear_cache'), t('download_data')].map(label => (
                <button key={label} className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                  <span className="text-sm">{label}</span>
                  <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* About */}
          <Card className={`${colors.bgPrimary} ${colors.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm flex items-center gap-2 ${colors.textPrimary}`}>
                <Info className="h-4 w-4" />
                {t('about')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <button className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                <span className="text-sm">{t('version')}</span>
                <span className={`text-sm ${colors.textSecondary}`}>1.0.0</span>
              </button>
              {[t('terms_of_service'), t('privacy_policy'), t('licenses')].map(label => (
                <button key={label} className={`w-full flex items-center justify-between py-2 hover:${colors.bgHover} rounded-lg px-2 ${colors.textPrimary}`}>
                  <span className="text-sm">{label}</span>
                  <ChevronRight className={`h-4 w-4 ${colors.textSecondary}`} />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className={`${colors.bgPrimary} border-red-200`}>
            <CardContent className="p-3 space-y-2">
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 h-9 text-sm">
                {t('log_out')}
              </Button>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 h-9 text-sm">
                {t('delete_account')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
