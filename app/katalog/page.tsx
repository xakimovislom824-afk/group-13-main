"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Products from "../../components/products";
import Katalog2 from "../katalog2/page";

// Next.js build vaqtida useSearchParams xatosi bermasligi uchun dynamic rejimni yoqamiz
export const dynamic = "force-dynamic";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      {searchQuery && (
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600">
            "<b className="text-gray-800">{searchQuery}</b>" bo'yicha qidiruv natijalari
          </span>
          <Link
            href="/katalog"
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            Tozalash
          </Link>
        </div>
      )}

      <div className="flex items-start gap-8 relative">
        <div className="hidden sticky top-5 lg:block w-[300px] shrink-0">
          <Katalog2 />
        </div>
        <main className="flex-1 min-w-0">
          <div className="lg:hidden mb-4">
            <Katalog2 />
          </div>
          <Products searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
}