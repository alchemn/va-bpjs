'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Breadcrumb from '@/components/Breadcrumb'

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
        setData(res.data[0])
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

  const selectedSubFeature = data.subFeatures.find(
    (s) => s.id === Number(subFeatureId)
  )
  const selectedSubSubFeature = selectedSubFeature?.subSubFeatures.find(
    (ss) => ss.id === Number(subSubFeatureId)
  )

  if (!selectedSubSubFeature)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <p className="text-gray-600 text-base font-medium">
          Subsubfitur tidak ditemukan.
        </p>
      </div>
    )

  const formattedLogs = selectedSubSubFeature.logs
    .filter((log) => {
      const logDate = new Date(log.createdAt)
      const logMonth = logDate.getMonth() + 1
      const logYear = logDate.getFullYear()
      return logMonth === Number(month) && logYear === Number(year)
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-6 flex flex-col items-center">
      {/*Breadcrumb (di luar container putih, kiri) */}
        <div className="w-full max-w-5xl text-left">
            <Breadcrumb
              items={[
                { label: 'Dashboard', href: '/admin/dashboard' },
                { label: `${featureType}`, href: `/admin/dashboard/${satuanKerjaId}/${featureType}` },
                { label: `Detail Subfitur`, href: `/admin/dashboard/${satuanKerjaId}/${featureType}/${subFeatureId}` },
                { label: `Riwayat Subfitur`, href: `/admin/dashboard/${satuanKerjaId}/${featureType}/${subFeatureId}/${subSubFeatureId}` },
                           
              ]}
            />
        </div>
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-green-700">
            Riwayat Akses{' '}
            <span className="text-gray-800">{selectedSubSubFeature.name}</span>
          </h1>
          <button
            onClick={() => router.back()}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 py-2"
          >
            ← Kembali
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm text-gray-800">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Hari / Tanggal Akses</th>
                <th className="px-4 py-3 text-left font-semibold">Jumlah Akses</th>
              </tr>
            </thead>
            <tbody>
              {formattedLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="text-center py-6 text-gray-500 bg-gray-50 border-t"
                  >
                    Tidak ada riwayat akses pada bulan ini.
                  </td>
                </tr>
              ) : (
                formattedLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`border-t transition ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-green-50`}
                  >
                    <td className="px-4 py-3">
                      {new Date(log.createdAt).toLocaleString('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {log.count}
                    </td>
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
