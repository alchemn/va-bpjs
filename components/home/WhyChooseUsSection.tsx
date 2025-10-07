import { ShieldCheck, PhoneCall } from "lucide-react";

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

export default function WhyChooseUsSection() {
  return (
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
  );
}
