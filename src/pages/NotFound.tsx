import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-center bg-background py-20">
      <div className="text-center px-4">
        <h1 className="mb-4 text-8xl font-bold gradient-hero bg-clip-text text-transparent">404</h1>
        <p className="mb-8 text-2xl text-muted-foreground">عذراً! الصفحة غير موجودة</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 gradient-hero text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Home className="w-5 h-5" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
