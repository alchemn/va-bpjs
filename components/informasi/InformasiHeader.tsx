import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

export function InformasiHeader() {
  return (
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
  );
}
