import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import EnhancedPhotoDialog from "@/components/EnhancedPhotoDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  User, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Trophy, 
  Phone,
  Crown,
  Heart,
  ChevronLeft,
  ChevronRight,
  Users,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface Colleague {
  id: number;
  name: string;
  position?: string;
  current_workplace?: string;
  description?: string;
  photo?: string;
  photo_url?: string;
  status: 'active' | 'promoted' | 'deceased';
  status_display: string;
  graduation_year?: number;
  achievements?: string;
  contact_info?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE = "http://127.0.0.1:8000/api";
const ITEMS_PER_PAGE = 12;

const Colleagues = () => {
  const navigate = useNavigate();
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  // Fetch colleagues from API
  const fetchColleagues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/colleagues/`);
      if (response.ok) {
        const data = await response.json();
        setColleagues(data);
      } else {
        toast.error("فشل في تحميل الزملاء");
      }
    } catch (error) {
      console.error("Error fetching colleagues:", error);
      toast.error("حدث خطأ أثناء تحميل الزملاء");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleagues();
  }, []);

  // Get unique graduation years for filter
  const graduationYears = [...new Set(colleagues
    .filter(c => c.graduation_year)
    .map(c => c.graduation_year))]
    .sort((a, b) => (b || 0) - (a || 0));

  // Filter colleagues based on all filters and search term
  const filteredColleagues = colleagues.filter(colleague => {
    const matchesSearch = colleague.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colleague.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colleague.current_workplace?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colleague.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || colleague.status === statusFilter;
    const matchesFeatured = featuredFilter === "all" || 
                           (featuredFilter === "featured" && colleague.is_featured) ||
                           (featuredFilter === "regular" && !colleague.is_featured);
    const matchesYear = yearFilter === "all" || colleague.graduation_year?.toString() === yearFilter;
    
    return matchesSearch && matchesStatus && matchesFeatured && matchesYear;
  });

  // Pagination
  const totalPages = Math.ceil(filteredColleagues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedColleagues = filteredColleagues.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, featuredFilter, yearFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'promoted':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'deceased':
        return <Heart className="w-4 h-4 text-red-500" />;
      default:
        return <User className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'promoted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deceased':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleColleagueClick = (colleagueId: number) => {
    navigate(`/colleagues/${colleagueId}`);
  };

  const handlePhotoClick = (colleague: Colleague, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    if (colleague.photo_url) {
      setSelectedPhoto({
        image_url: colleague.photo_url,
        image: colleague.photo_url,
        title_ar: colleague.name,
        title: colleague.name,
        alt_text_ar: `صورة ${colleague.name}`,
        description_ar: colleague.description || `صورة ${colleague.name} - زميل من دفعة الهندسة المدنية 1973`
      });
      setIsPhotoDialogOpen(true);
    }
  };

  const handleDownloadFromDialog = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="pt-16 flex items-center justify-center py-8">
          <div className="text-lg">جاري تحميل الزملاء...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              زملاء الدفعة 73
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تعرّف على زملاء دفعة الهندسة المدنية 1973 وإنجازاتهم في مختلف المجالات
            </p>
            <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{colleagues.length} زميل</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>{colleagues.filter(c => c.status === 'promoted').length} وصل لمناصب عليا</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span>{colleagues.filter(c => c.is_featured).length} زميل مميز</span>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="البحث عن زميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-lg h-12"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">تصنيف حسب:</span>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="promoted">وصل لمنصب عالي</SelectItem>
                  <SelectItem value="deceased">متوفى</SelectItem>
                </SelectContent>
              </Select>

              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="التميز" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="featured">زملاء مميزون</SelectItem>
                  <SelectItem value="regular">زملاء عاديون</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="سنة التخرج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع السنوات</SelectItem>
                  {graduationYears.map(year => (
                    <SelectItem key={year} value={year?.toString() || ""}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              عرض {paginatedColleagues.length} من أصل {filteredColleagues.length} زميل
            </p>
          </div>

          {/* Colleagues Grid */}
          {filteredColleagues.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">جرب تغيير معايير البحث أو التصفية</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedColleagues.map((colleague) => (
                <Card 
                  key={colleague.id} 
                  className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleColleagueClick(colleague.id)}
                >
                  <div className="text-center mb-4">
                    {colleague.photo_url ? (
                      <img
                        src={colleague.photo_url}
                        alt={colleague.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-4 ring-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={(e) => handlePhotoClick(colleague, e)}
                        title="انقر لعرض الصورة بالحجم الكامل"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3 ring-4 ring-gray-100">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{colleague.name}</h3>
                    
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getStatusColor(colleague.status)} mb-3`}>
                      {getStatusIcon(colleague.status)}
                      {colleague.status_display}
                    </div>

                    {colleague.is_featured && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 mb-3">
                        <Trophy className="w-3 h-3 mr-1" />
                        زميل مميز
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {colleague.position && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                        <span className="truncate">{colleague.position}</span>
                      </div>
                    )}
                    {colleague.current_workplace && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span className="truncate">{colleague.current_workplace}</span>
                      </div>
                    )}
                    {colleague.graduation_year && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>تخرج عام {colleague.graduation_year}</span>
                      </div>
                    )}
                  </div>

                  {colleague.description && (
                    <div className="mt-3 text-sm text-gray-700">
                      <p className="line-clamp-2 leading-relaxed">{colleague.description}</p>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColleagueClick(colleague.id);
                      }}
                    >
                      عرض التفاصيل
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                التالي
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Photo Dialog */}
      <EnhancedPhotoDialog
        isOpen={isPhotoDialogOpen}
        onClose={() => setIsPhotoDialogOpen(false)}
        photo={selectedPhoto}
        onDownload={handleDownloadFromDialog}
      />
    </div>
  );
};

export default Colleagues;
