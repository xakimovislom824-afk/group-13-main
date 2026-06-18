"use client";

import { useSearchParams } from "next/navigation";
import Products from "../../components/products";
import Katalog2 from "../katalog2/page";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      <div className="flex items-start gap-8 relative">
        <div className="hidden lg:block w-[300px] shrink-0">
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
