import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import heroImage from "@/assets/hero-graduation.jpg";

const Graduation = () => {
  const events = [
    {
      title: "حفل التخرج الرئيسي",
      date: "15 يونيو 2024",
      time: "10:00 صباحاً",
      location: "القاعة الكبرى - الحرم الجامعي",
      description: "حفل التخرج السنوي مع توزيع الشهادات وإلقاء كلمات التخرج",
    },
    {
      title: "حفل الوداع",
      date: "14 يونيو 2024",
      time: "7:00 مساءً",
      location: "حديقة الجامعة",
      description: "أمسية وداعية مع الزملاء وأعضاء هيئة التدريس",
    },
    {
      title: "التصوير التذكاري",
      date: "13 يونيو 2024",
      time: "2:00 ظهراً",
      location: "أمام المبنى الإداري",
      description: "جلسة تصوير جماعية للدفعة الخريجة",
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
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/80" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              حفلة التخرج
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-slide-up">
              احتفل بإنجازك وشارك لحظات النجاح
            </p>
          </div>
        </div>

        {/* Events Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">فعاليات التخرج</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {events.map((event, index) => (
              <Card 
                key={index} 
                className="p-6 shadow-card hover:shadow-warm transition-shadow duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {event.title}
                </h3>
                
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed">
                  {event.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Quote Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="p-8 gradient-card text-center shadow-warm">
              <p className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
                "دفعة 1973: ذكرياتنا وصورنا وصداقاتنا في مكان واحد"
              </p>
              <p className="text-muted-foreground">
                نافذة على الماضي، جسر إلى المستقبل
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graduation;
