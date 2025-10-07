import Link from "next/link";

const supports = [
  { label: "FAQ Peserta", href: "/informasi" },
  { label: "Pengaduan Resmi", href: "/pengaduan" },
  { label: "Layanan Administrasi", href: "/administrasi" },
];

export default function SupportLinks() {
  return (
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
  );
}
