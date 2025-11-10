'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'

interface LogData {
  satuanKerja: string
  feature: string
  count: number
  updatedAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<LogData[]>([])
  const [filteredData, setFilteredData] = useState<LogData[]>([])
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1) // default bulan saat ini
  const [selectedYear, setSelectedYear] = useState(dayjs().year()) // default tahun saat ini
  const [aggregated, setAggregated] = useState<any[]>([])

  // 🔒 Redirect kalau belum login
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      fetchData(token)
    }
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

    // Agregasi berdasarkan satuan kerja dan kategori fitur
    const grouped: Record<string, any> = {}
    filtered.forEach((log: any) => {
      const sk = log.satuanKerja
      const skId = log.satuanKerjaId // pastikan field ini ada di API /api/admin/logs
      if (!grouped[sk]) {
        grouped[sk] = {
          satuanKerjaId: skId, //  simpan ID-nya di sini
          satuanKerja: sk,
          informasi: 0,
          pengaduan: 0,
          administrasi: 0
        }
      }

      const featureName = log.feature.toLowerCase()
      if (featureName.includes('informasi')) grouped[sk].informasi += log.count
      else if (featureName.includes('pengaduan')) grouped[sk].pengaduan += log.count
      else if (featureName.includes('administrasi')) grouped[sk].administrasi += log.count
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
    localStorage.removeItem('token')
    router.push('/login')
  }

  // Daftar bulan dan tahun
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

  const currentYear = dayjs().year()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse()

  const handleDetailClick = (satuanKerjaId: number, featureType: string) => {
    router.push(`/admin/dashboard/${satuanKerjaId}/${featureType}?month=${selectedMonth}&year=${selectedYear}`)
  }




  return (
    <div className="p-6 space-y-8">
      {/* === HEADER === */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <div className="flex items-center space-x-4">
          {/* Filter Bulan */}
          <Select
            value={String(selectedMonth)}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={String(month.value)}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Tahun */}
          <Select
            value={String(selectedYear)}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tombol Logout */}
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* === TABEL DATA === */}
      <Card>
        <CardHeader>
          <CardTitle>Rekapitulasi Akses per Satuan Kerja</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Satuan Kerja</TableHead>
                <TableHead>Informasi Layanan</TableHead>
                <TableHead>Pengaduan Peserta</TableHead>
                <TableHead>Administrasi Peserta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggregated.length > 0 ? (
                aggregated.map((item: any) => (
                  <TableRow key={item.satuanKerja}>
                    <TableCell>{item.satuanKerja}</TableCell>

                    <TableCell>
                        <button
                            onClick={() => handleDetailClick(item.satuanKerjaId, 'INFORMASI')}
                            className="text-blue-600 hover:underline"
                        >
                            {item.informasi}
                        </button>
                    </TableCell>

                    <TableCell>
                        <button
                            onClick={() => handleDetailClick(item.satuanKerjaId, 'PENGADUAN')}
                            className="text-blue-600 hover:underline"
                        >
                            {item.pengaduan}
                        </button>
                    </TableCell>

                    <TableCell>
                        <button
                            onClick={() => handleDetailClick(item.satuanKerjaId, 'ADMINISTRASI')}
                            className="text-blue-600 hover:underline"
                        >
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
      <Card>
        <CardHeader>
          <CardTitle>Visualisasi Akses Fitur</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregated}>
              <XAxis dataKey="satuanKerja" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="informasi" fill="#4F46E5" name="Informasi Layanan" />
              <Bar dataKey="pengaduan" fill="#EF4444" name="Pengaduan Peserta" />
              <Bar dataKey="administrasi" fill="#10B981" name="Administrasi Peserta" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
