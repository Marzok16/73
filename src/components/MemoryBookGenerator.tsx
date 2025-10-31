import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, BookOpen, Loader2, Image as ImageIcon, Users, Calendar, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pdfService, { MemoryBookData } from '@/services/arabicPdfService';

interface MemoryBookGeneratorProps {
  onClose?: () => void;
}

const MemoryBookGenerator: React.FC<MemoryBookGeneratorProps> = ({ onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<MemoryBookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        memoryCategoriesResponse,
        memoryPhotosResponse,
        meetingCategoriesResponse,
        meetingPhotosResponse,
        colleaguesResponse
      ] = await Promise.all([
        fetch('http://localhost:8000/api/memory-categories/'),
        fetch('http://localhost:8000/api/memory-photos/'),
        fetch('http://localhost:8000/api/meeting-categories/'),
        fetch('http://localhost:8000/api/meeting-photos/'),
        fetch('http://localhost:8000/api/colleagues/')
      ]);

      const [
        memoryCategories,
        memoryPhotos,
        meetingCategories,
        meetingPhotos,
        colleagues
      ] = await Promise.all([
        memoryCategoriesResponse.json(),
        memoryPhotosResponse.json(),
        meetingCategoriesResponse.json(),
        meetingPhotosResponse.json(),
        colleaguesResponse.json()
      ]);

      // Create category lookup maps
      const memoryCategoryMap = new Map();
      memoryCategories.forEach((cat: any) => {
        memoryCategoryMap.set(cat.id, cat.name);
      });

      const meetingCategoryMap = new Map();
      meetingCategories.forEach((cat: any) => {
        meetingCategoryMap.set(cat.id, cat.name);
      });

      // Process data
      const processedData: MemoryBookData = {
        graduation: {
          title: 'حفلة التخرج',
          events: [
            {
              title: 'حفل التخرج الرئيسي',
              date: '15 يونيو 2024',
              time: '10:00 صباحاً',
              location: 'القاعة الكبرى - الحرم الجامعي',
              description: 'حفل التخرج السنوي مع توزيع الشهادات وإلقاء كلمات التخرج'
            },
            {
              title: 'حفل الوداع',
              date: '14 يونيو 2024',
              time: '7:00 مساءً',
              location: 'حديقة الجامعة',
              description: 'أمسية وداعية مع الزملاء وأعضاء هيئة التدريس'
            },
            {
              title: 'التصوير التذكاري',
              date: '13 يونيو 2024',
              time: '2:00 ظهراً',
              location: 'أمام المبنى الإداري',
              description: 'جلسة تصوير جماعية للدفعة الخريجة'
            }
          ]
        },
        memories: memoryPhotos.map((photo: any) => ({
          id: photo.id,
          title: photo.title_ar,
          description: photo.description_ar || '',
          image: photo.image,
          category: memoryCategoryMap.get(photo.category) || 'غير محدد',
          is_featured: photo.is_featured,
          created_at: photo.created_at
        })),
        meetings: meetingPhotos.map((photo: any) => ({
          id: photo.id,
          title: photo.title_ar,
          description: photo.description_ar || '',
          image: photo.image,
          category: meetingCategoryMap.get(photo.category) || 'غير محدد',
          is_featured: photo.is_featured,
          created_at: photo.created_at
        })),
        historical: [], // This would be populated from historical photos if available
        colleagues: colleagues.map((colleague: any) => ({
          id: colleague.id,
          name: colleague.name,
          email: colleague.email,
          phone: colleague.phone,
          graduation_year: colleague.graduation_year,
          current_job: colleague.current_job,
          bio: colleague.bio,
          profile_image: colleague.profile_image
        })),
        historyGroups: [
          {
            title: 'الجامعة في فترة تأسيسها',
            description: 'صور نادرة توثق بدايات الجامعة ومراحل بنائها وتطويرها منذ التأسيس',
            images: [
              '/src/assets/image-1.jpg',
              '/src/assets/image-2.jpg',
              '/src/assets/image-3.jpg',
              '/src/assets/image-4.jpg',
              '/src/assets/image-5.jpg',
              '/src/assets/image-6.jpg',
              '/src/assets/image-7.jpg',
              '/src/assets/image-8.jpg',
              '/src/assets/image-9.jpg',
              '/src/assets/image-10.jpg',
            ].map(src => ({ src }))
          },
          {
            title: 'تطور شعار الجامعة',
            description: 'من كلية البترول والمعادن إلى جامعة الملك فهد للبترول والمعادن',
            images: [
              '/src/assets/pic1.png',
              '/src/assets/pic2.png',
              '/src/assets/pic3.png',
            ].map(src => ({ src }))
          }
        ]
      };

      setData(processedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('فشل في تحميل البيانات. تأكد من أن الخادم يعمل.');
    } finally {
      setLoading(false);
    }
  };


  const getStats = () => {
    if (!data) return { totalPhotos: 0, totalColleagues: 0, totalEvents: 0 };
    
    return {
      totalPhotos: data.memories.length + data.meetings.length + data.historical.length,
      totalColleagues: data.colleagues.length,
      totalEvents: data.graduation.events.length
    };
  };

  const handleGeneratePDF = async () => {
    if (!data) {
      toast({
        title: "خطأ",
        description: "لا توجد بيانات متاحة لإنشاء الكتاب",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await pdfService.generateMemoryBook(data);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `كتاب-الذكريات-الجامعية-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "نجح!",
        description: "تم إنشاء وتحميل كتاب الذكريات بنجاح",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الكتاب. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">جاري تحميل البيانات...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchAllData} variant="outline">
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }

  const stats = getStats();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BookOpen className="w-6 h-6" />
          مولد كتاب الذكريات الجامعية
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalPhotos}</p>
            <p className="text-sm text-gray-600">صورة</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{stats.totalColleagues}</p>
            <p className="text-sm text-gray-600">زميل</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-purple-600">{stats.totalEvents}</p>
            <p className="text-sm text-gray-600">فعالية</p>
          </div>
        </div>

        {/* Content Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">محتوى الكتاب:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                حفلة التخرج
              </h4>
              <p className="text-sm text-gray-600">{data?.graduation.events.length} فعالية</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                الصور التذكارية
              </h4>
              <p className="text-sm text-gray-600">{data?.memories.length} صورة</p>
              {data?.memories.filter(m => m.is_featured).length > 0 && (
                <Badge variant="secondary" className="mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  {data.memories.filter(m => m.is_featured).length} مميزة
                </Badge>
              )}
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                صور اللقاءات
              </h4>
              <p className="text-sm text-gray-600">{data?.meetings.length} صورة</p>
              {data?.meetings.filter(m => m.is_featured).length > 0 && (
                <Badge variant="secondary" className="mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  {data.meetings.filter(m => m.is_featured).length} مميزة
                </Badge>
              )}
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                الزملاء
              </h4>
              <p className="text-sm text-gray-600">{data?.colleagues.length} زميل</p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleGeneratePDF}
            disabled={isGenerating || !data}
            className="flex items-center gap-2"
            size="lg"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isGenerating ? 'جاري الإنشاء...' : 'إنشاء وتحميل الكتاب'}
          </Button>
          
          {onClose && (
            <Button onClick={onClose} variant="outline" size="lg">
              إلغاء
            </Button>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>سيتم إنشاء كتاب PDF شامل يحتوي على جميع الصور والذكريات</p>
          <p>قد يستغرق الإنشاء بضع دقائق حسب عدد الصور</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryBookGenerator;
