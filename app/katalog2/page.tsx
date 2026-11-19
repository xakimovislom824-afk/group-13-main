"use client";

import Link from "next/link";
import { getCategoryDisplayName, useGetCategoriesQuery } from "../../services/categoryApi";

export default function Katalog2() {
  const { data: categories = [], isLoading, isError, refetch } = useGetCategoriesQuery();
  return <section aria-labelledby="category-filter-heading" className="rounded-xl border border-border bg-card p-4">
    <h2 id="category-filter-heading" className="mb-4 text-lg font-bold">Kategoriyalar</h2>
    {isLoading ? <div className="flex flex-col gap-2">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-9 animate-pulse rounded bg-muted" />)}</div> : isError ? <div role="alert"><p className="text-sm text-muted-foreground">Kategoriyalar yuklanmadi.</p><button type="button" onClick={() => void refetch()} className="mt-2 text-sm font-semibold text-primary hover:underline">Qayta urinish</button></div> : <ul className="flex max-h-[65vh] flex-col gap-1 overflow-y-auto">{categories.map((category) => <li key={category.slug}><Link href={`/katalog/${category.slug}`} className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">{getCategoryDisplayName(category)}</Link></li>)}</ul>}
  </section>;
}
