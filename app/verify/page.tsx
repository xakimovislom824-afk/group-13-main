"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Asosiy kontent qismi
function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Masalan: /verify?token=123456 yoki /verify?email=test@test.com
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Tasdiqlash</h1>

        {email && (
          <p className="text-sm text-gray-600 mb-2">
            Yuborilgan manzil: <span className="font-medium">{email}</span>
          </p>
        )}

        {/* Kodni kiritish inputlari yoki tasdiqlash tugmalari shu yerda bo'ladi */}
        <div className="mt-6">
          <p className="text-xs text-gray-400">
            Agar sahifa yuklanib qolsa, tokenni tekshiring.
          </p>
        </div>
      </div>
    </div>
  );
}

// Build xatoligini tuzatuvchi asosiy eksport wrapper
export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-lg font-medium text-gray-600 animate-pulse">
            Xavfsiz ulanish o'rnatilmoqda...
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}