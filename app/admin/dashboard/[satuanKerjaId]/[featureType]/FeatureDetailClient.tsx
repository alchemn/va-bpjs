"use client"

import { useEffect, useState } from "react"

export default function FeatureDetailClient({
  featureType,
  satuanKerjaId,
}: {
  featureType: string
  satuanKerjaId: string
}) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/admin/logs/${satuanKerjaId}/${featureType}?month=${month}&year=${year}`
        )
        const json = await res.json()
        // ✅ Pastikan hasil selalu berupa array agar .map & .reduce tidak error
        setData(Array.isArray(json) ? json : [])
      } catch (err) {
        console.error("Error fetching detail data:", err)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [featureType, satuanKerjaId, month, year])

  // ✅ Hitung total berdasarkan jumlah log di setiap sub-sub-feature
  const totalCount = data.reduce((total, feature) => {
    const featureCount = feature.subFeatures?.reduce((subTotal: number, sub: any) => {
      const subCount = sub.subSubFeatures?.reduce(
        (subsubTotal: number, subsub: any) =>
          subsubTotal + (subsub.logs?.length || 0),
        0
      )
      return subTotal + (subCount || 0)
    }, 0)
    return total + (featureCount || 0)
  }, 0)

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>
  }

  const hasData = totalCount > 0

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Detail {featureType} —{" "}
        {!hasData ? (
          <span className="text-gray-500 font-normal">Tidak Ada Data</span>
        ) : (
          <span className="text-blue-600 font-normal">Total: {totalCount}</span>
        )}
      </h1>

      {/* Filter bulan & tahun */}
      <div className="flex gap-4 items-center">
        <label className="text-sm">
          Bulan:{" "}
          <input
            type="number"
            value={month}
            min={1}
            max={12}
            className="border p-1 rounded w-20"
            onChange={(e) => setMonth(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          Tahun:{" "}
          <input
            type="number"
            value={year}
            className="border p-1 rounded w-24"
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </label>
      </div>

      {hasData ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-4 py-2 border text-left w-[30%]">Sub Feature</th>
                <th className="px-4 py-2 border text-left w-[40%]">Sub Sub Feature</th>
                <th className="px-4 py-2 border text-center w-[20%]">Jumlah Aktivitas</th>
              </tr>
            </thead>
            <tbody>
              {data.map((feature) =>
                feature.subFeatures?.map((sub: any) =>
                  sub.subSubFeatures?.map((subsub: any) => (
                    <tr key={subsub.id} className="text-sm hover:bg-gray-50">
                      <td className="px-4 py-2 border">{sub.name}</td>
                      <td className="px-4 py-2 border">{subsub.name}</td>
                      <td className="px-4 py-2 border text-center">
                        {subsub.logs?.length > 0 ? subsub.logs.length : "-"}
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 text-center py-10">
          Tidak ada aktivitas untuk bulan ini.
        </div>
      )}
    </div>
  )
}
