"use client";

import { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs-backend-webgl";

export default function FaceWatcher() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastGreetRef = useRef<number>(0);
  const speakingRef = useRef<boolean>(false);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "id-ID";
    utter.rate = 1.0;
    utter.pitch = 1.0;
    speakingRef.current = true;
    utter.onend = () => (speakingRef.current = false);
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
      "Assalamu'alaikum, selamat datang di BPJS Kesehatan Banda Aceh. Saya Asisten Virtual siap membantu.";

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

      const hasFace = predictions.some(
        (p) => (p.probability?.[0] ?? 0) >= minConfidence
      );

      if (hasFace && now - lastGreetRef.current > cooldownMs && !speakingRef.current) {
        lastGreetRef.current = now;
        speak(text);
      }

      animationId = requestAnimationFrame(detectLoop);
    };

    setupCamera().catch(console.error);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      try { window.speechSynthesis.cancel(); } catch {}
    };
  }, []);

  return (
  <>
    {/* Kamera tersembunyi total */}
    <div
      className="fixed inset-0 pointer-events-none opacity-0 select-none"
      style={{ zIndex: -1 }}
    >
      <video ref={videoRef} muted playsInline className="w-0 h-0" />
    </div>
  </>
);

}
