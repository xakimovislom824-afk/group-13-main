import type { Metadata } from "next";
import { pageMetadata } from "../../lib/site-config";

export const metadata: Metadata = pageMetadata("Mahsulotlar katalogi", "Islomx7 katalogidagi mahsulotlarni qidiring va ko'rib chiqing.", "/katalog");

export default function CatalogLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
