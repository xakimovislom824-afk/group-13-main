"use client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import Skitka2 from "../src/assets/imgs/skitka2.png";
import Skitka4 from "../src/assets/imgs/skitka4.png";


export default function savolJavob() {
  // Qaysi savol ochiq ekanligini saqlash uchun state
  // null bo'lsa hamma yopiq, son bo'lsa o'sha tartibdagi savol ochiq
  const [openIndex, setOpenIndex] = useState(5);

  return (
    <div className="max-w-300 mx-auto p-6 font-sans bg-white">
      {/* Breadcrumbs (Yo'nalish ko'rsatkichi) */}
      <nav className="text-gray-400 text-sm mb-4">
        Stroyoptorg  /  <span className="text-gray-600">Savol-javob</span>
      </nav>

      <h1 className="text-4xl font-bold text-slate-800 mb-8">Savol-javob</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* CHAP TOMON: SAVOLLAR RO'YXATI (AKKORDEON) */}
        <div className="flex-1">
          <div className="border-t border-gray-100">

            {/* SAVOL 1 */}
            <div className="border-b border-gray-100 py-4">
              <button className="w-full flex justify-between items-center text-left hover:text-blue-600 transition-colors">
                <span className="font-medium text-slate-700">Qurilish jarayonida ishlatilmagan materiallarni qaytarishim mumkinmi?</span>
                <CiCirclePlus className="text-blue-500 text-2xl" />
              </button>
            </div>

            {/* SAVOL 2 */}
            <div className="border-b border-gray-100 py-4">
              <button className="w-full flex justify-between items-center text-left hover:text-blue-600 transition-colors">
                <span className="font-medium text-slate-700">Yetkazib berish narxi ichiga yukni tushirish xizmati kiradimi?</span>
                <CiCirclePlus className="text-blue-500 text-2xl" />
              </button>
            </div>

            {/* SAVOL 3 */}
            <div className="border-b border-gray-100 py-4">
              <button className="w-full flex justify-between items-center text-left hover:text-blue-600 transition-colors">
                <span className="font-medium text-slate-700">Do'koningizda faqat oldindan to'lov orqali buyurtma qilinadigan tovarlar bormi?</span>
                <CiCirclePlus className="text-blue-500 text-2xl" />
              </button>
            </div>

            {/* SAVOL 4 */}
            <div className="border-b border-gray-100 py-4">
              <button className="w-full flexify justify-between items-center text-left hover:text-blue-600 transition-colors">
                <span className="font-medium text-slate-700">Eng kam buyurtma miqdori qancha?</span>
                <CiCirclePlus className="text-blue-500 text-2xl" />
              </button>
            </div>

            {/* SAVOL 5 */}
            <div className="border-b border-gray-100 py-4">
              <button className="w-full flex justify-between items-center text-left hover:text-blue-600 transition-colors">
                <span className="font-medium text-slate-700">Sizlarda bepul yetkazib berish xizmati bormi?</span>
                <CiCirclePlus className="text-blue-500 text-2xl" />
              </button>
            </div>

            {/* SAVOL 6 (OCHIQ HOLATI) */}
            <div className="border-b border-gray-100 py-4">
              <button className="w-full flex justify-between items-center text-left text-slate-700">
                <span className="font-medium">Xarid vaqtida bo'lib to'lash yoki kredit rasmiylashtirish imkoniyati bormi? Shartlari qanday?</span>
                <CiCirclePlus className="text-blue-500 text-2xl" />
              </button>
              <div className="mt-4 text-gray-500 text-sm leading-relaxed">
                Kredit va bo'lib to'lash tizimi tashkilotimizda kredit mutaxassislariga murojaat qilgan holda amalga oshiriladi. Ular sizga bank tomonidan taklif etilgan va arizangiz yuboriladigan kredit mahsulotlari bo'yicha shartnomani rasmiylashtirib berishadi.
              </div>
            </div>

            {/* SAVOL 7 */}
            <div className="border-b border-gray-100 py-4">
              <button className="w-full flex justify-between items-center text-left hover:text-blue-600 transition-colors">
                <span className="font-medium text-slate-700">Sotib olishdan oldin asbob yoki texnikani tekshirib ko'rsa bo'ladimi?</span>
                <CiCirclePlus className="text-blue-500 text-2xl" />
              </button>
            </div>

            {/* SAVOL 8 */}
            <div className="border-b border-gray-100 py-4">
              <button className="w-full flex justify-between items-center text-left hover:text-blue-600 transition-colors">
                <span className="font-medium text-slate-700">Sizlarda yana qanday qo'shimcha xizmatlar mavjud?</span>
                <CiCirclePlus className="text-blue-500 text-2xl" />
              </button>
            </div>

            {/* SAVOL 9 */}
            <div className="border-b border-gray-100 py-4">
              <button className="w-full flex justify-between items-center text-left hover:text-blue-600 transition-colors">
                <span className="font-medium text-slate-700">Aksiyalar qanchalik tez-tez o'tkaziladi?</span>
                <CiCirclePlus className="text-blue-500 text-2xl" />
              </button>
            </div>
          </div>
        </div>

        {/* O'NG TOMON: BANNERLAR VA OBUNA BO'LISH */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6">

          <div
            className="relative overflow-hidden rounded-2xl h-48 cursor-pointer shadow-sm"
            style={{
              backgroundImage: `url(${Skitka4.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-white/20 p-6 flex flex-col justify-start">
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                Isitish <br /> tizimlari
              </h3>
              <span className="inline-block w-fit bg-[#001220] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                -30% gacha
              </span>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl h-48 cursor-pointer shadow-sm"
            style={{
              backgroundImage: `url(${Skitka2.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-white/20 p-6 flex flex-col justify-start">
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                Bo'yoq va lak <br /> mahsulotlari
              </h3>
              <span className="inline-block w-fit bg-[#001220] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                -30% gacha
              </span>
            </div>
          </div>

          {/* Obuna bo'lish formasi */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h4 className="font-bold text-center text-slate-800 mb-2">Yangiliklarga obuna bo'ling</h4>
            <p className="text-[12px] text-gray-500 text-center mb-4 leading-snug">
              Muntazam chegirmalar, maxsus takliflar va kompaniya yangiliklari.
            </p>
            <input
              type="email"
              placeholder="Email manzilingiz"
              className="w-full p-3 border border-gray-200 rounded-md mb-4 outline-none focus:border-blue-500 transition-all text-sm"
            />
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors text-sm mb-4 uppercase tracking-wider">
              Obuna bo'lish
            </button>
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" id="confirm" />
              <label htmlFor="confirm" className="text-[10px] text-gray-400 leading-tight cursor-pointer">
                Maxfiylik siyosatiga muvofiq shaxsiy ma'lumotlarni qayta ishlashga roziman
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}