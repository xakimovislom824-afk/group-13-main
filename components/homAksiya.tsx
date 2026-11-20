"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { useGetProductsQuery } from "../services/productApi";

export default function HomAksiya() {
  const { data: products = [], isLoading, isError, refetch } = useGetProductsQuery();
  const discountedProducts = products
    .filter((product) => product.is_sale)
    .sort((first, second) => Number(second.discountPercentage) - Number(first.discountPercentage))
    .slice(0, 4);

  return (
    <section aria-labelledby="home-offers-heading" className="py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-secondary">DummyJSON katalogi</p>
          <h2 id="home-offers-heading" className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl">Aksiyadagi mahsulotlar</h2>
        </div>
        <Link href="/aksiyalar" className="text-sm font-semibold text-secondary hover:underline">Barcha aksiyalar</Link>
      </div>

      {isLoading ? (
        <ProductSkeleton count={4} />
      ) : isError ? (
        <div role="alert" className="rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground">Aksiyadagi mahsulotlarni yuklab bo&apos;lmadi.</p>
          <button type="button" onClick={() => void refetch()} disabled={isLoading} className="mt-3 font-semibold text-primary hover:underline disabled:opacity-50">Qayta urinib ko&apos;rish</button>
        </div>
      ) : discountedProducts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-muted-foreground">Hozircha chegirmali mahsulotlar mavjud emas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {discountedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}
