import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

export function AdministrasiHeader() {
  return (
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
  );
}
