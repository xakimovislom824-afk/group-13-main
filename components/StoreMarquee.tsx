"use client";

import Link from "next/link";
import { Package, Smartphone, Laptop, Sparkles, Shirt, Sofa, ShoppingBasket, Watch, Glasses, Car, Lamp, Tablet, type LucideIcon } from "lucide-react";
import { getCategoryDisplayName, useGetCategoriesQuery } from "../services/categoryApi";

const categoryIcons: Record<string, LucideIcon> = {
  beauty: Sparkles,
  fragrances: Sparkles,
  furniture: Sofa,
  groceries: ShoppingBasket,
  laptops: Laptop,
  smartphones: Smartphone,
  "mens-shirts": Shirt,
  "womens-dresses": Shirt,
  "mens-watches": Watch,
  "womens-watches": Watch,
  sunglasses: Glasses,
  vehicle: Car,
  motorcycle: Car,
  lighting: Lamp,
  tablets: Tablet,
};

type CategoryTrackProps = {
  copy?: boolean;
};

function CategoryTrack({ copy = false }: CategoryTrackProps) {
  const { data: categories = [] } = useGetCategoriesQuery();

  return (
    <div className="flex shrink-0 items-center gap-3 px-1.5" aria-hidden={copy || undefined}>
      {categories.map((category) => {
        const Icon = categoryIcons[category.slug] ?? Package;
        return (
          <Link
            key={category.slug}
            href={`/katalog/${category.slug}`}
            tabIndex={copy ? -1 : undefined}
            className="group flex w-44 shrink-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--secondary)] hover:shadow-[var(--card-shadow)] sm:w-48"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--secondary-soft)] text-[var(--secondary)] transition-colors group-hover:bg-[var(--secondary)] group-hover:text-white">
              <Icon aria-hidden="true" size={20} />
            </span>
            <span className="text-sm font-bold text-[var(--text)]">
              {getCategoryDisplayName(category)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function StoreMarquee() {
  const { isLoading, isError, refetch } = useGetCategoriesQuery();

  return (
    <section aria-labelledby="category-marquee-heading" className="my-6 sm:my-8">
      <h2 id="category-marquee-heading" className="mb-4 text-2xl font-bold text-[var(--text)] sm:text-3xl">
        Bo&apos;limlar
      </h2>
      {isLoading ? (
        <div aria-busy="true" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-[var(--surface-muted)]" />
          ))}
        </div>
      ) : isError ? (
        <div role="alert" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
          <p className="text-[var(--text-muted)]">Bo&apos;limlarni yuklab bo&apos;lmadi.</p>
          <button type="button" onClick={() => void refetch()} className="mt-3 font-semibold text-[var(--secondary)] hover:underline">
            Qayta urinish
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] py-3">
          <div className="store-marquee-track flex w-max motion-reduce:transform-none">
            <CategoryTrack />
            <CategoryTrack copy />
          </div>
        </div>
      )}
    </section>
  );
}
