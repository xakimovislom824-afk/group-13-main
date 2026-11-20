"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useGetDiscountsQuery } from "../../services/discountApi";

const pageSize = 12;

const Aksiyalar = () => {
  const { data: discounts = [], isLoading, isError, refetch } = useGetDiscountsQuery();
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(discounts.length / pageSize);
  const pageDiscounts = discounts.slice(page * pageSize, (page + 1) * pageSize);
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Yuklanmoqda...
      </div>
    );
  }
  if (isError) {
    return (
      <div role="alert" className="w-full min-h-screen flex flex-col items-center justify-center gap-3 text-red-500 font-medium">
        <p>Ma&apos;lumotlarni yuklashda xatolik yuz berdi.</p>
        <button type="button" onClick={() => void refetch()} className="text-primary underline underline-offset-4">Qayta urinib ko&apos;rish</button>
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
        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">{discounts.length} ta chegirmali mahsulot</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-y-10">
          {pageDiscounts.map((item) => (
            <div key={item.id} className="flex flex-col h-full group">
              <div className="relative w-full h-[180px] md:h-[200px] rounded-[12px] overflow-hidden bg-[#F7F9FC] mb-4 flex items-center justify-center p-2">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    unoptimized
                    className="object-contain group-hover:scale-105 transition duration-300"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-sm text-gray-400">Rasm mavjud emas</span>
                )}
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

        {pageCount > 1 && (
          <nav aria-label="Aksiyalar sahifalash" className="mt-8 flex items-center justify-center gap-4">
            <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} className="rounded-lg border border-border bg-card px-4 py-2 disabled:opacity-50">Oldingi</button>
            <span aria-live="polite" className="text-sm text-muted-foreground">{page + 1} / {pageCount}</span>
            <button type="button" disabled={page + 1 >= pageCount} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} className="rounded-lg border border-border bg-card px-4 py-2 disabled:opacity-50">Keyingi</button>
          </nav>
        )}

        <div className="mt-16 md:mt-24 bg-[#F7F9FC] rounded-[16px] p-6 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-[450px]">
            <h3 className="text-[18px] md:text-[20px] font-bold text-[#2F3640] mb-2">Yangiliklarga obuna bo&apos;ling</h3>
            <p className="text-[13px] leading-[20px] text-[#7A7F87]">   Muntazam chegirmalar, maxsus takliflar va kompaniya yangiliklaridan birinchilardan bo&apos;lib xabardor bo&apos;ling. </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:max-w-[600px]">
            <input  type="email"  placeholder="Elektron pochta (Email)"  className="flex-grow h-[48px] rounded-[8px] border border-[#D9DEE5] px-4 outline-none text-sm bg-white focus:border-[#1F6BFF] transition"/>
            <button className="h-[48px] px-8 rounded-[8px] bg-[#1F6BFF] text-white font-semibold hover:bg-blue-700 transition text-sm whitespace-nowrap uppercase tracking-wide">   Obuna bo&apos;lish </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Aksiyalar;
