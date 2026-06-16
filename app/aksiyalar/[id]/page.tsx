"use client";
import Link from "next/link";
import React from "react";
import { useGetDiscountBySlugQuery, useGetDiscountsQuery } from "../../../services/discountApi";
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ image?: string }>;
}
const AktsiyaDetail = ({ params, searchParams }: PageProps) => {
  const { id: discountSlug } = React.use(params);
  const { image: cardImage } = React.use(searchParams);
  const { data: discount, isLoading: isDetailLoading, error: detailError } = useGetDiscountBySlugQuery(discountSlug);
    const { data: allDiscounts = [] } = useGetDiscountsQuery();
  if (isDetailLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center text-gray-500 font-medium">
        Yuklanmoqda...
      </div>
    );
  }
  if (detailError || !discount) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Aksiya topilmadi</h1>
        <p className="text-gray-400 text-sm mt-1">Yuborilgan kalit: {discountSlug}</p>
        <Link href="/aksiyalar" className="text-blue-500 underline mt-4 inline-block">
          Aksiyalar ro'yxatiga qaytish
        </Link>
      </div>
    );
  }
  const otherNews = allDiscounts.filter((item) => item.slug !== discountSlug);
  const publishedDate = discount.starts_at 
    ? new Date(discount.starts_at).toLocaleDateString("uz-UZ") 
    : "";
  const displayImage = cardImage ? decodeURIComponent(cardImage) : discount.image;
  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-10">
                <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#A0A4AB] mb-5">
          <Link href="/" className="hover:text-gray-700 transition">Stroymaterial</Link>
          <span>/</span>
          <Link href="/aksiyalar" className="hover:text-gray-700 transition">Aksiyalar</Link>
          <span>/</span>
          <h1 className="truncate max-w-[250px] text-gray-600 font-medium">{discount.title}</h1>
        </div>
        <h1 className="text-[26px] sm:text-[30px] md:text-[36px] leading-[34px] sm:leading-[38px] md:leading-[44px] font-bold text-[#2F3640] mb-5">   {discount.title} </h1>
        <div className="flex items-center gap-4 mb-6">
          <span className="uppercase text-[11px] font-bold text-[#2F3640] bg-[#F2F4F7] px-2.5 py-1 rounded-[4px] tracking-wide">   Aksiya </span>
          <span className="text-[13px] text-[#9AA0A6]">{publishedDate} kundan boshlab</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
                    <div className="w-full">
            <p className="text-[15px] md:text-[16px] leading-[26px] md:leading-[28px] text-[#555B65] mb-6 md:mb-8">
              {discount.summary}
            </p>
            <div className="overflow-hidden rounded-[12px] mb-6 md:mb-8 bg-[#F7F9FC] border flex items-center justify-center p-2 w-full h-[240px] sm:h-[360px] md:h-[460px] lg:h-[500px]">
              <img   src={displayImage || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"}   alt={discount.title}   className="w-full h-full object-contain" />
            </div>
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#2F3640] mb-4">   Biz sizga nimani taklif qilamiz: </h2>
            <p className="text-[15px] md:text-[16px] leading-[26px] md:leading-[28px] text-[#555B65] whitespace-pre-line mb-8">  {discount.content}</p>
            {discount.discount_percent && (
              <div className="bg-[#F5F8FF] border border-[#E2E8F5] rounded-[12px] p-5 inline-block mb-4">
                <p className="text-[14px] text-[#555B65] mb-1.5 font-medium">Aksiya bo'yicha chegirma:</p>
                <span className="text-[18px] md:text-[20px] font-bold text-[#1F6BFF] uppercase tracking-wider">   {discount.discount_percent}% CHEGIRMA </span>
              </div>
            )}
          </div>
          <div className="w-full space-y-8 lg:space-y-6">
            <div className="w-full">
              <h3 className="text-[18px] font-bold text-[#2F3640] mb-4 pb-2 border-b">
                Boshqa takliflar
              </h3>
              
              {otherNews.length === 0 ? (
                <p className="text-sm text-gray-400">Boshqa aksiyalar topilmadi.</p>
              ) : (                  
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
                  {otherNews.slice(0, 2).map((item) => (
                    <Link   key={item.id}   href={`/aksiyalar/${item.slug}?image=${encodeURIComponent(item.image)}`}   className="block group">
                      <div className="bg-[#F7F9FC] border rounded-[12px] overflow-hidden group-hover:shadow-sm transition duration-300">
                        <div className="w-full h-[160px] bg-white p-2 flex items-center justify-center">
                          <img  src={item.image}  alt={item.title}  className="w-full h-full object-contain group-hover:scale-103 transition duration-300"/>
                        </div>
                        <div className="p-4 bg-white border-t">
                          <h4 className="text-[14px] md:text-[15px] font-bold text-[#2F3640] line-clamp-2 group-hover:text-[#1F6BFF] transition">  {item.title}</h4>
                          {item.discount_percent && (
                            <div className="inline-block mt-2.5 bg-[#0A111A] text-white text-[10px] font-bold px-2 py-0.5 rounded-[3px]">   -{item.discount_percent}% GACHA </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-[#F7F9FC] rounded-[14px] p-6 border">
              <h3 className="text-[18px] font-bold text-[#2F3640] mb-2">Yangiliklarga obuna bo'ling</h3>
              <p className="text-[13px] leading-[19px] text-[#7A7F87] mb-4">  Eng so'nggi chegirmalar va aksiyalarni birinchilardan bo'lib oling.</p>
              <div className="space-y-3">
                <input  type="email"  placeholder="Email"  className="w-full h-[46px] rounded-[8px] border border-[#D9DEE5] px-4 outline-none text-sm bg-white focus:border-[#1F6BFF] transition"/>
                <button className="w-full h-[46px] rounded-[8px] bg-[#1F6BFF] text-white font-semibold hover:bg-blue-700 transition text-sm uppercase tracking-wider">  Obuna bo'lish</button>
              </div>
              <div className="flex items-start gap-2.5 mt-4">
                <input type="checkbox" id="agree-detail" className="mt-1 cursor-pointer accent-[#1F6BFF]" />
                <label htmlFor="agree-detail" className="text-[11px] leading-[15px] text-[#9AA0A6] cursor-pointer select-none">  Shaxsiy ma'lumotlarni qayta ishlash siyosatiga roziman</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AktsiyaDetail; 