"use client";
import { useEffect, useState } from "react";
import { CategoryData } from "@/types";

export function useInformasiData() {
  const [categories, setCategories] = useState<
    Array<{ key: string } & CategoryData>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/categoryinfo.json");
        if (!res.ok) throw new Error("Gagal memuat kategori.");
        const data = await res.json();
        const parsed = Object.entries(data).map(([key, value]) => ({
          key,
          ...(value as CategoryData),
        }));
        setCategories(parsed);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat kategori.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { categories, loading, error };
}
