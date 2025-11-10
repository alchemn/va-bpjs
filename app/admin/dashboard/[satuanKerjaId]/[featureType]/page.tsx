'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useParams, useRouter } from 'next/navigation'
import axios from 'axios'

interface SubSubFeatureLog {
  id: number
  name: string
  logs: { count: number; createdAt: string }[]
}

interface SubFeature {
  id: number
  name: string
  subSubFeatures: SubSubFeatureLog[]
}

interface FeatureData {
  id: number
  name: string
  type: string
  subFeatures: SubFeature[]
}

export default function SubfeaturePage() {
  const { satuanKerjaId, featureType } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const month = searchParams.get('month')
  const year = searchParams.get('year')

  const [data, setData] = useState<FeatureData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`/api/admin/logs/${satuanKerjaId}/${featureType}`, {
          params: { month, year },
        })
        setData(res.data[0]) // karena response-nya array [ {...} ]
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    if (satuanKerjaId && featureType) fetchData()
  }, [satuanKerjaId, featureType, month, year])

  if (loading) return <p className="p-4 text-center">Loading...</p>
  if (!data) return <p className="p-4 text-center">Tidak ada data.</p>

  // Format data per subfeature
  const formattedData = data.subFeatures.map((sub) => {
    const totalAccess = sub.subSubFeatures.reduce(
      (sum, s) => sum + s.logs.reduce((a, b) => a + b.count, 0),
      0
    )

    const lastAccess = sub.subSubFeatures
      .flatMap((s) => s.logs.map((l) => l.createdAt))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

    return {
      id: sub.id,
      name: sub.name,
      totalAccess,
      lastAccess: lastAccess ? new Date(lastAccess).toLocaleDateString('id-ID') : '-',
    }
  })

  const handleRowClick = (subFeatureId: number) => {
    router.push(
      `/admin/dashboard/${satuanKerjaId}/${featureType}/${subFeatureId}?month=${month}&year=${year}`
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Detail Akses Fitur: {data.name} ({featureType})
      </h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Sub Fitur</th>
              <th className="px-4 py-2 text-left">Jumlah Akses</th>
              <th className="px-4 py-2 text-left">Terakhir Diakses</th>
            </tr>
          </thead>
          <tbody>
            {formattedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  Tidak ada aktivitas pada bulan ini.
                </td>
              </tr>
            ) : (
              formattedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => handleRowClick(item.id)}
                >
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.totalAccess}</td>
                  <td className="px-4 py-2">{item.lastAccess}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
