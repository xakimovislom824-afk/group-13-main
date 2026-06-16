"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, ChevronRight } from "lucide-react";
import { useLoginUserMutation } from "../../services/loginApi";

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Username, email yoki telefon raqami kiritilishi shart"),
  password: z
    .string()
    .min(5, "Parol kamida 5 ta belgidan iborat bo'lishi kerak"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser({
        username: data.identifier.trim(),
        password: data.password,
      }).unwrap();

      // Tokenlarni saqlash
      localStorage.setItem("access", response.access);
      localStorage.setItem("refresh", response.refresh);

      // ✅ User ma'lumotlarini saqlash (navbar username uchun)
      // response.user mavjud bo'lsa saqlaydi, bo'lmasa faqat username saqlaydi
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        // Kamida kirgan username ni saqlaymiz
        localStorage.setItem(
          "user",
          JSON.stringify({ username: data.identifier.trim() })
        );
      }

      if (data.rememberMe) {
        localStorage.setItem("remember_me", "true");
      }

      // ✅ Navbar darhol yangilansin — refresh kerak emas
      window.dispatchEvent(new Event("authChange"));

      router.push("/kabnet");
    } catch (error: any) {
      const errorMessage =
        error?.data?.detail ||
        error?.data?.message ||
        "Login yoki parol noto'g'ri!";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D2D2D] p-4 md:p-8 lg:p-12">
      <nav className="max-w-[1200px] mx-auto mb-6 text-[11px] md:text-xs text-gray-400 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Stroyoptorg
        </Link>
        <span>/</span>
        <span className="text-gray-500">Avtorizatsiya</span>
      </nav>

      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-10">
          Avtorizatsiya
        </h1>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row overflow-hidden">
          {/* Login */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-600">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("identifier")}
                  className={`w-full border rounded-lg p-3.5 text-sm outline-none transition-all ${errors.identifier
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  placeholder="Usernameni kiriting"
                />
                {errors.identifier && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-gray-600">
                  Parol <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className={`w-full border rounded-lg p-3.5 text-sm outline-none transition-all pr-12 ${errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      }`}
                    placeholder="Parolni kiriting"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="py-2">
                <Link
                  href="/parolniTiklash"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Parolni tiklash
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold py-4 rounded-lg uppercase text-xs tracking-widest shadow-md disabled:opacity-50"
              >
                {isLoading ? "KIRILMOQDA..." : "AVTORIZATSIYA"}
              </button>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register("rememberMe")}
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600"
                />
                <span className="text-sm text-gray-500">Meni eslab qol</span>
              </label>
            </form>
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-14 bg-[#FCFDFF] flex flex-col justify-start">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 bg-red-50 rounded-2xl text-red-500">
                <UserPlus size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Hali akkauntingiz yo'qmi?
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-gray-500 max-w-md">
              <p>
                <span className="font-bold text-gray-700">Ro'yxatdan o'tish</span>{" "}
                buyurtmalaringiz holatini kuzatish va xaridlar tarixini ko'rish imkonini beradi.
              </p>
              <p>
                Biz faqat xaridni amalga oshirish uchun zarur bo'lgan minimal
                ma'lumotlarni so'raymiz.
              </p>
            </div>

            <div className="mt-10">
              <Link href="/login" className="inline-block w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0B1320] hover:bg-black text-white px-10 py-4 rounded-lg uppercase text-[11px] font-bold tracking-[2px] transition-all group shadow-lg"
                >
                  RO'YXATDAN O'TISH
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}