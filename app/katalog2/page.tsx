"use client";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
function FilterContent() {
  return (
    <div className="select-none">
      <h1 className="text-2xl font-bold mb-8 text-[#0f172a] hidden lg:block">  Elektr asbob-uskunalari</h1>
      <div className="mb-10">
        <h3 className="font-bold mb-4 text-sm text-gray-950">Narxi, soʻm</h3>
        <div className="flex gap-2 mb-4">
          <div className="w-1/2 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <span className="text-xs text-gray-400 mr-1">dan</span>
            <input   type="text"   defaultValue="3 000"   readOnly   className="w-full text-sm outline-none bg-transparent font-medium text-gray-800" />
          </div>
          <div className="w-1/2 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <span className="text-xs text-gray-400 mr-1">gacha</span>
            <input   type="text"   defaultValue="52 500"   readOnly   className="w-full text-sm outline-none bg-transparent font-medium text-gray-800" />
          </div>
        </div>
        <input  type="range"  min="3000"  max="52500"  defaultValue="52500"  className="w-full h-1 accent-blue-600 cursor-pointer"/>
      </div>
      <div className="mb-10 border-b border-gray-100 pb-6">
        <h3 className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950">          Mahsulot turi <ChevronDown className="w-4 h-4 text-gray-400" />        </h3>
        <div className="space-y-3.5">
          {["Toʻplam", "Takko (Shtativ)", "Adapter", "Ushlagich", "Filtr"].map(
            (item, i) => (
              <label  key={item}  className="flex items-center gap-3 cursor-pointer">
                <input     type="checkbox"     defaultChecked={i === 0}     className="w-4 h-4 accent-blue-600 rounded border-gray-300"   />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ),
          )}
        </div>
        <button className="text-xs text-blue-600 font-medium mt-4 hover:underline block">     Barchasini koʻrsatish   </button>
      </div>
      <div className="mb-10 border-b border-gray-100 pb-6">
        <h3 className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950">   Brend <ChevronDown className="w-4 h-4 text-gray-400" /> </h3>
        <div className="space-y-3.5">
          {["STAYER", "HOMEPROFEE", "RESANTA", "MAKITA", "HUNTER"].map(
            (item) => (
              <label   key={item}   className="flex items-center gap-3 cursor-pointer" >
                <input    type="checkbox"    defaultChecked={item === "MAKITA"}    className="w-4 h-4 accent-blue-600 rounded border-gray-300"  />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ),
          )}
        </div>
        <button className="text-xs text-blue-600 font-medium mt-4 hover:underline block">   Barchasini koʻrsatish </button>
      </div>
      {/* 4. Material */}
      <div className="mb-10 border-b border-gray-100 pb-6">
        <h3 className="font-bold mb-5 flex justify-between items-center text-sm text-gray-950">  Material <ChevronDown className="w-4 h-4 text-gray-400" /></h3>
        <div className="space-y-3.5">
          {["Latun", "Mis", "Metall", "Metall, plastik", "Qogʻoz"].map(
            (item) => (
              <label  key={item}  className="flex items-center gap-3 cursor-pointer">
                <input   type="checkbox"   className="w-4 h-4 accent-blue-600 rounded border-gray-300" />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ),
          )}
        </div>
        <button className="text-xs text-blue-600 font-medium mt-4 hover:underline block">          Barchasini koʻrsatish        </button>
      </div>

      {/* 5. Yopiq akkordeon qatorlar */}
      {["Rangi", "Uzunligi, mm", "Kengligi, mm", "Balandligi, mm"].map(
        (label) => (
          <div  key={label}  className="flex justify-between items-center py-4 border-t border-gray-100 font-medium text-sm text-gray-800 cursor-pointer hover:text-blue-600">
            {label} <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        ),
      )}
      <br />
      {/* 6. Reklama bannerlari */}
      <div className="space-y-4 mb-6">
        <div className="relative overflow-hidden rounded-2xl h-48 cursor-pointer shadow-sm border border-gray-100 bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent p-5 flex flex-col justify-between">
            <h3 className="text-lg font-bold text-gray-950 leading-tight">  Isitish tizimi uchun <br /> barcha narsalar</h3>
            <span className="inline-block w-fit bg-[#001220] text-white text-xs font-bold px-2.5 py-1 rounded-md">  -30% gacha</span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl h-48 cursor-pointer shadow-sm border border-gray-100 bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent p-5 flex flex-col justify-between">
            <h3 className="text-lg font-bold text-gray-950 leading-tight">    Lakka boʻyoq <br /> materiallari  </h3>
            <span className="inline-block w-fit bg-[#001220] text-white text-xs font-bold px-2.5 py-1 rounded-md">   -30% gacha </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileFilterDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer paneli */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[90vw] bg-white z-50 shadow-2xl
          transition-transform duration-300 ease-in-out flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sarlavha */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <span className="text-base font-bold text-gray-900">Filtrlar</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Yopish"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
          <FilterContent />
        </div>
        <div className="px-4 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm py-3 rounded-xl transition-all tracking-wide"
          >
            FILTRLARNI QOʻLLASH
          </button>
        </div>
      </div>
    </>
  );
}

function DesktopSidebar() {
  return (
    <aside className="sticky top-28 z-30 w-[300px] h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-thin">
      <FilterContent />
    </aside>
  );
}
function Katalog2() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div>
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 transition-colors"
        >
          {" "}
          <SlidersHorizontal className="w-4 h-4" /> Filtrlani koʻrsatish
        </button>
      </div>
      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
    </div>
  );
}

export default Katalog2;
