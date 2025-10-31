import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2, Image as ImageIcon } from "lucide-react";

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  thumbnailSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  priority?: boolean; // For above-the-fold images
  quality?: number; // For future image optimization
  sizes?: string; // For responsive images
}

const OptimizedLazyImage = ({ 
  src, 
  alt, 
  className = "", 
  style = {},
  placeholder,
  thumbnailSrc,
  onLoad,
  onError,
  loadingComponent,
  errorComponent,
  priority = false,
  quality = 75,
  sizes
}: OptimizedLazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [hasError, setHasError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fullImgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip intersection observer if priority image

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading 100px before the image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Preload full-size image after thumbnail loads
  useEffect(() => {
    if (isInView && thumbnailSrc && !showFullImage) {
      const fullImg = new Image();
      fullImg.onload = () => {
        setShowFullImage(true);
        setIsLoaded(true);
        onLoad?.();
      };
      fullImg.onerror = () => {
        setHasError(true);
        onError?.();
      };
      fullImg.src = src;
    }
  }, [isInView, thumbnailSrc, showFullImage, src, onLoad, onError]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Custom loading component
  const renderLoading = () => {
    if (loadingComponent) return loadingComponent;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  };

  // Custom error component
  const renderError = () => {
    if (errorComponent) return errorComponent;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <div className="text-center text-muted-foreground">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-xs">فشل في تحميل الصورة</p>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Placeholder or loading state */}
      {!isLoaded && !hasError && renderLoading()}

      {/* Error state */}
      {hasError && renderError()}

      {/* Thumbnail image (if provided) */}
      {isInView && thumbnailSrc && !showFullImage && (
        <img
          src={thumbnailSrc}
          alt={alt}
          className="w-full h-full object-cover blur-sm scale-110 transition-all duration-300"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
        />
      )}

      {/* Full resolution image */}
      {isInView && (
        <img
          ref={fullImgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${
            thumbnailSrc 
              ? showFullImage 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-110"
              : isLoaded 
                ? "opacity-100" 
                : "opacity-0"
          }`}
          onLoad={thumbnailSrc ? undefined : handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          style={{
            imageRendering: quality < 50 ? 'pixelated' : 'auto',
          }}
        />
      )}
    </div>
  );
};

export default OptimizedLazyImage;