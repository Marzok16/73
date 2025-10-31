import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image as ImageIcon, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";

interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  icon?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  photos_count: number;
  created_at: string;
  updated_at: string;
}

interface Photo {
  id: number;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  image: string;
  thumbnail?: string;
  alt_text_ar?: string;
  alt_text_en?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  category: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryData = () => {
      try {
        // Load categories from localStorage
        const storedCategories = localStorage.getItem("test_categories");
        const storedPhotos = localStorage.getItem("test_photos");
        
        if (storedCategories) {
          const categories = JSON.parse(storedCategories);
          const foundCategory = categories.find((cat: Category) => cat.id === parseInt(id || "0"));
          setCategory(foundCategory || null);
        }

        if (storedPhotos) {
          const allPhotos = JSON.parse(storedPhotos);
          const categoryPhotos = allPhotos.filter((photo: Photo) => 
            photo.category === parseInt(id || "0") && photo.is_active
          );
          setPhotos(categoryPhotos);
        }
      } catch (error) {
        console.error("Error loading category data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">الفئة غير موجودة</h1>
          <p className="text-gray-600 mb-8">الفئة المطلوبة غير موجودة أو تم حذفها</p>
          <Link to="/memories">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              العودة للصور التذكارية
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/memories" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            العودة للصور التذكارية
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: category.color }}
            >
              {category.icon || category.name_ar.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{category.name_ar}</h1>
              <p className="text-xl text-gray-600">{category.name_en}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">{category.photos_count} صورة</Badge>
                <Badge variant="outline">
                  {category.is_active ? "نشط" : "غير نشط"}
                </Badge>
              </div>
            </div>
          </div>

          {category.description_ar && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">وصف الفئة</h3>
              <p className="text-gray-700">{category.description_ar}</p>
            </div>
          )}
        </div>

        {/* Photos Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">صور الفئة</h2>
          
          {photos.length === 0 ? (
            <Card className="p-8 text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد صور</h3>
              <p className="text-gray-600">لم يتم إضافة أي صور لهذه الفئة بعد</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    {photo.image ? (
                      <LazyImage
                        src={photo.image}
                        alt={photo.alt_text_ar || photo.title_ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{photo.title_ar}</h3>
                    {photo.title_en && (
                      <p className="text-sm text-gray-600 mb-2">{photo.title_en}</p>
                    )}
                    {photo.description_ar && (
                      <p className="text-sm text-gray-700 mb-3">{photo.description_ar}</p>
                    )}
                    <div className="flex items-center gap-2">
                      {photo.is_featured && (
                        <Badge variant="outline" className="text-yellow-600">
                          <Star className="w-3 h-3 mr-1" />
                          مميز
                        </Badge>
                      )}
                      <Badge variant={photo.is_active ? "default" : "secondary"}>
                        {photo.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Category Info */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              معلومات الفئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">تاريخ الإنشاء</h4>
                <p className="text-gray-600">
                  {new Date(category.created_at).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">آخر تحديث</h4>
                <p className="text-gray-600">
                  {new Date(category.updated_at).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">ترتيب العرض</h4>
                <p className="text-gray-600">{category.sort_order}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">عدد الصور</h4>
                <p className="text-gray-600">{category.photos_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryPage;


