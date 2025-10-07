"use client";

import { useEffect, useState } from "react";
import QuestionListHeader from "./question-list/QuestionListHeader";
import QuestionList from "./question-list/QuestionList";
import { HelpCircle, FileText, MessageSquareWarning } from "lucide-react";
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

interface SectionData {
  [category: string]: CategoryData;
}

interface ContextData {
  informasi: SectionData;
  pengaduan: SectionData;
  administrasi: SectionData;
}

interface QuestionListViewProps {
  section: "informasi" | "pengaduan" | "administrasi";
  category: string;
  onBack: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  HelpCircle,
  FileText,
  MessageSquareWarning,
};

function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || HelpCircle;
}

export default function QuestionListView({
  section,
  category,
  onBack,
}: QuestionListViewProps) {
  const [contextData, setContextData] = useState<ContextData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/context.json")
      .then((res) => res.json())
      .then((data) => {
        setContextData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal load context.json:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sky-600">
        Memuat data...
      </div>
    );
  }

  if (!contextData) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <p className="mb-4 text-base font-semibold text-slate-800">
            Gagal memuat data dari context.json.
          </p>
          <button
            onClick={onBack}
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Kembali ke pilihan kategori
          </button>
        </div>
      </div>
    );
  }

  const categoryData = contextData[section]?.[category];
  const questions = categoryData?.questions || [];

  if (!questions.length) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <p className="mb-4 text-base font-semibold text-slate-800">
            Informasi untuk kategori ini belum tersedia.
          </p>
          <button
            onClick={onBack}
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Kembali ke pilihan kategori
          </button>
        </div>
      </div>
    );
  }

  const meta = {
    title: categoryData.title,
    description: categoryData.description,
    icon: getIcon(categoryData.icon),
  };

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-sky-50 via-white to-white px-4 py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <QuestionListHeader
          category={category}
          onBack={onBack}
          meta={meta}
          questionCount={questions.length}
        />
        <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-sky-100">
          <QuestionList
            category={category}
            section={section}
            questions={questions}
          />
        </div>
      </div>
    </div>
  );
}
