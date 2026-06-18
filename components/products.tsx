"use client";

import { useMemo } from "react";
import { useGetProductsQuery } from "../services/productApi";
import ProductCard from "./ProductCard";

interface ProductsProps {
  searchQuery?: string;
}

const Products = ({ searchQuery = "" }: ProductsProps) => {
  const { data, isLoading, isError } = useGetProductsQuery();
  const products = data || [];

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
      <div className="flex items-center justify-center py-20 text-red-500 text-sm">
        Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.
      </div>
    );
  }

  if (searchQuery && filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-bold text-gray-700 mb-1">
          «{searchQuery}» topilmadi
        </p>
        <p className="text-sm text-gray-400">
          Boshqa kalit so'z bilan qidirib ko'ring
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {searchQuery && filteredProducts.length > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-700">{filteredProducts.length}</span> ta mahsulot topildi
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
