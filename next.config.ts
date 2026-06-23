import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'deployminigroup13.pythonanywhere.com',
        pathname: '/**',  // ✅ barcha pathlar
      },
    ],
  },
};

export default nextConfig;