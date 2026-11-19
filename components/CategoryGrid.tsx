"use client";

import Link from "next/link";
import { Package, Smartphone, Laptop, Sparkles, Shirt, Sofa, ShoppingBasket, Watch, Glasses, Car, Lamp, Tablet, type LucideIcon } from "lucide-react";
import { getCategoryDisplayName, useGetCategoriesQuery } from "../services/categoryApi";

const categoryIcons: Record<string, LucideIcon> = {
  beauty: Sparkles, fragrances: Sparkles, furniture: Sofa, groceries: ShoppingBasket,
  laptops: Laptop, smartphones: Smartphone, "mens-shirts": Shirt, "womens-dresses": Shirt,
  "mens-watches": Watch, "womens-watches": Watch, sunglasses: Glasses,
  vehicle: Car, motorcycle: Car, lighting: Lamp, tablets: Tablet,
};

export default function CategoryGrid() {
  const { data: categories = [], isLoading, isError, refetch } = useGetCategoriesQuery();
  if (isLoading) return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />)}</div>;
  if (isError) return <div role="alert" className="rounded-xl border border-border bg-card p-6 text-center"><p className="text-muted-foreground">Kategoriyalarni yuklab bo&apos;lmadi.</p><button type="button" onClick={() => void refetch()} className="mt-3 font-semibold text-primary hover:underline">Qayta urinish</button></div>;
  if (categories.length === 0) return <p className="py-8 text-center text-muted-foreground">Hozircha kategoriyalar mavjud emas.</p>;
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{categories.map((category) => {
    const Icon = categoryIcons[category.slug] ?? Package;
    return <Link key={category.slug} href={`/katalog/${category.slug}`} className="group rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:border-secondary hover:shadow-[var(--card-shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"><span className="mb-4 grid size-11 place-items-center rounded-lg bg-[var(--secondary-soft)] text-secondary transition-colors group-hover:bg-secondary group-hover:text-white"><Icon aria-hidden="true" size={22} /></span><span className="text-sm font-bold">{getCategoryDisplayName(category)}</span></Link>;
  })}</div>;
}
