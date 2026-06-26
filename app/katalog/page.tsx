"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Asosiy kontent qismi (useSearchParams shu yerda ishlaydi)
function KatalogContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Katalog sahifasi
        </h1>
        {search && (
          <p className="mb-4 text-gray-600">
            Qidiruv natijasi: <span className="font-semibold">"{search}"</span>
          </p>
        )}

        {/* Katalog sahifangizning UI elementlari va ro'yxatlari shu yerga joylashadi */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-500">Mahsulotlar yuklanmoqda yoki bu yerda ko'rinadi...</p>
        </div>
      </div>
    </div>
  );
}

// Next.js static build xatoligini oldini olish uchun Suspense bilan o'raymiz
export default function KatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-lg font-medium text-gray-600 animate-pulse">
            Katalog yuklanmoqda...
          </div>
        </div>
      }
    >
      <KatalogContent />
    </Suspense>
  );
}