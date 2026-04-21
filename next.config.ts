import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Đóng gói ffmpeg-static ở server, không đưa vào client bundle
  serverExternalPackages: ['fluent-ffmpeg', 'ffmpeg-static'],

  experimental: {
    serverActions: {
      // Tăng giới hạn body lên 600MB để upload video lớn
      bodySizeLimit: '600mb',
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        // Cloudflare R2 public domain
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
};

export default nextConfig;
