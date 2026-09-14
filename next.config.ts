import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Three Fiber's <Canvas> owns a single WebGL context. Strict Mode's
  // dev-only double mount tears down that context (forceContextLoss) and the
  // remount can fail to reacquire it, leaving the cube blank ("Context Lost").
  reactStrictMode: false,
};

export default nextConfig;
