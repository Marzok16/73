import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import campusImage from "@/assets/university-campus.jpg";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "تم إرسال الرسالة",
      description: "شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-100 to-green-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Phone className="w-16 h-16 mx-auto text-green-600 mb-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            تواصل معنا
          </h1>
          <p className="text-lg text-gray-600">
            أي سؤال؟ لا تترد في التواصل معنا.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات الاتصال</h2>
            
            {/* Address */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-blue-700">
                  <MapPin className="w-5 h-5" />
                  العنوان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Abbot Kinney Blvd. Unit D 1800<br />
                  E Venice &
                </p>
              </CardContent>
            </Card>

            {/* Phone and Email */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <Phone className="w-5 h-5" />
                  اتصل بنا
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700" dir="ltr">Mobile: (+88) - 1990 - 6886</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700" dir="ltr">Mail: contact@echooling.com</span>
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-orange-700">
                  <Clock className="w-5 h-5" />
                  ساعات العمل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">الاثنين - الجمعة:</span>
                  <span className="text-gray-600" dir="ltr">09:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">الأحد والسبت:</span>
                  <span className="text-gray-600" dir="ltr">10:30 - 22:00</span>
                </div>
              </CardContent>
            </Card>

            {/* Google Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  الموقع على الخريطة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-64 bg-gray-100 rounded-b-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.733248043701!2d-118.4685884!3d34.0522265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2a4d74d68daab%3A0x1e3c5a6b7c8d9e0f!2sAbbot%20Kinney%20Blvd%2C%20Venice%2C%20CA%2C%20USA!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
                    width="100%"
                    height="256"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MessageSquare className="w-6 h-6" />
                  إرسال رسالة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="اسمك الكامل"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">الموضوع *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="موضوع الرسالة"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="اكتب رسالتك هنا..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="text-right resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                  >
                    إرسال الرسالة
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};export default ContactUs;