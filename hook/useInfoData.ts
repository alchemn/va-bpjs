import { useState, useEffect, useMemo } from "react";

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

export function useInfoData(section: "informasi" | "pengaduan" | "administrasi") {
  const [data, setData] = useState<Record<string, CategoryData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/context.json");
        if (!res.ok) {
          throw new Error("Failed to fetch context data");
        }
        const json = await res.json();
        if (!ignore) {
          setData(json[section] || {});
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Maaf, terjadi kesalahan saat memuat informasi.");
          setData({});
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [section, reloadKey]);

  const availableCategories = useMemo(() => Object.keys(data), [data]);
  const handleReload = () => setReloadKey((key) => key + 1);

  return { data, loading, error, availableCategories, handleReload };
}
