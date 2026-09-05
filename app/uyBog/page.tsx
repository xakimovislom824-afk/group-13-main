"use client";

import ProductCard from "../../components/ProductCard";
import { useGetProductsQuery } from "../../services/productApi";

const categoryAliases = ["home-decoration", "furniture"];

export default function HomeProductsPage() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const filteredProducts = products.filter((product) => {
    const category = String(product.category ?? "").toLowerCase();
    return categoryAliases.includes(category);
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold mb-2">DummyJSON katalogi</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Home-decoration va furniture</h1>
        <p className="mt-3 text-slate-500">Uy uchun bezaklar, mebel va interyer mahsulotlari.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Mahsulotlar yuklanmoqda...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl py-16 text-center text-slate-500">
          Bu kategoriyalarda mahsulot topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}