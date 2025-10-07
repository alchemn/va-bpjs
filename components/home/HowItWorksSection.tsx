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

export default function HowItWorksSection() {
  return (
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
  );
}
