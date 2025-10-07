import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 text-slate-900 transition hover:opacity-90">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-lg font-semibold text-white shadow-lg">
        BPJS
      </span>
      <div className="leading-tight">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
          Virtual Assistant
        </p>
        <p className="text-base font-semibold text-green-700">BPJS Kesehatan</p>
      </div>
    </Link>
  );
}
