"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Skitka2 from "../src/assets/imgs/skitka2.png";
import Skitka4 from "../src/assets/imgs/skitka4.png";
import r3 from "../src/assets/imgs/rasmuz3.png";
import r4 from "../src/assets/imgs/rasmuz4.png";
import r5 from "../src/assets/imgs/rasmuz5.png";
import r6 from "../src/assets/imgs/rasmuz6.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

          {/* 🔥 SLIDER SECTION */}
          <div className="relative mt-12 group">
            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[r5, r6, r3, r4].map((img, index) => (
                <div key={index} className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <Image
                    src={img}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-auto object-cover transform hover:scale-110 transition-transform duration-500"
                    width={300}
                    height={200}
                  />
                </div>
              ))}
            </div>

            {/* Chap tugma */}
            <button
              className="absolute left-[-12px] top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 border border-gray-100 rounded-full w-10 h-10 shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            {/* O'ng tugma */}
            <button
              className="absolute right-[-12px] top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 border border-gray-100 rounded-full w-10 h-10 shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* O'NG TARAF: Bannerlar va Obuna */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
          {/* Banners */}
          {[
            { img: Skitka2, title: "Bo'yoq va lak\nmahsulotlari" },
            { img: Skitka4, title: "Isitish\ntizimlari" },
          ].map((banner, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl h-48 cursor-pointer shadow-sm group"
              style={{
                backgroundImage: `url(${banner.img.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-white/10 group-hover:bg-black/5 transition-all p-6 flex flex-col justify-start">
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 whitespace-pre-line">
                  {banner.title}
                </h3>
                <span className="inline-block w-fit bg-[#001220] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                  -30% gacha
                </span>
              </div>
            </div>
          ))}

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