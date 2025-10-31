import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface NavigationBreadcrumbProps {
  selectedCategory: number | null;
  selectedAlbum: number | null;
  categories: any[];
  albums: any[];
  onNavigateBack: () => void;
  onNavigateHome: () => void;
  showBackButton: boolean;
}

const NavigationBreadcrumb = ({
  selectedCategory,
  selectedAlbum,
  categories,
  albums,
  onNavigateBack,
  onNavigateHome,
  showBackButton
}: NavigationBreadcrumbProps) => {
  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const selectedAlbumData = albums.find(a => a.id === selectedAlbum);

  return (
    <div className="mb-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <button
          onClick={onNavigateHome}
          className="hover:text-primary"
        >
          الفئات
        </button>
        {selectedCategory && (
          <>
            <span>/</span>
            <span className="text-primary">
              {selectedCategoryData?.name_ar}
            </span>
          </>
        )}
        {selectedAlbum && (
          <>
            <span>/</span>
            <span className="text-primary">
              {selectedAlbumData?.name_ar}
            </span>
          </>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحكم - تجريبية</h1>
          <p className="text-gray-600">إدارة الفئات والصور والألبومات (بيانات محلية)</p>
        </div>
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="outline"
              onClick={onNavigateBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationBreadcrumb;


