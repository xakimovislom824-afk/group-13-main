"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useGetProductsPageQuery, useSearchProductsQuery } from "../services/productApi";
import ProductCard from "./ProductCard";

interface ProductsProps {
  searchQuery?: string;
}

const pageSize = 20;

export default function Products({ searchQuery = "" }: ProductsProps) {
  const [pagination, setPagination] = useState({ query: "", page: 0 });
  const query = searchQuery.trim();
  const page = pagination.query === query ? pagination.page : 0;
  const setPage = (nextPage: number) => setPagination({ query, page: nextPage });
  const productPage = useGetProductsPageQuery({ limit: pageSize, skip: page * pageSize }, { skip: Boolean(query) });
  const searchPage = useSearchProductsQuery({ q: query, limit: pageSize, skip: page * pageSize }, { skip: !query });
  const result = query ? searchPage : productPage;
  const data = result.data;

  if (result.isLoading) {
    return <div aria-label="Mahsulotlar yuklanmoqda" className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-xl bg-muted" />)}</div>;
  }

  if (result.isError) {
    return <div role="alert" className="flex flex-col items-center justify-center gap-4 py-20 text-center"><p className="text-sm text-destructive">Mahsulotlarni yuklashda xatolik yuz berdi.</p><button type="button" onClick={() => void result.refetch()} disabled={result.isFetching} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60">{result.isFetching ? "Qayta yuklanmoqda..." : "Qayta urinish"}</button></div>;
  }

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.ceil(total / pageSize);

  if (products.length === 0) {
    return <div className="flex flex-col items-center justify-center py-20 text-center"><Search aria-hidden="true" className="mb-4 size-10 text-muted-foreground" /><p className="mb-1 text-lg font-bold">{query ? `«${query}» topilmadi` : "Mahsulotlar topilmadi"}</p><p className="text-sm text-muted-foreground">{query ? "Boshqa kalit so'z bilan qidirib ko'ring" : "Hozircha mahsulot mavjud emas."}</p></div>;
  }

  return <div className="w-full">
    {query && <p className="mb-4 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{total}</span> ta mahsulot topildi</p>}
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    {pageCount > 1 && <nav aria-label="Mahsulotlar sahifalash" className="mt-8 flex items-center justify-center gap-4"><button type="button" disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))} className="rounded-lg border border-border px-4 py-2 disabled:opacity-50">Oldingi</button><span aria-live="polite" className="text-sm text-muted-foreground">{page + 1} / {pageCount}</span><button type="button" disabled={page + 1 >= pageCount} onClick={() => setPage(page + 1)} className="rounded-lg border border-border px-4 py-2 disabled:opacity-50">Keyingi</button></nav>}
  </div>;
}
