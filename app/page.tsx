import Link from "next/link";
import { ArrowRight, Hammer, Package, Search, ShoppingCart, Star } from "lucide-react";
import HomAksiya from "../components/homAksiya";
import Tabs1 from "../components/engKopSotilganlar";
import StoreMarquee from "../components/StoreMarquee";
import Tabs2 from "../components/engYaxshiTakliflar";
import SungiYangliklar from "../components/homYanglik";

const benefits = [
  { label: "Mahsulot katalogi", icon: Package },
  { label: "API orqali qidiruv", icon: Search },
  { label: "Reyting va mavjudlik", icon: Star },
  { label: "Savat brauzeringizda saqlanadi", icon: ShoppingCart },
];

export default function Home() {
  return (
      <div className="bg-[var(--background)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[#10345b] to-[#0e7c86] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-300">Islomx7 · onlayn katalog</span>
            <h1 className="mt-5 font-[family-name:var(--font-manrope)] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Kerakli mahsulotlarni bir joydan toping</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">Haqiqiy mahsulot ma&apos;lumotlarini qidiring, solishtiring va savatingizga qo&apos;shing. Demo API buyurtma yoki to&apos;lovni amalga oshirmaydi.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/katalog" className="inline-flex min-h-12 items-center gap-2 rounded-[10px] bg-[var(--accent)] px-5 font-bold text-[var(--primary)] transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Katalogga o&apos;tish <ArrowRight size={18} /></Link>
              <Link href="/aksiyalar" className="inline-flex min-h-12 items-center rounded-[10px] border border-white/40 px-5 font-semibold text-white transition-colors hover:bg-white/10">Aksiyalarni ko&apos;rish</Link>
            </div>
          </div>
          <div className="hidden min-h-64 items-center justify-center lg:flex" aria-hidden="true">
            <div className="grid size-64 place-items-center rounded-full border border-white/15 bg-white/5 shadow-2xl shadow-black/20"><div className="grid size-48 place-items-center rounded-full border border-amber-300/30 bg-amber-300/10"><Hammer className="size-20 text-amber-300" strokeWidth={1.3} /></div></div>
          </div>
        </div>
      </section>
      <section aria-label="Xizmatlar afzalliklari" className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
        {benefits.map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"><Icon className="shrink-0 text-[var(--secondary)]" size={22} /><span className="text-sm font-semibold text-[var(--text)]">{label}</span></div>)}
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><HomAksiya /><Tabs1 /><StoreMarquee /><Tabs2 /><SungiYangliklar /></div>
      </div>
  );
}
