import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Crown, 
  Heart,
  Search,
  User,
  MapPin,
  Briefcase,
  Calendar,
  Trophy,
  Phone
} from "lucide-react";
import { toast } from "sonner";

interface Colleague {
  id: number;
  name: string;
  position?: string;
  current_workplace?: string;
  description?: string;
  photo?: string;
  photo_url?: string;
  status: 'active' | 'promoted' | 'deceased';
  status_display: string;
  graduation_year?: number;
  achievements?: string;
  contact_info?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE = "http://127.0.0.1:8000/api";

const Colleagues = () => {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColleague, setEditingColleague] = useState<Colleague | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    current_workplace: "",
    description: "",
    status: "active" as Colleague['status'],
    graduation_year: "",
    achievements: "",
    contact_info: "",
    is_featured: false,
    photo: null as File | null
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch colleagues from API
  const fetchColleagues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/colleagues/`);
      if (response.ok) {
        const data = await response.json();
        setColleagues(data);
      } else {
        toast.error("فشل في تحميل الزملاء");
      }
    } catch (error) {
      console.error("Error fetching colleagues:", error);
      toast.error("حدث خطأ أثناء تحميل الزملاء");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleagues();
  }, []);

  // Filter colleagues based on active tab and search term
  const filteredColleagues = colleagues.filter(colleague => {
    const matchesSearch = colleague.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colleague.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         colleague.current_workplace?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "promoted") return matchesSearch && colleague.status === "promoted";
    if (activeTab === "deceased") return matchesSearch && colleague.status === "deceased";
    
    return matchesSearch;
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("current_workplace", formData.current_workplace);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("achievements", formData.achievements);
      formDataToSend.append("contact_info", formData.contact_info);
      formDataToSend.append("is_featured", formData.is_featured.toString());
      
      if (formData.graduation_year) {
        formDataToSend.append("graduation_year", formData.graduation_year);
      }
      
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const url = editingColleague 
        ? `${API_BASE}/colleagues/${editingColleague.id}/`
        : `${API_BASE}/colleagues/`;
      
      const method = editingColleague ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        toast.success(editingColleague ? "تم تحديث الزميل بنجاح" : "تم إضافة الزميل بنجاح");
        setIsDialogOpen(false);
        resetForm();
        fetchColleagues();
      } else {
        toast.error("فشل في حفظ الزميل");
      }
    } catch (error) {
      console.error("Error saving colleague:", error);
      toast.error("حدث خطأ أثناء حفظ الزميل");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الزميل؟")) return;

    try {
      const response = await fetch(`${API_BASE}/colleagues/${id}/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        toast.success("تم حذف الزميل بنجاح");
        fetchColleagues();
      } else {
        toast.error("فشل في حذف الزميل");
      }
    } catch (error) {
      console.error("Error deleting colleague:", error);
      toast.error("حدث خطأ أثناء حذف الزميل");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      current_workplace: "",
      description: "",
      status: "active",
      graduation_year: "",
      achievements: "",
      contact_info: "",
      is_featured: false,
      photo: null
    });
    setEditingColleague(null);
  };

  // Handle edit
  const handleEdit = (colleague: Colleague) => {
    setFormData({
      name: colleague.name,
      position: colleague.position || "",
      current_workplace: colleague.current_workplace || "",
      description: colleague.description || "",
      status: colleague.status,
      graduation_year: colleague.graduation_year?.toString() || "",
      achievements: colleague.achievements || "",
      contact_info: colleague.contact_info || "",
      is_featured: colleague.is_featured,
      photo: null
    });
    setEditingColleague(colleague);
    setIsDialogOpen(true);
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'promoted':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'deceased':
        return <Heart className="w-4 h-4 text-red-500" />;
      default:
        return <User className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'promoted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deceased':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">جاري تحميل الزملاء...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">إدارة الزملاء</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة زميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingColleague ? "تعديل الزميل" : "إضافة زميل جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">المنصب</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_workplace">جهة العمل الحالية</Label>
                  <Input
                    id="current_workplace"
                    value={formData.current_workplace}
                    onChange={(e) => setFormData({ ...formData, current_workplace: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduation_year">سنة التخرج</Label>
                  <Input
                    id="graduation_year"
                    type="number"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select value={formData.status} onValueChange={(value: Colleague['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="promoted">وصل لمنصب عالي</SelectItem>
                    <SelectItem value="deceased">متوفى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">نبذة تعريفية</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">الإنجازات</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_info">معلومات التواصل</Label>
                <Textarea
                  id="contact_info"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">الصورة</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">زميل مميز</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "جاري الحفظ..." : editingColleague ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          placeholder="البحث عن زميل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            جميع الزملاء ({colleagues.length})
          </TabsTrigger>
          <TabsTrigger value="promoted" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            زملاء وصلوا لمناصب عليا ({colleagues.filter(c => c.status === 'promoted').length})
          </TabsTrigger>
          <TabsTrigger value="deceased" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            زملاء متوفون ({colleagues.filter(c => c.status === 'deceased').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredColleagues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد نتائج للبحث الحالي
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleagues.map((colleague) => (
                <Card key={colleague.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {colleague.photo_url ? (
                        <img
                          src={colleague.photo_url}
                          alt={colleague.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{colleague.name}</h3>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(colleague.status)}`}>
                          {getStatusIcon(colleague.status)}
                          {colleague.status_display}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(colleague)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(colleague.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {colleague.position && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {colleague.position}
                      </div>
                    )}
                    {colleague.current_workplace && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {colleague.current_workplace}
                      </div>
                    )}
                    {colleague.graduation_year && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        تخرج عام {colleague.graduation_year}
                      </div>
                    )}
                    {colleague.achievements && (
                      <div className="flex items-start gap-2">
                        <Trophy className="w-4 h-4 mt-0.5" />
                        <span className="line-clamp-2">{colleague.achievements}</span>
                      </div>
                    )}
                    {colleague.contact_info && (
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 mt-0.5" />
                        <span className="line-clamp-1">{colleague.contact_info}</span>
                      </div>
                    )}
                  </div>

                  {colleague.description && (
                    <div className="mt-3 text-sm text-gray-700">
                      <p className="line-clamp-3">{colleague.description}</p>
                    </div>
                  )}

                  {colleague.is_featured && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                        <Trophy className="w-3 h-3" />
                        زميل مميز
                      </span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Colleagues;