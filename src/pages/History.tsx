import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { BookOpen, Camera, Clock, Users as UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";
import campusImage from "@/assets/university-campus.jpg";
import historicalImage from "@/assets/1.png";

const History = () => {
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

  const historySection = [
    {
      title: "التاريخ",
      description: "تعرف على المسيرة التاريخية للجامعة منذ التأسيس عام 1975 وحتى اليوم",
      icon: BookOpen,
      path: "/history/timeline",
      highlights: ["50 عاماً من التميز", "المحطات المهمة", "الإنجازات والجوائز"]
    },
    {
      title: "صور تذكارية",
      description: "أرشيف بصري شامل يوثق تاريخ الجامعة من خلال الصور النادرة والوثائق",
      icon: Camera,
      path: "/history/photos",
      highlights: ["صور نادرة", "وثائق تاريخية", "شخصيات مؤثرة"]
    }
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
              تاريخ الجامعة
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-slide-up">
              رحلة من النجاح والإنجاز تمتد لعقود
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

        {/* History Sections */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              استكشف تاريخ الجامعة
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {historySection.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={index}
                    to={section.path}
                    className="block group"
                  >
                    <Card className="p-8 h-full shadow-card hover:shadow-warm transition-all duration-300 group-hover:scale-105 animate-slide-up"
                         style={{ animationDelay: `${index * 0.2}s` }}>
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {section.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {section.highlights.map((highlight, highlightIndex) => (
                          <div key={highlightIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 text-center">
                        <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                          استكشف الآن
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Quick Timeline Preview */}
            <div className="mt-16">
              <Card className="p-8 gradient-card shadow-warm">
                <div className="text-center mb-6">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-3">
                    نظرة سريعة على المسيرة
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">1975</div>
                    <div className="text-sm text-muted-foreground">التأسيس</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">1990</div>
                    <div className="text-sm text-muted-foreground">الاعتماد الدولي</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">2025</div>
                    <div className="text-sm text-muted-foreground">الحاضر</div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Link 
                    to="/history/timeline"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    <BookOpen className="w-4 h-4" />
                    اعرض المسيرة كاملة
                  </Link>
                </div>
              </Card>
            </div>

            {/* Historical Section with King Fahd University Content */}
            <div className="mt-16">
              <Card className="overflow-hidden shadow-warm">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative flex items-center justify-center bg-gray-50 p-4">
                    <img 
                      src={historicalImage} 
                      alt="مرحباً في جامعة الملك فهد" 
                      className="w-full h-auto object-contain max-h-[500px] rounded-lg shadow-md"
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold mb-4 text-primary">
                        مرحباً في جامعة الملك فهد
                      </h3>
                      <div className="w-20 h-1 bg-primary mb-6"></div>
                    </div>
                    
                    <div className="space-y-4 text-lg leading-relaxed">
                      <p className="text-muted-foreground">
                        تخصصات جامعة الملك فهد للبترول والمعادن:
                      </p>
                      
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <span>كلية الهندسة التطبيقية</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <span>كلية العلوم التطبيقية</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <span>كلية العلوم</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <span>كلية الإدارة الصناعية</span>
                        </li>
                      </ul>
                      
                      <div className="mt-8 pt-6 border-t border-border">
                        <h4 className="text-xl font-semibold mb-3 text-foreground">
                          عن جامعة الملك فهد
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          نحن دفعة كلية جامعة الملك فهد، اجتمعنا في رحلة أكاديمية وشخصية مميزة، وبليوم نحتفل بإنجازاتنا وذكرياتنا التي لا تُنسى.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* KFUPM74 Values Section */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <div className="text-sm font-semibold text-muted-foreground mb-2 tracking-widest">
                  KFUPM74
                </div>
                <h2 className="text-4xl font-bold text-primary mb-4">
                  قيم جامعة الملك فهد
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Goals Card */}
                <Card className="p-8 text-center shadow-warm hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">أهدافنا</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    أهدافنا هي الحفاظ على ذكريات دفعتنا، وتعزيز الروابط الاجتماعية، والحفاظ على تواصل الجميع من خلال الفعاليات والمبادرات المشتركة ومنصة تواصل موحدة.
                  </p>
                </Card>

                {/* Mission Card */}
                <Card className="p-8 text-center shadow-warm hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">رسالتنا</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    تعزيز روابط الصداقة، والحفاظ على ذكريات سنواتنا الجامعية، وبناء شبكة قوية من العلاقات المهنية والاجتماعية بين زملاء الدراسة.
                  </p>
                </Card>

                {/* Vision Card */}
                <Card className="p-8 text-center shadow-warm hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">رؤيتنا</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    أن نكون نموذجاً للوحدة والتعاون بين أعضاء الدفعة، وأن نحافظ على تواصل قوي وحياة مشترك داخل مجتمع الجامعة وخارجة.
                  </p>
                </Card>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="mt-16">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 lg:p-12">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                  {/* Innovation */}
                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary">95%</div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-muted-foreground">الإبداع</h4>
                  </div>

                  {/* Cooperation */}
                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary">88%</div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-muted-foreground">التعاون</h4>
                  </div>

                  {/* Respect */}
                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary">97%</div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-muted-foreground">الاحترام</h4>
                  </div>

                  {/* Friendship */}
                  <div className="text-center group">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="text-3xl font-bold text-primary">99%</div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-muted-foreground">الصداقة</h4>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-muted-foreground text-lg">
                    قيم تحدد مسيرتنا وتعكس هويتنا كخريجي جامعة الملك فهد
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
