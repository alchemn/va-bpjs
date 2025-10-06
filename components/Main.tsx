import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  MessageSquareWarning,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "./ui/button";

const categories = [
  {
    href: "/informasi",
    title: "Informasi Layanan",
    description: "Panduan resmi dan jawaban cepat seputar layanan BPJS Kesehatan.",
    icon: FileText,
    accent: "from-sky-500 to-blue-600",
  },
  {
    href: "/pengaduan",
    title: "Pengaduan Peserta",
    description: "Langkah dan kanal pengaduan yang ditangani langsung oleh petugas BPJS.",
    icon: MessageSquareWarning,
    accent: "from-amber-400 to-orange-500",
  },
  {
    href: "/administrasi",
    title: "Administrasi Peserta",
    description: "Kelola data kepesertaan, pembayaran iuran, dan perubahan fasilitas dengan mudah.",
    icon: ClipboardList,
    accent: "from-emerald-400 to-teal-500",
  },
];

const highlights = [
  {
    title: "Respons tepercaya",
    description:
      "Semua informasi bersumber dari panduan dan regulasi resmi BPJS Kesehatan.",
  },
  {
    title: "Panduan langkah demi langkah",
    description:
      "Instruksi jelas agar Anda tahu dokumen yang dibutuhkan hingga cara menindaklanjuti.",
  },
  {
    title: "Selalu siap di mana pun",
    description: "Akses asisten virtual 24/7 melalui ponsel maupun desktop tanpa instalasi tambahan.",
  },
];

const journey = [
  {
    title: "Pilih kategori layanan",
    detail:
      "Mulai dari Informasi, Pengaduan, atau Administrasi sesuai kebutuhan Anda saat ini.",
  },
  {
    title: "Telusuri pertanyaan",
    detail:
      "Kami menyiapkan daftar pertanyaan populer untuk mempercepat proses pencarian informasi.",
  },
  {
    title: "Dapatkan arahan jelas",
    detail:
      "Baca jawaban detail atau lanjutkan ke sesi chat jika membutuhkan penjelasan tambahan.",
  },
];

const assurances = [
  {
    title: "Privasi Terlindungi",
    description: "Percakapan Anda dijaga kerahasiaannya sesuai kebijakan data BPJS.",
    icon: ShieldCheck,
  },
  {
    title: "Petugas Selalu Siaga",
    description: "Butuh bantuan lanjutan? Kami hubungkan dengan petugas BPJS resmi.",
    icon: PhoneCall,
  },
];

export default function Main() {
  return (
    <div className="w-full space-y-16">
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
              <div className="space-y-4 py-4 text-sm">
                <div className="flex justify-end">
                  <span className="inline-flex max-w-[80%] rounded-2xl rounded-br-sm bg-sky-600 px-4 py-2 text-white">
                    Bagaimana cara daftar BPJS secara online?
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Image
                    src="/avatar/va.png"
                    alt="Avatar Virtual Assistant"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-sky-100 bg-sky-50 object-cover"
                  />
                  <span className="inline-flex max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2 text-slate-700">
                    Anda dapat mendaftar melalui aplikasi Mobile JKN atau datang ke kantor cabang dengan membawa KTP dan KK.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="space-y-8">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
            Kategori layanan
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Pilih jalur bantuan sesuai kebutuhan Anda</h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600">
            Kami merangkum berbagai pertanyaan dan panduan ke dalam tiga kategori utama agar Anda dapat menemukan jawaban paling relevan dengan cepat.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map(({ href, title, description, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
            >
              <div className={`mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${accent} p-4 text-white shadow-lg transition group-hover:scale-105`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600">
                Jelajahi sekarang
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100/0 via-sky-100/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] bg-white p-10 shadow-xl ring-1 ring-slate-100">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
              Kenapa memilih kami
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Layanan digital yang ramah, informatif, dan terintegrasi dengan BPJS.
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Kami menggabungkan rangkuman kebijakan terbaru dan pengalaman layanan customer service untuk memberikan bantuan menyeluruh tanpa perlu pindah aplikasi.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl bg-slate-900 p-8 text-slate-100">
            <h3 className="text-lg font-semibold">Satu tempat untuk tiga kebutuhan utama</h3>
            <p className="text-sm text-slate-300">
              Tidak perlu membuka banyak tab. Semua tersedia di satu platform virtual yang mudah digunakan.
            </p>
            <ul className="space-y-3 text-sm">
              {assurances.map(({ title, description, icon: Icon }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sky-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-50">{title}</p>
                    <p className="text-xs text-slate-300">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
            Cara kerja
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Mulai dalam tiga langkah sederhana</h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600">
            Tak perlu akun khusus. Setelah memilih kategori dan pertanyaan, Anda langsung terhubung dengan Virtual Assistant untuk mendapatkan arahan lanjutan.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {journey.map((item, index) => (
            <div key={item.title} className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <span className="absolute -top-10 right-6 text-6xl font-black text-slate-100">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div className="relative space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="rounded-[2.5rem] bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 px-8 py-12 text-white shadow-2xl">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_20rem] md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight">
              Masih butuh bantuan lebih lanjut?
            </h2>
            <p className="text-sm text-sky-50/90">
              Hubungi petugas BPJS Kesehatan melalui kanal resmi atau kunjungi kantor cabang terdekat. Tim kami siap mengarahkan Anda.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <PhoneCall className="h-4 w-4 text-emerald-200" />
                1500 400
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-emerald-200" />
                Layanan resmi BPJS
              </span>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
            <div className="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-100">
                Pusat layanan
              </p>
              <div className="space-y-3 text-sm text-sky-50/80">
                <p>
                  - Aplikasi Mobile JKN tersedia di App Store & Play Store.
                </p>
                <p>
                  - DM kami di Instagram <span className="font-semibold">@bpjskesehatan_ri</span> untuk update terbaru.
                </p>
                <p>
                  - Tersedia live chat di situs resmi BPJS Kesehatan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
