import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ ปิด eslint ตอน build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ ปิด typecheck ตอน build
  },
};

export default nextConfig;
