import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// 🟢 POST — Mencatat log baruuuu, bukan increment
export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { subSubFeatureId } = await req.json()
    const satuanKerjaId = decoded.satuanKerjaId

    if (!subSubFeatureId || !satuanKerjaId) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 })
    }

    // 🔥 Tidak ada update count — buat record baru setiap akses
    await prisma.featureLog.create({
      data: {
        satuanKerjaId,
        subSubFeatureId,
        count: 1,
      },
    })

    return NextResponse.json({ message: 'Feature logged' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
