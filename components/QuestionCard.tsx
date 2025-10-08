import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface QuestionCardProps {
  section: string;
  category: string;
  question: string;
  index?: number;
}

export function QuestionCard({ section, category, question, index }: QuestionCardProps) {
  return (
    <Link
      href={`/chat?section=${section}&category=${category}&q=${encodeURIComponent(
        question
      )}`}
    >
      <div className="group relative mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        <div className="flex items-center gap-4">
          {typeof index === "number" && (
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
              {index.toString().padStart(2, "0")}
            </span>
          )}
          <p className="flex-1 text-base font-medium text-slate-900">{question}</p>
          <ArrowUpRight className="h-5 w-5 text-sky-400 transition-colors duration-300 group-hover:text-sky-600" />
        </div>
      </div>
    </Link>
  );
}
