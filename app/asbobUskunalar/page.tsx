"use client";

import ProductCard from "../../components/ProductCard";
import { useGetProductsQuery } from "../../services/productApi";

const categoryAliases = [2, 1, 20, 18, 19];

export default function AsbobUskunalarPage() {
  const { data: products = [], isLoading } = useGetProductsQuery();

  const filteredProducts = products.filter((product) => {
    return categoryAliases.includes(Number(product.category));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold mb-2">Katalog</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Asbob-uskunalar va texnika</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Yuklanmoqda...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-16 text-center text-slate-500">
          Bu bo'limga mos mahsulotlar topilmadi.
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