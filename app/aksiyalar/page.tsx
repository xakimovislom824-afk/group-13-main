"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useGetDiscountsQuery } from "../../services/discountApi";
const Aksiyalar = () => {
  const { data: discounts = [], isLoading, error } = useGetDiscountsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Yuklanmoqda...
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500 font-medium">
        Ma'lumotlarni yuklashda xatolik yuz berdi.
      </div>
    );
  }
  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex items-center gap-2 text-[13px] text-[#A0A4AB] mb-4">
          <Link href="/" className="hover:text-gray-700 transition">   Qurilish mollari </Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">Aksiyalar</span>
        </div>
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#2F3640] mb-8 md:mb-10">   Aksiyalar </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-y-10">
          {discounts.map((item) => (
            <div key={item.id} className="flex flex-col h-full group">
              <div className="relative w-full h-[180px] md:h-[200px] rounded-[12px] overflow-hidden bg-[#F7F9FC] mb-4 flex items-center justify-center p-2">
                <img  src={item.image}  alt={item.title}  className="w-full h-full object-contain group-hover:scale-105 transition duration-300"/>
                {item.discount_percent && (
                  <div className="absolute bottom-3 left-3 bg-[#0A111A] text-white text-[11px] font-bold px-2.5 py-1 rounded-[4px] uppercase tracking-wide">  -{item.discount_percent}% gacha</div>
                )}
              </div>
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-[15px] md:text-[16px] font-bold leading-[22px] text-[#2F3640] line-clamp-2 mb-3 group-hover:text-[#1F6BFF] transition duration-200">  {item.title}</h3>
                </div>
                <Link  href={`/aksiyalar/${item.slug}?image=${encodeURIComponent(item.image || "")}`}  className="text-[13px] font-medium text-[#1F6BFF] hover:text-blue-700 transition underline underline-offset-4 decoration-1 mt-auto">  Aksiya haqida batafsil</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 bg-[#F7F9FC] rounded-[16px] p-6 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-[450px]">
            <h3 className="text-[18px] md:text-[20px] font-bold text-[#2F3640] mb-2">Yangiliklarga obuna bo'ling</h3>
            <p className="text-[13px] leading-[20px] text-[#7A7F87]">   Muntazam chegirmalar, maxsus takliflar va kompaniya yangiliklaridan birinchilardan bo'lib xabardor bo'ling. </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:max-w-[600px]">
            <input  type="email"  placeholder="Elektron pochta (Email)"  className="flex-grow h-[48px] rounded-[8px] border border-[#D9DEE5] px-4 outline-none text-sm bg-white focus:border-[#1F6BFF] transition"/>
            <button className="h-[48px] px-8 rounded-[8px] bg-[#1F6BFF] text-white font-semibold hover:bg-blue-700 transition text-sm whitespace-nowrap uppercase tracking-wide">   Obuna bo'lish </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Aksiyalar;