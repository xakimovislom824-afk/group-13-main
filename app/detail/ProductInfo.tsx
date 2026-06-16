"use client";

import { useState } from "react";
import { Heart, CheckCircle, Truck, CreditCard, Package, GitCompare } from "lucide-react";

interface ProductInfoProps {
  mainProduct: {
    sku: string;
    price: number;
    oldPrice: number;
    discount: string;
  };
  detailSpecs: string[][];
  onAddCart: (qty: number) => void;
}

export default function ProductInfo({ mainProduct, detailSpecs, onAddCart }: ProductInfoProps) {
  const [qty, setQty] = useState(1);
  const fmt = (n: number) => n.toLocaleString("ru-RU");

  return (
    <>
      {/* Texnik ma'lumotlar paneli */}
      <div className="order-4 md:col-start-2 md:row-start-2 lg:col-start-6 lg:col-span-4 lg:row-start-1 w-full">
        <div className="space-y-3.5">
          {detailSpecs.map(([k, v]) => (
            <div key={k} className="flex items-baseline gap-2">
              <span className="text-[13px] text-slate-500 whitespace-nowrap">{k}</span>
              <div className="flex-1 border-b border-dotted border-slate-200" />
              <span className="text-[13px] text-slate-800 font-medium text-right">{v}</span>
            </div>
          ))}
        </div>
        <button className="text-blue-600 text-sm font-medium mt-4 hover:underline text-left block">
          Barcha xarakteristikalar
        </button>

        <div className="mt-6 border border-slate-100 rounded-xl p-5 space-y-4 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-sm text-slate-600"><CreditCard size={18} className="text-slate-400" /> Istalgan usulda to'lov qilish imkoniyati</div>
          <div className="flex items-center gap-3 text-sm text-slate-600"><Package size={18} className="text-slate-400" /> Katalogda keng assortiment mavjud</div>
          <div className="flex items-center gap-3 text-sm text-slate-600"><Truck size={18} className="text-slate-400" /> Tezkor yetkazib berish xizmati</div>
        </div>
      </div>

      {/* Narx paneli */}
      <div className="order-2 md:col-start-2 md:row-start-1 lg:col-start-10 lg:col-span-3 lg:row-start-1 lg:row-span-2 w-full border border-slate-100 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition">
        <p className="text-[11px] text-slate-400 mb-1.5">Artikul: {mainProduct.sku}</p>
        <p className="text-green-600 text-[13px] mb-4 flex items-center gap-1.5 font-medium"><CheckCircle size={14} /> Omborda mavjud</p>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-5">
          <span className="text-[32px] sm:text-[36px] font-bold text-blue-700 leading-none">{fmt(mainProduct.price)} ₽</span>
          <span className="line-through text-slate-400 text-sm">{fmt(mainProduct.oldPrice)} ₽</span>
          <span className="bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">{mainProduct.discount}</span>
        </div>

        <div className="flex items-center justify-between mb-5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 font-medium pl-1">Количество:</span>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600">−</button>
            <span className="font-semibold text-base px-2 text-slate-800">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600">+</button>
          </div>
        </div>

        <button onClick={() => onAddCart(qty)} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-[15px] shadow-sm">Savatga qo'shish</button>
        <button className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-blue-600 border border-slate-200/60 rounded-xl mt-3 font-medium text-[15px]">1 marta bosib sotib olish</button>

        <div className="flex justify-between mt-5 pt-4 border-t border-slate-100">
          <button className="text-slate-400 hover:text-rose-500 flex items-center gap-1.5 text-sm font-medium"><Heart size={18} /><span className="text-[13px]">В избранное</span></button>
          <button className="text-slate-400 hover:text-blue-500 flex items-center gap-1.5 text-sm font-medium"><GitCompare size={18} /><span className="text-[13px]">Сравнить</span></button>
        </div>
      </div>
    </>
  );
}