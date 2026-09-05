"use client";

import ProductCard from "../../components/ProductCard";
import { useGetProductsQuery } from "../../services/productApi";

const categoryAliases = [3, 4, 5, 6];

export default function SantexnikaPage() {
  const { data: products = [], isLoading } = useGetProductsQuery();

  const filteredProducts = products.filter((product) => {
    return categoryAliases.includes(Number(product.category));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold mb-2">Katalog</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Santexnika va kundalik ehtiyoj mahsulotlari</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Yuklanmoqda...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-16 text-center text-slate-500">
          Santexnika mahsulotlari topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}