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
// FIX: min-w-[300px] o'rniga ekran kengligiga moslashuvchan w-[calc(100vw-2rem)] + max-w
// qo'shildi, shunda 360px ekranda toast chetlardan chiqib ketmaydi.
function SuccessToast({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[340px] transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
    >
      <div className="flex items-center gap-3 bg-white border border-green-200 shadow-2xl shadow-green-100 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 w-full">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle className="text-green-600 w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] sm:text-sm font-bold text-gray-800 truncate">Buyurtma muvaffaqiyatli berildi!</p>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">Buyurtmangiz qabul qilindi!</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto text-gray-300 hover:text-gray-500 transition text-lg leading-none shrink-0"
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
    reset,
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
    // FIX: Buyurtma berilgandan so'ng Ism, Familiya, Email, Telefon
    // maydonlari bo'shatiladi (PhoneInput ham reset() orqali tozalanadi,
    // chunki u Controller bilan boshqariladi)
    reset({ name: "", surname: "", phone: "", email: "" });
  };

  const deliveryOptions = [
    { value: "pickup", label: "Olib ketish" },
    { value: "delivery", label: "Yetkazib berish" },
    { value: "post", label: "Pochta" },
  ];

  return (
    // FIX: py-10 -> py-6 sm:py-10, kichik ekranda bo'sh joy kamaytirildi
    <div className="bg-[#f5f7fb] min-h-screen py-6 sm:py-10">
      {/* Toast */}
      <SuccessToast visible={showToast} onClose={() => setShowToast(false)} />

      {/* FIX: px-4 saqlanadi, lekin ichki konteynerlar endi mobil uchun moslashtirildi */}
      <div className="max-w-7xl mx-auto px-4">
        {/* FIX: text-3xl -> text-2xl sm:text-3xl, 360px da sarlavha siqilmaydi */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-6 sm:mb-8">
          Buyurtmani rasmiylashtirish
        </h1>

        {/* FIX: gap-8 -> gap-6 sm:gap-8, mobil ustunlar orasidagi bo'shliq kamaytirildi */}
        <form onSubmit={handleSubmit(onOrderSubmit)} className="flex flex-col lg:flex-row gap-6 sm:gap-8">

          {/* CHAP TOMON */}
          {/* FIX: p-8 -> p-4 sm:p-6 lg:p-8, 360px ekranda ortiqcha padding forma kengligini kichraytirib qo'ydi, shu sabab mobilda kamaytirildi */}
          <div className="flex-1 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm mb-5 sm:mb-6 text-gray-500">
              Hisobingiz bormi?{" "}
              <span className="text-blue-500 cursor-pointer hover:underline">Kirish</span>
            </p>

            <h2 className="text-base font-bold text-gray-800 mb-3">Yetkazib berish</h2>
            {/* FIX: grid-cols-3 -> grid-cols-1 sm:grid-cols-3.
                360px kenglikda 3 ustun "Yetkazib berish" kabi uzun matnni sig'dira olmaydi,
                shu sababli kichik ekranda variantlar vertikal joylashadi. */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              {deliveryOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 sm:py-3 cursor-pointer transition text-sm font-medium ${delivery === opt.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    className="accent-blue-600 shrink-0"
                    checked={delivery === opt.value}
                    onChange={() => setDelivery(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <h2 className="text-base font-bold text-gray-800 mb-3">To'lov</h2>
            {/* FIX: gap-4 -> gap-3 sm:gap-4 va flex-wrap qo'shildi, 360px da ikkita
                tugma yonma-yon sig'masa ham siqilib chiqib ketmaydi */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { value: "card", label: "Kartadan" },
                { value: "cash", label: "Naqd" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 border rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 cursor-pointer transition text-sm font-medium ${payment === opt.value
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
            {/* FIX: grid-cols-2 -> grid-cols-1 sm:grid-cols-2.
                360px da Ism/Familiya inputlari juda torayib ketardi, endi mobilda
                ustma-ust, kengroq ekranda yonma-yon joylashadi. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Ism"
                  {...register("name")}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                />
                {errors.name && <p className="text-red-500 text-[11px]">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Familiya"
                  {...register("surname")}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                />
                {errors.surname && <p className="text-red-500 text-[11px]">{errors.surname.message}</p>}
              </div>
            </div>

            {/* FIX: grid-cols-2 -> grid-cols-1 sm:grid-cols-2.
                PhoneInput (mamlakat kodi + raqam) 360px da yarim kenglikka sig'maydi
                va buzilib ko'rinardi, shu sababli mobilda to'liq kenglikda, ustma-ust joylashadi. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      containerStyle={{ width: "100%" }}
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
              {/* FIX: pt-6 mobilda olib tashlandi (sm:pt-6), chunki endi email
                  Telefon label'i bilan emas, alohida qatorda joylashadi va
                  ortiqcha bo'sh joy kerak emas. */}
              <div className="flex flex-col gap-1 sm:pt-6">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
                />
                {errors.email && <p className="text-red-500 text-[11px]">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* O'NG TOMON */}
          {/* FIX: w-full qo'shildi (lg:w-[400px] bilan birga), shunda mobilda
              ustun to'liq kenglikni egallashi aniq belgilanadi */}
          <div className="w-full lg:w-[400px]">
            <div
              ref={orderRef}
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-6"
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
                        className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        {/* FIX: w-16 h-16 -> w-14 h-14 sm:w-16 sm:h-16, 360px da rasm
                            biroz kichraytirildi, matn uchun joy bo'shatildi */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0 p-1.5">
                          <img src={item.image} alt={item.name} className="object-contain max-h-full max-w-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {item.quantity} dona × {item.price.toLocaleString()} so'm
                          </p>
                        </div>
                        <p className="text-[13px] sm:text-[14px] font-bold text-blue-600 whitespace-nowrap">
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
                    {/* FIX: items-end -> flex-wrap qo'shilmadi, lekin matn o'lchami
                        kichraytirildi (text-2xl -> text-xl sm:text-2xl) shunda
                        360px da summa va "so'm" yozuvi bir qatorga sig'adi */}
                    <div className="flex justify-between items-end gap-2">
                      <span className="text-base font-bold text-gray-800">Jami:</span>
                      <span className="text-xl sm:text-2xl font-black text-blue-600 text-right">
                        {order.finalTotal.toLocaleString()}{" "}
                        <span className="text-sm font-bold">so'm</span>
                      </span>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all uppercase text-xs tracking-[1.5px] sm:tracking-[2px] disabled:opacity-60"
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
            {/* FIX: text-2xl -> text-xl sm:text-2xl */}
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-5 sm:mb-6">Ko'p so'raladigan savollar</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left"
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
                    <div className="px-4 sm:px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
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