"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetNewsQuery } from "../../services/newsApi";
import { IBlog } from "../../Types/index.types";

export default function BlogPage() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages: number = 10; // API-dan keladigan sahifalar soniga qarab dinamik boshqarish mumkin
    const visiblePages: number = 5;
    
    const { data: newsData, isLoading, isError } = useGetNewsQuery();

    const handlePageChange = (page: number): void => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };     

    let startPage: number = Math.max(1, currentPage - 2);
    let endPage: number = startPage + visiblePages - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (isLoading) return <div className="text-center py-20 font-sans text-gray-500">Yuklanmoqda...</div>;
    if (isError) return <div className="text-center py-20 font-sans text-red-500">Xatolik yuz berdi.</div>;

    return (
        <div className="bg-[#F7F9FC] min-h-screen py-6 md:py-10 font-sans">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                
                <nav className="mb-4">
                    <p className="text-[13px] text-[#A0A4AB]">
                        <Link href="/" className="hover:text-gray-600">Stroyoptorg</Link> 
                        <span className="mx-2">/</span> 
                        <span className="text-gray-600 font-medium">Yangiliklar</span>
                    </p>
                </nav>

                <h1 className="text-[28px] md:text-[36px] font-bold text-[#2F3640] mb-6 md:mb-8">
                    Yangiliklar
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
                    
                    {/* Maqolalar ro'yxati (Dinamik) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
                        {newsData?.map((item: IBlog) => {
                            const itemImage = item.image || "/assets/images/placeholder.jpg";
                            return (
                                <Link 
                                    // Barcha kerakli ma'lumotlarni URL orqali dynamic detail sahifasiga uzatamiz
                                    href={`/blogDetail/${item.id}?title=${encodeURIComponent(item.title)}&image=${encodeURIComponent(itemImage)}&content=${encodeURIComponent(item.content || item.summary || '')}&date=${encodeURIComponent(item.published_at || '')}`} 
                                    key={item.id} 
                                    className="block group"
                                >
                                    <div className="flex flex-col h-full bg-white border border-gray-100 rounded-[12px] p-3 shadow-sm hover:shadow-md transition duration-300">
                                        <div className="bg-gray-50 relative h-[180px] w-full rounded-[8px] overflow-hidden mb-3.5 flex items-center justify-center p-1">
                                            <img
                                                src={itemImage}
                                                alt={item.title}
                                                className="w-full h-full object-contain group-hover:scale-103 transition duration-300"
                                            />
                                        </div>
                                        <h3 className="text-[15px] font-bold text-[#2F3640] leading-[20px] mb-2 group-hover:text-blue-600 transition line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-[13px] text-[#7A7F87] leading-[18px] mb-4 flex-grow line-clamp-2">
                                            {item.summary || item.content}
                                        </p>
                                        <span className="text-[11px] text-[#9AA0A6] uppercase font-semibold mt-auto tracking-wide">
                                            {item.published_at ? new Date(item.published_at).toLocaleDateString("uz-UZ") : ""}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
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
                            <h3 className="text-[16px] font-bold mb-1.5 text-[#2F3640] text-center">Yangiliklarga obuna bo'ling</h3>
                            <div className="space-y-2.5">
                                <input type="email" placeholder="Email" className="w-full border border-gray-200 rounded-[8px] px-4 h-[44px] text-[13px] outline-none focus:border-blue-500 bg-[#F7F9FC]" />
                                <button className="w-full bg-[#1F6BFF] hover:bg-blue-700 text-white font-bold text-[12px] h-[44px] rounded-[8px] uppercase tracking-wider transition">OBUNA BO'LISH</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}