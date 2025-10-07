import Link from "next/link";

const resources = [
  { label: "Situs resmi BPJS", href: "https://www.bpjs-kesehatan.go.id/#/" },
  { label: "Panduan Mobile JKN", href: "https://www.bpjs-kesehatan.go.id/bpjs/pages/detail/2024/241" },
  { label: "Kebijakan Privasi", href: "#" },
];

export default function ResourceLinks() {
  return (
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
  );
}
