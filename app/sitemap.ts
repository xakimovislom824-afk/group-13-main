import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://group-13-main-zeta.vercel.app";
  const routes = ["/", "/katalog", "/savatcha", "/wishlist", "/kirish", "/yetkazib-berish", "/tolov", "/aloqa", "/biz-haqimizda", "/maxfiylik-siyosati"];
  return routes.map((route) => ({
    url: new URL(route, baseUrl).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));
}
