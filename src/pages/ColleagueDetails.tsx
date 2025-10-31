import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import EnhancedPhotoDialog from "@/components/EnhancedPhotoDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight,
  User, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Trophy, 
  Phone,
  Crown,
  Heart,
  Mail,
  Share2,
  Download
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

const ColleagueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [colleague, setColleague] = useState<Colleague | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  // Fetch colleague details from API
  const fetchColleagueDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/colleagues/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setColleague(data);
      } else if (response.status === 404) {
        toast.error("الزميل غير موجود");
        navigate("/colleagues");
      } else {
        toast.error("فشل في تحميل بيانات الزميل");
      }
    } catch (error) {
      console.error("Error fetching colleague details:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات الزميل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleagueDetails();
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'promoted':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'deceased':
        return <Heart className="w-5 h-5 text-red-500" />;
      default:
        return <User className="w-5 h-5 text-blue-500" />;
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

  const handleShare = async () => {
    try {
      if (navigator.share && colleague) {
        await navigator.share({
          title: `${colleague.name} - زملاء الدفعة 73`,
          text: `تعرف على ${colleague.name} من زملاء دفعة الهندسة المدنية 1973`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ الرابط");
      }
    } catch (error) {
      toast.error("فشل في مشاركة الرابط");
    }
  };

  const handleDownloadPhoto = () => {
    if (colleague?.photo_url) {
      const link = document.createElement('a');
      link.href = colleague.photo_url;
      link.download = `${colleague.name}_photo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePhotoClick = () => {
    if (colleague?.photo_url) {
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
          <div className="text-lg">جاري تحميل بيانات الزميل...</div>
        </div>
      </div>
    );
  }

  if (!colleague) {
    return (
      <div>
        <Navigation />
        <div className="pt-16 flex items-center justify-center py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">الزميل غير موجود</h2>
            <p className="text-gray-600 mb-4">لم نتمكن من العثور على الزميل المطلوب</p>
            <Button onClick={() => navigate("/colleagues")}>
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة لقائمة الزملاء
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
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/colleagues")}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              العودة لقائمة الزملاء
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="text-center mb-6">
                  {colleague.photo_url ? (
                    <div className="relative inline-block mb-4">
                      <img
                        src={colleague.photo_url}
                        alt={colleague.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-gray-100 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handlePhotoClick}
                        title="انقر لعرض الصورة بالحجم الكامل"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 rounded-full p-2"
                        onClick={handleDownloadPhoto}
                        title="تحميل الصورة"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-100">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">{colleague.name}</h1>
                  
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border ${getStatusColor(colleague.status)} mb-4`}>
                    {getStatusIcon(colleague.status)}
                    {colleague.status_display}
                  </div>

                  {colleague.is_featured && (
                    <div className="mb-4">
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-sm px-3 py-1">
                        <Trophy className="w-4 h-4 mr-2" />
                        زميل مميز
                      </Badge>
                    </div>
                  )}

                  <div className="flex justify-center gap-2">
                    <Button onClick={handleShare} variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      مشاركة
                    </Button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-4">
                  {colleague.position && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">المنصب</p>
                        <p className="font-medium">{colleague.position}</p>
                      </div>
                    </div>
                  )}

                  {colleague.current_workplace && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">جهة العمل الحالية</p>
                        <p className="font-medium">{colleague.current_workplace}</p>
                      </div>
                    </div>
                  )}

                  {colleague.graduation_year && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-purple-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">سنة التخرج</p>
                        <p className="font-medium">{colleague.graduation_year}</p>
                      </div>
                    </div>
                  )}

                  {colleague.contact_info && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">معلومات التواصل</p>
                        <div className="text-sm whitespace-pre-line">{colleague.contact_info}</div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Description */}
                {colleague.description && (
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      نبذة تعريفية
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {colleague.description}
                      </p>
                    </div>
                  </Card>
                )}

                {/* Achievements */}
                {colleague.achievements && (
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      الإنجازات والمناصب
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {colleague.achievements}
                      </p>
                    </div>
                  </Card>
                )}

                {/* Timeline Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    المعلومات الزمنية
                  </h2>
                  <div className="space-y-3">
                    {colleague.graduation_year && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">سنة التخرج</span>
                        <span className="font-medium">{colleague.graduation_year}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">تاريخ الإضافة</span>
                      <span className="font-medium">
                        {new Date(colleague.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">آخر تحديث</span>
                      <span className="font-medium">
                        {new Date(colleague.updated_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Additional Info Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">معلومات إضافية</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">الحالة</p>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getStatusColor(colleague.status)}`}>
                        {getStatusIcon(colleague.status)}
                        {colleague.status_display}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">نوع العضوية</p>
                      <Badge variant={colleague.is_featured ? "default" : "secondary"}>
                        {colleague.is_featured ? "زميل مميز" : "عضو عادي"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Related Actions */}
          <div className="mt-8 text-center">
            <Card className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">هل تريد إضافة معلومات أو تصحيح بيانات؟</h3>
              <p className="text-gray-600 mb-4">
                إذا كانت لديك معلومات إضافية عن هذا الزميل أو تصحيحات، يرجى التواصل معنا
              </p>
              <Button onClick={() => navigate("/contact")} variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                تواصل معنا
              </Button>
            </Card>
          </div>
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

export default ColleagueDetails;