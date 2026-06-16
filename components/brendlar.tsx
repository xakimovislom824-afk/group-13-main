import React from 'react'
import { Card } from './ui/card'
import Image from 'next/image'

// Rasmlarni import qilish
import Rasim1 from "../app/src/assets/imgs/image 17.png"
import Rasim2 from "../app/src/assets/imgs/image 19.png"
import Rasim3 from "../app/src/assets/imgs/image 18.png"
import Rasim4 from "../app/src/assets/imgs/image 17.png" // Bu rasm 1 bilan bir xil ekan
import Rasim5 from "../app/src/assets/imgs/image 20.png"
import Rasim6 from "../app/src/assets/imgs/image 21.png"
import Rasim7 from "../app/src/assets/imgs/image 23.png"

const images = [Rasim1, Rasim2, Rasim3, Rasim4, Rasim5, Rasim6, Rasim7];

function Brendlar() {
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
                    {/* Birinchi nusxa */}
                    {images.map((img, index) => (
                        <Card key={`first-${index}`} className="w-40 h-25 m-2 flex-shrink-0 flex items-center justify-center rounded-xl bg-white border-none shadow-sm p-4">
                            <Image
                                src={img}
                                alt="brand-logo"
                                className="object-contain w-full h-full transition-all duration-300"
                            />
                        </Card>
                    ))}
                    {/* Ikkinchi nusxa (uzluksiz ulanish uchun) */}
                    {images.map((img, index) => (
                        <Card key={`second-${index}`} className="w-40 h-25 m-2 flex-shrink-0 flex items-center justify-center rounded-xl bg-white border-none shadow-sm p-4">
                            <Image
                                src={img}
                                alt="brand-logo"
                                className="object-contain w-full h-full  transition-all duration-300"
                            />
                        </Card>
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