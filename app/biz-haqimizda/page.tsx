import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biz haqimizda",
  description: "Islomx7 onlayn katalogi haqida ma'lumot va biz bilan bog'lanish yo'llari.",
  openGraph: { url: "https://group-13-main-zeta.vercel.app/biz-haqimizda", title: "Biz haqimizda | Islomx7", description: "Islomx7 onlayn katalogi haqida ma'lumot." },
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9ca3af]">Islomx7</p>
      <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Biz haqimizda</h1>
      <p className="mt-6 max-w-2xl leading-7 text-[#a3a3a3]">Islomx7 — mahsulotlarni izlash va ular haqidagi ma&apos;lumotlarni ko&apos;rish uchun yaratilgan onlayn katalog. Katalogdan foydalanish yoki savollar bo&apos;yicha biz bilan bog&apos;laning.</p>
    </section>
  );
}
