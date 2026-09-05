"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetDeliveryQuery } from "../../services/deliveryApi";

// 1. Zod sxemasi
const subscribeSchema = z.object({
  subscribeEmail: z
    .string()
    .min(1, "Email kiritilishi shart")
    .email("Noto'g'ri email format"),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "Rozilik berish shart",
  }),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

function YetkazibBerish() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  // API orqali yetkazib berish usullarini olish
  const { data: deliveryMethods, isLoading, isError } = useGetDeliveryQuery();

  // 2. React Hook Form sozlamalari
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      subscribeEmail: "",
      privacyConsent: false,
    },
  });

  const onSubscribe = async (data: SubscribeFormData) => {
    console.log("Obuna ma'lumotlari:", data);
    await new Promise((res) => setTimeout(res, 1000));
    setIsSubscribed(true);
    reset();
  };

  return (
    <div className="bg-[#f7f9fc] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg border text-sm text-gray-600 leading-6">
          <h1 className="text-2xl font-bold text-black mb-4">Yetkazib berish</h1>

          <p>
            Biz har doim siz xarid qilgan mahsulotni siz uchun qulay usulda yetkazib berishga tayyormiz.
          </p>

          <p className="mt-2">
            Yetkazib berish narxi mahsulot og‘irligi, hajmi va manzilga bog‘liq.
            Yetkazib berish ish kunlari amalga oshiriladi.
          </p>

          <p className="mt-4 font-semibold text-black">
            Quyidagi yetkazib berish usullari mavjud:
          </p>

          <div className="mt-3 space-y-6">
            {isLoading && <p className="text-gray-500">Yuklanmoqda...</p>}
            {isError && <p className="text-red-500">Ma'lumotlarni yuklashda xatolik yuz berdi.</p>}
            
            {deliveryMethods &&
              deliveryMethods.map((method, index) => (
                <div key={method.id || index} className="border-b border-gray-100 pb-4 last:border-0">
                  <p className="font-semibold text-black">
                    {index + 1}. {method.name}
                  </p>
                  <p className="mt-1 text-gray-600">{method.description}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <p>
                      <span className="font-medium text-gray-700">Narxi:</span> {method.price} so'm
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Yetkazib berish vaqti:</span> {method.delivery_days?.toString()} kun
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Holati:</span>{" "}
                      {method.is_active ? (
                        <span className="text-green-600 font-medium">Faol</span>
                      ) : (
                        <span className="text-red-500 font-medium">Faol emas</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>

        </div>

        {/* O'NG TARAF: Bannerlar va Obuna */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
          {/* Obuna Formasi */}
          <div className="bg-[#F8F9FA] p-6 rounded-md border border-gray-100 shadow-sm">
            <h4 className="text-[15px] font-bold mb-2 uppercase">Yangiliklarga obuna bo'ling</h4>
            <p className="text-[12px] text-gray-500 mb-4 leading-snug">
              Doimiy chegirmalar va kompaniya yangiliklaridan xabardor bo'ling.
            </p>

            {isSubscribed ? (
              <div className="text-green-600 text-sm font-medium py-2">
                Muvaffaqiyatli obuna bo'ldingiz!
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubscribe)}>
                <div className="mb-3">
                  <input
                    {...register("subscribeEmail")}
                    type="text"
                    placeholder="Email"
                    className={`w-full border p-3 rounded-sm text-[13px] outline-none transition-all ${
                      errors.subscribeEmail ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500 bg-white"
                    }`}
                  />
                  {errors.subscribeEmail && (
                    <p className="text-red-500 text-[10px] mt-1">{errors.subscribeEmail.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2472d1] text-white font-bold py-3 rounded-sm text-[12px] uppercase tracking-wider hover:bg-blue-700 transition-colors active:scale-[0.98]"
                >
                  Obuna bo'lish
                </button>

                <div className="mt-4">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      {...register("privacyConsent")}
                      className="mt-1 accent-blue-600"
                    />
                    <label
                      htmlFor="privacy"
                      className={`text-[10px] leading-tight cursor-pointer select-none ${
                        errors.privacyConsent ? "text-red-500 font-medium" : "text-gray-400"
                      }`}
                    >
                      Maxfiylik siyosatiga muvofiq shaxsiy ma'lumotlarni qayta ishlashga roziman.
                    </label>
                  </div>
                  {errors.privacyConsent && (
                    <p className="text-red-500 text-[10px] mt-1">{errors.privacyConsent.message}</p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default YetkazibBerish;