import { Link, useLocation } from "react-router-dom";
import { Users, Image, BookOpen, UserCheck, ChevronDown, Award, Phone, Settings, Download } from "lucide-react";
import { useState, useEffect } from "react";
import logoImage from "../assets/logo.jpeg";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Load admin authentication state
  useEffect(() => {
    // Listen for storage changes (when auth state changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "admin_authenticated" || e.key === "admin_username" || e.key === "user_username") {
        syncAuthDisplay();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom events (same tab updates)
    const handleAuthChanged = () => syncAuthDisplay();
    window.addEventListener("authChanged", handleAuthChanged);

    // Initial sync for auth display
    const syncAuthDisplay = () => {
      const adminAuth = localStorage.getItem("admin_authenticated") === "true";
      setIsAdminAuthenticated(adminAuth);
      if (adminAuth) {
        const adminName = localStorage.getItem("admin_username") || "Admin";
        setDisplayName(adminName);
      } else {
        const userName = localStorage.getItem("user_username");
        setDisplayName(userName || null);
      }
    };
    syncAuthDisplay();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChanged", handleAuthChanged);
    };
  }, []);



  const navItems = [
    { title: displayName ? `مرحباً، ${displayName}` : "تسجيل دخول", path: "/admin", icon: Settings },
    { title: "حفلة التخرج", path: "/graduation", icon: Award },
    { title: "صور تذكاريه", path: "/memories", icon: Users },
    { title: "اللقاءات", path: "/meetings", icon: Image },
    { 
      title: "تاريخ الجامعة", 
      path: "/history", 
      icon: BookOpen,
      hasSubMenu: true,
      subItems: [
        { title: "نبذة عن الجامعة", path: "/history", icon: BookOpen },
        { title: "المسيرة التاريخية", path: "/history/timeline", icon: BookOpen },
        { title: "اللقاءات", path: "/history/photos", icon: Image }
      ]
    },
    { title: "الزملاء", path: "/colleagues", icon: UserCheck },
    { title: "كتاب الذكريات", path: "/memory-book", icon: Download },
    { title: "تواصل معنا", path: "/contact", icon: Phone },
  ];

  // Do not append duplicate admin links; first item already reflects auth state

  const isActive = (path: string) => currentPath === path;
  const isHistoryActive = () => currentPath.startsWith("/history");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img 
              src={logoImage} 
              alt="University Logo" 
              className="w-8 h-8 object-contain rounded"
            />
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              // Handle dropdown for history section only
              if (item.hasSubMenu && item.title === "تاريخ الجامعة") {
                const isDropdownActive = isHistoryActive();
                const dropdownOpen = historyDropdownOpen;
                const setDropdownOpen = setHistoryDropdownOpen;
                
                return (
                  <div 
                    key={item.path}
                    className="relative group"
                  >
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        isDropdownActive
                          ? "bg-primary text-primary-foreground shadow-warm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                      onMouseEnter={() => setDropdownOpen(true)}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div 
                      className={`absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-warm z-50 transition-all duration-200 ${
                        dropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      {item.subItems?.map((subItem) => {
                        const SubIcon = subItem.icon || BookOpen;
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                              isActive(subItem.path)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                          >
                            <SubIcon className="w-4 h-4" />
                            {subItem.title}
                          </Link>
                        );
                      })}
                    </div>
                    
                    {/* Invisible bridge to prevent dropdown from closing */}
                    <div 
                      className="absolute top-full left-0 w-48 h-1 bg-transparent"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    />
                  </div>
                );
              }
              
              // Handle regular navigation items
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-warm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu - simplified */}
          <div className="md:hidden">
            <select
              value={currentPath}
              onChange={(e) => (window.location.href = e.target.value)}
              className="px-3 py-2 rounded-lg bg-card border border-border text-sm"
            >
              {navItems.map((item) => {
                if (item.hasSubMenu) {
                  return (
                    <optgroup key={item.path} label={item.title}>
                      {item.subItems?.map((subItem) => (
                        <option key={subItem.path} value={subItem.path}>
                          {item.title} - {subItem.title}
                        </option>
                      ))}
                    </optgroup>
                  );
                }
                return (
                  <option key={item.path} value={item.path}>
                    {item.title}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
