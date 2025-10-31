import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PhotoCard from "./PhotoCard";

interface Photo {
  id: number;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  image: string;
  thumbnail?: string;
  alt_text_ar?: string;
  alt_text_en?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  category: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface PhotosViewProps {
  photos: Photo[];
  selectedAlbumName: string;
  onPhotoEdit: (photo: Photo) => void;
  onPhotoDelete: (id: number) => void;
  onAddPhoto: () => void;
}

const PhotosView = ({
  photos,
  selectedAlbumName,
  onPhotoEdit,
  onPhotoDelete,
  onAddPhoto
}: PhotosViewProps) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">صور {selectedAlbumName}</h2>
          <p className="text-gray-600">إدارة صور هذا الألبوم</p>
        </div>
        <Button 
          onClick={onAddPhoto}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة صورة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onEdit={onPhotoEdit}
            onDelete={onPhotoDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotosView;


