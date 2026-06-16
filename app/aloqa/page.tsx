"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Clock, Send,
  Headphones, User, MessageSquare,
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
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D2D2D]">

      {/* Breadcrumbs */}
      <div className="bg-white border-t-[3px] border-[#1E74D2]">
        <div className="max-w-[1240px] mx-auto px-4 py-3 flex items-center gap-2 text-[11px] text-gray-400">
          <Link href="/" className="hover:text-blue-500 border-b border-dotted border-gray-400">
            Stroyoptorg
          </Link>
          <span>/</span>
          <span>Kontaktlar</span>
        </div>
      </div>

      <main className="max-w-[1240px] mx-auto px-4 py-6 md:py-10">

        <h1 className="text-2xl md:text-4xl font-bold text-[#1A202C] mb-6 md:mb-8">Kontaktlar</h1>

        {/* MAP + INFO */}
        <div className="relative w-full flex flex-col lg:flex-row lg:h-[500px] bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 mb-8">
          <div className="w-full h-[300px] lg:h-full lg:w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191885.50263690623!2d69.139282136066!3d41.282512347942265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0x4093a4af37521e0!2zVGFzaGtlbnQsIE96YmVraXN0b24!5e0!3m2!1suz!2s!4v1715180000000!5m2!1suz!2s"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
          <div className="w-full lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 bg-white p-5 sm:p-6 lg:w-[360px] lg:shadow-xl lg:rounded-lg space-y-4 border-t lg:border-t-0 border-gray-100">
            <div className="flex gap-3">
              <MapPin className="text-[#1E74D2] shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1E74D2]">Manzil</p>
                <p className="text-[13px] text-gray-600 mt-0.5">Toshkent shahri</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="text-[#1E74D2] shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1E74D2]">Telefon</p>
                <p className="text-[13px] font-semibold text-gray-800 mt-0.5">8(8782) 28-45-81</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="text-[#1E74D2] shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1E74D2]">Email</p>
                <a href="mailto:info@stroyoptorg.ru" className="text-blue-600 text-[13px] hover:underline block mt-0.5">
                  info@stroyoptorg.ru
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="text-[#1E74D2] shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1E74D2]">Ish vaqti</p>
                <p className="text-[13px] text-gray-600 mt-0.5">8:00 – 18:00 (har kuni)</p>
              </div>
            </div>
            <button onClick={openModal} className="w-full bg-[#1E74D2] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded shadow-sm mt-2">
              <Headphones size={15} /> Qo'ng'iroq buyurtma qilish
            </button>
          </div>
        </div>

        {/* DEPARTMENTS & REQUISITES */}
        <div className="bg-[#F3F4F6] p-4 md:p-6 rounded-xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {[
                "Bosh direktor", "Ta'minot bo'limi", "Sotuv bo'limi", "Yuridik bo'lim",
                "Buxgalteriya", "Yetkazib berish", "Kredit bo'limi", "Kadrlar bo'limi", "Omborxona",
              ].map((title, i) => (
                <div key={i} className="bg-white rounded-lg p-3.5 border border-gray-200/60 flex items-start gap-3 shadow-sm">
                  <Phone className="text-gray-300 mt-0.5 shrink-0" size={14} />
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 mb-0.5">{title}:</p>
                    <p className="text-sm font-semibold text-gray-800">8 (8782) 28-42-67</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200/60 shadow-sm lg:col-span-1">
              <p className="text-sm font-bold text-gray-800 mb-2 border-b pb-1.5 border-gray-100">Rekvizitlar:</p>
              <p className="text-xs text-gray-600 leading-relaxed space-y-1">
                <strong className="text-gray-700 block">MChJ "STROYOPTTORG"</strong>
                INN: 090105187<br />
                Cherkessk shahri<br />
                Oktyabr ko'chasi 301/3<br />
                Hisob raqam: 407028106000012415<br />
                Bank: Sberbank<br />
                BIK: 040702615
              </p>
            </div>
          </div>
          
          {/* REGIONS */}
          <div className="border-t border-gray-200/80 pt-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3.5">Hududlar bo'yicha ishlaymiz:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {["Moskva", "Stavropol", "Krasnodar", "Grozniy", "Rostov-Don", "Samara"].map((city, i) => (
                <div key={i} className="text-sm border-l-2 border-blue-400 pl-3 py-0.5">
                  <p className="font-semibold text-gray-800 text-[13px]">{city}</p>
                  <p className="text-gray-600 text-[12px] font-medium mt-0.5">+7 (800) 444-00-65</p>
                  <a className="text-blue-600 text-[11px] hover:underline block mt-0.5 truncate">info@stroiopttorg.ru</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="max-w-2xl mx-auto text-center space-y-6 py-10 mt-6 md:mt-10 px-2">
          <h2 className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2 text-gray-800">
            <MessageSquare className="text-[#1E74D2]" size={22} /> Savollaringiz bormi?
          </h2>

          {isSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-left">
              <CheckCircle className="shrink-0" size={18} />
              <span>Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.</span>
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-left">
              <AlertCircle className="shrink-0" size={18} />
              <span>{(error as any)?.data?.detail || "Xabar yuborishda xatolik yuz berdi"}</span>
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

      </main>
    </div>
  );
}