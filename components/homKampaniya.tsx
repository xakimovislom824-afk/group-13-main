"use client"
import Image from 'next/image'
import Link from 'next/link'
import Rasim8 from "../app/src/assets/imgs/haqida.png"

function homKampaniya() {
    return (
        <section className="relative w-full bg-gray-100 overflow-hidden py-16 lg:py-24">

            {/* Background Image */}
            <div className="absolute top-0 right-[-250px] hidden min-[769px]:block w-[1200px] h-full">
                <Image
                    src={Rasim8}
                    alt="Tools"
                    fill
                    priority
                    sizes="(max-width: 768px) 0vw, 1200px"
                    className="object-contain"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl px-6">
                <div className="max-w-2xl">
                    <h2 className="text-[32px] md:text-[42px] font-bold text-gray-900 mb-4 leading-tight">
                        Bizning do'konimiz haqida
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-10 text-[15px] md:text-[16px]">
                        Kompaniyamizning asosiy maqsadi — faqat qurilish va pardozlash
                        materiallarini sotish bilan cheklanmasdan, ta'mirlash jarayonida
                        yuzaga keladigan muammo va qiyinchiliklarni hal qiladigan xizmat
                        yaratishdir.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                        <div>
                            <h3 className="text-blue-600 font-bold text-[28px]">17 805,3m²</h3>
                            <p className="text-sm text-gray-500 mt-2 leading-6">savdo va ombor maydonlari</p>
                        </div>
                        <div>
                            <h3 className="text-blue-600 font-bold text-[28px]">50 000+</h3>
                            <p className="text-sm text-gray-500 mt-2 leading-6">mahsulot turlari</p>
                        </div>
                        <div>
                            <h3 className="text-blue-600 font-bold text-[28px]">2 500+</h3>
                            <p className="text-sm text-gray-500 mt-2 leading-6">doimiy mijozlar</p>
                        </div>
                        <div>
                            <h3 className="text-blue-600 font-bold text-[28px]">440</h3>
                            <p className="text-sm text-gray-500 mt-2 leading-6">tajribali xodimlar</p>
                        </div>
                    </div>

                    <p className="text-gray-600 leading-[1.9] mb-10 text-[15px] md:text-[16px]">
                        Biz allaqachon ikkinchi o'n yillikdan beri Sizning orzuyingizdagi
                        uy, zamonaviy ofis yoki shinam dala hovlini yaratishda yordam
                        berib kelmoqdamiz. Har qanday qurilish va dizayn g'oyalarini
                        minimal vaqt va mablag' bilan amalga oshirishga ko'maklashamiz.
                    </p>

                    <button className="bg-[#0b1a2b] text-white px-8 py-4 rounded-md text-sm font-semibold tracking-wide hover:bg-[#13263d] transition-all duration-300">
                        <Link href="/kompaneyaHaqida">
                            Kompaniya haqida →
                        </Link>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default homKampaniya