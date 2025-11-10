import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FeatureType } from '@prisma/client'

export async function GET(
  request: Request,
  { params }: { params: { satuanKerjaId: string; featureType: string } }
) {
  const { satuanKerjaId, featureType } = params

  try {
    // Ambil data fitur sesuai satuan kerja dan tipe fitur
    const features = await prisma.feature.findMany({
      where: { type: featureType as FeatureType },
      include: {
        subFeatures: {
          include: {
            subSubFeatures: {
              include: {
                logs: {
                  where: { satuanKerjaId: Number(satuanKerjaId) },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(features)
  } catch (err) {
    console.error('Error fetching feature details:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
