"use client";

import React from "react";
import Link from "next/link";
import {
  Phone, Send, Headphones, User, MessageSquare,
  CheckCircle, AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "../context/ModalContext";
import { useSendContactMessageMutation } from "../../services/contactApi";

const contactSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqami noto'g'ri kiritildi"),
  message: z.string().min(10, "Xabar kamida 10 ta belgidan iborat bo'lishi kerak"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Aloqa() {
  const { openModal } = useModal();
  const [sendContactMessage, { isLoading, isSuccess, isError, error }] =
    useSendContactMessageMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await sendContactMessage({
        subject: "Sayt orqali murojaat",
        message: data.message,
        sender_name: data.name,
        sender_phone: data.phone,
        priority: "low",
      }).unwrap();
      reset();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D2D2D]">

      {/* Breadcrumbs */}
      <div className="bg-white border-t-[3px] border-[#1E74D2]">
        <div className="max-w-[1240px] mx-auto px-4 py-3 flex items-center gap-2 text-[11px] text-gray-400">
          <Link href="/" className="hover:text-blue-500 border-b border-dotted border-gray-400">
            Islomx7
          </Link>
          <span>/</span>
          <span>Kontaktlar</span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 py-6 md:py-10">

        <h1 className="text-2xl md:text-4xl font-bold text-[#1A202C] mb-6 md:mb-8">Kontaktlar</h1>

        <section aria-label="Aloqa ma'lumotlari" className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-[var(--text)]">Rasmiy aloqa ma&apos;lumotlari</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">Telefon raqami, elektron pochta, manzil va ijtimoiy tarmoq sahifalari hozircha tasdiqlanmagan. Murojaatingizni quyidagi shakl orqali yuborishingiz mumkin.</p>
          <button onClick={openModal} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:opacity-90">
            <Headphones size={16} aria-hidden="true" /> Qo&apos;ng&apos;iroq so&apos;rash
          </button>
        </section>

        {/* FORM */}
        <div className="max-w-2xl mx-auto text-center space-y-6 py-10 mt-6 md:mt-10 px-2">
          <h2 className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2 text-gray-800">
            <MessageSquare className="text-[#1E74D2]" size={22} /> Savollaringiz bormi?
          </h2>

          {isSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-left">
              <CheckCircle className="shrink-0" size={18} />
              <span>Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog&apos;lanamiz.</span>
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-left">
              <AlertCircle className="shrink-0" size={18} />
              <span>{(error as { data?: { detail?: string } } | undefined)?.data?.detail || "Xabar yuborishda xatolik yuz berdi"}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="text-left space-y-1">
              <label htmlFor="name" className="text-xs font-medium text-gray-400 flex items-center gap-1.5 pl-0.5">
                <User size={13} /> Ism
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                disabled={isLoading}
                className={`w-full border p-3 rounded text-sm outline-none bg-white focus:border-blue-500 transition-all disabled:opacity-50 ${errors.name ? "border-red-500" : "border-gray-200"}`}
                placeholder="Ismingiz"
              />
              {errors.name && <p className="text-red-500 text-[11px] mt-1 pl-0.5">{errors.name.message}</p>}
            </div>

            <div className="text-left space-y-1">
              <label htmlFor="phone" className="text-xs font-medium text-gray-400 flex items-center gap-1.5 pl-0.5">
                <Phone size={13} /> Telefon
              </label>
              <input
                {...register("phone")}
                id="phone"
                type="text"
                disabled={isLoading}
                className={`w-full border p-3 rounded text-sm outline-none bg-white focus:border-blue-500 transition-all disabled:opacity-50 ${errors.phone ? "border-red-500" : "border-gray-200"}`}
                placeholder="+998"
              />
              {errors.phone && <p className="text-red-500 text-[11px] mt-1 pl-0.5">{errors.phone.message}</p>}
            </div>

            <div className="sm:col-span-2 text-left space-y-1">
              <label htmlFor="message" className="text-xs font-medium text-gray-400 flex items-center gap-1.5 pl-0.5">
                <Send size={13} /> Xabar
              </label>
              <textarea
                {...register("message")}
                id="message"
                rows={4}
                disabled={isLoading}
                className={`w-full border p-3 rounded text-sm outline-none bg-white focus:border-blue-500 transition-all disabled:opacity-50 ${errors.message ? "border-red-500" : "border-gray-200"}`}
                placeholder="Yozing..."
              />
              {errors.message && <p className="text-red-500 text-[11px] mt-1 pl-0.5">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="sm:col-span-2 bg-[#1E74D2] text-white py-3 px-6 text-sm font-bold rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Yuborilmoqda...
                </>
              ) : (
                <>Yuborish <Send size={15} /></>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
