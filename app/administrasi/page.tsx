"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import {
  ArrowLeft,
  MessageCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface QAItem {
  q: string;
  a: string[];
}
interface CategoryData {
  title: string;
  question: QAItem[];
}

const replacements = [
  {
    find: "Klik Link ini",
    html: `<a href="https://meet.google.com/wvw-spoe-iij?pli=1" target="_blank"
            class="text-green-600 underline font-semibold">
            Klik Link ini</a>`,
  },
  {
    find: "Whatsuap",
    html: `<a href="https://wa.me/628118165165" target="_blank"
            class="inline-flex items-center gap-1 text-green-600 underline font-semibold">
            <img src="/image/wa.png" alt="Whatsapp" class="w-4 h-4" /> WhatsApp
          </a>`,
  },
  {
    find: "telepon",
    html: `<a href="tel:165" target="_blank" class="inline-flex items-center gap-1 text-green-600 underline font-semibold">
            <img src="/image/phon.png" alt="Phone" class="w-4 h-4" /> Telepon
          </a>`
  }
];

const replacePattern = new RegExp(
  replacements.map(r => r.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'gi'
);

const replaceMap = new Map(
  replacements.map(r => [r.find.toLowerCase(), r.html])
);

// ✅ Fungsi jadi super cepat
const formatAnswerText = (items: string[]) => 
  items
    .map(item => {
      if (!item) return "";
      return item.replace(replacePattern, match => 
        replaceMap.get(match.toLowerCase()) || match
      );
    })
    .join("<br />");

export default function AdministrasiChatPage() {
  const [categories, setCategories] = useState<
    Array<{ key: string } & CategoryData>
  >([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [typedText, setTypedText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  useEffect(() => {
    if (!answer || !openDialog) return;
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      setTypedText(answer.slice(0, i));
      i++;
      if (i > answer.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [answer, openDialog]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 via-white to-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-green-100 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-500">
              <MessageCircle className="h-4 w-4" />
              Virtual Assistant BPJS
            </p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Panduan Layanan Administrasi
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200 md:self-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </header>

        {/* Sesi Chat */}
        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-green-100">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Memuat data...</span>
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="space-y-6">
              {/* Pesan pembuka */}
              <div className="flex gap-3">
                <Image
                  src="/avatar/va.png"
                  alt="Virtual Assistant"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border border-green-100 bg-green-50 object-cover"
                />
                <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-lg ring-1 ring-green-100">
                  Silahkan pilih pelayanan yang anda inginkan pada daftar di
                  bawah ini.
                </div>
              </div>

              {/* Daftar Kategori */}
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Menu Pertanyaan
                </span>

                {/* Grid kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-start">
                  {categories.map((cat) => {
                    const isOpen = expanded === cat.key;
                    return (
                      <div
                        key={cat.key}
                        className={`transition-all duration-300 ${
                          isOpen ? "sm:col-span-2 md:col-span-3" : ""
                        }`}>
                        <div className="flex flex-col h-fit">
                          <button
                            onClick={() =>
                              setExpanded((prev) =>
                                prev === cat.key ? null : cat.key
                              )
                            }
                            className={`flex items-center justify-between w-full rounded-2xl px-4 py-3 text-xs font-semibold text-left transition-all ${
                              isOpen
                                ? "bg-green-600 text-white shadow"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}>
                            <span className="text-xs font-semibold whitespace-normal break-words leading-snug">
                              {cat.title}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 flex-shrink-0 ml-2 transition-transform ${
                                isOpen ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                key="content"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-green-200 bg-slate-50 rounded-2xl p-4 mt-2 shadow-inner">
                                {cat.question.map((qa) => (
                                  <button
                                    key={qa.q}
                                    onClick={() => {
                                      setQuestion(qa.q);
                                      setAnswer(formatAnswerText(qa.a));
                                      setOpenDialog(true);
                                    }}
                                    className="w-full text-left rounded-xl px-4 py-3 text-sm mb-2 bg-white text-slate-700 hover:bg-slate-100 transition">
                                    {qa.q}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>



              </div>
            </div>
          )}
        </section>
      </div>

      {/* Popup Dialog */}
<Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent className="w-full max-w-md md:max-w-3xl lg:max-w-5xl rounded-2xl [&>button:last-child]:hidden">
    <DialogHeader>
      <DialogTitle className="text-green-700 text-lg font-semibold">
        Jawaban Virtual Assistant
      </DialogTitle>

      <DialogClose asChild>
        <button
          className="absolute right-4 top-4 text-red-500 hover:text-red-600 transition-transform duration-200 hover:scale-110"
          aria-label="Tutup dialog"
        >
          <X className="h-5 w-5" />
        </button>
      </DialogClose>
    </DialogHeader>

    <div className="mt-4 text-sm leading-relaxed">
      {question && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="font-semibold text-green-700">{question}</p>
        </div>
      )}

      <div className="flex gap-3 items-start">
        <Image
          src="/avatar/va.png"
          alt="Virtual Assistant"
          width={44}
          height={44}
          className="h-11 w-11 rounded-full border border-green-100 bg-green-50 object-cover flex-shrink-0"
        />

        {/* Konten jawaban - diperlebar */}
        <div className="w-full md:max-w-[92%] rounded-2xl rounded-bl-none bg-white px-5 py-4 text-slate-700 shadow-lg ring-1 ring-green-100">
          <div
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: typedText || "Sedang menyiapkan jawaban...",
            }}
          />
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
}
