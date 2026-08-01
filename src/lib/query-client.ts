import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';

// Global error handler for queries
function handleQueryError(error: unknown) {
  const message = error instanceof Error ? error.message : 'An error occurred';
  
  // Don't show toast for specific errors
  if (message.includes('401') || message.includes('Unauthorized')) {
    // Let auth interceptor handle this
    return;
  }

  toast.error(message);
}

// Global error handler for mutations
function handleMutationError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Operation failed';
  toast.error(message);
}

// Create query cache with error handling
const queryCache = new QueryCache({
  onError: handleQueryError,
});

// Create mutation cache with error handling
const mutationCache = new MutationCache({
  onError: handleMutationError,
});

// Create query client with optimized settings
export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Cache time: How long inactive data stays in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry configuration
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch configuration
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: true,
      refetchOnReconnect: true,

      // Network mode
      networkMode: 'online',

      // Error handling
      throwOnError: false,

      // Structural sharing (performance optimization)
      structuralSharing: true,
    },

    mutations: {
      // Retry configuration for mutations
      retry: 1, // Only retry once for mutations
      retryDelay: 1000,

      // Network mode
      networkMode: 'online',

      // Error handling
      throwOnError: false,
    },
  },
});

// Query key factory (centralized query key management)
export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
    tokens: ['auth', 'tokens'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    followers: (id: string) => ['users', id, 'followers'] as const,
    following: (id: string) => ['users', id, 'following'] as const,
  },

  // Tasks
  tasks: {
    all: ['tasks'] as const,
    lists: () => ['tasks', 'list'] as const,
    list: (filters: any) => ['tasks', 'list', filters] as const,
    detail: (id: string) => ['tasks', id] as const,
    stats: () => ['tasks', 'stats'] as const,
  },

  // Posts
  posts: {
    all: ['posts'] as const,
    lists: () => ['posts', 'list'] as const,
    list: (filters: any) => ['posts', 'list', filters] as const,
    detail: (id: string) => ['posts', id] as const,
    comments: (id: string) => ['posts', id, 'comments'] as const,
  },

  // Messages
  messages: {
    all: ['messages'] as const,
    conversations: () => ['messages', 'conversations'] as const,
    conversation: (id: string) => ['messages', 'conversations', id] as const,
    messages: (conversationId: string) => 
      ['messages', 'conversations', conversationId, 'messages'] as const,
  },

  // Books
  books: {
    all: ['books'] as const,
    lists: () => ['books', 'list'] as const,
    list: (filters: any) => ['books', 'list', filters] as const,
    detail: (id: string) => ['books', id] as const,
    progress: (id: string) => ['books', id, 'progress'] as const,
    bookmarks: (id: string) => ['books', id, 'bookmarks'] as const,
    notes: (id: string) => ['books', id, 'notes'] as const,
  },

  // Courses
  courses: {
    all: ['courses'] as const,
    lists: () => ['courses', 'list'] as const,
    list: (filters: any) => ['courses', 'list', filters] as const,
    detail: (id: string) => ['courses', id] as const,
    lessons: (id: string) => ['courses', id, 'lessons'] as const,
    progress: (id: string) => ['courses', id, 'progress'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    unread: () => ['notifications', 'unread'] as const,
  },
};

// Prefetch helper
export async function prefetchQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>
) {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
}

// Invalidate helper
export function invalidateQueries(queryKey: readonly unknown[]) {
  queryClient.invalidateQueries({ queryKey });
}

// Remove query helper
export function removeQuery(queryKey: readonly unknown[]) {
  queryClient.removeQueries({ queryKey });
}

// Set query data helper (for optimistic updates)
export function setQueryData<T>(queryKey: readonly unknown[], data: T) {
  queryClient.setQueryData(queryKey, data);
}

// Get query data helper
export function getQueryData<T>(queryKey: readonly unknown[]): T | undefined {
  return queryClient.getQueryData(queryKey);
}

// Cancel queries helper (useful for cleanup)
export async function cancelQueries(queryKey: readonly unknown[]) {
  await queryClient.cancelQueries({ queryKey });
}

// Persist cache to localStorage (optional)
export function persistQueryCache() {
  if (typeof window === 'undefined') return;

  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();

  const persistedData = queries
    .filter((query) => {
      // Only persist specific query types
      const key = query.queryKey[0] as string;
      return ['tasks', 'books', 'courses'].includes(key);
    })
    .map((query) => ({
      queryKey: query.queryKey,
      data: query.state.data,
      dataUpdatedAt: query.state.dataUpdatedAt,
    }));

  localStorage.setItem('query_cache', JSON.stringify(persistedData));
}

// Restore cache from localStorage (optional)
export function restoreQueryCache() {
  if (typeof window === 'undefined') return;

  const cached = localStorage.getItem('query_cache');
  if (!cached) return;

  try {
    const persistedData = JSON.parse(cached);

    persistedData.forEach((item: any) => {
      queryClient.setQueryData(item.queryKey, item.data);
    });
  } catch (error) {
    console.error('Failed to restore query cache:', error);
    localStorage.removeItem('query_cache');
  }
}

// Clear all cache
export function clearAllCache() {
  queryClient.clear();
  localStorage.removeItem('query_cache');
}

// Dev tools helper
export function logQueryCache() {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'development') return;

  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();

  console.group('🔍 Query Cache');
  queries.forEach((query) => {
    console.log({
      key: query.queryKey,
      state: query.state.status,
      data: query.state.data,
      fetchStatus: query.state.fetchStatus,
    });
  });
  console.groupEnd();
}

// Export configured client
export default queryClient;