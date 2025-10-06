import React from 'react'
import Image from 'next/image';
import {JetBrains_Mono} from 'next/font/google';

const jetBrains_Mono = JetBrains_Mono({
    subsets: ['latin'],
    weight:"400"
})

const Navbar = () => {
  return (
    <div className="flex items-center justify-between py-2 px-6 border border-white/20 bg-gray-600 backdrop-blur-3xl shadow-lg rounded-lg mx-7 my-2">
        <div
        className="flex flex-row items-center">
            <Image src="/logo.png" alt="logo" width={80} height={10}/>
            <h1 className={`${jetBrains_Mono} text-2xl font-bold text-black`}>Virtual Assistant <span className="font-bold text-green-700">BPJS</span></h1>
        </div>
        <div>
            <h2>Avatar</h2>
        </div>
    </div>
  )
}

export default Navbar