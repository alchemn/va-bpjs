import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const existing = await prisma.feature.count();
    if (existing > 0) {
      return new Response(JSON.stringify({ message: 'Data sudah ada' }), { status: 200 });
    }

    await prisma.feature.createMany({
      data: [
        { name: 'Informasi Layanan', code: 'INFORMASI' },
        { name: 'Pengaduan Peserta', code: 'PENGADUAN' },
        { name: 'Administrasi Peserta', code: 'ADMINISTRASI' },
      ],
    });

    return new Response(JSON.stringify({ message: '✅ Seeding berhasil!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
