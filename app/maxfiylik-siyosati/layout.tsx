import type { Metadata } from "next";
import { pageMetadata } from "../../lib/site-config";

export const metadata: Metadata = pageMetadata("Maxfiylik siyosati", "Islomx7 saytidan foydalanish va shaxsiy ma'lumotlarni himoya qilish haqida.", "/maxfiylik-siyosati");

export default function PrivacyLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
