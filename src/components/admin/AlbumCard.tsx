import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";

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

interface AlbumCardProps {
  album: PhotoAlbum;
  onEdit: (album: PhotoAlbum) => void;
  onDelete: (id: number) => void;
  onClick: (albumId: number) => void;
}

const AlbumCard = ({ album, onEdit, onDelete, onClick }: AlbumCardProps) => {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onClick(album.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            {album.cover_photo_url ? (
              <img 
                src={album.cover_photo_url} 
                alt={album.name_ar}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{album.name_ar}</h3>
            <p className="text-gray-600">{album.name_en}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={album.is_active ? "default" : "secondary"}>
                {album.is_active ? "نشط" : "غير نشط"}
              </Badge>
              <Badge variant="outline">{album.photos_count} صورة</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(album);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(album.id);
            }}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AlbumCard;


