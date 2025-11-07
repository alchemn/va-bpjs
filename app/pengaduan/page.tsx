"use client";
import { usePengaduanData } from "@/hook/usePengaduanData";
import { PengaduanHeader } from "@/components/pengaduan/PengaduanHeader";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { TypingEffect } from "@/components/ui/TypingEffect";
import { Loader2 } from "lucide-react";

export default function PengaduanChatPage() {
  const { question, answer, loading, error } = usePengaduanData();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <PengaduanHeader />

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
                <ChatBubble role="user" content={question} />
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Jawaban Virtual Assistant
                  </span>
                  <div className="flex gap-3">
                    <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-lg ring-1 ring-sky-100 typing-cursor">
                      <TypingEffect text={answer} />
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
