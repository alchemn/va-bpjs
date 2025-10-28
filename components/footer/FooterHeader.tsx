import Image from "next/image"
import Link from "next/link"

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
        <Link href="https://apps.apple.com/ru/app/mobile-jkn/id1237601115?l=en" target="_blank" rel="noopener noreferrer">
        <Image
          alt="App Store"
          src="/image/appstore.png"
          width={120}
          height={120}
          className="object-contain"
        />
        </Link>
        <Link
  href="https://play.google.com/store/apps/details?id=app.bpjs.mobile&hl=en&gl=US"
  target="_blank"
  rel="noopener noreferrer"
>
  <Image
    alt="Play Store"
    src="/image/playstore.png"
    width={120}
    height={120}
    className="object-contain"
  />
  </Link>
      </div>
    </div>
  )
}
