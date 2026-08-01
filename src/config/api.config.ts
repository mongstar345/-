// API Configuration
export const API_CONFIG = {
  BASE_URL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3000/api',
  WS_URL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WS_URL) || 'ws://localhost:3000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Users
  USERS: {
    BASE: '/users',
    PROFILE: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    FOLLOWERS: (id: string) => `/users/${id}/followers`,
    FOLLOWING: (id: string) => `/users/${id}/following`,
    SEARCH: '/users/search',
  },

  // Posts
  POSTS: {
    BASE: '/posts',
    BY_ID: (id: string) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    UNLIKE: (id: string) => `/posts/${id}/unlike`,
    COMMENTS: (id: string) => `/posts/${id}/comments`,
    FEED: '/posts/feed',
  },

  // Comments
  COMMENTS: {
    BASE: '/comments',
    BY_ID: (id: string) => `/comments/${id}`,
    CREATE: '/comments',
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
    LIKE: (id: string) => `/comments/${id}/like`,
  },

  // Messages
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION: (id: string) => `/messages/conversations/${id}`,
    MESSAGES: (conversationId: string) => `/messages/conversations/${conversationId}/messages`,
    SEND: '/messages/send',
    MARK_READ: (id: string) => `/messages/${id}/read`,
  },

  // Stories
  STORIES: {
    BASE: '/stories',
    BY_ID: (id: string) => `/stories/${id}`,
    CREATE: '/stories',
    DELETE: (id: string) => `/stories/${id}`,
    VIEW: (id: string) => `/stories/${id}/view`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },

  // Books (New)
  BOOKS: {
    BASE: '/books',
    BY_ID: (id: string) => `/books/${id}`,
    MY_BOOKS: '/books/my-library',
    PROGRESS: (id: string) => `/books/${id}/progress`,
    UPDATE_PROGRESS: (id: string) => `/books/${id}/progress`,
    BOOKMARKS: (id: string) => `/books/${id}/bookmarks`,
    NOTES: (id: string) => `/books/${id}/notes`,
  },

  // Courses (New)
  COURSES: {
    BASE: '/courses',
    BY_ID: (id: string) => `/courses/${id}`,
    ENROLLED: '/courses/enrolled',
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    PROGRESS: (id: string) => `/courses/${id}/progress`,
    LESSON: (courseId: string, lessonId: string) => `/courses/${courseId}/lessons/${lessonId}`,
    COMPLETE_LESSON: (courseId: string, lessonId: string) => 
      `/courses/${courseId}/lessons/${lessonId}/complete`,
  },

  // Tasks/Dashboard (New)
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    CREATE: '/tasks',
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    COMPLETE: (id: string) => `/tasks/${id}/complete`,
    STATS: '/tasks/stats',
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'nahrain_access_token',
  REFRESH_TOKEN: 'nahrain_refresh_token',
  USER: 'nahrain_user',
  THEME: 'nahrain_theme',
  LANGUAGE: 'nahrain_language',
};