import { Heart, MessageCircle, UserPlus, Bell, Calendar, Award, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface NotificationsProps {
  onBack?: () => void;
}

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'announcement' | 'reminder' | 'achievement';
  user?: {
    name: string;
    avatar: string;
    title?: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
  postImage?: string;
}

function getTitleColor(title?: string): string {
  if (!title) return 'text-gray-600';
  if (title.startsWith('Prof.')) return 'text-purple-600';
  if (title.startsWith('Asstprof')) return 'text-blue-600';
  if (title.startsWith('Letr')) return 'text-teal-600';
  if (title.startsWith('T.A')) return 'text-green-600';
  if (title.startsWith('St.')) return 'text-orange-600';
  return 'text-gray-600';
}

export function Notifications({ onBack }: NotificationsProps) {
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'like',
      user: {
        name: 'T.A Doha Ahmed',
        avatar: 'https://images.unsplash.com/photo-1633381182794-01b10764b431?w=400',
        title: 'T.A',
      },
      content: 'liked your post',
      timestamp: '5m ago',
      read: false,
      postImage: 'https://images.unsplash.com/photo-1666281269793-da06484657e8?w=200',
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Letr. Ahmed Hadi',
        avatar: 'https://images.unsplash.com/photo-1654027879796-b9dee8caabb6?w=400',
        title: 'Letr.',
      },
      content: 'commented: "Great analysis on machine learning algorithms!"',
      timestamp: '1h ago',
      read: false,
      postImage: 'https://images.unsplash.com/photo-1762330918491-f4288a62adb8?w=200',
    },
    {
      id: 3,
      type: 'follow',
      user: {
        name: 'St. Fatima Ali',
        avatar: 'https://images.unsplash.com/photo-1570730866446-0569a02dd356?w=400',
        title: 'St.',
      },
      content: 'started following you',
      timestamp: '2h ago',
      read: false,
    },
    {
      id: 4,
      type: 'announcement',
      content: 'Prof. Richard Coleman posted a new announcement in CS301',
      timestamp: '3h ago',
      read: true,
    },
    {
      id: 5,
      type: 'reminder',
      content: 'Assignment "Implement AVL Tree" is due tomorrow',
      timestamp: '5h ago',
      read: true,
    },
    {
      id: 6,
      type: 'achievement',
      content: 'You earned the "Top Student" badge! 🎉',
      timestamp: '1d ago',
      read: true,
    },
    {
      id: 7,
      type: 'like',
      user: {
        name: 'Prof. Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        title: 'Prof.',
      },
      content: 'liked your comment',
      timestamp: '1d ago',
      read: true,
    },
    {
      id: 8,
      type: 'comment',
      user: {
        name: 'Asstprof. Maryam Hussein',
        avatar: 'https://images.unsplash.com/photo-1570730866446-0569a02dd356?w=400',
        title: 'Asstprof.',
      },
      content: 'replied to your comment',
      timestamp: '2d ago',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'reminder':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const todayNotifications = notifications.filter(n => 
    n.timestamp.includes('m ago') || n.timestamp.includes('h ago')
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl">Notifications</h1>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
            Mark all read
          </Button>
        </div>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <div className="bg-white border-b border-gray-200 px-4">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger
              value="today"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-0 pb-3"
            >
              Today
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="flex gap-3">
                    {notification.user ? (
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={notification.user.avatar} />
                          <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          {notification.user ? (
                            <p className="text-sm">
                              <span className="font-medium">{notification.user.name}</span>
                              {notification.user.title && (
                                <span className={`text-xs ml-1 ${getTitleColor(notification.user.title)}`}>
                                  {notification.user.title}
                                </span>
                              )}
                              <span className="text-gray-600"> {notification.content}</span>
                            </p>
                          ) : (
                            <p className="text-sm text-gray-900">{notification.content}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                        </div>
                        {notification.postImage && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 ml-3 flex-shrink-0">
                            <img
                              src={notification.postImage}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      {notification.type === 'follow' && (
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white h-7 px-4 mt-2">
                          Follow Back
                        </Button>
                      )}
                    </div>

                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="divide-y divide-gray-100">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-3 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
                    <div className="flex gap-3">
                      {notification.user && (
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={notification.user.avatar} />
                            <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        {notification.user && (
                          <p className="text-sm">
                            <span className="font-medium">{notification.user.name}</span>
                            <span className="text-gray-600"> {notification.content}</span>
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">All caught up!</p>
                  <p className="text-sm text-gray-400 mt-1">No unread notifications</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="today" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="divide-y divide-gray-100">
              {todayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="flex gap-3">
                    {notification.user ? (
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={notification.user.avatar} />
                          <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                    <div className="flex-1">
                      {notification.user ? (
                        <p className="text-sm">
                          <span className="font-medium">{notification.user.name}</span>
                          <span className="text-gray-600"> {notification.content}</span>
                        </p>
                      ) : (
                        <p className="text-sm">{notification.content}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Notifications;