"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetNewsQuery } from '../services/newsApi' // ✅ path ni o'zgartiring

function HomYanglik() {
    const [current, setCurrent] = useState(0)
    const { data: allNews = [], isLoading } = useGetNewsQuery()

    const yangiliklar = allNews.slice(0, 4)
    const total = yangiliklar.length

    if (isLoading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="w-full h-44 rounded-xl bg-gray-200 mb-4" />
                            <div className="h-4 bg-gray-200 rounded mb-2" />
                            <div className="h-3 bg-gray-100 rounded mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    if (yangiliklar.length === 0) return null

    return (
        <section className="max-w-7xl mx-auto px-4 py-10 font-sans">

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">So'nggi yangiliklar</h2>
                <Link
                    href="/blog"
                    className="bg-[#f0f4f8] text-[#0066cc] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition hidden sm:block"
                >
                    Barcha yangiliklar
                </Link>
            </div>

            {/* Desktop: 4 li grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {yangiliklar.map(item => (
                    <Link
                        key={item.id}
                        href={`/blogDetail/${item.id}?title=${encodeURIComponent(item.title)}&image=${encodeURIComponent(item.image || '')}&content=${encodeURIComponent(item.content || item.summary || '')}&date=${encodeURIComponent(item.published_at || '')}`}
                        className="flex flex-col group"
                    >
                        <div className="relative w-full h-44 rounded-xl mb-4 overflow-hidden bg-gray-100">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                                    Rasm yo'q
                                </div>
                            )}
                        </div>
                        <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                            {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {item.summary || item.content}
                        </p>
                        <span className="text-xs text-gray-400">
                            {item.published_at
                                ? new Date(item.published_at).toLocaleDateString('uz-UZ')
                                : ""}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Mobil: slider */}
            <div className="sm:hidden">
                <Link
                    href={`/blogDetail/${yangiliklar[current]?.id}`}
                    className="block"
                >
                    <div className="flex flex-col">
                        <div className="relative w-full h-48 rounded-xl mb-4 overflow-hidden bg-gray-100">
                            {yangiliklar[current]?.image ? (
                                <Image
                                    src={yangiliklar[current].image}
                                    alt={yangiliklar[current].title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                                    Rasm yo'q
                                </div>
                            )}
                        </div>
                        <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-2">
                            {yangiliklar[current]?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            {yangiliklar[current]?.summary || yangiliklar[current]?.content}
                        </p>
                        <span className="text-xs text-gray-400">
                            {yangiliklar[current]?.published_at
                                ? new Date(yangiliklar[current].published_at).toLocaleDateString('uz-UZ')
                                : ""}
                        </span>
                    </div>
                </Link>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setCurrent(prev => Math.max(prev - 1, 0))}
                        disabled={current === 0}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setCurrent(prev => Math.min(prev + 1, total - 1))}
                        disabled={current === total - 1}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex justify-center gap-2 mt-3">
                    {yangiliklar.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-blue-600 w-4" : "bg-gray-300 w-2"
                                }`}
                        />
                    ))}
                </div>

                <div className="flex justify-center mt-6">
                    <Link
                        href="/blog"
                        className="text-[#0066cc] text-sm font-semibold border border-gray-200 px-6 py-2 rounded-lg hover:bg-blue-50 transition"
                    >
                        Ko'proq yangiliklar
                    </Link>
                </div>
            </div>

        </section>
    )
}

export default HomYanglik