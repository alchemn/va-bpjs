import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["pixi.js", "pixi-live2d-display"],
  },
};

export default nextConfig;
