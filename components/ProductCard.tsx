"use client";
import { Card } from "../components/ui/card";
import { BarChart2, ShoppingCart, Minus, Plus } from "lucide-react";
import {
    useGetWishlistQuery,
    useToggleWishlistMutation,
} from "../services/wishlistApi";
import {
    useGetComparisonsQuery,
    useCreateComparisonMutation,
    useUpdateComparisonMutation,
    useDeleteComparisonMutation,
    parseProductsDetail,
} from "../services/comparisonsApi";
import {
    useGetCartsQuery,
    useAddToCartMutation,
    useUpdateCartMutation,
    useDeleteCartMutation,
} from "../services/cartApi";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "../Types/index.types";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function ProductCard({ product }: { product: IProduct }) {
    const [token, setToken] = useState<string | null>(null);
    const [localLiked, setLocalLiked] = useState<boolean | null>(null);
    const [localInComparison, setLocalInComparison] = useState<boolean | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem("access"));
    }, []);

    const { data: wishlist = [] } = useGetWishlistQuery(undefined, { skip: !token });
    const [toggleWishlist] = useToggleWishlistMutation();

    const { data: comparisons = [] } = useGetComparisonsQuery(undefined, { skip: !token });
    const [createComparison] = useCreateComparisonMutation();
    const [updateComparison] = useUpdateComparisonMutation();
    const [deleteComparison] = useDeleteComparisonMutation();

    // ✅ Cart
    const { data: carts = [] } = useGetCartsQuery(undefined, { skip: !token });
    const [addToCart, { isLoading: addLoading }] = useAddToCartMutation();
    const [updateCart, { isLoading: updateLoading }] = useUpdateCartMutation();
    const [deleteCart] = useDeleteCartMutation();

    if (!product) {
        return (
            <Card className="w-full relative flex flex-col items-center justify-center h-72 border border-dashed border-gray-200 rounded-xl shadow-none ring-0">
                <span className="text-xs text-gray-400">Yuklanmoqda...</span>
            </Card>
        );
    }

    // ✅ Savatdagi shu mahsulotning item'ini topamiz
    const cartList = Array.isArray(carts) ? carts : [carts];
    const allItems = cartList.flatMap((c: any) => c?.items ?? []);
    const cartItem = allItems.find(
        (it: any) =>
            it.product === product.id ||
            it.product_data?.id === product.id ||
            it.product_detail?.id === product.id
    );
    const inCart = !!cartItem;
    const cartBusy = addLoading || updateLoading;

    const wishlistItem = wishlist.find(
        (item) => item.product === product.id || item.product_detail?.id === product.id
    );
    const liked = localLiked !== null ? localLiked : !!wishlistItem;

    // 📊 Taqqoslash (Comparison) - TOʻGʻRILANGAN VA XAVFSIZ VERSIYASI
    const comparisonItem = comparisons.find((c) => {
        // 1. Agar products to'g'ridan-to'g'ri ID'lar massivi bo'lsa (ma'lumot turini Number qilib tekshiramiz)
        if (Array.isArray(c.products)) {
            const hasId = c.products.map(Number).includes(Number(product.id));
            if (hasId) return true;
        }
        // 2. Agar products_detail ichidan qidirish kerak bo'lsa
        if (c.products_detail) {
            const details = parseProductsDetail(c.products_detail);
            return details.some((d) => Number(d.id) === Number(product.id));
        }
        return false;
    });
    const inComparison = localInComparison !== null ? localInComparison : !!comparisonItem;

    const requireAuth = () => {
        if (!token) {
            window.location.href = "/kirish";
            return false;
        }
        return true;
    };

    // ❤️ Sevimlilarga qo'shish/o'chirish
    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!requireAuth()) return;
        setLocalLiked(!liked);
        try {
            await toggleWishlist({ product_id: product.id }).unwrap();
        } catch {
            setLocalLiked(liked);
        } finally {
            setTimeout(() => setLocalLiked(null), 500);
        }
    };

    // 📊 Taqqoslashga qo'shish/o'chirish
    const handleToggleComparison = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!requireAuth()) return;
        setLocalInComparison(!inComparison);
        try {
            if (inComparison && comparisonItem) {
                const currentProducts = Array.isArray(comparisonItem.products)
                    ? comparisonItem.products.map(Number)
                    : parseProductsDetail(comparisonItem.products_detail).map((d) => d.id);
                const updatedProducts = currentProducts.filter((id) => id !== product.id);
                if (updatedProducts.length < 2) {
                    await deleteComparison(comparisonItem.id).unwrap();
                    toast.success("Taqqoslash ro'yxati o'chirildi", { autoClose: 1200 });
                } else {
                    await updateComparison({ id: comparisonItem.id, products: updatedProducts });
                }
            } else {
                if (comparisons.length > 0) {
                    const existing = comparisons[0];
                    const currentProducts = Array.isArray(existing.products)
                        ? existing.products.map(Number)
                        : parseProductsDetail(existing.products_detail).map((d) => d.id);
                    await updateComparison({ id: existing.id, products: [...currentProducts, product.id] });
                } else {
                    const pending = JSON.parse(localStorage.getItem("pendingComparison") || "[]");
                    if (!pending.includes(product.id)) {
                        const updated = [...pending, product.id];
                        localStorage.setItem("pendingComparison", JSON.stringify(updated));

                        if (updated.length >= 2) {
                            await createComparison({ name: "Taqqoslash", products: updated });
                            localStorage.removeItem("pendingComparison");
                            toast.success("Taqqoslash guruhi yaratildi!", { autoClose: 1200 });
                        } else {
                            toast.info("Taqqoslash uchun yana 1 ta mahsulot tanlang", { autoClose: 2000 });
                        }
                    }
                }
            }
        } catch {
            setLocalInComparison(inComparison);
        } finally {
            setTimeout(() => setLocalInComparison(null), 500);
        }
    };

    // ✅ Birinchi marta savatga qo'shish
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!requireAuth()) return;
        if (cartBusy) return;
        try {
            await addToCart({ product: product.id, quantity: 1 }).unwrap();
            toast.success("Savatchaga qo'shildi!", { autoClose: 1200 });
        } catch (err: any) {
            toast.error(err?.data?.detail || "Xatolik yuz berdi", { autoClose: 2000 });
        }
    };

    // ✅ Soni oshirish
    // ✅ Soni oshirish
    const handleIncrement = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartBusy || !cartItem) return;
        try {
            await updateCart({
                id: cartItem.id,
                product: product.id,
                quantity: cartItem.quantity + 1,
            }).unwrap();
        } catch (err: any) {
            toast.error(err?.data?.detail || "Xatolik", { autoClose: 1500 });
        }
    };

    // ✅ Soni kamaytirish (1 dan kamaysa o'chadi)
    const handleDecrement = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartBusy || !cartItem) return;
        try {
            if (cartItem.quantity <= 1) {
                await deleteCart(cartItem.id).unwrap();
            } else {
                await updateCart({
                    id: cartItem.id,
                    product: product.id,
                    quantity: cartItem.quantity - 1,
                }).unwrap();
            }
        } catch (err: any) {
            toast.error(err?.data?.detail || "Xatolik", { autoClose: 1500 });
        }
    };


    return (
        <Card className="w-full relative transition-all flex-shrink-0 flex flex-col justify-between rounded-xl shadow-none! ring-0 overflow-hidden group">
            <Link href={`/detail/${product.id}`} className="flex flex-col h-full">
                <div className="relative h-44 w-full bg-gray-50 rounded-xl mb-3 overflow-hidden p-3">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name || "Mahsulot rasmi"}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            Rasm yo&apos;q
                        </div>
                    )}
                    {product.old_price && Number(product.old_price) > Number(product.price) && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -
                            {Math.round(
                                ((Number(product.old_price) - Number(product.price)) / Number(product.old_price)) * 100
                            )}
                            %
                        </span>
                    )}
                </div>

                <div className="flex flex-col flex-1 px-1">
                    <p className="text-[10px] text-slate-400 mb-1">ID: {product.id}</p>
                    <h3
                        className="text-sm font-bold text-slate-800 mb-1 line-clamp-2 leading-tight"
                        title={product.name}
                    >
                        {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                        {product.description || "Tavsif mavjud emas"}
                    </p>

                    <div className="flex items-baseline gap-2 mt-auto mb-4">
                        {product.old_price && (
                            <span className="line-through text-slate-400 text-xs">
                                {Number(product.old_price).toLocaleString()}  <b>so&apos;m</b> 
                            </span>
                        )}
                        <span className="font-extrabold text-blue-600 text-lg">
                            {Number(product.price).toLocaleString()} <b>so&apos;m</b> 
                        </span>
                    </div>

                    <div
                        className="flex gap-1.5"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        {inCart ? (
                            <div className="flex-1 h-9 flex items-center justify-between rounded-md bg-blue-50 border border-blue-200 px-1">
                                <button
                                    onClick={handleDecrement}
                                    disabled={cartBusy}
                                    className="w-8 h-7 flex items-center justify-center rounded-md text-blue-600 hover:bg-blue-100 active:scale-90 transition disabled:opacity-50"
                                    aria-label="Kamaytirish"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-sm font-bold text-blue-700 min-w-[24px] text-center">
                                    {cartBusy ? (
                                        <span className="inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        cartItem.quantity
                                    )}
                                </span>
                                <button
                                    onClick={handleIncrement}
                                    disabled={cartBusy}
                                    className="w-8 h-7 flex items-center justify-center rounded-md text-blue-600 hover:bg-blue-100 active:scale-90 transition disabled:opacity-50"
                                    aria-label="Oshirish"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={cartBusy}
                                className="cursor-pointer flex-1 h-9 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-70"
                            >
                                {addLoading ? (
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        Sotib olish
                                    </>
                                )}
                            </button>
                        )}

                        <button
                            onClick={handleToggleFavorite}
                            style={{
                                border: liked ? "1.5px solid #ff4d6d" : "1px solid #e5e7eb",
                                background: liked ? "#fff0f3" : "transparent",
                                borderRadius: "8px",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                flexShrink: 0,
                            }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 transition-transform duration-200 active:scale-110"
                                fill={liked ? "#f43f5e" : "none"}
                                stroke={liked ? "#f43f5e" : "#9ca3af"}
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                />
                            </svg>
                        </button>

                        <button
                            onClick={handleToggleComparison}
                            style={{
                                border: inComparison ? "1.5px solid #185FA5" : "1px solid #e5e7eb",
                                background: inComparison ? "#e6f1fb" : "transparent",
                                borderRadius: "8px",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                flexShrink: 0,
                            }}
                        >
                            <BarChart2 className="w-4 h-4" style={{ color: inComparison ? "#185FA5" : "#9ca3af" }} />
                        </button>
                    </div>
                </div>
            </Link>
        </Card>
    );
}

export default ProductCard; 