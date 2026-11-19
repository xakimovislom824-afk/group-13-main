import type { Metadata } from "next";
import { pageMetadata } from "../../lib/site-config";

export const metadata: Metadata = pageMetadata("Yetkazib berish", "Islomx7 katalogidagi yetkazib berish haqida ma'lumot.", "/yetkazib-berish");

export default function DeliveryLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
