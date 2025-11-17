'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Cegah user yang sudah login membuka halaman login lagi
  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (token && role) {
      if (role === 'ADMIN') router.push('/admin/dashboard')
      else if (role === 'SATKER') router.push('/')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login gagal')
        return
      }

      // Simpan token dan info user (client-side)
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('satuanKerja', data.satuanKerja || '')

      // Simpan token & role di cookie agar bisa diakses middleware
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`
      document.cookie = `role=${data.role}; path=/; max-age=${7 * 24 * 60 * 60}`

      // Redirect sesuai role
      if (data.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else if (data.role === 'SATKER') {
        router.push('/')
      } else {
        setError('Unknown role')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan internal')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl border border-gray-100 p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/image/logo.png"
            alt="Logo BPJS"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Judul */}
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-2">
          Login Sistem BPJS
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Silakan masuk untuk melanjutkan ke dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
