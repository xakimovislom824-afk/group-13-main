"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, ChevronRight } from "lucide-react";
import { useRegisterUserMutation } from "../../services/registerApi";

// =========================
// ZOD SCHEMA
// =========================

const registerSchema = z
  .object({
    username: z.string().min(3, "Username kamida 3 ta belgi bo'lishi kerak"),
    email: z
      .string()
      .min(1, "Email kiritilishi shart")
      .email("Noto'g'ri email format"),
    first_name: z.string().min(2, "Ism kiritilishi shart"),
    last_name: z.string().min(2, "Familiya kiritilishi shart"),
    password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string().min(6, "Parolni tasdiqlash shart"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Shartlarga rozilik berish shart",
    }),
    privacyAccepted: z.boolean().refine((val) => val === true, {
      message: "Maxfiylik siyosatiga rozilik berish shart",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar mos kelmadi",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// =========================
// COMPONENT
// =========================

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { termsAccepted, privacyAccepted, confirmPassword, ...registerData } = data;
      await registerUser(registerData).unwrap();
      alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
    } catch (error: any) {
      alert(error?.data?.message || "Xatolik yuz berdi. Qayta urinib ko'ring!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D2D2D] p-4 md:p-8 font-sans">
      {/* Breadcrumb */}
      <nav className="max-w-[1200px] mx-auto mb-6 text-[12px] text-gray-400">
        <Link href="/" className="hover:text-blue-600">
          Stroyoptorg
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-500">Ro'yxatdan o'tish</span>
      </nav>

      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">
          Ro'yxatdan o'tish
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden">

          {/* ===== CHAP TOMON (FORMA) ===== */}
          <div className="w-full lg:w-[65%] p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* USERNAME + EMAIL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("username")}
                    placeholder="Username kiriting"
                    className={`w-full border rounded-lg p-3 text-sm outline-none transition-all ${
                      errors.username
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-[11px]">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("email")}
                    placeholder="Email kiriting"
                    className={`w-full border rounded-lg p-3 text-sm outline-none transition-all ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[11px]">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* FIRST NAME + LAST NAME */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-gray-700">
                    Ism <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("first_name")}
                    placeholder="Ismingizni kiriting"
                    className={`w-full border rounded-lg p-3 text-sm outline-none transition-all ${
                      errors.first_name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-[11px]">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-gray-700">
                    Familiya <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("last_name")}
                    placeholder="Familiyangizni kiriting"
                    className={`w-full border rounded-lg p-3 text-sm outline-none transition-all ${
                      errors.last_name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-[11px]">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              {/* PASSWORDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-gray-700">
                    Parol <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPass ? "text" : "password"}
                      placeholder="Parol kiriting"
                      className={`w-full border rounded-lg p-3 text-sm outline-none pr-10 transition-all ${
                        errors.password
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[11px]">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-gray-700">
                    Parolni tasdiqlash <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="Parolni tasdiqlang"
                      className={`w-full border rounded-lg p-3 text-sm outline-none pr-10 transition-all ${
                        errors.confirmPassword
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-[11px]">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* CHECKBOXES */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register("termsAccepted")}
                      className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-[12px] text-gray-500 group-hover:text-gray-700 transition-colors">
                      Xizmat ko'rsatish shartlariga roziman
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-red-500 text-[11px] ml-7">
                      {errors.termsAccepted.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register("privacyAccepted")}
                      className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-[12px] text-gray-500 group-hover:text-gray-700 transition-colors">
                      Maxfiylik siyosatiga roziman
                    </span>
                  </label>
                  {errors.privacyAccepted && (
                    <p className="text-red-500 text-[11px] ml-7">
                      {errors.privacyAccepted.message}
                    </p>
                  )}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold py-4 rounded-lg uppercase text-xs tracking-widest transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                {isLoading ? "YUKLANMOQDA..." : "RO'YXATDAN O'TISH"}
              </button>
            </form>
          </div>

          {/* ===== O'NG TOMON (LOGIN LINK) ===== */}
          <div className="w-full lg:w-[35%] p-8 md:p-10 bg-[#FCFDFF] flex flex-col justify-start">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-50 rounded-2xl text-red-500">
                <UserPlus size={28} />
              </div>
              <h2 className="text-xl font-bold">Akkauntingiz bormi?</h2>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Agar sizda allaqachon account bo'lsa tizimga kirishingiz mumkin.
            </p>

            <Link href="/kirish">
              <button className="flex items-center justify-center gap-3 w-full bg-[#0B1320] hover:bg-black text-white py-4 rounded-lg uppercase text-[11px] font-bold tracking-widest transition-all group">
                AVTORIZATSIYA
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
  );
}