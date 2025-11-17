'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'

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
        setData(res.data[0]) // response-nya array [ {...} ]
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    if (satuanKerjaId && featureType) fetchData()
  }, [satuanKerjaId, featureType, month, year])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <p className="text-gray-700 text-base font-medium">Loading data...</p>
      </div>
    )

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <p className="text-gray-600 text-base font-medium">Tidak ada data ditemukan.</p>
      </div>
    )

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-6 flex flex-col items-center">

      {/* 🔹 Breadcrumb */}
      <div className="w-full max-w-5xl text-left">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: `${featureType}`, href: `/admin/dashboard/${satuanKerjaId}/${featureType}` },
          ]}
        />
      </div>

      {/* 🔹 Container utama */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-green-700">
            FITUR <span className="text-gray-800">{featureType}</span>
          </h1>
          <button
            onClick={() => router.back()}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 py-2"
          >
            ← Kembali
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm text-gray-800">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">SubFitur</th>
                <th className="px-4 py-3 text-left font-semibold">Jumlah Akses</th>
                <th className="px-4 py-3 text-left font-semibold">Terakhir Diakses</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 bg-gray-50 border-t"
                  >
                    Tidak ada aktivitas pada bulan ini.
                  </td>
                </tr>
              ) : (
                formattedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-t cursor-pointer transition ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-green-50`}
                    onClick={() => handleRowClick(item.id)}
                  >
                    <td className="px-4 py-3 font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 hover:underline text-blue-700">
                      {item.totalAccess}
                    </td>
                    <td className="px-4 py-3">{item.lastAccess}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
