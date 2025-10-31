import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Image as ImageIcon, 
  Users, 
  Calendar, 
  ArrowLeft,
  Eye,
  Clock
} from 'lucide-react';
import OptimizedLazyImage from './OptimizedLazyImage';
import AdvancedLazyImage from './AdvancedLazyImage';
import LazySection from './LazySection';
import EnhancedPhotoDialog from './EnhancedPhotoDialog';

interface MeetingCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  photos_count?: number;
  photos: MeetingPhoto[];
  created_at: string;
  updated_at: string;
}

interface MeetingPhoto {
  id: number;
  title_ar: string;
  description_ar?: string;
  image: string;
  image_url?: string;
  thumbnail?: string;
  is_featured: boolean;
  category: number;
  category_name: string;
  created_at: string;
  updated_at: string;
  uploaded_by?: number;
}

interface MeetingGroupCardsProps {
  onBack?: () => void;
}

const MeetingGroupCards: React.FC<MeetingGroupCardsProps> = ({ onBack }) => {
  const [categories, setCategories] = useState<MeetingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MeetingCategory | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<MeetingPhoto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE}/meeting-categories/with_photos/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching meeting categories:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_BASE]);

  const handleCategoryClick = (category: MeetingCategory) => {
    setSelectedCategory(category);
  };

  const handlePhotoClick = (photo: MeetingPhoto) => {
    setSelectedPhoto(photo);
    setIsDialogOpen(true);
  };

  const handleBackToGroups = () => {
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل المجموعات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  // If a category is selected, show its photos
  if (selectedCategory) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBackToGroups}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للمجموعات
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedCategory.name}</h2>
              {selectedCategory.description && (
                <p className="text-muted-foreground">{selectedCategory.description}</p>
              )}
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="text-sm"
            style={{ backgroundColor: selectedCategory.color + '20', color: selectedCategory.color }}
          >
            {selectedCategory.photos.length} صورة
          </Badge>
        </div>

        {/* Photos Grid */}
        {selectedCategory.photos.length > 0 ? (
          <LazySection 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            showSkeleton={true}
            minHeight="400px"
          >
            {selectedCategory.photos.map((photo) => (
              <Card
                key={photo.id}
                className="group overflow-hidden shadow-card hover:shadow-warm transition-all duration-300 cursor-pointer"
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="relative h-64 overflow-hidden">
                  <AdvancedLazyImage
                    src={photo.image_url || photo.image}
                    alt={photo.title_ar}
                    thumbnailSrc={photo.thumbnail}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    showProgress={true}
                    quality={85}
                    aspectRatio="4/3"
                    fallbackSrc="/src/assets/placeholder-image.jpg"
                    retryCount={3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Featured Badge */}
                  {photo.is_featured && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="text-xs">
                        ⭐ مميز
                      </Badge>
                    </div>
                  )}

                  {/* View Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 rounded-full p-2">
                      <Eye className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {photo.title_ar}
                  </h3>
                  
                  {photo.description_ar && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {photo.description_ar}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(photo.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(photo.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </LazySection>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لا توجد صور في هذه المجموعة</h3>
            <p className="text-muted-foreground">لم يتم إضافة أي صور لهذه المجموعة بعد</p>
          </div>
        )}
      </div>
    );
  }

  // Show category cards
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">مجموعات اللقاءات</h1>
        <p className="text-muted-foreground">اختر مجموعة لعرض صورها</p>
      </div>

      {/* Category Cards */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group overflow-hidden shadow-card hover:shadow-warm transition-all duration-300 cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <Badge 
                    variant="secondary"
                    style={{ backgroundColor: category.color + '20', color: category.color }}
                  >
                    {category.photos.length} صورة
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {category.description && (
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Preview Images */}
                {category.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {category.photos.slice(0, 3).map((photo, index) => (
                      <div key={photo.id} className="aspect-square overflow-hidden rounded-md">
                        <OptimizedLazyImage
                          src={photo.image_url || photo.image}
                          alt={photo.title_ar}
                          thumbnailSrc={photo.thumbnail}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {category.photos.length > 3 && (
                      <div className="aspect-square bg-muted flex items-center justify-center rounded-md">
                        <span className="text-sm font-medium text-muted-foreground">
                          +{category.photos.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{category.photos.length} صورة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(category.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">لا توجد مجموعات</h3>
          <p className="text-muted-foreground">لم يتم إنشاء أي مجموعات لقاءات بعد</p>
        </div>
      )}

      {/* Photo Dialog */}
      {selectedPhoto && (
        <EnhancedPhotoDialog
          photo={selectedPhoto}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedPhoto(null);
          }}
        />
      )}
    </div>
  );
};

export default MeetingGroupCards;
