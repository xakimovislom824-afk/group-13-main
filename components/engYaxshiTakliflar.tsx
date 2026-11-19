"use client";

import { useMemo, useState } from "react";
import { getCategoryDisplayName, useGetCategoriesQuery } from "../services/categoryApi";
import { useGetProductsByCategoryQuery, useGetProductsQuery } from "../services/productApi";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

export default function EngYaxshiTakliflar() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: products = [], isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useGetProductsQuery();
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError, refetch: refetchCategories } = useGetCategoriesQuery();
  const {
    currentData: categoryPage,
    isLoading: categoryLoading,
    isError: categoryError,
    refetch: refetchCategory,
  } = useGetProductsByCategoryQuery(
    { slug: selectedCategory ?? "", limit: 0, skip: 0 },
    { skip: !selectedCategory },
  );
  const loading = productsLoading || categoriesLoading || categoryLoading;
  const hasError = productsError || categoriesError || categoryError;
  const deals = useMemo(
    () => (selectedCategory ? categoryPage?.products ?? [] : products)
      .filter((product) => product.is_sale)
      .sort((first, second) => Number(second.discountPercentage) - Number(first.discountPercentage))
      .slice(0, 5),
    [categoryPage?.products, products, selectedCategory],
  );

  if (loading) return <ProductSkeleton count={5} />;

  if (hasError) {
    return (
      <div role="alert" className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Takliflarni yuklashda xatolik yuz berdi.</p>
        <button type="button" onClick={() => { if (productsError) void refetchProducts(); if (categoriesError) void refetchCategories(); if (categoryError) void refetchCategory(); }} className="mt-4 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Qayta urinib ko&apos;rish</button>
      </div>
    );
  }

  return (
    <section aria-labelledby="best-deals-heading" className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-6">
      <h2 id="best-deals-heading" className="mb-5 text-2xl font-bold text-foreground sm:text-3xl">Eng yaxshi takliflar</h2>
      <div aria-label="Mahsulot kategoriyalari" className="scrollbar-hide mb-5 flex gap-2 overflow-x-auto pb-2">
        <button type="button" aria-pressed={selectedCategory === null} onClick={() => setSelectedCategory(null)} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}>
          Barcha mahsulotlar
        </button>
        {categories.map((category) => (
          <button key={category.slug} type="button" aria-pressed={selectedCategory === category.slug} onClick={() => setSelectedCategory(category.slug)} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${selectedCategory === category.slug ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}>
            {getCategoryDisplayName(category)}
          </button>
        ))}
      </div>
      {deals.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">Bu kategoriyada chegirmali mahsulotlar topilmadi.</p>
      ) : (
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
          {deals.map((product) => <div key={product.id} className="flex w-60 shrink-0"><ProductCard product={product} /></div>)}
        </div>
      )}
    </section>
  );
}
