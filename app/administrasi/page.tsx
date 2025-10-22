"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CircleUser,
  MessageCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QAItem {
  q: string;
  a: string[];
}
interface CategoryData {
  title: string;
  question: QAItem[];
}

const formatAnswerText = (items: string[]) =>
  items
    .map((item) => {
      if (!item) return "";
      if (item.includes("Klik Link")) {
        return item.replace(
          "Klik Link ini",
          '<a href="https://meet.google.com/wvw-spoe-iij?pli=1" target="_blank" class="text-green-600 underline font-semibold">Klik Link ini</a>'
        );
      }
      return item;
    })
    .join("<br />");

export default function AdministrasiChatPage() {
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [typedText, setTypedText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{ key: string } & CategoryData>
  >([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );

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
    if (!answer) return setTypedText("");
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(answer.slice(0, i));
      i++;
      if (i > answer.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [answer]);

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
                {/* Daftar Kategori */}
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Menu Pertanyaan
                  </span>

                  {/* grid kategori */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const isOpen = expanded === cat.key;
                      return (
                        <div
                          key={cat.key}
                          className={`${isOpen ? "col-span-2 sm:col-span-3" : ""}`}
                        >
                          <button
                            onClick={() =>
                              setExpanded((prev) =>
                                prev === cat.key ? null : cat.key
                              )
                            }
                            className={`flex items-center justify-between w-full rounded-2xl px-4 py-3 text-xs font-semibold transition-all ${
                              isOpen
                                ? "bg-green-600 text-white shadow"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            <span className="truncate">{cat.title}</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                isOpen ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="content"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-green-200 bg-slate-50 rounded-2xl p-4 mt-2"
                              >
                                {cat.question.map((qa) => {
                                  const id = `${cat.key}-${qa.q}`;
                                  const active = selectedQuestionId === id;
                                  return (
                                    <button
                                      key={id}
                                      onClick={() => {
                                        setSelectedQuestionId(id);
                                        setQuestion(qa.q);
                                        setAnswer(formatAnswerText(qa.a));
                                      }}
                                      className={`w-full text-left rounded-xl px-4 py-3 text-sm transition mb-2 ${
                                        active
                                          ? "bg-green-600 text-white font-medium shadow"
                                          : "bg-white text-slate-700 hover:bg-slate-100"
                                      }`}
                                    >
                                      {qa.q}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700">
                        <CircleUser className="h-5 w-5" />
                      </div>
                      <div className="max-w-[75%] rounded-2xl rounded-br-none bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
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
                      className="h-11 w-11 rounded-full border border-green-100 bg-green-50 object-cover"
                    />
                    <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-lg ring-1 ring-green-100 typing-cursor">
                      <div
                        className="whitespace-pre-line"
                        dangerouslySetInnerHTML={{
                          __html:
                            typedText ||
                            "Silahkan pilih pertanyaan yang anda inginkan pada daftar di atas.",
                        }}
                      />
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
