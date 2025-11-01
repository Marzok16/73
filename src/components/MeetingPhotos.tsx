import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Upload,
  Image as ImageIcon,
  Folder,
  Camera,
  Save,
  X,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

// Types for Meeting Photos
interface MeetingCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  photos_count: number;
  created_at: string;
  updated_at: string;
}

interface MeetingPhoto {
  id: number;
  title_ar: string;
  description_ar?: string;
  image: string;
  image_url?: string;
  thumbnail?: string;
  is_featured: boolean;
  category: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface MeetingPhotosProps {
  onRefresh?: () => void;
}

const MeetingPhotos = ({ onRefresh }: MeetingPhotosProps) => {
  const [meetingCategories, setMeetingCategories] = useState<MeetingCategory[]>([]);
  const [meetingPhotos, setMeetingPhotos] = useState<MeetingPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("meeting-categories");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // API base and helpers
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Token ${token}` } : {};
  };

  // Form states for Meeting Photos
  const [meetingCategoryForm, setMeetingCategoryForm] = useState({
    name: "",
    description: "",
    color: "#3B82F6"
  });

  const [meetingPhotoForm, setMeetingPhotoForm] = useState({
    title_ar: "",
    description_ar: "",
    category: "",
    is_featured: false,
    image: null as File | null
  });

  // Bulk upload state
  const [bulkUploadForm, setBulkUploadForm] = useState({
    category: "",
    images: [] as File[],
    metadata: {} as Record<number, { title: string; description: string; is_featured: boolean }>
  });

  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'meeting-category' | 'meeting-photo' | 'bulk-upload'>('meeting-category');

  // Load data from API
  useEffect(() => {
    loadMeetingData();
  }, []);

  const loadMeetingData = async () => {
    setLoading(true);
    try {
      const [catRes, photoRes] = await Promise.all([
        fetch(`${API_BASE}/meeting-categories/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/meeting-photos/`, { headers: getAuthHeaders() }),
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        setMeetingCategories(catData);
      }
      if (photoRes.ok) {
        const photoData = await photoRes.json();
        setMeetingPhotos(photoData);
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (e) {
      console.error("Failed to load meeting data:", e);
      toast.error("فشل تحميل بيانات اللقاءات");
    } finally {
      setLoading(false);
    }
  };

  // Meeting Category CRUD operations
  const handleMeetingCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() } as any;
      if (editingItem) {
        const res = await fetch(`${API_BASE}/meeting-categories/${editingItem}/`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(meetingCategoryForm),
        });
        if (!res.ok) throw new Error('Failed to update category');
        toast.success("تم تحديث فئة اللقاء بنجاح");
      } else {
        const res = await fetch(`${API_BASE}/meeting-categories/`, {
          method: 'POST',
          headers,
          body: JSON.stringify(meetingCategoryForm),
        });
        if (!res.ok) throw new Error('Failed to create category');
        toast.success(`تم إنشاء فئة اللقاء "${meetingCategoryForm.name}" بنجاح`);
      }

      await loadMeetingData();
      resetMeetingCategoryForm();
    } catch (error) {
      console.error("Error saving meeting category:", error);
      toast.error("خطأ في حفظ فئة اللقاء");
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingCategoryEdit = (category: MeetingCategory) => {
    setMeetingCategoryForm({
      name: category.name,
      description: category.description || "",
      color: category.color
    });
    setEditingItem(category.id);
    setDialogType('meeting-category');
    setIsDialogOpen(true);
  };

  const handleMeetingCategoryDelete = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف فئة اللقاء هذه؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/meeting-categories/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders() as any,
      });
      if (!res.ok) throw new Error('Failed to delete category');
      await loadMeetingData();
      toast.success("تم حذف فئة اللقاء بنجاح");
    } catch (e) {
      toast.error("تعذر حذف فئة اللقاء");
    } finally {
      setLoading(false);
    }
  };

  const resetMeetingCategoryForm = () => {
    setMeetingCategoryForm({
      name: "",
      description: "",
      color: "#3B82F6"
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const clearMeetingCategoryForm = () => {
    setMeetingCategoryForm({
      name: "",
      description: "",
      color: "#3B82F6"
    });
    setEditingItem(null);
  };

  // Meeting Photo CRUD operations
  const handleMeetingPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title_ar', meetingPhotoForm.title_ar);
      if (meetingPhotoForm.description_ar) formData.append('description_ar', meetingPhotoForm.description_ar);
      formData.append('category', meetingPhotoForm.category);
      formData.append('is_featured', String(meetingPhotoForm.is_featured));
      if (meetingPhotoForm.image) formData.append('image', meetingPhotoForm.image);

      const headers = { ...getAuthHeaders() } as any;
      if (editingItem) {
        const res = await fetch(`${API_BASE}/meeting-photos/${editingItem}/`, {
          method: 'PUT',
          headers,
          body: formData,
        });
        if (!res.ok) throw new Error('Failed to update photo');
        toast.success("تم تحديث صورة اللقاء بنجاح");
      } else {
        const res = await fetch(`${API_BASE}/meeting-photos/`, {
          method: 'POST',
          headers,
          body: formData,
        });
        if (!res.ok) throw new Error('Failed to create photo');
        toast.success("تم رفع صورة اللقاء بنجاح");
      }

      await loadMeetingData();
      resetMeetingPhotoForm();
    } catch (error) {
      console.error("Error saving meeting photo:", error);
      toast.error("خطأ في حفظ صورة اللقاء");
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingPhotoEdit = (photo: MeetingPhoto) => {
    setMeetingPhotoForm({
      title_ar: photo.title_ar,
      description_ar: photo.description_ar || "",
      category: photo.category.toString(),
      is_featured: photo.is_featured,
      image: null
    });
    setEditingItem(photo.id);
    setDialogType('meeting-photo');
    setIsDialogOpen(true);
  };

  const handleMeetingPhotoDelete = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف صورة اللقاء هذه؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/meeting-photos/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders() as any,
      });
      if (!res.ok) throw new Error('Failed to delete photo');
      await loadMeetingData();
      toast.success("تم حذف صورة اللقاء بنجاح");
    } catch (e) {
      toast.error("تعذر حذف صورة اللقاء");
    } finally {
      setLoading(false);
    }
  };

  const resetMeetingPhotoForm = () => {
    setMeetingPhotoForm({
      title_ar: "",
      description_ar: "",
      category: "",
      is_featured: false,
      image: null
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const clearMeetingPhotoForm = () => {
    setMeetingPhotoForm({
      title_ar: "",
      description_ar: "",
      category: "",
      is_featured: false,
      image: null
    });
    setEditingItem(null);
  };

  // Bulk upload functions
  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkUploadForm.images.length === 0) {
      toast.error("يرجى اختيار صور للرفع");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('category', bulkUploadForm.category);
      
      // Add all images
      bulkUploadForm.images.forEach((image, index) => {
        formData.append('images', image);
        
        // Add metadata for each image if provided
        const metadata = bulkUploadForm.metadata[index];
        if (metadata) {
          if (metadata.title.trim()) {
            formData.append(`metadata_${index}_title`, metadata.title);
          }
          if (metadata.description.trim()) {
            formData.append(`metadata_${index}_description`, metadata.description);
          }
          formData.append(`metadata_${index}_is_featured`, String(metadata.is_featured));
        }
      });
      
      const headers = { ...getAuthHeaders() } as any;
      const res = await fetch(`${API_BASE}/meeting-photos/bulk_upload/`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload photos');
      }
      
      const result = await res.json();
      
      if (result.errors && result.errors.length > 0) {
        toast.error(`تم رفع ${result.created_count} من ${result.total_count} صور. ${result.error_count} صور فشلت.`);
        console.error("Upload errors:", result.errors);
      } else {
        toast.success(`تم رفع ${result.created_count} صور اللقاءات بنجاح`);
      }
      
      await loadMeetingData();
      resetBulkUploadForm();
    } catch (error) {
      console.error("Error bulk uploading meeting photos:", error);
      toast.error("خطأ في رفع صور اللقاءات");
    } finally {
      setLoading(false);
    }
  };

  const resetBulkUploadForm = () => {
    setBulkUploadForm({
      category: "",
      images: [],
      metadata: {}
    });
    setIsDialogOpen(false);
  };

  const clearBulkUploadForm = () => {
    setBulkUploadForm({
      category: "",
      images: [],
      metadata: {}
    });
  };

  const handleBulkImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setBulkUploadForm(prev => ({
      ...prev,
      images: files,
      metadata: files.reduce((acc, _, index) => ({
        ...acc,
        [index]: { title: "", description: "", is_featured: false }
      }), {})
    }));
  };

  const updateImageMetadata = (index: number, field: 'title' | 'description' | 'is_featured', value: string | boolean) => {
    setBulkUploadForm(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [index]: {
          ...prev.metadata[index],
          [field]: value
        }
      }
    }));
  };

  const removeImage = (index: number) => {
    setBulkUploadForm(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const newMetadata: Record<number, { title: string; description: string; is_featured: boolean }> = {};
      
      // Reindex metadata
      newImages.forEach((_, newIndex) => {
        const oldIndex = prev.images.indexOf(newImages[newIndex]);
        newMetadata[newIndex] = prev.metadata[oldIndex] || { title: "", description: "", is_featured: false };
      });
      
      return {
        ...prev,
        images: newImages,
        metadata: newMetadata
      };
    });
  };

  const openDialog = (type: 'meeting-category' | 'meeting-photo' | 'bulk-upload') => {
    setDialogType(type);
    setEditingItem(null);
    
    if (type === 'meeting-category') {
      clearMeetingCategoryForm();
    } else if (type === 'meeting-photo') {
      clearMeetingPhotoForm();
    } else if (type === 'bulk-upload') {
      clearBulkUploadForm();
    }
    
    setIsDialogOpen(true);
  };

  const openPhotoDialogForCategory = (categoryId: number) => {
    setDialogType('meeting-photo');
    setEditingItem(null);
    clearMeetingPhotoForm();
    setMeetingPhotoForm(prev => ({
      ...prev,
      category: categoryId.toString()
    }));
    setIsDialogOpen(true);
  };

  const openBulkUploadForCategory = (categoryId: number) => {
    setDialogType('bulk-upload');
    setEditingItem(null);
    clearBulkUploadForm();
    setBulkUploadForm(prev => ({
      ...prev,
      category: categoryId.toString()
    }));
    setIsDialogOpen(true);
  };

  const navigateToCategory = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setActiveTab('meeting-photos');
  };

  const navigateBack = () => {
    setSelectedCategory(null);
    setActiveTab('meeting-categories');
  };

  const filteredMeetingPhotos = selectedCategory 
    ? meetingPhotos.filter(p => p.category === selectedCategory)
    : meetingPhotos;

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meeting-categories" className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            فئات اللقاءات ({meetingCategories.length})
          </TabsTrigger>
          <TabsTrigger value="meeting-photos" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            صور اللقاءات ({filteredMeetingPhotos.length})
          </TabsTrigger>
        </TabsList>

        {/* Meeting Categories Tab */}
        <TabsContent value="meeting-categories" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">إدارة فئات اللقاءات</h3>
            <Button 
              onClick={() => openDialog('meeting-category')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة فئة جديدة
            </Button>
          </div>

          <div className="grid gap-4">
            {meetingCategories.map((category) => (
              <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToCategory(category.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{category.name}</h4>
                      {category.description && <p className="text-gray-600">{category.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{category.photos_count} صورة</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBulkUploadForCategory(category.id);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMeetingCategoryEdit(category);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMeetingCategoryDelete(category.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Meeting Photos Tab */}
        <TabsContent value="meeting-photos" className="mt-6">
          {/* Navigation Breadcrumb */}
          {selectedCategory && (
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <button
                onClick={navigateBack}
                className="hover:text-primary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة إلى الفئات
              </button>
              <span>/</span>
              <span className="text-primary">
                {meetingCategories.find(c => c.id === selectedCategory)?.name}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">
                {selectedCategory 
                  ? `صور ${meetingCategories.find(c => c.id === selectedCategory)?.name}`
                  : 'إدارة صور اللقاءات'}
              </h3>
              {selectedCategory && (
                <p className="text-gray-600">إدارة صور هذه الفئة</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => selectedCategory 
                  ? openPhotoDialogForCategory(selectedCategory)
                  : openDialog('meeting-photo')
                }
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة صورة جديدة
              </Button>
              <Button 
                onClick={() => selectedCategory 
                  ? openBulkUploadForCategory(selectedCategory)
                  : openDialog('bulk-upload')
                }
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                رفع متعدد
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeetingPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {photo.image_url || photo.image ? (
                    <img 
                      src={photo.image_url || photo.image} 
                      alt={photo.title_ar}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{photo.title_ar}</h4>
                  {photo.description_ar && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description_ar}</p>
                  )}
                  <p className="text-sm text-gray-500 mb-3">{photo.category_name}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {photo.is_featured && (
                      <Badge variant="outline" className="text-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        مميز
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMeetingPhotoEdit(photo)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleMeetingPhotoDelete(photo.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Meeting Category Form Dialog */}
      {isDialogOpen && dialogType === 'meeting-category' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? "تعديل فئة اللقاءات" : "إضافة فئة جديدة"}
              </h2>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleMeetingCategorySubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم الفئة *</Label>
                <Input
                  id="name"
                  value={meetingCategoryForm.name}
                  onChange={(e) => setMeetingCategoryForm({...meetingCategoryForm, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">وصف الفئة</Label>
                <Textarea
                  id="description"
                  value={meetingCategoryForm.description}
                  onChange={(e) => setMeetingCategoryForm({...meetingCategoryForm, description: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="color">لون الفئة</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={meetingCategoryForm.color}
                    onChange={(e) => setMeetingCategoryForm({...meetingCategoryForm, color: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    value={meetingCategoryForm.color}
                    onChange={(e) => setMeetingCategoryForm({...meetingCategoryForm, color: e.target.value})}
                    placeholder="#3B82F6"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setMeetingCategoryForm({...meetingCategoryForm, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        meetingCategoryForm.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetMeetingCategoryForm}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "جاري الحفظ..." : (editingItem ? "تحديث" : "إنشاء")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meeting Photo Form Dialog */}
      {isDialogOpen && dialogType === 'meeting-photo' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingItem ? "تعديل صورة اللقاء" : "إضافة صورة جديدة"}
              </h2>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleMeetingPhotoSubmit} className="space-y-4">
              <div>
                <Label htmlFor="photo_title_ar">عنوان الصورة *</Label>
                <Input
                  id="photo_title_ar"
                  value={meetingPhotoForm.title_ar}
                  onChange={(e) => setMeetingPhotoForm({...meetingPhotoForm, title_ar: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="photo_description_ar">وصف الصورة</Label>
                <Textarea
                  id="photo_description_ar"
                  value={meetingPhotoForm.description_ar}
                  onChange={(e) => setMeetingPhotoForm({...meetingPhotoForm, description_ar: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="photo_category">الفئة *</Label>
                  <Select value={meetingPhotoForm.category || undefined} onValueChange={(value) => setMeetingPhotoForm({...meetingPhotoForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="photo_image">الصورة {editingItem ? '' : '*'}</Label>
                  <Input
                    id="photo_image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMeetingPhotoForm({...meetingPhotoForm, image: e.target.files?.[0] || null})}
                    required={!editingItem}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="is_featured">صورة مميزة</Label>
                  <Switch
                    id="is_featured"
                    checked={meetingPhotoForm.is_featured}
                    onCheckedChange={(checked) => setMeetingPhotoForm({...meetingPhotoForm, is_featured: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetMeetingPhotoForm}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "جاري الحفظ..." : (editingItem ? "تحديث" : "إنشاء")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Dialog */}
      {isDialogOpen && dialogType === 'bulk-upload' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">رفع متعدد لصور اللقاءات</h2>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleBulkUpload} className="space-y-6">
              <div>
                <Label htmlFor="bulk_category">الفئة *</Label>
                <Select value={bulkUploadForm.category || undefined} onValueChange={(value) => setBulkUploadForm({...bulkUploadForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bulk_images">اختر الصور *</Label>
                <Input
                  id="bulk_images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleBulkImagesSelect}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">يمكنك اختيار عدة صور في نفس الوقت</p>
              </div>

              {bulkUploadForm.images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">الصور المحددة ({bulkUploadForm.images.length})</h3>
                  <p className="text-sm text-gray-600">اسم الصورة ووصفها اختياريان. إذا لم تدخل اسماً، سيتم إعطاء اسم افتراضي.</p>
                  
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {bulkUploadForm.images.map((image, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{image.name}</p>
                              <p className="text-xs text-gray-500">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`title_${index}`} className="text-sm">اسم الصورة (اختياري)</Label>
                            <Input
                              id={`title_${index}`}
                              value={bulkUploadForm.metadata[index]?.title || ""}
                              onChange={(e) => updateImageMetadata(index, 'title', e.target.value)}
                              placeholder="اترك فارغاً للاسم الافتراضي"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`description_${index}`} className="text-sm">وصف الصورة (اختياري)</Label>
                            <Input
                              id={`description_${index}`}
                              value={bulkUploadForm.metadata[index]?.description || ""}
                              onChange={(e) => updateImageMetadata(index, 'description', e.target.value)}
                              placeholder="وصف الصورة"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`featured_${index}`} className="text-sm">صورة مميزة</Label>
                            <Switch
                              id={`featured_${index}`}
                              checked={bulkUploadForm.metadata[index]?.is_featured || false}
                              onCheckedChange={(checked) => updateImageMetadata(index, 'is_featured', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetBulkUploadForm}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={loading || bulkUploadForm.images.length === 0}>
                  {loading ? "جاري الرفع..." : `رفع ${bulkUploadForm.images.length} صور`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingPhotos;