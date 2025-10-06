"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AvatarTalking({ isSpeaking }: { isSpeaking: boolean }) {
  const frames = [
    "/avatar/mouth_idle.png",
    "/avatar/mouth_half.png",
    "/avatar/mouth_open.png",
    "/avatar/mouth_wide.png",
  ];

  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (isSpeaking) {
      let i = 0;
      const interval = setInterval(() => {
        setFrame(i % frames.length);
        i++;
      }, 150); // ganti frame tiap 150ms
      return () => clearInterval(interval);
    } else {
      setFrame(0); // balik idle
    }
  }, [isSpeaking, frames.length]);

  return (
    <div className="flex justify-center">
      <Image
        src={frames[frame]}
        alt="Avatar BPJS Talking"
        className="w-48 h-48"
      />
    </div>
  );
}
