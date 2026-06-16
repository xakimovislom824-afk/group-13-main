import Skitka from "../app/src/assets/imgs/skitka.png"
import Skitka2 from "../app/src/assets/imgs/skitka2.png"
import Skitka3 from "../app/src/assets/imgs/skitka3.png"
import Skitka4 from "../app/src/assets/imgs/skitka4.png"

function homAksiya() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* 1. Metiz buyumlari */}
                <div
                    className="relative overflow-hidden rounded-2xl h-48 cursor-pointer shadow-sm"
                    style={{
                        backgroundImage: `url(${Skitka.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    {/* Matn o'qilishi uchun yengil oqish qatlam (optional) */}
                    <div className="absolute inset-0 bg-white/20 p-6 flex flex-col justify-start">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                            Metiz <br /> buyumlari
                        </h3>
                        <span className="inline-block w-fit bg-[#001220] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                            -15% gacha
                        </span>
                    </div>
                </div>
                {/* 2. Bo'yoq va lak */}
                <div
                    className="relative overflow-hidden rounded-2xl h-48 cursor-pointer shadow-sm"
                    style={{
                        backgroundImage: `url(${Skitka2.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className="absolute inset-0 bg-white/20 p-6 flex flex-col justify-start">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                            Bo'yoq va lak <br /> mahsulotlari
                        </h3>
                        <span className="inline-block w-fit bg-[#001220] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                            -30% gacha
                        </span>
                    </div>
                </div>

                {/* 3. Pol qoplamalari */}
                <div
                    className="relative overflow-hidden rounded-2xl h-48 cursor-pointer shadow-sm"
                    style={{
                        backgroundImage: `url(${Skitka3.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className="absolute inset-0 bg-white/20 p-6 flex flex-col justify-start">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                            Pol <br /> qoplamalari
                        </h3>
                        <span className="inline-block w-fit bg-[#001220] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                            -25% gacha
                        </span>
                    </div>
                </div>

                {/* 4. Isitish tizimlari */}
                <div
                    className="relative overflow-hidden rounded-2xl h-48 cursor-pointer shadow-sm"
                    style={{
                        backgroundImage: `url(${Skitka4.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className="absolute inset-0 bg-white/20 p-6 flex flex-col justify-start">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                            Isitish <br /> tizimlari
                        </h3>
                        <span className="inline-block w-fit bg-[#001220] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                            -30% gacha
                        </span>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default homAksiya