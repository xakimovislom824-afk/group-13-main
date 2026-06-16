"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetNewsQuery } from "../../../services/newsApi";
import { IBlog } from "../../../Types/index.types";

interface BlogDetailProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ 
    title?: string; 
    image?: string; 
    content?: string; 
    date?: string; 
  }>;
}

export default function BlogDetail({ params, searchParams }: BlogDetailProps) {
  const { id } = React.use(params);
  const { title, image, content, date } = React.use(searchParams);
  
  const { data: newsData } = useGetNewsQuery();

  // Hydration xatoligini oldini olish uchun mount holatini tekshiramiz
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentTitle = title ? decodeURIComponent(title) : "Yangiliklar";
  const currentImage = image ? decodeURIComponent(image) : "/assets/images/placeholder.jpg";
  const currentContent = content ? decodeURIComponent(content) : "";
  
  // Sanani formatlash
  const currentDate = date ? new Date(decodeURIComponent(date)).toLocaleDateString("uz-UZ") : "";

  const filteredSuggestions = newsData?.filter((item: IBlog) => String(item.id) !== id) || [];

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-6 md:py-10 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <nav className="mb-5 text-[13px] text-[#A0A4AB]">
          <Link href="/" className="hover:text-gray-600">Stroyoptorg</Link> 
          <span className="mx-2">/</span> 
          <Link href="/blog" className="hover:text-gray-600">Yangiliklar</Link> 
          <span className="mx-2">/</span> 
          <span className="text-gray-600 font-medium">Batafsil</span>
        </nav>

        {/* Asosiy Grid Tizimi */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          
          {/* Asosiy Kontent Bloki */}
          <div className="bg-white p-4 md:p-8 rounded-[12px] border border-gray-100 shadow-sm w-full">
            <h1 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold text-[#2F3640] leading-tight mb-4">
              {currentTitle}
            </h1>

            <div className="flex items-center gap-4 mb-6 text-[12px] text-[#9AA0A6]">
              <span className="text-[#1F6BFF] font-bold uppercase tracking-wider bg-[#F5F8FF] px-2 py-0.5 rounded">Nashr</span>
              {/* 
                TUZATISH: Komponent faqat client-side'da to'liq yuklangandan (mounted) keyin 
                sanani ko'rsatadi, bu esa Hydration xatoligini butunlay yo'q qiladi.
              */}
              {isMounted && currentDate && <span className="font-medium">{currentDate}</span>}
            </div>

            {/* Rasm */}
            <div className="w-full h-[220px] sm:h-[320px] md:h-[420px] bg-[#F7F9FC] border relative rounded-[12px] overflow-hidden mb-6 flex items-center justify-center p-2">
              <img
                src={currentImage}
                alt={currentTitle}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Matn */}
            <div className="text-[15px] md:text-[16px] text-[#555B65] leading-[26px] md:leading-[28px] whitespace-pre-line">
              {currentContent}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="bg-white rounded-[12px] p-5 md:p-6 border border-gray-100 shadow-sm h-full">
              <h3 className="text-[16px] font-bold mb-4 text-[#2F3640] border-b pb-2">Bo'limlar</h3>
              <ul className="space-y-3.5">
                <li className="flex justify-between items-center text-[11px] font-bold text-blue-600 uppercase border-b border-blue-100 pb-1 cursor-pointer">
                  <span>BARCHA NASHRLAR</span>
                  <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px]">{newsData?.length || 0}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-[12px] p-5 md:p-6 border border-gray-100 shadow-sm">
              <h3 className="text-[15px] font-bold mb-2 text-[#2F3640] text-center">Yangiliklarga obuna bo'ling</h3>
              <div className="space-y-2.5">
                <input type="email" placeholder="Email" className="w-full border border-gray-200 rounded-[8px] px-4 h-[44px] text-[13px] outline-none focus:border-blue-500 bg-[#F7F9FC]" />
                <button className="w-full bg-[#1F6BFF] text-white font-bold text-[12px] h-[44px] rounded-[8px] uppercase tracking-wider hover:bg-blue-700 transition">OBUNA BO'LISH</button>
              </div>
            </div>
          </div>

        </div>

        {/* Dinamik Slider */}
        {filteredSuggestions.length > 0 && (
          <div className="mt-12 md:mt-16 border-t pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] md:text-[26px] font-bold text-[#2F3640]">Boshqa yangiliklar:</h2>
              <div className="flex gap-2">
                <button className="p-2 border rounded-full bg-white hover:bg-gray-50 shadow-sm transition active:scale-95">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 border rounded-full bg-white hover:bg-gray-50 shadow-sm transition active:scale-95">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredSuggestions.slice(0, 4).map((item: IBlog) => {
                const toggledImage = item.image || "/assets/images/placeholder.jpg";
                return (
                  <Link 
                    key={item.id}
                    href={`/blog/${item.id}?title=${encodeURIComponent(item.title)}&image=${encodeURIComponent(toggledImage)}&content=${encodeURIComponent(item.content || item.summary || '')}&date=${encodeURIComponent(item.published_at || '')}`}
                    className="flex flex-col bg-white border border-gray-100 rounded-[12px] p-3 shadow-sm hover:shadow-md transition group duration-300"
                  >
                    <div className="relative h-[160px] w-full bg-[#F7F9FC] rounded-[8px] overflow-hidden mb-3 flex items-center justify-center p-1">
                      <img
                        src={toggledImage}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-103 transition duration-300"
                      />
                    </div>
                    <h3 className="text-[14px] md:text-[15px] font-bold text-[#2F3640] leading-snug mb-1.5 line-clamp-2 group-hover:text-[#1F6BFF] transition">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-[#7A7F87] leading-normal mb-3 line-clamp-2 flex-grow">
                      {item.summary || item.content}
                    </p>
                    <span className="text-[10px] text-[#9AA0A6] uppercase font-bold tracking-wider mt-auto">
                      {/* Pastdagi slider kartalarida ham xatolik chiqmasligi uchun isMounted qo'shildi */}
                      {isMounted && item.published_at ? new Date(item.published_at).toLocaleDateString("uz-UZ") : ""}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}