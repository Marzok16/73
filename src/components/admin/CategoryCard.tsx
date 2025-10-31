import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  icon?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  photos_count: number;
  created_at: string;
  updated_at: string;
}

interface CategoryCardProps {
  category: Category;
  albumCount: number;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onClick: (categoryId: number) => void;
}

const CategoryCard = ({ category, albumCount, onEdit, onDelete, onClick }: CategoryCardProps) => {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onClick(category.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: category.color }}
          >
            {category.icon || category.name_ar.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{category.name_ar}</h3>
            <p className="text-gray-600">{category.name_en}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={category.is_active ? "default" : "secondary"}>
                {category.is_active ? "نشط" : "غير نشط"}
              </Badge>
              <Badge variant="outline">{category.photos_count} صورة</Badge>
              <Badge variant="outline">{albumCount} ألبوم</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(category);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category.id);
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

export default CategoryCard;


