import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'deployminigroup13.pythonanywhere.com',
        pathname: '/media/**', // barcha papkalardagi rasmlarga ruxsat berish
      },
    ],
  },
};

export default nextConfig;