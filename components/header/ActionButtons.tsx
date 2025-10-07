import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Button } from "../ui/button";

export default function ActionButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="secondary"
        className="hidden rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100 md:inline-flex"
      >
        <Link href="#categories">Jelajahi Layanan</Link>
      </Button>
      <Button
        asChild
        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
      >
        <Link href="#contact" className="inline-flex items-center gap-2">
          <PhoneCall className="h-4 w-4" />
          Butuh Bantuan?
        </Link>
      </Button>
    </div>
  );
}
