"use client";
import { useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import Logo from "../assets/imgs/logo1.png";
import CallbackModal from "./CallbackModalWrapper";
import { useModal } from "../../context/ModalContext";
import { FiChevronDown } from "react-icons/fi";

export default function Footer() {
  const { openModal } = useModal();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-100 text-gray-600 border-t">
        <div className="w-full mx-auto px-4 sm:px-6 py-6 lg:py-10">

          {/* Yuqori qism: Logo, Rekvizitlar, Email va Aloqa */}
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-4 lg:gap-8 border-b pb-6 lg:pb-8">

            {/* Logo + Email (mobil: yonma-yon) */}
            <div className="flex w-full lg:w-auto justify-between items-start gap-4">
              <div className="flex flex-col gap-3 lg:gap-4">
                <Link href={"/"} className="inline-block">
                  <Image
                    src={Logo}
                    alt="Kompaniya logotipi"
                    className="h-auto w-auto max-w-[150px] lg:max-w-[180px]"
                  />
                </Link>
                <div className="text-[13px] leading-relaxed hidden lg:block">
                  <p className="font-medium text-gray-800">OOO &quot;Stroyopttorg&quot;</p>
                  <p>INN: 0901051787</p>
                  <p>KPP: 090101001</p>
                </div>
              </div>

              {/* Email bo'limi (mobilda yuqori o'ngda) */}
              <div className="text-[12px] lg:text-[13px] text-right lg:text-left shrink-0">
                <p className="text-gray-400 mb-1">Email:</p>
                <a href="mailto:info@stroyopttorg.ru" className="text-blue-600 hover:underline font-medium break-all">
                  info@stroyopttorg.ru
                </a>
              </div>
            </div>

            {/* Aloqa */}
            <div className="w-full lg:w-auto flex flex-col items-start lg:items-end gap-1">
              {/* Telefon raqami */}
              <a
                href="tel:88004440065"
                className="font-bold text-lg lg:text-xl text-gray-900 hover:text-red-600 transition-colors duration-300"
              >
                8 800 444 00 65
              </a>

              {/* Ish vaqti */}
              <p className="text-[12px] lg:text-[13px] text-gray-500 font-medium">
                Har kuni, 8:00 dan 18:00 gacha
              </p>

              {/* Tugma stili yaxshilandi */}
              <button
                onClick={openModal}
                className="w-full cursor-pointer sm:w-auto mt-2 px-5 py-2.5 lg:py-2 text-[12px] lg:text-sm font-semibold border-2 border-red-500 text-red-500 uppercase
               rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95"
              >
                Qo&apos;ng&apos;iroq qilishni so&apos;rang
              </button>
            </div>
          </div>

          {/* O'rta qism: Navigatsiya Linklari */}

          {/* ── MOBIL: Akkordeon ko'rinish ── */}
          <div className="lg:hidden">

            {/* Ma'lumot/Qo'shimcha — birlashtirilgan "Informatsiya" akkordeon */}
            <div className="border-b">
              <button
                onClick={() => setIsInfoOpen(prev => !prev)}
                className="w-full flex items-center justify-between py-4 font-bold text-black text-[16px]"
                aria-expanded={isInfoOpen}
              >
                <span>Ma&apos;lumot</span>
                <FiChevronDown size={20} className={`transition-transform duration-300 ${isInfoOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid overflow-hidden transition-all duration-300 ${isInfoOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[14px]">
                    <Link href="/kompaneyaHaqida" className="hover:text-blue-600 transition-colors">Kompaniya haqida</Link>
                    <Link href="/tulov" className="hover:text-blue-600 transition-colors">To&apos;lov</Link>
                    <Link href="/yetkazibBerish" className="hover:text-blue-600 transition-colors">Yetkazib berish</Link>
                    <Link href="/qaytarish" className="hover:text-blue-600 transition-colors">Qaytarish</Link>
                    <Link href="/fikrlar" className="hover:text-blue-600 transition-colors">Fikrlar</Link>
                    <Link href="/savolJavob" className="hover:text-blue-600 transition-colors">Savol-javob</Link>
                    <Link href="/blog" className="hover:text-blue-600 transition-colors">Yangiliklar</Link>
                    <Link href="/aloqa" className="hover:text-blue-600 transition-colors">Aloqa</Link>
                    <Link href="/login" className="hover:text-blue-600 transition-colors">Kirish / Ro&apos;yxat</Link>
                    <Link href="/aksiyalar" className="hover:text-blue-600 transition-colors">Barcha aksiyalar</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Katalog akkordeon */}
            <div className="border-b">
              <button
                onClick={() => setIsCatalogOpen(prev => !prev)}
                className="w-full flex items-center justify-between py-4 font-bold text-black text-[16px]"
                aria-expanded={isCatalogOpen}
              >
                <span>Katalog</span>
                <FiChevronDown size={20} className={`transition-transform duration-300 ${isCatalogOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid overflow-hidden transition-all duration-300 ${isCatalogOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-3 text-[14px]">
                    <Link href="/qurilishMateriallari" className="hover:text-blue-600 transition-colors">Qurilish materiallari</Link>
                    <Link href="/asbobUskunalar" className="hover:text-blue-600 transition-colors">Asbob-uskunalar</Link>
                    <Link href="/santexnika" className="hover:text-blue-600 transition-colors">Santexnika</Link>
                    <Link href="/elektr" className="hover:text-blue-600 transition-colors">Elektr tovarlar</Link>
                    <Link href="/uyBog" className="hover:text-blue-600 transition-colors">Uy va bog&apos; uchun mahsulotlar</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* To'lov tizimlari ikonkalari */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-7 opacity-50 grayscale">
              <span className="font-black italic text-xl tracking-tight">VISA</span>
              <span className="inline-flex">
                <span className="w-5 h-5 rounded-full bg-gray-400 -mr-2" />
                <span className="w-5 h-5 rounded-full bg-gray-300" />
              </span>
              <span className="font-bold text-xl">✓</span>
              <span className="font-black text-xl tracking-tight">МИР</span>
              <span className="font-bold text-lg tracking-wide">XO&apos;LBO</span>
              <span className="font-bold text-lg tracking-wide">TINKOFF</span>
            </div>

            {/* Obuna (mobil) */}
            <div className="pb-2">
              <p className="text-center font-semibold text-gray-800 text-[15px] mb-4">
                Подпишитесь на рассылку и будьте в курсе!
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex bg-white border border-gray-200 rounded-md overflow-hidden focus-within:border-blue-500 transition-all shadow-sm">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="px-4 py-3.5 w-full outline-none text-[14px] bg-white"
                />
                <button className="px-5 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center">
                  ➤
                </button>
              </form>
            </div>
          </div>

          {/* ── DESKTOP: Grid ko'rinish ── */}
          <div className="hidden lg:grid grid-cols-4 gap-10 py-10 border-b">

            {/* Ma'lumot */}
            <div>
              <h3 className="font-bold text-black mb-4 uppercase text-[14px]">Ma&apos;lumot</h3>
              <div className="flex flex-col gap-2 text-[14px]">
                <Link href="/kompaneyaHaqida" className="hover:text-blue-600 transition-colors">Kampaniya haqida</Link>
                <Link href="/tulov" className="hover:text-blue-600 transition-colors">To&apos;lov</Link>
                <Link href="/yetkazibBerish" className="hover:text-blue-600 transition-colors">Yetkazib berish</Link>
                <Link href="/qaytarish" className="hover:text-blue-600 transition-colors">Qaytarish</Link>
                <Link href="/fikrlar" className="hover:text-blue-600 transition-colors">Fikrlar</Link>
              </div>
            </div>

            {/* Qo'shimcha */}
            <div>
              <h3 className="font-bold text-black mb-4 uppercase text-[14px]">Qo&apos;shimcha</h3>
              <div className="flex flex-col gap-2 text-[14px]">
                <Link href="/savolJavob" className="hover:text-blue-600 transition-colors">Savol-javob</Link>
                <Link href="/blog" className="hover:text-blue-600 transition-colors">Yangiliklar</Link>
                <Link href="/aloqa" className="hover:text-blue-600 transition-colors">Aloqa</Link>
                <Link href="/login" className="hover:text-blue-600 transition-colors">Kirish / Ro&apos;yxatdan o&apos;tish</Link>
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
                <Link href="/uyBog" className="hover:text-blue-600 transition-colors">Uy va bog&apos; uchun mahsulotlar</Link>
              </div>
            </div>

            {/* Obuna */}
            <div>
              <h3 className="font-bold text-black mb-4 uppercase text-[14px]">Obuna</h3>
              <p className="text-[13px] mb-4">Yangiliklardan xabardor bo&apos;ling</p>
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
          <div className="flex flex-col lg:flex-row justify-between items-center text-[11px] lg:text-[12px] text-gray-400 pt-6 gap-3 lg:gap-4 text-center lg:text-left">
            <p className="leading-relaxed">
              © 2003-2023 Интернет-магазин ООО «Стройоптторг»<br className="lg:hidden" />
              {" "}р/с 40702810360000102415 в Ставропольском<br className="lg:hidden" />
              {" "}отделение №5230 ПАО Сбербанк, БИК 040702615
            </p>
            <Link href="/xafsizlik" className="hover:text-gray-600 underline underline-offset-2 shrink-0">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}