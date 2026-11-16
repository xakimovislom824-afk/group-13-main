import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { siteConfig } from "../lib/site-config";
import "./globals.css";

import Navbar from "../app/src/components/navbar";
import Footer from "../app/src/components/footer";
import { ModalProvider } from "../app/context/ModalContext";
import CallbackModalWrapper from "../app/src/components/CallbackModalWrapper";
import Providers from "../store/providers";
import { ToastContainer } from "react-toastify";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "Islomx7 — Qurilish va uy uchun onlayn do'kon",
    template: "%s | Islomx7",
  },

  description:
    "Qurilish materiallari, ta'mirlash asboblari va uy jihozlarini Islomx7 dan qulay narxlarda xarid qiling. Toshkent bo'ylab tezkor yetkazib berish.",

  keywords: [
    "Islomx7",
    "onlayn do'kon",
    "online do'kon",
    "internet do'kon",
    "O'zbekiston onlayn do'koni",
    "qurilish materiallari",
    "elektr asboblari",
    "uy jihozlari",
    "mahsulotlar",
    "Toshkent",
    "O'zbekiston",
  ],

  authors: [
    {
      name: "Islomx7",
    },
  ],

  creator: "Islomx7",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://group-13-main-zeta.vercel.app",
    siteName: "Islomx7",
    title: "Islomx7 — Onlayn do'kon",
    description:
      "Qurilish materiallari, elektr asboblari va uy uchun kerakli mahsulotlarni onlayn xarid qiling.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Islomx7 — Onlayn do'kon",
    description:
      "O'zbekistondagi onlayn do'kon. Kerakli mahsulotlarni onlayn xarid qiling.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} ${manrope.variable} min-h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col items-center">
        <ModalProvider>
          <Providers>
            <ToastContainer position="top-right" autoClose={2000} />

            <div className="w-full max-w-[1508px] mx-auto flex flex-col min-h-screen">
              <Navbar />

              <main className="flex-grow">
                {children}
              </main>

              <CallbackModalWrapper />

              <Footer />
            </div>
          </Providers>
        </ModalProvider>
      </body>
    </html>
  );
}

