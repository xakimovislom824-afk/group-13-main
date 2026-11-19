import type { Metadata } from "next";
import { pageMetadata } from "../../lib/site-config";

export const metadata: Metadata = pageMetadata("Savatcha", "Islomx7 savatingizdagi mahsulotlarni ko'rib chiqing.", "/savatcha");

export default function CartLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
