'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LogOut } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'
import Logo from '@/components/navbar/Logo'

interface LogData {
  // bentuk data yang kemungkinan dikembalikan oleh /api/admin/logs
  // struktur fleksibel: fungsi export akan mencoba membaca berbagai kemungkinan nama field
  satuanKerja?: string
  satuanKerjaId?: number
  feature?: string
  subFeature?: string
  subSubFeature?: string
  count?: number
  updatedAt?: string
  // jika API anda mengembalikan nested relations, ini juga akan bekerja:
  // subSubFeature?: { id: number, name: string, subFeature?: { id, name }, feature?: { id, name } }
  // satuanKerja?: { id, name }
  [key: string]: any
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<LogData[]>([])
  const [filteredData, setFilteredData] = useState<LogData[]>([])
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1)
  const [selectedYear, setSelectedYear] = useState(dayjs().year())
  const [aggregated, setAggregated] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token) {
      router.push('/login')
      return
    }

    if (role !== 'ADMIN') {
      // Jika bukan admin (misal satker), lempar ke halaman utama
      router.push('/')
      return
    }

    fetchData(token)
  }, [])


  const fetchData = async (token: string) => {
    try {
      const res = await fetch('/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setData(json)
      filterByDate(json, selectedMonth, selectedYear)
    } catch (err) {
      console.error('Error fetching logs:', err)
    }
  }

  const filterByDate = (logs: LogData[], month: number, year: number) => {
    const filtered = logs.filter(
      (log) =>
        dayjs(log.updatedAt).month() + 1 === month &&
        dayjs(log.updatedAt).year() === year
    )
    setFilteredData(filtered)

    const grouped: Record<string, any> = {}
    filtered.forEach((log: any) => {
      const sk = log.satuanKerja?.name ?? log.satuanKerja ?? 'Unknown'
      const skId = log.satuanKerja?.id ?? log.satuanKerjaId ?? null
      if (!grouped[sk]) {
        grouped[sk] = { satuanKerjaId: skId, satuanKerja: sk, informasi: 0, pengaduan: 0, administrasi: 0 }
      }
      const featureName = (log.feature ?? '').toLowerCase()
      if (featureName.includes('informasi')) grouped[sk].informasi += log.count ?? 0
      else if (featureName.includes('pengaduan')) grouped[sk].pengaduan += log.count ?? 0
      else if (featureName.includes('administrasi')) grouped[sk].administrasi += log.count ?? 0
    })
    setAggregated(Object.values(grouped))
  }

  const handleMonthChange = (value: string) => {
    const monthNum = parseInt(value)
    setSelectedMonth(monthNum)
    filterByDate(data, monthNum, selectedYear)
  }

  const handleYearChange = (value: string) => {
    const yearNum = parseInt(value)
    setSelectedYear(yearNum)
    filterByDate(data, selectedMonth, yearNum)
  }

  const handleLogout = () => {
    // Hapus localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('satuanKerja')

    // Hapus cookie (biar middleware tahu)
    document.cookie = 'token=; path=/; max-age=0'
    document.cookie = 'role=; path=/; max-age=0'

    // Arahkan ke halaman login
    router.push('/login')
  }

  // ====== NEW: Export handler ======
  const handleExport = async () => {
    if (selectedMonths.length === 0) {
      alert("Pilih minimal satu bulan!")
      return
    }

    try {
      const payload = {
        data,
        year: selectedYear,
        months: selectedMonths   // ⬅⚡ dikirim ke backend
      }

      const res = await fetch('/api/admin/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        alert("Gagal melakukan export")
        return
      }

      const arrayBuffer = await res.arrayBuffer()
      const blob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Laporan VA-BPJS ${selectedYear}.xlsx`
      a.click()
      URL.revokeObjectURL(url)

      setShowModal(false)
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan export")
    }
  }

  // ====================================

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ]

  const startYear = 2025
  const currentYear = dayjs().year()

  // Buat array dari 2025 hingga tahun sekarang
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  )


  const handleDetailClick = (satuanKerjaId: number, featureType: string) => {
    router.push(`/admin/dashboard/${satuanKerjaId}/${featureType}?month=${selectedMonth}&year=${selectedYear}`)
  }

  const [showModal, setShowModal] = useState(false)
  const [selectedMonths, setSelectedMonths] = useState<number[]>([])

  const toggleMonth = (month: number) => {
    setSelectedMonths(prev =>
      prev.includes(month)
        ? prev.filter(m => m !== month)
        : [...prev, month]
    )
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* === HEADER === */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo />
          </div>
          <div className="flex items-center space-x-4">
            <Select value={String(selectedMonth)} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[140px] bg-white shadow rounded-xl">
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(selectedYear)} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[120px] bg-white shadow rounded-xl">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleLogout}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 hover:cursor-pointer transition hover:transition-shadow"
            >
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* === TABEL DATA === */}
        <Card className="rounded-2xl shadow-md border border-gray-100">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-green-700">
              Rekapitulasi Akses per Satuan Kerja
            </CardTitle>
            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={() => router.push('/admin/dashboard/tambahSatker')}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4"
              >
                + Tambah Satker
              </Button>

              {/* BUTTON EXPORT: tepat di bawah Tambah Satker */}
              <Button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 text-sm"
              >
                Download Excel
              </Button>

            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50 text-green-800">
                  <TableHead>Satuan Kerja</TableHead>
                  <TableHead>Informasi Layanan</TableHead>
                  <TableHead>Pengaduan Peserta</TableHead>
                  <TableHead>Administrasi Peserta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aggregated.length > 0 ? (
                  aggregated.map((item: any) => (
                    <TableRow key={item.satuanKerja} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{item.satuanKerja}</TableCell>
                      <TableCell>
                        <button onClick={() => handleDetailClick(item.satuanKerjaId, 'INFORMASI')} className="text-blue-600 hover:underline">
                          {item.informasi}
                        </button>
                      </TableCell>
                      <TableCell>
                        <button onClick={() => handleDetailClick(item.satuanKerjaId, 'PENGADUAN')} className="text-blue-600 hover:underline">
                          {item.pengaduan}
                        </button>
                      </TableCell>
                      <TableCell>
                        <button onClick={() => handleDetailClick(item.satuanKerjaId, 'ADMINISTRASI')} className="text-blue-600 hover:underline">
                          {item.administrasi}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      Tidak ada data untuk bulan ini
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* === GRAFIK === */}
        <Card className="rounded-2xl shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-green-700">
              Visualisasi Akses Fitur
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggregated}>
                <XAxis dataKey="satuanKerja" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="informasi" fill="#2563eb" name="Informasi Layanan" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pengaduan" fill="#f97316" name="Pengaduan Peserta" radius={[6, 6, 0, 0]} />
                <Bar dataKey="administrasi" fill="#16a34a" name="Administrasi Peserta" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[350px] shadow-xl">
              <h2 className="text-lg font-semibold mb-4">Pilih Bulan untuk Diunduh</h2>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {months.map(m => (
                  <label key={m.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedMonths.includes(m.value)}
                      onChange={() => toggleMonth(m.value)}
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  className="bg-gray-500 text-white"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </Button>

                <Button
                  className="bg-blue-600 hover:bg-blue-800 text-white"
                  onClick={handleExport}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}