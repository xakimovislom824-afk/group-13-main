import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "../app/src/components/navbar";
import Footer from "../app/src/components/footer";
import { ModalProvider } from "../app/context/ModalContext";
import CallbackModalWrapper from "../app/src/components/CallbackModalWrapper";
import Providers from "../store/providers";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://group-13-main-zeta.vercel.app"),

  title: {
    default: "Islomx7 — Onlayn do'kon",
    template: "%s | Islomx7",
  },

  description:
    "Islomx7 — O'zbekistondagi onlayn do'kon. Qurilish materiallari, elektr asboblari va uy uchun kerakli mahsulotlarni onlayn xarid qiling.",

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
      className={`${ geistSans.variable } ${ geistMono.variable } h - full antialiased`}
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

