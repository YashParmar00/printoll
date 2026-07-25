import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WebP/AVIF for the free lifestyle shots (Pexels/Unsplash) and hosted
    // product mockups / customer photos we add from M3 onward.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
