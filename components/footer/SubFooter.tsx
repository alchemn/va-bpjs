import Link from "next/link";

const currentYear = new Date().getFullYear();

export default function SubFooter() {
  return (
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
  );
}
