// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function GET(req: Request, { params }: { params: { satuanKerjaId: string, featureType: string } }) {
//   try {
//     const { satuanKerjaId, featureType } = params

//     // Ambil feature + subfeature + subsubfeature dari DB
//     const feature = await prisma.feature.findFirst({
//       where: { name: { equals: featureType } },
//       include: {
//         subFeatures: {
//           include: {
//             subSubFeatures: true,
//             _count: { select: { logs: true } }, // jumlah akses log
//           },
//         },
//       },
//     })

//     if (!feature) {
//       return NextResponse.json([], { status: 200 })
//     }

//     // Bentuk data JSON agar cocok untuk frontend kamu
//     const result = feature.subFeatures.map((sf: any) => ({
//       subFeatureId: sf.id,
//       subFeatureName: sf.name,
//       count: sf._count.logs,
//     }))

//     return NextResponse.json(result)
//   } catch (error) {
//     console.error('Error fetching detail:', error)
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
//   }
// }
