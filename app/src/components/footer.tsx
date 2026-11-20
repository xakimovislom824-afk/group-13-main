"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { useModal } from "../../context/ModalContext";
import { siteConfig } from "../../../lib/site-config";

const informationLinks = [
  ["Biz haqimizda", "/biz-haqimizda"], ["Yetkazib berish", "/yetkazibBerish"],
  ["To'lov", "/tulov"], ["Savol-javob", "/savolJavob"], ["Qaytarish va kafolat", "/qaytarish-va-kafolat"],
  ["Yangiliklar", "/blog"], ["Aloqa", "/aloqa"],
];

export default function Footer() {
  const { openModal } = useModal();
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo inverse />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">Mahsulotlarni qidirish, ko&apos;rish va brauzerdagi savatga saqlash uchun Islomx7 onlayn katalogi.</p>
            {(siteConfig.telegram || siteConfig.instagram) && <div className="mt-5 flex gap-3 text-sm">
              {siteConfig.telegram && <a className="rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10" href={siteConfig.telegram} target="_blank" rel="noreferrer">Telegram</a>}
              {siteConfig.instagram && <a className="rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10" href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            </div>}
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
              {siteConfig.phone && <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`} className="hover:text-white">{siteConfig.phone}</a>}
              {siteConfig.email && <a href={`mailto:${siteConfig.email}`} className="hover:text-white">{siteConfig.email}</a>}
              {siteConfig.address && <><span>{siteConfig.address}</span><a className="text-[var(--accent)] underline underline-offset-4" href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`} target="_blank" rel="noreferrer">Xaritada ko&apos;rish</a></>}
              {siteConfig.hours && <span>{siteConfig.hours}</span>}
              {!siteConfig.phone && !siteConfig.email && <p className="text-slate-300">Rasmiy telefon va elektron pochta ma&apos;lumotlari hozircha kiritilmagan.</p>}
              <button onClick={openModal} className="w-fit rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold text-[var(--primary)] hover:bg-[var(--accent-hover)]">Qo&apos;ng&apos;iroq so&apos;rash</button>
            </address>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-white/15 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.copyright}</p><Link href="/xafsizlik" className="hover:text-white">Maxfiylik siyosati</Link>
        </div>
      </div>
    </footer>
  );
}
