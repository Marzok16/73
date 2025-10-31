import React, { ReactNode } from 'react';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  priority?: boolean;
  minHeight?: string;
  showSkeleton?: boolean;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  style = {},
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  priority = false,
  minHeight = '200px',
  showSkeleton = true
}) => {
  const { isInView, ref } = useLazyLoading({
    threshold,
    rootMargin,
    triggerOnce: true,
    priority
  });

  const renderSkeleton = () => (
    <div 
      className="animate-pulse"
      style={{ minHeight }}
    >
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = () => {
    if (placeholder) return placeholder;
    
    if (showSkeleton) return renderSkeleton();
    
    return (
      <div 
        className="flex items-center justify-center bg-muted"
        style={{ minHeight }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={className}
      style={style}
    >
      {isInView ? children : renderPlaceholder()}
    </div>
  );
};

export default LazySection;
