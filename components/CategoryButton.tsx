import { Button } from "./ui/button"
import Link from "next/link"

const CategoryButton = () => {
  return (
          <div className="mt-8 flex flex-col gap-4 items-center">
        <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold py-3 w-64 rounded-full">
        <Link href="/informasi">
          Informasi
          </Link>
        </Button>
        <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold py-3 w-64 rounded-full">
            <Link href="/pengaduan">
          Pengaduan
          </Link>
        </Button>
        <Button className="bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3 w-64 rounded-full">
            <Link href="/administrasi">
          Administrasi
          </Link>
        </Button>
      </div>
  )
}

export default CategoryButton