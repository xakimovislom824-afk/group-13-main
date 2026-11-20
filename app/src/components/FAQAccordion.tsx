"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const questions = [
  {
    question: "Qurilish jarayonida ishlatilmagan materiallarni qaytarishim mumkinmi?",
    answer: "Qaytarish va kafolat shartlari mahsulot turiga bog‘liq. Buyurtma berishdan oldin mahsulot sahifasidagi ma’lumotni tekshiring yoki holatingizni biz bilan aniqlashtiring.",
    href: "/qaytarish-va-kafolat",
    linkLabel: "Qaytarish va kafolat shartlari",
  },
  {
    question: "Yetkazib berish narxi ichiga yukni tushirish xizmati kiradimi?",
    answer: "Yetkazib berish tafsilotlari hudud va tanlangan usulga qarab farq qilishi mumkin. Mavjud usullarni yetkazib berish sahifasida ko‘ring.",
    href: "/yetkazibBerish",
    linkLabel: "Yetkazib berish ma’lumotlari",
  },
  {
    question: "Do‘koningizda faqat oldindan to‘lov orqali buyurtma qilinadigan tovarlar bormi?",
    answer: "To‘lov usullari va shartlari bilan tanishing; aniq bir mahsulot bo‘yicha savolingiz bo‘lsa, aloqa sahifasi orqali murojaat qiling.",
    href: "/tulov",
    linkLabel: "To‘lov usullari",
  },
  {
    question: "Eng kam buyurtma miqdori qancha?",
    answer: "Minimal buyurtma miqdori bo‘yicha tasdiqlangan umumiy limit ko‘rsatilmagan. Buyurtmangizga oid ma’lumotni aloqa sahifasi orqali aniqlashtiring.",
    href: "/aloqa",
    linkLabel: "Biz bilan bog‘lanish",
  },
  {
    question: "Sizlarda bepul yetkazib berish xizmati bormi?",
    answer: "Yetkazib berish narxi mahsulot og‘irligi, hajmi va manzilga bog‘liq. Mavjud yetkazib berish usullari haqidagi ma’lumotni ko‘ring.",
    href: "/yetkazibBerish",
    linkLabel: "Yetkazib berish ma’lumotlari",
  },
  {
    question: "Xarid vaqtida bo‘lib to‘lash yoki kredit rasmiylashtirish imkoniyati bormi? Shartlari qanday?",
    answer: "Kredit va bo‘lib to‘lash tizimi tashkilotimizda kredit mutaxassislariga murojaat qilgan holda amalga oshiriladi. Ular bank tomonidan taklif etilgan va arizangiz yuboriladigan kredit mahsulotlari bo‘yicha shartnomani rasmiylashtirishda yordam beradi.",
    href: "/aloqa",
    linkLabel: "Kredit bo‘yicha savol berish",
  },
  {
    question: "Sotib olishdan oldin asbob yoki texnikani tekshirib ko‘rsa bo‘ladimi?",
    answer: "Tekshirish imkoniyati mahsulot va buyurtma shartlariga bog‘liq. Xariddan oldin tafsilotlarni biz bilan tasdiqlang.",
    href: "/aloqa",
    linkLabel: "Biz bilan bog‘lanish",
  },
  {
    question: "Sizlarda yana qanday qo‘shimcha xizmatlar mavjud?",
    answer: "Xizmatlar bo‘yicha joriy ma’lumotni aloqa sahifasi orqali so‘rashingiz mumkin.",
    href: "/aloqa",
    linkLabel: "Biz bilan bog‘lanish",
  },
  {
    question: "Aksiyalar qanchalik tez-tez o‘tkaziladi?",
    answer: "Joriy takliflarni aksiyalar sahifasida ko‘rib boring.",
    href: "/aksiyalar",
    linkLabel: "Joriy aksiyalar",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(5);

  return (
    <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
      {questions.map((item, index) => {
        const isOpen = openIndex === index;
        const answerId = `faq-answer-${index}`;
        return (
          <section key={item.question} className="py-1">
            <h2>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--secondary)] sm:text-base"
              >
                <span>{item.question}</span>
                <ChevronDown aria-hidden="true" className={`size-5 shrink-0 text-[var(--secondary)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
            </h2>
            {isOpen && (
              <div id={answerId} className="pb-4 pr-8 text-sm leading-6 text-[var(--text-muted)]">
                <p>{item.answer}</p>
                <Link href={item.href} className="mt-2 inline-flex min-h-10 items-center font-semibold text-[var(--secondary)] underline underline-offset-4 hover:text-[var(--primary)]">
                  {item.linkLabel}
                </Link>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
