import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Strict-Transport-Security", value: "max-age=63072000" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
      ],
    }];
  },
  async redirects() {
    return [
      { source: "/qurilishMateriallari", destination: "/katalog/qurilish-materiallari", permanent: true },
      { source: "/asbobUskunalar", destination: "/katalog/asbob-uskunalar", permanent: true },
      { source: "/elektr", destination: "/katalog/elektr", permanent: true },
      { source: "/santexnika", destination: "/katalog/santexnika", permanent: true },
      { source: "/uyBog", destination: "/katalog/uy-va-bog", permanent: true },
      { source: "/yetkazibBerish", destination: "/yetkazib-berish", permanent: true },
      { source: "/savolJavob", destination: "/savol-javob", permanent: true },
      { source: "/xafsizlik", destination: "/maxfiylik-siyosati", permanent: true },
      { source: "/tulov", destination: "/tolov", permanent: true },
      { source: "/login", destination: "/kirish", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dummyjson.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
