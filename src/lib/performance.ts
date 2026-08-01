// ==========================================
// PERFORMANCE UTILITIES
// Enterprise-grade optimization helpers
// ==========================================

import { useEffect, useRef, useState, useCallback, DependencyList } from 'react';

// ========================================
// DEBOUNCE HOOK
// ========================================
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ========================================
// THROTTLE HOOK
// ========================================
export function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}

// ========================================
// INTERSECTION OBSERVER HOOK
// ========================================
interface UseIntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersection(
  options: UseIntersectionOptions = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && freezeOnceVisible) {
          frozen.current = true;
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [elementRef, isIntersecting];
}

// ========================================
// REQUEST ANIMATION FRAME HOOK
// ========================================
export function useAnimationFrame(callback: (time: number) => void, deps: DependencyList = []) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        callback(time - previousTimeRef.current);
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
  }, [animate, ...deps]);
}

// ========================================
// IDLE CALLBACK HOOK
// ========================================
export function useIdleCallback(callback: () => void, deps: DependencyList = []) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(callback);
      return () => cancelIdleCallback(handle);
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      const timeout = setTimeout(callback, 1);
      return () => clearTimeout(timeout);
    }
  }, deps);
}

// ========================================
// LAZY IMAGE LOADING
// ========================================
export function useLazyImage(src: string, placeholder: string = '') {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, isIntersecting] = useIntersection({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (isIntersecting && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setImageSrc(src);
    }
  }, [isIntersecting, src]);

  return { imageRef, imageSrc };
}

// ========================================
// PREFETCH ROUTE
// ========================================
export function prefetchRoute(routePath: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  document.head.appendChild(link);

  return () => {
    document.head.removeChild(link);
  };
}

// ========================================
// MEASURE PERFORMANCE
// ========================================
export function measurePerformance(name: string) {
  const start = performance.now();

  return {
    end: () => {
      const duration = performance.now() - start;
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      return duration;
    },
  };
}

// ========================================
// MEMOIZED CALCULATION
// ========================================
export function useMemoizedCalculation<T>(
  calculation: () => T,
  deps: DependencyList,
  expensive: boolean = true
): T {
  const memoizedValue = useRef<T>();
  const depsRef = useRef<DependencyList>();

  if (!expensive) {
    return calculation();
  }

  const depsChanged =
    !depsRef.current || deps.some((dep, i) => !Object.is(dep, depsRef.current![i]));

  if (depsChanged) {
    memoizedValue.current = calculation();
    depsRef.current = deps;
  }

  return memoizedValue.current as T;
}

// ========================================
// VIRTUALIZATION HELPER
// ========================================
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
) {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const end = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return { start, end };
}

// ========================================
// BATCH STATE UPDATES
// ========================================
export function useBatchedUpdates<T>(initialState: T, delay: number = 100) {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<Partial<T>[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((update: Partial<T>) => {
    pendingUpdates.current.push(update);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState((prev) => {
        const merged = pendingUpdates.current.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          prev
        );
        pendingUpdates.current = [];
        return merged;
      });
    }, delay);
  }, [delay]);

  return [state, batchUpdate] as const;
}

// ========================================
// WEB VITALS TRACKING
// ========================================
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const sendToAnalytics = (metric: any) => {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value);
      
      // Send to your analytics service
      // Example: gtag('event', metric.name, { value: metric.value });
    };

    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });
}

// ========================================
// HARDWARE ACCELERATION HELPER
// ========================================
export function enableHardwareAcceleration(element: HTMLElement) {
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
}

// ========================================
// SMOOTH SCROLL TO
// ========================================
export function smoothScrollTo(
  element: HTMLElement,
  target: number,
  duration: number = 300
) {
  const start = element.scrollTop;
  const change = target - start;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeInOutCubic)
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    element.scrollTop = start + change * eased;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
}

// ========================================
// PREVENT LAYOUT THRASHING
// ========================================
export class LayoutBatcher {
  private readCallbacks: (() => void)[] = [];
  private writeCallbacks: (() => void)[] = [];
  private scheduled = false;

  read(callback: () => void) {
    this.readCallbacks.push(callback);
    this.schedule();
  }

  write(callback: () => void) {
    this.writeCallbacks.push(callback);
    this.schedule();
  }

  private schedule() {
    if (this.scheduled) return;
    this.scheduled = true;

    requestAnimationFrame(() => {
      // Execute all reads first
      this.readCallbacks.forEach((callback) => callback());
      this.readCallbacks = [];

      // Then execute all writes
      this.writeCallbacks.forEach((callback) => callback());
      this.writeCallbacks = [];

      this.scheduled = false;
    });
  }
}

export const layoutBatcher = new LayoutBatcher();

// ========================================
// EXPORT ALL
// ========================================
export default {
  useDebounce,
  useThrottle,
  useIntersection,
  useAnimationFrame,
  useIdleCallback,
  useLazyImage,
  prefetchRoute,
  measurePerformance,
  useMemoizedCalculation,
  calculateVisibleRange,
  useBatchedUpdates,
  trackWebVitals,
  enableHardwareAcceleration,
  smoothScrollTo,
  layoutBatcher,
};
