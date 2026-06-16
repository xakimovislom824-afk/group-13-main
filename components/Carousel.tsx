"use client"
import Image from "next/image"
import { useState } from "react"
import BgRasim from "../app/src/assets/imgs/Rectangle 38.png"
import BgRasim2 from "../app/src/assets/imgs/carusel.png"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
    {
        img: BgRasim,
        alt: "Elektr asboblari",
        title: "Har qanday ehtiyoj uchun elektr asboblari",
        desc: "Bizda santexnika, vanna xonasi uchun mebellar, shuningdek, boshqa barcha turdagi qurilish mahsulotlari assortimenti yangilandi.",
    },
    {
        img: BgRasim2,
        alt: "Qurilish mollari",
        title: "Har qanday ehtiyoj uchun qurilish mollari",
        desc: "Bizda santexnika, vanna xonasi uchun mebellar, shuningdek, boshqa barcha turdagi qurilish mahsulotlari assortimenti yangilandi.",
    },
];

function Carousell() {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

    return (
        <section className="relative mb-6 md:mb-12 overflow-hidden">
            <div className="relative w-full h-[360px] sm:h-[380px] md:h-[460px] lg:h-[540px]">

                {/* Rasmlar */}
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-opacity duration-500 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    >
                        <Image
                            src={slide.img}
                            alt={slide.alt}
                            fill
                            priority={i === 0}
                            className="object-cover object-[70%_center] sm:object-center"
                        />
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/60 sm:via-black/20 sm:to-transparent" />
                    </div>
                ))}

                {/* Matn — mobilda pastda, katta ekranda chapda */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end sm:justify-center pb-14 sm:pb-0 px-5 sm:px-10 md:px-16 lg:px-20">
                    <div className="max-w-xs sm:max-w-md lg:max-w-lg text-white">
                        <h2 className="font-bold leading-tight uppercase text-xl sm:text-3xl md:text-4xl lg:text-5xl">
                            {slides[current].title}
                        </h2>
                        <p className="hidden sm:block mt-3 md:mt-4 text-gray-200 text-sm md:text-base leading-relaxed">
                            {slides[current].desc}
                        </p>
                        <Link href="/katalog" className="inline-block mt-4 md:mt-8">
                            <button className="bg-[#001220] text-white rounded-md flex items-center gap-2 hover:bg-gray-800 transition-all font-medium uppercase tracking-wide text-xs md:text-sm px-5 py-2.5 md:px-8 md:py-4">
                                Mahsulotlarga o&apos;tish
                                <ChevronRight size={16} />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ← tugma */}
                <button
                    onClick={prev}
                    className="absolute left-2 sm:left-4 top-42 sm:top-62 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-white/40 backdrop-blur-sm border border-black text-black flex items-center justify-center transition-all"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* → tugma */}
                <button
                    onClick={next}
                    className="absolute right-2 sm:right-4 top-40 sm:top-60 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-white/40 backdrop-blur-sm border border-black text-black flex items-center justify-center transition-all"
                >
                    <ChevronRight size={18} />
                </button>

                {/* Dot indikatorlar — pastda markazda */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`rounded-full transition-all duration-300 ${i === current
                                ? "w-5 h-2 bg-white"
                                : "w-2 h-2 bg-white/50 hover:bg-white/80"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Carousell