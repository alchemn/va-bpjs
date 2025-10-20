"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { speakTTS } from "@/lib/speak";
import {
  ArrowLeft,
  CircleUser,
  MessageCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";

// Definisikan tipe data agar sesuai dengan context.json
interface QAItem {
  q: string;
  a: string[];
}
interface CategoryData {
  title: string;
  question: QAItem[];
}
type AdministrasiData = Record<string, CategoryData>;

const sanitizeAnswerItem = (item: string) => item.replace(/^\d+\.\s*/, "").trim();
const formatAnswerText = (items: string[]) =>
  items
    .map((item, idx) => `${idx + 1}. ${sanitizeAnswerItem(item)}`)
    .join("\n");

export default function AdministrasiChatPage() {
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [typedText, setTypedText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ key: string } & CategoryData>>([]);
  const [expandedCategoryKey, setExpandedCategoryKey] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/administrasi.json");
        if (!res.ok) throw new Error("Gagal memuat data.");
        const data = await res.json();

        const administrasiData: AdministrasiData = data;
        const parsedCategories = Object.entries(administrasiData).map(
          ([key, value]) => ({ key, ...value })
        );

        if (!parsedCategories.length) {
          throw new Error("Data administrasi kosong.");
        }

        setCategories(parsedCategories);
        setExpandedCategoryKey(parsedCategories[0]?.key ?? null);
      } catch (err: unknown) {
        setError((err as Error).message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //Typing Effect Mas Bro
useEffect(() => {
  if (!answer) {
    setTypedText("");
    return;
  }

  let isCancelled = false;
  let typingTimer: NodeJS.Timeout | null = null;

  const startTyping = () => {
    setTypedText("");
    let index = 0;
    typingTimer = setInterval(() => {
      if (isCancelled || index >= answer.length) {
        if (typingTimer) clearInterval(typingTimer);
        return;
      }
      setTypedText((prev) => prev + answer.charAt(index));
      index++;
    }, 30);
  };

  startTyping();

  return () => {
    isCancelled = true;
    if (typingTimer) clearInterval(typingTimer);
  };
}, [answer]);

  // Efek mengetik & suara (TTS)
  // useEffect(() => {
  //   if (!answer) {
  //     setTypedText("");
  //     return;
  //   }

  //   let isCancelled = false;
  //   let typingTimer: NodeJS.Timeout | null = null;

  //   const startTyping = () => {
  //     setTypedText("");
  //     let index = 0;
  //     typingTimer = setInterval(() => {
  //       if (isCancelled || index >= answer.length) {
  //         if (typingTimer) clearInterval(typingTimer);
  //         return;
  //       }
  //       setTypedText((prev) => prev + answer.charAt(index));
  //       index++;
  //     }, 30);
  //   };

  //   const playAndType = async () => {
  //     if (audioRef.current) {
  //       audioRef.current.pause();
  //       audioRef.current.currentTime = 0;
  //     }
  //     try {
  //       const newAudio = await speakTTS(answer);
  //       audioRef.current = newAudio || null;
  //       if (!isCancelled) {
  //         startTyping();
  //         audioRef.current?.play().catch(console.warn);
  //       }
  //     } catch (err) {
  //       console.error("TTS Gagal:", err);
  //       if (!isCancelled) startTyping(); // Jika TTS gagal, tetap tampilkan teks
  //     }
  //   };

  //   playAndType();

  //   return () => {
  //     isCancelled = true;
  //     if (typingTimer) clearInterval(typingTimer);
  //     if (audioRef.current) {
  //       audioRef.current.pause();
  //       audioRef.current.src = "";
  //     }
  //   };
  // }, [answer]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-500">
              <MessageCircle className="h-4 w-4" />
              Virtual Assistant BPJS
            </p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Panduan Administrasi
            </h1>
            <p className="text-sm text-slate-600 md:text-base">
              Cari tahu cara kelola data dan pembayaran iuran dengan lebih terstruktur.
            </p>
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
        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100">
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Memuat percakapan...</span>
              </div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <>
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Menu Pertanyaan
                  </span>
                  <div className="grid gap-3 md:grid-cols-2">
                    {categories.map((category) => {
                      const isExpanded = expandedCategoryKey === category.key;
                      return (
                        <div
                          key={category.key}
                          className="flex flex-col rounded-2xl border border-slate-200 shadow-sm"
                        >
                          <button
                            className="flex w-full items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            onClick={() =>
                              setExpandedCategoryKey((prev) =>
                                prev === category.key ? null : category.key
                              )
                            }
                            aria-expanded={isExpanded}
                          >
                            <span className="uppercase tracking-wide text-xs text-slate-500">
                              {category.title}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                isExpanded ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
                              <div className="space-y-2">
                                {category.question.map((qa) => {
                                  const questionId = `${category.key}-${qa.q}`;
                                  const isActive = selectedQuestionId === questionId;
                                  return (
                                    <button
                                      key={questionId}
                                      onClick={() => {
                                        setSelectedQuestionId(questionId);
                                        setQuestion(qa.q);
                                        setAnswer(formatAnswerText(qa.a));
                                      }}
                                      className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                                        isActive
                                          ? "bg-sky-600 font-medium text-white shadow"
                                          : "bg-white text-slate-700 hover:bg-slate-100"
                                      }`}
                                    >
                                      {qa.q}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Pertanyaan Pengguna */}
                    {question && (
                                      <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Pertanyaan Anda
                  </span>
                  <div className="flex items-start justify-end gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                      <CircleUser className="h-5 w-5" />
                    </div>
                    <div className="max-w-[75%] rounded-2xl rounded-br-none bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
                      <p>{question}</p>
                    </div>
                  </div>
                </div>
                    )}
                {/* Jawaban Asisten */}
                <div aria-live="polite" className="flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Jawaban Virtual Assistant
                  </span>
                  <div className="flex gap-3">
                    <Image
                      src="/avatar/va.png"
                      alt="Virtual Assistant"
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full border border-sky-100 bg-sky-50 object-cover"
                    />
                    <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-lg ring-1 ring-sky-100 typing-cursor">
                      <p className="whitespace-pre-line">
                        {typedText ||
                          "Silahkan pilih pertanyaan yang anda inginkan pada daftar di atas. Saya siap membantu anda"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
