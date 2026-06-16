"use client";
import { useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import Logo from "../assets/imgs/logo1.png";
import CallbackModal from "./CallbackModalWrapper";
import { useModal } from "../../context/ModalContext";

export default function Footer() {
  const { openModal } = useModal();

  return (
    <>
      <footer className="bg-gray-100 text-gray-600 border-t">
        <div className="w-full mx-auto px-4 sm:px-6 py-10">

          {/* Yuqori qism: Logo, Rekvizitlar, Email va Aloqa */}
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-8 border-b pb-8">

            {/* Logo va Kompaniya nomi */}
            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <Link href={"/"} className="inline-block">
                <Image
                  src={Logo}
                  alt="Kompaniya logotipi"
                  className="h-auto w-auto max-w-[180px]"
                />
              </Link>
              <div className="text-[13px] leading-relaxed">
                <p className="font-medium text-gray-800">OOO "Stroyopttorg"</p>
                <p>INN: 0901051787</p>
                <p>KPP: 090101001</p>
              </div>
            </div>

            {/* Email bo'limi */}
            <div className="text-[13px]">
              <p className="text-gray-400 mb-1">Email:</p>
              <a href="mailto:info@stroyopttorg.ru" className="text-blue-600 hover:underline font-medium">
                info@stroyopttorg.ru
              </a>
            </div>

            {/* Aloqa */}
            <div className="w-full lg:w-auto flex flex-col items-start lg:items-end gap-1">
              {/* Telefon raqami */}
              <a
                href="tel:88004440065"
                className="font-bold text-xl text-gray-900 hover:text-red-600 transition-colors duration-300"
              >
                8 800 444 00 65
              </a>

              {/* Ish vaqti */}
              <p className="text-[13px] text-gray-500 font-medium">
                Har kuni, 8:00 dan 18:00 gacha
              </p>

              {/* Tugma stili yaxshilandi */}
              <button
                onClick={openModal}
                className="w-full cursor-pointer sm:w-auto mt-2 px-5 py-2 text-sm font-semibold border-2 border-red-500 text-red-500 
               rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95"
              >
                Qo'ng'iroq qilishni so'rang
              </button>
            </div>
          </div>

          {/* O'rta qism: Navigatsiya Linklari */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 py-10 border-b">

            {/* Ma'lumot */}
            <div>
              <h3 className="font-bold text-black mb-4 uppercase text-[14px]">Ma'lumot</h3>
              <div className="flex flex-col gap-2 text-[14px]">
                <Link href="/kompaneyaHaqida" className="hover:text-blue-600 transition-colors">Kampaniya haqida</Link>
                <Link href="/tulov" className="hover:text-blue-600 transition-colors">To'lov</Link>
                <Link href="/yetkazibBerish" className="hover:text-blue-600 transition-colors">Yetkazib berish</Link>
                <Link href="/qaytarish" className="hover:text-blue-600 transition-colors">Qaytarish</Link>
                <Link href="/fikrlar" className="hover:text-blue-600 transition-colors">Fikrlar</Link>
              </div>
            </div>


            {/* Qo'shimcha */}
            <div>
              <h3 className="font-bold text-black mb-4 uppercase text-[14px]">Qo'shimcha</h3>
              <div className="flex flex-col gap-2 text-[14px]">
                <Link href="/savolJavob" className="hover:text-blue-600 transition-colors">Savol-javob</Link>
                <Link href="/blog" className="hover:text-blue-600 transition-colors">Yangiliklar</Link>
                <Link href="/aloqa" className="hover:text-blue-600 transition-colors">Aloqa</Link>
                <Link href="/login" className="hover:text-blue-600 transition-colors">Kirish / Ro'yxatdan o'tish</Link>
                <Link href="/aksiyalar" className="hover:text-blue-600 transition-colors">Aksiyalar</Link>
              </div>
            </div>

            {/* Katalog */}
            <div>
              <h3 className="font-bold text-black mb-4 uppercase text-[14px]">Katalog</h3>
              <div className="flex flex-col gap-2 text-[14px]">
                <Link href="/qurilishMateriallari" className="hover:text-blue-600 transition-colors">Qurilish materiallari</Link>
                <Link href="/asbobUskunalar" className="hover:text-blue-600 transition-colors">Asbob-uskunalar</Link>
                <Link href="/santexnika" className="hover:text-blue-600 transition-colors">Santexnika</Link>
                <Link href="/elektr" className="hover:text-blue-600 transition-colors">Elektr tovarlar</Link>
                <Link href="/uyBog" className="hover:text-blue-600 transition-colors">Uy va bog' uchun mahsulotlar</Link>
              </div>
            </div>

            {/* Obuna */}
            <div>
              <h3 className="font-bold text-black mb-4 uppercase text-[14px]">Obuna</h3>
              <p className="text-[13px] mb-4">Yangiliklardan xabardor bo'ling</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex border border-gray-300 rounded overflow-hidden focus-within:border-blue-500 transition-all">
                <input
                  type="email"
                  placeholder="Email"
                  className="px-3 py-2.5 w-full outline-none text-[13px] bg-white"
                />
                <button className="bg-gray-200 hover:bg-gray-300 px-4 transition-colors text-gray-700">
                  ➤
                </button>
              </form>
            </div>
          </div>

          {/* Pastki qism */}
          <div className="flex flex-col md:flex-row justify-between items-center text-[12px] text-gray-400 pt-6 gap-4 text-center md:text-left">
            <p>© 2023 STROYOPTTORG. Barcha huquqlar himoyalangan</p>
            <Link href="/xafsizlik" className="hover:text-gray-600 underline underline-offset-2">
              Maxfiylik siyosati
            </Link>
          </div>
        </div>
      </footer>


    </>
  );
}
