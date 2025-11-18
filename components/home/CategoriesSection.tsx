import Link from "next/link";
import {
  ArrowRight,
  FileText,
  MessageSquareWarning,
  ClipboardList,
} from "lucide-react";

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

const handleClick = async (featureName : string) =>{
  if (featureName === "Pengaduan Peserta") {
    await fetch("/api/feature-access", {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie
          .split(": ")
          .find((c) => c.startsWith("token="))
          ?.split("=") [1]
        }`
      },
      body: JSON.stringify({subSubFeatureId: 4})
    })
  }
}

export default function CategoriesSection() {
  return (
    <section id="categories" className="space-y-8">
      <div className="flex flex-col gap-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-500">
          Kategori layanan
        </p>
        <h2 className="text-3xl font-bold text-slate-900">Pilih layanan sesuai kebutuhan anda</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.map(({ href, title, description, icon: Icon, accent }) => (
          <Link
            onClick={() => handleClick(title)}
            key={href}
            href={href}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
          >
            <div className={`mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${accent} p-4 text-white shadow-lg transition group-hover:scale-105`}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-600">
              Jelajahi sekarang
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/0 via-sky-100/40 to-transparent opacity-0 transition group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </section>
  );
}
