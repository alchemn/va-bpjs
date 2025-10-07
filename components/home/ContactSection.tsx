import { PhoneCall, ShieldCheck } from "lucide-react";

export default function ContactSection() {
  return (
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
  );
}
