import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// 🟢 POST — Mencatat akses fitur
export async function POST(req: Request) {
  try {
    // 1️⃣ Ambil dan verifikasi token JWT
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // 2️⃣ Ambil data dari body
    const { subSubFeatureId } = await req.json()
    const satuanKerjaId = decoded.satuanKerjaId

    // 3️⃣ Pastikan data valid
    if (!subSubFeatureId || !satuanKerjaId) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 })
    }

    // 4️⃣ Cek apakah sudah ada log untuk kombinasi satker + fitur
    const existing = await prisma.featureLog.findUnique({
      where: { satuanKerjaId_subSubFeatureId: { satuanKerjaId, subSubFeatureId } },
    })

    // 5️⃣ Jika ada → update count; jika belum → buat baru
    if (existing) {
      await prisma.featureLog.update({
        where: { id: existing.id },
        data: { count: { increment: 1 } },
      })
    } else {
      await prisma.featureLog.create({
        data: {
          satuanKerjaId,
          subSubFeatureId,
          count: 1,
        },
      })
    }

    return NextResponse.json({ message: 'Feature access logged successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// 🟡 GET — Mengambil semua log akses fitur
export async function GET(req: Request) {
  try {
    // 1️⃣ Ambil dan verifikasi token
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // 2️⃣ Jika user adalah admin → tampilkan semua log
    //    Jika bukan → tampilkan log hanya untuk satuan kerja user
    const whereCondition =
      decoded.role === 'ADMIN'
        ? {}
        : { satuanKerjaId: decoded.satuanKerjaId }

    const logs = await prisma.featureLog.findMany({
      where: whereCondition,
      include: {
        satuanKerja: true,
        subSubFeature: {
          include: {
            subFeature: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching feature logs:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
