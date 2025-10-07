import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { Button } from "../ui/button";
import ChatBubble from "../ChatBubble";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-sky-600 via-sky-500 to-blue-700 px-8 py-14 text-white shadow-2xl">
      <div className="absolute right-20 top-10 hidden h-32 w-32 rounded-full bg-white/25 blur-3xl md:block" />
      <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/20 blur-3xl" />
      <div className="relative grid gap-12 md:grid-cols-[minmax(0,1fr)_22rem] md:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-sky-100">
            <Sparkles className="h-4 w-4" />
            BPJS Virtual Assistant
          </span>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            Jawaban cepat, proses jelas, layanan BPJS makin dekat.
          </h1>
          <p className="max-w-xl text-base text-sky-50/90 md:text-lg">
            Kami bantu menjawab pertanyaan, menuntun proses pengaduan, dan merapikan administrasi Anda tanpa menunggu antrean panjang.
          </p>
          <div className="flex flex-col gap-3 text-sm text-sky-50/80 md:flex-row md:items-center">
            <div className="inline-flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
              Respon berbasis kebijakan resmi
            </div>
            <div className="inline-flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
              Tersedia 24/7
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-sky-700 shadow-lg hover:bg-sky-100"
            >
              <Link href="/informasi" className="inline-flex items-center gap-2">
                Mulai bertanya
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <Link href="#categories">Lihat kategori layanan</Link>
            </Button>
          </div>
        </div>

        <div className="relative ml-auto flex h-full max-w-sm flex-col items-center justify-center rounded-3xl bg-white/10 p-6 backdrop-blur">
          <div className="absolute -top-6 right-6 rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-emerald-950 shadow-lg">
            Siap membantu!
          </div>
          <div className="overflow-hidden rounded-2xl bg-white/90 p-4 text-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-10 w-10 rounded-full bg-sky-100" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Virtual Assistant BPJS</p>
                <p className="text-xs text-slate-500">Online sekarang</p>
              </div>
            </div>
            <ChatBubble />
          </div>
        </div>
      </div>
    </section>
  );
}
