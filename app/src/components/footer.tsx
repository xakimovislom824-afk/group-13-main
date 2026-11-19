import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { siteConfig } from "../../../lib/site-config";

const footerLinks = [
  ["Bosh sahifa", "/"],
  ["Mahsulotlar", "/katalog"],
  ["Savatcha", "/savatcha"],
  ["Saralangan", "/wishlist"],
  ["Kirish", "/kirish"],
  ["Yetkazib berish", "/yetkazib-berish"],
  ["To'lov", "/tolov"],
  ["Aloqa", "/aloqa"],
  ["Biz haqimizda", "/biz-haqimizda"],
  ["Maxfiylik siyosati", "/maxfiylik-siyosati"],
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[#222] bg-[#080808] text-[#d4d4d4]">
      <div className="mx-auto grid max-w-[1508px] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" aria-label="Islomx7 bosh sahifasi" className="inline-flex rounded-sm bg-black">
            <Image src="/logo.png" alt="Islomx7 logo" width={320} height={100} className="h-9 w-auto object-contain md:h-11" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#8a8a8a]">Islomx7 — kerakli mahsulotlarni topish va ko&apos;rish uchun qulay onlayn katalog.</p>
          <div className="mt-5 flex gap-3">
            <a href={siteConfig.telegram} target="_blank" rel="noreferrer" aria-label="Telegram — Islomx7" className="flex size-10 items-center justify-center rounded-xl border border-[#292929] text-[#d4d4d4] transition hover:border-[#bfc3ca] hover:text-white"><FaTelegramPlane size={18} /></a>
            <a href={siteConfig.instagram} target="_blank" rel="noreferrer" aria-label="Instagram — Islomx7" className="flex size-10 items-center justify-center rounded-xl border border-[#292929] text-[#d4d4d4] transition hover:border-[#bfc3ca] hover:text-white"><FaInstagram size={18} /></a>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-white">Sahifalar</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {footerLinks.map(([label, href]) => <li key={href}><Link className="text-[#8a8a8a] transition hover:text-white" href={href}>{label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-white">Aloqa</h2>
          <address className="mt-4 flex flex-col gap-3 text-sm not-italic text-[#8a8a8a]">
            <a href={`mailto:${siteConfig.email}`} className="transition hover:text-white">{siteConfig.email}</a>
            <span>{siteConfig.address}</span>
          </address>
        </div>
      </div>
      <div className="border-t border-[#222] px-4 py-5 text-center text-xs text-[#777]">{siteConfig.copyright}</div>
    </footer>
  );
}
