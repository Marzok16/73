import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import OptimizedLazyImage from "@/components/OptimizedLazyImage";
import EnhancedPhotoDialog from "@/components/EnhancedPhotoDialog";
import Pagination from "@/components/Pagination";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Image as ImageIcon, 
  Users, 
  Clock, 
  Calendar, 
  X, 
  Download, 
  Filter,
  Grid3X3,
  List,
  Search,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import campusImage from "@/assets/university-campus.jpg";

// Types
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

const DynamicMeetingPhotos = () => {
  const [categories, setCategories] = useState<MeetingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "name" | "category">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  // Fetch categories and photos
  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error fetching meeting photos:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE]);

  // Get all photos for filtering and searching
  const allPhotos = useMemo(() => {
    return categories.flatMap(category => 
      category.photos.map(photo => ({
        ...photo,
        categoryData: category
      }))
    );
  }, [categories]);

  // Filter and sort photos
  const filteredAndSortedPhotos = useMemo(() => {
    let filtered = allPhotos;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(photo => 
        photo.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.description_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.category_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(photo => 
        photo.category.toString() === selectedCategory
      );
    }

    // Sort photos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title_ar.localeCompare(b.title_ar, 'ar');
        case "category":
          return a.category_name.localeCompare(b.category_name, 'ar');
        case "date":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [allPhotos, searchTerm, selectedCategory, sortBy]);

  // Paginated photos
  const paginatedPhotos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedPhotos.slice(startIndex, endIndex);
  }, [filteredAndSortedPhotos, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedPhotos.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  // Handler functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Handle photo click
  const handlePhotoClick = (photo: any) => {
    setSelectedPhoto(photo);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPhoto(null);
  };

  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">جاري تحميل صور اللقاءات</h2>
            <p className="text-muted-foreground">الرجاء الانتظار...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Navigation />
        <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-red-700">خطأ في تحميل البيانات</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <div 
          className="relative h-96 flex items-center justify-center"
          style={{
            backgroundImage: `url(${campusImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
          <div className="relative z-10 text-center px-4">
            <Users className="w-16 h-16 mx-auto mb-4 text-primary animate-fade-in" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              لقاءات الجامعة
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-slide-up">
              لحظات التواصل والتفاعل بين أعضاء المجتمع الجامعي
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ابحث في الصور والفئات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="جميع الفئات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name} ({category.photos?.length || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="ترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">الأحدث</SelectItem>
                    <SelectItem value="name">الاسم</SelectItem>
                    <SelectItem value="category">الفئة</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex rounded-lg border">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count and Pagination Info */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-muted-foreground">
              <div>
                {searchTerm || selectedCategory !== "all" ? (
                  <>عرض {filteredAndSortedPhotos.length} من أصل {allPhotos.length} صورة</>
                ) : (
                  <>المجموع: {allPhotos.length} صورة في {categories.length} فئة</>
                )}
              </div>
              {filteredAndSortedPhotos.length > itemsPerPage && (
                <div>
                  الصفحة {currentPage} من {totalPages}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Categories and Photos Section */}
            {categories.length > 0 && (
              <>
                {selectedCategory === "all" ? (
                  <div className="text-center mb-16 px-4">
                    <div className="relative py-12">
                      {/* Background gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-600/10 to-purple-600/10 blur-2xl opacity-60 rounded-2xl"></div>
                      
                      <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-green-600 animate-fade-in leading-normal tracking-wide">
                          مجموعة لقاءات الجامعة
                        </h2>
                        
                        {/* Gradient underline */}
                        <div className="w-32 h-1.5 bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 mx-auto rounded-full shadow-lg"></div>
                        
                        {/* Decorative dots */}
                        <div className="flex justify-center gap-2 mt-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mb-16 relative px-4">
                    {(() => {
                      const selectedCategoryData = categories.find(cat => cat.id.toString() === selectedCategory);
                      return selectedCategoryData ? (
                        <div className="relative py-12">
                          {/* Background decoration */}
                          <div 
                            className="absolute inset-0 opacity-10 blur-3xl rounded-2xl"
                            style={{
                              background: `linear-gradient(135deg, ${selectedCategoryData.color}20, transparent, ${selectedCategoryData.color}20)`
                            }}
                          ></div>
                          
                          <div className="relative z-10">
                            {/* Category badge */}
                            <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 rounded-full border-2 backdrop-blur-sm shadow-lg"
                                 style={{
                                   borderColor: `${selectedCategoryData.color}40`,
                                   backgroundColor: `${selectedCategoryData.color}10`
                                 }}>
                              <div 
                                className="w-4 h-4 rounded-full shadow-sm"
                                style={{ backgroundColor: selectedCategoryData.color }}
                              ></div>
                              <span className="text-sm font-semibold" style={{ color: selectedCategoryData.color }}>
                                فئة مختارة
                              </span>
                            </div>
                            
                            {/* Category title */}
                            <h2 
                              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-slide-up leading-normal tracking-wide"
                              style={{ color: selectedCategoryData.color }}
                            >
                              {selectedCategoryData.name}
                            </h2>
                            
                            {/* Category description */}
                            {selectedCategoryData.description && (
                              <div className="max-w-3xl mx-auto animate-fade-in mb-8">
                                <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                                  {selectedCategoryData.description}
                                </p>
                              </div>
                            )}
                            
                            {/* Decorative line with dots */}
                            <div className="flex items-center justify-center gap-4">
                              <div 
                                className="w-16 h-1.5 rounded-full shadow-md"
                                style={{ backgroundColor: selectedCategoryData.color }}
                              ></div>
                              <div 
                                className="w-3 h-3 rounded-full shadow-sm"
                                style={{ backgroundColor: selectedCategoryData.color }}
                              ></div>
                              <div 
                                className="w-16 h-1.5 rounded-full shadow-md"
                                style={{ backgroundColor: selectedCategoryData.color }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12">
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 leading-normal">
                            الفئة المحددة
                          </h2>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Photos Grid/List */}
                {paginatedPhotos.length > 0 ? (
                  <>
                    <div className={
                      viewMode === "grid" 
                        ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        : "space-y-6"
                    }>
                      {paginatedPhotos.map((photo, index) => (
                        <Card
                          key={photo.id}
                          className={`group overflow-hidden shadow-card hover:shadow-warm transition-all duration-300 cursor-pointer animate-slide-up ${
                            viewMode === "list" ? "flex" : ""
                          }`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                          onClick={() => handlePhotoClick(photo)}
                        >
                          {/* Photo */}
                          <div className={`relative overflow-hidden ${
                            viewMode === "list" ? "w-48 h-32 flex-shrink-0" : "h-64"
                          }`}>
                            <OptimizedLazyImage
                              src={photo.image_url || photo.image}
                              alt={photo.title_ar}
                              thumbnailSrc={photo.thumbnail}
                              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Category Badge - Only show when viewing all categories */}
                            {selectedCategory === "all" && (
                              <div className="absolute top-4 right-4">
                                <Badge 
                                  className="text-xs"
                                  style={{ backgroundColor: photo.categoryData.color }}
                                >
                                  {photo.category_name}
                                </Badge>
                              </div>
                            )}

                            {/* Featured Badge */}
                            {photo.is_featured && (
                              <div className="absolute top-4 left-4">
                                <Badge variant="secondary" className="text-xs">
                                  مميز
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Content - Different display based on category selection */}
                          <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                              {photo.title_ar}
                            </h3>
                            
                            {/* Show description only when viewing all categories */}
                            {selectedCategory === "all" && (
                              <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                                {photo.description_ar}
                              </p>
                            )}

                            {viewMode === "list" && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {new Date(photo.created_at).toLocaleDateString('ar-SA')}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination Component */}
                    {filteredAndSortedPhotos.length > itemsPerPage && (
                      <div className="mt-12 pt-8 border-t">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={filteredAndSortedPhotos.length}
                          itemsPerPage={itemsPerPage}
                          onPageChange={handlePageChange}
                          onItemsPerPageChange={handleItemsPerPageChange}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">لا توجد نتائج</h3>
                    <p className="text-muted-foreground">
                      لم يتم العثور على صور تطابق معايير البحث الحالية
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {categories.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">لا توجد لقاءات متاحة</h3>
                <p className="text-muted-foreground">
                  لم يتم رفع أي صور للقاءات بعد. تواصل مع إدارة الموقع لإضافة المحتوى.
                </p>
              </div>
            )}

            {/* Enhanced Photo Dialog */}
            <EnhancedPhotoDialog
              isOpen={isDialogOpen}
              onClose={handleCloseDialog}
              photo={selectedPhoto}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicMeetingPhotos;