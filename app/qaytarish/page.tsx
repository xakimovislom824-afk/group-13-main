"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";



// Loyihangizdagi rasm yo'llari
import vozrat1 from "../src/assets/imgs/skitka2.png";
import vozrat2 from "../src/assets/imgs/skitka4.png";

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
export default function Qaytarish() {
  const [isSubscribed, setIsSubscribed] = useState(false);

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
    <div className="min-h-screen bg-white font-sans text-[#2D2D2D]">
      {/* Yuqori ko'k chiziq va Breadcrumbs */}
      <div className="w-full border-t-[3px] border-[#1A73E8]">
        <div className="max-w-310 mx-auto px-4 py-3 flex items-center gap-2 text-[11px] text-gray-400">
          <Link href="/" className="hover:text-blue-500 border-b border-dotted border-gray-400 leading-none tracking-tight">Stroyoptorg</Link>
          <span className="text-gray-300">::</span>
          <span className="border-b border-dotted border-gray-400 leading-none tracking-tight text-gray-400">Qaytarish</span>
        </div>
      </div>

      <main className="max-w-310 mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">

        {/* CHAP TOMON: ASOSIY MATN */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#1A202C] mb-6">Qaytarish</h1>

          <div className="space-y-5 text-[14px] leading-[1.6] text-[#333]">
            <p>
              Tegishli sifatdagi tovarni qaytarish yoki almashtirish xarid qilingan paytdan boshlab <strong>14 kun</strong> ichida, iste'molchilar huquqlarini himoya qilish to'g'risidagi qonunga muvofiq, tovar ko'rinishi va xususiyatlari saqlangan holda hamda quyidagi hujjatlar mavjud bo'lganda amalga oshiriladi:
            </p>

            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1.5">•</span>
                <span>xaridni va to'lovni tasdiqlovchi hujjatlar;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1.5">•</span>
                <span>shaxsni tasdiqlovchi hujjat.</span>
              </li>
            </ul>

            <p>Buning uchun omborlarimiz yoki savdo markazlarimizning ish vaqtida kelib, qaytarishni rasmiylashtirish kifoya.</p>
            <p>Tovarni qadoqsiz qaytarish mumkin, biroq barcha butlovchi qismlari va iste'mol xususiyatlari saqlangan bo'lishi shart.</p>
            <p>Bank kartasi orqali to'langan mablag'lar aynan o'sha kartaga qaytariladi.</p>
            <p>Yetkazib berish bilan buyurtma qilinganda, tovar topshirilgunga qadar undan voz kechishingiz mumkin. Agar mashina manzilga chiqib ketgan bo'lsa, yetkazib berish xarajatlaridan tashqari tovar qiymati qaytariladi.</p>

            <div className="pt-4">
              <h3 className="font-bold text-gray-800 mb-3 uppercase text-[13px] tracking-tight">Qaytarish bo'yicha cheklovlar</h3>
              <p>Biz individual xususiyatlarga ega bo'lgan tovarlarni qaytara olmaymiz, agar ushbu tovar faqat uni sotib olgan iste'molchi tomonidan ishlatilishi mumkin bo'lsa.</p>
              <p className="mt-3">Masalan: maxsus buyurtma qilingan tovarlar, rang berilgan (kolerovka) bo'yoqlar, metrga sotiladigan qurilish materiallari, arzonlashtirilgan tovarlar va barcha turdagi buyurtma asosidagi materiallar.</p>
            </div>

            {/* KAFOLAT BO'LIMI (Accordion) */}
            <div className="pt-8 space-y-px">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Kafolat bo'yicha murojaat</h3>

              <div className="border-t border-gray-100 py-4 flex justify-between items-center cursor-pointer">
                <span className="text-[14px]">Kafolat muddati davomida nosozlik yuz berganda qayerga murojaat qilish kerak?</span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#EBF5FF] text-[#1A73E8] rounded-full text-lg font-light">+</span>
              </div>

              <div className="border-t border-gray-100 py-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[14px]">Kafolat muddati davomida nosozlik yuz berganda qayerga murojaat qilish kerak?</span>
                  <span className="w-6 h-6 flex items-center justify-center bg-[#EBF5FF] text-[#1A73E8] rounded-full text-lg font-light">−</span>
                </div>
                <p className="text-[13px] text-gray-500 pl-2 leading-relaxed italic">Tovarni pullik diagnostika qilish va ta'mirlash amalga oshiriladi.</p>
              </div>

              <div className="border-t border-gray-100 py-4 flex justify-between items-center cursor-pointer">
                <span className="text-[14px]">Kafolatli ta'mirlash mavjudmi?</span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#EBF5FF] text-[#1A73E8] rounded-full text-lg font-light">−</span>
              </div>

              <div className="border-y border-gray-100 py-4 flex justify-between items-center cursor-pointer text-gray-400">
                <span className="text-[14px]">Kafolat muddati qancha?</span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#EBF5FF] text-[#1A73E8] rounded-full text-lg font-light">−</span>
              </div>
            </div>
          </div>
        </div>

        {/* O'NG TOMON: SIDEBAR */}
        <aside className="w-full lg:w-87.5 space-y-6">

          {/* Card 1 */}
          <div className="relative group cursor-pointer border border-gray-50 rounded-sm overflow-hidden shadow-sm">
            <div className="relative h-55">
              <Image src={vozrat1} alt="Isitish tizimlari" fill className="object-cover" />
              <div className="absolute top-1/2 left-6 -translate-y-1/2 max-w-35">
                <h3 className="font-bold text-[18px] leading-tight mb-2 text-gray-800">Isitish tizimlari uchun hammasi</h3>
                <span className="bg-[#1A202C] text-white text-[10px] px-2 py-1 font-bold rounded-sm uppercase">-30% gacha</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative group cursor-pointer border border-gray-50 rounded-sm overflow-hidden shadow-sm">
            <div className="relative h-55">
              <Image src={vozrat2} alt="Bo'yoqlar" fill className="object-cover" />
              <div className="absolute top-1/2 left-6 -translate-y-1/2 max-w-35">
                <h3 className="font-bold text-[18px] leading-tight mb-2 text-gray-800">Lok-bo'yoq materiallari</h3>
                <span className="bg-[#1A202C] text-white text-[10px] px-2 py-1 font-bold rounded-sm uppercase">-30% gacha</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-md border border-gray-100 shadow-sm">
            <h4 className="text-[15px] font-bold mb-2 uppercase">Yangiliklarga obuna bo'ling</h4>
            <p className="text-[12px] text-gray-500 mb-4 leading-snug">
              Doimiy chegirmalar va kompaniya yangiliklaridan xabardor bo'ling.
            </p>

            {isSubscribed ? (
              <div className="text-green-600 text-sm font-medium py-2">Muvaffaqiyatli obuna bo'ldingiz!</div>
            ) : (
              <form onSubmit={handleSubmit(onSubscribe)}>
                <div className="mb-3">
                  <input
                    {...register("subscribeEmail")}
                    type="text"
                    placeholder="Email"
                    className={`w-full border p-3 rounded-sm text-[13px] outline-none transition-all ${errors.subscribeEmail ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500 bg-white'
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
                      className={`text-[10px] leading-tight cursor-pointer select-none ${errors.privacyConsent ? 'text-red-500 font-medium' : 'text-gray-400'
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

        </aside>
      </main>
    </div>
  );
}