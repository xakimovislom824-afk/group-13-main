"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Trash2,
  Heart,
  GitCompareArrows,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShoppingCart,
  Plus,
  Minus,
  Zap,
} from "lucide-react";

import {
  useGetComparisonsQuery,
  useUpdateComparisonMutation,
  useDeleteComparisonMutation,
  parseProductsDetail,
  IComparisonProduct,
  IComparison,
} from "../../services/comparisonsApi";

import {
  useGetCartsQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
} from "../../services/cartApi";

import {
  useToggleWishlistMutation,
  useGetWishlistQuery,
} from "../../services/wishlistApi";

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "wish" | "error";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 bg-white border rounded-xl px-4 py-3
            text-sm font-medium shadow-lg pointer-events-auto
            min-w-[220px] max-w-[300px]
            ${toast.type === "success" ? "border-l-4 border-l-green-500 border-gray-100" : ""}
            ${toast.type === "wish"    ? "border-l-4 border-l-pink-400 border-gray-100"  : ""}
            ${toast.type === "error"   ? "border-l-4 border-l-red-400 border-gray-100"   : ""}
          `}
        >
          {toast.type === "success" && <CheckCircle size={18} className="text-green-500 flex-shrink-0" />}
          {toast.type === "wish"    && <Heart        size={18} className="text-pink-400 flex-shrink-0"  />}
          {toast.type === "error"   && <AlertCircle  size={18} className="text-red-400 flex-shrink-0"   />}
          <span className="text-gray-700">{toast.message}</span>
          <button onClick={() => onRemove(toast.id)} className="ml-auto text-gray-300 hover:text-gray-500 transition-colors">×</button>
        </div>
      ))}
    </div>
  );
}

// ─── Feature keys ─────────────────────────────────────────────────────────────
const FEATURE_KEYS: { label: string; key: keyof IComparisonProduct }[] = [
  { label: "Narxi (UZS)", key: "price" },
  { label: "Eski narxi", key: "old_price" },
  { label: "Kategoriya", key: "category" },
  { label: "Tavsif", key: "description" },
];

const formatPrice = (val?: number | string) => {
  if (!val) return "—";
  return Number(val).toLocaleString("uz-UZ") + " so'm";
};

// ─── Cart Stepper ─────────────────────────────────────────────────────────────
function CartStepper({
  productId,
  qty,
  loading,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  productId: number;
  qty: number;
  loading: boolean;
  onAdd: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
}) {
  if (qty === 0) {
    return (
      <button
        onClick={() => onAdd(productId)}
        disabled={loading}
        className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold transition-all disabled:opacity-50 shadow-sm shadow-blue-200"
      >
        {loading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <>
            <ShoppingCart size={13} strokeWidth={2} />
            Sotib olish
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex-1 h-9 flex items-center justify-between rounded-lg bg-blue-50 border border-blue-200 px-1">
      <button
        onClick={() => onDecrease(productId)}
        disabled={loading}
        className="w-7 h-7 flex items-center justify-center rounded-md text-blue-600 hover:bg-blue-100 active:scale-90 transition disabled:opacity-30 font-bold"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Minus size={13} strokeWidth={2.5} />}
      </button>
      <span className="text-sm font-bold text-blue-700 min-w-[20px] text-center">{qty}</span>
      <button
        onClick={() => onIncrease(productId)}
        disabled={loading}
        className="w-7 h-7 flex items-center justify-center rounded-md text-blue-600 hover:bg-blue-100 active:scale-90 transition font-bold"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={13} strokeWidth={2.5} />}
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Taqqoslash() {
  const [filter, setFilter] = useState<"all" | "diff">("all");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [localProducts, setLocalProducts] = useState<IComparisonProduct[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Per-product loading sets
  const [loadingCart, setLoadingCart] = useState<Set<number>>(new Set());
  const [loadingWish, setLoadingWish] = useState<Set<number>>(new Set());

  // Local cart quantities for instant UI feedback
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});

  // ── API ──────────────────────────────────────────────────────────────────────
  const { data: comparisonGroups, isLoading, isError, refetch } = useGetComparisonsQuery();
  const [updateComparison] = useUpdateComparisonMutation();
  const [deleteComparison] = useDeleteComparisonMutation();

  const { data: cartData } = useGetCartsQuery();
  const [addToCart] = useAddToCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [deleteCart] = useDeleteCartMutation();

  const [toggleWishlist] = useToggleWishlistMutation();
  const { data: wishlistData } = useGetWishlistQuery();

  // ── Toast ────────────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const isInWishlist = (productId: number): boolean => {
    if (!wishlistData) return false;
    return wishlistData.some((item: any) => {
      const pId = typeof item.product === "object" ? item.product?.id : item.product;
      return Number(pId) === Number(productId);
    });
  };

  const getCartItem = (productId: number) => {
    if (!cartData) return null;
    let items: any[] = [];
    if (Array.isArray(cartData)) {
      items = cartData.flatMap((c: any) => c?.items ?? (c?.product ? [c] : []));
    } else if (typeof cartData === "object") {
      items = (cartData as any).items || [];
    }
    return items.find((item: any) => {
      const pId = typeof item.product === "object" ? item.product?.id : item.product;
      const pDetailId = item.product_detail?.id || item.product_data?.id;
      return Number(pId) === Number(productId) || Number(pDetailId) === Number(productId);
    });
  };

  // ── Sync cart quantities from server ─────────────────────────────────────────
  useEffect(() => {
    if (!cartData) return;
    let items: any[] = [];
    if (Array.isArray(cartData)) {
      items = cartData.flatMap((c: any) => c?.items ?? (c?.product ? [c] : []));
    } else if (typeof cartData === "object") {
      items = (cartData as any).items || [];
    }
    const quantities: Record<number, number> = {};
    items.forEach((item: any) => {
      const pId = typeof item.product === "object" ? item.product?.id : item.product;
      const pDetailId = item.product_detail?.id || item.product_data?.id;
      const finalId = pId || pDetailId;
      if (finalId) quantities[Number(finalId)] = item.quantity;
    });
    setCartQuantities(quantities);
  }, [cartData]);

  // ── Init selected group ───────────────────────────────────────────────────────
  useEffect(() => {
    if (comparisonGroups && comparisonGroups.length > 0 && selectedGroupId === null) {
      setSelectedGroupId(comparisonGroups[0].id);
    }
  }, [comparisonGroups, selectedGroupId]);

  useEffect(() => {
    if (!comparisonGroups || selectedGroupId === null) return;
    const group = comparisonGroups.find((g: IComparison) => g.id === selectedGroupId);
    if (!group) return;
    setLocalProducts(parseProductsDetail(group.products_detail));
  }, [comparisonGroups, selectedGroupId]);

  // ── Add to cart ───────────────────────────────────────────────────────────────
  const handleAddToCart = async (productId: number) => {
    if (loadingCart.has(productId)) return;
    setLoadingCart((prev) => new Set(prev).add(productId));
    setCartQuantities((prev) => ({ ...prev, [productId]: 1 }));
    try {
      await addToCart({ product: productId, quantity: 1 }).unwrap();
      showToast("Savatga qo'shildi!", "success");
    } catch (err: any) {
      setCartQuantities((prev) => { const next = { ...prev }; delete next[productId]; return next; });
      showToast(err?.data?.detail || "Xatolik yuz berdi", "error");
    } finally {
      setLoadingCart((prev) => { const next = new Set(prev); next.delete(productId); return next; });
    }
  };

  // ── Increase ──────────────────────────────────────────────────────────────────
  const handleIncrease = async (productId: number) => {
    const cartItem = getCartItem(productId);
    if (!cartItem) { await handleAddToCart(productId); return; }
    const currentQty = cartQuantities[productId] || cartItem.quantity || 1;
    const newQty = currentQty + 1;
    setCartQuantities((prev) => ({ ...prev, [productId]: newQty }));
    try {
      await updateCart({ id: cartItem.id, product: productId, quantity: newQty }).unwrap();
    } catch {
      setCartQuantities((prev) => ({ ...prev, [productId]: currentQty }));
      showToast("Miqdorni oshirishda xatolik", "error");
    }
  };

  // ── Decrease ──────────────────────────────────────────────────────────────────
  const handleDecrease = async (productId: number) => {
    const cartItem = getCartItem(productId);
    if (!cartItem) return;
    const currentQty = cartQuantities[productId] || cartItem.quantity;
    const newQty = currentQty - 1;

    if (newQty <= 0) {
      setCartQuantities((prev) => { const next = { ...prev }; delete next[productId]; return next; });
      try {
        await deleteCart(cartItem.id).unwrap();
        showToast("Savatdan o'chirildi", "success");
      } catch {
        setCartQuantities((prev) => ({ ...prev, [productId]: currentQty }));
        showToast("O'chirishda xatolik yuz berdi", "error");
      }
      return;
    }

    setCartQuantities((prev) => ({ ...prev, [productId]: newQty }));
    try {
      await updateCart({ id: cartItem.id, product: productId, quantity: newQty }).unwrap();
    } catch {
      setCartQuantities((prev) => ({ ...prev, [productId]: currentQty }));
      showToast("Miqdorni kamaytirishda xatolik", "error");
    }
  };

  // ── Wishlist ──────────────────────────────────────────────────────────────────
  const handleToggleWishlist = async (productId: number) => {
    if (loadingWish.has(productId)) return;
    setLoadingWish((prev) => new Set(prev).add(productId));
    try {
      await toggleWishlist({ product_id: productId }).unwrap();
      const inList = isInWishlist(productId);
      showToast(inList ? "Sevimlilardan olib tashlandi" : "Sevimlilarga qo'shildi!", "wish");
    } catch (err: any) {
      showToast(err?.data?.detail || "Xatolik yuz berdi", "error");
    } finally {
      setLoadingWish((prev) => { const next = new Set(prev); next.delete(productId); return next; });
    }
  };

  // ── Remove from comparison ────────────────────────────────────────────────────
  const handleRemoveProduct = async (productId: number) => {
    if (!selectedGroupId || !comparisonGroups) return;
    const group = comparisonGroups.find((g: IComparison) => g.id === selectedGroupId);
    if (!group) return;
    const updatedProducts = group.products.map(Number).filter((id) => id !== Number(productId));
    setLocalProducts((prev) => prev.filter((p) => p.id !== productId));
    if (updatedProducts.length < 2) {
      await deleteComparison(selectedGroupId);
      setSelectedGroupId(null);
      showToast("Taqqoslash guruhi o'chirildi", "success");
    } else {
      await updateComparison({ id: selectedGroupId, products: updatedProducts });
      showToast("Taqqoslashdan olib tashlandi", "success");
    }
  };

  const isFeatureDifferent = (key: keyof IComparisonProduct): boolean => {
    if (localProducts.length < 2) return false;
    return new Set(localProducts.map((p) => String(p[key] ?? ""))).size > 1;
  };

  const visibleFeatures = filter === "diff"
    ? FEATURE_KEYS.filter((f) => isFeatureDifferent(f.key))
    : FEATURE_KEYS;

  // ── States ────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Yuklanmoqda...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-red-400 text-lg font-semibold">Server bilan bog&apos;lanishda xatolik</p>
        <button onClick={() => refetch()} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition text-sm">
          Qayta urinish
        </button>
      </div>
    );
  }

  const isEmpty = !comparisonGroups || comparisonGroups.length === 0 || localProducts.length === 0;

  return (
    <div className="min-h-screen bg-white font-sans text-[#2D2D2D] pb-20">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-4 py-4 flex items-center gap-2 text-[11px] text-gray-400">
        <Link href="/" className="hover:text-blue-500 transition-colors">Stroyoptorg</Link>
        <span>/</span>
        <span className="text-gray-600">Taqqoslash</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <GitCompareArrows size={28} className="text-blue-600 flex-shrink-0" />
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A202C]">Taqqoslash</h1>
          {localProducts.length > 0 && (
            <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {localProducts.length} ta mahsulot
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <GitCompareArrows size={36} className="text-blue-300" />
            </div>
            <p className="text-gray-400 text-lg">Taqqoslash ro&apos;yxati bo&apos;sh</p>
            <Link href="/katalog" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm">
              Katalogga o&apos;tish
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left filter panel */}
            <div className="w-full lg:w-56 flex-shrink-0 space-y-4">
              <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ko&apos;rsatish</p>
                <div className="space-y-3">
                  {(["all", "diff"] as const).map((val) => (
                    <label key={val} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <input
                          type="radio"
                          name="filter"
                          checked={filter === val}
                          onChange={() => setFilter(val)}
                          className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:border-blue-600 transition-all"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <span className="text-[13px] text-gray-600 font-medium">
                        {val === "all" ? "Barcha xarakteristikalar" : "Faqat farqlar"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div className="flex-1 overflow-x-auto select-none">
              <div className="min-w-0" style={{ minWidth: `${Math.max(localProducts.length * 240, 400)}px` }}>
                <div
                  className="grid gap-4 mb-6"
                  style={{ gridTemplateColumns: `repeat(${localProducts.length}, minmax(220px, 1fr))` }}
                >
                  {localProducts.map((product: IComparisonProduct) => {
                    const inWish = isInWishlist(product.id);
                    const cartLoading = loadingCart.has(product.id);
                    const wishLoading = loadingWish.has(product.id);
                    const qty = cartQuantities[product.id] ?? 0;

                    return (
                      <div key={product.id} className="relative border border-gray-100 rounded-2xl py-4 px-3.5 bg-white hover:shadow-md transition-all flex flex-col justify-between">
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="absolute right-2 top-2 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all z-10"
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* Image */}
                        <div className="h-40 flex items-center justify-center mb-3 bg-gray-50 rounded-xl overflow-hidden relative p-2">
                          {product?.image ? (
                            <img
                              src={product.image}
                              alt={product.name as string}
                              className="max-h-full max-w-full object-contain p-1 transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-400 text-xl">📦</span>
                            </div>
                          )}
                          {product.old_price && Number(product.old_price) > Number(product.price) && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
                              -{Math.round(((Number(product.old_price) - Number(product.price)) / Number(product.old_price)) * 100)}%
                            </span>
                          )}
                        </div>

                        {/* Name */}
                        <p className="text-[9px] text-slate-400 mb-0.5">ID: {product.id}</p>
                        <h3 className="text-sm font-bold leading-tight mb-2 line-clamp-2 min-h-[2.5rem] text-gray-800" title={product.name as string}>
                          {product?.name || "Nomsiz mahsulot"}
                        </h3>

                        {/* Price */}
                        <div className="flex flex-col gap-0.5 mb-4 mt-auto">
                          {product.old_price && (
                            <span className="line-through text-slate-400 text-[11px]">
                              {Number(product.old_price).toLocaleString()} so&apos;m
                            </span>
                          )}
                          <span className="text-blue-600 font-extrabold text-base">
                            {Number(product.price).toLocaleString()} so&apos;m
                          </span>
                          {qty > 0 && (
                            <span className="text-[10px] text-blue-400 font-medium">
                              Jami: {(Number(product.price) * qty).toLocaleString()} so&apos;m
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-1.5 items-center">
                          {/* Cart stepper or buy button */}
                          <CartStepper
                            productId={product.id}
                            qty={qty}
                            loading={cartLoading}
                            onAdd={handleAddToCart}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                          />

                          {/* Wishlist */}
                          <button
                            onClick={() => handleToggleWishlist(product.id)}
                            disabled={wishLoading}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all shrink-0 cursor-pointer ${
                              inWish
                                ? "bg-pink-50 border-pink-400 text-pink-500"
                                : "border-gray-200 text-gray-400 hover:bg-gray-50"
                            }`}
                          >
                            {wishLoading ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Heart size={15} fill={inWish ? "currentColor" : "none"} />
                            )}
                          </button>

                          {/* Remove from comparison */}
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 transition-all shrink-0 cursor-pointer"
                            title="Taqqoslashdan o'chirish"
                          >
                            <GitCompareArrows size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Features table */}
                {visibleFeatures.length > 0 && (
                  <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Xarakteristikalar</p>
                    </div>
                    {visibleFeatures.map((feature, fIdx) => {
                      const isDiff = isFeatureDifferent(feature.key);
                      return (
                        <div
                          key={fIdx}
                          className={`grid gap-0 border-b border-gray-100 last:border-0 items-start ${isDiff ? "bg-amber-50/40" : "bg-white"}`}
                          style={{ gridTemplateColumns: `repeat(${localProducts.length}, minmax(220px, 1fr))` }}
                        >
                          {localProducts.map((product: IComparisonProduct, cIdx: number) => (
                            <div key={cIdx} className="px-4 py-3 border-r border-gray-100 last:border-r-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{feature.label}</span>
                              </div>
                              <span className="text-[13px] text-gray-800 font-medium">
                                {feature.key === "price" || feature.key === "old_price"
                                  ? formatPrice(product[feature.key] as number)
                                  : product[feature.key]?.toString() || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}