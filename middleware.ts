import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  // --- 1. Proteksi halaman yang butuh login ---
  const protectedPaths = ['/admin', '/dashboard', '/administrasi', '/pengaduan', '/informasi']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // --- 2. Cegah user yang sudah login masuk ke /login lagi ---
  if (pathname === '/login' && token) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // --- 3. Batasi akses admin hanya untuk /admin/*
if (/^\/admin(\/|$)/.test(pathname) && role !== 'ADMIN') {
  return NextResponse.redirect(new URL('/', request.url))
}


  // --- 4. Larang admin akses halaman user biasa ---
  const userOnlyPaths = ['/administrasi', '/pengaduan', '/informasi']
  const isUserOnly = userOnlyPaths.some(path => pathname.startsWith(path))

  if (isUserOnly && role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

// Middleware aktif di semua route terkait
export const config = {
  matcher: [
    '/login',
    '/admin/:path*',
    '/dashboard/:path*',
    '/administrasi/:path*',
    '/pengaduan/:path*',
    '/informasi/:path*',
    '/',
  ],
}


