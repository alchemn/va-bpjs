"use client";
import { useEffect, useMemo, useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { CategoryCard } from "./CategoryCard";
import {
  HelpCircle,
  Smartphone,
  FileText,
  MessageSquareWarning,
  Sparkles,
  LifeBuoy,
  ClipboardList,
  ArrowLeft,
  LucideIcon,
} from "lucide-react";

interface QAItem {
  q: string;
  a: string;
}

interface InfoVAProps {
  section: "informasi" | "pengaduan" | "administrasi";
}

type CategoryDetails = {
  title: string;
  icon: LucideIcon;
  description?: string;
};

const categoryDetails: Record<string, CategoryDetails> = {
  yang_paling_sering_ditanyakan: {
    title: "Pertanyaan yang sering ditanyakan",
    icon: HelpCircle,
    description: "Rangkuman pertanyaan yang paling sering diajukan peserta BPJS."
  },
  pendaftaran: {
    title: "Prosedur Pendaftaran",
    icon: FileText,
    description: "Panduan langkah demi langkah untuk mendaftar BPJS Kesehatan."
  },
  "mau ngadu ?": {
    title: "Mau Ngadu?",
    icon: MessageSquareWarning,
    description: "Saluran pengaduan untuk membantu menyelesaikan keluhan Anda."
  },
};

const sectionCopy: Record<InfoVAProps["section"], {
  title: string;
  tagline: string;
  description: string;
  tips: string[];
}> = {
  informasi: {
    title: "Temukan Informasi BPJS Terkini",
    tagline: "Informasi dalam genggaman",
    description:
      "Jelajahi panduan, pertanyaan umum, dan penjelasan lengkap seputar layanan BPJS Kesehatan dengan tampilan yang lebih nyaman dibaca.",
    tips: [
      "Gunakan kategori untuk mempercepat pencarian informasi.",
      "Klik pertanyaan untuk melihat jawaban lengkap di ruang chat.",
      "Siapkan data kepesertaan Anda agar proses layanan lebih cepat.",
    ],
  },
  pengaduan: {
    title: "Sampaikan Keluhan dengan Mudah",
    tagline: "Kami siap mendampingi",
    description:
      "Temukan kanal dan panduan pengaduan resmi agar keluhan Anda dapat tersampaikan dan ditindaklanjuti dengan cepat.",
    tips: [
      "Pilih kategori pengaduan yang paling sesuai dengan kebutuhan Anda.",
      "Catat nomor tiket pengaduan untuk memantau tindak lanjut.",
      "Sertakan dokumen pendukung saat mengajukan keluhan.",
    ],
  },
  administrasi: {
    title: "Kelola Administrasi BPJS dengan Tenang",
    tagline: "Semua proses jadi lebih rapi",
    description:
      "Pelajari tata cara perubahan data, pembayaran iuran, dan pengelolaan administrasi lain secara praktis.",
    tips: [
      "Pastikan data peserta selalu diperbarui sebelum mengajukan layanan.",
      "Simpan bukti pembayaran dan arsip penting secara digital.",
      "Gunakan aplikasi Mobile JKN untuk urusan administrasi rutin.",
    ],
  },
};

function formatCategoryLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCategoryMeta(key: string): CategoryDetails {
  return (
    categoryDetails[key] || {
      title: formatCategoryLabel(key),
      icon: HelpCircle,
      description: `Informasi lengkap seputar ${formatCategoryLabel(key).toLowerCase()}.`,
    }
  );
}

export function InfoVA({ section }: InfoVAProps) {
  const [data, setData] = useState<Record<string, QAItem[] | QAItem>>({});
  const [category, setCategory] = useState<string | null>(null);
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

    setCategory(null);
    loadData();

    return () => {
      ignore = true;
    };
  }, [section, reloadKey]);

  const availableCategories = useMemo(() => Object.keys(data), [data]);
  const sectionMeta = sectionCopy[section];

  const handleReload = () => setReloadKey((key) => key + 1);

  if (loading) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-200/60" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-36 animate-pulse rounded-2xl bg-slate-200/60"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <p className="mb-4 text-base font-semibold text-slate-800">{error}</p>
          <p className="mb-6 text-sm text-slate-500">
            Coba segarkan halaman atau tekan tombol di bawah untuk memuat ulang.
          </p>
          <button
            onClick={handleReload}
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Muat ulang informasi
          </button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-sky-50 via-white to-white px-4 py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <section className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-sky-100">
            <div className="grid gap-6 px-8 py-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                  <Sparkles className="h-4 w-4" />
                  {sectionMeta.tagline}
                </span>
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  {sectionMeta.title}
                </h1>
                <p className="text-base leading-relaxed text-slate-600">
                  {sectionMeta.description}
                </p>
              </div>
              <div className="relative rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-6 text-white shadow-inner">
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),rgba(255,255,255,0))] opacity-80" />
                <div className="relative space-y-3">
                  <p className="text-lg font-semibold">Tips cepat</p>
                  <ul className="space-y-2 text-sm text-sky-50">
                    {sectionMeta.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2">
                        <LifeBuoy className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

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
                  const meta = getCategoryMeta(cat);
                  const questions = data[cat];
                  const questionCount = Array.isArray(questions)
                    ? questions.length
                    : questions
                    ? 1
                    : 0;

                  return (
                    <CategoryCard
                      key={cat}
                      icon={meta.icon}
                      title={meta.title}
                      description={meta.description}
                      badge={`${questionCount} pertanyaan`}
                      onClick={() => setCategory(cat)}
                    />
                  );
                })}
                <CategoryCard
                  icon={Smartphone}
                  title="Layanan Mobile JKN"
                  description="Nikmati layanan digital BPJS kapan pun, di mana pun."
                  badge="Segera hadir"
                  disabled
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                Belum ada informasi untuk ditampilkan.
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  const selectedQuestions = data[category];
  const categoryData = Array.isArray(selectedQuestions)
    ? selectedQuestions
    : selectedQuestions
    ? [selectedQuestions]
    : [];

  if (!categoryData.length) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <p className="mb-4 text-base font-semibold text-slate-800">
            Informasi untuk kategori ini belum tersedia.
          </p>
          <button
            onClick={() => setCategory(null)}
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Kembali ke pilihan kategori
          </button>
        </div>
      </div>
    );
  }

  const meta = getCategoryMeta(category);

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-sky-50 via-white to-white px-4 py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <button
          onClick={() => setCategory(null)}
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
                {categoryData.length} pertanyaan siap dibaca
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {categoryData.map((item, index) => (
              <QuestionCard
                key={item.q}
                section={section}
                category={category}
                question={item.q}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
