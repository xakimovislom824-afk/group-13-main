"use client";
import { Card } from "../components/ui/card";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import {
    useGetWishlistQuery,
    useToggleWishlistMutation,
} from "../services/wishlistApi";
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

type CartEntry = {
    id: number;
    product?: number;
    quantity: number;
    items?: CartEntry[];
    product_data?: { id: number };
    product_detail?: { id: number };
};

const getMutationErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error !== "object" || error === null || !("data" in error)) return fallback;
    const data = error.data;
    if (typeof data === "object" && data !== null && "detail" in data && typeof data.detail === "string") {
        return data.detail;
    }
    return fallback;
};

function ProductCard({ product }: { product: IProduct }) {
    const [token, setToken] = useState<string | null>(null);
    const [localLiked, setLocalLiked] = useState<boolean | null>(null);

    const syncAuthState = () => {
        if (typeof window === "undefined") return;
        const tokenFromStorage = localStorage.getItem("access");
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
            return;
        }

        const cookieToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access="))
            ?.split("=")[1];

        setToken(cookieToken || null);
    };

    useEffect(() => {
        const frame = window.requestAnimationFrame(syncAuthState);
        window.addEventListener("authChange", syncAuthState);
        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("authChange", syncAuthState);
        };
    }, []);

    const { data: wishlist = [] } = useGetWishlistQuery(undefined, { skip: !token });
    const [toggleWishlist] = useToggleWishlistMutation();

    // ✅ Cart (demo mode: ishlashi uchun auth cheklovini olib tashlaymiz)
    const { data: carts = [] } = useGetCartsQuery();
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
    const cartList = (Array.isArray(carts) ? carts : [carts]) as CartEntry[];
    const allItems = cartList.flatMap((cartItem) => {
        if (Array.isArray(cartItem.items)) return cartItem.items;
        if (cartItem.product !== undefined || cartItem.product_data || cartItem.product_detail) return [cartItem];
        return [];
    });
    const cartItem = allItems.find(
        (item) =>
            Number(item.product) === Number(product.id) ||
            Number(item.product_data?.id) === Number(product.id) ||
            Number(item.product_detail?.id) === Number(product.id)
    );
    const inCart = !!cartItem;
    const cartBusy = addLoading || updateLoading;

    const wishlistItem = wishlist.find(
        (item) => item.product === product.id || item.product_detail?.id === product.id
    );
    const liked = localLiked !== null ? localLiked : !!wishlistItem;

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
            await toggleWishlist({
                product_id: product.id,
                product_detail: product,
            }).unwrap();
        } catch {
            setLocalLiked(liked);
        } finally {
            setTimeout(() => setLocalLiked(null), 500);
        }
    };

    // ✅ Birinchi marta savatga qo'shish
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartBusy) return;
        try {
            await addToCart({ product: product.id, quantity: 1 }).unwrap();
            toast.success("Savatchaga qo'shildi!", { autoClose: 1200 });
        } catch (error: unknown) {
            toast.error(getMutationErrorMessage(error, "Xatolik yuz berdi"), { autoClose: 2000 });
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
        } catch (error: unknown) {
            toast.error(getMutationErrorMessage(error, "Xatolik"), { autoClose: 1500 });
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
        } catch (error: unknown) {
            toast.error(getMutationErrorMessage(error, "Xatolik"), { autoClose: 1500 });
        }
    };


    return (
        <Card className="group relative flex w-full flex-shrink-0 flex-col overflow-hidden rounded-xl shadow-none! ring-0 transition-all">
            <Link href={`/detail/${product.id}`} className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                <div className="product-image-panel relative h-44 w-full bg-gray-50 rounded-xl mb-3 overflow-hidden p-3">
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
                </div>
            </Link>

            <div className="flex gap-1.5 px-1 pb-1">
                {inCart ? (
                    <div className="flex h-9 flex-1 items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-1">
                        <button
                            type="button"
                            onClick={handleDecrement}
                            disabled={cartBusy}
                            className="flex h-7 w-8 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-100 active:scale-90 disabled:opacity-50"
                            aria-label={`${product.name} sonini kamaytirish`}
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[24px] text-center text-sm font-bold text-blue-700">
                            {cartBusy ? (
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                            ) : (
                                cartItem.quantity
                            )}
                        </span>
                        <button
                            type="button"
                            onClick={handleIncrement}
                            disabled={cartBusy}
                            className="flex h-7 w-8 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-100 active:scale-90 disabled:opacity-50"
                            aria-label={`${product.name} sonini oshirish`}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={cartBusy}
                        className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-blue-600 text-xs font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-95 disabled:opacity-70"
                    >
                        {addLoading ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                <ShoppingCart className="h-3.5 w-3.5" />
                                Sotib olish
                            </>
                        )}
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleToggleFavorite}
                    aria-label={liked ? `${product.name} saralanganlardan o‘chirish` : `${product.name} saralanganlarga qo‘shish`}
                    aria-pressed={liked}
                    className="favorite-button"
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
                        className="h-4 w-4 transition-transform duration-200 active:scale-110"
                        fill={liked ? "#f43f5e" : "none"}
                        stroke={liked ? "#f43f5e" : "#9ca3af"}
                        strokeWidth={2}
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        />
                    </svg>
                </button>
            </div>
        </Card>
    );
}

export default ProductCard;
