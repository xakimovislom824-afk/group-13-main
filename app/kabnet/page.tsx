"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Asosiy login va ma'lumotlar logikasi shu komponent ichida bo'ladi
function KabnetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL-dan hozirgi bo'limni olish (masalan: /kabnet?tab=orders)
  const currentTab = searchParams.get("tab") || "profile";

  // State-lar (O'zingizning loyihangizga moslab kengaytirishingiz mumkin)
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage yoki API-dan foydalanuvchi ma'lumotlarini yuklash
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Agar foydalanuvchi tizimga kirmagan bo'lsa, login sahifasiga yo'naltirish
      // router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Profil ma'lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[500px]">

        {/* Chap tomon: Navigatsiya menyusi */}
        <div className="bg-gray-900 text-white p-6 flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-400">Shaxsiy Kabinet</h2>
              <p className="text-xs text-gray-400 mt-1">{user?.phone || "Mehmon"}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => router.push("/kabnet?tab=profile")}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${currentTab === "profile" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
                  }`}
              >
                Mening profilim
              </button>
              <button
                onClick={() => router.push("/kabnet?tab=orders")}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${currentTab === "orders" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
                  }`}
              >
                Buyurtmalar tarixi
              </button>
              <button
                onClick={() => router.push("/kabnet?tab=settings")}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${currentTab === "settings" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
                  }`}
              >
                Sozlamalar
              </button>
            </nav>
          </div>

          {/* Chiqish tugmasi */}
          <button
            onClick={handleLogout}
            className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
          >
            Tizimdan chiqish
          </button>
        </div>

        {/* O'ng tomon: Tanlangan bo'lim kontenti */}
        <div className="col-span-1 md:col-span-3 p-8">
          {currentTab === "profile" && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Profil ma'lumotlari</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Ism / Familiya</label>
                  <p className="mt-1 text-gray-900 font-medium border-b pb-2">{user?.name || "Kiritilmagan"}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefon raqam</label>
                  <p className="mt-1 text-gray-900 font-medium border-b pb-2">{user?.phone || "Kiritilmagan"}</p>
                </div>
              </div>
            </div>
          )}

          {currentTab === "orders" && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Mening buyurtmalarim</h3>
              <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-400">
                Sizda hali buyurtmalar mavjud emas.
              </div>
            </div>
          )}

          {currentTab === "settings" && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Kabinet sozlamalari</h3>
              <p className="text-sm text-gray-500">Parolni o'zgartirish yoki profilni tahrirlash bo'limi.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Next.js build vaqtida useSearchParams() xato bermasligi uchun qobiq (Wrapper)
export default function KabnetPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-lg font-medium text-gray-600 animate-pulse">
            Kabinet yuklanmoqda...
          </div>
        </div>
      }
    >
      <KabnetContent />
    </Suspense>
  );
}