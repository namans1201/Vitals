import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project — there's a stray package-lock.json
  // higher up in C:\Users\naman that would otherwise confuse detection.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
