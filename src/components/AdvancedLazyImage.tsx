import React, { useState, useCallback } from 'react';
import { Loader2, Image as ImageIcon, Wifi, WifiOff } from 'lucide-react';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { Card } from '@/components/ui/card';

interface AdvancedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  thumbnailSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  showProgress?: boolean;
  blurDataURL?: string;
  aspectRatio?: string;
  fallbackSrc?: string;
  retryCount?: number;
  retryDelay?: number;
}

const AdvancedLazyImage: React.FC<AdvancedLazyImageProps> = ({
  src,
  alt,
  className = '',
  style = {},
  placeholder,
  thumbnailSrc,
  onLoad,
  onError,
  priority = false,
  quality = 75,
  sizes,
  showProgress = false,
  blurDataURL,
  aspectRatio,
  fallbackSrc,
  retryCount = 3,
  retryDelay = 1000
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentRetry, setCurrentRetry] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  const { isInView, ref } = useLazyLoading({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
    priority
  });

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    setLoadProgress(100);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (currentRetry < retryCount && !isRetrying) {
      setIsRetrying(true);
      setCurrentRetry(prev => prev + 1);
      
      setTimeout(() => {
        setCurrentSrc(fallbackSrc || src);
        setIsRetrying(false);
      }, retryDelay * currentRetry);
    } else {
      setHasError(true);
      onError?.();
    }
  }, [currentRetry, retryCount, isRetrying, retryDelay, fallbackSrc, src, onError]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setCurrentRetry(0);
    setCurrentSrc(src);
    setIsLoaded(false);
  }, [src]);

  // Simulate loading progress
  React.useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isInView, isLoaded, hasError]);

  const renderLoadingState = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-muted">
      <div className="text-center">
        {showProgress && (
          <div className="w-16 h-16 mx-auto mb-2 relative">
            <div className="w-16 h-16 border-4 border-muted-foreground/20 rounded-full"></div>
            <div 
              className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin"
              style={{ 
                transform: `rotate(${loadProgress * 3.6}deg)`,
                transition: 'transform 0.3s ease'
              }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {Math.round(loadProgress)}%
            </span>
          </div>
        )}
        {!showProgress && <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />}
        <p className="text-xs text-muted-foreground mt-1">جاري التحميل...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-muted">
      <div className="text-center text-muted-foreground">
        <WifiOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs mb-2">فشل في تحميل الصورة</p>
        {currentRetry < retryCount && (
          <button
            onClick={handleRetry}
            className="text-xs text-primary hover:underline"
          >
            إعادة المحاولة ({currentRetry}/{retryCount})
          </button>
        )}
      </div>
    </div>
  );

  const renderPlaceholder = () => {
    if (blurDataURL) {
      return (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
        />
      );
    }
    
    if (placeholder) {
      return (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      );
    }
    
    return null;
  };

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        aspectRatio: aspectRatio || 'auto'
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && renderPlaceholder()}

      {/* Loading state */}
      {isInView && !isLoaded && !hasError && renderLoadingState()}

      {/* Error state */}
      {hasError && renderErrorState()}

      {/* Thumbnail (if provided) */}
      {isInView && thumbnailSrc && !isLoaded && !hasError && (
        <img
          src={thumbnailSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-all duration-300"
          loading="lazy"
        />
      )}

      {/* Main image */}
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            thumbnailSrc 
              ? isLoaded 
                ? 'opacity-100 scale-100 filter-none' 
                : 'opacity-0 scale-110 filter-blur-sm'
              : isLoaded 
                ? 'opacity-100' 
                : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          style={{
            imageRendering: quality < 50 ? 'pixelated' : 'auto',
          }}
        />
      )}

      {/* Network status indicator */}
      {isInView && (
        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-black/50 rounded-full p-1">
            {navigator.onLine ? (
              <Wifi className="w-3 h-3 text-green-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-400" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedLazyImage;
