import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 text-slate-900 transition hover:opacity-90">
      <Image alt="BPJS Logo" src="/image/logo.png" width={50} height={50} />
      <div className="leading-tight">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
          Virtual Assistant
        </p>
        <p className="text-base font-semibold text-green-700">BPJS Kesehatan</p>
      </div>
    </Link>
  );
}
