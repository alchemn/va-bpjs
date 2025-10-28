"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  MessageSquareQuote,
  Mic,
  Square,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// === Speech Recognition Setup ===
interface SpeechRecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
type SpeechRecognitionErrorEventLike = { error?: string; message?: string };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const getSpeechRecognitionCtor = (): SpeechRecognitionConstructor | null => {
  if (typeof window === "undefined") return null;
  const { SpeechRecognition, webkitSpeechRecognition } = window;
  return SpeechRecognition ?? webkitSpeechRecognition ?? null;
};

// === Category Types ===
interface QAItem {
  q: string;
  a: string[];
}
interface CategoryData {
  title: string;
  question: QAItem[];
}

// === Replace pattern (WhatsApp etc) ===
const replacements = [
  {
    find: "Whatsuapp",
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
  replacements.map((r) => r.find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "gi"
);
const replaceMap = new Map(replacements.map((r) => [r.find.toLowerCase(), r.html]));

const formatAnswerText = (items: string[]) =>
  items
    .map((item) => {
      if (!item) return "";
      return item.replace(replacePattern, (match) => replaceMap.get(match.toLowerCase()) || match);
    })
    .join("<br />");

// === Main Component ===
export default function InformasiPage() {
  const [inputValue, setInputValue] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // kategori
  const [categories, setCategories] = useState<Array<{ key: string } & CategoryData>>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // kategori

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
      }
    };
    fetchData();
  }, []);

  const submitQuestion = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed) return;
    if (loading) return;

    setLoading(true);
    setUserQuestion(trimmed);
    setAnswer("");
    setTypedAnswer("");

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      setAnswer(data.answer || "Maaf, belum ada jawaban.");
      setInputValue("");
    } catch {
      console.error("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitQuestion(inputValue);
  };

  const startRecording = () => {
    if (isRecording || loading) return;
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor)
      return setRecordingError("Browser Anda tidak mendukung speech recognition.");

    const recognition = new Ctor();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript || "";
      setInputValue(transcript);
      submitQuestion(transcript);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => recognitionRef.current?.stop();

  // efek ngetik & suara VA
  useEffect(() => {
    if (!answer) {
      setTypedAnswer("");
      return;
    }
    const synth = window.speechSynthesis;
    let isCancelled = false;
    let i = 0;

    const typingTimer = setInterval(() => {
      if (isCancelled) return;
      setTypedAnswer(answer.slice(0, i));
      i++;
      if (i > answer.length) clearInterval(typingTimer);
    }, 25);

    try {
      if (synth) {
        let voices = synth.getVoices();
        if (voices.length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            voices = synth.getVoices();
          };
        }

        const voice =
          voices.find((v) => v.lang.startsWith("id")) ||
          voices.find((v) => v.lang.startsWith("en")) ||
          null;

        const sentences = answer.split(/([.!?])\s+/);
        let idx = 0;

        const speakNext = () => {
          if (idx >= sentences.length || isCancelled) return;
          const part = sentences[idx];
          if (!part.trim()) {
            idx++;
            return speakNext();
          }

          const utter = new SpeechSynthesisUtterance(part);
          utter.lang = voice?.lang || "id-ID";
          utter.voice = voice;
          utter.rate = 0.9;
          utter.pitch = 1.05;
          utter.onend = () => {
            idx++;
            setTimeout(speakNext, 400);
          };
          synth.speak(utter);
        };

        synth.cancel();
        speakNext();
      }
    } catch (err) {
      console.error("Speech synthesis error:", err);
    }

    return () => {
      isCancelled = true;
      synth.cancel();
      clearInterval(typingTimer);
    };
  }, [answer]);

  useEffect(() => {
    if (!selectedAnswer || !openDialog) return;
    let i = 0;
    setTypedText("");
    const t = setInterval(() => {
      setTypedText(selectedAnswer.slice(0, i));
      i++;
      if (i > selectedAnswer.length) clearInterval(t);
    }, 15);
    return () => clearInterval(t);
  }, [selectedAnswer, openDialog]);

  // === UI ===
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 via-white to-white px-4 py-8">
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-green-100">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-green-500">
              <MessageCircle className="h-4 w-4" />
              Virtual Assistant BPJS
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Pusat Informasi BPJS Kesehatan
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </header>

        {/* Chat Section */}
        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-green-100">
          <div className="space-y-6">
            {/* === Mulai Percakapan Box === */}
            {!userQuestion && (
              <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-8 text-slate-600">
                <div className="flex flex-col items-center text-center">
                  <MessageSquareQuote className="h-12 w-12 text-green-400" />
                  <p className="text-lg font-semibold text-slate-900">
                    Mulai Percakapan
                  </p>
                </div>

                {/* === Category Buttons === */}
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => {
                          const combinedAnswers = cat.question
                            .map(
                              (qa) =>
                                `<p class='font-semibold text-green-700 mb-1'>${qa.q}</p><p class='mb-3'>${formatAnswerText(
                                  qa.a
                                )}</p>`
                            )
                            .join("<hr class='my-2' />");
                          setSelectedQuestion(cat.title);
                          setSelectedAnswer(combinedAnswers);
                          setOpenDialog(true);
                        }}
                        className="flex items-center justify-center text-center rounded-2xl px-4 py-3 text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 shadow-sm"
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === User Question + Answer === */}
            {userQuestion && (
              <>
                <div className="flex justify-end gap-3">
                  <div className="max-w-[75%] bg-green-600 text-white rounded-2xl px-4 py-3 text-sm shadow">
                    {userQuestion}
                  </div>
                </div>
                {loading ? (
                  <div className="flex gap-3 items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                    <span className="text-sm text-slate-500">Mencari jawaban...</span>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Image
                      src="/avatar/va.png"
                      alt="VA"
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full bg-green-50 border border-green-100"
                    />
                    <div className="max-w-[80%] bg-white rounded-2xl px-4 py-3 shadow ring-1 ring-green-100 text-sm text-slate-700">
                      {typedAnswer}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* === Input Box === */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <h1 className="font-semibold text-xl">Informasi Lainnya Tentang Program JKN BPJS Kesehatan</h1>
             <input
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  placeholder="Contoh: Bagaimana cara pendaftaran baru?"
  className="w-full rounded-xl border-2 border-green-500 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-green-400 focus:ring-2 focus:ring-green-400"
/>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
                    isRecording
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-4 w-4" /> Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" /> Gunakan Suara
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="flex items-center gap-2 rounded-full bg-green-600 text-white px-5 py-2 text-sm font-semibold shadow-sm hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Tunggu...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" /> Tanyakan
                    </>
                  )}
                </button>
              </div>
              {recordingError && <p className="text-xs text-rose-600">{recordingError}</p>}
            </form>
          </div>
        </section>
      </div>

      {/* === Modal Popup === */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-full max-w-3xl rounded-2xl [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle className="text-green-700 text-lg font-semibold">
              {selectedQuestion || "Jawaban Virtual Assistant"}
            </DialogTitle>
            <DialogClose asChild>
              <button
                className="absolute right-4 top-4 text-red-500 hover:text-red-600"
                aria-label="Tutup dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </DialogHeader>

          <div
            className="mt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: typedText || "Menampilkan jawaban...",
            }}
          ></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
