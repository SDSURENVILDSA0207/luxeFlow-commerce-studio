import type { NextConfig } from "next";

// Product imagery lives under /public/images/products. Add `images.remotePatterns` if you use next/image with remote URLs again.

const nextConfig: NextConfig = {
  typedRoutes: true,
  /** Hides the Next.js development “N” / tools badge in the browser (not the framework itself). */
  devIndicators: false
};

export default nextConfig;
