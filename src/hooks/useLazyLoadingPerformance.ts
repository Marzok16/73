import { useState, useEffect, useCallback } from 'react';

interface LazyLoadingMetrics {
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
  totalLoadTime: number;
  networkSpeed: string;
  memoryUsage: number;
}

interface UseLazyLoadingPerformanceReturn {
  metrics: LazyLoadingMetrics;
  recordImageLoad: (loadTime: number, success: boolean) => void;
  resetMetrics: () => void;
  getPerformanceReport: () => string;
}

export const useLazyLoadingPerformance = (): UseLazyLoadingPerformanceReturn => {
  const [metrics, setMetrics] = useState<LazyLoadingMetrics>({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    totalLoadTime: 0,
    networkSpeed: 'unknown',
    memoryUsage: 0
  });

  const [loadTimes, setLoadTimes] = useState<number[]>([]);

  // Monitor network speed
  useEffect(() => {
    const updateNetworkSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const speed = connection.effectiveType || connection.type || 'unknown';
        setMetrics(prev => ({ ...prev, networkSpeed: speed }));
      }
    };

    updateNetworkSpeed();
    window.addEventListener('online', updateNetworkSpeed);
    window.addEventListener('offline', updateNetworkSpeed);

    return () => {
      window.removeEventListener('online', updateNetworkSpeed);
      window.removeEventListener('offline', updateNetworkSpeed);
    };
  }, []);

  // Monitor memory usage
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMemory = memory.usedJSHeapSize / 1024 / 1024; // MB
        setMetrics(prev => ({ ...prev, memoryUsage: usedMemory }));
      }
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000);

    return () => clearInterval(interval);
  }, []);

  const recordImageLoad = useCallback((loadTime: number, success: boolean) => {
    setMetrics(prev => {
      const newTotalImages = prev.totalImages + 1;
      const newLoadedImages = success ? prev.loadedImages + 1 : prev.loadedImages;
      const newFailedImages = success ? prev.failedImages : prev.failedImages + 1;
      const newTotalLoadTime = prev.totalLoadTime + loadTime;
      const newAverageLoadTime = newTotalLoadTime / newTotalImages;

      return {
        ...prev,
        totalImages: newTotalImages,
        loadedImages: newLoadedImages,
        failedImages: newFailedImages,
        totalLoadTime: newTotalLoadTime,
        averageLoadTime: newAverageLoadTime
      };
    });

    setLoadTimes(prev => [...prev, loadTime]);
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0,
      averageLoadTime: 0,
      totalLoadTime: 0,
      networkSpeed: 'unknown',
      memoryUsage: 0
    });
    setLoadTimes([]);
  }, []);

  const getPerformanceReport = useCallback(() => {
    const successRate = metrics.totalImages > 0 
      ? ((metrics.loadedImages / metrics.totalImages) * 100).toFixed(1)
      : '0';
    
    const avgLoadTime = metrics.averageLoadTime.toFixed(2);
    const memoryUsage = metrics.memoryUsage.toFixed(2);
    
    return `
      تقرير أداء التحميل الكسول:
      - إجمالي الصور: ${metrics.totalImages}
      - الصور المحملة: ${metrics.loadedImages}
      - الصور الفاشلة: ${metrics.failedImages}
      - معدل النجاح: ${successRate}%
      - متوسط وقت التحميل: ${avgLoadTime}ms
      - سرعة الشبكة: ${metrics.networkSpeed}
      - استخدام الذاكرة: ${memoryUsage}MB
    `;
  }, [metrics]);

  return {
    metrics,
    recordImageLoad,
    resetMetrics,
    getPerformanceReport
  };
};
