"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetFaqsQuery } from "../../services/faqApi";
import { CheckCircle } from "lucide-react";

type OrderItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type OrderSnapshot = {
  items: OrderItem[];
  promoApplied: boolean;
  promoDiscount: number;
  finalTotal: number;
};

const orderSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak"),
  surname: z.string().min(2, "Familiya kamida 2 ta harfdan iborat bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqami noto'g'ri kiritildi"),
  email: z.string().email("Noto'g'ri email manzili kiritildi").or(z.literal("")),
});

type OrderFormData = z.infer<typeof orderSchema>;

// ── Toast komponenti ──
function SuccessToast({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
    >
      <div className="flex items-center gap-3 bg-white border border-green-200 shadow-2xl shadow-green-100 rounded-2xl px-6 py-4 min-w-[300px]">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle className="text-green-600 w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">Buyurtma muvaffaqiyatli berildi!</p>
          <p className="text-xs text-gray-400 mt-0.5">Buyurtmangiz qabul qilindi!</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto text-gray-300 hover:text-gray-500 transition text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function BuyurtmaPage() {
  const router = useRouter();
  const orderRef = useRef<HTMLDivElement>(null);

  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [delivery, setDelivery] = useState("pickup");
  const [payment, setPayment] = useState("card");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  const { data: faqs = [] } = useGetFaqsQuery();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { name: "", surname: "", phone: "", email: "" },
  });

  useEffect(() => {
    const raw = sessionStorage.getItem("orderSnapshot");
    if (raw) {
      try { setOrder(JSON.parse(raw)); }
      catch { setOrder(null); }
    }
  }, []);

  const scrollToOrder = () => {
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onOrderSubmit = (formData: OrderFormData) => {
    if (!order || order.items.length === 0) {
      alert("Savat bo'sh!");
      return;
    }

    const newOrder = {
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      status: "Jarayonda",
      amount: order.finalTotal.toLocaleString(),
      items: order.items,
      delivery,
      payment,
      customer: formData,
    };

    const existing = localStorage.getItem("userOrders");
    const orders = existing ? JSON.parse(existing) : [];
    orders.unshift(newOrder);
    localStorage.setItem("userOrders", JSON.stringify(orders));
    sessionStorage.removeItem("orderSnapshot");

    // Faqat toast ko'rsatish, sahifa o'zgarmaydi
    setOrder(null);
    setShowToast(true);
  };

  const deliveryOptions = [
    { value: "pickup", label: "Olib ketish" },
    { value: "delivery", label: "Yetkazib berish" },
    { value: "post", label: "Pochta" },
  ];

  return (
    <div className="bg-[#f5f7fb] min-h-screen py-10">
      {/* Toast */}
      <SuccessToast visible={showToast} onClose={() => setShowToast(false)} />

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-8">
          Buyurtmani rasmiylashtirish
        </h1>

        <form onSubmit={handleSubmit(onOrderSubmit)} className="flex flex-col lg:flex-row gap-8">

          {/* CHAP TOMON */}
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm mb-6 text-gray-500">
              Hisobingiz bormi?{" "}
              <span className="text-blue-500 cursor-pointer hover:underline">Kirish</span>
            </p>

            <h2 className="text-base font-bold text-gray-800 mb-3">Yetkazib berish</h2>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {deliveryOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 border rounded-xl px-4 py-3 cursor-pointer transition text-sm font-medium ${delivery === opt.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    className="accent-blue-600"
                    checked={delivery === opt.value}
                    onChange={() => setDelivery(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <h2 className="text-base font-bold text-gray-800 mb-3">To'lov</h2>
            <div className="flex gap-4 mb-8">
              {[
                { value: "card", label: "Kartadan" },
                { value: "cash", label: "Naqd" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 border rounded-xl px-5 py-3 cursor-pointer transition text-sm font-medium ${payment === opt.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    className="accent-blue-600"
                    checked={payment === opt.value}
                    onChange={() => setPayment(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <h2 className="text-base font-bold text-gray-800 mb-3">Shaxsiy ma'lumotlar</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Ism"
                  {...register("name")}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.name && <p className="text-red-500 text-[11px]">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Familiya"
                  {...register("surname")}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.surname && <p className="text-red-500 text-[11px]">{errors.surname.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-700">
                  Telefon raqami <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      country={"uz"}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      inputStyle={{
                        width: "100%",
                        height: "48px",
                        borderRadius: "10px",
                        border: errors.phone ? "1px solid red" : "1px solid #e5e7eb",
                      }}
                      buttonStyle={{
                        borderTopLeftRadius: "10px",
                        borderBottomLeftRadius: "10px",
                      }}
                    />
                  )}
                />
                {errors.phone && <p className="text-red-500 text-[11px]">{errors.phone.message}</p>}
              </div>
              <div className="flex flex-col gap-1 pt-6">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.email && <p className="text-red-500 text-[11px]">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* O'NG TOMON */}
          <div className="lg:w-[400px]">
            <div
              ref={orderRef}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-800">Buyurtma</h2>
                {order && order.items.length > 3 && (
                  <button type="button" onClick={scrollToOrder} className="text-xs text-blue-500 hover:underline">
                    Pastga ↓
                  </button>
                )}
              </div>

              {!order || order.items.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">Buyurtma bo'sh</p>
              ) : (
                <>
                  <div className="max-h-[340px] overflow-y-auto pr-1 space-y-4 mb-5">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0 p-1.5">
                          <img src={item.image} alt={item.name} className="object-contain max-h-full max-w-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {item.quantity} dona × {item.price.toLocaleString()} so'm
                          </p>
                        </div>
                        <p className="text-[14px] font-bold text-blue-600 whitespace-nowrap">
                          {(item.price * item.quantity).toLocaleString()} so'm
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 border-t border-dashed pt-4">
                    {order.promoApplied && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Promokod chegirma</span>
                        <span className="text-green-600 font-semibold">
                          -{order.promoDiscount.toLocaleString()} so'm
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-end">
                      <span className="text-base font-bold text-gray-800">Jami:</span>
                      <span className="text-2xl font-black text-blue-600">
                        {order.finalTotal.toLocaleString()}{" "}
                        <span className="text-sm font-bold">so'm</span>
                      </span>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all uppercase text-xs tracking-[2px] disabled:opacity-60"
                disabled={showToast}
              >
                Buyurtma berish
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
                Buyurtma berish orqali siz ommaviy oferta shartlariga rozilik bildirasiz.
              </p>
            </div>
          </div>

        </form>

        {/* ── FAQ bo'limi ── */}
        {faqs.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Ko'p so'raladigan savollar</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </span>
                    <span
                      className={`text-blue-600 text-xl font-bold transition-transform duration-200 shrink-0 ${openFaq === faq.id ? "rotate-45" : ""
                        }`}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                      <p className="pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}