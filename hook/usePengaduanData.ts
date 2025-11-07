"use client";
import { useEffect, useState } from "react";
import { QAItem, CategoryData } from "@/types";

export function usePengaduanData() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/context.json");
        if (!res.ok) throw new Error("Gagal memuat data.");
        const data = await res.json();
        
        const pengaduanSection = data.pengaduan;
        if (!pengaduanSection) throw new Error("Seksi pengaduan tidak ditemukan.");

        const firstCategoryKey = Object.keys(pengaduanSection)[0];
        const firstCategory: CategoryData = pengaduanSection[firstCategoryKey];
        const firstQA: QAItem | undefined = firstCategory.questions?.[0];

        if (firstQA) {
          setQuestion(firstQA.q);
          setAnswer(firstQA.a);
        } else {
          throw new Error("Tidak ada pertanyaan di seksi pengaduan.");
        }
      } catch (err: unknown) {
        setError((err as Error).message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { question, answer, loading, error };
}
