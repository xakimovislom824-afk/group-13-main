import Link from "next/link";
import { ArrowRight, Compass, PackageCheck, Search } from "lucide-react";
import { siteConfig } from "../../lib/site-config";

const highlights = [
  { icon: Search, title: "Qidirish", text: "Katalogdan mahsulotlarni toping va ko‘rib chiqing." },
  { icon: PackageCheck, title: "Solishtirish", text: "Mahsulot tafsilotlari, narxi va reytingini bir joyda ko‘ring." },
  { icon: Compass, title: "Oson yo‘nalish", text: "Kategoriyalar va qidiruv orqali kerakli bo‘limga tez o‘ting." },
];

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--secondary)]">Islomx7 haqida</p>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div>
          <h1 className="max-w-3xl font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-5xl">Mahsulotlarni ko‘rish va topish uchun qulay katalog</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)]">Islomx7 mahsulot katalogi mahsulotlarni qidirish, ko‘rib chiqish va solishtirishga yordam beradi. Mahsulot ma’lumotlari katalog xizmatidan olinadi; sayt hozircha buyurtma yoki to‘lovni amalga oshirmaydi.</p>
          <Link href="/katalog" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-lg bg-[var(--primary)] px-5 font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]">Katalogni ko‘rish <ArrowRight size={18} /></Link>
        </div>
        <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
          <h2 className="text-lg font-bold text-[var(--text)]">Savolingiz bormi?</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Mahsulot, katalog yoki xizmatlar bo‘yicha bizga murojaat qiling.</p>
          <a href={`mailto:${siteConfig.email}`} className="mt-4 inline-flex min-h-10 items-center font-semibold text-[var(--secondary)] underline underline-offset-4">{siteConfig.email}</a>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{siteConfig.phone}</p>
        </aside>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {highlights.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <Icon className="size-6 text-[var(--secondary)]" aria-hidden="true" />
            <h2 className="mt-4 font-bold text-[var(--text)]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
