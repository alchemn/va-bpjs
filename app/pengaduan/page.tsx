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

    // const playAndType = async () => {
    //   if (audioRef.current) {
    //     audioRef.current.pause();
    //     audioRef.current.currentTime = 0;
    //   }
    //   try {
    //     const newAudio = await speakTTS(answer);
    //     audioRef.current = newAudio || null;
    //     if (!isCancelled) {
    //       startTyping();
    //       audioRef.current?.play().catch(console.warn);
    //     }
    //   } catch (err) {
    //     console.error("TTS Gagal:", err);
    //     if (!isCancelled) startTyping(); // Jika TTS gagal, tetap tampilkan teks
    //   }
    // };

    const playAndType = async () => {
      try {
        if('speechSynthesis' in window){
          const utter = new SpeechSynthesisUtterance(answer)
          utter.lang ="id-ID";
          utter.rate = 0.9;
          utter.pitch= 1.1;
          utter.volume= 1;
          
          setTimeout(() => {
            window.speechSynthesis.speak(utter)
          },300)


          setTimeout(() => {
            if(!isCancelled) {
              startTyping()
            }
          },1200)
        }
      } catch (error) {
        console.error("Speech Error", error)
        if(!isCancelled){
          startTyping()
        }
      }
    }

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