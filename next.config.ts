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
    optimizePackageImports: ["lucide-react", "motion"],
  },

  /**
   * Files served straight from /public get `max-age=0` by default, so the
   * ~50MB of video would be re-fetched on every visit — the single largest
   * hosting cost this site has. These are static brand assets that change
   * rarely, so they are cached for 30 days with a week of
   * stale-while-revalidate on top.
   *
   * Deliberately not `immutable`: these paths are not content-hashed, so a
   * replaced photo or clip under the SAME filename would otherwise stay stale
   * in returning visitors' browsers. When swapping an asset, either give it a
   * new filename or accept up to 30 days of rollout.
   */
  async headers() {
    return [
      {
        source: "/:dir(videos|images)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
