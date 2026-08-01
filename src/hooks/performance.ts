import { useEffect, useRef, useState, useCallback } from 'react';

// ============================================
// DEBOUNCE HOOK
// ============================================
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// THROTTLE HOOK
// ============================================
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

// ============================================
// INTERSECTION OBSERVER HOOK (Lazy Loading)
// ============================================
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [options, hasIntersected]);

  return { targetRef, isIntersecting, hasIntersected };
}

// ============================================
// REQUEST ANIMATION FRAME HOOK
// ============================================
export function useAnimationFrame(
  callback: (deltaTime: number) => void,
  dependencies: any[] = []
) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, ...dependencies]);
}

// ============================================
// IDLE CALLBACK HOOK (Low Priority Tasks)
// ============================================
export function useIdleCallback(
  callback: () => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(callback, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const id = setTimeout(callback, 1);
      return () => clearTimeout(id);
    }
  }, dependencies);
}

// ============================================
// PREFETCH HOOK (Preload Next Route)
// ============================================
export function usePrefetch(
  url: string,
  options: { timeout?: number; enabled?: boolean } = {}
) {
  const { timeout = 2000, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const timeoutId = setTimeout(() => {
      // Prefetch next route
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [url, timeout, enabled]);
}

// ============================================
// MEDIA QUERY HOOK
// ============================================
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

// ============================================
// ONLINE STATUS HOOK
// ============================================
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// ============================================
// KEYBOARD SHORTCUT HOOK
// ============================================
export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  options: { preventDefault?: boolean } = {}
) {
  const { preventDefault = true } = options;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const pressedKeys = [
        event.ctrlKey && 'ctrl',
        event.shiftKey && 'shift',
        event.altKey && 'alt',
        event.metaKey && 'meta',
        event.key.toLowerCase(),
      ].filter(Boolean) as string[];

      const isMatch = keys.every((key) =>
        pressedKeys.includes(key.toLowerCase())
      );

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keys, callback, preventDefault]);
}

// ============================================
// COPY TO CLIPBOARD HOOK
// ============================================
export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };

  return { copy, copiedText };
}

// ============================================
// PERFORMANCE MONITOR
// ============================================
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  start(label: string) {
    this.marks.set(label, performance.now());
  }

  end(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`No start mark found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measure(label: string, callback: () => void) {
    this.start(label);
    callback();
    return this.end(label);
  }

  async measureAsync<T>(
    label: string,
    callback: () => Promise<T>
  ): Promise<T> {
    this.start(label);
    const result = await callback();
    this.end(label);
    return result;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// ============================================
// IMAGE PRELOADER
// ============================================
export function preloadImages(urls: string[]): Promise<void[]> {
  const promises = urls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  });

  return Promise.all(promises);
}

// ============================================
// BUNDLE SIZE ANALYZER
// ============================================
export function logBundleSize() {
  if (process.env.NODE_ENV === 'production') {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    
    scripts.forEach((script) => {
      const src = (script as HTMLScriptElement).src;
      if (src) {
        fetch(src, { method: 'HEAD' })
          .then((response) => {
            const size = response.headers.get('content-length');
            if (size) {
              const sizeKB = (parseInt(size) / 1024).toFixed(2);
              console.log(`📦 ${src.split('/').pop()}: ${sizeKB} KB`);
            }
          })
          .catch(() => {});
      }
    });
  }
}