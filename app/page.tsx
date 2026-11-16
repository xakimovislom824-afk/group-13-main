import Link from "next/link";
import { ArrowRight, CreditCard, Hammer, House, Lamp, Package, Percent, Truck, Wrench, Zap, Bath } from "lucide-react";
import { categories } from "../lib/site-config";
import HomAksiya from "../components/homAksiya";
import Tabs1 from "../components/engKopSotilganlar";
import Tabs2 from "../components/engYaxshiTakliflar";
import SungiYangliklar from "../components/homYanglik";

const icons = [Hammer, Wrench, Zap, Bath, House, Package, Lamp];
const benefits = [
  { label: "Istalgan usulda to'lov", icon: CreditCard },
  { label: "Tezkor yetkazib berish", icon: Truck },
  { label: "Keng tanlov", icon: Package },
  { label: "Yirik xaridlarga chegirma", icon: Percent },
];

export default function Home() {
  return (
    <main className="bg-[var(--background)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[#10345b] to-[#0e7c86] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-300">Islomx7 · ta&apos;mir va qurilish</span>
            <h1 className="mt-5 font-[family-name:var(--font-manrope)] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Qurilish va ta&apos;mir uchun hamma narsa bir joyda</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">Loyihangiz uchun kerakli mahsulotlarni toping, qulay usulda to&apos;lang va manzilingizga yetkazib oling.</p>
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
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-[var(--secondary)]">Islomx7 katalogi</p><h2 className="mt-1 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[var(--primary)] sm:text-3xl">Bo&apos;limlar</h2></div><Link href="/katalog" className="text-sm font-semibold text-[var(--secondary)] hover:underline">Barcha mahsulotlar <ArrowRight className="ml-1 inline" size={16} /></Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((category, index) => { const Icon = icons[index] ?? Package; return <Link key={category.href} href={category.href} className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--secondary)] hover:shadow-[var(--card-shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--secondary)]"><span className="mb-4 grid size-11 place-items-center rounded-lg bg-[var(--secondary-soft)] text-[var(--secondary)] transition-colors group-hover:bg-[var(--secondary)] group-hover:text-white"><Icon size={22} /></span><span className="text-sm font-bold text-[var(--text)]">{category.label}</span></Link>; })}
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><HomAksiya /><Tabs1 /><Tabs2 /><SungiYangliklar /></div>
    </main>
  );
}
