# 🚀 Nahrain Campus - Complete Production Guide

## 📋 Architecture Overview

### Technology Stack
```
Frontend:
- React 18.3+ (Concurrent Mode)
- TypeScript 5.0+
- Vite (Build tool)
- Tailwind CSS v4
- Framer Motion (Animations)
- Zustand (State management)
- React Query (Server state)
- WebSocket (Real-time)
- React Virtual (Virtual scrolling)
- Recharts (Data visualization)

Performance:
- Code splitting (React.lazy)
- Virtual scrolling (@tanstack/react-virtual)
- Memoization (React.memo, useMemo, useCallback)
- Debouncing & Throttling
- Optimistic updates
- Request animation frame
- Hardware acceleration

Testing:
- Vitest (Unit tests)
- React Testing Library
- Playwright (E2E)
- MSW (API mocking)
```

---

## 📁 Complete Folder Structure

```
nahrain-campus/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardView.tsx           ✅ Main container
│   │   │   ├── StatCard.tsx                ✅ Animated stats
│   │   │   ├── ProgressRing.tsx            ✅ SVG + RAF animation
│   │   │   ├── TaskList.tsx                ✅ Virtual scrolling
│   │   │   ├── ActivityHeatmap.tsx         ✅ Activity viz
│   │   │   └── ProgressChart.tsx           ✅ Recharts integration
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatView.tsx                ✅ Main container
│   │   │   ├── ConversationList.tsx        ⏳ To complete
│   │   │   ├── MessageBubble.tsx           ✅ Telegram-style
│   │   │   ├── MessageInput.tsx            ⏳ To complete
│   │   │   ├── TypingIndicator.tsx         ⏳ To complete
│   │   │   └── VoiceRecorder.tsx           ⏳ To complete
│   │   │
│   │   ├── reader/
│   │   │   ├── BookReader.tsx              ✅ Main reader
│   │   │   ├── ReaderSettings.tsx          ⏳ Settings panel
│   │   │   ├── BookmarkPanel.tsx           ⏳ Bookmarks sidebar
│   │   │   ├── NotesPanel.tsx              ⏳ Notes sidebar
│   │   │   └── HighlightMenu.tsx           ⏳ Context menu
│   │   │
│   │   ├── courses/
│   │   │   ├── CoursesView.tsx             ⏳ Catalog
│   │   │   ├── CourseCard.tsx              ⏳ Preview card
│   │   │   ├── CoursePlayer.tsx            ⏳ Video player
│   │   │   ├── LessonList.tsx              ⏳ Curriculum
│   │   │   └── QuizView.tsx                ⏳ Quizzes
│   │   │
│   │   ├── common/
│   │   │   ├── Layout.tsx                  ⏳ App wrapper
│   │   │   ├── ErrorBoundary.tsx           ⏳ Error handling
│   │   │   ├── CommandPalette.tsx          ⏳ Ctrl+K menu
│   │   │   └── NotificationCenter.tsx      ⏳ Global notifications
│   │   │
│   │   └── ui/                             ✅ Shadcn components
│   │
│   ├── design-system/
│   │   ├── tokens.ts                       ✅ Design tokens
│   │   └── ThemeProvider.tsx               ✅ Theme system
│   │
│   ├── hooks/
│   │   ├── useTasks.ts                     ✅ Task operations
│   │   ├── useChat.ts                      ⏳ Chat operations
│   │   ├── useBooks.ts                     ⏳ Book operations
│   │   ├── useCourses.ts                   ⏳ Course operations
│   │   ├── useDebounce.ts                  ⏳ Debouncing
│   │   ├── useThrottle.ts                  ⏳ Throttling
│   │   ├── useIntersection.ts              ⏳ Intersection observer
│   │   └── useKeyboard.ts                  ⏳ Keyboard shortcuts
│   │
│   ├── stores/
│   │   ├── auth.store.ts                   ✅ Auth state
│   │   ├── task.store.ts                   ✅ Task state
│   │   ├── chat.store.ts                   ✅ Chat state
│   │   ├── book.store.ts                   ⏳ Reading state
│   │   └── course.store.ts                 ⏳ Course state
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── auth.service.ts             ⏳ Auth API
│   │   │   ├── task.service.ts             ⏳ Task API
│   │   │   ├── chat.service.ts             ⏳ Chat API
│   │   │   ├── book.service.ts             ⏳ Book API
│   │   │   └── course.service.ts           ⏳ Course API
│   │   ├── websocket.service.ts            ✅ WebSocket
│   │   └── analytics.service.ts            ⏳ Analytics tracking
│   │
│   ├── lib/
│   │   ├── api-client.ts                   ✅ Axios + interceptors
│   │   ├── query-client.ts                 ⏳ React Query config
│   │   └── utils.ts                        ⏳ Utilities
│   │
│   ├── types/
│   │   └── index.ts                        ✅ TypeScript types
│   │
│   ├── config/
│   │   ├── api.config.ts                   ✅ API configuration
│   │   └── app.config.ts                   ⏳ App constants
│   │
│   ├── App.tsx                             ⏳ Root component
│   └── main.tsx                            ⏳ Entry point
│
├── public/
│   ├── manifest.json                       ⏳ PWA manifest
│   └── service-worker.js                   ⏳ Service worker
│
├── tests/
│   ├── unit/                               ⏳ Unit tests
│   ├── integration/                        ⏳ Integration tests
│   └── e2e/                                ⏳ E2E tests
│
└── docs/
    ├── ARCHITECTURE.md                     ✅ This file
    ├── API.md                              ⏳ API documentation
    ├── PERFORMANCE.md                      ⏳ Performance guide
    └── DEPLOYMENT.md                       ⏳ Deployment guide
```

---

## 🎯 Performance Optimization Strategy

### 1. Code Splitting Strategy
```typescript
// Route-level splitting
const Dashboard = lazy(() => import('./components/dashboard/DashboardView'));
const Chat = lazy(() => import('./components/chat/ChatView'));
const Reader = lazy(() => import('./components/reader/BookReader'));
const Courses = lazy(() => import('./components/courses/CoursesView'));

// Component-level splitting (for heavy components)
const ProgressChart = lazy(() => import('./components/dashboard/ProgressChart'));
const VideoPlayer = lazy(() => import('./components/courses/VideoPlayer'));
```

### 2. Memoization Best Practices
```typescript
// ✅ DO: Memoize expensive computations
const filteredTasks = useMemo(() => {
  return tasks.filter(/* complex logic */);
}, [tasks, filters]);

// ✅ DO: Memoize callbacks passed to children
const handleUpdate = useCallback((id, updates) => {
  updateTask({ id, updates });
}, [updateTask]);

// ✅ DO: Memoize components that render frequently
export const TaskCard = memo(TaskCard, (prev, next) => {
  return prev.task.updatedAt === next.task.updatedAt;
});

// ❌ DON'T: Over-memoize simple operations
const sum = useMemo(() => a + b, [a, b]); // Overkill!
```

### 3. Virtual Scrolling Implementation
```typescript
// For lists > 50 items
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 120,
  overscan: 5, // Render 5 extra items
});
```

### 4. Debouncing & Throttling
```typescript
// Debounce for search inputs
const debouncedSearch = useDebounce(searchQuery, 300);

// Throttle for scroll events
const throttledScroll = useThrottle(handleScroll, 100);
```

### 5. Hardware Acceleration
```css
/* Enable GPU acceleration for animations */
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}

/* Use transform instead of top/left */
.slide-in {
  transform: translateX(0);
  /* NOT: left: 0; */
}
```

### 6. Image Optimization
```typescript
// Lazy load images
<img
  loading="lazy"
  src={src}
  srcSet={`${src}?w=400 400w, ${src}?w=800 800w`}
  sizes="(max-width: 640px) 400px, 800px"
/>

// Use WebP with fallback
<picture>
  <source srcSet={`${src}.webp`} type="image/webp" />
  <img src={`${src}.jpg`} alt={alt} />
</picture>
```

---

## ⚡ Performance Metrics & Targets

### Lighthouse Scores (Target: 95+)
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Custom Metrics
- Initial JS bundle: < 200KB (gzipped)
- Route chunk: < 50KB (gzipped)
- API response time: < 500ms
- WebSocket latency: < 100ms
- 60fps animations

---

## 🔒 Security Best Practices

### 1. XSS Prevention
```typescript
import DOMPurify from 'dompurify';

// Sanitize user content
const clean = DOMPurify.sanitize(userInput);
```

### 2. CSRF Protection
```typescript
// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
```

### 3. Secure Storage
```typescript
// Never store sensitive data in localStorage
// Use httpOnly cookies for tokens
// Use sessionStorage for temporary data
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
```typescript
describe('useTasks', () => {
  it('fetches tasks successfully', async () => {
    const { result } = renderHook(() => useTasks());
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### Integration Tests (React Testing Library)
```typescript
test('user can create a task', async () => {
  render(<DashboardView />);
  
  await userEvent.click(screen.getByRole('button', { name: /create task/i }));
  await userEvent.type(screen.getByLabelText(/title/i), 'New Task');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(await screen.findByText('New Task')).toBeInTheDocument();
});
```

### E2E Tests (Playwright)
```typescript
test('complete user flow', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="create-task"]');
  await page.fill('input[name="title"]', 'Test Task');
  await page.click('[data-testid="submit"]');
  await expect(page.locator('text=Test Task')).toBeVisible();
});
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Run type check (`tsc --noEmit`)
- [ ] Run linter (`eslint .`)
- [ ] Run tests (`vitest run`)
- [ ] Build production (`npm run build`)
- [ ] Analyze bundle (`npm run analyze`)
- [ ] Check bundle size (< 200KB gzipped)
- [ ] Test production build locally
- [ ] Lighthouse audit (95+ score)

### Environment Variables
```bash
# .env.production
VITE_API_URL=https://api.nahrain.edu
VITE_WS_URL=wss://api.nahrain.edu
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GA_ID=your_ga_id
```

### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'ui-vendor': ['framer-motion', 'recharts'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### CDN & Caching
```nginx
# nginx.conf
location /assets/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location / {
  try_files $uri $uri/ /index.html;
  add_header Cache-Control "no-cache";
}
```

---

## 📊 Bundle Size Budget

```
Target bundle sizes:
- Initial JS: < 200KB (gzipped)
- Dashboard chunk: < 50KB
- Chat chunk: < 60KB
- Reader chunk: < 40KB
- Courses chunk: < 55KB
- Vendor chunks: < 150KB total

Total initial load: < 350KB
```

---

## 🔄 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - run: npm run lighthouse
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
      - run: npm run deploy
```

---

## 📈 Monitoring & Analytics

### Error Tracking (Sentry)
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

### Performance Monitoring
```typescript
// Track custom metrics
performance.mark('dashboard-start');
// ... render dashboard
performance.mark('dashboard-end');
performance.measure('dashboard', 'dashboard-start', 'dashboard-end');
```

### Analytics Events
```typescript
// Track user actions
analytics.track('task_created', {
  category: task.category,
  priority: task.priority,
});
```

---

## 🎓 Best Practices Summary

### Do's ✅
- Use TypeScript strictly (no `any`)
- Implement error boundaries
- Use Suspense for code splitting
- Memoize expensive operations
- Use virtual scrolling for long lists
- Debounce user inputs
- Implement optimistic updates
- Use semantic HTML
- Follow accessibility guidelines
- Write tests for critical paths

### Don'ts ❌
- Don't store sensitive data in localStorage
- Don't use inline styles excessively
- Don't ignore console warnings
- Don't skip loading states
- Don't block the main thread
- Don't use uncontrolled components
- Don't mutate state directly
- Don't skip error handling

---

## 📚 Additional Resources

- [React Query Best Practices](https://tanstack.com/query/latest)
- [Zustand Patterns](https://zustand-demo.pmnd.rs/)
- [Framer Motion Cookbook](https://www.framer.com/motion/)
- [Web Vitals](https://web.dev/vitals/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Status**: 🟢 Production Ready (Pending completion of remaining components)

**Last Updated**: March 2, 2026
