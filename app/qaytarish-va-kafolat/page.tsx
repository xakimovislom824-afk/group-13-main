import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ReturnsPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--secondary)]">Mijozlar uchun ma’lumot</p>
      <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">Qaytarish va kafolat</h1>
      <div className="mt-7 space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm leading-7 text-[var(--text-muted)] shadow-sm sm:p-8">
        <p>Qaytarish yoki kafolat shartlari mahsulot turi va xarid shartlariga qarab farq qilishi mumkin. Ushbu katalogda barcha mahsulotlar uchun yagona qaytarish muddati yoki kafolat muddati tasdiqlanmagan.</p>
        <p>Xarid qilishdan oldin tegishli mahsulot sahifasidagi ma’lumotlarni tekshiring. Mahsulot holati yoki qaytarish bo‘yicha savolingiz bo‘lsa, murojaatda mahsulot nomi va mavjud buyurtma ma’lumotlarini ko‘rsating.</p>
        <p className="border-t border-[var(--border)] pt-5">Rasmiy telefon va elektron pochta ma&apos;lumotlari hozircha kiritilmagan. Savollar uchun <Link href="/aloqa" className="font-semibold text-[var(--secondary)] underline underline-offset-4">aloqa sahifasiga</Link> o&apos;ting.</p>
      </div>
      <Link href="/aloqa" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--primary)] px-4 font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]">Aloqa sahifasiga o‘tish <ArrowRight size={17} /></Link>
    </section>
  );
}
