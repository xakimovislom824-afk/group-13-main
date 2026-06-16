"use client";

import { use, useState, useCallback, useRef, useEffect, forwardRef } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Heart, GitCompareArrows, CheckCircle,
  X, Plus, Minus, Zap, CreditCard, Truck,
  ChevronRight, ChevronDown, ChevronUp, Shield, RotateCcw, Package,
  AlertCircle, Loader2,
} from "lucide-react";
import { useGetProductByIdQuery } from "../../../services/productDetailApi";

import {
  useGetCartsQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
} from "../../../services/cartApi";

import {
  useToggleWishlistMutation,
  useGetWishlistQuery,
} from "../../../services/wishlistApi";

// ── TOAST ──
type ToastType = "success" | "wish" | "error";
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-28 md:bottom-10 left-1/2 -translate-x-1/2 z-[100000] pointer-events-none flex flex-col gap-2.5 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          className={`
            flex items-center gap-3 bg-white border rounded-2xl px-5 py-3.5
            text-sm font-medium shadow-xl pointer-events-auto whitespace-nowrap
            ${toast.type === "success" ? "border-l-4 border-l-emerald-500 border-gray-100" : ""}
            ${toast.type === "wish"    ? "border-l-4 border-l-pink-400 border-gray-100"   : ""}
            ${toast.type === "error"   ? "border-l-4 border-l-red-400 border-gray-100"    : ""}
          `}
        >
          {toast.type === "success" && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
          {toast.type === "wish"    && <Heart        size={16} className="text-pink-400 shrink-0"    />}
          {toast.type === "error"   && <AlertCircle  size={16} className="text-red-400 shrink-0"     />}
          <span className="text-gray-700">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-2 text-gray-300 hover:text-gray-500 transition-colors pointer-events-auto"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── SKELETON ──
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-stone-100 rounded-2xl ${className ?? ""}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

// ── BUY NOW MODAL ──
export function BuyNowModal({
  product,
  onClose,
}: {
  product: {
    name: string;
    price: string;
    discounted_price: string;
    has_discount: boolean;
    image: string;
    stock: number;
  };
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [phone, setPhone] = useState("+998 ");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Zod (Loading) holati

  const finalPrice = product.has_discount
    ? Number(product.discounted_price)
    : Number(product.price);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Telefon raqamini chiroyli formatlash va cheklash funksiyasi
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Agar foydalanuvchi +998 ni o'chirib tashlamoqchi bo'lsa, qaytarib qo'yamiz
    if (!input.startsWith("+998 ")) {
      input = "+998 ";
    }

    // +998 dan keyingi qismini faqat raqamlardan iborat qilamiz
    const prefix = "+998 ";
    const digits = input.slice(prefix.length).replace(/\D/g, "");

    // Faqat 9ta raqam kiritishga ruxsat beramiz (Masalan: 901234567)
    const truncatedDigits = digits.slice(0, 9);

    // Chiroyli formatga keltiramiz: +998 (90) 123-45-67
    let formattedPhone = prefix;
    if (truncatedDigits.length > 0) {
      formattedPhone += "(" + truncatedDigits.slice(0, 2);
    }
    if (truncatedDigits.length > 2) {
      formattedPhone += ") " + truncatedDigits.slice(2, 5);
    }
    if (truncatedDigits.length > 5) {
      formattedPhone += "-" + truncatedDigits.slice(5, 7);
    }
    if (truncatedDigits.length > 7) {
      formattedPhone += "-" + truncatedDigits.slice(7, 9);
    }

    setPhone(formattedPhone);
  };

  // Telefon raqami to'liq kiritilganini tekshirish (9 ta raqam bo'lishi shart)
  const isPhoneValid = phone.replace(/\D/g, "").length === 12;
  const isFormValid = name.trim() !== "" && isPhoneValid && !loading;

  // Buyurtmani yuborish (Fake API so'rovi - Loader sinash uchun)
  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setLoading(true); // Yuklanishni boshlash
    
    try {
      // Bu yerda backend-ga so'rov yuborishingiz mumkin (fetch yoki axios)
      // Masalan: await axios.post('/api/orders', { name, phone, qty, product })
      
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 sekund kutish (Zod effekt)
      setSubmitted(true);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    } finally {
      setLoading(false); // Yuklanishni tugatish
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      {/* Orqa fon */}
      <div className="absolute inset-0 bg-blue-600/40 backdrop-blur-sm" onClick={loading ? undefined : onClose} />
      
      <div
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto z-10 flex flex-col"
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>
        
        {/* Modal Sarlavhasi */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-0.5">Tez buyurtma</p>
            <p className="text-base font-semibold text-stone-900">Bir klikda xarid qilish</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors disabled:opacity-50"
          >
            {/* <X size={15} strokeWidth={2.5} /> */}
            <span className="text-xs font-bold">✕</span>
          </button>
        </div>

        {submitted ? (
          /* Muvaffaqiyatli yakunlangandagi oyna */
          <div className="p-10 flex flex-col items-center gap-5 text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-100">
                {/* <CheckCircle size={36} className="text-emerald-500" /> */}
                <span className="text-emerald-500 text-3xl">✓</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Buyurtma qabul qilindi!</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Operatorimiz tez orada <span className="text-stone-900 font-semibold">{phone}</span> raqamiga aloqaga chiqadi.
              </p>
            </div>
            <button onClick={onClose} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg">
              Yopish
            </button>
          </div>
        ) : (
          /* Buyurtma berish formasi */
          <div className="p-6 space-y-5">
            {/* Mahsulot kartasi */}
            <div className="flex gap-4 bg-stone-50 border border-stone-100 rounded-2xl p-4">
              <div className="w-16 h-16 bg-white rounded-xl border border-stone-100 flex items-center justify-center shrink-0 p-2">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-xs text-stone-600 font-medium line-clamp-2 leading-snug mb-1">{product.name}</p>
                <p className="text-stone-900 font-bold text-xl leading-none">{(finalPrice * qty).toLocaleString()} <span className="text-base">₽</span></p>
              </div>
            </div>

            {/* Miqdor tanlash */}
            <div>
              <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest block mb-2.5">Miqdor</label>
              <div className="inline-flex items-center bg-stone-100 rounded-2xl overflow-hidden">
                <button 
                  disabled={loading}
                  onClick={() => setQty((q) => Math.max(1, q - 1))} 
                  className="w-11 h-11 flex items-center justify-center hover:bg-stone-200 text-stone-700 transition-colors disabled:opacity-50"
                >
                  {/* <Minus size={14} strokeWidth={2.5} /> */}
                  <span>-</span>
                </button>
                <span className="text-sm font-bold w-10 text-center text-stone-900">{qty}</span>
                <button 
                  disabled={loading}
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} 
                  className="w-11 h-11 flex items-center justify-center hover:bg-stone-200 text-stone-700 transition-colors disabled:opacity-50"
                >
                  {/* <Plus size={14} strokeWidth={2.5} /> */}
                  <span>+</span>
                </button>
              </div>
            </div>

            {/* Ism kiritish inputi */}
            <div>
              <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest block mb-2.5">Ismingiz</label>
              <input 
                type="text" 
                placeholder="Ism Familiya" 
                value={name} 
                disabled={loading}
                onChange={(e) => setName(e.target.value)} 
                className="w-full border-2 border-stone-100 focus:border-stone-900 bg-stone-50 focus:bg-white rounded-2xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-stone-300 font-medium text-stone-900 disabled:opacity-60" 
              />
            </div>

            {/* Telefon kiritish inputi */}
            <div>
              <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest block mb-2.5">Telefon raqamingiz</label>
              <input 
                type="text" 
                value={phone} 
                disabled={loading}
                onChange={handlePhoneChange} 
                className="w-full border-2 border-stone-100 focus:border-stone-900 bg-stone-50 focus:bg-white rounded-2xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-stone-300 font-medium text-stone-900 disabled:opacity-60 tracking-wide" 
              />
            </div>

            {/* Tasdiqlash tugmasi + Loader */}
            <button 
              onClick={handleSubmit} 
              disabled={!isFormValid} 
              className="w-full bg-blue-600 disabled:bg-stone-100 disabled:text-stone-300 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  {/* Agar loyihangizda Lucide bo'lsa <Loader2 className="animate-spin" size={18} /> ishlating */}
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Yuborilmoqda...
                </>
              ) : (
                "Xaridni tasdiqlash"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TABS ──
interface TabsProps {
  specs: [string, string][];
  description?: string;
  advantages?: unknown;
  activeTab?: number;
  setActiveTab?: (idx: number) => void;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ specs, description, advantages, activeTab, setActiveTab }, ref) => {
    const [internalActive, setInternalActive] = useState(0);
    const [showAll, setShowAll] = useState(false);

    const active = activeTab !== undefined ? activeTab : internalActive;
    const setActive = setActiveTab !== undefined ? setActiveTab : setInternalActive;

    const advList: string[] = Array.isArray(advantages)
      ? (advantages as string[]).map((a) => typeof a === "string" ? a : JSON.stringify(a))
      : typeof advantages === "string"
      ? (advantages as string).split("\n").filter(Boolean)
      : [];

    const tabs = ["Xususiyatlar", "Tavsif", "Yetkazib berish"];
    const visibleSpecs = showAll ? specs : specs.slice(0, 7);

    return (
      <div
        ref={ref}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="mt-6 bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm select-none"
      >
        <div className="flex border-b border-stone-100 bg-stone-50/60 px-2 pt-2 gap-1">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActive(i)}
              className={`relative px-5 py-3.5 text-sm font-medium transition-all rounded-t-xl whitespace-nowrap ${
                active === i
                  ? "text-stone-900 bg-white shadow-sm border border-stone-100 border-b-white -mb-px"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {active === 0 && (
            <div className="max-w-3xl">
              {specs.length > 0 ? (
                <>
                  <div className="overflow-hidden rounded-2xl border border-stone-100">
                    <table className="w-full text-sm">
                      <tbody>
                        {visibleSpecs.map(([k, v], i) => (
                          <tr key={i} className={`border-b border-stone-50 last:border-0 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "bg-stone-50/40" : "bg-white"}`}>
                            <td className="py-3.5 px-5 text-stone-500 w-[45%] font-medium border-r border-stone-50">{k}</td>
                            <td className="py-3.5 px-5 text-stone-900 font-semibold">{v || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {specs.length > 7 && (
                    <button onClick={() => setShowAll((v) => !v)} className="mt-4 text-stone-600 text-sm font-medium flex items-center gap-1.5 hover:text-stone-900 transition-colors group">
                      {showAll ? (<><ChevronUp size={14} strokeWidth={2.5} />Yig'ish</>) : (<><ChevronDown size={14} strokeWidth={2.5} />Barcha xususiyatlar ({specs.length})</>)}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-stone-400 text-sm">Xususiyatlar mavjud emas</p>
              )}
            </div>
          )}

          {active === 1 && (
            <div className="space-y-5 max-w-3xl">
              {description && <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">{description}</p>}
              {advList.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {advList.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm bg-emerald-50/50 border border-emerald-100/60 p-4 rounded-2xl">
                      <CheckCircle size={15} className="text-emerald-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-stone-700 font-medium leading-snug">{a}</span>
                    </li>
                  ))}
                </ul>
              )}
              {!description && advList.length === 0 && <p className="text-stone-400 text-sm">Tavsif mavjud emas</p>}
            </div>
          )}

          {active === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
              {[
                { icon: CreditCard, title: "Istalgan to'lov usuli", desc: "Naqd, karta yoki onlayn xaridlar", color: "bg-blue-50 border-blue-100/60", iconColor: "text-blue-500" },
                { icon: Truck, title: "Tezkor yetkazib berish", desc: "Shahar bo'ylab 24 soat ichida", color: "bg-violet-50 border-violet-100/60", iconColor: "text-violet-500" },
                { icon: Shield, title: "Kafolat va qaytarish", desc: "14 kun ichida to'liq qaytarish", color: "bg-amber-50 border-amber-100/60", iconColor: "text-amber-500" },
              ].map(({ icon: Icon, title, desc, color, iconColor }, idx) => (
                <div key={idx} className={`flex flex-col gap-3 ${color} border p-5 rounded-2xl`}>
                  <Icon size={20} className={iconColor} strokeWidth={1.75} />
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{title}</p>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Tabs.displayName = "Tabs";

// ── CART STEPPER BUTTON ──
function CartStepper({
  qty,
  loading,
  stock,
  onIncrease,
  onDecrease,
  onAdd,
}: {
  qty: number;
  loading: boolean;
  stock: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAdd: () => void;
}) {
  if (qty === 0) {
    return (
      <button
        onClick={onAdd}
        disabled={stock === 0 || loading}
        className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all bg-blue-600 hover:bg-gree-600 text-white disabled:bg-stone-100 disabled:text-stone-300 shadow-sm hover:shadow-md"
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <>
            <ShoppingCart size={15} strokeWidth={2} />
            Savatchaga qo'shish
          </>
        )}
      </button>
    );
  }

  return (
    <div className="w-full h-14 flex items-center justify-between rounded-2xl bg-blue-50 border border-blue-200 px-2 select-none">
      <button
        onClick={onDecrease}
        disabled={loading}
        className="w-10 h-10 flex items-center justify-center rounded-xl text-blue-600 hover:bg-blue-100 active:scale-90 transition-all disabled:opacity-40 font-bold text-lg"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Minus size={15} strokeWidth={2.5} />}
      </button>
      <div className="flex flex-col items-center">
        <span className="text-sm font-bold text-blue-700">{qty}</span>
        <span className="text-[9px] text-blue-400 font-medium uppercase tracking-wide">dona</span>
      </div>
      <button
        onClick={onIncrease}
        disabled={loading || qty >= stock}
        className="w-10 h-10 flex items-center justify-center rounded-xl text-blue-600 hover:bg-blue-100 active:scale-90 transition-all disabled:opacity-40 font-bold text-lg"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={15} strokeWidth={2.5} />}
      </button>
    </div>
  );
}

// ── MOBILE CART STEPPER ──
function MobileCartStepper({
  qty,
  loading,
  stock,
  onIncrease,
  onDecrease,
  onAdd,
}: {
  qty: number;
  loading: boolean;
  stock: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAdd: () => void;
}) {
  if (qty === 0) {
    return (
      <button
        onClick={onAdd}
        disabled={stock === 0 || loading}
        className="flex-1 py-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-stone-900 text-white active:scale-95"
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <><ShoppingCart size={13} strokeWidth={2} />Savatchaga</>}
      </button>
    );
  }

  return (
    <div className="flex-1 h-[52px] flex items-center justify-between rounded-2xl bg-blue-50 border border-blue-200 px-1.5 select-none">
      <button
        onClick={onDecrease}
        disabled={loading}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-blue-600 hover:bg-blue-100 active:scale-90 transition-all disabled:opacity-40 font-bold"
      >
        <Minus size={13} strokeWidth={2.5} />
      </button>
      <span className="text-sm font-bold text-blue-700">{qty}</span>
      <button
        onClick={onIncrease}
        disabled={loading || qty >= stock}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-blue-600 hover:bg-blue-100 active:scale-90 transition-all disabled:opacity-40 font-bold"
      >
        <Plus size={13} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ── MAIN PAGE ──
export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = Number(id);
  const router = useRouter();
  const tabsRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId);

  // ── Cart API ──
  const { data: cartData } = useGetCartsQuery();
  const [addToCart] = useAddToCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [deleteCart] = useDeleteCartMutation();

  // ── Wishlist API ──
  const [toggleWishlist] = useToggleWishlistMutation();
  const { data: wishlistData } = useGetWishlistQuery();

  // ── Local state ──
  const [inWishlist, setInWishlist] = useState(false);
  const [inCompare, setInCompare] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [cartQty, setCartQty] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // ── Toast helper ──
  const notify = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Sync wishlist state from API ──
  useEffect(() => {
    if (!wishlistData || !productId) return;
    const inList = wishlistData.some((item: any) => {
      const pId = typeof item.product === "object" ? item.product?.id : item.product;
      return Number(pId) === productId;
    });
    setInWishlist(inList);
  }, [wishlistData, productId]);

  // ── Helper: find cart item for this product ──
  const getCartItem = useCallback(() => {
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
      return Number(pId) === productId || Number(pDetailId) === productId;
    });
  }, [cartData, productId]);

  // ── Sync cart qty from API ──
  useEffect(() => {
    const cartItem = getCartItem();
    setCartQty(cartItem ? cartItem.quantity : 0);
  }, [getCartItem]);

  // ── Add to cart (first time) ──
  const handleAddToCart = async () => {
    if (cartLoading) return;
    setCartLoading(true);
    setCartQty(1);
    try {
      await addToCart({ product: productId, quantity: 1 }).unwrap();
      notify("Savatchaga qo'shildi!", "success");
    } catch (err: any) {
      setCartQty(0);
      notify(err?.data?.detail || "Xatolik yuz berdi", "error");
    } finally {
      setCartLoading(false);
    }
  };

  // ── Increase qty ──
  const handleIncrease = async () => {
    const cartItem = getCartItem();
    if (!cartItem) { await handleAddToCart(); return; }
    const newQty = cartQty + 1;
    setCartQty(newQty);
    setCartLoading(true);
    try {
      await updateCart({ id: cartItem.id, product: productId, quantity: newQty }).unwrap();
    } catch {
      setCartQty(cartQty);
      notify("Miqdorni oshirishda xatolik", "error");
    } finally {
      setCartLoading(false);
    }
  };

  // ── Decrease qty ──
  const handleDecrease = async () => {
    const cartItem = getCartItem();
    if (!cartItem) return;
    const newQty = cartQty - 1;
    setCartLoading(true);
    if (newQty <= 0) {
      setCartQty(0);
      try {
        await deleteCart(cartItem.id).unwrap();
        notify("Savatdan o'chirildi", "success");
      } catch {
        setCartQty(cartQty);
        notify("O'chirishda xatolik", "error");
      } finally {
        setCartLoading(false);
      }
      return;
    }
    setCartQty(newQty);
    try {
      await updateCart({ id: cartItem.id, product: productId, quantity: newQty }).unwrap();
    } catch {
      setCartQty(cartQty);
      notify("Miqdorni kamaytirishda xatolik", "error");
    } finally {
      setCartLoading(false);
    }
  };

  // ── Wishlist toggle ──
  const handleWishlist = async () => {
    if (wishLoading) return;
    setWishLoading(true);
    const wasInList = inWishlist;
    setInWishlist(!wasInList);
    try {
      await toggleWishlist({ product_id: productId }).unwrap();
      notify(wasInList ? "Sevimlilardan olib tashlandi" : "Sevimlilarga qo'shildi!", "wish");
    } catch (err: any) {
      setInWishlist(wasInList);
      notify(err?.data?.detail || "Xatolik yuz berdi", "error");
    } finally {
      setWishLoading(false);
    }
  };

  const handleCompare = () => {
    const next = !inCompare;
    setInCompare(next);
    notify(next ? "Taqqoslashga qo'shildi ✓" : "Taqqoslashdan olib tashlandi");
    if (next) setTimeout(() => router.push("/taqqoslash"), 1200);
  };

  const scrollToTabs = (tabIdx: number) => {
    setActiveTab(tabIdx);
    if (tabsRef.current) tabsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // ── LOADING ──
  if (isLoading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-3 w-52" />
        <Skeleton className="h-7 w-2/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="aspect-square" />
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // ── ERROR ──
  if (isError || !product) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center border border-stone-200">
          <Package size={24} className="text-stone-400" />
        </div>
        <div>
          <p className="text-stone-900 font-semibold text-lg">Mahsulot topilmadi</p>
          <p className="text-stone-400 text-sm mt-1.5">Ushbu mahsulot mavjud emas yoki o'chirilgan.</p>
        </div>
        <a href="/katalog" className="bg-stone-900 text-white px-7 py-3.5 rounded-2xl font-medium hover:bg-black transition-colors text-sm shadow-lg">
          Katalogga qaytish
        </a>
      </div>
    );
  }

  const finalPrice = product.has_discount ? Number(product.discounted_price) : Number(product.price);

  let SPECS: [string, string][] = [];
  try {
    const parsed = JSON.parse(product.specifications || "[]");
    if (Array.isArray(parsed)) {
      SPECS = parsed.map((item: { key?: string; value?: string; label?: string }) => [
        item.key || item.label || "",
        item.value || "",
      ]);
    }
  } catch {
    SPECS = [];
  }

  const shortSpecs = SPECS.slice(0, 6);

  return (
    <>
      <style>{`
        @keyframes shimmer { to { transform: translateX(200%); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="bg-[#faf9f7] min-h-screen pb-28 md:pb-14 text-stone-900">
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {showBuyModal && (
          <BuyNowModal
            product={{
              name: product.name,
              price: product.price,
              discounted_price: product.discounted_price,
              has_discount: product.has_discount,
              image: product.image,
              stock: product.stock,
            }}
            onClose={() => setShowBuyModal(false)}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 py-7 md:py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] font-medium text-stone-400 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap select-none">
            <a href="/" className="hover:text-stone-700 transition-colors">Bosh sahifa</a>
            <ChevronRight size={10} className="text-stone-300 shrink-0" strokeWidth={2.5} />
            <a href="/katalog" className="hover:text-stone-700 transition-colors">Katalog</a>
            <ChevronRight size={10} className="text-stone-300 shrink-0" strokeWidth={2.5} />
            <span className="text-stone-600 truncate max-w-[200px] md:max-w-none font-medium">{product.name}</span>
          </nav>

          {/* Title */}
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-2xl md:text-3xl text-stone-900 mb-7 leading-snug max-w-3xl font-normal">
            {product.name}
          </h1>

          {/* ── 3-COL GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

            {/* COL 1 — Image */}
            <div className="lg:col-span-1 select-none space-y-3">
              <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden aspect-square flex items-center justify-center relative p-10 shadow-sm group">
                {product.has_discount && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-red-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-sm">
                      −{Math.round(product.discount_percent)}%
                    </span>
                  </div>
                )}
                {(product.is_hit || product.is_new) && (
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
                    {product.is_new && <span className="bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">Yangi</span>}
                    {product.is_hit && <span className="bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">Hit</span>}
                  </div>
                )}
                <img src={product.image} alt={product.name} loading="eager" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: Shield, label: "Kafolat", color: "text-amber-500" },
                  { icon: Truck, label: "Yetkazish", color: "text-blue-500" },
                  { icon: RotateCcw, label: "Qaytarish", color: "text-violet-500" },
                  { icon: CreditCard, label: "To'lov", color: "text-emerald-500" },
                ].map(({ icon: Icon, label, color }, idx) => (
                  <div key={idx} className="bg-white border border-stone-100 rounded-2xl py-3.5 flex flex-col items-center gap-2 shadow-sm hover:border-stone-200 transition-colors">
                    <Icon size={15} className={color} strokeWidth={1.75} />
                    <span className="text-[9px] font-semibold text-stone-500 text-center uppercase tracking-wide">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 2 — Short specs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden h-full flex flex-col shadow-sm">
                <div className="px-6 py-4 border-b border-stone-50 flex items-center justify-between select-none">
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Qisqa xususiyatlar</p>
                  <span className="text-[10px] font-medium text-stone-400 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-100">
                    Art: XJ89H{product.id}
                  </span>
                </div>

                <div className="flex-1">
                  {shortSpecs.length > 0 ? (
                    <div>
                      {shortSpecs.map(([k, v], i) => (
                        <div key={i} className={`flex gap-4 px-6 py-3.5 border-b border-stone-50 last:border-0 hover:bg-stone-50/60 transition-colors ${i % 2 === 0 ? "bg-transparent" : "bg-stone-50/20"}`}>
                          <span className="text-xs text-stone-400 w-[44%] shrink-0 font-medium leading-relaxed">{k}</span>
                          <span className="text-xs text-stone-800 font-semibold leading-relaxed">{v || "—"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500 font-normal p-6 leading-relaxed">{product.description || "Ma'lumot mavjud emas"}</p>
                  )}

                  {SPECS.length > 6 && (
                    <div className="px-6 py-4 border-t border-stone-50 select-none">
                      <button onClick={() => scrollToTabs(0)} className="text-xs text-stone-500 font-medium hover:text-stone-900 transition-colors flex items-center gap-1 group">
                        Barchasini ko'rish
                        <ChevronRight size={12} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>

                {product.description && shortSpecs.length > 0 && (
                  <div className="px-6 py-4 border-t border-stone-50 bg-stone-50/30">
                    <p className="text-[11px] text-stone-400 font-normal leading-relaxed line-clamp-3">{product.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* COL 3 — Purchase */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">

                {/* Price block */}
                <div className="px-6 pt-6 pb-5 border-b border-stone-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-xl ${product.stock > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-400"}`} />
                      {product.stock > 0 ? "Omborda bor" : "Mavjud emas"}
                    </span>
                    {product.has_discount && (
                      <span className="text-[11px] font-medium bg-red-50 text-red-500 border border-red-100 px-3 py-1.5 rounded-xl">
                        −{Math.round(product.discount_percent)}%
                      </span>
                    )}
                  </div>

                  <div>
                    {product.has_discount && product.old_price && (
                      <p className="text-sm text-stone-300 font-medium line-through mb-1">
                        {(Number(product.old_price)).toLocaleString()} ₽
                      </p>
                    )}
                    <div className="flex items-end gap-2">
                      <span style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-stone-900 leading-none font-normal">
                        {finalPrice.toLocaleString()}
                      </span>
                      <span className="text-xl text-stone-400 mb-0.5">₽</span>
                    </div>
                    {cartQty > 0 && (
                      <p className="text-xs text-blue-500 font-medium mt-1.5">
                        Jami: {(finalPrice * cartQty).toLocaleString()} ₽ ({cartQty} dona)
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Cart stepper — desktop */}
                  <div className="hidden md:block">
                    <CartStepper
                      qty={cartQty}
                      loading={cartLoading}
                      stock={product.stock}
                      onAdd={handleAddToCart}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                    />
                  </div>

                  {/* Buy Now button */}
                  <button
                    onClick={() => setShowBuyModal(true)}
                    disabled={product.stock === 0}
                    className="hidden md:flex w-full py-4 rounded-2xl text-sm font-semibold border-2 border-stone-100 text-stone-700 bg-white hover:border-stone-300 hover:bg-stone-50 active:scale-[0.98] transition-all items-center justify-center gap-2.5 disabled:opacity-30"
                  >
                    <Zap size={14} className="fill-current" />
                    1 klikda xarid qilish
                  </button>

                  <div className="border-t border-stone-50" />

                  {/* Wishlist + Compare */}
                  <div className="flex items-center justify-between select-none">
                    <button
                      onClick={handleWishlist}
                      disabled={wishLoading}
                      className={`flex items-center gap-2 text-xs font-medium transition-colors px-3.5 py-2.5 rounded-xl ${inWishlist ? "text-red-500 bg-red-50 border border-red-100" : "text-stone-500 hover:text-red-500 hover:bg-red-50"}`}
                    >
                      {wishLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Heart size={14} fill={inWishlist ? "currentColor" : "none"} strokeWidth={2} />
                      )}
                      Tanlanganlar
                    </button>
                    <button
                      onClick={handleCompare}
                      className={`flex items-center gap-2 text-xs font-medium transition-colors px-3.5 py-2.5 rounded-xl ${inCompare ? "text-violet-600 bg-violet-50 border border-violet-100" : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"}`}
                    >
                      <GitCompareArrows size={14} strokeWidth={2} />
                      Taqqoslash
                    </button>
                  </div>

                  {/* Perk cards */}
                  <div className="grid grid-cols-2 gap-2 pt-1 select-none">
                    {[
                      { icon: CreditCard, label: "To'lov usullari", color: "text-blue-400" },
                      { icon: Truck, label: "Tez yetkazish", color: "text-violet-400" },
                      { icon: Shield, label: "Kafolat beriladi", color: "text-amber-400" },
                      { icon: RotateCcw, label: "14 kun qaytarish", color: "text-emerald-400" },
                    ].map(({ icon: Icon, label, color }, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 bg-stone-50 rounded-2xl px-3.5 py-3 border border-stone-100">
                        <Icon size={13} className={`${color} shrink-0`} strokeWidth={2} />
                        <span className="text-[10px] font-medium text-stone-500">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            ref={tabsRef}
            specs={SPECS}
            description={product.description}
            advantages={product.advantages}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* ── MOBILE STICKY BAR ── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-100 px-4 py-3.5 z-40 flex items-center gap-3 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] select-none">
          <div className="flex flex-col min-w-0 shrink-0">
            <span className="text-[9px] uppercase font-semibold tracking-widest text-stone-300 mb-0.5">
              {cartQty > 0 ? "Jami narx" : "Narx"}
            </span>
            <span style={{ fontFamily: "'DM Serif Display', serif" }} className="text-2xl text-stone-900 font-normal leading-tight">
              {cartQty > 0
                ? (finalPrice * cartQty).toLocaleString()
                : finalPrice.toLocaleString()}{" "}
              <span className="text-lg text-stone-400">₽</span>
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <MobileCartStepper
              qty={cartQty}
              loading={cartLoading}
              stock={product.stock}
              onAdd={handleAddToCart}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
            <button
              onClick={() => setShowBuyModal(true)}
              disabled={product.stock === 0}
              className="p-4 rounded-2xl border-2 border-stone-100 text-stone-700 bg-white active:scale-95 transition-all hover:border-stone-300"
            >
              <Zap size={14} className="fill-current" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}