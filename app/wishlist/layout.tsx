import type { Metadata } from "next";
import { pageMetadata } from "../../lib/site-config";

export const metadata: Metadata = pageMetadata("Saralangan mahsulotlar", "Islomx7 da saqlangan sevimli mahsulotlaringiz.", "/wishlist");

export default function WishlistLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
