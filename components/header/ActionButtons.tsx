"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PhoneCall, Phone, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function ActionButtons() {
  const [openCall, setOpenCall] = useState(false);
  const [openSocial, setOpenSocial] = useState(false);
  const callRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

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
      if (
        callRef.current &&
        !callRef.current.contains(event.target as Node)
      ) {
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
          className="hidden rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100 md:inline-flex"
        >
          Social Media BPJS
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
          alt="YouTube"
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
          className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          <PhoneCall className="h-4 w-4 mr-2" />
          Butuh Bantuan?
        </Button>

        {openCall && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-sky-100 bg-white shadow-lg animate-in fade-in slide-in-from-top-1">
            <Link
              href="https://wa.me/628118165165"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-sky-50 text-sky-700"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Link>
            <a
              href="tel:165"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-sky-50 text-sky-700"
            >
              <Phone className="h-4 w-4" />
              Telepon
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
