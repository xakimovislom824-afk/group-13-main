"use client"
import { useState } from "react";
import { useGetProductsQuery } from "../services/productApi";
import { useGetCategoriesQuery } from "../services/categoryApi";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

function EngYaxshiTakliflar() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const { data: productList = [], isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useGetProductsQuery();
    const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError, refetch: refetchCategories } = useGetCategoriesQuery();

    const isLoading = productsLoading || categoriesLoading;
    const isError = productsError || categoriesError;

    if (isLoading) {
        return <div className="bg-[var(--surface)] p-4 rounded-xl"><ProductSkeleton /></div>;
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                <p className="text-[var(--text-muted)]">Mahsulotlarni yuklashda xatolik yuz berdi.</p>
                <button onClick={() => { void refetchProducts(); void refetchCategories(); }} className="mt-4 rounded-[10px] bg-[var(--primary)] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--secondary)]">Qayta urinib ko&apos;rish</button>
            </div>
        );
    }

    const filteredProducts = selectedCategory
        ? productList.filter((p) => p.category === selectedCategory)
        : productList;

    return (
        <div className="bg-white p-4 rounded-xl font-sans">
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Eng Yaxshi Takliflar</h2>

            {/* ── Tab tugmalar — yonga scroll ── */}
            <div
                style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
                className="pb-2 mb-6"
            >
                <div className="flex gap-3 w-max">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-6 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === null
                            ? "bg-blue-600 text-white"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            }`}
                    >
                        Barcha mahsulotlar
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Mahsulotlar — yonga scroll ── */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    Mahsulotlar topilmadi
                </div>
            ) : (
                <div
                    style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <div className="flex gap-5 w-max pb-2 items-stretch">
                        {filteredProducts.slice(0, 5).map((product) => (
                            <div key={product.id} className="w-[220px] flex-shrink-0 flex">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EngYaxshiTakliflar;
