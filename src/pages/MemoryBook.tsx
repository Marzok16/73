import React, { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Download, Image, Users, Calendar } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';

const MemoryBook: React.FC = () => {
  const [memories, setMemories] = useState<Array<{ id: number; title: string; description: string; image_url?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const API_BASE = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch(`${API_BASE}/memories/`);
        const data = await res.json();
        setMemories(data);
      } catch (e) {
        console.error('Failed to load memories', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(`${API_BASE}/pdf/book/`, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'memory_book.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              كتاب الذكريات الجامعية
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              احفظ جميع ذكرياتك الجامعية في كتاب PDF شامل
            </p>
            <Button onClick={handleDownload} size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Download className="w-5 h-5 mr-2" />
              {downloading ? 'جاري التحميل...' : 'تحميل كتاب الذكريات PDF'}
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            ما ستحصل عليه في كتاب الذكريات
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">فعاليات التخرج</h3>
              <p className="text-gray-600">
                جميع تفاصيل فعاليات التخرج والتواريخ والأماكن
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Image className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">الصور التذكارية</h3>
              <p className="text-gray-600">
                جميع الصور التذكارية مع الأوصاف والفئات
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Image className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">صور اللقاءات</h3>
              <p className="text-gray-600">
                صور جميع اللقاءات والمناسبات الجامعية
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h3 className="text-xl font-semibold mb-2">معلومات الزملاء</h3>
              <p className="text-gray-600">
                بيانات التواصل مع الزملاء والخريجين
              </p>
            </Card>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              كيف يعمل النظام
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">جمع البيانات</h3>
                <p className="text-gray-600">
                  يجمع النظام جميع الصور والذكريات من جميع الأقسام
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">تنظيم المحتوى</h3>
                <p className="text-gray-600">
                  يتم تنظيم المحتوى في أقسام منطقية مع العناوين والأوصاف
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">إنشاء الكتاب</h3>
                <p className="text-gray-600">
                  يتم إنشاء ملف PDF شامل قابل للطباعة والتحميل
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Flipbook Preview */}
        <div className="container mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold text-center mb-8">معاينة الكتاب</h2>
          {loading ? (
            <p className="text-center text-gray-600">جاري التحميل...</p>
          ) : memories.length === 0 ? (
            <p className="text-center text-gray-600">لا توجد ذكريات لعرضها.</p>
          ) : (
            <div className="flex justify-center">
              <HTMLFlipBook width={420} height={600} size="stretch" minWidth={320} maxWidth={700} minHeight={400} maxHeight={900} showCover={true} flippingTime={600} useMouseEvents className="shadow-xl">
                <div className="p-6 bg-white flex items-center justify-center text-2xl font-bold">غلاف كتاب الذكريات</div>
                {memories.map((m) => (
                  <div key={m.id} className="p-4 bg-white">
                    <h3 className="text-xl font-bold mb-2 text-right">{m.title}</h3>
                    {m.image_url && (
                      <img src={m.image_url} alt={m.title} className="w-full h-64 object-cover rounded mb-3" />
                    )}
                    <p className="text-right leading-8 whitespace-pre-wrap">{m.description}</p>
                  </div>
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryBook;
