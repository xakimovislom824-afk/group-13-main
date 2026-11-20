export default function TulovSahifasi() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 font-sans text-[#333]">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-gray-400 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="hover:text-blue-600 cursor-pointer transition-colors">Islomx7</span>
        <span>/</span>
        <span className="text-gray-500">To&apos;lov usullari</span>
      </nav>
      <div className="flex flex-col lg:flex-row gap-10">

        <section aria-labelledby="payment-info" className="flex-1 text-[14px] leading-7">
          <h1 id="payment-info" className="mb-4 text-2xl font-bold text-[var(--text)]">To&apos;lov haqida</h1>
          <div role="status" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--text-muted)] shadow-sm sm:p-6">
            <p className="font-semibold text-[var(--text)]">Sayt hozirda demo katalog sifatida ishlaydi.</p>
            <p className="mt-3">Mahsulotlarni ko&apos;rish va savatga qo&apos;shish mumkin, ammo buyurtma yuborish yoki to&apos;lovni amalga oshirish tizimi ulanmagan.</p>
            <p className="mt-3">Karta, naqd pul yoki olib ketish orqali to&apos;lov hozircha qo&apos;llab-quvvatlanmaydi. To&apos;lov ma&apos;lumotlarini kiritmang.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
