import Image from 'next/image';
import { JetBrains_Mono } from 'next/font/google';

const jetBrains_Mono = JetBrains_Mono({
    subsets: ['latin'],
    weight:"400"
});

export default function Logo() {
  return (
    <div className="flex flex-row items-center">
      <Image src="/image/logo.png" alt="logo" width={50} height={50} />
      <div className="leading-tight"><p className="text-sm font-semibold uppercase tracking-wide text-sky-600">Virtual Assistant</p><p class="text-base font-semibold text-green-700">BPJS Kesehatan</p></div>
    </div>
  );
}
