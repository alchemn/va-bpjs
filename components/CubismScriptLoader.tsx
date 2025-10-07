"use client";

import Script from "next/script";

export default function CubismScriptLoader() {
  return (
    <>
      <Script
        src="/js/live2dcubismcore.js"
        strategy="lazyOnload"
        onError={() => {
          console.error("Failed to load Live2D Cubism Core library. This may cause Live2D models to not work properly.");
        }}
      />
    </>
  );
}