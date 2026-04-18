import type { NextConfig } from "next";

// Product imagery lives under /public/images/products. Add `images.remotePatterns` if you use next/image with remote URLs again.

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
