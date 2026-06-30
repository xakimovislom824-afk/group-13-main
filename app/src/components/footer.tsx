"use client";
import { useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import Logo from "../assets/imgs/logo1.png";
import CallbackModal from "./CallbackModalWrapper";
import { useModal } from "../../context/ModalContext";
import { FiChevronDown } from "react-icons/fi";
import tulov1 from "../assets/icons/Group 46.png"
import tulov2 from "../assets/icons/Group 47.png"
import tulov3 from "../assets/icons/Group 48.png"
import tulov4 from "../assets/icons/Group 49.png"
import tulov5 from "../assets/icons/Vector1.png"
import tulov6 from "../assets/icons/Vector.png"

export default function Footer() {
  const { openModal } = useModal();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const PaymentIcons = ({ className = "" }) => (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 opacity-60 grayscale ${className}`}>
      <Image src={tulov1} alt="Visa" className="h-5 w-auto object-contain" />
      <Image src={tulov2} alt="Mastercard" className="h-5 w-auto object-contain" />
      <Image src={tulov3} alt="Mir Pay" className="h-5 w-auto object-contain" />
      <Image src={tulov4} alt="МИР" className="h-5 w-auto object-contain" />
      <Image src={tulov5} alt="Xalva" className="h-5 w-auto object-contain" />
      <Image src={tulov6} alt="Tinkoff" className="h-5 w-auto object-contain" />
    </div>
  );

  return (
    <>
      <footer className="bg-gray-100 text-gray-600 border-t">
        <div className="w-full mx-auto px-4 sm:px-6 py-6 lg:py-8">

          {/* ── DESKTOP: Yuqori qator (Logo / Rekvizit / Email / Aloqa / Tugma) ── */}
          <div className="hidden lg:flex justify-between items-center gap-6 border-b pb-6">

            {/* Logo */}
            <Link href={"/"} className="inline-block shrink-0">
              <Image
                src={Logo}
                alt="Kompaniya logotipi"
                className="h-auto w-auto max-w-[170px]"
              />
            </Link>

            {/* Kompaniya nomi */}
            <div className="text-[13px] text-gray-700 shrink-0">
              <p>OOO &quot;Stroyopttorg&quot;</p>
            </div>

            {/* INN / KPP */}
            <div className="text-[13px] text-gray-600 shrink-0">
              <p>INN: 0901051787</p>
              <p>KPP: 090101001</p>
            </div>

            {/* Email */}
            <div className="text-[13px] shrink-0">
              <p className="text-gray-400 mb-1">Email:</p>
              <a href="mailto:info@stroyopttorg.ru" className="text-blue-600 hover:underline font-medium">
                info@stroyopttorg.ru
              </a>
            </div>

            {/* Telefon + ish vaqti */}
            <div className="text-right shrink-0">
              <a href="tel:88004440065" className="font-bold text-lg text-gray-900 hover:text-red-600 transition-colors duration-300 block" >
                8 800 444 00 65
              </a>
              <p className="text-[12px] text-gray-500 font-medium">
                Har kuni, 8:00 dan 18:00 gacha
              </p>
            </div>

            {/* Tugma */}
            <button
              onClick={openModal}
              className="shrink-0 cursor-pointer px-6 py-2.5 text-[13px] font-semibold border-2 border-red-500 text-red-500 uppercase
               rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95"
            >
              Qo&apos;ng&apos;iroq qiling
            </button>
          </div>

          {/* ── MOBIL: Yuqori qism (Logo, Email, Aloqa) ── */}
          <div className="lg:hidden flex flex-col gap-4 border-b pb-6">
            <div className="flex w-full justify-between items-start gap-4">
              <Link href={"/"} className="inline-block">
                <Image
                  src={Logo}
                  alt="Kompaniya logotipi"
                  className="h-auto w-auto max-w-[150px]"
                />
              </Link>

              <div className="text-[12px] text-right shrink-0">
                <p className="text-gray-400 mb-1">Email:</p>
                <a href="mailto:info@stroyopttorg.ru" className="text-blue-600 hover:underline font-medium break-all">
                  info@stroyopttorg.ru
                </a>
              </div>
            </div>

            <div className="w-full flex flex-col items-start gap-1">
              <a href="tel:88004440065" className="font-bold text-lg text-gray-900 hover:text-red-600 transition-colors duration-300" >
                8 800 444 00 65
              </a>
              <p className="text-[12px] text-gray-500 font-medium">
                Har kuni, 8:00 dan 18:00 gacha
              </p>
              <button
                onClick={openModal}
                className="w-full cursor-pointer sm:w-auto mt-2 px-5 py-2.5 text-[12px] font-semibold border-2 border-red-500 text-red-500 uppercase
               rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95"
              >
                Qo&apos;ng&apos;iroq qilishni so&apos;rang
              </button>
            </div>
          </div>

          {/* ── MOBIL: Akkordeon ko'rinish ── */}
          <div className="lg:hidden">

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
                    <Link href="/savolJavob" className="hover:text-blue-600 transition-colors">Savol-javob</Link>
                    <Link href="/tulov" className="hover:text-blue-600 transition-colors">To&apos;lov</Link>
                    <Link href="/blog" className="hover:text-blue-600 transition-colors">Yangiliklar</Link>
                    <Link href="/yetkazibBerish" className="hover:text-blue-600 transition-colors">Yetkazib berish</Link>
                    <Link href="/aloqa" className="hover:text-blue-600 transition-colors">Aloqa</Link>
                    <Link href="/qaytarish" className="hover:text-blue-600 transition-colors">Qaytarish</Link>
                    <Link href="/login" className="hover:text-blue-600 transition-colors">Kirish / Ro&apos;yxat</Link>
                    <Link href="/fikrlar" className="hover:text-blue-600 transition-colors">Fikrlar</Link>
                    <Link href="/aksiyalar" className="hover:text-blue-600 transition-colors">Barcha aksiyalar</Link>
                  </div>
                </div>
              </div>
            </div>

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
                    <Link href="/qurilishMateriallari" className="hover:text-blue-600 transition-colors">Umumqurilish materiallari</Link>
                    <Link href="/saunaUchun" className="hover:text-blue-600 transition-colors">Sauna va hammom uchun</Link>
                    <Link href="/asbobUskunalar" className="hover:text-blue-600 transition-colors">Asbob-uskunalar</Link>
                    <Link href="/otdelka" className="hover:text-blue-600 transition-colors">Pardozlash materiallari</Link>
                    <Link href="/uyBog" className="hover:text-blue-600 transition-colors">Uy, bog&apos; va hovli uchun mahsulotlar</Link>
                    <Link href="/elektr" className="hover:text-blue-600 transition-colors">Elektr tovarlar</Link>
                    <Link href="/santexnika" className="hover:text-blue-600 transition-colors">Santexnika</Link>
                    <Link href="/stolyar" className="hover:text-blue-600 transition-colors">Yog&apos;och buyumlari</Link>
                    <Link href="/spetsodejda" className="hover:text-blue-600 transition-colors">Maxsus kiyim va YHV vositalari</Link>
                    <Link href="/suvGaz" className="hover:text-blue-600 transition-colors">Suv-gaz ta&apos;minoti, isitish, ventilyatsiya</Link>
                    <Link href="/metiz" className="hover:text-blue-600 transition-colors">Metiz, taqelama va skoba buyumlari</Link>
                  </div>
                </div>
              </div>
            </div>

            <PaymentIcons className="justify-center py-7" />

            <div className="pb-2">
              <p className="text-center font-semibold text-gray-800 text-[15px] mb-4">
                Yangiliklarga obuna bo&apos;ling va xabardor bo&apos;ling!
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex bg-white border border-gray-200 rounded-md overflow-hidden focus-within:border-blue-500 transition-all shadow-sm">
                <input
                  type="email"
                  placeholder="Sizning emailingiz"
                  className="px-4 py-3.5 w-full outline-none text-[14px] bg-white"
                />
                <button className="px-5 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center">
                  ➤
                </button>
              </form>
            </div>
          </div>

          {/* ── DESKTOP: Ma'lumot va Katalog ── */}
          <div className="hidden lg:grid grid-cols-5 gap-8 py-8 border-b">

            {/* Ma'lumot (2 ustunli ichki grid) */}
            <div className="col-span-1">
              <h3 className="font-bold text-black mb-4 text-[15px]">Ma&apos;lumot</h3>
              <div className="grid grid-cols-1 gap-2 text-[14px]">
                <Link href="/kompaneyaHaqida" className="hover:text-blue-600 transition-colors">Kompaniya haqida</Link>
                <Link href="/tulov" className="hover:text-blue-600 transition-colors">To&apos;lov</Link>
                <Link href="/yetkazibBerish" className="hover:text-blue-600 transition-colors">Yetkazib berish</Link>
                <Link href="/qaytarish" className="hover:text-blue-600 transition-colors">Qaytarish</Link>
                <Link href="/fikrlar" className="hover:text-blue-600 transition-colors">Fikrlar</Link>
              </div>
            </div>

            <div className="col-span-1">
              <div className="text-[14px] flex flex-col gap-2 mt-[30px]">
                <Link href="/savolJavob" className="hover:text-blue-600 transition-colors">Savol-javob</Link>
                <Link href="/blog" className="hover:text-blue-600 transition-colors">Yangiliklar</Link>
                <Link href="/aloqa" className="hover:text-blue-600 transition-colors">Aloqa</Link>
                <Link href="/login" className="hover:text-blue-600 transition-colors">Kirish / Ro&apos;yxatdan o&apos;tish</Link>
                <Link href="/aksiyalar" className="hover:text-blue-600 transition-colors">Barcha aksiyalar</Link>
              </div>
            </div>

            {/* Katalog — birinchi guruh */}
            <div className="col-span-1">
              <h3 className="font-bold text-black mb-4 text-[15px]">Katalog</h3>
              <div className="flex flex-col gap-2 text-[14px]">
                <span className="hover:text-blue-600 transition-colors">Umumqurilish materiallari</span>
                <span className="hover:text-blue-600 transition-colors">Sauna va hammom uchun</span>
                <span className="hover:text-blue-600 transition-colors">Asbob-uskunalar</span>
                <span className="hover:text-blue-600 transition-colors">Pardozlash materiallari</span>
                <span className="hover:text-blue-600 transition-colors">Uy, bog&apos; va hovli uchun mahsulotlar</span>
              </div>
            </div>

            {/* Katalog — ikkinchi guruh */}
            <div className="col-span-1">
              <div className="flex flex-col gap-2 text-[14px] mt-[30px]">
                <span className="hover:text-blue-600 transition-colors">Elektr tovarlar</span>
                <span className="hover:text-blue-600 transition-colors">Santexnika</span>
                <span className="hover:text-blue-600 transition-colors">Yog&apos;och buyumlari</span>
                <span className="hover:text-blue-600 transition-colors">Maxsus kiyim va YHV vositalari</span>
              </div>
            </div>

            {/* Katalog — uchinchi guruh */}
            <div className="col-span-1">
              <div className="flex flex-col gap-3 text-[14px] mt-[30px]">
                <span className="hover:text-blue-600 transition-colors">Suv-gaz ta&apos;minoti, isitish, ventilyatsiya</span>
                <span className="hover:text-blue-600 transition-colors">Metiz, taqelama va skoba buyumlari</span>
              </div>
            </div>
          </div>

          {/* ── DESKTOP: To'lov + Obuna ── */}
          <div className="hidden lg:flex justify-between items-center py-6 border-b gap-8">
            <p className="text-[13px] text-gray-500 shrink-0 leading-snug">
              Biz qabul qilamiz:
            </p>
            <PaymentIcons />
            <div className="flex items-center gap-6 shrink-0">
              <p className="text-[14px] font-semibold text-gray-800 whitespace-nowrap">
                Yangiliklarga obuna bo&apos;ling va xabardor bo&apos;ling!
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex border border-gray-300 rounded overflow-hidden focus-within:border-blue-500 transition-all bg-white">
                <input
                  type="email"
                  placeholder="Sizning emailingiz"
                  className="px-4 py-2.5 w-[220px] outline-none text-[13px] bg-white"
                />
                <button className="bg-gray-100 hover:bg-gray-200 px-4 transition-colors text-gray-700">
                  ➤
                </button>
              </form>
            </div>
          </div>

          {/* Pastki qism */}
          <div className="flex flex-col lg:flex-row justify-between items-center text-[11px] lg:text-[12px] text-gray-400 pt-6 gap-3 lg:gap-4 text-center lg:text-left">
            <p className="leading-relaxed">
              © 2003-2023 «Stroyopttorg» MCHJ internet-do&apos;koni<br className="lg:hidden" />
              {" "}h/r 40702810360000102415 Stavropol<br className="lg:hidden" />
              {" "}bo&apos;limi №5230 PAO Sberbank, BIK 040702615
            </p>
            <Link href="/xafsizlik" className="hover:text-gray-600 underline underline-offset-2 shrink-0">
              Maxfiylik siyosati
            </Link>
          </div>
        </div >
      </footer >
    </>
  );
}