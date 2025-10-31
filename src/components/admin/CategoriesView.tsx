import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoryCard from "./CategoryCard";

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

interface PhotoAlbum {
  id: number;
  category: number;
}

interface CategoriesViewProps {
  categories: Category[];
  albums: PhotoAlbum[];
  onCategoryClick: (categoryId: number) => void;
  onCategoryEdit: (category: Category) => void;
  onCategoryDelete: (id: number) => void;
  onAddCategory: () => void;
  onAddQuickCategories: () => void;
}

const CategoriesView = ({
  categories,
  albums,
  onCategoryClick,
  onCategoryEdit,
  onCategoryDelete,
  onAddCategory,
  onAddQuickCategories
}: CategoriesViewProps) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة الفئات</h2>
        <div className="flex gap-2">
          <Button 
            onClick={onAddCategory}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة فئة جديدة
          </Button>
          <Button 
            variant="outline"
            onClick={onAddQuickCategories}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة فئات سريعة
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => {
          const categoryAlbums = albums.filter(album => album.category === category.id);
          return (
            <CategoryCard
              key={category.id}
              category={category}
              albumCount={categoryAlbums.length}
              onEdit={onCategoryEdit}
              onDelete={onCategoryDelete}
              onClick={onCategoryClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesView;


