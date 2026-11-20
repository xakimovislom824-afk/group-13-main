import type { MetadataRoute } from "next";
import { siteConfig } from "../lib/site-config";

const publicRoutes = [
  "/",
  "/katalog",
  "/aksiyalar",
  "/blog",
  "/aloqa",
  "/yetkazibBerish",
  "/tulov",
  "/savolJavob",
  "/biz-haqimizda",
  "/qaytarish-va-kafolat",
  "/xafsizlik",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return publicRoutes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
