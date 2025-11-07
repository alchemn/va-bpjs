import {
  FileText,
  MessageSquareWarning,
  ClipboardList,
} from "lucide-react";

export const categories = [
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
