import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Ambil semua log dan relasi yang diperlukan
    const logs = await prisma.featureLog.findMany({
      include: {
        satuanKerja: {
          select: {
            id: true,
            name: true,
          },
        },
        subSubFeature: {
          select: {
            name: true,
            subFeature: {
              select: {
                name: true,
                feature: {
                  select: {
                    name: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Bentuk data agar cocok dengan frontend
    const formatted = logs.map((log) => ({
      satuanKerjaId: log.satuanKerja.id,
      satuanKerja: log.satuanKerja.name,
      feature: log.subSubFeature.subFeature.feature.name,
      featureType: log.subSubFeature.subFeature.feature.type,
      subFeature: log.subSubFeature.subFeature.name,
      subSubFeature: log.subSubFeature.name,
      count: log.count,
      updatedAt: log.createdAt,
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error('Error fetching logs:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
