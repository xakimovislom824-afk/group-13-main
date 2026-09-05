"use client";

import ProductCard from "../../components/ProductCard";
import { dummyCategories, useGetCategoriesQuery } from "../../services/categoryApi";
import { useGetProductsQuery } from "../../services/productApi";

const legacyCategoryMap: Record<string, string> = {
  "qurilish-materiallari": "home-decoration",
  "umumqurilish-materiallari": "home-decoration",
  "building-materials": "home-decoration",
  "construction": "home-decoration",
  "material": "groceries",
  "furniture": "furniture",
  "lighting": "lighting",
  "automotive": "automotive",
  "electronics": "smartphones",
};

export default function QurilishMateriallariPage() {
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const normalizedCategories = categories.map((cat) => ({
    ...cat,
    slug: String(cat.name).toLowerCase().replace(/\s+/g, "-"),
  }));

  const mappedCategories = normalizedCategories
    .map((cat) => {
      const legacyKey = legacyCategoryMap[cat.slug] || cat.slug;
      return {
        ...cat,
        resolvedSlug: legacyKey,
      };
    })
    .filter((cat, index, arr) => arr.findIndex((item) => item.resolvedSlug === cat.resolvedSlug) === index);

  const visibleCategoryIds = mappedCategories.map((category) => {
    const categoryIndex = dummyCategories.findIndex((name) => name === category.resolvedSlug);
    return categoryIndex + 1;
  });
  const visibleProducts = products.filter((product) => visibleCategoryIds.includes(Number(product.category)));

  if (productsLoading || categoriesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold mb-2">
          Katalog
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Home-decoration va zamonaviy mahsulotlar
        </h1>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {mappedCategories.map((cat) => (
          <span
            key={cat.id}
            className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200"
          >
            {cat.name}
          </span>
        ))}
      </div>

      {visibleProducts.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-16 text-center text-slate-500">
          Bu bo'limga mos mahsulotlar topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {visibleProducts.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}