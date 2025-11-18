"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
// import { speakTTS } from "@/lib/speak";
import {
  ArrowLeft,
  CircleUser,
  MessageCircle,
  Loader2,
} from "lucide-react";

// Definisikan tipe data agar sesuai dengan context.json
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


export default function PengaduanChatPage() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // TODO: Investigate a bizarre rendering bug.
  // There appears to be an issue in the build or rendering pipeline where
  // the string "Terima kasih" sourced from `/context.json` is incorrectly
  // displayed as "Trima kasih".
  // As a temporary workaround, the string in `context.json` has been
  // intentionally set to "Teerima kasih". This forces the renderer to
  // output the correct "Terima kasih". This is not a permanent solution
  // and a proper fix for the underlying rendering bug should be investigated.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/context.json");
        if (!res.ok) throw new Error("Gagal memuat data.");
        const data = await res.json();
        
        const pengaduanSection = data.pengaduan;
        if (!pengaduanSection) throw new Error("Seksi pengaduan tidak ditemukan.");

        // Ambil kategori pertama dan pertanyaan pertama
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

  // Efek mengetik & suara (TTS)
  useEffect(() => {
    if (!answer) return;
     
    const currentAudio = audioRef.current;
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

const playAndType = async () => {
  try {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();

      // cari voice Indo, kalau gak ada fallback ke English
      const indoVoice =
        voices.find((v) => v.lang.startsWith("id")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        null;

      const sentences = answer.split(/([.!?])\s+/); // bagi jadi potongan kalimat
      let idx = 0;

      synth.cancel(); // biar gak dobel

      // fungsi rekursif: bacain per kalimat dengan jeda
      const speakNext = () => {
        if (idx >= sentences.length) return;
        const part = sentences[idx];
        if (!part.trim()) {
          idx++;
          return speakNext();
        }

        const utter = new SpeechSynthesisUtterance(part);
        utter.lang = indoVoice?.lang || "id-ID";
        utter.voice = indoVoice;
        utter.rate = 0.9;
        utter.pitch = 1.05;
        utter.volume = 1;

        utter.onend = () => {
          idx++;
          // jeda antar kalimat
          setTimeout(speakNext, 600 + Math.random() * 300);
        };

        synth.speak(utter);
      };

      // nunggu voice siap (kalau belum di-load browser)
      if (voices.length === 0) {
        await new Promise((resolve) => {
          window.speechSynthesis.onvoiceschanged = resolve;
        });
      }

      setTimeout(() => speakNext(), 400);

      // mulai efek typing setelah sedikit delay
      setTimeout(() => {
        if (!isCancelled) startTyping();
      }, 1200);
    } else {
      console.warn("Speech synthesis tidak tersedia di browser ini");
      startTyping();
    }
  } catch (error) {
    console.error("Speech Error", error);
    if (!isCancelled) startTyping();
  }
};

    playAndType();

    return () => {
      isCancelled = true;
      if (typingTimer) clearInterval(typingTimer);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
      if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
    };
  }, [answer]);

  const loggedRef = useRef(false);

  useEffect(() => {
    if (loggedRef.current) return; // cegah double run StrictMode
    loggedRef.current = true;

    const trackAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await fetch("/api/feature-access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subSubFeatureId: 4 }),
        });
      } catch (err) {
        console.error("Gagal mencatat log pengaduan:", err);
      }
    };

    trackAccess();
  }, []);


  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-500">
              <MessageCircle className="h-4 w-4" />
              Virtual Assistant BPJS
            </p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
               Pengaduan
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

                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Pertanyaan Anda
                  </span>
                  <div className="flex items-start justify-end gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-green-700">
                      <CircleUser className="h-5 w-5" />
                    </div>
                    <div className="max-w-[75%] rounded-2xl rounded-br-none bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
                      <p>{question}</p>
                    </div>
                  </div>
                </div>


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
                      <p>{typedText}</p>
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