'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'

interface Log {
  id: number
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

export default function RiwayatAksesPage() {
  const { satuanKerjaId, featureType, subFeatureId, subSubFeatureId } = useParams()
  const searchParams = useSearchParams()

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
        setData(res.data[0])
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

  // Temukan subfeature dan subsubfeature yang sesuai
  const selectedSubFeature = data.subFeatures.find(
    (s) => s.id === Number(subFeatureId)
  )
  const selectedSubSubFeature = selectedSubFeature?.subSubFeatures.find(
    (ss) => ss.id === Number(subSubFeatureId)
  )

  if (!selectedSubSubFeature)
    return <p className="p-4 text-center">Subsubfeature tidak ditemukan.</p>

  const formattedLogs = selectedSubSubFeature.logs
    .filter((log) => {
      const logDate = new Date(log.createdAt)
      const logMonth = logDate.getMonth() + 1
      const logYear = logDate.getFullYear()
      return logMonth === Number(month) && logYear === Number(year)
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Riwayat Akses: <span className="text-blue-600">{selectedSubSubFeature.name}</span>
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Tanggal Akses</th>
              <th className="px-4 py-2 text-left">Jumlah Akses</th>
            </tr>
          </thead>
          <tbody>
            {formattedLogs.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-500">
                  Tidak ada riwayat akses pada bulan ini.
                </td>
              </tr>
            ) : (
              formattedLogs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    {new Date(log.createdAt).toLocaleString('id-ID', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-4 py-2">{log.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
