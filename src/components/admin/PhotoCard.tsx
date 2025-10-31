import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star, Image as ImageIcon } from "lucide-react";

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

interface PhotoCardProps {
  photo: Photo;
  onEdit: (photo: Photo) => void;
  onDelete: (id: number) => void;
}

const PhotoCard = ({ photo, onEdit, onDelete }: PhotoCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        {photo.image ? (
          <img 
            src={photo.image} 
            alt={photo.alt_text_ar || photo.title_ar}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{photo.title_ar}</h3>
        <p className="text-sm text-gray-600 mb-3">{photo.category_name}</p>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={photo.is_active ? "default" : "secondary"}>
            {photo.is_active ? "نشط" : "غير نشط"}
          </Badge>
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
            onClick={() => onEdit(photo)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(photo.id)}
            className="text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoCard;


