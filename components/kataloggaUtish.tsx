"use client"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useGetCatalogQuery } from "../services/catalogApi"

const BASE_URL = "https://deployminigroup13.pythonanywhere.com"

function kataloggaUtish() {
    const { data, isLoading } = useGetCatalogQuery()
    const categories = data?.katalog || []

    return (
        <div className="grid grid-cols-2 m-5 sm:grid-cols-4 lg:grid-cols-8 gap-3">

            {isLoading
                ? [...Array(7)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-square rounded-xl" />
                    </div>
                ))
                : categories.map((cat, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="aspect-square bg-[#F3F4F6] rounded-xl flex flex-col items-center justify-center p-4 transition-all group-hover:shadow-md  border border-transparent">
                                <div className="w-16 h-16 rounded-lg mb-3 shadow-sm flex items-center justify-center overflow-hidden relative">
                                    <Image
                                        src={`${BASE_URL}${cat.image}`}
                                        alt={cat.title}
                                        fill
                                        sizes="64px"
                                        // className="object-contain p-1"
                                    />  
                                </div>
                                <span className="text-[11px] font-semibold text-center text-gray-800 leading-tight">
                                    {cat.title}
                                </span>
                            </div>
                        </div>
                ))
            }

            {/* Katalogga o'tish */}
            <div className="group cursor-pointer">
                <div className="aspect-square bg-white border border-gray-100 rounded-xl flex flex-col items-center justify-center p-4 transition-all hover:shadow-md hover:border-blue-200">
                    <Link href="/katalog" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-50">
                        <ChevronRight className="text-gray-400 group-hover:text-blue-500" />
                    </Link>
                    <span className="text-[11px] font-bold text-center text-gray-800">Katalogga o'tish</span>
                </div>
            </div>

        </div>
    )
}

export default kataloggaUtish