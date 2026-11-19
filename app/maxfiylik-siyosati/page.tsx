import Link from "next/link";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <nav aria-label="Sahifa yo'li" className="mb-5 text-sm text-[#8a8a8a]">
        <Link href="/" className="transition hover:text-white">Bosh sahifa</Link><span className="mx-2">/</span><span className="text-[#d4d4d4]">Maxfiylik siyosati</span>
      </nav>
      <h1 className="text-3xl font-semibold text-white sm:text-4xl">Maxfiylik siyosati</h1>
      <div className="mt-7 flex flex-col gap-6 leading-7 text-[#a3a3a3]">
        <p>Ushbu sahifada Islomx7 saytida taqdim etilgan xizmatlardan foydalanish jarayonidagi shaxsiy ma&apos;lumotlarga oid umumiy ma&apos;lumot beriladi.</p>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">Qanday ma&apos;lumotlar yuboriladi?</h2>
          <p>Hisobga kirish yoki aloqa shakllaridan foydalanishda siz kiritgan ma&apos;lumotlar tegishli xizmatni ko&apos;rsatish uchun qayta ishlanishi mumkin. Mahsulot katalogi ma&apos;lumotlari tashqi manbadan olinadi.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">Ma&apos;lumotlar bo&apos;yicha murojaat</h2>
          <p>Ma&apos;lumotlaringizga oid savol yoki so&apos;rovlar uchun <a className="text-[#d4d4d4] underline underline-offset-4 hover:text-white" href="mailto:info@islomx7.uz">info@islomx7.uz</a> manziliga yozing.</p>
        </section>
        <p className="text-sm text-[#777]">Saytdagi xizmatlar o&apos;zgarganda ushbu siyosat ham yangilanishi mumkin.</p>
      </div>
    </article>
  );
}
