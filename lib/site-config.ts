export const siteConfig = {
  name: "Islomx7",
  url: "https://group-13-main-zeta.vercel.app",
  phone: "+998 90 123 45 67",
  email: "info@islomx7.uz",
  address: "Toshkent sh., Chilonzor tumani, 1-uy",
  hours: "Har kuni, 8:00 dan 18:00 gacha",
  telegram: "https://t.me/islomx7",
  instagram: "https://instagram.com/islomx7",
  copyright: "© 2026 Islomx7. Barcha huquqlar himoyalangan.",
};

export const categories = [
  { label: "Qurilish materiallari", href: "/katalog/qurilish-materiallari" },
  { label: "Asbob-uskunalar", href: "/katalog/asbob-uskunalar" },
  { label: "Elektr jihozlari", href: "/katalog/elektr" },
  { label: "Santexnika", href: "/katalog/santexnika" },
  { label: "Uy va bog'", href: "/katalog/uy-va-bog" },
  { label: "Mebel", href: "/katalog/mebel" },
  { label: "Yoritish", href: "/katalog/yoritish" },
] as const;

export const formatPrice = (value: number | string) =>
  `${Math.round(Number(value) || 0).toLocaleString("fr-FR").replace(/\u202f/g, " ")} so'm`;
