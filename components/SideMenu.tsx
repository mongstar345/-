import { Home, BookOpen, GraduationCap, Users, Newspaper, Calendar, MapPin, Settings, HelpCircle, LogOut, Bell, User, MessageSquare, LayoutDashboard, Trophy, Briefcase, Globe, Presentation } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useTheme } from '../contexts/ThemeContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  action?: () => void;
}

export function SideMenu({ isOpen, onClose, onNavigate, activeTab, onTabChange }: SideMenuProps) {
  const mainMenuItems: MenuItem[] = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Courses', label: 'Courses', icon: GraduationCap },
    { id: 'Books', label: 'Library', icon: BookOpen },
    { id: 'Chats', label: 'Messages', icon: MessageSquare, badge: 3 },
    { id: 'Clubs', label: 'Clubs', icon: Users },
    { id: 'seminars', label: 'Seminars', icon: Presentation },
    { id: 'location', label: 'Campus Map', icon: MapPin },
  ];

  const quickMenuItems: MenuItem[] = [
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const bottomMenuItems: MenuItem[] = [
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
    },
    { 
      id: 'help', 
      label: 'Help & Support', 
      icon: HelpCircle 
    },
    { 
      id: 'logout', 
      label: 'Logout', 
      icon: LogOut,
      action: () => {
        console.log('Logout');
        onClose();
      }
    },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    console.log('Clicked:', item.id); // Debug log
    if (item.action) {
      item.action();
    } else {
      if (onTabChange) {
        onTabChange(item.id);
      } else if (onNavigate) {
        onNavigate(item.id);
      }
      onClose();
    }
  };

  const { theme } = useTheme();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 ${
          theme === 'dark' || theme === 'amoled-black' || theme === 'blue-dark' || theme === 'gray-dark' || theme === 'deep-purple' || theme === 'navy-dark'
            ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
            : 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700'
        } z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full text-white">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white/50">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                <AvatarFallback>MU</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm">Mustafa Ahmed</h3>
                <Badge className="bg-white/20 text-white border-white/30 text-xs mt-1">
                  St.
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* Menu Items - Scrollable */}
          <div className="flex-1 overflow-y-auto py-2">
            {/* Main Navigation */}
            <div className="px-2 mb-4">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white/30 backdrop-blur-sm shadow-lg'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-red-500 text-white h-5 px-2">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            <Separator className="bg-white/20 mx-4 mb-4" />

            {/* Quick Navigation */}
            <div className="px-2 mb-4">
              {quickMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-red-500 text-white h-5 px-2">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            <Separator className="bg-white/20 mx-4 mb-4" />

            {/* Bottom Navigation */}
            <div className="px-2">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-black/10 backdrop-blur-sm">
            <div className="text-xs opacity-70 text-center">
              Al-Nahrain Campus v1.0
            </div>
            <div className="text-xs opacity-70 text-center mt-1">
              © 2025 All rights reserved
            </div>
          </div>
        </div>
      </div>
    </>
  );
}