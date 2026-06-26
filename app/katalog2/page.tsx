"use client";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Sikitka from "../src/assets/imgs/skitka2.png";
import Sikitka2 from "../src/assets/imgs/skitka4.png";

function Katalog2() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    mahsulotTuri: true,
    brend: true,
    material: true,
    rangi: false,
    uzunligi: false,
    kengligi: false,
    balandligi: false,
  });

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const filterContent = (
    <div className="select-none">
      <h1 className="text-2xl font-bold mb-8 text-[#0f172a] hidden lg:block">
        {" "}
        Elektr asbob-uskunalari
      </h1>

      {/* Narxi */}
      <div className="mb-10">
        <h3 className="font-bold mb-4 text-sm text-gray-950">Narxi, soʻm</h3>
        <div className="flex gap-2 mb-4">
          <div className="w-1/2 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <span className="text-xs text-gray-400 mr-1">dan</span>
            <input
              type="text"
              inputMode="numeric"
              defaultValue="3 000"
              className="w-full text-sm outline-none bg-transparent font-medium text-gray-800"
            />
          </div>
          <div className="w-1/2 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <span className="text-xs text-gray-400 mr-1">gacha</span>
            <input
              type="text"
              inputMode="numeric"
              defaultValue="500 000"
              className="w-full text-sm outline-none bg-transparent font-medium text-gray-800"
            />
          </div>
        </div>
        <input
          type="range"
          min="3000"
          max="500000"
          defaultValue="500000"
          className="w-full h-1 accent-blue-600 cursor-pointer"
        />
      </div>

      {/* Mahsulot turi */}
      <div className="mb-10 border-b border-gray-100 pb-6">
        <button
          type="button"
          onClick={() => toggleSection("mahsulotTuri")}
          className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950 w-full text-left"
        >
          Mahsulot turi
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openSections.mahsulotTuri ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.mahsulotTuri ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="space-y-3.5">
            {["Toʻplam", "Takko (Shtativ)", "Adapter", "Ushlagich", "Filtr"].map(
              (item, i) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={i === 0}
                    className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ),
            )}
          </div>
          <button className="text-xs text-blue-600 font-medium mt-4 hover:underline block">
            Barchasini koʻrsatish
          </button>
        </div>
      </div>

      {/* Brend */}
      <div className="mb-10 border-b border-gray-100 pb-6">
        <button
          type="button"
          onClick={() => toggleSection("brend")}
          className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950 w-full text-left"
        >
          Brend
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openSections.brend ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.brend ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="space-y-3.5">
            {["STAYER", "HOMEPROFEE", "RESANTA", "MAKITA", "HUNTER"].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item === "MAKITA"}
                  className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
          <button className="text-xs text-blue-600 font-medium mt-4 hover:underline block">
            Barchasini koʻrsatish
          </button>
        </div>
      </div>

      {/* Material */}
      <div className="mb-10 border-b border-gray-100 pb-6">
        <button
          type="button"
          onClick={() => toggleSection("material")}
          className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950 w-full text-left"
        >
          Material
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openSections.material ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.material ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="space-y-3.5">
            {["Latun", "Mis", "Metall", "Metall, plastik", "Qogʻoz"].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
          <button className="text-xs text-blue-600 font-medium mt-4 hover:underline block">
            Barchasini koʻrsatish
          </button>
        </div>
      </div>

      {/* Rangi */}
      <div className="mb-10">
        <button
          type="button"
          onClick={() => toggleSection("rangi")}
          className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950 w-full text-left"
        >
          Rangi
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openSections.rangi ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.rangi ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="space-y-3.5 pb-2">
            {["Qora", "Oq", "Kulrang", "Koʻk", "Qizil"].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Uzunligi */}
      <div className="mb-10">
        <button
          type="button"
          onClick={() => toggleSection("uzunligi")}
          className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950 w-full text-left"
        >
          Uzunligi, mm
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openSections.uzunligi ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.uzunligi ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex gap-2 pb-2">
            <input
              type="number"
              placeholder="dan"
              className="w-1/2 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"
            />
            <input
              type="number"
              placeholder="gacha"
              className="w-1/2 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Kengligi */}
      <div className="mb-10">
        <button
          type="button"
          onClick={() => toggleSection("kengligi")}
          className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950 w-full text-left"
        >
          Kengligi, mm
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openSections.kengligi ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.kengligi ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex gap-2 pb-2">
            <input
              type="number"
              placeholder="dan"
              className="w-1/2 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"
            />
            <input
              type="number"
              placeholder="gacha"
              className="w-1/2 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Balandligi */}
      <div className="mb-10">
        <button
          type="button"
          onClick={() => toggleSection("balandligi")}
          className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950 w-full text-left"
        >
          Balandligi, mm
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openSections.balandligi ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.balandligi ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex gap-2 pb-2">
            <input
              type="number"
              placeholder="dan"
              className="w-1/2 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"
            />
            <input
              type="number"
              placeholder="gacha"
              className="w-1/2 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>
      </div>

      <br />

      {/* Reklama bannerlari */}
      <div className="space-y-4 mb-6">
        <div className="relative rounded-lg overflow-hidden shadow-sm border border-gray-100 cursor-pointer group">
          <div className="relative h-48 sm:h-52">
            <Image
              src={Sikitka}
              alt="Isitish tizimi"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-1/2 left-5 -translate-y-1/2 max-w-[140px]">
              <h3 className="font-bold text-[16px] sm:text-[18px] leading-tight mb-2 text-gray-800">
                Isitish tizimi uchun barcha narsalar
              </h3>
              <span className="bg-[#1A202C] text-white text-[10px] px-2 py-1 font-bold rounded-sm uppercase">
                -30% gacha
              </span>
            </div>
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden shadow-sm border border-gray-100 cursor-pointer group">
          <div className="relative h-48 sm:h-52">
            <Image
              src={Sikitka2}
              alt="Bo'yoqlar"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-1/2 left-5 -translate-y-1/2 max-w-[140px]">
              <h3 className="font-bold text-[16px] sm:text-[18px] leading-tight mb-2 text-gray-800">
                Lok-bo'yoq materiallari
              </h3>
              <span className="bg-[#1A202C] text-white text-[10px] px-2 py-1 font-bold rounded-sm uppercase">
                -30% gacha
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Mobil — filtr ochish tugmasi */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 transition-colors"
        >
          {" "}
          <SlidersHorizontal className="w-4 h-4" /> Filtrlani koʻrsatish
        </button>
      </div>

      {/* Mobil — overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${drawerOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Mobil — drawer paneli */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[90vw] bg-white z-50 shadow-2xl
          transition-transform duration-300 ease-in-out flex flex-col
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <span className="text-base font-bold text-gray-900">Filtrlar</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Yopish"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
          {filterContent}
        </div>
        <div className="px-4 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm py-3 rounded-xl transition-all tracking-wide"
          >
            FILTRLARNI QOʻLLASH
          </button>
        </div>
      </div>

      {/* Desktop — sidebar */}
      <div className="hidden lg:block">
        <aside className="sticky top-28 z-30 w-[300px] h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-thin">
          {filterContent}
        </aside>
      </div>
    </div>
  );
}

export default Katalog2;