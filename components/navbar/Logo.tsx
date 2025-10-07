import Image from 'next/image';
import { JetBrains_Mono } from 'next/font/google';

const jetBrains_Mono = JetBrains_Mono({
    subsets: ['latin'],
    weight:"400"
});

export default function Logo() {
  return (
    <div className="flex flex-row items-center">
      <Image src="/logo.png" alt="logo" width={80} height={10} />
      <h1 className={`${jetBrains_Mono.className} text-2xl font-bold text-black`}>Virtual Assistant <span className="font-bold text-green-700">BPJS</span></h1>
    </div>
  );
}
