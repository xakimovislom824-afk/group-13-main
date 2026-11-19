"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { getCategoryDisplayName, useGetCategoriesQuery } from "../services/categoryApi";
import { useGetProductsByCategoryQuery } from "../services/productApi";

export default function CategoryCatalog({ slug }: { slug: string }) {
  const [minimum, setMinimum] = useState("");
  const [maximum, setMaximum] = useState("");
  const [brand, setBrand] = useState("all");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const { data: apiCategories = [], isLoading: categoriesLoading, isError: categoriesError, refetch: refetchCategories } = useGetCategoriesQuery();
  const category = apiCategories.find((item) => item.slug === slug);
  const { data, isLoading, isError, refetch } = useGetProductsByCategoryQuery({ slug, limit: pageSize, skip: page * pageSize }, { skip: !category });
  const title = category ? getCategoryDisplayName(category) : "Katalog";
  const brands = useMemo(() => [...new Set((data?.products ?? []).map((item) => item.brand).filter((value): value is string => Boolean(value)))].sort(), [data?.products]);
  const visibleProducts = useMemo(() => {
    const items = (data?.products ?? []).filter((product) => {
      const price = Number(product.price) || 0;
      return (!minimum || price >= Number(minimum)) && (!maximum || price <= Number(maximum)) && (brand === "all" || product.brand === brand) && (!inStock || product.stock > 0);
    });
    return items.sort((a, b) => {
      if (sort === "cheapest") return Number(a.price) - Number(b.price);
      if (sort === "expensive") return Number(b.price) - Number(a.price);
      if (sort === "popular") return Number(b.rating ?? 0) - Number(a.rating ?? 0);
      return a.name.localeCompare(b.name);
    });
  }, [data?.products, minimum, maximum, brand, inStock, sort]);
  const filters = <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4"><h2 className="font-semibold">Filtrlar</h2><label className="flex flex-col gap-1.5 text-sm text-muted-foreground">Eng past narx<input type="number" min="0" value={minimum} onChange={(event) => { setMinimum(event.target.value); setPage(0); }} className="rounded-lg border border-input bg-background px-3 py-2 text-foreground" /></label><label className="flex flex-col gap-1.5 text-sm text-muted-foreground">Eng yuqori narx<input type="number" min="0" value={maximum} onChange={(event) => { setMaximum(event.target.value); setPage(0); }} className="rounded-lg border border-input bg-background px-3 py-2 text-foreground" /></label><label className="flex flex-col gap-1.5 text-sm text-muted-foreground">Brend<select value={brand} onChange={(event) => { setBrand(event.target.value); setPage(0); }} className="rounded-lg border border-input bg-background px-3 py-2 text-foreground"><option value="all">Barcha brendlar</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStock} onChange={(event) => { setInStock(event.target.checked); setPage(0); }} />Faqat mavjud</label><button type="button" onClick={() => { setMinimum(""); setMaximum(""); setBrand("all"); setInStock(false); setPage(0); }} className="text-left text-sm font-semibold text-primary hover:underline">Filtrlarni tozalash</button></div>;

  return <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6"><nav aria-label="Sahifa yo'li" className="mb-4 text-sm text-muted-foreground"><Link href="/" className="hover:text-primary">Bosh sahifa</Link><span aria-hidden="true"> / </span><Link href="/katalog" className="hover:text-primary">Katalog</Link><span aria-hidden="true"> / </span><span className="text-foreground">{title}</span></nav><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-secondary">Islomx7 katalogi</p><h1 className="text-3xl font-bold md:text-4xl">{title}</h1><p className="mt-2 text-muted-foreground">{data?.total ?? 0} ta mahsulot</p></div><label className="flex items-center gap-2 text-sm text-muted-foreground">Saralash<select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-foreground"><option value="popular">Reyting</option><option value="cheapest">Arzonroq</option><option value="expensive">Qimmatroq</option><option value="name">Nomi</option></select></label></div><div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]"><aside className="hidden lg:block">{filters}</aside><div className="min-w-0"><details className="mb-4 rounded-xl border border-border bg-card p-4 lg:hidden"><summary className="cursor-pointer font-semibold">Filtrlarni ochish</summary><div className="mt-4">{filters}</div></details>{categoriesLoading || isLoading ? <ProductSkeleton /> : categoriesError || isError ? <div role="alert" className="rounded-xl border border-border bg-card p-8 text-center"><p className="text-muted-foreground">Mahsulotlarni yuklashda xatolik yuz berdi.</p><button type="button" onClick={() => { if (categoriesError) void refetchCategories(); if (isError) void refetch(); }} className="mt-4 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white">Qayta urinib ko&apos;rish</button></div> : !category || visibleProducts.length === 0 ? <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center"><h2 className="text-xl font-semibold">{category ? "Mahsulot topilmadi" : "Kategoriya topilmadi"}</h2><p className="mt-2 text-muted-foreground">{category ? "Bu bo'limda hozircha mahsulot yo'q yoki filtr natijani chekladi." : "Ushbu bo'lim mavjud API kategoriyalarida topilmadi."}</p></div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}{!isLoading && !isError && data && data.total > pageSize && <nav aria-label="Sahifalash" className="mt-8 flex items-center justify-center gap-4"><button type="button" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))} className="rounded-lg border border-border bg-card px-4 py-2 disabled:opacity-50">Oldingi</button><span className="text-sm text-muted-foreground">{page + 1} / {Math.ceil(data.total / pageSize)}</span><button type="button" disabled={(page + 1) * pageSize >= data.total} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-border bg-card px-4 py-2 disabled:opacity-50">Keyingi</button></nav>}</div></div></main>;
}
