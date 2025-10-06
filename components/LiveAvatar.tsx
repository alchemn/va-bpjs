"use client";
import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";

interface Live2DAvatarProps {
  audio?: HTMLAudioElement | null;
}

export default function Live2DAvatar({ audio }: Live2DAvatarProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<Live2DModel | null>(null);

  useEffect(() => {
    let app: PIXI.Application;

    const init = async () => {
      try {
        app = new PIXI.Application({
          view: document.createElement("canvas"),
          transparent: true,
          width: 400,
          height: 400,
          backgroundAlpha: 0,
        });

        if (canvasRef.current) {
          canvasRef.current.innerHTML = "";
          canvasRef.current.appendChild(app.view);
        }

        const m = await Live2DModel.from("model/model.json");
        m.scale.set(0.4);
        m.x = 100;
        m.y = 300;
        app.stage.addChild(m);
        setModel(m);
      } catch (err) {
        console.error("⚠️ Gagal inisialisasi Live2D:", err);
      }
    };

    init();

    return () => {
      if (app) app.destroy(true, true);
      if (canvasRef.current) canvasRef.current.innerHTML = "";
    };
  }, []);

  // 🎙️ Sinkronisasi gerak mulut ke audio
  useEffect(() => {
    if (!audio || !model) return;

    const audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const updateMouth = () => {
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a, b) => a + b, 0) / data.length;
      const mouth = Math.min(volume / 80, 1);

      const coreModel = model.internalModel.coreModel;
      const current = coreModel.getParameterValueById("ParamMouthOpenY");
      coreModel.setParameterValueById(
        "ParamMouthOpenY",
        current * 0.7 + mouth * 0.3
      );

      requestAnimationFrame(updateMouth);
    };

    updateMouth();
  }, [audio, model]);

  return (
    <div
      ref={canvasRef}
      className="w-[400px] h-[400px] flex justify-center items-center"
    />
  );
}
