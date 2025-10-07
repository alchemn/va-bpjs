"use client";

import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs-backend-webgl";

export default function FaceWatcher() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastGreetRef = useRef<number>(0);
  const speakingRef = useRef<boolean>(false);
  const [showAvatar, setShowAvatar] = useState(false); // kontrol video heygen

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "id-ID";
    utter.rate = 1.0;
    utter.pitch = 1.0;

    speakingRef.current = true;
    utter.onend = () => {
      speakingRef.current = false;
      setShowAvatar(false); // sembunyikan avatar pas selesai ngomong
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let model: blazeface.BlazeFaceModel | null = null;
    let animationId: number | null = null;

    const cooldownMs = 10000;
    const minConfidence = 0.85;
    const text =
      "Assalamu'alaikum, selamat datang di BPJS Kesehatan Banda Aceh. Saya Asisten Virtual siap membantu kebutuhan anda.";

    const setupCamera = async () => {
      await tf.setBackend("webgl");
      await tf.ready();

      model = await blazeface.load();

      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      detectLoop();
    };

    const detectLoop = async () => {
      if (!videoRef.current || !model) {
        animationId = requestAnimationFrame(detectLoop);
        return;
      }

      const predictions = await model.estimateFaces(videoRef.current, false);
      const now = Date.now();

      const hasFace = predictions.some((p) => {
        const prob =
          typeof p.probability === "number"
            ? p.probability
            : Array.isArray(p.probability) && p.probability.length > 0
            ? p.probability[0]
            : 0;
        return prob >= minConfidence;
      });

      if (hasFace && now - lastGreetRef.current > cooldownMs && !speakingRef.current) {
  lastGreetRef.current = now;
  setShowAvatar(true);

  // kalau videonya udah ada suara, jangan pakai speechSynthesis lagi
  const useHeyGenAudio = true;
  if (!useHeyGenAudio) {
    speak(text);
  }
}

      animationId = requestAnimationFrame(detectLoop);
    };

    setupCamera().catch(console.error);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      try {
        window.speechSynthesis.cancel();
      } catch {}
    };
  }, []);

  return (
    <>
      {/* Kamera tersembunyi */}
      <div
        className="fixed inset-0 pointer-events-none opacity-0 select-none"
        style={{ zIndex: -1 }}
      >
        <video ref={videoRef} muted playsInline className="w-0 h-0" />
      </div>

      {/* Avatar muncul pas deteksi wajah */}
      {showAvatar && (
 <div
  className="fixed bottom-8 right-8 z-50 bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-sky-200 flex items-center justify-center animate-slide-up"
>
  <video
    src="/avatar/greet.mp4"
    autoPlay
    playsInline
    controls={false}
    className="w-60 h-60 rounded-xl object-cover"
    onEnded={() => setShowAvatar(false)}
  />
</div>

)}
    </>
  );
}
