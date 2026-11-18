"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import { useGetProductsQuery } from "../services/productApi";
import ProductCard from "./ProductCard";

interface ProductsProps {
  searchQuery?: string;
}

const Products = ({ searchQuery = "" }: ProductsProps) => {
  const { data: products = [], isLoading, isFetching, isError, refetch } = useGetProductsQuery();

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(q));
  }, [products, searchQuery]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-md h-64" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-sm text-red-600">Mahsulotlarni yuklashda xatolik yuz berdi.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--secondary-soft)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFetching ? "Qayta yuklanmoqda..." : "Qayta urinish"}
        </button>
      </div>
    );
  }

  if (searchQuery && filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search aria-hidden="true" className="mb-4 h-10 w-10 text-slate-300" />
        <p className="text-lg font-bold text-gray-700 mb-1">
          «{searchQuery}» topilmadi
        </p>
        <p className="text-sm text-gray-400">
          {"Boshqa kalit so'z bilan qidirib ko'ring"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {searchQuery && filteredProducts.length > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-700">
            {filteredProducts.length}
          </span>{" "}
          ta mahsulot topildi
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
