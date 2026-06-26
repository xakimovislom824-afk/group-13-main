"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="w-full sm:w-64 py-4 bg-[#F5F7F9] text-[#1E74D2] font-bold text-[11px] uppercase tracking-[2px] hover:bg-gray-100 transition-all rounded-sm"
    >
      Orqaga qaytish
    </button>
  );
}