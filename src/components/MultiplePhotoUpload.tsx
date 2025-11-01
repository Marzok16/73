import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Plus,
  Save,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface PhotoItem {
  id: string;
  file: File;
  title_ar: string;
  description_ar: string;
  is_featured: boolean;
  preview: string;
}

interface MultiplePhotoUploadProps {
  categoryId: string;
  onUploadComplete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MultiplePhotoUpload: React.FC<MultiplePhotoUploadProps> = ({
  categoryId,
  onUploadComplete,
  onCancel,
  isLoading = false
}) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Token ${token}` } : {};
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: PhotoItem[] = [];
    
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: PhotoItem = {
            id: generateId(),
            file,
            title_ar: `صورة تذكارية ${photos.length + newPhotos.length + 1}`,
            description_ar: '',
            is_featured: false,
            preview: e.target?.result as string
          };
          newPhotos.push(newPhoto);
          
          // Update state when all files are processed
          if (newPhotos.length === files.length) {
            setPhotos(prev => [...prev, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updatePhoto = (id: string, field: keyof PhotoItem, value: any) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, [field]: value } : photo
    ));
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const handleBulkUpload = async () => {
    if (photos.length === 0) {
      toast.error("يرجى اختيار صور للرفع");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('category', categoryId);

      photos.forEach((photo, index) => {
        formData.append(`photos[${index}][image]`, photo.file);
        formData.append(`photos[${index}][title_ar]`, photo.title_ar);
        formData.append(`photos[${index}][description_ar]`, photo.description_ar);
        formData.append(`photos[${index}][is_featured]`, photo.is_featured.toString());
      });

      const response = await fetch(`${API_BASE}/memory-photos/bulk_upload/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photos');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success(`تم رفع ${result.uploaded_count} صورة بنجاح`);
        if (result.failed_count > 0) {
          toast.warning(`فشل رفع ${result.failed_count} صورة`);
        }
        onUploadComplete();
      } else {
        throw new Error('Upload failed');
      }

    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error("فشل في رفع الصور");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Selection Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        <label 
          htmlFor="photo-upload" 
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-700">
              اختر صور متعددة للرفع
            </p>
            <p className="text-sm text-gray-500">
              اضغط لاختيار الصور أو اسحبها هنا
            </p>
          </div>
          <Button type="button" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            اختيار الصور
          </Button>
        </label>
      </div>

      {/* Selected Photos List */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              الصور المختارة ({photos.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPhotos([])}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              مسح الكل
            </Button>
          </div>

          <div className="grid gap-4">
            {photos.map((photo, index) => (
              <Card key={photo.id} className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                  {/* Image Preview */}
                  <div className="relative">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={photo.preview}
                        alt={photo.title_ar}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-8 h-8 p-0"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Photo Details */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`title-${photo.id}`}>
                          عنوان الصورة (اختياري)
                        </Label>
                        <Input
                          id={`title-${photo.id}`}
                          value={photo.title_ar}
                          onChange={(e) => updatePhoto(photo.id, 'title_ar', e.target.value)}
                          placeholder="أدخل عنوان الصورة"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor={`featured-${photo.id}`}>
                          صورة مميزة
                        </Label>
                        <Switch
                          id={`featured-${photo.id}`}
                          checked={photo.is_featured}
                          onCheckedChange={(checked) => updatePhoto(photo.id, 'is_featured', checked)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`description-${photo.id}`}>
                        وصف الصورة (اختياري)
                      </Label>
                      <Textarea
                        id={`description-${photo.id}`}
                        value={photo.description_ar}
                        onChange={(e) => updatePhoto(photo.id, 'description_ar', e.target.value)}
                        placeholder="أدخل وصف الصورة"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={uploading}
        >
          إلغاء
        </Button>
        <Button 
          onClick={handleBulkUpload}
          disabled={photos.length === 0 || uploading}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              جاري الرفع...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              رفع الصور ({photos.length})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MultiplePhotoUpload;