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

export const formatPrice = (value: number | string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(value) || 0);
