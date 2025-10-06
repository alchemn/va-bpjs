import Link from "next/link";

const currentYear = new Date().getFullYear();

const resources = [
  { label: "Situs resmi BPJS", href: "https://www.bpjs-kesehatan.go.id/#/" },
  { label: "Panduan Mobile JKN", href: "https://www.bpjs-kesehatan.go.id/bpjs/pages/detail/2024/241" },
  { label: "Kebijakan Privasi", href: "#" },
];

const supports = [
  { label: "FAQ Peserta", href: "/informasi" },
  { label: "Pengaduan Resmi", href: "/pengaduan" },
  { label: "Layanan Administrasi", href: "/administrasi" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
              Virtual Assistant BPJS
            </p>
            <h2 className="text-xl font-semibold text-white">
              Mendampingi Anda mengelola layanan BPJS Kesehatan.
            </h2>
            <p className="text-sm text-slate-400">
              Informasi, pengaduan, dan administrasi kini lebih mudah. Temukan jawaban dan panduan resmi tanpa harus menunggu antrean panjang.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-300">
              Sumber daya
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {resources.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="transition hover:text-white hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-300">
              Bantuan cepat
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {supports.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-white hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row">
          <p>Hak cipta {currentYear} BPJS Kesehatan. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <Link href="#" className="transition hover:text-white">
              Syarat & Ketentuan
            </Link>
            <Link href="#" className="transition hover:text-white">
              Pusat Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
