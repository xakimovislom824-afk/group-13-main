"use client";

import Link from "next/link";
import Image from "next/image";
import { useModal } from "../../context/ModalContext";
import { siteConfig } from "../../../lib/site-config";

const informationLinks = [
  ["Biz haqimizda", "/biz-haqimizda"], ["Yetkazib berish", "/yetkazib-berish"],
  ["To'lov", "/tolov"], ["Savol-javob", "/savol-javob"], ["Qaytarish va kafolat", "/qaytarish-va-kafolat"],
  ["Yangiliklar", "/blog"], ["Aloqa", "/aloqa"],
];

export default function Footer() {
  const { openModal } = useModal();
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label="Islomx7 bosh sahifasi" className="inline-flex items-center rounded-xl bg-black px-3 py-1.5">
              <Image src="/logo.png" alt="Islomx7 logo" width={160} height={40} className="h-8 w-auto object-contain md:h-10" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">Mahsulotlarni qidirish, ko&apos;rish va brauzerdagi savatga saqlash uchun Islomx7 onlayn katalogi.</p>
            <div className="mt-5 flex gap-3 text-sm">
              <a className="rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10" href={siteConfig.telegram} target="_blank" rel="noreferrer">Telegram</a>
              <a className="rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10" href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-white">Ma&apos;lumot</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm">{informationLinks.map(([label, href]) => <li key={href}><Link className="hover:text-[var(--accent)]" href={href}>{label}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="font-bold text-white">Katalog</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm"><li><Link className="hover:text-[var(--accent)]" href="/katalog">Barcha mahsulotlar</Link></li></ul>
          </div>
          <div>
            <h2 className="font-bold text-white">Aloqa</h2>
            <address className="mt-4 flex flex-col gap-3 text-sm not-italic">
              <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`} className="hover:text-white">{siteConfig.phone}</a>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">{siteConfig.email}</a>
              <span>{siteConfig.address}</span><span>{siteConfig.hours}</span>
              <a className="text-[var(--accent)] underline underline-offset-4" href="https://maps.google.com/?q=Chilonzor+Toshkent" target="_blank" rel="noreferrer">Xaritada ko&apos;rish</a>
              <button onClick={openModal} className="w-fit rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold text-[var(--primary)] hover:bg-[var(--accent-hover)]">Qo&apos;ng&apos;iroq so&apos;rash</button>
            </address>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-white/15 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.copyright}</p><Link href="/maxfiylik-siyosati" className="hover:text-white">Maxfiylik siyosati</Link>
        </div>
      </div>
    </footer>
  );
}
