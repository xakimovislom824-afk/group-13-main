import type { Metadata } from "next";
import { pageMetadata } from "../../lib/site-config";

export const metadata: Metadata = pageMetadata("Kirish", "Islomx7 hisobingizga kiring.", "/kirish");

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
