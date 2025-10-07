"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import LoadingView from "./info-va/LoadingView";
import ErrorView from "./info-va/ErrorView";
import CategorySelectionView from "./info-va/CategorySelectionView";
import QuestionListView from "./info-va/QuestionListView";

// Tipe data yang sesuai dengan context.json
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

interface InfoVAProps {
  section: "informasi" | "pengaduan" | "administrasi";
}

export function InfoVA({ section }: InfoVAProps) {
  const [data, setData] = useState<Record<string, CategoryData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const router = useRouter();

  // Logika fetch data langsung di dalam komponen
  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/context.json");
        if (!res.ok) throw new Error("Gagal mengambil context.json");
        const json = await res.json();
        if (!ignore) {
          setData(json[section] || {});
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Gagal memuat data.");
          setData({});
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => { ignore = true; };
  }, [section]);

  const availableCategories = useMemo(() => Object.keys(data), [data]);

  const shouldRedirect = 
    !loading && 
    !error && 
    availableCategories.length === 1 && 
    data[availableCategories[0]]?.questions?.length === 1;

  useEffect(() => {
    if (shouldRedirect) {
      const singleCategoryKey = availableCategories[0];
      const singleQuestion = data[singleCategoryKey].questions[0];
      router.push(
        `/chat?section=${section}&category=${singleCategoryKey}&q=${encodeURIComponent(
          singleQuestion.q
        )}`
      );
    }
  }, [shouldRedirect, availableCategories, data, section, router]);

  if (loading || shouldRedirect) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} onReload={() => {}} />;
  }

  if (!category) {
    return (
      <CategorySelectionView
        section={section}
        availableCategories={availableCategories}
        data={data}
        onCategoryClick={setCategory}
      />
    );
  }

  return (
    <QuestionListView
      section={section}
      category={category}
      onBack={() => setCategory(null)}
    />
  );
}