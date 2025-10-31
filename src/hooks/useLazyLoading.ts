import { useState, useRef, useEffect, useCallback } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  priority?: boolean;
}

interface UseLazyLoadingReturn {
  isInView: boolean;
  isLoaded: boolean;
  hasError: boolean;
  ref: React.RefObject<HTMLDivElement>;
  load: () => void;
  reset: () => void;
}

export const useLazyLoading = ({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  priority = false
}: UseLazyLoadingOptions = {}): UseLazyLoadingReturn => {
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    setIsInView(true);
  }, []);

  const reset = useCallback(() => {
    setIsInView(false);
    setIsLoaded(false);
    setHasError(false);
  }, []);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, priority, isInView]);

  return {
    isInView,
    isLoaded,
    hasError,
    ref,
    load,
    reset
  };
};
