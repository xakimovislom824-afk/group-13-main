"use client";
import Image from "next/image";
import { FaCreditCard, FaList, FaTruck, FaTag } from "react-icons/fa";
import { useGetCompanyInfoQuery, useGetTeamQuery } from "../../services/companyApi";

import rasm from "../src/assets/imgs/rasmkompaniya.png";
import { useGetNewsQuery } from "../../services/newsApi";
import Link from "next/link";

export default function KompaneyatHaqida() {
  const { data: allNews = [] } = useGetNewsQuery();
  const yangiliklar = allNews.slice(0, 4);

  const { data: company, isLoading } = useGetCompanyInfoQuery();
  const { data: team = [] } = useGetTeamQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800">

      {/* ── HERO ── */}
      <section className="relative w-full bg-gray-100 overflow-hidden py-16 lg:py-24">
        <div className="absolute top-0 right-[-250px] hidden min-[769px]:block w-[1200px] h-full">
          <Image
            src={company?.cover_image || rasm}
            alt="Kompaniya"
            fill
            priority
            className="object-contain"
          />
        </div>

        <div className="relative z-10 max-w-2xl px-6">
          <h2 className="text-[32px] md:text-[42px] font-bold text-gray-900 mb-4 leading-tight">
            Bizning do'konimiz haqida
          </h2>
          <p className="text-gray-600 leading-relaxed mb-10 text-[15px] md:text-[16px]">
            {company?.vision || "Kompaniyamizning asosiy maqsadi — faqat qurilish va pardozlash materiallarini sotish bilan cheklanmasdan, ta'mirlash jarayonida yuzaga keladigan muammo va qiyinchiliklarni hal qiladigan xizmat yaratishdir."}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-blue-600 font-bold text-[28px]">17 805,3m²</h3>
              <p className="text-sm text-gray-500 mt-2 leading-6">savdo va ombor maydonlari</p>
            </div>
            <div>
              <h3 className="text-blue-600 font-bold text-[28px]">50 000+</h3>
              <p className="text-sm text-gray-500 mt-2 leading-6">mahsulot turlari</p>
            </div>
            <div>
              <h3 className="text-blue-600 font-bold text-[28px]">2 500+</h3>
              <p className="text-sm text-gray-500 mt-2 leading-6">doimiy mijozlar</p>
            </div>
            <div>
              <h3 className="text-blue-600 font-bold text-[28px]">440</h3>
              <p className="text-sm text-gray-500 mt-2 leading-6">tajribali xodimlar</p>
            </div>
          </div>

          {/* Kontakt ma'lumotlar */}
          {company && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {company.phone && <span>📞 {company.phone}</span>}
              {company.email && <span>✉️ {company.email}</span>}
              {company.address && <span>📍 {company.address}, {company.city}</span>}
            </div>
          )}
        </div>
      </section>

      {/* ── NIMA UCHUN BIZ ── */}
      <section className="border-t border-gray-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-7">Nima uchun aynan biz</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaCreditCard className="text-blue-500 text-lg" />, title: "Istalgan qulay usulda to'lov", desc: "Bizdan xarid qilishda maksimal qulaylik uchun siz uchun eng qulay to'lov usulini tanlang." },
              { icon: <FaList className="text-blue-500 text-lg" />, title: "Katalogda katta tovar tanlovi", desc: "Saytimizda siz har qanday ehtiyojingizni qondirish uchun zarur bo'lgan barcha tovarlarni topasiz." },
              { icon: <FaTruck className="text-blue-500 text-lg" />, title: "Tez yetkazib berish xizmati", desc: "Biz har bir buyurtmangizni imkon qadar tezroq yetkazib berishga intilamiz." },
              { icon: <FaTag className="text-blue-500 text-lg" />, title: "Katta xaridlarga chegirmalar", desc: "Chegirma tizimimiz sizning foyidangizga ishlab chiqilgan — xarid qanchalik ko'p bo'lsa, tejam shunchalik katta." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-gray-800 mb-1 leading-snug">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIX ── */}
      <section className="border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-7">«Stroyopttorg» MChJ tarixi</h2>
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-blue-600 font-bold text-lg mb-2">2003</p>
              <p className="text-sm text-gray-700 mb-3">«Stroyopttorg» MChJ 1-oktabr 2003 yilda davlat ro'yxatidan o'tkazildi va qurilish materiallarini sotish faoliyatini boshladi.</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• Umumiy savdo maydoni: <strong className="text-gray-800">10 000 m²</strong></li>
                <li>• Ombor maydoni: <strong className="text-gray-800">680 m²</strong></li>
                <li>• Xodimlar soni: <strong className="text-gray-800">15 nafar</strong></li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-blue-600 font-bold text-lg mb-2">2008</p>
              <p className="text-sm text-gray-700 mb-3">5 yil ichida kompaniya jadal o'sdi va rivojlandi — 2008-yilga kelib ancha yuqori natijalarga erishildi.</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• Umumiy savdo maydoni: <strong className="text-gray-800">50 000 m²</strong></li>
                <li>• Ombor maydoni: <strong className="text-gray-800">3 200 m²</strong></li>
                <li>• Xodimlar soni: <strong className="text-gray-800">380 nafar</strong></li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-blue-600 font-bold text-lg mb-2">2016</p>
              <p className="text-sm text-gray-700 mb-3">15 yillik yubiley munosabati bilan kompaniya savdo maydonlarini 17 805,3 m² gacha kengaytirdi.</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• Savdo markazi 1: <strong className="text-gray-800">5 945 m²</strong></li>
                <li>• Savdo markazi 2: <strong className="text-gray-800">3 951 m²</strong></li>
                <li>• Ombor maydoni: <strong className="text-gray-800">3 306,8 m²</strong></li>
              </ul>
            </div>
            <div className="border border-blue-200 rounded-lg p-5 bg-blue-50">
              <p className="text-center font-semibold text-blue-700 mb-5 text-sm">Bugungi kun</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-blue-700 font-bold text-lg leading-tight">17 805,3 m²</p>
                  <p className="text-xs text-gray-500 mt-0.5">umumiy va ombor maydoni</p>
                </div>
                <div>
                  <p className="text-blue-700 font-bold text-lg leading-tight">50 000+</p>
                  <p className="text-xs text-gray-500 mt-0.5">katalog tovarlari</p>
                </div>
                <div>
                  <p className="text-blue-700 font-bold text-lg leading-tight">2 500+</p>
                  <p className="text-xs text-gray-500 mt-0.5">doimiy mijozlar</p>
                </div>
                <div>
                  <p className="text-blue-700 font-bold text-lg leading-tight">
                    {company?.established_year || 440}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">shtatli xodimlar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── JAMOA ── */}
      {team.length > 0 && (
        <section className="border-t border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold mb-7">Bizning jamoa</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {team.map((member) => (
                <div key={member.id} className="border border-gray-100 rounded-xl p-4 text-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 bg-gray-100">
                    {member.profile_image ? (
                      <Image
                        src={member.profile_image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">
                        👤
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-sm text-gray-800">{member.name}</p>
                  <p className="text-xs text-blue-600 mt-0.5">{member.position}</p>
                  {member.bio && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{member.bio}</p>
                  )}
                  <div className="flex justify-center gap-2 mt-3">
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" className="text-gray-400 hover:text-pink-500 text-xs">IG</a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" className="text-gray-400 hover:text-blue-600 text-xs">LI</a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" className="text-gray-400 hover:text-sky-500 text-xs">TW</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">So'nggi yangiliklar</h2>
            <Link href="/blog" className="bg-[#f0f4f8] text-[#0066cc] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition hidden sm:block">
              Barcha yangiliklar
            </Link>
          </div>

          {yangiliklar.length === 0 ? (
            <p className="text-gray-400 text-sm">Yangiliklar yo'q</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {yangiliklar.map((item) => (
                <Link
                  key={item.id}
                  href={`/blogDetail/${item.id}`}
                  className="group flex flex-col"
                >
                  <div className="relative h-36 sm:h-40 rounded-lg overflow-hidden mb-3 bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                        Rasm yo'q
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString('uz-UZ')
                      : ""}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.summary || item.content}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}