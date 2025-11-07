import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "@/lib/social-links";

export default function FooterHeader() {
  return (
    <div className="flex items-center mx-auto justify-between">
      <Image
        alt="Footer BPJS"
        src="/image/footer.png"
        width={400}
        height={400}
        className="object-contain"
      />

      <div className="flex items-center gap-3">
        {socialLinks.map((link) => (
          <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
            <Image
              alt={link.alt}
              src={link.src}
              width={120}
              height={120}
              className="object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
