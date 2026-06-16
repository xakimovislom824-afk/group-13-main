"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useForgotPasswordMutation } from "../../services/parolniTiklashApi";

const schema = z.object({
  email: z.string().email("To'g'ri email manzil kiriting"),
});

type FormData = z.infer<typeof schema>;

export default function ParolniTiklash() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setSuccess(true);
    } catch (error: any) {
      setServerError(
        error?.data?.email?.[0] ||
        error?.data?.detail ||
        error?.data?.message ||
        "Xatolik yuz berdi. Qayta urinib ko'ring."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Stroyoptorg</Link>
          <span>/</span>
          <Link href="/kirish" className="hover:text-blue-600 transition-colors">Kirish</Link>
          <span>/</span>
          <span className="text-gray-500">Parolni tiklash</span>
        </nav>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-10">

          {!success ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Mail size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Parolni tiklash</h1>
                  <p className="text-sm text-gray-400 mt-0.5">Emailingizga kod yuboramiz</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Ro'yxatdan o'tgan email manzilingizni kiriting. Parolni tiklash uchun
                tasdiqlash kodi yuboriladi.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-gray-600">
                    Email manzil <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="example@gmail.com"
                    className={`w-full border rounded-lg p-3.5 text-sm outline-none transition-all ${
                      errors.email
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                  )}
                </div>

                {serverError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold py-4 rounded-lg uppercase text-xs tracking-widest shadow-md transition-all disabled:opacity-50"
                >
                  {isLoading ? "YUBORILMOQDA..." : "KOD YUBORISH"}
                </button>
              </form>

              <Link
                href="/kirish"
                className="mt-6 flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={16} /> Kirishga qaytish
              </Link>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-5">
                <div className="p-4 bg-emerald-50 rounded-full text-emerald-500">
                  <CheckCircle size={48} strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Kod yuborildi!</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-2">
                <span className="font-semibold text-gray-700">{getValues("email")}</span> manziliga
                parolni tiklash kodi yuborildi.
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Spam papkasini ham tekshirib ko'ring.
              </p>
              <Link
                href="/kirish"
                className="inline-flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold px-8 py-3.5 rounded-lg uppercase text-xs tracking-widest transition-all"
              >
                <ArrowLeft size={16} /> Kirishga qaytish
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}