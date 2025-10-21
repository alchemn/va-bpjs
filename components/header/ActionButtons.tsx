"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PhoneCall, Phone, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function ActionButtons() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar elemen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center gap-2">
      <Button
        asChild
        variant="secondary"
        className="hidden rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100 md:inline-flex"
      >
        <Link href="#categories">Jelajahi Layanan</Link>
      </Button>

      <div className="relative" ref={dropdownRef}>
        <Button
          onClick={() => setOpen(!open)}
          className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          <PhoneCall className="h-4 w-4 mr-2" />
          Butuh Bantuan?
        </Button>

        {open && (
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
