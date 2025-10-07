import Link from "next/link";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Informasi", href: "/informasi" },
  { label: "Pengaduan", href: "/pengaduan" },
  { label: "Administrasi", href: "/administrasi" },
];

export default function Navigation() {
  return (
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
  );
}
