import type { Metadata } from "next";
import { pageMetadata } from "../../lib/site-config";

export const metadata: Metadata = pageMetadata("To'lov", "Islomx7 katalogida to'lov bo'yicha ma'lumotlar.", "/tolov");

export default function PaymentLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
