"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { categories as storeCategories, formatPrice } from "../lib/site-config";
import { useGetCategoriesQuery } from "../services/categoryApi";
import { useGetProductsQuery } from "../services/productApi";

const categoryTerms: Record<string, string[]> = {
  "qurilish-materiallari": ["home-decoration", "groceries", "construction", "building"],
  "asbob-uskunalar": ["tools", "tool", "automotive", "motorcycle"],
  elektr: ["smartphones", "laptops", "lighting", "electronics", "tablets"],
  santexnika: ["plumbing", "bathroom", "santexnika"],
  "uy-va-bog": ["home-decoration", "furniture", "garden", "outdoor"],
  mebel: ["furniture"],
  yoritish: ["lighting"],
};

const formatSlug = (value: string) => value.toLowerCase().trim().replace(/\s+/g, "-");

export default function CategoryCatalog({ slug }: { slug: string }) {
  const { data: products = [], isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useGetProductsQuery();
  const { data: apiCategories = [], isLoading: categoriesLoading, isError: categoriesError, refetch: refetchCategories } = useGetCategoriesQuery();
  const [minimum, setMinimum] = useState("");
  const [maximum, setMaximum] = useState("");
  const [brand, setBrand] = useState("all");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const title = storeCategories.find((item) => item.href.endsWith(`/${slug}`))?.label ?? "Katalog";
  const terms = useMemo(() => categoryTerms[slug] ?? [slug], [slug]);
  const categoryIds = useMemo(() => apiCategories
    .filter((item) => terms.some((term) => formatSlug(item.name).includes(term)))
    .map((item) => item.id), [apiCategories, terms]);
  const brands = useMemo(() => Array.from(new Set(products.map((item) => item.brand).filter((value): value is string => Boolean(value)))).sort(), [products]);
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const price = Number(product.price) || 0;
      return categoryIds.includes(Number(product.category))
        && (!minimum || price >= Number(minimum))
        && (!maximum || price <= Number(maximum))
        && (brand === "all" || product.brand === brand)
        && (!inStock || product.stock > 0);
    });
    return filtered.sort((a, b) => {
      if (sort === "cheapest") return Number(a.price) - Number(b.price);
      if (sort === "expensive") return Number(b.price) - Number(a.price);
      if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return Number(b.is_hit) - Number(a.is_hit);
    });
  }, [products, categoryIds, minimum, maximum, brand, inStock, sort]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const loading = productsLoading || categoriesLoading;
  const failed = productsError || categoriesError;

  const filters = (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h2 className="font-semibold text-[var(--primary)]">Filtrlar</h2>
      <label className="flex flex-col gap-1.5 text-sm text-[var(--text-muted)]">Eng past narx
        <input type="number" min="0" value={minimum} onChange={(event) => { setMinimum(event.target.value); setPage(1); }} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)]" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-[var(--text-muted)]">Eng yuqori narx
        <input type="number" min="0" value={maximum} onChange={(event) => { setMaximum(event.target.value); setPage(1); }} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)]" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-[var(--text-muted)]">Brend
        <select value={brand} onChange={(event) => { setBrand(event.target.value); setPage(1); }} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)]">
          <option value="all">Barcha brendlar</option>
          {brands.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-[var(--text)]"><input type="checkbox" checked={inStock} onChange={(event) => { setInStock(event.target.checked); setPage(1); }} />Faqat mavjud</label>
      <button type="button" onClick={() => { setMinimum(""); setMaximum(""); setBrand("all"); setInStock(false); setPage(1); }} className="text-left text-sm font-semibold text-[var(--secondary)] hover:underline">Filtrlarni tozalash</button>
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
      <nav aria-label="Sahifa yo'li" className="mb-4 text-sm text-[var(--text-muted)]"><Link href="/" className="hover:text-[var(--secondary)]">Bosh sahifa</Link><span aria-hidden="true"> / </span><Link href="/katalog" className="hover:text-[var(--secondary)]">Katalog</Link><span aria-hidden="true"> / </span><span className="text-[var(--text)]">{title}</span></nav>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-[var(--secondary)]">Islomx7 katalogi</p><h1 className="text-3xl font-bold text-[var(--primary)] md:text-4xl">{title}</h1><p className="mt-2 text-[var(--text-muted)]">Tanlangan bo'limdagi mahsulotlarni ko'ring va saralang.</p></div>
        <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">Saralash
          <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)]">
            <option value="cheapest">Arzonroq</option><option value="expensive">Qimmatroq</option><option value="popular">Mashhur</option><option value="newest">Yangi</option>
          </select>
        </label>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">{filters}</aside>
        <div className="min-w-0">
          <details className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 lg:hidden"><summary className="cursor-pointer font-semibold text-[var(--primary)]">Filtrlarni ochish</summary><div className="mt-4">{filters}</div></details>
          {(minimum || maximum || brand !== "all" || inStock) && <div className="mb-4 flex flex-wrap items-center gap-2 text-sm"><span className="text-[var(--text-muted)]">Faol filtrlar:</span>{minimum && <span className="rounded-full bg-[var(--secondary-soft)] px-3 py-1">{formatPrice(minimum)}</span>}{maximum && <span className="rounded-full bg-[var(--secondary-soft)] px-3 py-1">{formatPrice(maximum)}</span>}{brand !== "all" && <span className="rounded-full bg-[var(--secondary-soft)] px-3 py-1">{brand}</span>}{inStock && <span className="rounded-full bg-[var(--secondary-soft)] px-3 py-1">Mavjud</span>}</div>}
          {loading ? <ProductSkeleton /> : failed ? <div role="alert" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center"><p className="text-[var(--text-muted)]">Mahsulotlarni yuklashda xatolik yuz berdi.</p><button onClick={() => { void refetchProducts(); void refetchCategories(); }} className="mt-4 rounded-[10px] bg-[var(--accent)] px-5 py-2.5 font-semibold text-[var(--primary)] hover:bg-[var(--accent-hover)]">Qayta urinib ko&apos;rish</button></div> : visibleProducts.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center"><h2 className="text-xl font-semibold text-[var(--primary)]">Mahsulot topilmadi</h2><p className="mt-2 text-[var(--text-muted)]">Bu bo'limda hozircha mahsulot yo'q yoki filtr natijani chekladi.</p></div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
          {!loading && !failed && totalPages > 1 && <nav aria-label="Sahifalash" className="mt-8 flex items-center justify-center gap-4"><button disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 disabled:opacity-50">Oldingi</button><span className="text-sm text-[var(--text-muted)]">{page} / {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 disabled:opacity-50">Keyingi</button></nav>}
        </div>
      </div>
    </main>
  );
}
