import React from 'react'
import Image from 'next/image'
import { useGetProductsQuery } from '../services/productApi'

function Brendlar() {
    const { data: products = [], isLoading, isError, refetch } = useGetProductsQuery()
    const brands = Array.from(
        new Map(
            products
                .filter((product) => product.brand)
                .map((product) => [product.brand, product])
        ).values()
    )

    if (isLoading) {
        return <div aria-label="Brendlar yuklanmoqda" aria-busy="true" className="bg-muted py-10 px-6 rounded-xl h-40 animate-pulse" />
    }

    if (isError) {
        return <div role="alert" className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground"><p>Brendlarni yuklab bo&apos;lmadi.</p><button type="button" onClick={() => void refetch()} className="mt-2 font-semibold text-primary hover:underline">Qayta urinish</button></div>
    }

    if (brands.length === 0) return null

    return (
        <div className="bg-muted py-10 px-6 rounded-xl overflow-hidden">
            {/* Sarlavha */}
            <h2 className="text-2xl font-semibold mb-6">
                Mashhur brendlar
            </h2>

            {/* Asosiy konteyner */}
            <div className="relative flex overflow-hidden group">
                {/* Animatsiya qismi (Ikki marta aylantiramiz) */}
                <div className="flex space-x-6 animate-scroll whitespace-nowrap">
                    {[...brands, ...brands].map((product, index) => (
                        <div key={`${product.brand}-${index}`} className="w-40 h-25 m-2 flex-shrink-0 flex items-center gap-3 rounded-xl bg-white shadow-sm p-3">
                            <Image
                                src={product.image}
                                alt={`${product.brand} mahsuloti`}
                                width={52}
                                height={52}
                                unoptimized
                                className="h-12 w-12 shrink-0 rounded-md object-contain"
                            />
                            <span className="whitespace-normal text-sm font-semibold leading-tight text-slate-700">{product.brand}</span>
                        </div>
                    ))}
                </div>

                {/* Animatsiya uchun CSS (Buni global CSS ga yoki shu yerga qo'shish mumkin) */}
                <style jsx>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-scroll {
                        display: flex;
                        width: max-content;
                        animation: scroll 30s linear infinite;
                    }
                    .animate-scroll:hover {
                        animation-play-state: paused;
                    }
                `}</style>
            </div>
        </div>
    )
}

export default Brendlar;
