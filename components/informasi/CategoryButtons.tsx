"use client";
import { CategoryData } from "@/types";
import { formatAnswerText } from "@/lib/format";

interface CategoryButtonsProps {
  categories: Array<{ key: string } & CategoryData>;
  onCategoryClick: (title: string, content: string) => void;
}

export function CategoryButtons({ categories, onCategoryClick }: CategoryButtonsProps) {
  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              const combinedAnswers = cat.question
                .map(
                  (qa) =>
                    `<p class='font-semibold text-green-700 mb-1'>${qa.q}</p><p class='mb-3'>${formatAnswerText(
                      qa.a
                    )}</p>`
                )
                .join("<hr class='my-2' />");
              onCategoryClick(cat.title, combinedAnswers);
            }}
            className="flex items-center justify-center text-center rounded-2xl px-4 py-3 text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 shadow-sm"
          >
            {cat.title}
          </button>
        ))}
      </div>
    </div>
  );
}
