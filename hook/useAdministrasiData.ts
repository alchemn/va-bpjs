"use client";
import { useEffect, useState } from "react";

interface QAItem {
  q: string;
  a: string[];
}
interface CategoryData {
  title: string;
  question: QAItem[];
}

export function useAdministrasiData() {
  const [categories, setCategories] = useState<
    Array<{ key: string } & CategoryData>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/administrasi.json");
        if (!res.ok) throw new Error("Gagal memuat data.");
        const data = await res.json();
        const parsed = Object.entries(data).map(([key, value]) => ({
          key,
          ...(value as CategoryData),
        }));
        setCategories(parsed);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { categories, loading, error };
}
