import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LogOut,
  Camera,
  Users,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import MemoryPhotos from "@/components/MemoryPhotos";
import MeetingPhotos from "@/components/MeetingPhotos";
import Colleagues from "@/components/Colleagues";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState("memory-photos");

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });
  const [loginLoading, setLoginLoading] = useState(false);

  // API base
  const API_BASE = "http://127.0.0.1:8000/api";

  // Load auth state
  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    toast.success("تم تسجيل الخروج بنجاح");
    window.dispatchEvent(new Event('authChanged'));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/admin-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_authenticated", "true");
        localStorage.setItem("admin_username", data.username);
        if (data.token) {
          localStorage.setItem("admin_token", data.token);
        }
        toast.success(`مرحباً، ${data.username}`);
        window.dispatchEvent(new Event('authChanged'));
        setIsAuthenticated(true);
      } else if (res.status === 401) {
        toast.error("بيانات الدخول غير صحيحة");
      } else if (res.status === 403) {
        const text = await res.json().catch(() => null);
        toast.error(text?.detail || "غير مسموح بالدخول");
      } else {
        toast.error("حدث خطأ أثناء تسجيل الدخول");
      }
    } catch (err) {
      toast.error("تعذر الاتصال بالخادم");
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <Card className="p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                لوحة التحكم
              </h1>
              <p className="text-gray-600">
                سجّل دخولك للوصول إلى لوحة التحكم
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold"
                disabled={loginLoading}
              >
                {loginLoading ? "جاري تسجيل الدخول..." : "دخول لوحة التحكم"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-sm"
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
              <p className="text-gray-600">
                إدارة محتوى الموقع
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {`مرحباً، ${localStorage.getItem('admin_username') || 'Admin'}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="memory-photos" className="flex items-center gap-2 text-lg py-3">
              <Camera className="w-5 h-5" />
              صور تذكارية
            </TabsTrigger>
            <TabsTrigger value="meeting-photos" className="flex items-center gap-2 text-lg py-3">
              <Users className="w-5 h-5" />
              اللقاءات
            </TabsTrigger>
            <TabsTrigger value="colleagues" className="flex items-center gap-2 text-lg py-3">
              <UserCheck className="w-5 h-5" />
              الزملاء
            </TabsTrigger>
          </TabsList>

          {/* Memory Photos Tab */}
          <TabsContent value="memory-photos" className="mt-6">
            <MemoryPhotos />
          </TabsContent>

          {/* Meeting Photos Tab */}
          <TabsContent value="meeting-photos" className="mt-6">
            <MeetingPhotos />
          </TabsContent>

          {/* Colleagues Tab */}
          <TabsContent value="colleagues" className="mt-6">
            <Colleagues />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;

