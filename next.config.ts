import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Local assets live in /public/images. If you later serve photography from a
    // CDN (Cloudinary, Imgix, S3 + CloudFront), whitelist the host here.
    // remotePatterns: [{ protocol: "https", hostname: "images.yourcdn.com" }],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920, 2560],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
