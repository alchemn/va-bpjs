"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { speakTTS } from "@/lib/speak";
import {
  ArrowLeft,
  CircleUser,
  LifeBuoy,
  Loader2,
  MessageCircle,
  MessageSquareQuote,
} from "lucide-react";

interface QAItem {
  q: string;
  a: string;
}

type SectionKey = "informasi" | "pengaduan" | "administrasi";

const sectionMeta: Record<
  SectionKey,
  {
    title: string;
    subtitle: string;
    tips: string[];
    backHref: string;
  }
> = {
  informasi: {
    title: "Percakapan Informasi BPJS",
    subtitle:
      "Jawaban cepat untuk pertanyaan seputar layanan dan fasilitas BPJS Kesehatan.",
    tips: [
      "Klik balon pertanyaan lain untuk berpindah topik.",
      "Gunakan tombol kembali untuk memilih kategori berbeda.",
      "Simpan informasi penting agar mudah diakses kembali.",
    ],
    backHref: "/informasi",
  },
  pengaduan: {
    title: "Pendampingan Pengaduan",
    subtitle:
      "Kami bantu arahkan langkah pengaduan Anda agar tersampaikan dengan baik.",
    tips: [
      "Siapkan nomor kepesertaan sebelum mengajukan pengaduan.",
      "Lengkapi kronologi dan bukti pendukung untuk respon lebih cepat.",
      "Catat nomor tiket yang diberikan petugas.",
    ],
    backHref: "/pengaduan",
  },
  administrasi: {
    title: "Panduan Administrasi",
    subtitle:
      "Cari tahu cara kelola data dan pembayaran iuran dengan lebih terstruktur.",
    tips: [
      "Perbarui data kepesertaan secara berkala.",
      "Gunakan aplikasi Mobile JKN untuk proses rutin.",
      "Simpan arsip bukti pembayaran di satu tempat.",
    ],
    backHref: "/administrasi",
  },
};

export default function ChatClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sectionParam = searchParams.get("section") as SectionKey | null;
  const category = searchParams.get("category");
  const question = searchParams.get("q");

  const [answer, setAnswer] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [thinking, setThinking] = useState(false);

  const IDLE_TIMEOUT = 30 * 1000; // 30 detik

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        router.push("/");
      }, IDLE_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [router, IDLE_TIMEOUT]);

  const meta = useMemo(() => {
    if (sectionParam && sectionParam in sectionMeta) return sectionMeta[sectionParam];
    return {
      title: "BPJS Virtual Assistant",
      subtitle:
        "Ajukan pertanyaan Anda dan dapatkan jawaban instan seputar layanan BPJS.",
      tips: [
        "Pilih kategori di halaman sebelumnya untuk menampilkan percakapan.",
        "Gunakan fitur pencarian di beranda untuk menemukan topik lain.",
        "Hubungi petugas BPJS bila membutuhkan bantuan lanjutan.",
      ],
      backHref: "/",
    };
  }, [sectionParam]);

  useEffect(() => {
    let ignore = false;
    const loadAnswer = async () => {
      if (!sectionParam || !category || !question) {
        if (!ignore) {
          setAnswer("");
          setTypedText("");
          setSuggestions([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/context.json");
        if (!res.ok) throw new Error("Failed to fetch context data");
        const data = await res.json();
        const categoryData = data?.[sectionParam]?.[category];
        const items = categoryData?.questions || [];

        if (!ignore) {
          const current = items.find((item: QAItem) => item.q === question);
          const cleanAnswer = current?.a ? String(current.a).trim() : "";
          const otherItems = items.filter((item: QAItem) => item.q !== question);

          setAnswer(cleanAnswer);
          setTypedText("");
          setSuggestions(otherItems);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError("Maaf, percakapan tidak dapat dimuat. Silakan coba lagi.");
          setAnswer("");
          setTypedText("");
          setSuggestions([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadAnswer();
    return () => {
      ignore = true;
    };
  }, [sectionParam, category, question, reloadKey]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!answer) {
      setTypedText("");
      return;
    }

    let isCancelled = false;
    let typingTimer: NodeJS.Timeout | null = null;
    let thinkingTimer: NodeJS.Timeout | null = null;

    const startTyping = (fullAnswer: string) => {
      let currentIndex = 0;
      let currentTypedText = "";
      typingTimer = setInterval(() => {
        if (isCancelled) {
          if (typingTimer) clearInterval(typingTimer);
          return;
        }
        if (currentIndex >= fullAnswer.length) {
          if (typingTimer) clearInterval(typingTimer);
          return;
        }
        currentTypedText += fullAnswer.charAt(currentIndex);
        setTypedText(currentTypedText);
        currentIndex += 1;
      }, 30);
    };

    const playAndType = async () => {
      setThinking(true);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      try {
        const newAudio = await speakTTS(answer);
        audioRef.current = newAudio || null;

        if (!isCancelled) {
          // kasih efek mikir 1,5 detik sebelum ngetik
          thinkingTimer = setTimeout(() => {
            if (!isCancelled) {
              setThinking(false);
              startTyping(answer);
              if (audioRef.current) {
                audioRef.current.play().catch((err) => {
                  if (err.name !== "AbortError") console.warn(err);
                });
              }
            }
          }, 1500);
        }
      } catch (err) {
        console.error("TTS error:", err);
        if (!isCancelled) {
          setThinking(false);
          startTyping(answer);
        }
      }
    };

    playAndType();

    return () => {
      isCancelled = true;
      setTypedText(""); // Reset text hanya di cleanup
      setThinking(false);
      if (typingTimer) clearInterval(typingTimer);
      if (thinkingTimer) clearTimeout(thinkingTimer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      
      }
    };
  }, [answer]);

  const handleRetry = () => setReloadKey((key) => key + 1);
  const hasQueryParams = Boolean(sectionParam && category && question);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* HEADER */}
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-500">
              <MessageCircle className="h-4 w-4" />
              Virtual Assistant BPJS
            </p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              {meta.title}
            </h1>
            <p className="text-sm text-slate-600 md:text-base">{meta.subtitle}</p>
          </div>
          <Link
            href={meta.backHref}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200 md:self-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </header>

        {/* CHAT */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100">
            {!hasQueryParams ? (
              <div className="flex flex-col items-center gap-4 text-center text-slate-600">
                <MessageSquareQuote className="h-12 w-12 text-sky-400" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-900">
                    Pilih pertanyaan terlebih dahulu
                  </p>
                  <p className="text-sm leading-relaxed">
                    Kembali ke halaman informasi dan pilih kategori serta pertanyaan
                    yang ingin dijawab oleh Virtual Assistant BPJS.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pertanyaan */}
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

                {/* Jawaban */}
                <div aria-live="polite" className="flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Jawaban Virtual Assistant
                  </span>

                  {loading ? (
                    <div className="flex gap-3">
                      <Image
                        src="/avatar/va.png"
                        alt="Virtual Assistant"
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full border border-sky-100 bg-sky-50 object-cover"
                      />
                      <div className="space-y-3">
                        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                        <div className="h-24 max-w-md animate-pulse rounded-2xl bg-slate-200" />
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 p-4 text-sm text-slate-600">
                      <p>{error}</p>
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Coba lagi
                      </button>
                    </div>
                  ) : thinking ? (
                    // Efek Mikir Dulu
                    <div className="flex gap-3 items-end">
                      <Image
                        src="/avatar/va.png"
                        alt="Virtual Assistant"
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full border border-sky-100 bg-sky-50 object-cover"
                      />
                      <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow ring-1 ring-sky-100">
                        <span className="animate-bounce delay-0 h-2 w-2 rounded-full bg-sky-400" />
                        <span className="animate-bounce delay-150 h-2 w-2 rounded-full bg-sky-400" />
                        <span className="animate-bounce delay-300 h-2 w-2 rounded-full bg-sky-400" />
                      </div>
                    </div>
                  ) : answer ? (
                    // Efek Ngetik
                    <div className="flex gap-3">
                      <Image
                        src="/avatar/va.png"
                        alt="Virtual Assistant"
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full border border-sky-100 bg-sky-50 object-cover"
                      />
                      <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-lg ring-1 ring-sky-100 typing-cursor">
                        <p>{typedText}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
                      <p>Belum ada jawaban yang tersedia untuk pertanyaan ini.</p>
                      <span className="text-xs text-slate-400">
                        Silakan pilih pertanyaan lain atau hubungi petugas BPJS.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          <div className="flex">
              <form>
                <label htmlFor="question">Question</label>
                <input type="text" id="question" placeholder="Silahkan Ketikkan Pertanyaan Anda Disini"/>
              </form>
          </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Tips penggunaan
              </h2>
              <ul className="space-y-3 text-sm text-slate-600">
                {meta.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                      <LifeBuoy className="h-3 w-3" />
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {hasQueryParams && suggestions.length > 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Pertanyaan lain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((item) => (
                    <Link
                      key={item.q}
                      href={`/chat?section=${sectionParam ?? ""}&category=${category ?? ""}&q=${encodeURIComponent(
                        item.q
                      )}`}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 transition hover:border-sky-200 hover:bg-sky-100"
                    >
                      <MessageCircle className="h-3 w-3" />
                      {item.q}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
