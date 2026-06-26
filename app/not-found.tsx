import Link from "next/link";
import BackButton from "./src/components/BackButton"; // yangi component

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center px-4 relative">

      {/* Breadcrumbs */}
      <div className="absolute top-8 left-4 md:left-20 lg:left-32 flex items-center gap-2 text-[12px] text-gray-400">
        <Link href="/" className="hover:text-gray-600">Stroyoptorg</Link>
        <span>/</span>
        <span className="text-gray-300">Sahifa topilmadi</span>
      </div>

      <div className="max-w-400 w-full text-center space-y-8">

        <h1 className="text-3xl md:text-4xl font-bold text-[#1A202C]">
          Sahifa topilmadi
        </h1>

        <div className="relative inline-block select-none">
          <span className="text-[160px] md:text-[250px] font-bold text-[#1E74D2] leading-none">
            404
          </span>
          <span className="absolute inset-0 text-[160px] md:text-[250px] font-bold text-[#1E74D2]/10 blur-md translate-x-2 translate-y-2 leading-none -z-10">
            404
          </span>
        </div>

        <p className="text-gray-500 text-sm md:text-[15px] max-w-lg mx-auto leading-relaxed px-4">
          So'ralgan sahifa topilmadi. Balki u o'chirilgan bo'lishi yoki manzili o'zgartirilgan bo'lishi mumkin. Qidiruvdan foydalanib ko'ring.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-6">
          <BackButton />
          <Link href="/" className="w-full sm:w-64">
            <div className="w-full py-4 bg-[#1E74D2] text-white font-bold text-[11px] uppercase tracking-[2px] hover:bg-blue-700 transition-all shadow-md rounded-sm text-center">
              Bosh sahifaga
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}