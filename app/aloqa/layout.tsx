import type { Metadata } from "next";
import { pageMetadata } from "../../lib/site-config";

export const metadata: Metadata = pageMetadata("Aloqa", "Islomx7 jamoasi bilan bog'lanish ma'lumotlari.", "/aloqa");

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
