export const siteConfig = {
  name: "Islomx7",
  url: "https://group-13-main-zeta.vercel.app",
  phone: "",
  email: "",
  address: "",
  hours: "",
  telegram: "",
  instagram: "",
  copyright: "© 2026 Islomx7. Barcha huquqlar himoyalangan.",
};

export const formatPrice = (value: number | string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(value) || 0);
