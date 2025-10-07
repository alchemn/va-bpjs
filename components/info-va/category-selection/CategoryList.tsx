import { CategoryCard } from "../../CategoryCard";
import { Smartphone, HelpCircle, FileText, MessageSquareWarning } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QAItem {
  q: string;
  a: string;
}

interface CategoryData {
  title: string;
  description: string;
  icon: string;
  questions: QAItem[];
}

interface CategoryListProps {
  availableCategories: string[];
  data: Record<string, CategoryData>;
  onCategoryClick: (category: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  HelpCircle,
  FileText,
  MessageSquareWarning,
  Smartphone,
};

function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || HelpCircle;
}

export default function CategoryList({ availableCategories, data, onCategoryClick }: CategoryListProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Jelajahi kategori
        </h2>
        <p className="text-sm text-slate-500">
          Pilih sesuai informasi yang Anda butuhkan.
        </p>
      </div>

      {availableCategories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableCategories.map((cat) => {
            const categoryData = data[cat];
            if (!categoryData) return null;

            const { title, description, icon, questions } = categoryData;
            const questionCount = questions?.length || 0;

            return (
              <CategoryCard
                key={cat}
                icon={getIcon(icon)}
                title={title}
                description={description}
                badge={`${questionCount} pertanyaan`}
                onClick={() => onCategoryClick(cat)}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
          Belum ada informasi untuk ditampilkan.
        </div>
      )}
    </section>
  );
}
