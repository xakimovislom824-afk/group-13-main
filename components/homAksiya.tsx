"use client"

import Image from "next/image"
import { useGetProductsQuery } from "../services/productApi"

function homAksiya() {
    const { data: products = [], isLoading } = useGetProductsQuery()
    const featuredProducts = products.slice(0, 4)

    if (isLoading || featuredProducts.length === 0) {
        return <div className="w-full max-w-7xl mx-auto px-4 py-8 h-56 bg-slate-100" />
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredProducts.map((product) => (
                    <div key={product.id} className="relative overflow-hidden rounded-2xl h-48 bg-slate-100 cursor-pointer shadow-sm">
                        <Image src={product.image} alt={product.name} fill className="object-contain p-6" />
                        <div className="absolute inset-x-0 bottom-0 bg-white/90 p-4">
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                            <span className="text-xs text-blue-600 font-semibold">{product.price} $</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default homAksiya