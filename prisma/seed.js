import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding data awal...");

  // ======= Feature Utama =======
  const features = await prisma.feature.createMany({
    data: [
      { name: "INFORMASI" },
      { name: "PENGADUAN" },
      { name: "ADMINISTRASI" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Features ditambahkan.");

  // ======= SubFeature: Informasi =======
  const informasi = await prisma.feature.findFirst({ where: { name: "INFORMASI" } });
  if (informasi) {
    await prisma.subFeature.createMany({
      data: [
        { name: "Cek Status Kepesertaan", featureId: informasi.id },
        { name: "Cek Status Pembayaran", featureId: informasi.id },
        { name: "Cek Virtual Account", featureId: informasi.id },
      ],
      skipDuplicates: true,
    });
  }

  // ======= SubFeature: Administrasi =======
  const administrasi = await prisma.feature.findFirst({ where: { name: "ADMINISTRASI" } });
  if (administrasi) {
    const adminSubfeatures = [
      {
        name: "Pendaftaran Baru",
        subSubs: ["PNS/TNI/POLRI", "PBPU/MANDIRI", "Peserta Jaminan Kesehatan Aceh (JKA)"],
      },
      {
        name: "Penambahan Anggota Keluarga",
        subSubs: [
          "PNS/TNI/POLRI dan Pensiunan/Veteran-PK/PPK",
          "PBI JAMINAN KESEHATAN (Bayi Baru Lahir)",
          "PBPU/Mandiri",
          "Pegawai Swasta/BUMN/BUMD",
          "Penambahan Anggota Keluarga JKA",
        ],
      },
      {
        name: "Pengaktifan Kembali Status Kepesertaan",
        subSubs: [
          "Anak > 21 Tahun Masih Kuliah",
          "Registrasi Ulang (PNS/TNI/POLRI/PENSIUNAN/VETERAN-PERINTIS KEMERDEKAAN)",
          "Registrasi Ulang Bayi Berusia > 3 Bulan Melengkapi NIK",
          "WNI Kembali dari Luar Negeri",
          "Data Ganda",
          "Reaktivasi PHK dengan Jaminan 6 Bulan",
        ],
      },
      {
        name: "Perubahan/Perbaikan Data",
        subSubs: [
          "Perubahan identitas (NIK,NO KK, Nama, Tanggal lahir, JK, Alamat)",
          "Nomor Handphone",
          "Golongan dan Gaji (PNS dan TNI/POLRI)",
        ],
      },
      {
        name: "Ubah Fasilitas Kesehatan Tingkat Pertama",
        subSubs: [
          "Peserta TNI/POLRI",
          "Terdaftar Lebih Dari 3 Bulan",
          "Terdaftar Kurang dari 3 Bulan (Pindah Domisili/ Pindah Tugas)",
        ],
      },
      {
        name: "Pengurangan Anggota Keluarga",
        subSubs: [
          "Pelaporan Peserta Meninggal Dunia",
          "Pembaharuan KK (KK Baru/Pisah KK)",
          "Pelaporan WNI Pergi Keluar Negeri",
        ],
      },
      {
        name: "Perubahan Kelas Rawat",
        subSubs: ["Perubahan Kelas Rawat"],
      },
      {
        name: "Pengaktifan Kembali Nomor Pembayaran Iuran Yang Telah Lewat Masa Bayar",
        subSubs: [
          "Pengaktifan Kembali Nomor Pembayaran Iuran Yang Telah Lewat Masa Bayar",
        ],
      },
    ];

    for (const sf of adminSubfeatures) {
      const createdSub = await prisma.subFeature.upsert({
        where: { name_featureId: { name: sf.name, featureId: administrasi.id } },
        update: {},
        create: { name: sf.name, featureId: administrasi.id },
      });

      for (const ssf of sf.subSubs) {
        await prisma.subSubFeature.upsert({
          where: {
            name_subFeatureId: { name: ssf, subFeatureId: createdSub.id },
          },
          update: {},
          create: { name: ssf, subFeatureId: createdSub.id },
        });
      }
    }
  }

  console.log("✅ Subfeatures dan sub-subfeatures ditambahkan.");
}

main()
  .then(async () => {
    console.log("✅ Seeding selesai!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Gagal seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
