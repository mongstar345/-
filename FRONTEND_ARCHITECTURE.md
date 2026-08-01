# 🚀 Nahrain Campus - Frontend Architecture Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Tech Stack](#tech-stack)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Performance Optimization](#performance-optimization)
7. [Component Architecture](#component-architecture)
8. [Best Practices](#best-practices)

---

## 🎯 Project Overview

Ultra-modern social media platform for Nahrain University with 4 major systems:
- **Dashboard**: Productivity & Analytics Platform
- **Chat**: Real-time messaging (Telegram-style)
- **Book Reader**: Professional reading experience
- **Courses**: Learning management system

### Goals
- 60fps animations
- < 3s initial load time
- Real-time updates
- Offline-first capabilities
- Production-grade code quality

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardView.tsx         # Main dashboard container
│   │   ├── StatCard.tsx              # Animated stat cards
│   │   ├── ProgressRing.tsx          # Circular progress indicators
│   │   ├── TaskList.tsx              # Virtualized task list
│   │   ├── ActivityHeatmap.tsx       # Activity visualization
│   │   └── ProgressChart.tsx         # Charts using Recharts
│   ├── chat/
│   │   ├── ChatView.tsx              # Main chat container
│   │   ├── ConversationList.tsx      # List of conversations
│   │   ├── ChatWindow.tsx            # Active chat window
│   │   ├── MessageBubble.tsx         # Individual message
│   │   ├── MessageInput.tsx          # Compose message
│   │   ├── TypingIndicator.tsx       # Real-time typing
│   │   └── VoiceRecorder.tsx         # Voice message recorder
│   ├── reader/
│   │   ├── BookReader.tsx            # Main reader view
│   │   ├── ReaderControls.tsx        # Font/theme controls
│   │   ├── BookmarkPanel.tsx         # Bookmarks sidebar
│   │   ├── NotesPanel.tsx            # Notes sidebar
│   │   ├── ProgressBar.tsx           # Reading progress
│   │   └── PageRenderer.tsx          # Optimized page rendering
│   ├── courses/
│   │   ├── CoursesView.tsx           # Course catalog
│   │   ├── CourseCard.tsx            # Course preview card
│   │   ├── CoursePlayer.tsx          # Video player + content
│   │   ├── LessonList.tsx            # Curriculum sidebar
│   │   ├── QuizView.tsx              # Interactive quizzes
│   │   └── CertificateView.tsx       # Certificate display
│   ├── common/
│   │   ├── Layout.tsx                # App layout wrapper
│   │   ├── Header.tsx                # Global header
│   │   ├── BottomNav.tsx             # Mobile navigation
│   │   ├── ErrorBoundary.tsx         # Error handling
│   │   ├── LoadingFallback.tsx       # Loading states
│   │   └── InfiniteScroll.tsx        # Infinite scroll component
│   └── ui/                           # Shadcn components
├── hooks/
│   ├── useTasks.ts                   # Task CRUD operations
│   ├── useChat.ts                    # Chat operations
│   ├── useBooks.ts                   # Book operations
│   ├── useCourses.ts                 # Course operations
│   ├── useAuth.ts                    # Authentication
│   ├── useInfiniteScroll.ts          # Infinite scroll logic
│   ├── useDebounce.ts                # Debouncing
│   ├── useThrottle.ts                # Throttling
│   └── useWebSocket.ts               # WebSocket management
├── stores/
│   ├── auth.store.ts                 # Auth state (Zustand)
│   ├── task.store.ts                 # Tasks state
│   ├── chat.store.ts                 # Chat state
│   ├── book.store.ts                 # Reading state
│   └── course.store.ts               # Course state
├── services/
│   ├── api/
│   │   ├── auth.service.ts           # Auth API calls
│   │   ├── task.service.ts           # Task API calls
│   │   ├── chat.service.ts           # Chat API calls
│   │   ├── book.service.ts           # Book API calls
│   │   └── course.service.ts         # Course API calls
│   ├── websocket.service.ts          # WebSocket management
│   └── storage.service.ts            # Local/session storage
├── lib/
│   ├── api-client.ts                 # Axios instance + interceptors
│   ├── query-client.ts               # React Query setup
│   └── utils.ts                      # Utility functions
├── types/
│   └── index.ts                      # TypeScript definitions
├── config/
│   ├── api.config.ts                 # API configuration
│   └── app.config.ts                 # App constants
└── App.tsx                           # Root component
```

---

## 🛠 Tech Stack

### Core
- **React 18.3+** - UI library with concurrent features
- **TypeScript 5.0+** - Type safety
- **Vite** - Lightning-fast build tool

### State Management
- **Zustand** - Lightweight state management
- **React Query (TanStack Query)** - Server state management
  - Automatic caching
  - Background refetching
  - Optimistic updates
  - Infinite queries for pagination

### Styling
- **Tailwind CSS v4** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Shadcn/UI** - Component library

### Real-time
- **WebSocket** - Real-time chat
- **Socket.io (alternative)** - If needed

### Performance
- **React.lazy + Suspense** - Code splitting
- **react-window / react-virtuoso** - Virtual scrolling
- **workbox** - Service worker for PWA

---

## 🔄 State Management

### Zustand Stores

#### Auth Store (`auth.store.ts`)
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user, token) => void;
  logout: () => void;
}
```

#### Task Store (`task.store.ts`)
```typescript
interface TaskState {
  tasks: Task[];
  stats: TaskStats;
  filters: FilterOptions;
  setTasks: (tasks) => void;
  addTask: (task) => void;
  updateTask: (id, updates) => void;
  togglePin: (id) => void;
}
```

#### Chat Store (`chat.store.ts`)
```typescript
interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  isConnected: boolean;
  addMessage: (message) => void;
  setTyping: (conversationId, userId, isTyping) => void;
}
```

### React Query

#### Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});
```

#### Usage Pattern
```typescript
// Query
const { data, isLoading } = useTasks();

// Mutation with optimistic update
const { mutate } = useUpdateTask();
mutate({ id, updates }, {
  onMutate: async ({ id, updates }) => {
    await queryClient.cancelQueries(['tasks']);
    const previous = queryClient.getQueryData(['tasks']);
    queryClient.setQueryData(['tasks'], (old) => 
      old.map(task => task.id === id ? { ...task, ...updates } : task)
    );
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['tasks'], context.previous);
  },
});
```

---

## 🌐 API Integration

### Axios Configuration

```typescript
// api-client.ts
const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      const refreshToken = localStorage.getItem('refreshToken');
      const { data } = await axios.post('/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', data.accessToken);
      error.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Service Layer Pattern

```typescript
// task.service.ts
export const taskService = {
  getAll: (filters) => apiClient.get('/tasks', { params: filters }),
  getById: (id) => apiClient.get(`/tasks/${id}`),
  create: (data) => apiClient.post('/tasks', data),
  update: (id, data) => apiClient.patch(`/tasks/${id}`, data),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
  complete: (id) => apiClient.post(`/tasks/${id}/complete`),
};
```

---

## ⚡ Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./components/dashboard/DashboardView'));
const Chat = lazy(() => import('./components/chat/ChatView'));
const Reader = lazy(() => import('./components/reader/BookReader'));
const Courses = lazy(() => import('./components/courses/CoursesView'));

// In routes
<Suspense fallback={<LoadingFallback />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/chat" element={<Chat />} />
  </Routes>
</Suspense>
```

### 2. Virtual Scrolling

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function TaskList({ tasks }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated row height
    overscan: 5, // Render 5 extra items
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualRow.size,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <TaskCard task={tasks[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Memoization

```typescript
// useMemo for expensive computations
const filteredTasks = useMemo(() => {
  return tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || task.category === category;
    return matchesSearch && matchesCategory;
  });
}, [tasks, search, category]);

// useCallback for event handlers
const handleTaskUpdate = useCallback((id, updates) => {
  updateTaskMutation.mutate({ id, updates });
}, [updateTaskMutation]);

// React.memo for components
export const TaskCard = memo(({ task, onUpdate }) => {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.task.id === nextProps.task.id && 
         prevProps.task.updatedAt === nextProps.task.updatedAt;
});
```

### 4. Debouncing & Throttling

```typescript
// useDebounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  // API call with debounced value
  fetchTasks({ search: debouncedSearch });
}, [debouncedSearch]);
```

### 5. Image Optimization

```typescript
// Lazy load images with intersection observer
function LazyImage({ src, alt, ...props }) {
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc || '/placeholder.jpg'}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
}
```

### 6. Skeleton Loading

```typescript
function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

// Usage with Suspense
<Suspense fallback={<DashboardSkeleton />}>
  <Dashboard />
</Suspense>
```

---

## 🎨 Component Architecture

### Container/Presentational Pattern

```typescript
// Container Component (Smart)
function TaskListContainer() {
  const { data: tasks, isLoading } = useTasks();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const handleUpdate = (id, updates) => {
    updateTask({ id, updates });
  };

  const handleDelete = (id) => {
    deleteTask(id);
  };

  if (isLoading) return <TaskListSkeleton />;

  return (
    <TaskList
      tasks={tasks}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}

// Presentational Component (Dumb)
interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
```

### Compound Components Pattern

```typescript
// For complex components like Chat
export function ChatWindow({ conversationId }) {
  return (
    <ChatWindow.Container>
      <ChatWindow.Header />
      <ChatWindow.Messages />
      <ChatWindow.Input />
    </ChatWindow.Container>
  );
}

ChatWindow.Container = ({ children }) => (
  <div className="flex flex-col h-full">{children}</div>
);

ChatWindow.Header = () => {
  const { activeConversation } = useChatStore();
  return <div>{/* Header content */}</div>;
};

ChatWindow.Messages = () => {
  const { messages } = useChatStore();
  return <div>{/* Messages list */}</div>;
};

ChatWindow.Input = () => {
  return <div>{/* Input area */}</div>;
};
```

---

## 📱 Best Practices

### 1. Error Handling

```typescript
// Error Boundary
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// API Error handling
try {
  const data = await taskService.create(taskData);
} catch (error) {
  if (error.response?.status === 400) {
    toast.error(error.response.data.message);
  } else if (error.response?.status === 500) {
    toast.error('Server error. Please try again later.');
  } else {
    toast.error('Something went wrong');
  }
}
```

### 2. Accessibility

```typescript
// Keyboard navigation
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  aria-label="Complete task"
  role="button"
  tabIndex={0}
>
  Complete
</button>

// Focus management
const dialogRef = useRef(null);

useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);
```

### 3. Testing Strategy

```typescript
// Unit tests for utilities
describe('formatDate', () => {
  it('formats date correctly', () => {
    expect(formatDate('2024-01-01')).toBe('January 1, 2024');
  });
});

// Integration tests for hooks
describe('useTasks', () => {
  it('fetches tasks successfully', async () => {
    const { result } = renderHook(() => useTasks());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

// E2E tests with Playwright
test('user can create a task', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="create-task-btn"]');
  await page.fill('[name="title"]', 'New Task');
  await page.click('[data-testid="submit-btn"]');
  await expect(page.locator('text=New Task')).toBeVisible();
});
```

### 4. Security

```typescript
// XSS Prevention
import DOMPurify from 'dompurify';

function SafeHTML({ html }) {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// CSRF Token
api.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
```

---

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] API endpoints use production URLs
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics / Mixpanel)
- [ ] Performance monitoring (Lighthouse CI)
- [ ] Bundle size analysis
- [ ] SEO optimization
- [ ] PWA manifest and service worker
- [ ] Security headers configured
- [ ] Rate limiting on API calls
- [ ] User feedback system
- [ ] Monitoring and alerting

---

## 📊 Performance Metrics

Target metrics:
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Bundle size**: < 200KB (gzipped)

---

## 🔗 Useful Resources

- [React Query Docs](https://tanstack.com/query)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

**Last Updated**: March 2, 2026
