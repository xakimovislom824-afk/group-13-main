"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Skitka2 from "../src/assets/imgs/skitka2.png";
import Skitka4 from "../src/assets/imgs/skitka4.png";

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

export default function TulovSahifasi() {
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
    <div className="max-w-[1200px] mx-auto px-4 py-6 font-sans text-[#333]">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-gray-400 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="hover:text-blue-600 cursor-pointer transition-colors">Stroyoptorg</span>
        <span>/</span>
        <span className="text-gray-500">To'lov usullari</span>
      </nav>
      <div className="flex flex-col lg:flex-row gap-10">

        {/* CHAP TARAF: Barcha matnlar (To'liq saqlangan) */}

        <div className="flex-1 text-[14px] leading-[1.6]">

          {/* Section 1 */}

          <section className="mb-8">

            <h2 className="text-[18px] font-bold mb-4">Yetkazib berishda to'lov</h2>

            <p className="mb-4 text-gray-700">

              Saytda to'lov tizimi yordamida bank kartasi orqali. Buyurtmani

              rasmiylashtirishda "To'lov" bo'limida biz Sizni to'lov sahifasiga

              yo'naltiramiz, u yerda bank kartangiz ma'lumotlarini (raqami, amal

              qilish muddati, karta egasining ismi) ko'rsatishingiz kerak bo'ladi.

              Barcha ma'lumotlarni kiritganingizdan so'ng "To'lov" tugmasini bosing.

            </p>

            <p className="mb-4 text-gray-700">

              Bank kartasi yordamida to'lovni amalga oshirish uchun tegishli sahifada

              "Buyurtmani bank kartasi orqali to'lash" tugmasini bosish kerak. To'lov

              quyidagi to'lov tizimlarining bank kartalari orqali amalga oshiriladi:

            </p>

            <ul className="list-none space-y-1 ml-4 mb-4">

              <li className="flex items-center gap-2 text-red-600 font-bold">

                • <span className="text-gray-700 font-normal">UZCARD / HUMO</span>

              </li>

              <li className="flex items-center gap-2 text-red-600 font-bold">

                • <span className="text-gray-700 font-normal">VISA International</span>

              </li>

              <li className="flex items-center gap-2 text-red-600 font-bold">

                • <span className="text-gray-700 font-normal">Mastercard Worldwide</span>

              </li>

              <li className="flex items-center gap-2 text-red-600 font-bold">

                • <span className="text-gray-700 font-normal">JCB</span>

              </li>

            </ul>

            <p className="mb-2 text-gray-700">

              <span className="font-bold">Naqd pulda</span> buyurtmani qabul qilishda haydovchiga to'lanadi.

            </p>

            <p className="mb-2 text-gray-700">

              Bizning menejerimiz sizga qo'ng'iroq qiladi va buyurtmani qabul qilish

              uchun qulay vaqtni kelishib oladi. Tayyorlangan buyurtma omborda sizni kutadi.

            </p>

            <p className="text-gray-700 italic">

              Yetkazib berish narxi tovarning o'lchamlari va masofaga qarab

              belgilanadi va buyurtma summasiga qo'shimcha ravishda qo'shiladi.

            </p>

          </section>
          {/* Section 2 */}

          <section className="mb-8">

            <h2 className="text-[18px] font-bold mb-4">O'zi olib ketishda (Samovivoz)</h2>

            <ul className="list-none space-y-2 ml-4">

              <li className="flex items-start gap-2 text-red-600 font-bold">

                • <span className="text-gray-700 font-normal">Saytda to'lov tizimi orqali yoki qabul qilish punktida kassa orqali bank kartasi bilan.</span>

              </li>

              <li className="flex items-start gap-2 text-red-600 font-bold">

                • <span className="text-gray-700 font-normal">Qabul qilish punktida kassa orqali naqd pulda.</span>

              </li>

              <li className="flex items-start gap-2 text-red-600 font-bold">

                • <span className="text-gray-700 font-normal">Buyurtmani qabul qilishda mahsulotni diqqat bilan ko'zdan kechirishingizni, tashqi nuqsonlar va butunligini tekshirishingizni so'raymiz.</span>

              </li>

            </ul>

          </section>
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

          {/* Obuna Formasi (Zod bilan) */}
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
        </div>
      </div>
    </div>
  );
}