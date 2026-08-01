// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverPhotoUrl: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  isVerified: boolean;
  isPrivate: boolean;
  isActive: boolean;
  isBanned: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Post Types
export interface Post {
  id: string;
  userId: string;
  content: string | null;
  mediaUrls: string[] | null;
  mediaTypes: string[] | null;
  location: string | null;
  isArchived: boolean;
  isHidden: boolean;
  commentsDisabled: boolean;
  likesHidden: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  isLiked?: boolean;
  isSaved?: boolean;
}

// Comment Types
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentCommentId: string | null;
  content: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  isLiked?: boolean;
  replies?: Comment[];
}

// Message Types
export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  avatarUrl: string | null;
  lastMessageAt: string | null;
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean; // Added for pinned conversations
  participants?: ConversationParticipant[];
  createdAt: string;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
  leftAt: string | null;
  isMuted: boolean;
  lastReadAt: string | null;
  isOnline?: boolean; // Added for online status
  user?: User;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | 'audio' | 'file' | null;
  replyToId: string | null;
  isRead: boolean;
  readAt: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  replyTo?: Message;
}

// Story Types
export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string | null;
  duration: number;
  viewsCount: number;
  expiresAt: string;
  createdAt: string;
  user?: User;
  isViewed?: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'follow_request' | 'mention' | 'story_view' | 'message' | 'post_share' | 'admin_notice';
  title: string;
  message: string;
  actorId: string | null;
  referenceType: string | null;
  referenceId: string | null;
  actionUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  actor?: User;
}

// Task Types
export interface Task {
  id: string;
  userId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string;
  time: string;
  instructor: string | null;
  avatarUrl: string | null;
  color: 'yellow' | 'blue' | 'green' | 'purple' | 'red' | 'pink' | 'orange' | 'brown';
  category: 'academic' | 'club' | 'personal' | 'library' | 'shared';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  isReminderActive: boolean;
  isDateEditable: boolean;
  isPinned: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completionRate: number;
  dailyCompletionRate: number;
  weeklyCompletionRate: number;
  activeTasks: number;
}

// Book Types
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  coverUrl: string | null;
  fileUrl: string | null;
  totalPages: number;
  language: string;
  category: string;
  publishedDate: string | null;
  isbn: string | null;
  createdAt: string;
}

export interface BookProgress {
  id: string;
  userId: string;
  bookId: string;
  currentPage: number;
  totalPages: number;
  progressPercentage: number;
  lastReadAt: string;
  readingTimeMinutes: number;
  isCompleted: boolean;
  completedAt: string | null;
  book?: Book;
}

export interface BookBookmark {
  id: string;
  userId: string;
  bookId: string;
  page: number;
  note: string | null;
  createdAt: string;
}

export interface BookNote {
  id: string;
  userId: string;
  bookId: string;
  page: number;
  content: string;
  highlightedText: string | null;
  createdAt: string;
  updatedAt: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  instructor: string;
  instructorAvatar: string | null;
  duration: number; // minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  rating: number;
  studentsCount: number;
  lessonsCount: number;
  price: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseLesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number; // minutes
  order: number;
  isPreview: boolean;
  resources: CourseLessonResource[];
  createdAt: string;
}

export interface CourseLessonResource {
  id: string;
  lessonId: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'file';
  url: string;
  size: number | null;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  lastAccessedAt: string;
  isCompleted: boolean;
  completedAt: string | null;
  course?: Course;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}