"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhoneCall, Phone, MessageCircle, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function ActionButtons() {
  const [openCall, setOpenCall] = useState(false);
  const [openSocial, setOpenSocial] = useState(false);
  const callRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fungsi Logout
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


  // Tutup dropdown Social saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        socialRef.current &&
        !socialRef.current.contains(event.target as Node)
      ) {
        setOpenSocial(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup dropdown Call saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (callRef.current && !callRef.current.contains(event.target as Node)) {
        setOpenCall(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-2">
      {/* Social Button */}
      <div className="relative" ref={socialRef}>
        <Button
          onClick={() => setOpenSocial(!openSocial)}
          variant="secondary"
          className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 hover:cursor-pointer hover:transition-shadow"
        >
          <span className="hidden md:inline">Sosial Media BPJS</span>
          <MessageCircle className="h-4 w-4 md:hidden" />
        </Button>

        {openSocial && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-sky-100 bg-white shadow-lg animate-in fade-in slide-in-from-top-1 p-3">
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              <Link
                href="https://instagram.com/bpjskesehatan_ri"
                target="_blank"
                className="group flex flex-col items-center gap-1 hover:scale-105 transition"
              >
                <Image
                  alt="Instagram"
                  src="/image/instagram.png"
                  width={24}
                  height={24}
                  className="transition-transform group-hover:scale-110"
                />
              </Link>

              <Link
                href="https://www.tiktok.com/@bpjskesehatan_ri"
                target="_blank"
                className="group flex flex-col items-center gap-1 hover:scale-105 transition"
              >
                <Image
                  alt="Tiktok"
                  src="/image/tiktok.png"
                  width={24}
                  height={24}
                  className="transition-transform group-hover:scale-110"
                />
              </Link>

              <Link
                href="https://www.facebook.com/BPJSKesehatanRI"
                target="_blank"
                className="group flex flex-col items-center gap-1 hover:scale-105 transition"
              >
                <Image
                  alt="Facebook"
                  src="/image/facebook.png"
                  width={24}
                  height={24}
                  className="transition-transform group-hover:scale-110"
                />
              </Link>

              <Link
                href="https://x.com/BPJSkesehatanri"
                target="_blank"
                className="group flex flex-col items-center gap-1 hover:scale-105 transition"
              >
                <Image
                  alt="Twitter"
                  src="/image/twitter.png"
                  width={24}
                  height={24}
                  className="transition-transform group-hover:scale-110"
                />
              </Link>

              <Link
                href="https://www.youtube.com/@bpjskesehatan_ri"
                target="_blank"
                className="group flex flex-col items-center gap-1 hover:scale-105 transition"
              >
                <Image
                  alt="YouTube"
                  src="/image/youtube.png"
                  width={24}
                  height={24}
                  className="transition-transform group-hover:scale-110"
                />
              </Link>
              <Link
                href="https://www.bpjs-kesehatan.go.id/"
                target="_blank"
                className="group flex flex-col items-center gap-1 hover:scale-105 transition"
              >
                <Image
                  alt="Website"
                  src="/image/web.png"
                  width={24}
                  height={24}
                  className="transition-transform group-hover:scale-110"
                />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Call Button */}
      <div className="relative" ref={callRef}>
        <Button
          onClick={() => setOpenCall(!openCall)}
          className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 hover:cursor-pointer transition hover:transition-shadow"
        >
          <PhoneCall className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Butuh Bantuan?</span>
        </Button>

        {openCall && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-sky-100 bg-white shadow-lg animate-in fade-in slide-in-from-top-1">
            <Link
              href="https://wa.me/628118165165"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-sky-50 text-green-700"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Link>
            <a
              href="tel:165"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-sky-50 text-green-700"
            >
              <Phone className="h-4 w-4" />
              Telepon
            </a>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 hover:cursor-pointer transition hover:transition-shadow"
      >
        <LogOut className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline">Logout</span>
      </Button>
    </div>
  );
}
