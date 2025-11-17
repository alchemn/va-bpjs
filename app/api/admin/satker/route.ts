import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { nama, kabupatenKota, username, password } = await req.json()

    // Validasi input
    if (!nama || !kabupatenKota || !username || !password) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 })
    }

    // Cek apakah username sudah ada
    const existingUser = await prisma.user.findUnique({ where: { username } })
    if (existingUser) {
      return NextResponse.json({ message: 'Username sudah digunakan' }, { status: 400 })
    }

    // Buat SatuanKerja
    const satuanKerja = await prisma.satuanKerja.create({
      data: {
        name: nama,
        kabupatenKota,
      },
    })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Buat User dengan role SATKER
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'SATKER',
        satuanKerjaId: satuanKerja.id,
      },
    })

    return NextResponse.json({ message: 'Satuan kerja berhasil ditambahkan' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
