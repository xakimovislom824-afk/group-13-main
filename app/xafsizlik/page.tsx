"use client";

import React from 'react';
import Link from 'next/link';
import { useModal } from '../../app/context/ModalContext';

export default function Xavfsizlik() {
  const { openModal } = useModal();

  return (
    <div className="min-h-screen bg-white font-sans text-[#2D2D2D]">
      {/* Header / Breadcrumbs */}
      <header className="max-w-360 mx-auto px-4 py-8 md:px-20 lg:px-32">
        <nav className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 mb-4 uppercase tracking-wider">
          <Link href="/" className="hover:text-gray-600 transition-colors">Stroyoptorg</Link>
          <span>/</span>
          <span className="text-gray-300 italic">Maxfiylik siyosati</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1A202C]">Maxfiylik siyosati va xavfsizlik</h1>
      </header>

      <main className="max-w-360 mx-auto px-4 py-10 md:px-20 lg:px-32">
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-6 md:p-16 lg:p-20">

          <div className="prose prose-sm max-w-none text-gray-600 space-y-10">

            {/* Kirish */}
            <section>
              <p className="text-[15px] leading-relaxed italic">
                Ushbu Maxfiylik siyosati "Stroyoptorg" platformasidan foydalanish jarayonida foydalanuvchilarning shaxsiy
                ma'lumotlarini qanday yig'ishimiz, saqlaymiz va himoya qilishimizni belgilaydi. Biz foydalanuvchilar
                ishonchini qadrlaymiz va ma'lumotlarni faqat qonuniy asosda, aniq maqsadlar uchun qayta ishlaymiz.
              </p>
            </section>

            {/* 1-Bo'lim */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                1. Atamalar va tushunchalar
              </h2>
              <div className="space-y-3 pl-4 border-l-2 border-blue-500">
                <p><strong>1.1. Sayt</strong> – internet-resurs, manzili: <span className="text-blue-600">https://stroyoptorg.uz</span>.</p>
                <p><strong>1.2. Shaxsiy ma'lumotlar</strong> – Foydalanuvchi mustaqil ravishda taqdim etadigan yoki sayt tomonidan avtomatik yig'iladigan ma'lumotlar.</p>
                <p><strong>1.3. Foydalanuvchi</strong> – Saytdan foydalanayotgan har qanday jismoniy yoki yuridik shaxs.</p>
                <p><strong>1.4. Operator</strong> – Shaxsiy ma'lumotlarni qayta ishlovchi "Stroyoptorg" kompaniyasi.</p>
                <p><strong>1.5. Qayta ishlash</strong> – ma'lumotlarni yig'ish, ro'yxatga olish, saqlash, o'zgartirish, uzatish va yo'q qilish amallari majmui.</p>
                <p><strong>1.6. Maxfiylik</strong> – Operatorning uchinchi shaxslarga ruxsatsiz ma'lumot uzatmaslik majburiyati.</p>
              </div>
            </section>

            {/* 2-Bo'lim */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                2. Umumiy qoidalar
              </h2>
              <div className="space-y-2">
                <p>2.1. Saytdan foydalanish ushbu Siyosatga to'liq rozilik bildirishni anglatadi.</p>
                <p>2.2. Rozilik bo'lmagan taqdirda foydalanishni darhol to'xtatish shart.</p>
                <p>2.3. Ushbu siyosat O'zbekiston Respublikasining "Shaxsiy ma'lumotlar to'g'risida"gi qonuniga muvofiq tuzilgan.</p>
                <p>2.4. Operator siyosatga o'zgartirish kiritish huquqini saqlab qoladi. O'zgartirishlar saytda e'lon qilingan kundan kuchga kiradi.</p>
                <p>2.5. Foydalanuvchi saytdan foydalanishni davom ettirish orqali yangi siyosatga roziligini bildiradi.</p>
              </div>
            </section>

            {/* 3-Bo'lim */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                3. Siyosat predmeti — yig'iladigan ma'lumotlar
              </h2>
              <p>Platformadan foydalanish jarayonida quyidagi ma'lumotlar qayta ishlanishi mumkin:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Foydalanuvchi to'liq ismi (F.I.Sh);</li>
                <li>Bog'lanish telefon raqami;</li>
                <li>Elektron pochta manzili (e-mail);</li>
                <li>Yetkazib berish manzili (shahar, ko'cha, uy raqami);</li>
                <li>IP-manzil va brauzer turi (avtomatik);</li>
                <li>Saytdagi harakatlar va sahifalarni ko'rish tarixi (cookie orqali);</li>
                <li>To'lov ma'lumotlari (to'lov xizmatlari orqali, biz saqlamaymiz).</li>
              </ul>
            </section>

            {/* 4-Bo'lim */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                4. Ma'lumotlarni yig'ish maqsadlari
              </h2>
              <ul className="list-decimal pl-6 space-y-1">
                <li>Foydalanuvchini identifikatsiya qilish va shartnoma tuzish.</li>
                <li>Buyurtmani qayta ishlash, yetkazib berish va hisob-faktura yuborish.</li>
                <li>Qayta aloqa va mijozlarga texnik yordam ko'rsatish.</li>
                <li>Buyurtma holati va o'zgarishlar haqida xabardor qilish.</li>
                <li>Xizmat sifatini oshirish va foydalanuvchi tajribasini tahlil qilish.</li>
                <li>Marketing va reklama faoliyati (faqat foydalanuvchi roziligida).</li>
                <li>Firibgarlik va noqonuniy harakatlarning oldini olish.</li>
                <li>Qonuniy majburiyatlarni bajarish (soliq, sud va boshqalar).</li>
              </ul>
            </section>

            {/* 5-Bo'lim */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                5. Qayta ishlash usullari va muddatlari
              </h2>
              <p>5.1. Shaxsiy ma'lumotlar O'zbekiston Respublikasi qonunchiligiga muvofiq qayta ishlanadi.</p>
              <p>5.2. Ma'lumotlar maqsad bajarilgunga qadar yoki foydalanuvchi talabi bilan o'chirilgunga qadar saqlanadi.</p>
              <p>5.3. Qonuniy majburiyatlar talab qilgan hollarda ma'lumotlar belgilangan muddatgacha saqlanishi shart.</p>
              <p>5.4. Avtomatlashtirilgan qayta ishlash foydalanuvchiga zarar yetkazadigan qarorlar qabul qilish uchun ishlatilmaydi.</p>
            </section>

            {/* 6-Bo'lim */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                6. Uchinchi shaxslarga ma'lumot uzatish
              </h2>
              <p>6.1. Operator foydalanuvchi roziligisiz shaxsiy ma'lumotlarni uchinchi shaxslarga uzatmaydi.</p>
              <p>6.2. Quyidagi hollarda ma'lumot uzatilishi mumkin:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Yetkazib berish xizmatlari (kuryer, pochta operatorlari);</li>
                <li>To'lov tizimlari (Click, Payme, Uzcard va boshqalar);</li>
                <li>SMS va email xabarnoma xizmatlari;</li>
                <li>Davlat organlari (qonun talabi asosida).</li>
              </ul>
              <p>6.3. Barcha sherik kompaniyalar ma'lumotlar maxfiyligini kafolatlashi shart.</p>
            </section>

            {/* 7-Bo'lim */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                7. Foydalanuvchi huquqlari
              </h2>
              <p>Foydalanuvchi quyidagi huquqlarga ega:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>O'z ma'lumotlarini ko'rish va nusxa olish;</li>
                <li>Noto'g'ri ma'lumotlarni to'g'irlash talabi;</li>
                <li>Ma'lumotlarni o'chirish yoki qayta ishlashni cheklash;</li>
                <li>Marketing xabarnomalaridan voz kechish;</li>
                <li>Shikoyat bilan vakolatli organga murojaat qilish.</li>
              </ul>
              <p>Talablar <span className="font-semibold text-gray-800">support@stroyoptorg.uz</span> manziliga yuborilishi kerak. 10 ish kuni ichida javob beriladi.</p>
            </section>

            {/* 8-Bo'lim */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                8. Ma'lumotlarni himoya qilish
              </h2>
              <p>8.1. Operator ma'lumotlarni ruxsatsiz kirishdan himoya qilish uchun texnik va tashkiliy choralar ko'radi.</p>
              <p>8.2. Ma'lumotlar SSL/TLS shifrlash orqali uzatiladi.</p>
              <p>8.3. Serverlar xavfsiz markazlarda joylashgan bo'lib, cheklangan kirish huquqiga ega.</p>
              <p>8.4. Xodimlar shaxsiy ma'lumotlarga faqat xizmat ehtiyoji asosida kirish huquqiga ega.</p>
            </section>

            {/* 9-Bo'lim */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                9. Cookie fayllari
              </h2>
              <p>9.1. Sayt cookie fayllaridan foydalanadi — bu sayt ishlashi va tahlili uchun zarur.</p>
              <p>9.2. Foydalanuvchi brauzer sozlamalari orqali cookie fayllarini o'chirib qo'yishi mumkin, ammo bu ayrim xizmatlar ishlashiga ta'sir qilishi mumkin.</p>
            </section>

            {/* 10-Bo'lim */}
            <section className="bg-gray-50 p-6 rounded-sm border-l-4 border-orange-400 space-y-2">
              <h3 className="font-bold text-gray-800">10. Javobgarlik va nizolarni hal qilish</h3>
              <p className="text-sm leading-relaxed">
                10.1. Barcha nizolar sudgacha bo'lgan da'vo tartibida hal qilinadi.
              </p>
              <p className="text-sm leading-relaxed">
                10.2. Da'volar 30 kalendar kun ichida ko'rib chiqiladi.
              </p>
              <p className="text-sm leading-relaxed">
                10.3. Kelishuv bo'lmagan taqdirda nizo O'zbekiston Respublikasi qonunchiligiga muvofiq sudda hal qilinadi.
              </p>
              <p className="text-sm leading-relaxed">
                10.4. Murojaat uchun: <span className="font-bold">support@stroyoptorg.uz</span>
              </p>
            </section>

            {/* 11-Bo'lim */}
            <section className="space-y-2">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 uppercase tracking-tight">
                11. Yakuniy qoidalar
              </h2>
              <p>11.1. Ushbu siyosat saytda e'lon qilingan kundan boshlab kuchga kiradi.</p>
              <p>11.2. Siyosatning joriy versiyasi doimo <span className="text-blue-600">stroyoptorg.uz/privacy</span> sahifasida mavjud bo'ladi.</p>
              <p>11.3. Operator ushbu siyosatni o'zgartirish huquqini saqlab qoladi, o'zgartirishlar e'lon qilingan kundan kuchga kiradi.</p>
            </section>

          </div>

          {/* Bog'lanish bloki */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm font-bold text-gray-800">Savollaringiz bormi?</p>
              <p className="text-xs text-gray-400 mt-1">Biz bilan bog'laning: support@stroyoptorg.uz</p>
            </div>
            <button
              onClick={openModal}
              className="bg-[#0B1320] text-white px-8 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all"
            >
              Bog'lanish
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}