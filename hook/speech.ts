"use client";
import { useState, useRef, useEffect } from "react";

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

export function useSpeechRecognition(onTranscript: (transcript: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const start = () => {
    if (isRecording) return;
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("Browser Anda tidak mendukung speech recognition.");
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript || "";
      onTranscript(transcript);
    };

    recognition.onerror = (e) => {
      setError(e.error || e.message || "Terjadi kesalahan speech recognition.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return { isRecording, error, start, stop };
}
