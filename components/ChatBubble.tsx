"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ChatBubble() {
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState("");

  const fullText =
    "Anda dapat mendaftar melalui aplikasi Mobile JKN atau datang ke kantor cabang dengan membawa KTP dan KK"

  useEffect(() => {
    // Tunda 2 detik sebelum mulai ngetik
    const delay = setTimeout(() => {
      setIsTyping(false);
      let i = 0;
      const typer = setInterval(() => {
        if (i >= fullText.length) {
          return clearInterval(typer);
        }
        setDisplayedText((prev) => prev + fullText.charAt(i));
        i += 1;
      }, 25); // kecepatan ngetik
      return () => clearInterval(typer);
    }, 2000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className="space-y-4 py-4 text-sm">
      <div className="flex justify-end">
        <span className="inline-flex max-w-[80%] rounded-2xl rounded-br-sm bg-sky-600 px-4 py-2 text-white">
          Bagaimana cara daftar BPJS secara online?
        </span>
      </div>

      <div className="flex items-start gap-3">
        <Image
          src="/avatar/va.png"
          alt="Avatar Virtual Assistant"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full border border-sky-100 bg-sky-50 object-cover"
        />

        <span className="inline-flex max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2 text-slate-700 transition-all duration-500">
          {isTyping ? (
            <span className="flex items-center gap-1">
              <span className="dot w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.2s]" />
              <span className="dot w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.1s]" />
              <span className="dot w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
            </span>
          ) : (
            <span className="whitespace-pre-line animate-fadeIn">{displayedText}</span>
          )}
        </span>
      </div>
    </div>
  );
}
