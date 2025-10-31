import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Camera, Users, GraduationCap, Crown } from "lucide-react";
import Slideshow from "@/components/Slideshow";
import campusImage from "@/assets/university-campus.jpg";
import batch73Image from "@/assets/batch73.png";
import royalImage from "@/assets/royal.png";

// Placeholder images - will be replaced with actual founding period images
const foundingImages = [
  "/src/assets/image-1.jpg",
  "/src/assets/image-2.jpg", 
  "/src/assets/image-3.jpg",
  "/src/assets/image-4.jpg",
  "/src/assets/image-5.jpg",
  "/src/assets/image-6.jpg",
  "/src/assets/image-7.jpg",
  "/src/assets/image-8.jpg",
  "/src/assets/image-9.jpg",
  "/src/assets/image-10.jpg",
];

// University emblem evolution images
const emblemImages = [
  "/src/assets/pic1.png",
  "/src/assets/pic2.png", 
  "/src/assets/pic3.png"
];

const Timeline = () => {
  const achievements = [
    {
      number: "50,000+",
      label: "خريج وخريجة",
    },
    {
      number: "12",
      label: "كلية",
    },
    {
      number: "45+",
      label: "برنامج أكاديمي",
    },
    {
      number: "500+",
      label: "عضو هيئة تدريس",
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
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/65 to-background/85" />
          <div className="relative z-10 text-center px-4">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary animate-fade-in" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              المسيرة التاريخية
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-slide-up">
              رحلة تأسيس الجامعة من خلال الصور
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Founding Period Slideshow */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-primary animate-fade-in" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                الجامعة في فترة تأسيسها
              </h2>
              <p className="text-xl text-muted-foreground animate-slide-up max-w-3xl mx-auto">
                صور نادرة توثق بدايات الجامعة ومراحل بنائها وتطويرها منذ التأسيس
              </p>
              <div className="w-20 h-1 bg-primary mx-auto mt-6"></div>
            </div>

            {/* Slideshow Component */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Slideshow 
                images={foundingImages}
                autoPlay={true}
                autoPlayInterval={5000}
                className="mb-8"
              />
            </div>

            {/* Information Cards */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="p-8 shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    أرشيف تاريخي
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    هذه المجموعة من الصور النادرة توثق المراحل الأولى لبناء الجامعة وتطويرها، 
                    من مراحل التخطيط والبناء وصولاً إلى افتتاح أول المباني الأكاديمية.
                  </p>
                </div>
              </Card>

              <Card className="p-8 shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    رحلة التأسيس
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    تحكي هذه الصور قصة تحويل الرؤية إلى واقع، حيث بدأت الجامعة كفكرة طموحة 
                    وتطورت لتصبح صرحاً تعليمياً يخدم المجتمع ويساهم في بناء المستقبل.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Batch 73 Section */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-primary animate-fade-in" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                  كانت الجامعة في بداياتها
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto"></div>
              </div>

              <Card className="overflow-hidden shadow-warm animate-slide-up">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                    <div className="text-center lg:text-right">
                      <div className="mb-6">
                        <h3 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                          دفعة ٧٣
                        </h3>
                        <div className="w-20 h-1 bg-primary mx-auto lg:mx-0 mb-6"></div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="text-center">
                          <h4 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                            جامعة الملك فهد للبترول والمعادن
                          </h4>
                          <div className="text-lg text-muted-foreground">
                            كلية البترول والمعادن
                          </div>
                        </div>
                        
                        <div className="space-y-4 text-lg leading-relaxed">
                          <p className="text-muted-foreground">
                            في بداياتها، كانت الجامعة تحمل اسم "كلية البترول والمعادن" 
                            وكانت تركز على التخصصات الهندسية والعلمية المتعلقة بالبترول والمعادن.
                          </p>
                          
                          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-primary" />
                              <span className="font-semibold">دفعة ٧٣</span>
                            </div>
                            <div className="w-1 h-6 bg-primary/20"></div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-primary" />
                              <span className="font-semibold">تخصصات رائدة</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Section */}
                  <div className="relative flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-8 order-1 lg:order-2">
                    <div className="relative">
                      <img 
                        src={batch73Image} 
                        alt="دفعة ٧٣ - جامعة الملك فهد للبترول والمعادن" 
                        className="w-full max-w-md h-auto object-contain rounded-lg shadow-lg"
                      />
                      <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary/20 animate-pulse"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-secondary/20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Historical Context */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="p-6 text-center shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">عام ١٩٧٣</h4>
                  <p className="text-sm text-muted-foreground">بداية رحلة التعليم التقني المتخصص</p>
                </Card>

                <Card className="p-6 text-center shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">تخصصات رائدة</h4>
                  <p className="text-sm text-muted-foreground">البترول والمعادن والهندسة التطبيقية</p>
                </Card>

                <Card className="p-6 text-center shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">خريجون متميزون</h4>
                  <p className="text-sm text-muted-foreground">قادة المستقبل في الصناعات الحيوية</p>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* University Emblem Evolution Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center animate-fade-in">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                تطور شعار الجامعة
              </h2>
              <p className="text-xl text-muted-foreground animate-slide-up max-w-3xl mx-auto">
                من كلية البترول والمعادن إلى جامعة الملك فهد للبترول والمعادن
              </p>
              <div className="w-20 h-1 bg-primary mx-auto mt-6"></div>
            </div>

            {/* Emblem Evolution Slideshow */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Slideshow 
                images={emblemImages}
                autoPlay={true}
                autoPlayInterval={6000}
                className="mb-8"
              />
            </div>

            {/* Evolution Timeline Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="p-8 text-center shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-primary">
                  1963 - البداية
                </h3>
                <h4 className="text-lg font-semibold mb-3">
                  كلية البترول والمعادن
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  الشعار الأول للكلية يعكس التخصص في علوم البترول والمعادن مع الرمز الأكاديمي التقليدي.
                </p>
              </Card>

              <Card className="p-8 text-center shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-primary">
                  التطوير والنمو
                </h3>
                <h4 className="text-lg font-semibold mb-3">
                  جامعة البترول والمعادن
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  مرحلة التحول إلى جامعة شاملة مع الحفاظ على الهوية الأساسية والتخصص الفريد.
                </p>
              </Card>

              <Card className="p-8 text-center shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.9s' }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-primary">
                  الهوية الحديثة
                </h3>
                <h4 className="text-lg font-semibold mb-3">
                  جامعة الملك فهد للبترول والمعادن
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  الشعار الحالي يجمع بين التراث الأكاديمي والرؤية المستقبلية للجامعة.
                </p>
              </Card>
            </div>

            {/* Key Information */}
            <div className="mt-12">
              <Card className="p-8 gradient-card shadow-warm">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6">
                    تاريخ عريق من التميز
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="text-center md:text-right">
                      <h4 className="text-lg font-semibold mb-3 text-primary">
                        المعنى والرمزية
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        يرمز الشعار إلى العلم والمعرفة من خلال الكتاب المفتوح، 
                        والبرج يمثل القوة والاستقرار في التعليم التقني المتخصص.
                      </p>
                    </div>
                    <div className="text-center md:text-left">
                      <h4 className="text-lg font-semibold mb-3 text-primary">
                        التراث الأكاديمي
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        منذ عام 1963، يحتفظ الشعار بعناصره الأساسية مع تطوير يعكس 
                        نمو الجامعة ومكانتها الرائدة في التعليم التقني.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Royal Decree Section */}
        <div className="bg-gradient-to-br from-green/5 to-emerald/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Crown className="w-16 h-16 mx-auto mb-4 text-green-600 animate-fade-in" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                  المرسوم الملكي
                </h2>
                <p className="text-xl text-muted-foreground animate-slide-up max-w-3xl mx-auto">
                  الوثيقة التاريخية التي رسّخت مكانة الجامعة كصرح تعليمي رائد
                </p>
                <div className="w-20 h-1 bg-green-600 mx-auto mt-6"></div>
              </div>

              <Card className="overflow-hidden shadow-warm animate-slide-up">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative flex items-center justify-center bg-gradient-to-br from-green/10 to-emerald/10 p-8 order-1">
                    <div className="relative">
                      <img 
                        src={royalImage} 
                        alt="المرسوم الملكي - جامعة الملك فهد للبترول والمعادن" 
                        className="w-full max-w-md h-auto object-contain rounded-lg shadow-lg border border-green/20"
                      />
                      <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-green/20 animate-pulse"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-emerald/20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center order-2">
                    <div className="mb-6">
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 text-green-700">
                        وثيقة تاريخية
                      </h3>
                      <div className="w-20 h-1 bg-green-600 mb-6"></div>
                    </div>
                    
                    <div className="space-y-6 text-lg leading-relaxed">
                      <p className="text-muted-foreground">
                        المرسوم الملكي الكريم الذي أسس جامعة الملك فهد للبترول والمعادن 
                        كمؤسسة تعليمية رائدة في المملكة العربية السعودية.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">
                            تأسيس مؤسسة تعليمية متخصصة في علوم البترول والمعادن
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">
                            رؤية ملكية لبناء كوادر وطنية مؤهلة في القطاعات الحيوية
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">
                            إرساء أسس التعليم التقني المتقدم في المملكة
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Historical Significance */}
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <Card className="p-6 text-center shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-green-700">رؤية ملكية</h4>
                  <p className="text-sm text-muted-foreground">توجيه سامٍ لإنشاء صرح تعليمي متخصص</p>
                </Card>

                <Card className="p-6 text-center shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-green-700">إرث تعليمي</h4>
                  <p className="text-sm text-muted-foreground">بداية مسيرة التميز في التعليم التقني</p>
                </Card>

                <Card className="p-6 text-center shadow-card hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-green-700">بناء الكوادر</h4>
                  <p className="text-sm text-muted-foreground">إعداد المتخصصين للقطاعات الحيوية</p>
                </Card>
              </div>

              {/* Legacy Statement */}
              <div className="mt-12">
                <Card className="p-8 bg-gradient-to-r from-green/5 to-emerald/5 border border-green/20 shadow-warm">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 text-green-700">
                      إرث يتجدد عبر الأجيال
                    </h3>
                    <p className="text-lg leading-relaxed max-w-3xl mx-auto text-muted-foreground">
                      من المرسوم الملكي التاريخي إلى الواقع المعاصر، تواصل جامعة الملك فهد للبترول والمعادن 
                      رسالتها في إعداد جيل من المتخصصين المؤهلين لقيادة التنمية في المملكة العربية السعودية.
                    </p>
                    <div className="flex justify-center mt-6">
                      <div className="flex items-center gap-2 text-green-600">
                        <Crown className="w-5 h-5" />
                        <span className="font-semibold">بإذن من جلالة الملك</span>
                        <Crown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;