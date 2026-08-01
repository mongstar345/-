import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, CheckCheck, X, Heart, MessageCircle, UserPlus, Share2, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Notification } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { useVirtualizer } from '@tanstack/react-virtual';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user-1',
    type: 'like',
    title: 'New like on your post',
    message: 'Sarah Johnson liked your post about React performance',
    actorId: 'user-2',
    referenceType: 'post',
    referenceId: 'post-1',
    actionUrl: '/posts/post-1',
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actor: {
      id: 'user-2',
      username: 'sarah.j',
      email: 'sarah@example.com',
      fullName: 'Sarah Johnson',
      avatarUrl: null,
      bio: null,
      coverPhotoUrl: null,
      phone: null,
      dateOfBirth: null,
      gender: null,
      isVerified: true,
      isPrivate: false,
      isActive: true,
      isBanned: false,
      emailVerified: true,
      lastLoginAt: null,
      createdAt: '',
      updatedAt: '',
    },
  },
  {
    id: '2',
    userId: 'user-1',
    type: 'comment',
    title: 'New comment',
    message: 'Ahmed Ali commented on your post',
    actorId: 'user-3',
    referenceType: 'post',
    referenceId: 'post-2',
    actionUrl: '/posts/post-2',
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    userId: 'user-1',
    type: 'follow',
    title: 'New follower',
    message: 'Mohammed started following you',
    actorId: 'user-4',
    referenceType: 'user',
    referenceId: 'user-4',
    actionUrl: '/profile/user-4',
    isRead: true,
    readAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  follow_request: UserPlus,
  mention: MessageCircle,
  story_view: Heart,
  message: MessageCircle,
  post_share: Share2,
  admin_notice: Award,
};

const notificationColors = {
  like: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  comment: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  follow: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  follow_request: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
  mention: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
  story_view: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20',
  message: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
  post_share: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20',
  admin_notice: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
};

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Virtual scrolling for performance
  const virtualizer = useVirtualizer({
    count: filteredNotifications.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  // Mark as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
    ));

    // TODO: Update backend
    // await markNotificationAsRead(id);
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => 
      ({ ...n, isRead: true, readAt: new Date().toISOString() })
    ));

    // TODO: Update backend
    // await markAllNotificationsAsRead();
  };

  // Delete notification
  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));

    // TODO: Delete from backend
    // await deleteNotification(id);
  };

  // Navigate to notification target
  const handleNavigate = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-4 top-16 w-96 max-h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Mark all as read */}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="w-full mt-2"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications list */}
          <div ref={parentRef} className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <Bell className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {filter === 'unread' ? 'You\'re all caught up!' : 'When you get notifications, they\'ll show up here'}
                </p>
              </div>
            ) : (
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const notification = filteredNotifications[virtualRow.index];
                  const Icon = notificationIcons[notification.type];
                  const colorClass = notificationColors[notification.type];

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: virtualRow.index * 0.03 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: virtualRow.size,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className={`group p-4 cursor-pointer transition-all border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        !notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                      }`}
                      onClick={() => handleNavigate(notification)}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                            >
                              <Check className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                          >
                            <X className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>

                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Notification Badge Component for Header
export function NotificationBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount] = useState(2); // Mock - replace with real count

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <NotificationCenter isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
