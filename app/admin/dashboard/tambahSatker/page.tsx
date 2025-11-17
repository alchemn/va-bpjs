'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

export default function TambahSatkerPage() {
  const [nama, setNama] = useState('')
  const [kabupatenKota, setKabupatenKota] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false) // <= toggle state
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/satker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, kabupatenKota, username, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Gagal menambahkan satker')
        return
      }

      setSuccess('Satuan kerja berhasil ditambahkan!')
      setTimeout(() => router.push('/admin/dashboard'), 1500)
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan internal')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex justify-center items-center p-6">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700 text-center">
            Tambah Satuan Kerja Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Nama Satuan Kerja</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Kabupaten/Kota</label>
              <input
                type="text"
                value={kabupatenKota}
                onChange={(e) => setKabupatenKota(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {/* Password with eye toggle */}
            <div className="relative">
              <label className="block font-medium mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-2 top-1/2  inline-flex items-center justify-center p-1 rounded-md text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-600 text-center">{success}</p>}

            <div className="flex justify-end space-x-3 pt-3">
              <Button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-400 hover:bg-gray-500 text-white"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}