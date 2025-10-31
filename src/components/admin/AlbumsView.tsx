import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AlbumCard from "./AlbumCard";

interface PhotoAlbum {
  id: number;
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  category: number;
  category_name: string;
  cover_photo?: number;
  cover_photo_url?: string;
  is_active: boolean;
  sort_order: number;
  photos_count: number;
  created_at: string;
  updated_at: string;
}

interface AlbumsViewProps {
  albums: PhotoAlbum[];
  selectedCategory: number | null;
  selectedCategoryName: string;
  onAlbumClick: (albumId: number) => void;
  onAlbumEdit: (album: PhotoAlbum) => void;
  onAlbumDelete: (id: number) => void;
  onAddAlbum: () => void;
}

const AlbumsView = ({
  albums,
  selectedCategory,
  selectedCategoryName,
  onAlbumClick,
  onAlbumEdit,
  onAlbumDelete,
  onAddAlbum
}: AlbumsViewProps) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">ألبومات {selectedCategoryName}</h2>
          <p className="text-gray-600">إدارة ألبومات هذه الفئة</p>
        </div>
        <Button 
          onClick={onAddAlbum}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة ألبوم جديد
        </Button>
      </div>

      <div className="grid gap-4">
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onEdit={onAlbumEdit}
            onDelete={onAlbumDelete}
            onClick={onAlbumClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AlbumsView;


