"use client";

import { useState } from "react";

interface ProductTabsProps {
  specs: string[][];
}

export default function ProductTabs({ specs }: ProductTabsProps) {
  const [tab, setTab] = useState<"specs" | "about" | "delivery">("specs");

  const labels = {
    specs: "Xususiyatlari",
    about: "Mahsulot haqida",
    delivery: "Yetkazib berish va to'lov",
  };

  return (
    <div className="mt-12">
      <div className="flex gap-10 border-b border-slate-200 mb-12 overflow-x-auto">
        {(["specs", "about", "delivery"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-4 text-sm font-medium transition relative whitespace-nowrap ${
              tab === t ? "text-slate-900 font-bold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {labels[t]}
            {tab === t && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#e31e24]" />}
          </button>
        ))}
      </div>

      <div className="min-h-[280px] pb-16 text-[13px] text-slate-700 leading-relaxed">
        {tab === "specs" && (
          <div className="space-y-8">
            <h3 className="text-base font-bold text-slate-800">«MAKITA DF 347DWE14 V 1.5 A/sh akkumulyatorli drel-shurupovert» xususiyatlari</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 max-w-7xl">
              {[specs.slice(0, Math.ceil(specs.length / 2)), specs.slice(Math.ceil(specs.length / 2))].map((half, idx) => (
                <div key={idx} className="flex flex-col">
                  {half.map(([k, v]) => (
                    <div key={k} className="flex justify-between items-baseline py-3">
                      <span className="text-slate-500 bg-white pr-2 relative z-10">{k}</span>
                      <div className="flex-1 border-b border-dotted border-slate-300 mx-1 relative top-[-4px]" />
                      <span className="text-slate-800 font-medium bg-white pl-2 relative z-10 text-right">{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl">
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-base font-bold text-slate-800">«MAKITA DF 347DWE14 V 1.5 A/sh akkumulyatorli drel-shurupovert» haqida</h3>
              <p>Akkumulyatorli drel-shurupovert <strong className="font-bold text-slate-900">Makita DF347DWE</strong> mebel yig'ish, binolar ichida va ko'chada ta'mirlash ishlarida qo'llaniladi...</p>
            </div>
          </div>
        )}

        {tab === "delivery" && (
          <div className="max-w-5xl space-y-8">
            <h3 className="text-base font-bold text-slate-800">Yetkazib berish va To'lov</h3>
            <p>Biz siz xarid qilgan mahsulotni har doim sizga qulay bo'lgan vaqtda yetkazib berishga tayyormiz...</p>
          </div>
        )}
      </div>
    </div>
  );
}