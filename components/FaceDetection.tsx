"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs-backend-webgl";

export default function FaceWatcher() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastGreetRef = useRef<number>(0);
  const speakingRef = useRef<boolean>(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "id-ID";
    utter.rate = 1.0;
    utter.pitch = 1.0;

    speakingRef.current = true;
    utter.onend = () => {
      speakingRef.current = false;
      setShowAvatar(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const savePosition = (x: number, y: number) => {
    localStorage.setItem("avatarPosition", JSON.stringify({ x, y }));
  };

  useEffect(() => {
    const saved = localStorage.getItem("avatarPosition");
    if (saved) setPosition(JSON.parse(saved));
  }, []);

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

  // 🔹 Fungsi Snap ke Corner
  const snapToCorner = (x: number, y: number) => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const margin = 32; // jarak 2rem
    const avatarSize = 240; // kira-kira tinggi/lebarnya avatar

    // hitung posisi x dan y
    const snapX = x < screenW / 2 - avatarSize / 2 ? -screenW / 2 + margin : screenW / 2 - avatarSize - margin;
    const snapY = y < screenH / 2 - avatarSize / 2 ? -screenH / 2 + margin : screenH / 2 - avatarSize - margin;

    return { x: snapX, y: snapY };
  };

  return (
    <>
      {/* Kamera tetap aktif tapi tersembunyi */}
      <div className="absolute top-0 left-0 w-px h-px overflow-hidden">
        <video ref={videoRef} muted playsInline />
      </div>

      {/* Avatar bisa di-drag dan responsif */}
      <motion.div
        className="fixed z-50 flex items-center justify-center cursor-grab active:cursor-grabbing"
        drag
        dragMomentum={false}
        dragElastic={0.2}
       onDragEnd={(_, info) => {
  const newX = position.x + info.offset.x;
  const newY = position.y + info.offset.y;

  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const avatarSize = 240;
  const margin = 32;

  const halfW = screenW / 2 - avatarSize / 2 - margin;
  const halfH = screenH / 2 - avatarSize / 2 - margin;

  const clampedX = Math.max(-halfW, Math.min(halfW, newX));
  const clampedY = Math.max(-halfH, Math.min(halfH, newY));

  const snapped = snapToCorner(clampedX, clampedY);

  setPosition(snapped);
  savePosition(snapped.x, snapped.y);
}}

        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{
          bottom: "2rem",
          right: "2rem",
          touchAction: "none",
        }}
      >
        <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60">
          <AnimatePresence mode="wait">
            {showAvatar ? (
              <motion.video
                key="greet"
                src="/avatar/test.mp4"
                autoPlay
                playsInline
                onEnded={() => setShowAvatar(false)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full rounded-full object-cover shadow-2xl"
              />
            ) : (
              <motion.video
                key="idle"
                src="/avatar/idle.mp4"
                autoPlay
                loop
                muted
                playsInline
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full rounded-full object-cover shadow-xl"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
