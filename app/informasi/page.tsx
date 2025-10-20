"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { speakTTS } from "@/lib/speak";
import {
  ArrowLeft,
  CircleUser,
  Loader2,
  MessageCircle,
  MessageSquareQuote,
  Mic,
  Square,
} from "lucide-react";

interface SpeechRecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

type SpeechRecognitionErrorEventLike = {
  error?: string;
  message?: string;
};

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

const mapRecognitionError = (code: string): string => {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Izin mikrofon ditolak. Mohon izinkan akses mikrofon dan coba lagi.";
    case "no-speech":
      return "Tidak terdengar suara. Silakan coba lagi dan pastikan mikrofon Anda aktif.";
    case "audio-capture":
      return "Mikrofon tidak terdeteksi. Periksa perangkat audio Anda.";
    case "network":
      return "Terjadi masalah jaringan saat memproses suara.";
    default:
      return "Perekaman suara gagal. Silakan coba lagi.";
  }
};

interface ChatResponse {
  answer: string;
  matched?: string;
  confidence?: number;
}

export default function InformasiPage() {
  const [inputValue, setInputValue] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [matchedQuestion, setMatchedQuestion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] =
    useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupportsSpeechRecognition(Boolean(getSpeechRecognitionCtor()));
  }, []);

  const submitQuestion = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed) {
      setError("Silakan ketikkan pertanyaan terlebih dahulu.");
      return;
    }

    if (loading) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setLoading(true);
    setThinking(false);
    setError(null);
    setUserQuestion(trimmed);
    setAnswer("");
    setTypedAnswer("");
    setMatchedQuestion(null);
    setConfidence(null);

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      const data: ChatResponse & { error?: string } = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Gagal mendapatkan jawaban dari asisten.");
      }

      setAnswer(typeof data.answer === "string" ? data.answer : "");
      setMatchedQuestion(
        typeof data.matched === "string" && data.matched.length > 0
          ? data.matched
          : null
      );
      setConfidence(
        typeof data.confidence === "number" ? data.confidence : null
      );
      setInputValue("");
      setRecordingError(null);
    } catch (err) {
      console.error("Submit question error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memproses pertanyaan Anda.";
      setError(message);
      setThinking(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitQuestion(inputValue);
  };

  const startRecording = () => {
    if (isRecording || loading) return;

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setRecordingError(
        "Browser Anda belum mendukung konversi suara ke teks. Gunakan Chrome atau Edge versi terbaru."
      );
      return;
    }

    setRecordingError(null);

    const recognition = new Ctor();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let hasResult = false;

    recognition.onresult = (event) => {
      const list = Array.from(event.results ?? []);
      const transcript = list[0]?.[0]?.transcript?.trim() ?? "";

      if (!transcript) {
        setRecordingError("Audio tidak terbaca. Silakan coba lagi.");
        return;
      }

      hasResult = true;
      setRecordingError(null);
      setInputValue(transcript);
      void submitQuestion(transcript);
    };

    recognition.onerror = (event) => {
      hasResult = true;
      const code = event?.error ?? "unknown";
      setRecordingError(mapRecognitionError(code));
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
      if (!hasResult) {
        setRecordingError((prev) =>
          prev ?? "Tidak terdengar suara. Silakan coba lagi."
        );
      }
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Speech recognition start error:", err);
      recognitionRef.current = null;
      setIsRecording(false);
      setRecordingError("Perekaman suara gagal dimulai.");
    }
  };

  const stopRecording = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.stop();
    }
  };

  useEffect(() => {
  if ("speechSynthesis" in window) {
    const dummy = new SpeechSynthesisUtterance(" ");
    dummy.lang = "id-ID";
    window.speechSynthesis.speak(dummy);
  }
}, []);

  useEffect(() => {
    if (!answer) {
      setTypedAnswer("");
      return;
    }
    const currentAudio = audioRef.current;
    let isCancelled = false;
    let typingTimer: NodeJS.Timeout | null = null;
    const thinkingTimer: NodeJS.Timeout | null = null;

    const startTyping = (fullText: string) => {
      let index = 0;
      let buffer = "";
      typingTimer = setInterval(() => {
        if (isCancelled) {
          if (typingTimer) clearInterval(typingTimer);
          return;
        }
        if (index >= fullText.length) {
          if (typingTimer) clearInterval(typingTimer);
          return;
        }
        buffer += fullText.charAt(index);
        setTypedAnswer(buffer);
        index += 1;
      }, 30);
    };

    // const playAndType = async () => {
    //   setThinking(true);
    //   try {
    //     const newAudio = await speakTTS(answer);
    //     audioRef.current = newAudio || null;

    //     thinkingTimer = setTimeout(() => {
    //       if (isCancelled) return;
    //       setThinking(false);
    //       startTyping(answer);
    //       if (audioRef.current) {
    //         audioRef.current
    //           .play()
    //           .catch((err) => err.name !== "AbortError" && console.warn(err));
    //       }
    //     }, 1200);
    //   } catch (err) {
    //     console.error("TTS error:", err);
    //     if (!isCancelled) {
    //       setThinking(false);
    //       startTyping(answer);
    //     }
    //   }
    // };

    const playAndType = async () => {
      setThinking(true)
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
              setThinking(false);
              startTyping(answer)
            }
          },1200)
        }
      } catch (error) {
        console.error("Speech Error", error)
        if(!isCancelled){
          setThinking(false)
          startTyping(answer)
        }
      }
    }

    playAndType();

    return () => {
      isCancelled = true;
      setThinking(false);
      if (typingTimer) clearInterval(typingTimer);
      if (thinkingTimer) clearTimeout(thinkingTimer);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [answer]);

  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.onend = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const disableSubmit = loading || isRecording;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-500">
              <MessageCircle className="h-4 w-4" />
              Virtual Assistant BPJS
            </p>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Pusat Informasi BPJS
            </h1>
            <p className="text-sm text-slate-600 md:text-base">
              Ajukan pertanyaan Anda. Asisten virtual akan membaca data{" "}
              <code>context.json</code> untuk menemukan jawaban yang paling
              relevan.
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

        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100">
          <div className="space-y-6">
            {userQuestion ? (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Pertanyaan Anda
                </span>
                <div className="flex items-start justify-end gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                    <CircleUser className="h-5 w-5" />
                  </div>
                  <div className="max-w-[75%] rounded-2xl rounded-br-none bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
                    <p>{userQuestion}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-8 text-center text-slate-600">
                <MessageSquareQuote className="h-12 w-12 text-sky-400" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-900">
                    Mulai percakapan
                  </p>
                  <p className="text-sm leading-relaxed">
                    Ketikkan pertanyaan seputar layanan BPJS atau gunakan mikrofon
                    untuk berbicara. Sistem akan mencocokkan pertanyaan Anda
                    dengan informasi pada <code>context.json</code>.
                  </p>
                </div>
              </div>
            )}

            {userQuestion && (
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
                  <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">
                    <p>{error}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setAnswer("");
                        setTypedAnswer("");
                      }}
                      className="inline-flex items-center gap-2 self-start rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Coba ulang
                    </button>
                  </div>
                ) : thinking ? (
                  <div className="flex items-end gap-3">
                    <Image
                      src="/avatar/va.png"
                      alt="Virtual Assistant"
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full border border-sky-100 bg-sky-50 object-cover"
                    />
                    <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow ring-1 ring-sky-100">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 delay-150" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 delay-300" />
                    </div>
                  </div>
                ) : answer ? (
                  <div className="flex gap-3">
                    <Image
                      src="/avatar/va.png"
                      alt="Virtual Assistant"
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full border border-sky-100 bg-sky-50 object-cover"
                    />
                    <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-lg ring-1 ring-sky-100 typing-cursor">
                      <p>{typedAnswer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
                    <p>Belum ada jawaban yang bisa ditampilkan.</p>
                    <span className="text-xs text-slate-400">
                      Silakan ajukan pertanyaan lain.
                    </span>
                  </div>
                )}

                {!loading && !error && answer && (
                  <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 px-4 py-3 text-xs text-slate-500">
                    {matchedQuestion && (
                      <p>
                        Referensi terdekat:{" "}
                        <span className="font-semibold text-slate-700">
                          {matchedQuestion}
                        </span>
                      </p>
                    )}
                    {typeof confidence === "number" && (
                      <p>
                        Tingkat keyakinan sistem:{" "}
                        <span className="font-semibold text-slate-700">
                          {(confidence * 100).toFixed(0)}%
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
            >
              <label
                htmlFor="user-question"
                className="text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Ketik atau gunakan suara
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="user-question"
                  type="text"
                  value={inputValue}
                  onChange={(event) => {
                    setInputValue(event.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Contoh: Bagaimana cara melakukan pendaftaran baru?"
                  className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
                  disabled={disableSubmit}
                />
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={
                    !isRecording &&
                    (!supportsSpeechRecognition || disableSubmit)
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
                    isRecording
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-4 w-4" />
                      Berhenti
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Gunakan suara
                    </>
                  )}
                </button>
              </div>

              {isRecording && (
                <p className="text-xs font-semibold text-rose-600">
                  Merekam... tekan berhenti setelah selesai berbicara.
                </p>
              )}
              {!supportsSpeechRecognition && (
                <p className="text-xs text-slate-500">
                  Browser Anda belum mendukung Web Speech API. Coba gunakan Chrome
                  atau Edge versi terbaru di desktop.
                </p>
              )}
              {recordingError && (
                <p className="text-xs text-rose-600">{recordingError}</p>
              )}

              <button
                type="submit"
                disabled={disableSubmit || inputValue.trim().length === 0}
                className="inline-flex items-center justify-center gap-2 self-end rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mencari jawaban...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    Tanyakan
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
