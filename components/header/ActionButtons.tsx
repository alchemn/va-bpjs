"use client"
import {useState} from "react";
import Link from "next/link";
import { PhoneCall,Phone, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function ActionButtons() {
  const [open,setOpen] = useState(false)
  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="secondary"
        className="hidden rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100 md:inline-flex"
      >
        <Link href="#categories">Jelajahi Layanan</Link>
      </Button>
      <div className="relative">
      <Button
        asChild
        onClick={() => setOpen(!open)}
        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
      >
        <Link href="#contact" className="inline-flex items-center gap-2">
          <PhoneCall className="h-4 w-4" />
          Butuh Bantuan?
        </Link>
      </Button>
       {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-sky-100 bg-white shadow-lg animate-in fade-in slide-in-from-top-1">
            <Link
              href="https://wa.me/62811816565"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-sky-50 text-sky-700"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Link>
            <a
              href="tel:+165"
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
