import SectionHeader from "./category-selection/SectionHeader";
import CategoryList from "./category-selection/CategoryList";

interface QAItem {
  q: string;
  a: string;
}

interface CategorySelectionViewProps {
  section: "informasi" | "pengaduan" | "administrasi";
  availableCategories: string[];
  data: Record<string, QAItem[] | QAItem>;
  onCategoryClick: (category: string) => void;
}

const sectionCopy = {
  informasi: {
    title: "Temukan Informasi BPJS Terkini",
    tagline: "Informasi dalam genggaman",
    description:
      "Jelajahi panduan, pertanyaan umum, dan penjelasan lengkap seputar layanan BPJS Kesehatan dengan tampilan yang lebih nyaman dibaca.",
    tips: [
      "Gunakan kategori untuk mempercepat pencarian informasi.",
      "Klik pertanyaan untuk melihat jawaban lengkap di ruang chat.",
      "Siapkan data kepesertaan Anda agar proses layanan lebih cepat.",
    ],
  },
  pengaduan: {
    title: "Sampaikan Keluhan dengan Mudah",
    tagline: "Kami siap mendampingi",
    description:
      "Temukan kanal dan panduan pengaduan resmi agar keluhan Anda dapat tersampaikan dan ditindaklanjuti dengan cepat.",
    tips: [
      "Pilih kategori pengaduan yang paling sesuai dengan kebutuhan Anda.",
      "Catat nomor tiket pengaduan untuk memantau tindak lanjut.",
      "Sertakan dokumen pendukung saat mengajukan keluhan.",
    ],
  },
  administrasi: {
    title: "Kelola Administrasi BPJS dengan Tenang",
    tagline: "Semua proses jadi lebih rapi",
    description:
      "Pelajari tata cara perubahan data, pembayaran iuran, dan pengelolaan administrasi lain secara praktis.",
    tips: [
      "Pastikan data peserta selalu diperbarui sebelum mengajukan layanan.",
      "Simpan bukti pembayaran dan arsip penting secara digital.",
      "Gunakan aplikasi Mobile JKN untuk urusan administrasi rutin.",
    ],
  },
};

export default function CategorySelectionView({ section, availableCategories, data, onCategoryClick }: CategorySelectionViewProps) {
  const sectionMeta = sectionCopy[section];

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-sky-50 via-white to-white px-4 py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        <SectionHeader
          tagline={sectionMeta.tagline}
          title={sectionMeta.title}
          description={sectionMeta.description}
          tips={sectionMeta.tips}
        />
        <CategoryList
          availableCategories={availableCategories}
          data={data}
          onCategoryClick={onCategoryClick}
        />
      </div>
    </div>
  );
}
