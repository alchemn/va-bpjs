import { ArrowLeft, ClipboardList } from "lucide-react";

interface QuestionListHeaderProps {
  category: string;
  onBack: () => void;
  meta: {
    title: string;
    description?: string;
  };
  questionCount: number;
}

function formatCategoryLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function QuestionListHeader({ category, onBack, meta, questionCount }: QuestionListHeaderProps) {
  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-900 hover:ring-sky-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke kategori
      </button>

      <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-sky-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-500">
              {formatCategoryLabel(category)}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              {meta.title}
            </h2>
            {meta.description && (
              <p className="text-sm leading-relaxed text-slate-600">
                {meta.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-sky-50 px-4 py-3 text-sky-700">
            <ClipboardList className="h-5 w-5" />
            <span className="text-sm font-medium">
              {questionCount} pertanyaan siap dibaca
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
