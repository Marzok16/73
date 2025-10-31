import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2,
  Minimize2,
  Move
} from "lucide-react";
import "../styles/photo-dialog.css";

interface EnhancedPhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photo: any;
  onDownload: (imageUrl: string, fileName: string) => void;
}

const EnhancedPhotoDialog = ({ 
  isOpen, 
  onClose, 
  photo, 
  onDownload 
}: EnhancedPhotoDialogProps) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
      setIsFullscreen(false);
    }
  }, [isOpen, photo]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const calculatedZoom = Math.max(prev / 1.5, 1); // Max zoom out is now 100%
      // Reset position to center when zoom reaches 100%
      if (calculatedZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return calculatedZoom;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  // Rotation function
  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => {
      const calculatedZoom = Math.max(1, Math.min(5, prev * delta)); // Max zoom out is now 100%
      // Reset position to center when zoom reaches 100%
      if (calculatedZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return calculatedZoom;
    });
  }, []);

  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Limit drag bounds based on zoom level
    const container = containerRef.current;
    const image = imageRef.current;
    
    if (container && image) {
      const containerRect = container.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      
      const maxX = Math.max(0, (imageRect.width - containerRect.width) / 2);
      const maxY = Math.max(0, (imageRect.height - containerRect.height) / 2);
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    }
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch support for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  }, [zoom, position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1 || zoom <= 1) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart, zoom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleResetZoom();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotate();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose, handleZoomIn, handleZoomOut, handleResetZoom, handleRotate, toggleFullscreen]);

  if (!photo) return null;

  const imageStyle: React.CSSProperties = {
    transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
    willChange: 'transform',
    transformStyle: 'preserve-3d' as const,
    backfaceVisibility: 'hidden' as const,
    imageRendering: 'auto' as const,
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className={`p-0 overflow-hidden border-0 bg-black/95 backdrop-blur-sm dialog-backdrop gpu-accelerated ${
          isFullscreen 
            ? 'max-w-none max-h-none w-screen h-screen rounded-none !left-0 !top-0 !transform-none' 
            : 'max-w-6xl w-[90vw] h-[90vh] rounded-lg !left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%]'
        }`}
        onInteractOutside={() => onClose()}
        onEscapeKeyDown={() => onClose()}
      >
        {/* Hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">
          {photo.title_ar || photo.title || 'صورة تذكارية'}
        </DialogTitle>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="flex items-start justify-between text-white p-4">
            {/* Title Section - Left Side */}
            <div className="flex-1 pr-4 max-w-md">
              <h2 className="text-xl font-bold mb-1 leading-tight">
                {photo.title_ar || photo.title}
              </h2>
              <p className="text-white/80 text-sm leading-relaxed line-clamp-2 mb-2">
                {photo.description_ar || photo.description}
              </p>
              
              {/* Category Badge */}
              <Badge 
                className="text-xs px-2 py-1"
                style={{ 
                  backgroundColor: photo.categoryData?.color || '#3B82F6',
                  color: 'white'
                }}
              >
                {photo.category_name || photo.category}
              </Badge>
            </div>

            {/* Control Buttons - Right Side */}
            <div className="flex items-start gap-2 flex-shrink-0">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-black/70 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  title="تصغير (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                
                <span className="text-white text-xs px-2 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 5}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  title="تكبير (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Other Controls */}
              <div className="flex items-center gap-1 bg-black/70 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  title="دوران (R)"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  title="ملء الشاشة (F)"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(
                    photo.image_url || photo.image, 
                    `${photo.title_ar || photo.title}.jpg`
                  )}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  title="تحميل الصورة"
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-red-500/20 h-8 w-8 p-0"
                  title="إغلاق (Esc)"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black photo-dialog-container gpu-accelerated"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Loading State */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="loading-spinner rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>جاري تحميل الصورة...</p>
              </div>
            </div>
          )}

          {/* Main Image */}
          <img
            ref={imageRef}
            src={photo.image_url || photo.image}
            alt={photo.alt_text_ar || photo.title_ar || photo.title}
            className={`max-w-full max-h-full object-contain select-none no-select photo-dialog-image ${
              imageLoaded ? 'opacity-100 photo-fade-in' : 'opacity-0'
            } ${isDragging ? '' : 'zoom-transition'}`}
            style={imageStyle}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            draggable={false}
          />

          {/* Zoom Instructions */}
          {zoom > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg z-20">
              <div className="flex items-center gap-2">
                <Move className="w-3 h-3" />
                <span>اسحب لتحريك الصورة</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls for Mobile */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 md:hidden">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="text-white hover:bg-white/20 touch-friendly"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="text-white hover:bg-white/20 touch-friendly"
            >
              {Math.round(zoom * 100)}%
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 5}
              className="text-white hover:bg-white/20 touch-friendly"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="absolute top-24 right-6 text-white/70 text-xs hidden lg:block z-20">
          <div className="bg-black/70 rounded-lg p-3 space-y-1 max-w-32">
            <div className="font-semibold mb-2">اختصارات:</div>
            <div>+ : تكبير</div>
            <div>- : تصغير</div>
            <div>0 : إعادة تعيين</div>
            <div>R : دوران</div>
            <div>F : ملء الشاشة</div>
            <div>Esc : إغلاق</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPhotoDialog;