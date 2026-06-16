"use client";

import { useState, useEffect } from "react"; // 👈 useEffect qo'shildi
import { Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  gallery?: string[];
  productName: string;
}

export default function ProductGallery({ gallery = [], productName }: ProductGalleryProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // ─── SKROLNI QOTIRISH (LOCK SCROLL) ──────────────────────────────────────────
  useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = "hidden"; // Modal ochilganda skrolni qotiradi
    } else {
      document.body.style.overflow = ""; // Yopilganda joyiga qaytaradi
    }

    // Komponent o'chganda (unmount) har ehtimolga qarshi skrolni ochib yuborish
    return () => {
      document.body.style.overflow = "";
    };
  }, [isZoomOpen]);
  // ─────────────────────────────────────────────────────────────────────────────

  const currentImg = gallery.length > 0 ? gallery[activeImg] : "";

  return (
    <>
      <div className="flex-1 flex items-center justify-center min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] p-5 relative bg-white">
        {currentImg && (
          <img
            src={currentImg}
            alt={productName}
            className="w-full max-w-[600px] max-h-[380px] border rounded-xl object-contain"
          />
        )}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-3 left-3 p-2 rounded-md bg-white/90 border border-slate-200 text-slate-500 hover:text-slate-700 transition shadow-sm"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-1 lg:pb-0 justify-start shrink-0">
        {gallery.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImg(i)}
            className={`w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-lg border-2 flex-shrink-0 bg-white overflow-hidden transition-all ${
              activeImg === i ? "border-blue-500 shadow-sm" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {isZoomOpen && currentImg && (
        <div className="fixed inset-0 z-[55000] bg-black/80 flex items-center justify-center">
          <div className="absolute inset-0" onClick={() => setIsZoomOpen(false)} />
          <div className="relative z-10 max-w-5xl w-full px-4">
            <img src={currentImg} alt={productName} className="w-full max-h-[85vh] object-contain rounded-xl" />
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-2 right-2 bg-white p-2 rounded-md hover:bg-slate-100 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}