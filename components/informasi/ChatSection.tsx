"use client";
import { FormEvent } from "react";
import Image from "next/image";
import {
  Loader2,
  MessageCircle,
  MessageSquareQuote,
  Mic,
  Square,
} from "lucide-react";
import { CategoryButtons } from "./CategoryButtons";
import { CategoryData } from "@/types";

interface ChatSectionProps {
  userQuestion: string;
  loading: boolean;
  typedAnswer: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  recordingError: string | null;
  categories: Array<{ key: string } & CategoryData>;
  onCategoryClick: (title: string, content: string) => void;
}

export function ChatSection({
  userQuestion,
  loading,
  typedAnswer,
  inputValue,
  onInputChange,
  onSubmit,
  isRecording,
  startRecording,
  stopRecording,
  recordingError,
  categories,
  onCategoryClick,
}: ChatSectionProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-green-100">
      <div className="space-y-6">
        {!userQuestion && (
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-8 text-slate-600">
            <div className="flex flex-col items-center text-center">
              <MessageSquareQuote className="h-12 w-12 text-green-400" />
              <p className="text-lg font-semibold text-slate-900">
                Mulai Percakapan
              </p>
            </div>
            <CategoryButtons categories={categories} onCategoryClick={onCategoryClick} />
          </div>
        )}

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

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <h1 className="font-semibold text-xl">Informasi Lainnya Tentang Program JKN BPJS Kesehatan</h1>
          <input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
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
  );
}
