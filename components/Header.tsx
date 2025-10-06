import Link from "next/link";
import { PhoneCall } from "lucide-react";

import { Button } from "./ui/button";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Informasi", href: "/informasi" },
  { label: "Pengaduan", href: "/pengaduan" },
  { label: "Administrasi", href: "/administrasi" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sky-100/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
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

        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 transition hover:bg-sky-50 hover:text-sky-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="secondary"
            className="hidden rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100 md:inline-flex"
          >
            <Link href="#categories">Jelajahi Layanan</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
          >
            <Link href="#contact" className="inline-flex items-center gap-2">
              <PhoneCall className="h-4 w-4" />
              Butuh Bantuan?
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
