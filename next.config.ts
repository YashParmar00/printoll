import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      ...["/thank-you", "/api/:path*", "/admin/:path*"].map(source => ({ source, headers: [{ key: "Cache-Control", value: "private, no-store" }, { key: "Referrer-Policy", value: "no-referrer" }] })),
      { source: "/uploads/hero/versioned/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
  images: {
    // WebP/AVIF for the free lifestyle shots (Pexels/Unsplash) and hosted
    // product mockups / customer photos we add from M3 onward.
    formats: ["image/avif", "image/webp"],
    // Default is 4h, after which every image is re-optimized cold. Product
    // images get new filenames when they change, so a long TTL is safe.
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
