'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'

interface Log {
  count: number
  createdAt: string
}

interface SubSubFeature {
  id: number
  name: string
  logs: Log[]
}

interface SubFeature {
  id: number
  name: string
  subSubFeatures: SubSubFeature[]
}

interface FeatureData {
  id: number
  name: string
  type: string
  subFeatures: SubFeature[]
}

export default function SubsubFeaturePage() {
  const { satuanKerjaId, featureType, subFeatureId } = useParams()
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
        const featureData = res.data[0]
        setData(featureData)
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

  // Ambil subfeature yang sesuai
  const selectedSubFeature = data.subFeatures.find(
    (sub) => sub.id === Number(subFeatureId)
  )

  if (!selectedSubFeature)
    return <p className="p-4 text-center">Subfeature tidak ditemukan.</p>

  // Format data subsubfeature
  const formattedData = selectedSubFeature.subSubFeatures.map((s) => {
    const totalAccess = s.logs.reduce((sum, log) => sum + log.count, 0)
    const lastAccess = s.logs
      .map((log) => log.createdAt)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

    return {
      id: s.id,
      name: s.name,
      totalAccess,
      lastAccess: lastAccess ? new Date(lastAccess).toLocaleDateString('id-ID') : '-',
    }
  })

  const handleRowClick = (subSubFeatureId: number) => {
    router.push(
      `/admin/dashboard/${satuanKerjaId}/${featureType}/${subFeatureId}/${subSubFeatureId}?month=${month}&year=${year}`
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Sub fitur dari {selectedSubFeature.name}
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
