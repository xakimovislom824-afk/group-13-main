// app/verify/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyUserMutation } from "../../services/verifyApi";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
    
  const [form, setForm] = useState({ email: emailFromUrl, code: "" });
  const [verifyUser, { isLoading, error }] = useVerifyUserMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyUser(form).unwrap();
      router.push("/login");
    } catch (err: any) {
      alert(err?.data?.detail || "Kod noto'g'ri!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Emailni tasdiqlang</h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Emailingizga yuborilgan kodni kiriting
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg p-3.5 text-sm outline-none mt-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Email kiriting"
              required
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold text-gray-600">Kod</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full border rounded-lg p-3.5 text-sm outline-none mt-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Kodni kiriting"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {"data" in error ? (error.data as any)?.detail || "Xatolik!" : "Xatolik!"}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold py-4 rounded-lg uppercase text-xs tracking-widest disabled:opacity-50"
          >
            {isLoading ? "TEKSHIRILMOQDA..." : "TASDIQLASH"}
          </button>
        </form>
      </div>
    </div>
  );
}