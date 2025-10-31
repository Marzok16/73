import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section - LEFT */}
          <div className="space-y-4 order-3 md:order-1">
            <div className="text-right">
              <p className="text-gray-300 leading-relaxed">
                موقعنا يُعبّر عن علاقة تمتد لـ52 عاماً بين أعضاء الدفعة.
              </p>
            </div>
          </div>

          {/* Quick Links Section - CENTER */}
          <div className="space-y-4 order-2">
            <h3 className="text-xl font-bold mb-4 text-right">روابط سريعة</h3>
            <div className="space-y-2 text-right">
              <div>
                <Link to="/history" className="text-gray-300 hover:text-white transition-colors">
                  من نحن
                </Link>
              </div>
              <div>
                <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                  تسجيل الدخول
                </Link>
              </div>
              <div>
                <Link to="/memories" className="text-gray-300 hover:text-white transition-colors">
                  المعرض
                </Link>
              </div>
              <div>
                <Link to="/colleagues" className="text-gray-300 hover:text-white transition-colors">
                  تواصل معنا
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Section - RIGHT */}
          <div className="space-y-4 order-1 md:order-3">
            <h3 className="text-xl font-bold mb-4 text-right">اتصل بنا</h3>
            <p className="text-right text-gray-300">لمعرفة آخر أخبارنا</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-end space-x-3 space-x-reverse">
                <span className="text-orange-400">966+ 50 800 9922</span>
                <Phone className="w-5 h-5 text-orange-400" />
              </div>
              
              <div className="flex items-center justify-end space-x-3 space-x-reverse">
                <span className="text-orange-400">info@kfupm73.com</span>
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 KFUPM Batch 73. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;