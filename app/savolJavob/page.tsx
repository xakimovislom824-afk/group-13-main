import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import FAQAccordion from "../src/components/FAQAccordion";

export default function SavolJavob() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--secondary)]">Bosh sahifa</Link><span aria-hidden="true" className="mx-2">/</span><span className="text-[var(--text)]">Savol-javob</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
        <div>
          <div className="mb-7 flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)]"><HelpCircle size={22} aria-hidden="true" /></span>
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--secondary)]">Yordam markazi</p><h1 className="mt-1 font-[family-name:var(--font-manrope)] text-3xl font-extrabold text-[var(--text)] sm:text-4xl">Savol-javob</h1></div>
          </div>
          <FAQAccordion />
        </div>
        <aside className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-6">
          <h2 className="text-lg font-bold text-[var(--text)]">Javob topilmadimi?</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Savolingizni bizga yuboring, mavjud ma’lumotlar asosida yordam beramiz.</p>
          <Link href="/aloqa" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--secondary)] hover:underline">Aloqa sahifasi <ArrowRight size={16} /></Link>
        </aside>
      </div>
    </section>
  );
}
