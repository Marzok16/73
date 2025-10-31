import Navigation from "@/components/Navigation";
import LazyImage from "@/components/LazyImage";
import EnhancedPhotoDialog from "@/components/EnhancedPhotoDialog";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Camera, Clock, Users, X, Download } from "lucide-react";
import campusImage from "@/assets/university-campus.jpg";
import towerImage from "@/assets/tower.png";
import bookImage from "@/assets/book.png";
import { useState } from "react";

// Import memory images
import memory1 from "@/assets/memory-1.jpg";
import memory2 from "@/assets/memory-2.jpg";
import memory4 from "@/assets/memory-4.jpg";
import memory5 from "@/assets/memory-5.jpg";
import memory7 from "@/assets/memory-7.jpg";
import memory8 from "@/assets/memory-8.jpg";
import memory9 from "@/assets/memory-9.jpg";
import memory10 from "@/assets/memory-10.jpg";
import memory11 from "@/assets/memory-11.jpg";

// Import JPG files differently to avoid TypeScript issues
const memory3 = "/src/assets/memory-3.JPG";
const memory6 = "/src/assets/memory-6.JPG";

const HistoricalPhotos = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof memoryPhotos[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePhotoClick = (photo: typeof memoryPhotos[0]) => {
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

  const memoryPhotos = [
    {
      id: 1,
      image: memory1,
      title: "بداية الرحلة التعليمية",
      description: "الأيام الأولى في الجامعة، حيث بدأت رحلة العلم والمعرفة. لحظات من الحماس والترقب لما ينتظرنا من تحديات وإنجازات في السنوات القادمة.",
      category: "البدايات",
    },
    {
      id: 2,
      image: memory2,
      title: "لقاءات الصداقة الأولى",
      description: "تكوين الصداقات التي ستدوم مدى الحياة. جلسات الدراسة المشتركة والضحكات التي ملأت أروقة الجامعة بالفرح والذكريات الجميلة.",
      category: "الصداقات",
    },
    {
      id: 3,
      image: memory3,
      title: "المشاريع الأكاديمية الأولى",
      description: "العمل الجماعي في أول مشروع أكاديمي كبير. تعلمنا معنى التعاون والإبداع، وكيف يمكن للأفكار المختلفة أن تتحد لتخلق شيئاً رائعاً.",
      category: "الإنجازات",
    },
    {
      id: 4,
      image: memory4,
      title: "احتفالات نهاية الفصل",
      description: "الاحتفال بإنهاء الامتحانات والفصل الدراسي الأول. لحظات من الفرح والراحة بعد فترة مكثفة من الدراسة والاجتهاد.",
      category: "الاحتفالات",
    },
    {
      id: 5,
      image: memory5,
      title: "الأنشطة الثقافية والفنية",
      description: "المشاركة في الفعاليات الثقافية والمعارض الفنية. اكتشاف المواهب المخفية وتطوير القدرات الإبداعية خارج نطاق المناهج الدراسية.",
      category: "الثقافة والفنون",
    },
    {
      id: 6,
      image: memory6,
      title: "التطوع والعمل المجتمعي",
      description: "المشاركة في الأعمال التطوعية وخدمة المجتمع. تعلم قيم العطاء والمسؤولية الاجتماعية، وتطبيق ما نتعلمه لخدمة الآخرين.",
      category: "التطوع",
    },
    {
      id: 7,
      image: memory7,
      title: "رحلات الاستكشاف العلمي",
      description: "الرحلات الميدانية والزيارات العلمية التي أثرت معرفتنا العملية. تطبيق النظريات في الواقع ورؤية العلم في عمله الحقيقي.",
      category: "الرحلات العلمية",
    },
    {
      id: 8,
      image: memory8,
      title: "المسابقات والتحديات",
      description: "المشاركة في المسابقات الأكاديمية والتحديات العلمية. اختبار قدراتنا ومهاراتنا في بيئة تنافسية محفزة للإبداع والتميز.",
      category: "المسابقات",
    },
    {
      id: 9,
      image: memory9,
      title: "التدريب العملي",
      description: "فترات التدريب الصيفي والخبرة العملية الأولى. الانتقال من النظرية إلى التطبيق واكتساب المهارات المهنية الحقيقية.",
      category: "التدريب",
    },
    {
      id: 10,
      image: memory10,
      title: "السنة التحضيرية",
      description: "حضور المؤتمرات العلمية وورش العمل التخصصية. التعرف على أحدث التطورات في مجال الدراسة والتفاعل مع الخبراء.",
      category: "المؤتمرات",
    },
    {
      id: 11,
      image: memory11,
      title: "السنة التحضيرية – معمل اللغة الإنجليزية",
      description: "الوصول إلى نهاية الرحلة الجامعية بنجاح. لحظات الفخر والإنجاز مع الأصدقاء والعائلة، والاستعداد لبداية مرحلة جديدة في الحياة.",
      category: "التخرج",
    },
  ];

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
            <Camera className="w-16 h-16 mx-auto mb-4 text-primary animate-fade-in" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              ذكريات الجامعة
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-slide-up">
              رحلة مصورة عبر أجمل لحظات الحياة الجامعية
            </p>
          </div>
        </div>

        {/* Memory Photos Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            {/* University Tower & Graduation Booklet Sections */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* University Tower Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  برج الجامعة
                </h2>
                <Card className="overflow-hidden shadow-warm hover:shadow-card transition-all duration-300 cursor-pointer"
                      onClick={() => handlePhotoClick({
                        id: 100,
                        image: towerImage,
                        title: "برج الجامعة",
                        description: "برج الجامعة الشامخ، رمز العلم والمعرفة الذي يطل على الحرم الجامعي. يعتبر هذا البرج من أبرز المعالم المعمارية في الجامعة ونقطة التقاء للطلاب وأعضاء هيئة التدريس.",
                        category: "المعالم"
                      })}>
                  <div className="relative h-96 overflow-hidden bg-muted/10">
                    <img
                      src={towerImage}
                      alt="برج الجامعة"
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-lg font-bold mb-2">برج الجامعة</h3>
                      <p className="text-white/90 text-sm line-clamp-2">
                        رمز العلم والمعرفة الذي يطل على الحرم الجامعي
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Graduation Booklet Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  غلاف كتيّب التخرّج للدفعة ٧٣
                </h2>
                <Card className="overflow-hidden shadow-warm hover:shadow-card transition-all duration-300 cursor-pointer"
                      onClick={() => handlePhotoClick({
                        id: 101,
                        image: bookImage,
                        title: "غلاف كتيّب التخرّج للدفعة ٧٣",
                        description: "غلاف كتيّب التخرج التذكاري للدفعة الثالثة والسبعين، يحمل في طياته ذكريات وإنجازات خريجي هذه الدفعة المميزة. يعكس هذا الكتيّب تاريخ الجامعة العريق وتطورها عبر السنين.",
                        category: "التخرج"
                      })}>
                  <div className="relative h-96 overflow-hidden bg-muted/10">
                    <img
                      src={bookImage}
                      alt="غلاف كتيّب التخرّج للدفعة ٧٣"
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-lg font-bold mb-2">غلاف كتيّب التخرّج للدفعة ٧٣</h3>
                      <p className="text-white/90 text-sm line-clamp-2">
                        كتيّب تذكاري يحمل ذكريات وإنجازات الخريجين
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-12 text-center">
              مجموعة الذكريات الجامعية
            </h2>

            {/* Photos Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {memoryPhotos.map((photo, index) => (
                <Card
                  key={photo.id}
                  className="group overflow-hidden shadow-card hover:shadow-warm transition-all duration-300 cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  {/* Photo */}
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs rounded-full">
                        {photo.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {photo.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                      {photo.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

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

export default HistoricalPhotos;