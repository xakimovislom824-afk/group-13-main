"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetCartsQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
} from "../../services/cartApi";
import { useGetProductsQuery } from "../../services/productApi";
import { Trash2, Minus, Plus } from "lucide-react";
import { IProduct } from "../../Types/index.types";

interface ICartItemWithDetails {
  id: number;
  cart: number;
  product: number;
  quantity: number;
  product_details?: IProduct;
}

export default function SavatchaPage() {
  const router = useRouter();
  const { data: carts = [], isLoading: isCartLoading } = useGetCartsQuery();
  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery();
  const [updateCart] = useUpdateCartMutation();
  const [deleteCart] = useDeleteCartMutation();

  const rawItems = carts.flatMap((cart) => cart.items ?? []);

  const items: ICartItemWithDetails[] = rawItems.map((item) => {
    const matchedProduct = products.find((p) => Number(p.id) === Number(item.product));
    return {
      id: item.id,
      cart: item.cart,
      product: item.product,
      quantity: item.quantity,
      product_details: matchedProduct,
    };
  });

  const cartTotal = items.reduce(
    (sum, item) =>
      sum + Number(item.product_details?.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const handleDecrease = (id: number, product: number, currentQty: number) => {
    if (currentQty <= 1) {
      deleteCart(id);
    } else {
      updateCart({ id, product, quantity: currentQty - 1 });
    }
  };

  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const PROMO_CODE = "Nodir";
  const PROMO_DISCOUNT_PERCENT = 20;

  const promoDiscount = promoApplied
    ? Math.round((cartTotal * PROMO_DISCOUNT_PERCENT) / 100)
    : 0;
  const finalTotal = cartTotal - promoDiscount;

  const progressPercent = Math.min((cartTotal / 500000) * 100, 100);
  const getProgressColor = (p: number) =>
    p >= 80 ? "#ef4444" : p >= 50 ? "#eab308" : "#22c55e";
  const progressColor = getProgressColor(progressPercent);

  const handleApplyPromo = () => {
    if (promoInput.trim() === PROMO_CODE) {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Noto'g'ri promokod. Qayta urinib ko'ring.");
    }
  };

  // Savatchadan buyurtmaga o'tishda snapshot saqlash va savatchani tozalash
  const handleGoToCheckout = async () => {
    if (items.length === 0) return;

    const snapshot = {
      items: items.map((item) => ({
        id: item.id,
        name: item.product_details?.name ?? `Mahsulot (ID: ${item.product})`,
        image: item.product_details?.image ?? "",
        price: Number(item.product_details?.price ?? 0),
        quantity: item.quantity ?? 1,
      })),
      promoApplied,
      promoDiscount,
      finalTotal,
    };

    sessionStorage.setItem("orderSnapshot", JSON.stringify(snapshot));

    // Savatchadagi barcha mahsulotlarni o'chirish
    for (const item of items) {
      await deleteCart(item.id);
    }

    router.push("/buyurtma");
  };

  if (isCartLoading || isProductsLoading) {
    return (
      <div className="bg-[#f9fafb] min-h-screen py-10 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-8">Savatcha</h1>

        {items.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl shadow-sm border">
            <p className="text-gray-400 text-xl mb-6">Savatchangiz hozircha bo'sh</p>
            <Link
              href="/katalog"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Xaridni boshlash
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* CHAP TOMON */}
            <div className="flex-1 space-y-6">

              {/* Progress bar */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium mb-3">
                  Xarid summasidan chegirmangiz:{" "}
                  <span className="font-bold" style={{ color: progressColor }}>0 so'm</span>
                </p>
                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="absolute top-0 left-0 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%`, backgroundColor: progressColor }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Yana{" "}
                  <span className="font-bold text-gray-800">
                    {cartTotal < 500000
                      ? (500000 - cartTotal).toLocaleString()
                      : 0}{" "}
                    so'm
                  </span>
                  lik mahsulot qo'shing va 7% chegirmaga ega bo'ling!
                </p>
              </div>

              {/* Jadval */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Mahsulot</th>
                      <th className="px-6 py-4 text-center">Narxi</th>
                      <th className="px-6 py-4 text-center">Soni</th>
                      <th className="px-6 py-4 text-center">Jami</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => {
                      const price = Number(item.product_details?.price ?? 0);
                      const qty = item.quantity ?? 1;

                      return (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 p-2 shrink-0">
                                {item.product_details?.image ? (
                                  <img
                                    src={item.product_details.image}
                                    alt={item.product_details?.name ?? ""}
                                    className="object-contain max-h-full"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">Rasm yo'q</span>
                                )}
                              </div>
                              <div className="max-w-[200px]">
                                <p className="text-[14px] font-bold text-gray-800 leading-tight mb-1">
                                  {item.product_details?.name ?? `Mahsulot (ID: ${item.product})`}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  ID: {item.product}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-6 text-center">
                            <p className="text-[15px] font-bold text-gray-900">
                              {price.toLocaleString()} so'm
                            </p>
                          </td>

                          <td className="px-6 py-6">
                            <div className="flex items-center justify-center bg-gray-100 rounded-full w-28 mx-auto px-2 py-1.5">
                              <button
                                onClick={() => handleDecrease(item.id, item.product, qty)}
                                className="p-1 hover:text-blue-600 transition"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-10 text-center text-sm font-bold">
                                {qty}
                              </span>
                              <button
                                onClick={() =>
                                  updateCart({ id: item.id, product: item.product, quantity: qty + 1 })
                                }
                                className="p-1 hover:text-blue-600 transition"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </td>

                          <td className="px-6 py-6 text-center">
                            <p className="text-[15px] font-bold text-blue-600">
                              {(price * qty).toLocaleString()} so'm
                            </p>
                          </td>

                          <td className="px-6 py-6 text-right">
                            <button
                              onClick={() => deleteCart(item.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* O'NG TOMON */}
            <div className="lg:w-[380px]">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg sticky top-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Jami</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[15px]">
                    <span className="text-gray-500">Promokod bo'yirma chegirma</span>
                    <span className={`font-semibold ${promoApplied ? "text-green-600" : "text-gray-800"}`}>
                      {promoApplied ? `-${promoDiscount.toLocaleString()} so'm` : "0 so'm"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[15px] border-b border-dashed pb-4">
                    <span className="text-gray-500">Xarid summasidan chegirma</span>
                    <span className="font-semibold text-gray-800">0 so'm</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-lg font-bold text-gray-800">Umumiy:</span>
                    <span className="text-3xl font-black text-blue-600 tracking-tighter">
                      {finalTotal.toLocaleString()}{" "}
                      <span className="text-lg font-bold">so'm</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Promokod kiriting"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError("");
                        if (promoApplied) setPromoApplied(false);
                      }}
                      className={`w-full border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:outline-none transition ${promoApplied
                          ? "border-green-400 focus:ring-green-300 bg-green-50"
                          : promoError
                            ? "border-red-400 focus:ring-red-300"
                            : "border-gray-200 focus:ring-blue-500"
                        }`}
                    />
                    {promoApplied && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs font-bold">
                        ✓ 20% chegirma
                      </span>
                    )}
                  </div>

                  {promoError && (
                    <p className="text-xs text-red-500 px-1">{promoError}</p>
                  )}

                  <button
                    onClick={handleApplyPromo}
                    className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl text-sm hover:bg-blue-100 transition"
                  >
                    Promokodni qo'llash
                  </button>

                  {/* ── Snapshot saqlab buyurtmaga o'tish ── */}
                  <button
                    onClick={handleGoToCheckout}
                    className="block w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all uppercase text-xs tracking-[2px] text-center"
                  >
                    Rasmiylashtirishga o'tish
                  </button>
                </div>

                <p className="text-gray-400 text-[11px] text-center mt-6 leading-relaxed">
                  "Rasmiylashtirish" tugmasini bosish orqali siz ommaviy oferta shartlariga rozilik bildirasiz.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}